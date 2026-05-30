import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { PlaceWithDistance } from '../types/place';
import { formatDistance } from '../utils/distance';
import { CategoryBadge } from './CategoryBadge';
import { PlacePhoto } from './PlacePhoto';
import { RatingBadge, StatusBadge } from './PlaceBadges';

type PlaceCardProps = {
  place: PlaceWithDistance;
  onPress?: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
};

export function PlaceCard({
  place,
  onPress,
  isFavorite = false,
  onFavoritePress,
}: PlaceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${place.name}`}
    >
      <View style={styles.imageWrapper}>
        <PlacePhoto
          photoUrl={place.photoUrl}
          category={place.category}
          height={spacing.cardImageHeight}
        />
        <StatusBadge isOpen={place.isOpen} />
        {place.rating > 0 && <RatingBadge rating={place.rating} />}
        <CategoryBadge category={place.category} />
        {onFavoritePress && (
          <Pressable
            style={styles.favoriteButton}
            onPress={onFavoritePress}
            hitSlop={spacing.xs}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? `Remove ${place.name} from favorites` : `Save ${place.name}`
            }
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {place.address}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={14} color={colors.primary} />
            <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
          </View>
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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  imageWrapper: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    borderRadius: spacing.touchTarget / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distance: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
