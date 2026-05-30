export type GooglePlaceDisplayName = {
  text: string;
  languageCode?: string;
};

export type GooglePlaceLocation = {
  latitude: number;
  longitude: number;
};

export type GooglePlaceOpeningHours = {
  openNow?: boolean;
};

export type GooglePlacePhoto = {
  name: string;
  widthPx?: number;
  heightPx?: number;
};

export type GooglePlaceReviewText = {
  text?: string;
  languageCode?: string;
};

export type GooglePlaceReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: GooglePlaceReviewText;
  authorAttribution?: {
    displayName?: string;
  };
};

export type GooglePlaceResult = {
  id: string;
  displayName?: GooglePlaceDisplayName;
  formattedAddress?: string;
  location?: GooglePlaceLocation;
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: GooglePlaceOpeningHours;
  businessStatus?: string;
  types?: string[];
  photos?: GooglePlacePhoto[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  reviews?: GooglePlaceReview[];
};

export type GoogleNearbySearchResponse = {
  places?: GooglePlaceResult[];
};

export type GooglePlaceDetailsResponse = GooglePlaceResult & {
  editorialSummary?: {
    text?: string;
  };
};
