import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Place } from '../types/place';

const FAVORITES_STORAGE_KEY = '@localconnect/favorites';

export async function loadStoredFavorites(): Promise<Place[]> {
  try {
    const storedValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsed = JSON.parse(storedValue) as Place[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((place) => ({
      ...place,
      reviews: place.reviews ?? [],
    }));
  } catch {
    return [];
  }
}

export async function saveStoredFavorites(favorites: Place[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}
