import type { UserCoordinates } from '../types/location';
import type { Place, PlaceWithDistance } from '../types/place';
import { attachDistanceToPlaces } from '../utils/placeDistance';

const TRENDING_SECTION_LIMIT = 5;

function sortByRatingAndReviews(places: PlaceWithDistance[]): PlaceWithDistance[] {
  return [...places].sort(
    (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  );
}

function sortByReviewCount(places: PlaceWithDistance[]): PlaceWithDistance[] {
  return [...places].sort(
    (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating,
  );
}

export type TrendingPlaceSections = {
  trendingThisWeek: PlaceWithDistance[];
  topRated: PlaceWithDistance[];
  popularCafes: PlaceWithDistance[];
  bestRestaurants: PlaceWithDistance[];
  popularParks: PlaceWithDistance[];
};

export type TrendingSectionConfig = {
  key: keyof TrendingPlaceSections;
  title: string;
  places: PlaceWithDistance[];
};

export function getTrendingPlaceSections(
  places: Place[],
  userCoordinates: UserCoordinates | null,
): TrendingPlaceSections {
  const withDistance = attachDistanceToPlaces(places, userCoordinates);

  return {
    trendingThisWeek: sortByReviewCount(withDistance).slice(0, TRENDING_SECTION_LIMIT),
    topRated: sortByRatingAndReviews(withDistance).slice(0, TRENDING_SECTION_LIMIT),
    popularCafes: sortByRatingAndReviews(
      withDistance.filter((place) => place.category === 'Cafes'),
    ).slice(0, TRENDING_SECTION_LIMIT),
    bestRestaurants: sortByRatingAndReviews(
      withDistance.filter((place) => place.category === 'Restaurants'),
    ).slice(0, TRENDING_SECTION_LIMIT),
    popularParks: sortByRatingAndReviews(
      withDistance.filter((place) => place.category === 'Parks'),
    ).slice(0, TRENDING_SECTION_LIMIT),
  };
}

export function getTrendingSectionList(
  sections: TrendingPlaceSections,
): TrendingSectionConfig[] {
  return [
    { key: 'trendingThisWeek', title: '🔥 Trending This Week', places: sections.trendingThisWeek },
    { key: 'topRated', title: '⭐ Top Rated Places', places: sections.topRated },
    { key: 'popularCafes', title: '☕ Popular Cafes', places: sections.popularCafes },
    { key: 'bestRestaurants', title: '🍽 Best Restaurants', places: sections.bestRestaurants },
    { key: 'popularParks', title: '🌳 Popular Parks', places: sections.popularParks },
  ];
}
