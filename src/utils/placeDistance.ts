import { calculateDistanceKm } from './distance';
import type { UserCoordinates } from '../types/location';
import type { Place, PlaceWithDistance } from '../types/place';

export function attachDistanceToPlaces(
  places: Place[],
  userCoordinates: UserCoordinates | null,
): PlaceWithDistance[] {
  return places.map((place) => ({
    ...place,
    distanceKm: userCoordinates
      ? calculateDistanceKm(userCoordinates, {
          latitude: place.latitude,
          longitude: place.longitude,
        })
      : null,
  }));
}
