export type PlaceCategory =
  | 'Restaurants'
  | 'Cafes'
  | 'Hospitals'
  | 'ATMs'
  | 'Parks';

export type PlaceReview = {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type Place = {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  category: PlaceCategory;
  description: string;
  isOpen: boolean;
  photoUrl?: string;
  phone?: string;
  website?: string;
  reviews: PlaceReview[];
};

export type PlaceWithDistance = Place & {
  distanceKm: number | null;
};
