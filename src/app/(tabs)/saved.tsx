import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/states';
import { TabScreen } from '@/components/tab-screen';
import { getArticleMeta, type ArticleMeta } from '@/data/articles';
import { useLibrary } from '@/state/library';
import { space } from '@/theme/tokens';

type Filter = 'bookmarks' | 'history';

export default function SavedScreen() {
  const { bookmarks, history } = useLibrary();
  const [filter, setFilter] = useState<Filter>('bookmarks');

  const items = useMemo(() => {
    const source =
      filter === 'bookmarks'
        ? Object.entries(bookmarks).sort((a, b) => b[1] - a[1])
        : Object.entries(history).sort((a, b) => b[1].lastReadAt - a[1].lastReadAt);
    return source.map(([slug]) => getArticleMeta(slug)).filter((a): a is ArticleMeta => a != null);
  }, [filter, bookmarks, history]);

  return (
    <TabScreen title="Збережене" subtitle="Збережені статті доступні офлайн.">
      <View style={{ flexDirection: 'row', gap: space.sm, marginBottom: space.lg }}>
        <Chip label={`Закладки · ${Object.keys(bookmarks).length}`} selected={filter === 'bookmarks'} onPress={() => setFilter('bookmarks')} />
        <Chip label="Історія" selected={filter === 'history'} onPress={() => setFilter('history')} />
      </View>
      {items.length === 0 ? (
        <EmptyState
          icon={filter === 'bookmarks' ? 'bookmark' : 'clock'}
          title={filter === 'bookmarks' ? 'Поки порожньо' : 'Ви ще нічого не читали'}
          message={
            filter === 'bookmarks'
              ? 'Натисніть на закладку у статті, щоб зберегти її тут і читати без інтернету.'
              : 'Тут з’являться статті, які ви відкривали.'
          }
          action="До блогу"
          onAction={() => router.push('/blog')}
        />
      ) : (
        items.map((a) => <ArticleCard key={a.slug} article={a} />)
      )}
    </TabScreen>
  );
}
