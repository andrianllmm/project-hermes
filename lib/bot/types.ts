import { Thread } from 'chat';
import { ThreadState } from './thread-state';

export type BotThread = Thread<ThreadState | unknown, unknown>;
