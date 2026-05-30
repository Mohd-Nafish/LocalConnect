import type { RefObject } from 'react';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';

import {
  MAP_DELTA,
  MAP_FOCUS_DELTA,
  MAP_SHEET_LATITUDE_OFFSET,
} from '../constants/mapStyle';
import type { UserCoordinates } from '../types/location';
import type { Place } from '../types/place';

export function createUserRegion(coordinates: UserCoordinates): Region {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: MAP_DELTA,
    longitudeDelta: MAP_DELTA,
  };
}

export function createPlaceFocusRegion(place: Place): Region {
  return {
    latitude: place.latitude - MAP_SHEET_LATITUDE_OFFSET,
    longitude: place.longitude,
    latitudeDelta: MAP_FOCUS_DELTA,
    longitudeDelta: MAP_FOCUS_DELTA,
  };
}

export function animateMapToRegion(
  mapRef: RefObject<MapView | null>,
  region: Region,
  duration = 450,
): void {
  mapRef.current?.animateToRegion(region, duration);
}

export function animateMapToUser(
  mapRef: RefObject<MapView | null>,
  coordinates: UserCoordinates,
): void {
  animateMapToRegion(mapRef, createUserRegion(coordinates));
}

export function animateMapToPlace(
  mapRef: RefObject<MapView | null>,
  place: Place,
): void {
  animateMapToRegion(mapRef, createPlaceFocusRegion(place));
}
