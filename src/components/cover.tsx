import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { CategoryId } from '@/data/articles';
import { gradients } from '@/theme/tokens';

const categoryGradient: Record<CategoryId, readonly [string, string]> = {
  emails: gradients.brand,
  kiss: gradients.warm,
  'case-study': gradients.cool,
  hr: gradients.mint,
  'business-english': gradients.cool,
};

/** Article cover with a branded gradient placeholder while loading or on error. */
export function Cover({
  uri,
  category,
  style,
}: {
  uri?: string;
  category: CategoryId;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient colors={categoryGradient[category]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {uri && !failed && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { overflow: 'hidden' } });
