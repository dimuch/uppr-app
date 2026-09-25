import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { openLink } from '@/components/article-body';
import { Card, ListRow } from '@/components/list-row';
import { SectionHeader } from '@/components/section-header';
import { Text } from '@/components/text';
import { articles } from '@/data/articles';
import { caseStudies } from '@/data/resources';
import { useTheme } from '@/theme/theme-provider';
import { MAX_CONTENT_WIDTH, space } from '@/theme/tokens';

export default function CaseStudiesScreen() {
  const { colors } = useTheme();
  const blogCases = articles.filter((a) => a.category === 'case-study');
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: space.xl, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }}>
      <Text color="textSecondary" style={{ marginBottom: space.lg }}>
        Turning missteps into mastery: як перетворити невдалий імейл на сильний.
      </Text>
      <Card>
        {caseStudies.map((c) => (
          <ListRow key={c.id} icon="briefcase" tint="accent" title={c.title} subtitle={c.subtitle} trailing="external" onPress={() => openLink(c.url)} />
        ))}
      </Card>
      <View style={{ marginTop: space.xxl }}>
        <SectionHeader title="Кейси в блозі" action="Всі" onAction={() => router.push({ pathname: '/blog', params: { category: 'case-study' } })} />
        {blogCases.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </View>
    </ScrollView>
  );
}
