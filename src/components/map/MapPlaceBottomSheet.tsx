import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../../theme';
import type { PlaceWithDistance } from '../../types/place';
import { formatDistance } from '../../utils/distance';
import { PlacePhoto } from '../PlacePhoto';
import { RatingBadge } from '../PlaceBadges';

const SHEET_HEIGHT = 320;

export const MAP_BOTTOM_SHEET_HEIGHT = SHEET_HEIGHT;

type MapPlaceBottomSheetProps = {
  place: PlaceWithDistance | null;
  visible: boolean;
  onClose: () => void;
  onViewDetails: (place: PlaceWithDistance) => void;
  onDirections: (place: PlaceWithDistance) => void;
};

export function MapPlaceBottomSheet({
  place,
  visible,
  onClose,
  onViewDetails,
  onDirections,
}: MapPlaceBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
    }).start();
  }, [translateY, visible]);

  if (!place) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          transform: [{ translateY }],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.handleRow}>
        <View style={styles.handle} />
        <Pressable
          onPress={onClose}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Close place preview"
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.photoWrapper}>
        <PlacePhoto
          photoUrl={place.photoUrl}
          category={place.category}
          height={spacing.cardImageHeight * 0.55}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={2}>
            {place.name}
          </Text>
          {place.rating > 0 && <RatingBadge rating={place.rating} inline />}
        </View>

        <Text style={styles.address} numberOfLines={2}>
          {place.address}
        </Text>

        <View style={styles.distanceRow}>
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onViewDetails(place)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${place.name}`}
          >
            <Text style={styles.primaryButtonText}>View Details</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => onDirections(place)}
            accessibilityRole="button"
            accessibilityLabel={`Get directions to ${place.name}`}
          >
            <Ionicons name="navigate" size={18} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Directions</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.cardRadius,
    borderTopRightRadius: spacing.cardRadius,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  handleRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  handle: {
    width: spacing.lg,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.xs,
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoWrapper: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
    borderRadius: spacing.buttonRadius,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    flex: 1,
  },
  address: {
    ...typography.caption,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  distance: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  primaryButton: {
    flex: 1,
    minHeight: spacing.buttonHeight,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  primaryButtonText: {
    ...typography.captionMedium,
    color: colors.surface,
  },
  secondaryButton: {
    flex: 1,
    minHeight: spacing.buttonHeight,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
