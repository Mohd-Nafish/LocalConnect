import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  CategoryChip,
  FeaturedPlaceCard,
  HomePlacesSkeleton,
  LocationErrorPanel,
  LocationHeader,
  PlaceCard,
  PlacesErrorState,
  SearchBar,
  SearchResults,
  SectionHeader,
} from '../components';
import { SEARCH_MIN_QUERY_LENGTH } from '../constants/placeCategories';
import { categories } from '../data/categories';
import { getHomePlaceSections } from '../data/placeSections';
import { useLocationContext } from '../context/LocationContext';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbyPlaces } from '../hooks/useNearbyPlaces';
import { usePlaceSearch } from '../hooks/usePlaceSearch';
import { primePlaceDetailsCache } from '../services/placesCache';
import { colors, spacing, typography } from '../theme';
import type { HomeScreenNavigationProp } from '../types/navigation';
import type { Place, PlaceCategory, PlaceWithDistance } from '../types/place';
import { calculateDistanceKm } from '../utils/distance';

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { greeting } = useLocationContext();
  const { location, city, loading: locationLoading, error: locationError, refreshLocation } =
    useCurrentLocation();

  const hasValidLocation = !locationLoading && location !== null && locationError === null;

  const {
    places,
    status: placesStatus,
    isRefreshing,
    errorMessage: placesErrorMessage,
    retry,
  } = useNearbyPlaces(location, hasValidLocation);

  const { query, setQuery, results, isSearching, hasSearched, clearSearch } =
    usePlaceSearch(location, hasValidLocation);

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(
    null,
  );

  const isSearchActive = query.trim().length >= SEARCH_MIN_QUERY_LENGTH;

  const searchResultsWithDistance = useMemo<PlaceWithDistance[]>(
    () =>
      results.map((place) => ({
        ...place,
        distanceKm: location
          ? calculateDistanceKm(location, {
              latitude: place.latitude,
              longitude: place.longitude,
            })
          : null,
      })),
    [location, results],
  );

  const sections = useMemo(
    () => getHomePlaceSections(places, location, selectedCategory),
    [location, places, selectedCategory],
  );

  const isInitialLoading =
    locationLoading || (hasValidLocation && placesStatus === 'loading' && !isRefreshing);
  const hasPlacesError =
    hasValidLocation && !locationLoading && placesStatus === 'error' && !isRefreshing;

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

  const renderPlaceSection = (
    title: string,
    sectionPlaces: typeof sections.popularNearby,
  ) => {
    if (sectionPlaces.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <SectionHeader title={title} />
        <View style={styles.cardList}>
          {sectionPlaces.map((place) => (
            <PlaceCard
              key={`${title}-${place.id}`}
              place={place}
              onPress={() => handlePlacePress(place)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LocationHeader
        city={city}
        greeting={greeting}
        loading={locationLoading}
        error={locationError}
        onRetry={handleRetryLocation}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
        <SearchBar value={query} onChangeText={setQuery} onClear={clearSearch} />

        {locationError && !locationLoading && (
          <LocationErrorPanel error={locationError} onRetry={handleRetryLocation} />
        )}

        {!locationError && isSearchActive && hasValidLocation && (
          <SearchResults
            query={query.trim()}
            results={searchResultsWithDistance}
            isSearching={isSearching}
            hasSearched={hasSearched}
            onPlacePress={handlePlacePress}
          />
        )}

        {!locationError && !isSearchActive && hasValidLocation && (
          <>
            <View style={styles.chipRow}>
              {categories.map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  selected={selectedCategory === category}
                  onPress={() =>
                    setSelectedCategory((current) =>
                      current === category ? null : category,
                    )
                  }
                />
              ))}
            </View>

            {isInitialLoading && <HomePlacesSkeleton />}

            {hasPlacesError && placesErrorMessage && (
              <PlacesErrorState
                message={placesErrorMessage}
                onRetry={() => void retry()}
              />
            )}

            {!isInitialLoading && !hasPlacesError && (
              <>
                {sections.featured.length > 0 && (
                  <View style={styles.section}>
                    <SectionHeader title="Featured" />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.featuredRow}
                    >
                      {sections.featured.map((place) => (
                        <FeaturedPlaceCard
                          key={place.id}
                          place={place}
                          onPress={() => handlePlacePress(place)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {renderPlaceSection('Popular Nearby', sections.popularNearby)}
                {renderPlaceSection('Trending This Week', sections.trendingThisWeek)}
                {renderPlaceSection('Top Rated', sections.topRated)}

                {sections.popularNearby.length === 0 &&
                  sections.trendingThisWeek.length === 0 &&
                  sections.topRated.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>
                        {selectedCategory
                          ? 'No places found in this category nearby.'
                          : 'No nearby places found. Pull down to refresh.'}
                      </Text>
                    </View>
                  )}
              </>
            )}
          </>
        )}

        {!locationError && !locationLoading && !hasValidLocation && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Waiting for a valid GPS location before loading nearby places.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  section: {
    gap: spacing.xs,
  },
  featuredRow: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  cardList: {
    gap: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
  },
});
