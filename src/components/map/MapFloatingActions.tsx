import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';

type MapFloatingActionsProps = {
  onRecenter: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  recenterDisabled?: boolean;
};

export function MapFloatingActions({
  onRecenter,
  onRefresh,
  isRefreshing = false,
  recenterDisabled = false,
}: MapFloatingActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, recenterDisabled && styles.buttonDisabled]}
        onPress={onRecenter}
        disabled={recenterDisabled}
        accessibilityRole="button"
        accessibilityLabel="Recenter map on your location"
      >
        <Ionicons
          name="locate"
          size={22}
          color={recenterDisabled ? colors.textMuted : colors.primary}
        />
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={onRefresh}
        disabled={isRefreshing}
        accessibilityRole="button"
        accessibilityLabel="Refresh nearby places"
      >
        {isRefreshing ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="refresh" size={22} color={colors.primary} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  button: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    borderRadius: spacing.touchTarget / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.borderLight,
  },
});
