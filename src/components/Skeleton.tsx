import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, spacing } from '../theme';

type SkeletonBoxProps = {
  height: number;
  width?: number | `${number}%`;
  style?: ViewStyle;
};

export function SkeletonBox({ height, width = '100%', style }: SkeletonBoxProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.box, { height, width, opacity }, style]}
    />
  );
}

export function PlaceCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBox height={spacing.cardImageHeight} />
      <View style={styles.content}>
        <SkeletonBox height={spacing.sm} width="70%" />
        <SkeletonBox height={spacing.xs} width="50%" />
        <SkeletonBox height={spacing.xs} width="40%" />
      </View>
    </View>
  );
}

export function HomePlacesSkeleton() {
  return (
    <View style={styles.list}>
      <PlaceCardSkeleton />
      <PlaceCardSkeleton />
      <PlaceCardSkeleton />
    </View>
  );
}

export function PlaceDetailsSkeleton() {
  return (
    <View style={styles.details}>
      <SkeletonBox height={spacing.detailHeroHeight} />
      <View style={styles.detailsContent}>
        <SkeletonBox height={spacing.md} width="80%" />
        <SkeletonBox height={spacing.sm} width="45%" />
        <SkeletonBox height={spacing.lg} width="100%" />
        <SkeletonBox height={spacing.lg} width="100%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.border,
    borderRadius: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  details: {
    gap: spacing.sm,
  },
  detailsContent: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
  },
});
