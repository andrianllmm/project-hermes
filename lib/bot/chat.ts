import { Chat } from 'chat';

import type { ThreadState } from '@/lib/bot/thread-state';
import { adapters, state } from './adapters';

export type BotInstance = Chat<typeof adapters, ThreadState>;

export function createBot(): BotInstance {
  return new Chat<typeof adapters, ThreadState>({
    userName: 'project_hermes_bot',
    adapters,
    state: state,
  });
}
