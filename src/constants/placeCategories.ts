import type { PlaceCategory } from '../types/place';

export const PLACE_CATEGORIES: PlaceCategory[] = [
  'Restaurants',
  'Cafes',
  'Hospitals',
  'Parks',
  'ATMs',
];

export const CATEGORY_TO_GOOGLE_TYPE: Record<PlaceCategory, string> = {
  Restaurants: 'restaurant',
  Cafes: 'cafe',
  Hospitals: 'hospital',
  Parks: 'park',
  ATMs: 'atm',
};

export const NEARBY_SEARCH_RADIUS_METERS = 5000;
export const NEARBY_RESULTS_PER_CATEGORY = 10;
export const TEXT_SEARCH_MAX_RESULTS = 10;
export const SEARCH_MIN_QUERY_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 500;
