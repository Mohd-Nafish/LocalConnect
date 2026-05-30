import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

type PlacesLoadingStateProps = {
  message?: string;
};

export function PlacesLoadingState({
  message = 'Finding nearby places...',
}: PlacesLoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  message: {
    ...typography.caption,
    textAlign: 'center',
  },
});
