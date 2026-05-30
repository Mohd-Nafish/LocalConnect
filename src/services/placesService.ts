import {
  CATEGORY_TO_GOOGLE_TYPE,
  NEARBY_RESULTS_PER_CATEGORY,
  NEARBY_SEARCH_RADIUS_METERS,
  PLACE_CATEGORIES,
  SEARCH_MIN_QUERY_LENGTH,
  TEXT_SEARCH_MAX_RESULTS,
} from '../constants/placeCategories';
import { getGooglePlacesApiKey } from '../config/env';
import type {
  GoogleNearbySearchResponse,
  GooglePlaceDetailsResponse,
  GooglePlaceResult,
  GooglePlaceReview,
} from '../types/googlePlaces';
import type { UserCoordinates } from '../types/location';
import type { Place, PlaceCategory, PlaceReview } from '../types/place';

const PLACES_API_BASE_URL = 'https://places.googleapis.com/v1';

const TEXT_SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.businessStatus',
  'places.types',
  'places.photos',
].join(',');

const NEARBY_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.businessStatus',
  'places.types',
  'places.photos',
].join(',');

const DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'currentOpeningHours',
  'businessStatus',
  'types',
  'photos',
  'editorialSummary',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'websiteUri',
  'reviews',
].join(',');

export class PlacesApiError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'PlacesApiError';
  }
}

type NearbySearchRequest = {
  includedTypes: string[];
  maxResultCount: number;
  locationRestriction: {
    circle: {
      center: UserCoordinates;
      radius: number;
    };
  };
};

type TextSearchRequest = {
  textQuery: string;
  maxResultCount: number;
  locationBias?: {
    circle: {
      center: UserCoordinates;
      radius: number;
    };
  };
};

export function buildPlacePhotoUrl(photoName: string, maxWidthPx = 800): string {
  const apiKey = getGooglePlacesApiKey();
  return `${PLACES_API_BASE_URL}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
}

async function placesApiRequest<T>(
  path: string,
  options: {
    method: 'GET' | 'POST';
    fieldMask: string;
    body?: unknown;
  },
): Promise<T> {
  const apiKey = getGooglePlacesApiKey();

  const response = await fetch(`${PLACES_API_BASE_URL}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': options.fieldMask,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new PlacesApiError(
      parsePlacesApiErrorMessage(response.status, errorBody),
      response.status,
    );
  }

  return (await response.json()) as T;
}

function parseAddressParts(formattedAddress: string): {
  neighborhood: string;
  city: string;
} {
  const parts = formattedAddress
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { neighborhood: 'Nearby', city: 'Unknown' };
  }

  if (parts.length === 1) {
    return { neighborhood: parts[0], city: 'Unknown' };
  }

  return {
    neighborhood: parts[0],
    city: parts[parts.length - 2] ?? parts[parts.length - 1],
  };
}

function normalizePlaceId(placeId: string): string {
  return placeId.startsWith('places/') ? placeId.replace('places/', '') : placeId;
}

function resolveIsOpen(place: GooglePlaceResult): boolean {
  if (place.currentOpeningHours?.openNow !== undefined) {
    return place.currentOpeningHours.openNow;
  }

  return place.businessStatus !== 'CLOSED_PERMANENTLY';
}

function resolvePhotoUrl(googlePlace: GooglePlaceResult): string | undefined {
  const photoName = googlePlace.photos?.[0]?.name;
  if (!photoName) {
    return undefined;
  }

  return buildPlacePhotoUrl(photoName);
}

function mapGoogleReviews(reviews: GooglePlaceReview[] | undefined): PlaceReview[] {
  return (reviews ?? [])
    .map((review, index) => {
      const text = review.text?.text?.trim();
      const authorName = review.authorAttribution?.displayName?.trim();

      if (!text || !authorName || review.rating === undefined) {
        return null;
      }

      return {
        id: review.name ?? `${authorName}-${index}`,
        authorName,
        rating: review.rating,
        text,
        relativeTime: review.relativePublishTimeDescription ?? 'Recently',
      };
    })
    .filter((review): review is PlaceReview => review !== null);
}

