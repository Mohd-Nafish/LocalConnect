import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { PlaceWithDistance } from '../types/place';
import { formatDistance } from '../utils/distance';
import { CategoryBadge } from './CategoryBadge';
import { PlacePhoto } from './PlacePhoto';
import { RatingBadge, StatusBadge } from './PlaceBadges';

type FeaturedPlaceCardProps = {
  place: PlaceWithDistance;
  onPress?: () => void;
};

export function FeaturedPlaceCard({ place, onPress }: FeaturedPlaceCardProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width * spacing.featuredCardWidthRatio;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View featured place ${place.name}`}
    >
      <View style={styles.imageWrapper}>
        <PlacePhoto
          photoUrl={place.photoUrl}
          category={place.category}
          height={spacing.md * 5}
        />
        <StatusBadge isOpen={place.isOpen} />
        {place.rating > 0 && <RatingBadge rating={place.rating} />}
        <CategoryBadge category={place.category} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {place.address}
        </Text>
        <View style={styles.distanceRow}>
          <Ionicons name="navigate-outline" size={14} color={colors.primary} />
          <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
  },
  imageWrapper: {
    position: 'relative',
  },
  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  name: {
    ...typography.bodyMedium,
  },
  address: {
    ...typography.caption,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  distance: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
