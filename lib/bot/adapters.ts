import { createPostgresState } from '@chat-adapter/state-pg';
import { createTelegramAdapter } from '@chat-adapter/telegram';
import { createMessengerAdapter } from 'chat-adapter-messenger';
import { createWebDemoAdapter } from './adapters/web-demo';

const telegram = createTelegramAdapter({
  mode: 'webhook',
});

const messenger = createMessengerAdapter();
const webdemo = createWebDemoAdapter();

export const adapters = { telegram, messenger, webdemo };

export const state = createPostgresState();
