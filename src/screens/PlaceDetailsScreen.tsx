import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DetailActionButton,
  DetailCard,
  PlaceDetailsSkeleton,
  PlacePhoto,
  RatingBadge,
  ReviewCard,
  StatusBadge,
} from '../components';
import { useFavorites } from '../context';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { usePlaceDetails } from '../hooks/usePlaceDetails';
import { colors, spacing, typography } from '../theme';
import type { RootStackScreenProps } from '../types/navigation';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { openDirections, openPhone, openWebsite } from '../utils/directions';
import { sharePlace } from '../utils/share';

type PlaceDetailsScreenProps = RootStackScreenProps<'PlaceDetails'>;

export function PlaceDetailsScreen({ route, navigation }: PlaceDetailsScreenProps) {
  const initialPlace = route.params.place;
  const insets = useSafeAreaInsets();
  const { location } = useCurrentLocation();
  const { place, status } = usePlaceDetails(initialPlace.id, initialPlace);
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(place.id);

  const distanceKm = location
    ? calculateDistanceKm(location, {
        latitude: place.latitude,
        longitude: place.longitude,
      })
    : null;

  const handleOpenMaps = () => {
    void openDirections({
      latitude: place.latitude,
      longitude: place.longitude,
      label: place.name,
    });
  };

  const handleShare = () => {
    void sharePlace({
      name: place.name,
      address: place.address,
      website: place.website,
    });
  };

  return (
    <View style={styles.container}>
      {status === 'loading' ? (
        <PlaceDetailsSkeleton />
      ) : (
        <>
          <View style={styles.heroContainer}>
            <PlacePhoto
              photoUrl={place.photoUrl}
              category={place.category}
              height={spacing.detailHeroHeight}
            />

            <View style={[styles.heroTopBar, { paddingTop: insets.top + spacing.xs }]}>
              <Pressable
                style={styles.heroIconButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </Pressable>

              <View style={styles.heroTopActions}>
                <Pressable
                  style={styles.heroIconButton}
                  onPress={handleShare}
                  accessibilityRole="button"
                  accessibilityLabel="Share place"
                >
                  <Ionicons name="share-outline" size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.heroIconButton, saved && styles.heroIconButtonActive]}
                  onPress={() => toggleFavorite(place)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    saved ? 'Remove from favorites' : 'Save to favorites'
                  }
                >
                  <Ionicons
                    name={saved ? 'heart' : 'heart-outline'}
                    size={22}
                    color={saved ? colors.surface : colors.text}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.heroBadges}>
              <StatusBadge isOpen={place.isOpen} inline />
              {place.rating > 0 && <RatingBadge rating={place.rating} inline />}
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <DetailCard>
              <Text style={styles.name}>{place.name}</Text>

              <View style={styles.metaRow}>
                <View style={styles.categoryPill}>
                  <Text style={styles.category}>{place.category}</Text>
                </View>
                {place.reviewCount > 0 && (
                  <Text style={styles.reviewCount}>
                    {place.reviewCount.toLocaleString()} reviews
                  </Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>{place.address}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name={place.isOpen ? 'time-outline' : 'close-circle-outline'}
                  size={20}
                  color={place.isOpen ? colors.open : colors.closed}
                />
                <Text
                  style={[
                    styles.infoText,
                    place.isOpen ? styles.openText : styles.closedText,
                  ]}
                >
                  {place.isOpen ? 'Open now' : 'Closed now'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="navigate-outline" size={20} color={colors.primary} />
                <Text style={styles.distance}>{formatDistance(distanceKm)} away</Text>
              </View>
            </DetailCard>

            <DetailCard title="Quick Actions">
              <View style={styles.actionsGrid}>
                <DetailActionButton
                  icon="call-outline"
                  label="Call"
                  onPress={() => void openPhone(place.phone!)}
                  disabled={!place.phone}
                />
                <DetailActionButton
                  icon="globe-outline"
                  label="Website"
                  onPress={() => void openWebsite(place.website!)}
                  disabled={!place.website}
                />
                <DetailActionButton
                  icon="map-outline"
                  label="Open in Maps"
                  onPress={handleOpenMaps}
                />
                <DetailActionButton
                  icon="share-outline"
                  label="Share"
                  onPress={handleShare}
                />
              </View>
            </DetailCard>

            <DetailCard title="About">
              <Text style={styles.description}>{place.description}</Text>
            </DetailCard>

            {place.reviews.length > 0 && (
              <DetailCard title="Reviews">
                <View style={styles.reviewsList}>
                  {place.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </View>
              </DetailCard>
            )}
          </ScrollView>
        </>
      )}

      {status !== 'loading' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
          <Pressable
            style={[styles.saveButton, saved && styles.saveButtonActive]}
            onPress={() => toggleFavorite(place)}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={20}
              color={saved ? colors.surface : colors.primary}
            />
            <Text style={[styles.saveButtonText, saved && styles.saveButtonTextActive]}>
              {saved ? 'Saved to Favorites' : 'Save to Favorites'}
            </Text>
          </Pressable>
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
  heroContainer: {
    position: 'relative',
    height: spacing.detailHeroHeight,
    backgroundColor: colors.borderLight,
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
  },
  heroTopActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  heroIconButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    borderRadius: spacing.touchTarget / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  heroIconButtonActive: {
    backgroundColor: colors.primary,
  },
  heroBadges: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  name: {
    ...typography.screenTitle,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.chipRadius,
  },
  category: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  reviewCount: {
    ...typography.caption,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: spacing.md,
  },
  openText: {
    color: colors.open,
  },
  closedText: {
    color: colors.closed,
  },
  distance: {
    ...typography.bodyMedium,
    color: colors.primary,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: spacing.md,
  },
  reviewsList: {
    gap: spacing.sm,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1,
    borderColor: colors.primary,
    minHeight: spacing.buttonHeight,
    gap: spacing.xs,
  },
  saveButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  saveButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  saveButtonTextActive: {
    color: colors.surface,
  },
});
