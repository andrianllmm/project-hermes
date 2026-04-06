import { HelpGuide } from '@/components/control-center/help-guide';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How HERMES Works - Project HERMES',
  description:
    'Responder guide to the full HERMES reporting, triage, operations, and advisory workflow.',
};

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
      <HelpGuide />
    </div>
  );
}
