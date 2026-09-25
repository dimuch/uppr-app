import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { ArticleBody, openLink } from '@/components/article-body';
import { Cover } from '@/components/cover';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Button, EmptyState, Skeleton } from '@/components/states';
import { Text } from '@/components/text';
import { articleUrl, categoryById, coverUrl, formatDate, getArticleMeta } from '@/data/articles';
import { useArticle } from '@/lib/use-article';
import { useLibrary } from '@/state/library';
import { useTheme } from '@/theme/theme-provider';
import { MAX_CONTENT_WIDTH, radius, space } from '@/theme/tokens';

function HeaderButton({
  icon,
  label,
  onPress,
  active,
}: {
  icon: 'share' | 'bookmark' | 'bookmarkFill';
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <PressableScale onPress={onPress} hitSlop={8} accessibilityLabel={label} style={styles.headerButton}>
      <Icon name={icon} size={20} color={active ? colors.primary : colors.text} />
    </PressableScale>
  );
}

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const meta = getArticleMeta(slug);
  const { colors } = useTheme();
  const { settings, isBookmarked, toggleBookmark, recordProgress } = useLibrary();
  const { article, loading, refreshing, error, offline, reload, refresh } = useArticle(slug);
  const [progress, setProgress] = useState(0);
  const lastRecorded = useRef(0);
  const bookmarked = isBookmarked(slug);
  const scale = settings.textScale;

  const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    // Only track real reading: skip loading/error states and pages that barely scroll.
    if (!article || max < layoutMeasurement.height * 0.25) return;
    const p = Math.min(1, Math.max(0, contentOffset.y / max));
    setProgress(p);
    if (Math.abs(p - lastRecorded.current) > 0.05 || p > 0.97) {
      lastRecorded.current = p;
      recordProgress(slug, p);
    }
  };

  const onBookmark = () => {
    const added = toggleBookmark(slug);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        added ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
      );
    }
  };

  const onShare = () => {
    const title = meta?.title ?? article?.title ?? 'UPPR';
    Share.share(
      Platform.OS === 'ios'
        ? { url: articleUrl(slug), message: title }
        : { message: `${title}\n${articleUrl(slug)}`, title },
    );
  };

  const title = article?.title ?? meta?.title ?? '';
  const category = meta ? categoryById[meta.category] : undefined;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: space.xs }}>
              <HeaderButton icon="share" label="Поділитися" onPress={onShare} />
              <HeaderButton
                icon={bookmarked ? 'bookmarkFill' : 'bookmark'}
                label={bookmarked ? 'Прибрати із закладок' : 'Зберегти'}
                onPress={onBookmark}
                active={bookmarked}
              />
            </View>
          ),
        }}
      />
      <View
        style={[styles.progressTrack, { backgroundColor: colors.border }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: colors.primary }} />
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={32}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}>
        {meta && <Cover uri={article?.hero ?? coverUrl(meta, 750)} category={meta.category} style={styles.cover} />}

        <View style={{ gap: space.sm, marginTop: space.xl }}>
          {category && (
            <Text variant="overline" color="primary">
              {category.label.toUpperCase()}
            </Text>
          )}
          <Text variant="title" scale={Math.min(scale, 1.15)} accessibilityRole="header">
            {title}
          </Text>
          {meta && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
              <Icon name="clock" size={13} color={colors.textTertiary} />
              <Text variant="caption" color="textTertiary">
                {meta.minutes} хв читання · {formatDate(meta.date)}
              </Text>
            </View>
          )}
          {offline && (
            <View style={[styles.offline, { backgroundColor: colors.accentSoft }]}>
              <Icon name="wifiOff" size={14} color={colors.accent} />
              <Text variant="caption">Офлайн-версія. Потягніть вниз, щоб оновити.</Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: space.xl }}>
          {loading && !article ? (
            <View style={{ gap: space.md }} accessibilityLabel="Завантаження статті">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} width={i % 4 === 3 ? '60%' : '100%'} height={i % 4 === 0 ? 24 : 16} />
              ))}
            </View>
          ) : error ? (
            <EmptyState
              icon={error.kind === 'offline' ? 'wifiOff' : 'info'}
              title={error.kind === 'offline' ? 'Немає інтернету' : 'Не вдалося завантажити'}
              message={error.message}
              action="Спробувати ще"
              onAction={reload}
            />
          ) : article ? (
            <ArticleBody blocks={article.blocks} scale={scale} />
          ) : null}
        </View>

        {article && (
          <View style={{ marginTop: space.xxxl, gap: space.md }}>
            {article.tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
                {article.tags.map((t) => (
                  <View key={t} style={[styles.tag, { backgroundColor: colors.surfaceMuted }]}>
                    <Text variant="caption" color="textSecondary">
                      #{t}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Button
              kind={bookmarked ? 'secondary' : 'primary'}
              label={bookmarked ? 'Збережено для офлайн' : 'Зберегти для офлайн-читання'}
              onPress={onBookmark}
            />
            <Button kind="secondary" label="Відкрити на сайті" icon="external" onPress={() => openLink(articleUrl(slug))} />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.xl, paddingBottom: space.xxxl, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  cover: { height: 220, borderRadius: radius.xl },
  progressTrack: { height: 3 },
  headerButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  tag: { paddingHorizontal: space.md, paddingVertical: 6, borderRadius: radius.pill },
});
