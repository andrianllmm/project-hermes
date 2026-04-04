import 'server-only';

import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/supabase';

import type { ResidentDirectoryRow } from './types';

type ResidentRow = Tables<'residents_with_coords'>;

function compareResidents(
  left: ResidentDirectoryRow,
  right: ResidentDirectoryRow
) {
  const nameComparison = left.name.localeCompare(right.name, 'en', {
    sensitivity: 'base',
  });

  if (nameComparison !== 0) {
    return nameComparison;
  }

  return (
    new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function normalizeResident(row: ResidentRow): ResidentDirectoryRow | null {
  if (
    !row.id ||
    !row.name ||
    !row.platform ||
    !row.platform_user_id ||
    !row.thread_id ||
    !row.language ||
    !row.created_at ||
    typeof row.longitude !== 'number' ||
    typeof row.latitude !== 'number'
  ) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    platform: row.platform,
    platformUserId: row.platform_user_id,
    threadId: row.thread_id,
    language: row.language,
    createdAt: row.created_at,
    longitude: row.longitude,
    latitude: row.latitude,
  };
}

async function loadResidentDirectory() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('residents_with_coords')
    .select(
      'id, name, platform, platform_user_id, thread_id, language, created_at, longitude, latitude'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ResidentRow[])
    .map(normalizeResident)
    .filter((resident): resident is ResidentDirectoryRow => Boolean(resident))
    .sort(compareResidents);
}

export const getResidentDirectory = cache(loadResidentDirectory);
