import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { LocationErrorReason } from '../types/location';

const errorContent: Record<
  LocationErrorReason,
  { title: string; description: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  denied: {
    icon: 'location-outline',
    title: 'Location Access Needed',
    description:
      'LocalConnect needs your location to show nearby places and distances. Enable location access in Settings to continue.',
  },
  unavailable: {
    icon: 'navigate-outline',
    title: 'Location Unavailable',
    description:
      'We could not determine your current location. Check that location services are enabled and try again.',
  },
};

type LocationErrorPanelProps = {
  error: LocationErrorReason;
  onRetry: () => void;
};

export function LocationErrorPanel({ error, onRetry }: LocationErrorPanelProps) {
  const content = errorContent[error];

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={content.icon} size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.description}>{content.description}</Text>

      <View style={styles.actions}>
        {error === 'denied' && (
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              void Linking.openSettings();
            }}
          >
            <Text style={styles.primaryButtonText}>Open Settings</Text>
          </Pressable>
        )}
        <Pressable style={styles.secondaryButton} onPress={onRetry}>
          <Text style={styles.secondaryButtonText}>Retry Location</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  iconCircle: {
    width: spacing.lg * 2,
    height: spacing.lg * 2,
    borderRadius: spacing.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.sectionTitle,
    textAlign: 'center',
  },
  description: {
    ...typography.caption,
    textAlign: 'center',
    maxWidth: '90%',
  },
  actions: {
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.buttonRadius,
    minHeight: spacing.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  primaryButtonText: {
    ...typography.bodyMedium,
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: spacing.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
