import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../theme';

type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ label, selected = false, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.chipRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  label: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.primary,
  },
});
