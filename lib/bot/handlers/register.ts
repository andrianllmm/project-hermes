import { BotInstance } from '@/lib/bot/chat';
import { pointToString } from '@/lib/geo';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  endOnboarding,
  postLanguagePrompt,
  postLocationPrompt,
  postNamePrompt,
  startOnboarding,
} from '../posts';
import { extractRawLocation } from '../utils';

export function registerMessageHandlers(bot: BotInstance) {
  bot.onNewMention(async (thread) => {
    await thread.subscribe();
    const supabase = createAdminClient();

    // Check if the user has already been onboarded
    const { data, error } = await supabase
      .from('residents')
      .select('thread_id')
      .eq('thread_id', thread.id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    if (data) {
      await thread.post('Welcome back!');
      await thread.setState({ step: 'idle' });
    } else {
      await startOnboarding(thread);
      await thread.setState({ step: 'awaiting_language' });
      await postLanguagePrompt(thread);
    }
  });

  bot.onSubscribedMessage(async (thread, message) => {
    const state = await thread.state;

    if (message.text === 'stop') {
      await thread.post('Goodbye!');
      await thread.unsubscribe();
      return;
    }

    switch (state?.step) {
      // Onboarding
      case 'awaiting_language':
        await thread.setState({ step: 'awaiting_name' });
        await postNamePrompt(thread);
        break;

      case 'awaiting_name':
        await thread.setState({ name: message.text });
        await thread.post(`Nice to meet you, ${message.text}!`);
        await thread.setState({ step: 'awaiting_location' });
        await postLocationPrompt(thread);
        break;

      case 'awaiting_location':
        const loc = extractRawLocation(message.raw);

        if (!loc) {
          await thread.post('Invalid location');
          await postLocationPrompt(thread);
          break;
        }

        await thread.setState({ location: loc });

        const finalState = await thread.state;

        if (
          !finalState?.name ||
          !finalState?.language ||
          !finalState?.location
        ) {
          console.error('Incomplete onboarding state:', finalState);
          await thread.post('Something went wrong. Please try again.');
          await thread.setState({ step: 'awaiting_name' });
          break;
        }

        const supabase = await createAdminClient();
        const { error } = await supabase.from('residents').insert({
          platform: thread.adapter.name,
          platform_user_id: message.author.userId,
          thread_id: thread.id,
          name: finalState.name,
          language: finalState.language,
          location: pointToString(finalState.location),
        });

        if (error) {
          console.error('Insert resident error:', error);
          await thread.post('Failed to save your data. Please try again.');
          break;
        }

        await thread.setState({ step: 'idle' });
        await endOnboarding(thread);

        break;

      case 'idle':
        await thread.post('Idle');
        break;

      default:
        await thread.post('Idle');
        await thread.setState({ step: 'idle' });
        break;
    }
  });

  bot.onAction('language_selection', async (event) => {
    const thread = event.thread;
    if (!thread) {
      return;
    }
    await thread.setState({ language: event.value });
    await thread.setState({ step: 'awaiting_name' });
    await postNamePrompt(thread);
  });
}
