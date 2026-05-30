import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { PlaceCategory } from '../types/place';

type CategoryBadgeProps = {
  category: PlaceCategory;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
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
  label: {
    ...typography.captionMedium,
    color: colors.text,
    fontSize: 12,
  },
});
