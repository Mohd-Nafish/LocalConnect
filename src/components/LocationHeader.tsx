import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../theme';
import type { LocationErrorReason } from '../types/location';

type LocationHeaderProps = {
  city: string | null;
  greeting: string;
  loading?: boolean;
  error?: LocationErrorReason | null;
  onRetry?: () => void;
};

export function LocationHeader({
  city,
  greeting,
  loading = false,
  error = null,
  onRetry,
}: LocationHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }]}>
      <View style={styles.locationRow}>
        <Ionicons
          name="location-sharp"
          size={16}
          color={error ? colors.closed : colors.primary}
        />
        {loading ? (
          <>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorText} numberOfLines={1}>
              Location unavailable
            </Text>
            {onRetry && (
              <Pressable onPress={onRetry} hitSlop={spacing.xs}>
                <Text style={styles.retryText}>Retry Location</Text>
              </Pressable>
            )}
          </>
        ) : (
          <Text style={styles.cityLabel} numberOfLines={2}>
            {city ?? 'Unknown location'}
          </Text>
        )}
      </View>
      <Text style={styles.greeting}>{greeting}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  cityLabel: {
    ...typography.captionMedium,
    color: colors.primary,
    flex: 1,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  errorText: {
    ...typography.captionMedium,
    color: colors.closed,
    flex: 1,
  },
  retryText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  greeting: {
    ...typography.screenTitle,
  },
});
