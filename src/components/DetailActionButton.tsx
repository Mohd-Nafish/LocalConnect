import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../theme';

type DetailActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function DetailActionButton({
  icon,
  label,
  onPress,
  disabled = false,
}: DetailActionButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={disabled ? colors.textMuted : colors.primary}
      />
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: spacing.buttonHeight,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  buttonDisabled: {
    backgroundColor: colors.borderLight,
    borderColor: colors.borderLight,
  },
  label: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
