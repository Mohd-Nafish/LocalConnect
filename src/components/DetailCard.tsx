import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type DetailCardProps = {
  title?: string;
  children: ReactNode;
};

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.sm,
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...typography.sectionTitle,
  },
});
