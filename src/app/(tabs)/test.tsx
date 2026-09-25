import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Button } from '@/components/states';
import { TabScreen } from '@/components/tab-screen';
import { Text } from '@/components/text';
import { levelFor, levels, quiz as questions } from '@/data/quiz';
import { useLibrary } from '@/state/library';
import { useTheme } from '@/theme/theme-provider';
import { gradients, radius, space } from '@/theme/tokens';

const features: { icon: IconName; text: string }[] = [
  { icon: 'clock', text: `${questions.length} питань, близько 2 хвилин` },
  { icon: 'sparkles', text: 'Пояснення після кожної відповіді' },
  { icon: 'trophy', text: 'Рівень і персональні рекомендації' },
];

export default function TestScreen() {
  const { colors } = useTheme();
  const { quiz } = useLibrary();

  return (
    <TabScreen title="Email Level Test" subtitle="Перевірте, наскільки ваші імейли KISS.">
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Icon name="test" size={40} color="#fff" />
        <Text variant="title" style={{ color: '#fff' }}>
          {quiz ? levelFor(quiz.best).title : 'Готові?'}
        </Text>
        <Text variant="callout" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {quiz
            ? `Найкращий результат: ${quiz.best} з ${quiz.total}. Спробуйте ще раз!`
            : 'Оберіть найкращий варіант у кожній робочій ситуації.'}
        </Text>
      </LinearGradient>

      <View style={{ gap: space.md, marginTop: space.xl }}>
        {features.map((f) => (
          <View key={f.text} style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primarySoft }]}>
              <Icon name={f.icon} size={18} color={colors.primary} />
            </View>
            <Text variant="callout">{f.text}</Text>
          </View>
        ))}
      </View>

      <Button
        label={quiz ? 'Пройти ще раз' : 'Почати тест'}
        icon="arrowRight"
        onPress={() => router.push('/quiz')}
        style={{ marginTop: space.xxl }}
      />

      <View style={{ marginTop: space.xxl, gap: space.md }}>
        <Text variant="heading">Рівні</Text>
        {levels.map((l, i) => {
          const max = levels[i + 1] ? levels[i + 1].min - 1 : questions.length;
          return (
            <View key={l.title} style={[styles.level, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text variant="subheading">{l.title}</Text>
              <Text variant="caption" color="textTertiary">
                {l.min}–{max} правильних
              </Text>
              <Text variant="caption" color="textSecondary">
                {l.description}
              </Text>
            </View>
          );
        })}
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: space.xl, gap: space.sm },
  feature: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  featureIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  level: { padding: space.lg, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, gap: 2 },
});
