import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Cover } from './cover';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import { categoryById, coverUrl, formatDate, type ArticleMeta } from '@/data/articles';
import { useLibrary } from '@/state/library';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

type Variant = 'hero' | 'row' | 'tile';

const open = (slug: string) => router.push({ pathname: '/article/[slug]', params: { slug } });

export function ArticleCard({ article, variant = 'row' }: { article: ArticleMeta; variant?: Variant }) {
  const { colors } = useTheme();
  const { history, isBookmarked } = useLibrary();
  const progress = history[article.slug]?.progress ?? 0;
  const category = categoryById[article.category];
  const a11y = `${article.title}. ${category.label}, ${article.minutes} хв читання`;

  if (variant === 'hero') {
    return (
      <PressableScale onPress={() => open(article.slug)} accessibilityLabel={a11y} style={styles.hero}>
        <Cover uri={coverUrl(article, 750)} category={article.category} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['transparent', 'rgba(10,12,20,0.85)']}
          locations={[0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroBody}>
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Text variant="overline" style={{ color: '#fff' }}>
              {category.label.toUpperCase()}
            </Text>
          </View>
          <Text variant="heading" style={{ color: '#fff' }} numberOfLines={3}>
            {article.title}
          </Text>
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {article.minutes} хв · {formatDate(article.date)}
          </Text>
        </View>
      </PressableScale>
    );
  }

  if (variant === 'tile') {
    return (
      <PressableScale
        onPress={() => open(article.slug)}
        accessibilityLabel={a11y}
        style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Cover uri={coverUrl(article, 320)} category={article.category} style={styles.tileCover} />
        <View style={{ padding: space.md, gap: space.xs, flex: 1 }}>
          <Text variant="overline" color="primary">
            {category.label.toUpperCase()}
          </Text>
          <Text variant="subheading" numberOfLines={3}>
            {article.title}
          </Text>
          <Text variant="caption" color="textTertiary" style={{ marginTop: 'auto' }}>
            {article.minutes} хв читання
          </Text>
        </View>
      </PressableScale>
    );
  }

  return (
    <PressableScale onPress={() => open(article.slug)} accessibilityLabel={a11y} style={styles.row} pressedScale={0.98}>
      <Cover uri={coverUrl(article, 320)} category={article.category} style={styles.rowCover} />
      <View style={{ flex: 1, gap: space.xs }}>
        <Text variant="overline" color="primary">
          {category.label.toUpperCase()}
        </Text>
        <Text variant="subheading" numberOfLines={2}>
          {article.title}
        </Text>
        <View style={styles.meta}>
          <Text variant="caption" color="textTertiary">
            {article.minutes} хв · {formatDate(article.date)}
          </Text>
          {isBookmarked(article.slug) && <Icon name="bookmarkFill" size={13} color={colors.primary} />}
        </View>
        {progress > 0.02 && (
          <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
            <View
              style={{
                width: `${Math.round(progress * 100)}%`,
                height: '100%',
                borderRadius: 2,
                backgroundColor: progress >= 0.95 ? colors.success : colors.primary,
              }}
            />
          </View>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: { height: 360, borderRadius: radius.xl, overflow: 'hidden' },
  heroBody: { position: 'absolute', left: space.xl, right: space.xl, bottom: space.xl, gap: space.sm },
  badge: { alignSelf: 'flex-start', paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radius.sm },
  tile: { width: 220, borderRadius: radius.lg, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  tileCover: { height: 120 },
  row: { flexDirection: 'row', gap: space.lg, alignItems: 'center', paddingVertical: space.sm },
  rowCover: { width: 92, height: 92, borderRadius: radius.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  track: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
});
