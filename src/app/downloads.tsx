import { ScrollView } from 'react-native';

import { openLink } from '@/components/article-body';
import { Card, ListRow } from '@/components/list-row';
import { Text } from '@/components/text';
import { downloads } from '@/data/resources';
import { useTheme } from '@/theme/theme-provider';
import { MAX_CONTENT_WIDTH, space } from '@/theme/tokens';

export default function DownloadsScreen() {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: space.xl, gap: space.lg, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }}>
      <Text color="textSecondary">Безкоштовні шпаргалки та шаблони. PDF відкриваються у вбудованому переглядачі, звідки їх можна зберегти або поділитися.</Text>
      <Card>
        {downloads.map((d) => (
          <ListRow
            key={d.id}
            icon={d.kind === 'pdf' ? 'download' : 'doc'}
            title={d.title}
            subtitle={`${d.subtitle} · ${d.kind === 'pdf' ? 'PDF' : 'Гайд'} · Free`}
            trailing={d.kind === 'pdf' ? 'download' : 'external'}
            onPress={() => openLink(d.url)}
          />
        ))}
      </Card>
    </ScrollView>
  );
}
