import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = PressableProps & {
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  /** Scale applied while pressed. */
  pressedScale?: number;
};

/** Pressable with subtle press feedback (scale + optional haptic). */
export function PressableScale({ style, haptic = false, pressedScale = 0.97, onPress, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={undefined}
      onPress={(e) => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync();
        onPress?.(e);
      }}
      style={({ pressed }) => [style, pressed && { transform: [{ scale: pressedScale }], opacity: 0.92 }]}
      {...rest}
    />
  );
}
