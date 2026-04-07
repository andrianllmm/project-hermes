'use client';

import {
  REALTIME_SUBSCRIBE_STATES,
  type RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { IncidentMapSceneShell } from '@/components/control-center/map/incident-map-scene-shell';
import {
  type DestinationMarker,
  type IncidentMarker,
} from '@/components/control-center/map/interactive-map';
import { toCoordinates } from '@/lib/geo';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

const supabase = createClient();
const OPEN_STATUSES = ['new', 'validated', 'in_progress'] as const;
const OPEN_STATUS_SET = new Set<IncidentRow['status']>(OPEN_STATUSES);

type IncidentRow = Pick<
  Database['public']['Tables']['incidents']['Row'],
  | 'id'
  | 'description'
  | 'incident_time'
  | 'location'
  | 'location_description'
  | 'severity'
  | 'status'
>;

function toIncidentMarker(incident: IncidentRow): IncidentMarker | null {
  const { longitude, latitude } = toCoordinates(incident.location);

  if (longitude === null || latitude === null) {
    return null;
  }

  return {
    id: incident.id,
    longitude,
    latitude,
    label:
      incident.location_description ??
      `${String(incident.severity ?? 'unknown').toUpperCase()} · ${String(incident.status ?? 'unknown').replace('_', ' ')}`,
    severity: incident.severity,
    status: incident.status,
    description: incident.description,
    incidentTime: incident.incident_time,
  };
}

function upsertMarker(
  current: IncidentMarker[],
  next: IncidentMarker
): IncidentMarker[] {
  const existingIndex = current.findIndex((marker) => marker.id === next.id);
  if (existingIndex === -1) {
    return [next, ...current];
  }

  const copy = [...current];
  copy[existingIndex] = next;
  return copy;
}

function isOpenStatus(
  status: IncidentRow['status'] | null | undefined
): boolean {
  return Boolean(status && OPEN_STATUS_SET.has(status));
}

export function RealtimeIncidentMapDemo({
  initialMarkers,
  destination,
}: {
  initialMarkers: IncidentMarker[];
  destination: DestinationMarker;
}) {
  const [markers, setMarkers] = useState<IncidentMarker[]>(initialMarkers);

  useEffect(() => {
    let isMounted = true;

    const handleChange = (
      payload: RealtimePostgresChangesPayload<IncidentRow>
    ) => {
      if (!isMounted) {
        return;
      }

      if (payload.eventType === 'DELETE') {
        const deletedId = payload.old.id;
        if (!deletedId) {
          return;
        }

        setMarkers((current) =>
          current.filter((marker) => marker.id !== deletedId)
        );
        return;
      }

      const nextIncident = payload.new;
      if (!nextIncident?.id) {
        return;
      }

      if (!isOpenStatus(nextIncident.status)) {
        setMarkers((current) =>
          current.filter((marker) => marker.id !== nextIncident.id)
        );
        return;
      }

      const nextMarker = toIncidentMarker(nextIncident);
      if (!nextMarker) {
        setMarkers((current) =>
          current.filter((marker) => marker.id !== nextIncident.id)
        );
        return;
      }

      setMarkers((current) => upsertMarker(current, nextMarker));
    };

    const channel = supabase
      .channel(`landing-incidents-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
        },
        handleChange
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }
      });

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <IncidentMapSceneShell
      embedded
      markers={markers}
      destination={destination}
    />
  );
}
