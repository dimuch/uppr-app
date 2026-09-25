import { View } from 'react-native';

import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { fonts } from '@/theme/tokens';

/** The "[UP]PR keep it simple" wordmark. */
export function BrandMark({ size = 22, tagline = true }: { size?: number; tagline?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }} accessibilityLabel="UPPR keep it simple">
      <Text style={{ fontFamily: fonts.displayHeavy, fontSize: size, lineHeight: size * 1.2 }}>
        <Text style={{ fontFamily: fonts.displayHeavy, fontSize: size, color: colors.primary }}>[</Text>
        UP
        <Text style={{ fontFamily: fonts.displayHeavy, fontSize: size, color: colors.primary }}>]</Text>
        PR
      </Text>
      {tagline && (
        <Text variant="caption" color="textSecondary" style={{ fontFamily: fonts.displayMedium }}>
          keep it simple
        </Text>
      )}
    </View>
  );
}
