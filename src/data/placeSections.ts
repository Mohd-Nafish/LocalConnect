import type { UserCoordinates } from '../types/location';
import type { Place, PlaceCategory, PlaceWithDistance } from '../types/place';
import { attachDistanceToPlaces } from '../utils/placeDistance';

function filterByCategory(
  places: PlaceWithDistance[],
  category: PlaceCategory | null,
): PlaceWithDistance[] {
  if (!category) {
    return places;
  }

  return places.filter((place) => place.category === category);
}

export type HomePlaceSections = {
  featured: PlaceWithDistance[];
  popularNearby: PlaceWithDistance[];
  trendingThisWeek: PlaceWithDistance[];
  topRated: PlaceWithDistance[];
};

export function getHomePlaceSections(
  places: Place[],
  userCoordinates: UserCoordinates | null,
  selectedCategory: PlaceCategory | null = null,
): HomePlaceSections {
  const withDistance = attachDistanceToPlaces(places, userCoordinates);
  const filtered = filterByCategory(withDistance, selectedCategory);

  const featured = [...filtered]
    .filter((place) => place.rating >= 4.3 && place.reviewCount >= 50)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6);

  const popularNearby = [...filtered]
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    .slice(0, 5);

  const trendingThisWeek = [...filtered]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  const topRated = [...filtered]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return {
    featured,
    popularNearby,
    trendingThisWeek,
    topRated,
  };
}
