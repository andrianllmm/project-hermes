import { createBot } from './chat';
import { registerMessageHandlers as registerHandlers } from './handlers/register';

const bot = createBot();

registerHandlers(bot);

void bot.initialize();

export { bot };
