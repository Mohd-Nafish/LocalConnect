import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
};

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const showClearButton = value.length > 0 && onClear;

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search places nearby..."
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
      />
      {showClearButton && (
        <Pressable
          onPress={onClear}
          hitSlop={spacing.xs}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    minHeight: spacing.buttonHeight,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
});
