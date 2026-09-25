import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArticleCard } from '@/components/article-card';
import { Chip } from '@/components/chip';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { EmptyState } from '@/components/states';
import { WEB_TAB_BAR_SPACE } from '@/components/tab-screen';
import { Text } from '@/components/text';
import { articles, categories, type CategoryId } from '@/data/articles';
import { useTheme } from '@/theme/theme-provider';
import { MAX_CONTENT_WIDTH, radius, space } from '@/theme/tokens';

const normalize = (s: string) => s.toLocaleLowerCase('uk').replace(/[«»"'’]/g, '');

export default function BlogScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: CategoryId }>();
  // A category passed in the route (e.g. from Home) wins until the user picks another chip.
  const [picked, setPicked] = useState<{ from?: string; value: CategoryId | 'all' }>({
    from: params.category,
    value: params.category ?? 'all',
  });
  const category = picked.from === params.category ? picked.value : (params.category ?? 'all');
  const setCategory = (value: CategoryId | 'all') => setPicked({ from: params.category, value });
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return articles.filter(
      (a) =>
        (category === 'all' || a.category === category) &&
        (!q || normalize(a.title).includes(q) || a.tags.some((t) => normalize(t).includes(q))),
    );
  }, [category, query]);

  const header = (
    <View style={{ gap: space.lg, marginBottom: space.md }}>
      <View style={{ gap: space.xs }}>
        <Text variant="title" accessibilityRole="header">
          Блог
        </Text>
        <Text variant="callout" color="textSecondary">
          {articles.length} статей про ділове листування англійською
        </Text>
      </View>
      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Icon name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Пошук: фолоап, subject, ASAP…"
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.text }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          accessibilityLabel="Пошук статей"
        />
        {query.length > 0 && Platform.OS !== 'ios' && (
          <PressableScale onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Очистити пошук">
            <Icon name="close" size={18} color={colors.textTertiary} />
          </PressableScale>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.xl }}
        style={{ marginHorizontal: -space.xl }}>
        <Chip label="Всі" selected={category === 'all'} onPress={() => setCategory('all')} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.label} selected={category === c.id} onPress={() => setCategory(c.id)} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      data={results}
      keyExtractor={(a) => a.slug}
      renderItem={({ item }) => <ArticleCard article={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState
          icon="search"
          title="Нічого не знайшли"
          message="Спробуйте інше слово або іншу тему."
          action="Скинути фільтри"
          onAction={() => {
            setQuery('');
            setCategory('all');
          }}
        />
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + space.md,
        paddingHorizontal: space.xl,
        paddingBottom: Platform.OS === 'web' ? WEB_TAB_BAR_SPACE : space.xxl,
        width: '100%',
        maxWidth: MAX_CONTENT_WIDTH,
        alignSelf: 'center',
      }}
      ItemSeparatorComponent={() => <View style={{ height: space.xs }} />}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: space.md, outlineStyle: 'none' } as object,
});
