import { Point } from '@/types/geo';
import { Database } from '@/types/supabase';

export type ResidentLanguage = Database['public']['Enums']['resident_language'];

export type Step =
  | 'awaiting_language'
  | 'awaiting_name'
  | 'awaiting_location'
  | 'idle';

export interface ThreadState {
  step: Step;
  residentId?: string;
  language?: ResidentLanguage;
  location?: Point;
  name?: string;
}
