import type { Enums } from '@/types/supabase';

export type ResidentPlatform = Enums<'resident_platform'>;
export type ResidentLanguage = Enums<'resident_language'>;

export type ResidentDirectoryRow = {
  id: string;
  name: string;
  platform: ResidentPlatform;
  platformUserId: string;
  threadId: string;
  language: ResidentLanguage;
  createdAt: string;
  longitude: number;
  latitude: number;
};

export type ResidentDirectoryFilters = {
  query: string;
  platform: ResidentPlatform | 'all';
  language: ResidentLanguage | 'all';
};
