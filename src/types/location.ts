export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export type LocationErrorReason = 'denied' | 'unavailable';

export type LocationResult =
  | { ok: true; coordinates: UserCoordinates }
  | { ok: false; reason: LocationErrorReason };

export type LocationAddress = {
  city: string;
  state: string;
  country: string;
  label: string;
};

export type UserLocationInfo = {
  coordinates: UserCoordinates;
  address: LocationAddress;
};

export type UserLocationResult =
  | { ok: true; location: UserLocationInfo }
  | { ok: false; reason: LocationErrorReason };

export type CurrentLocationState = {
  location: UserCoordinates | null;
  city: string | null;
  loading: boolean;
  error: LocationErrorReason | null;
  refreshLocation: () => Promise<void>;
};
