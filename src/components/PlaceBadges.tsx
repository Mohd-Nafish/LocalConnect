import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { PlaceCategory } from '../types/place';

type PlaceImagePlaceholderProps = {
  category: PlaceCategory;
  height: number;
};

const categoryIcons: Record<PlaceCategory, keyof typeof Ionicons.glyphMap> = {
  Restaurants: 'restaurant-outline',
  Cafes: 'cafe-outline',
  Hospitals: 'medical-outline',
  ATMs: 'card-outline',
  Parks: 'leaf-outline',
};

export function PlaceImagePlaceholder({ category, height }: PlaceImagePlaceholderProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Ionicons name={categoryIcons[category]} size={40} color={colors.placeholder} />
    </View>
  );
}

type StatusBadgeProps = {
  isOpen: boolean;
  inline?: boolean;
};

export function StatusBadge({ isOpen, inline = false }: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.statusBadge,
        inline && styles.inlineBadge,
        isOpen ? styles.openBadge : styles.closedBadge,
      ]}
    >
      <Text style={[styles.statusText, isOpen ? styles.openText : styles.closedText]}>
        {isOpen ? 'Open' : 'Closed'}
      </Text>
    </View>
  );
}

type RatingBadgeProps = {
  rating: number;
  inline?: boolean;
};

export function RatingBadge({ rating, inline = false }: RatingBadgeProps) {
  return (
    <View style={[styles.ratingBadge, inline && styles.inlineBadge]}>
      <Ionicons name="star" size={12} color={colors.star} />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.chipRadius,
  },
  openBadge: {
    backgroundColor: colors.openLight,
  },
  closedBadge: {
    backgroundColor: colors.closedLight,
  },
  statusText: {
    ...typography.captionMedium,
    fontSize: 12,
  },
  openText: {
    color: colors.open,
  },
  closedText: {
    color: colors.closed,
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: spacing.chipRadius,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    ...typography.captionMedium,
    color: colors.text,
    fontSize: 12,
  },
  inlineBadge: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
  },
});
