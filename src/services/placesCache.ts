import type { UserCoordinates } from '../types/location';
import type { Place } from '../types/place';
import { fetchAllNearbyPlaces, fetchPlaceDetails } from './placesService';

const NEARBY_CACHE_TTL_MS = 5 * 60 * 1000;

type NearbyCacheEntry = {
  data: Place[];
  timestamp: number;
};

const nearbyCache = new Map<string, NearbyCacheEntry>();
const detailsCache = new Map<string, Promise<Place | null>>();

function getNearbyCacheKey(coordinates: UserCoordinates): string {
  return `${coordinates.latitude.toFixed(3)},${coordinates.longitude.toFixed(3)}`;
}

export function clearPlacesCache(): void {
  nearbyCache.clear();
  detailsCache.clear();
}

export async function getCachedNearbyPlaces(
  coordinates: UserCoordinates,
  forceRefresh = false,
): Promise<Place[]> {
  const cacheKey = getNearbyCacheKey(coordinates);

  if (!forceRefresh) {
    const cached = nearbyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < NEARBY_CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const places = await fetchAllNearbyPlaces(coordinates);
  nearbyCache.set(cacheKey, {
    data: places,
    timestamp: Date.now(),
  });

  for (const place of places) {
    detailsCache.set(place.id, Promise.resolve(place));
  }

  return places;
}

export function getCachedPlaceDetails(placeId: string): Promise<Place | null> {
  const cached = detailsCache.get(placeId);
  if (cached) {
    return cached;
  }

  const request = fetchPlaceDetails(placeId).then((details) => {
    if (details) {
      detailsCache.set(placeId, Promise.resolve(details));
    }
    return details;
  });

  detailsCache.set(placeId, request);
  return request;
}

export function primePlaceDetailsCache(place: Place): void {
  detailsCache.set(place.id, Promise.resolve(place));
}
