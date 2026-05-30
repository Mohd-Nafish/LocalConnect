import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type MapPlacesCountBadgeProps = {
  count: number;
  loading?: boolean;
};

export function MapPlacesCountBadge({ count, loading = false }: MapPlacesCountBadgeProps) {
  const label = count === 1 ? '1 place nearby' : `${count} places nearby`;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.chipRadius,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    ...typography.captionMedium,
    color: colors.text,
  },
});
