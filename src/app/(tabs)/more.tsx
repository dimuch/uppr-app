import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Alert, Platform, View } from 'react-native';

import { openLink } from '@/components/article-body';
import { BrandMark } from '@/components/brand-mark';
import { Chip } from '@/components/chip';
import { Card, ListRow } from '@/components/list-row';
import { TabScreen } from '@/components/tab-screen';
import { Text } from '@/components/text';
import { links } from '@/data/site';
import { useLibrary, type ThemePreference } from '@/state/library';
import { space } from '@/theme/tokens';

const textSizes = [
  { label: 'A−', value: 0.9 },
  { label: 'A', value: 1 },
  { label: 'A+', value: 1.15 },
  { label: 'A++', value: 1.3 },
];
const themes: { label: string; value: ThemePreference }[] = [
  { label: 'Системна', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: space.xl, gap: space.sm }}>
      <Text variant="overline" color="textTertiary" style={{ marginLeft: space.xs }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

export default function MoreScreen() {
  const { settings, updateSettings, clearHistory } = useLibrary();

  const confirmClear = () => {
    if (Platform.OS === 'web') return clearHistory();
    Alert.alert('Очистити історію читання?', 'Закладки залишаться.', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Очистити', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <TabScreen title="Ще">
      <Group title="Навчання">
        <Card>
          <ListRow icon="download" title="Безкоштовні матеріали" subtitle="PDF-шпаргалки та гайди" onPress={() => router.push('/downloads')} />
          <ListRow icon="briefcase" title="Case Study" subtitle="Розбори реальних імейлів" onPress={() => router.push('/case-studies')} />
          <ListRow icon="people" title="Тренінг" subtitle="Корпоративне навчання на englishplus.com.ua" tint="accent" trailing="external" onPress={() => openLink(links.training)} />
          <ListRow icon="school" title="Онлайн курс" subtitle="Deschool your emails на Udemy" tint="accent" trailing="external" onPress={() => openLink(links.course)} />
        </Card>
      </Group>

      <Group title="Читання">
        <Card style={{ paddingVertical: space.lg, gap: space.lg }}>
          <View style={{ gap: space.sm }}>
            <Text variant="callout" weight="600">Розмір тексту</Text>
            <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
              {textSizes.map((s) => (
                <Chip key={s.label} label={s.label} selected={settings.textScale === s.value} onPress={() => updateSettings({ textScale: s.value })} />
              ))}
            </View>
          </View>
          <View style={{ gap: space.sm }}>
            <Text variant="callout" weight="600">Тема</Text>
            <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
              {themes.map((t) => (
                <Chip key={t.value} label={t.label} selected={settings.theme === t.value} onPress={() => updateSettings({ theme: t.value })} />
              ))}
            </View>
          </View>
        </Card>
        <Card>
          <ListRow icon="trash" title="Очистити історію читання" onPress={confirmClear} trailing={null} />
        </Card>
      </Group>

      <Group title="Спільнота">
        <Card>
          <ListRow icon="send" title="Telegram" subtitle="@emailingskills" trailing="external" onPress={() => openLink(links.telegram)} />
          <ListRow icon="camera" title="Instagram" trailing="external" onPress={() => openLink(links.instagram)} />
          <ListRow icon="people" title="Facebook" trailing="external" onPress={() => openLink(links.facebook)} />
          <ListRow icon="briefcase" title="LinkedIn" trailing="external" onPress={() => openLink(links.linkedin)} />
        </Card>
      </Group>

      <Group title="Інше">
        <Card>
          <ListRow icon="doc" title="Публічна оферта" trailing="external" onPress={() => openLink(links.publicOffer)} />
        </Card>
      </Group>

      <View style={{ alignItems: 'center', gap: space.xs, marginTop: space.md }}>
        <BrandMark size={18} />
        <Text variant="caption" color="textTertiary">
          Версія {Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </View>
    </TabScreen>
  );
}
