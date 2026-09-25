import { View } from 'react-native';

import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { space } from '@/theme/tokens';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.md }}>
      <Text variant="heading" accessibilityRole="header">
        {title}
      </Text>
      {action && (
        <PressableScale onPress={onAction} hitSlop={12}>
          <Text variant="callout" color="primary">
            {action}
          </Text>
        </PressableScale>
      )}
    </View>
  );
}
