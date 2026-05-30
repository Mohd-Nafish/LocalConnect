import { useMemo } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  HomePlacesSkeleton,
  LocationErrorPanel,
  PlaceCard,
  PlacesErrorState,
  ScreenLayout,
  SectionHeader,
} from '../components';
import {
  getTrendingPlaceSections,
  getTrendingSectionList,
} from '../data/trendingSections';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbyPlaces } from '../hooks/useNearbyPlaces';
import { primePlaceDetailsCache } from '../services/placesCache';
import { colors, spacing, typography } from '../theme';
import type { TrendingScreenNavigationProp } from '../types/navigation';
import type { Place } from '../types/place';

export function TrendingScreen() {
  const navigation = useNavigation<TrendingScreenNavigationProp>();
  const { location, loading: locationLoading, error: locationError, refreshLocation } =
    useCurrentLocation();

  const hasValidLocation = !locationLoading && location !== null && locationError === null;

  const {
    places,
    status: placesStatus,
    isRefreshing,
    errorMessage: placesErrorMessage,
    retry,
  } = useNearbyPlaces(location, hasValidLocation);

  const sections = useMemo(
    () => getTrendingPlaceSections(places, location),
    [location, places],
  );

  const sectionList = useMemo(() => getTrendingSectionList(sections), [sections]);

  const isInitialLoading =
    locationLoading || (hasValidLocation && placesStatus === 'loading' && !isRefreshing);
  const hasPlacesError =
    hasValidLocation && !locationLoading && placesStatus === 'error' && !isRefreshing;

  const hasAnyPlaces = sectionList.some((section) => section.places.length > 0);

  const handlePlacePress = (place: Place) => {
    primePlaceDetailsCache(place);
    navigation.navigate('PlaceDetails', { place });
  };

  const handleRefresh = () => {
    void retry({ refresh: true });
  };

  const handleRetryLocation = () => {
    void refreshLocation();
  };

  return (
    <ScreenLayout
      title="Trending"
      refreshControl={
        hasValidLocation ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {locationError && !locationLoading && (
        <LocationErrorPanel error={locationError} onRetry={handleRetryLocation} />
      )}

      {isInitialLoading && !locationError && <HomePlacesSkeleton />}

      {hasPlacesError && placesErrorMessage && (
        <PlacesErrorState message={placesErrorMessage} onRetry={() => void retry()} />
      )}

      {!locationError &&
        !isInitialLoading &&
        !hasPlacesError &&
        hasValidLocation &&
        sectionList.map((section) => (
          <View key={section.key} style={styles.section}>
            <SectionHeader title={section.title} />
            {section.places.length > 0 ? (
              <View style={styles.cardList}>
                {section.places.map((place) => (
                  <PlaceCard
                    key={`${section.key}-${place.id}`}
                    place={place}
                    onPress={() => handlePlacePress(place)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No places found in this section nearby.</Text>
              </View>
            )}
          </View>
        ))}

      {!locationError &&
        !isInitialLoading &&
        !hasPlacesError &&
        hasValidLocation &&
        !hasAnyPlaces && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No trending places found nearby. Pull down to refresh.
            </Text>
          </View>
        )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xs,
  },
  cardList: {
    gap: spacing.sm,
  },
  emptySection: {
    paddingVertical: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
