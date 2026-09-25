import { useEffect, useState } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

export function EmptyState({
  icon,
  title,
  message,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: space.xxxl, paddingHorizontal: space.xl, gap: space.md }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <Text variant="heading" center>
        {title}
      </Text>
      <Text color="textSecondary" center>
        {message}
      </Text>
      {action && <Button label={action} onPress={onAction} style={{ marginTop: space.sm }} />}
    </View>
  );
}

export function Button({
  label,
  onPress,
  kind = 'primary',
  icon,
  style,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  kind?: 'primary' | 'secondary';
  icon?: IconName;
  style?: object;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const primary = kind === 'primary';
  return (
    <PressableScale
      haptic
      disabled={disabled}
      onPress={onPress}
      accessibilityState={{ disabled }}
      style={[
        {
          minHeight: 52,
          paddingHorizontal: space.xl,
          borderRadius: radius.pill,
          backgroundColor: primary ? colors.primary : colors.surfaceMuted,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}>
      <Text variant="callout" weight="700" style={{ color: primary ? colors.onPrimary : colors.text }}>
        {label}
      </Text>
      {icon && <Icon name={icon} size={16} color={primary ? colors.onPrimary : colors.text} />}
    </PressableScale>
  );
}

export function Skeleton({ width = '100%', height = 16, style }: { width?: DimensionValue; height?: number; style?: object }) {
  const { colors } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius.sm, backgroundColor: colors.surfaceMuted, opacity }, style]}
    />
  );
}
