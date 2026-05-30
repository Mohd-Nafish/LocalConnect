import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { PlaceReview } from '../types/place';

type ReviewCardProps = {
  review: PlaceReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.author}>{review.authorName}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.rating}>{review.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.time}>{review.relativeTime}</Text>
      <Text style={styles.text}>{review.text}</Text>
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
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  author: {
    ...typography.bodyMedium,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    ...typography.captionMedium,
    color: colors.text,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: spacing.md,
  },
});
