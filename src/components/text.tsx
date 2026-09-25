import { Text as RNText, type TextProps } from 'react-native';

import { useTheme } from '@/theme/theme-provider';
import { type, type Palette } from '@/theme/tokens';

export type TextVariant = keyof typeof type;

type Props = TextProps & {
  variant?: TextVariant;
  color?: keyof Palette;
  /** Multiplier for reader text size. */
  scale?: number;
  weight?: '400' | '500' | '600' | '700' | '800';
  center?: boolean;
};

export function Text({ variant = 'body', color = 'text', scale = 1, weight, center, style, ...rest }: Props) {
  const { colors } = useTheme();
  const base = type[variant];
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      style={[
        base,
        scale !== 1 && { fontSize: base.fontSize * scale, lineHeight: base.lineHeight * scale },
        { color: colors[color] },
        weight && { fontWeight: weight },
        center && { textAlign: 'center' },
        style,
      ]}
      {...rest}
    />
  );
}
