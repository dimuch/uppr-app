import type { ReactNode } from 'react';
import { Platform, ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { MAX_CONTENT_WIDTH, space } from '@/theme/tokens';

/** Height reserved for the floating web tab bar (native tab bars inset content automatically). */
export const WEB_TAB_BAR_SPACE = 96;

type Props = ScrollViewProps & {
  title?: string;
  subtitle?: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
};

/** Scrollable tab root with a large editorial header, safe-area aware. */
export function TabScreen({ title, subtitle, headerLeft, headerRight, children, contentContainerStyle, ...rest }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[
        {
          paddingTop: insets.top + space.md,
          paddingBottom: Platform.OS === 'web' ? WEB_TAB_BAR_SPACE : space.xxl,
          paddingHorizontal: space.xl,
          width: '100%',
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: 'center',
        },
        contentContainerStyle,
      ]}
      {...rest}>
      {(title || headerLeft || headerRight) && (
        <View style={{ marginBottom: space.xl, gap: space.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
            {headerLeft ?? (
              <Text variant="title" accessibilityRole="header">
                {title}
              </Text>
            )}
            {headerRight}
          </View>
          {subtitle && (
            <Text variant="callout" color="textSecondary">
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children}
    </ScrollView>
  );
}
