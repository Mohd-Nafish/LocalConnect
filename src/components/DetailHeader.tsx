import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../theme';

type DetailHeaderProps = {
  title: string;
  onBack: () => void;
};

export function DetailHeader({ title, onBack }: DetailHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }]}>
      <Pressable
        onPress={onBack}
        style={styles.backButton}
        hitSlop={spacing.xs}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.backButtonSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.xs,
  },
  backButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: spacing.touchTarget,
  },
  title: {
    ...typography.sectionTitle,
    flex: 1,
    textAlign: 'center',
  },
});
