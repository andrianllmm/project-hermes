import { ThreadImpl, deriveChannelId } from 'chat';

import { requireRole } from '@/lib/auth/dal';
import { adapters, state as botState } from '@/lib/bot/adapters';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/supabase';

type AdapterName = keyof typeof adapters;

type ThreadMessageResponse = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

const MESSAGE_HISTORY_LIMIT = 100;

export async function GET(
  _request: Request,
  context: RouteContext<'/api/incidents/[incidentId]/thread-messages'>
) {
  await requireRole(['responder', 'admin', 'super_admin']);

  const { incidentId } = await context.params;

  if (!incidentId) {
    return Response.json(
      { error: 'Incident id is required.' },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: incident, error: incidentError } = await supabase
    .from('incidents')
    .select('reported_by')
    .eq('id', incidentId)
    .maybeSingle();

  if (incidentError) {
    return Response.json(
      { error: 'Failed to resolve incident.' },
      { status: 500 }
    );
  }

  if (!incident?.reported_by) {
    return Response.json({ messages: [] });
  }

  const { data: resident, error: residentError } = await supabase
    .from('residents')
    .select('thread_id, platform')
    .eq('id', incident.reported_by)
    .maybeSingle();

  if (residentError) {
    return Response.json(
      { error: 'Failed to resolve incident thread.' },
      { status: 500 }
    );
  }

  if (!resident?.thread_id) {
    return Response.json({ messages: [] });
  }

  const adapterName = resident.thread_id.split(':', 1)[0] as AdapterName;
  const adapter =
    adapters[adapterName] ??
    adapters[
      resident.platform as Database['public']['Enums']['resident_platform']
    ];

  if (!adapter) {
    return Response.json({ messages: [] });
  }

  const thread = new ThreadImpl({
    id: resident.thread_id,
    channelId: deriveChannelId(adapter, resident.thread_id),
    adapter,
    stateAdapter: botState,
    isDM: true,
  });

  const messages: ThreadMessageResponse[] = [];

  try {
    for await (const message of thread.allMessages) {
      if (!message.text || !message.text.trim()) {
        continue;
      }

      messages.push({
        id: message.id,
        content: message.text,
        role: message.author.isMe ? 'assistant' : 'user',
        timestamp: message.metadata.dateSent.toISOString(),
      });

      if (messages.length >= MESSAGE_HISTORY_LIMIT) {
        break;
      }
    }

    return Response.json({ messages });
  } catch (error) {
    console.error('Failed to fetch thread history for incident:', {
      incidentId,
      threadId: resident.thread_id,
      error,
    });

    return Response.json(
      { error: 'Failed to read thread history.' },
      { status: 500 }
    );
  }
}
