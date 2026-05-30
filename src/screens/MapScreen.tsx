import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

import {
  LocationErrorPanel,
  PlacesErrorState,
  ScreenHeader,
} from '../components';
import {
  MapCategoryFilterBar,
  MapFloatingActions,
  MapMarkerPin,
  MapPlaceBottomSheet,
  MapPlacesCountBadge,
  MAP_BOTTOM_SHEET_HEIGHT,
} from '../components/map';
import { MODERN_MAP_STYLE } from '../constants/mapStyle';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useNearbyPlaces } from '../hooks/useNearbyPlaces';
import { primePlaceDetailsCache } from '../services/placesCache';
import { colors, spacing, typography } from '../theme';
import type { MapScreenNavigationProp } from '../types/navigation';
import type { Place, PlaceCategory, PlaceWithDistance } from '../types/place';
import { openDirections } from '../utils/directions';
import { attachDistanceToPlaces } from '../utils/placeDistance';
import {
  animateMapToPlace,
  animateMapToUser,
  createUserRegion,
} from '../utils/mapRegion';

export function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
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

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const placesWithDistance = useMemo(
    () => attachDistanceToPlaces(places, location),
    [location, places],
  );

  const filteredPlaces = useMemo(() => {
    if (!selectedCategory) {
      return placesWithDistance;
    }

    return placesWithDistance.filter((place) => place.category === selectedCategory);
  }, [placesWithDistance, selectedCategory]);

  const selectedPlace = useMemo(
    () => filteredPlaces.find((place) => place.id === selectedPlaceId) ?? null,
    [filteredPlaces, selectedPlaceId],
  );

  const isPlacesLoading =
    hasValidLocation && placesStatus === 'loading' && !isRefreshing;
  const hasPlacesError =
    hasValidLocation && placesStatus === 'error' && !isRefreshing;

  useEffect(() => {
    if (!location) {
      setSelectedPlaceId(null);
      return;
    }

    animateMapToUser(mapRef, location);
  }, [location]);

  useEffect(() => {
    if (selectedPlaceId && !filteredPlaces.some((place) => place.id === selectedPlaceId)) {
      setSelectedPlaceId(null);
    }
  }, [filteredPlaces, selectedPlaceId]);

  const handleRetryLocation = () => {
    void refreshLocation();
  };

  const handleRefreshPlaces = () => {
    void retry({ refresh: true });
  };

  const handleRecenter = () => {
    if (!location) {
      return;
    }

    setSelectedPlaceId(null);
    animateMapToUser(mapRef, location);
  };

  const handleMarkerPress = (place: PlaceWithDistance) => {
    setSelectedPlaceId(place.id);
    animateMapToPlace(mapRef, place);
  };

  const handleMapPress = () => {
    setSelectedPlaceId(null);
  };

  const handleViewDetails = (place: Place) => {
    primePlaceDetailsCache(place);
    navigation.navigate('PlaceDetails', { place });
  };

  const handleDirections = (place: PlaceWithDistance) => {
    void openDirections({
      latitude: place.latitude,
      longitude: place.longitude,
      label: place.name,
    });
  };

  const initialRegion = location ? createUserRegion(location) : undefined;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Map" />

      {locationLoading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding your location...</Text>
        </View>
      )}

      {locationError && !locationLoading && (
        <View style={styles.centerContent}>
          <LocationErrorPanel error={locationError} onRetry={handleRetryLocation} />
        </View>
      )}

      {!locationLoading && !locationError && location && initialRegion && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            customMapStyle={MODERN_MAP_STYLE}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={location}
              title="You are here"
              identifier="user-location"
              tracksViewChanges={false}
            >
              <MapMarkerPin color={colors.mapUserMarker} variant="user" />
            </Marker>

            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                onPress={() => handleMarkerPress(place)}
                tracksViewChanges={Boolean(selectedPlaceId)}
              >
                <MapMarkerPin
                  color={colors.mapPlaceMarker}
                  selected={selectedPlaceId === place.id}
                />
              </Marker>
            ))}
          </MapView>

          <View style={styles.overlay} pointerEvents="box-none">
            <MapCategoryFilterBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <View
              style={[
                styles.bottomOverlay,
                selectedPlace !== null && styles.bottomOverlayWithSheet,
              ]}
              pointerEvents="box-none"
            >
              <MapPlacesCountBadge
                count={filteredPlaces.length}
                loading={isPlacesLoading}
              />

              <MapFloatingActions
                onRecenter={handleRecenter}
                onRefresh={handleRefreshPlaces}
                isRefreshing={isRefreshing}
              />
            </View>
          </View>

          {hasPlacesError && placesErrorMessage && (
            <View style={styles.errorBanner}>
              <PlacesErrorState
                message={placesErrorMessage}
                onRetry={() => void retry()}
              />
            </View>
          )}

          <MapPlaceBottomSheet
            place={selectedPlace}
            visible={selectedPlace !== null}
            onClose={() => setSelectedPlaceId(null)}
            onViewDetails={handleViewDetails}
            onDirections={handleDirections}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    justifyContent: 'space-between',
  },
  bottomOverlay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  bottomOverlayWithSheet: {
    paddingBottom: MAP_BOTTOM_SHEET_HEIGHT - spacing.sm,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  errorBanner: {
    position: 'absolute',
    left: spacing.screenHorizontal,
    right: spacing.screenHorizontal,
    top: spacing.sm + spacing.touchTarget + spacing.sm,
  },
});
