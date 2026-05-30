import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PlaceCard, ScreenLayout } from '../components';
import { useFavorites } from '../context';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { primePlaceDetailsCache } from '../services/placesCache';
import { colors, spacing, typography } from '../theme';
import type { FavoritesScreenNavigationProp } from '../types/navigation';
import type { Place, PlaceWithDistance } from '../types/place';
import { calculateDistanceKm } from '../utils/distance';

export function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, isLoaded, isFavorite, removeFavorite } = useFavorites();
  const { location } = useCurrentLocation();

  const favoritesWithDistance = useMemo<PlaceWithDistance[]>(
    () =>
      favorites.map((place) => ({
        ...place,
        distanceKm: location
          ? calculateDistanceKm(location, {
              latitude: place.latitude,
              longitude: place.longitude,
            })
          : null,
      })),
    [location, favorites],
  );

  const handlePlacePress = (place: Place) => {
    primePlaceDetailsCache(place);
    navigation.navigate('PlaceDetails', { place });
  };

  const handleRemoveFavorite = (place: Place) => {
    removeFavorite(place.id);
  };

  if (!isLoaded) {
    return (
      <ScreenLayout title="Favorites">
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (favorites.length === 0) {
    return (
      <ScreenLayout title="Favorites">
        <View style={styles.placeholder}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>No Favorites Yet</Text>
          <Text style={styles.description}>
            Save places you love from Place Details and find them here quickly.
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Favorites">
      <View style={styles.cardList}>
        {favoritesWithDistance.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isFavorite={isFavorite(place.id)}
            onFavoritePress={() => handleRemoveFavorite(place)}
            onPress={() => handlePlacePress(place)}
          />
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  iconCircle: {
    width: spacing.lg * 3,
    height: spacing.lg * 3,
    borderRadius: spacing.lg * 1.5,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  description: {
    ...typography.caption,
    textAlign: 'center',
    maxWidth: '80%',
  },
  cardList: {
    gap: spacing.sm,
  },
});
