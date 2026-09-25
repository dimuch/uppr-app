/**
 * UPPR design tokens.
 * Palette derived from uppr.com.ua: slate ink, pink→violet gradient, orange accent.
 */
import { Platform } from 'react-native';

const brand = {
  pink: '#E0559F',
  violet: '#7B61FF',
  orange: '#FF9320',
  slate: '#44546A',
  lavender: '#CBD0DF',
} as const;

export const palette = {
  light: {
    background: '#F6F6FA',
    surface: '#FFFFFF',
    surfaceMuted: '#EEEFF5',
    text: '#1B2433',
    textSecondary: '#5A6679',
    textTertiary: '#8B93A5',
    border: '#E3E5EE',
    primary: brand.violet,
    primarySoft: '#EEEAFF',
    onPrimary: '#FFFFFF',
    accent: brand.orange,
    accentSoft: '#FFF1E2',
    danger: '#D93C4B',
    success: '#1E9E6A',
    successSoft: '#E3F6EE',
    overlay: 'rgba(12,16,24,0.45)',
  },
  dark: {
    background: '#0C0E13',
    surface: '#161A22',
    surfaceMuted: '#1F2430',
    text: '#EEF0F6',
    textSecondary: '#A9B1C2',
    textTertiary: '#737C8F',
    border: '#262C39',
    primary: '#9C88FF',
    primarySoft: '#241F3D',
    onPrimary: '#FFFFFF',
    accent: '#FFA544',
    accentSoft: '#35261A',
    danger: '#FF6B78',
    success: '#3CCB8E',
    successSoft: '#15302A',
    overlay: 'rgba(0,0,0,0.6)',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Palette = { [K in keyof (typeof palette)['light']]: string };

export const gradients = {
  brand: [brand.pink, brand.violet] as const,
  warm: [brand.orange, brand.pink] as const,
  cool: ['#5B8CFF', brand.violet] as const,
  mint: ['#2BC39A', '#5B8CFF'] as const,
};

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;

/** Raleway for display/brand, system font for long-form reading. */
export const fonts = {
  display: 'Raleway_700Bold',
  displayHeavy: 'Raleway_800ExtraBold',
  displayMedium: 'Raleway_600SemiBold',
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
} as const;

export const type = {
  hero: { fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.display, fontSize: 21, lineHeight: 27 },
  subheading: { fontFamily: fonts.displayMedium, fontSize: 17, lineHeight: 23 },
  body: { fontSize: 16, lineHeight: 24 },
  callout: { fontSize: 15, lineHeight: 21, fontWeight: '500' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1 },
} as const;

export const MAX_CONTENT_WIDTH = 720;
