'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import IncidentButton from './incident-entry';

function getReportData() {
  // TODO: replace function to fetch content from database
  const entry = [];
  for (let i: number = 0; i < 50; i++) {
    // replace id with the report string
    entry.push(<IncidentButton id={i.toString()} />);
  }

  return entry;
}

export function IncidentList() {
  return (
    // NOTE: refactor max-h to use relative measurements. might cause bugs in current state
    <ScrollArea className={`h-full w-full rounded-md`}>
      <div className="p-4">
        {getReportData().map((entry) => (
          <React.Fragment key={entry.props.id}>
            <div className="text-sm">{entry}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
