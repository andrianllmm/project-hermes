import { Point } from '@/types/geo';

export function extractRawLocation(raw: unknown): Point | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }

  const rawWithLocation = raw as {
    location?: { latitude?: number; longitude?: number };
  };

  const lat = rawWithLocation.location?.latitude;
  const lng = rawWithLocation.location?.longitude;
  if (typeof lat === 'number' && typeof lng === 'number') {
    return {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }

  return undefined;
}
