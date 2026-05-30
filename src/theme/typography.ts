import { TextStyle } from 'react-native';

import { colors } from './colors';

export const typography = {
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  } satisfies TextStyle,
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  } satisfies TextStyle,
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  } satisfies TextStyle,
  captionMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  } satisfies TextStyle,
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  } satisfies TextStyle,
} as const;
