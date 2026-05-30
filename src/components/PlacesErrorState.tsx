import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type PlacesErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function PlacesErrorState({ message, onRetry }: PlacesErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>Could Not Load Places</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
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
  message: {
    ...typography.caption,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.buttonRadius,
    minHeight: spacing.buttonHeight,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  buttonText: {
    ...typography.bodyMedium,
    color: colors.surface,
  },
});
