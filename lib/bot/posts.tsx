/** @jsxImportSource chat */
import { Actions, Button, Card, CardText } from 'chat';
import { BotThread } from './types';

export async function startOnboarding(thread: BotThread) {
  await thread.post(
    <Card title="Welcome to Project Hermes">
      <CardText>Let&apos;s get started!</CardText>
    </Card>
  );
}

export async function endOnboarding(thread: BotThread) {
  await thread.post(
    <Card title="Done!">
      <CardText>Thank you for using Project Hermes!</CardText>
    </Card>
  );
}

export async function postLanguagePrompt(thread: BotThread) {
  await thread.post(
    <Card title="Language">
      <CardText>What&apos;s your preferred language?</CardText>
      <Actions>
        <Button id="language_selection" value="eng">
          English
        </Button>
        <Button id="language_selection" value="fil">
          Filipino
        </Button>
      </Actions>
    </Card>
  );
}

export async function postNamePrompt(thread: BotThread) {
  await thread.post(
    <Card title="Name">
      <CardText>What&apos;s your name?</CardText>
    </Card>
  );
}

export async function postLocationPrompt(thread: BotThread) {
  await thread.post(
    <Card title="Location">
      <CardText>Where do you reside?</CardText>
    </Card>
  );
}
