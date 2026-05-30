import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';

type MapMarkerPinProps = {
  color: string;
  selected?: boolean;
  variant?: 'user' | 'place';
};

const PIN_SIZES = {
  user: 18,
  place: 14,
} as const;

export function MapMarkerPin({
  color,
  selected = false,
  variant = 'place',
}: MapMarkerPinProps) {
  const size = PIN_SIZES[variant];
  const outerSize = selected ? size + spacing.xs : size;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.outerRing,
          {
            width: outerSize + spacing.xs,
            height: outerSize + spacing.xs,
            borderRadius: (outerSize + spacing.xs) / 2,
            borderColor: color,
            opacity: selected ? 0.35 : 0,
          },
        ]}
      />
      <View
        style={[
          styles.pin,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            backgroundColor: color,
          },
        ]}
      />
      <View style={[styles.stem, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  pin: {
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  stem: {
    width: 2,
    height: spacing.xs,
    marginTop: -1,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
});
