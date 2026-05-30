import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../theme';

type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.sectionTitle,
  },
});
