import * as Location from 'expo-location';

import type {
  LocationAddress,
  LocationResult,
  UserCoordinates,
  UserLocationInfo,
  UserLocationResult,
} from '../types/location';

function logCurrentLocation(coordinates: UserCoordinates): void {
  if (__DEV__) {
    console.log('Current Location:', coordinates.latitude, coordinates.longitude);
  }
}

export async function getCurrentUserLocation(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    return { ok: false, reason: 'unavailable' };
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coordinates: UserCoordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    logCurrentLocation(coordinates);

    return { ok: true, coordinates };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

function formatLocationAddress(
  place: Location.LocationGeocodedAddress,
): LocationAddress | null {
  const city = place.city ?? place.subregion ?? place.district ?? place.name;
  const state = place.region ?? '';
  const country = place.country ?? '';

  if (!city && !state && !country) {
    return null;
  }

  const label = [city, state, country].filter(Boolean).join(', ');

  return {
    city: city ?? '',
    state,
    country,
    label,
  };
}

export async function reverseGeocodeCoordinates(
  coordinates: UserCoordinates,
): Promise<LocationAddress | null> {
  try {
    const results = await Location.reverseGeocodeAsync(coordinates);
    const place = results[0];

    if (!place) {
      return null;
    }

    return formatLocationAddress(place);
  } catch {
    return null;
  }
}

export async function getUserLocationWithCity(): Promise<UserLocationResult> {
  const locationResult = await getCurrentUserLocation();

  if (!locationResult.ok) {
    return locationResult;
  }

  const address = await reverseGeocodeCoordinates(locationResult.coordinates);

  if (!address) {
    return { ok: false, reason: 'unavailable' };
  }

  const location: UserLocationInfo = {
    coordinates: locationResult.coordinates,
    address,
  };

  return { ok: true, location };
}
