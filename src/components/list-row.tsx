import { View } from 'react-native';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: 'chevron' | 'external' | 'download' | React.ReactNode;
  tint?: 'primary' | 'accent' | 'success';
};

export function ListRow({ icon, title, subtitle, onPress, trailing = 'chevron', tint = 'primary' }: Props) {
  const { colors } = useTheme();
  const tintColor = colors[tint];
  const soft = tint === 'primary' ? colors.primarySoft : tint === 'accent' ? colors.accentSoft : colors.successSoft;
  const trailingIcon =
    trailing === 'chevron' ? 'chevronRight' : trailing === 'external' ? 'external' : trailing === 'download' ? 'download' : null;
  return (
    <PressableScale
      onPress={onPress}
      pressedScale={0.985}
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      accessibilityRole={trailing === 'external' ? 'link' : 'button'}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, minHeight: 56 }}>
      <View
        style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: soft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={20} color={tintColor} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="callout" weight="600">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailingIcon ? <Icon name={trailingIcon} size={16} color={colors.textTertiary} /> : trailing}
    </PressableScale>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: space.lg, paddingVertical: space.xs },
        style,
      ]}>
      {children}
    </View>
  );
}