function mapGooglePlaceToPlace(
  googlePlace: GooglePlaceResult,
  category: PlaceCategory,
  options?: {
    descriptionOverride?: string;
    includeReviews?: boolean;
  },
): Place | null {
  if (!googlePlace.location) {
    return null;
  }

  const name = googlePlace.displayName?.text?.trim();
  const address = googlePlace.formattedAddress?.trim();

  if (!name || !address) {
    return null;
  }

  const { neighborhood, city } = parseAddressParts(address);

  return {
    id: normalizePlaceId(googlePlace.id),
    name,
    address,
    neighborhood,
    city,
    latitude: googlePlace.location.latitude,
    longitude: googlePlace.location.longitude,
    rating: googlePlace.rating ?? 0,
    reviewCount: googlePlace.userRatingCount ?? 0,
    category,
    description:
      options?.descriptionOverride ?? `Discover ${name} in ${neighborhood}, ${city}.`,
    isOpen: resolveIsOpen(googlePlace),
    photoUrl: resolvePhotoUrl(googlePlace),
    phone: googlePlace.internationalPhoneNumber ?? googlePlace.nationalPhoneNumber,
    website: googlePlace.websiteUri,
    reviews: options?.includeReviews ? mapGoogleReviews(googlePlace.reviews) : [],
  };
}

export async function fetchNearbyPlacesByCategory(
  coordinates: UserCoordinates,
  category: PlaceCategory,
): Promise<Place[]> {
  const body: NearbySearchRequest = {
    includedTypes: [CATEGORY_TO_GOOGLE_TYPE[category]],
    maxResultCount: NEARBY_RESULTS_PER_CATEGORY,
    locationRestriction: {
      circle: {
        center: coordinates,
        radius: NEARBY_SEARCH_RADIUS_METERS,
      },
    },
  };

  const response = await placesApiRequest<GoogleNearbySearchResponse>(
    '/places:searchNearby',
    {
      method: 'POST',
      fieldMask: NEARBY_FIELD_MASK,
      body,
    },
  );

  return (response.places ?? [])
    .map((place) => mapGooglePlaceToPlace(place, category))
    .filter((place): place is Place => place !== null);
}

export async function fetchAllNearbyPlaces(
  coordinates: UserCoordinates,
): Promise<Place[]> {
  const results = await Promise.all(
    PLACE_CATEGORIES.map((category) =>
      fetchNearbyPlacesByCategory(coordinates, category),
    ),
  );

  const uniquePlaces = new Map<string, Place>();

  for (const places of results) {
    for (const place of places) {
      if (!uniquePlaces.has(place.id)) {
        uniquePlaces.set(place.id, place);
      }
    }
  }

  return Array.from(uniquePlaces.values());
}

export async function searchPlacesByText(
  query: string,
  coordinates: UserCoordinates,
): Promise<Place[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
    return [];
  }

  const body: TextSearchRequest = {
    textQuery: trimmedQuery,
    maxResultCount: TEXT_SEARCH_MAX_RESULTS,
    locationBias: {
      circle: {
        center: coordinates,
        radius: NEARBY_SEARCH_RADIUS_METERS,
      },
    },
  };

  const response = await placesApiRequest<GoogleNearbySearchResponse>(
    '/places:searchText',
    {
      method: 'POST',
      fieldMask: TEXT_SEARCH_FIELD_MASK,
      body,
    },
  );

  return (response.places ?? [])
    .map((place) =>
      mapGooglePlaceToPlace(place, inferCategoryFromTypes(place.types ?? [])),
    )
    .filter((place): place is Place => place !== null);
}

export async function fetchPlaceDetails(placeId: string): Promise<Place | null> {
  const normalizedId = normalizePlaceId(placeId);
  const resourceName = `places/${normalizedId}`;

  const response = await placesApiRequest<GooglePlaceDetailsResponse>(
    `/${resourceName}`,
    {
      method: 'GET',
      fieldMask: DETAILS_FIELD_MASK,
    },
  );

  const category = inferCategoryFromTypes(response.types ?? []);
  const description = response.editorialSummary?.text?.trim();

  return mapGooglePlaceToPlace(
    {
      ...response,
      id: response.id ?? resourceName,
    },
    category,
    {
      descriptionOverride: description,
      includeReviews: true,
    },
  );
}

function inferCategoryFromTypes(types: string[]): PlaceCategory {
  if (types.includes('cafe')) {
    return 'Cafes';
  }

  if (types.includes('hospital')) {
    return 'Hospitals';
  }

  if (types.includes('park')) {
    return 'Parks';
  }

  if (types.includes('atm')) {
    return 'ATMs';
  }

  return 'Restaurants';
}

function parsePlacesApiErrorMessage(status: number, errorBody: string): string {
  if (status === 403) {
    return 'Google Places API access denied. Check your API key and enable Places API (New).';
  }

  if (status === 400) {
    return 'Invalid Google Places API request. Verify your API configuration.';
  }

  if (status >= 500) {
    return 'Google Places service is temporarily unavailable. Please try again.';
  }

  return errorBody || 'Unable to load nearby places. Please try again.';
}
