import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <PressableScale
      haptic
      onPress={onPress}
      accessibilityState={{ selected }}
      style={{
        paddingHorizontal: space.lg,
        paddingVertical: space.sm,
        borderRadius: radius.pill,
        backgroundColor: selected ? colors.text : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.text : colors.border,
        minHeight: 36,
        justifyContent: 'center',
      }}>
      <Text variant="callout" color={selected ? 'background' : 'text'}>
        {label}
      </Text>
    </PressableScale>
  );
}
