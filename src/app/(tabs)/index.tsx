import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ArticleCard } from '@/components/article-card';
import { openLink } from '@/components/article-body';
import { BrandMark } from '@/components/brand-mark';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { SectionHeader } from '@/components/section-header';
import { TabScreen } from '@/components/tab-screen';
import { Text } from '@/components/text';
import { articles, categories, featuredSlugs, getArticleMeta } from '@/data/articles';
import { caseStudies, downloads } from '@/data/resources';
import { links } from '@/data/site';
import { useLibrary } from '@/state/library';
import { useTheme } from '@/theme/theme-provider';
import { gradients, radius, space } from '@/theme/tokens';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { history, quiz } = useLibrary();

  const continueReading = useMemo(
    () =>
      Object.entries(history)
        .filter(([, h]) => h.progress > 0.02 && h.progress < 0.95)
        .sort((a, b) => b[1].lastReadAt - a[1].lastReadAt)
        .map(([slug]) => getArticleMeta(slug))
        .filter((a) => a != null)[0],
    [history],
  );

  const featured = getArticleMeta(featuredSlugs[0])!;
  const picks = featuredSlugs.slice(1).map((s) => getArticleMeta(s)!);
  const latest = articles.slice(1, 6);

  return (
    <TabScreen headerLeft={<BrandMark />}>
      <View style={{ gap: space.sm, marginBottom: space.xl }}>
        <Text variant="hero">
          Пишіть робочі імейли,{'\n'}
          <Text variant="hero" color="primary">
            які читають
          </Text>
        </Text>
        <Text variant="callout" color="textSecondary">
          Короткі поради, шаблони та розбори реальних листів.
        </Text>
      </View>

      {continueReading && (
        <View style={{ marginBottom: space.xl }}>
          <SectionHeader title="Продовжити читання" />
          <ArticleCard article={continueReading} />
        </View>
      )}

      <ArticleCard article={featured} variant="hero" />

      <PressableScale haptic onPress={() => router.push('/test')} style={{ marginTop: space.xl }}>
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.testCard}>
          <View style={{ flex: 1, gap: space.xs }}>
            <Text variant="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>
              EMAIL LEVEL TEST
            </Text>
            <Text variant="heading" style={{ color: '#fff' }}>
              {quiz ? `Ваш рекорд: ${quiz.best}/${quiz.total}` : 'Який у вас рівень імейлінгу?'}
            </Text>
            <Text variant="caption" style={{ color: 'rgba(255,255,255,0.85)' }}>
              8 питань · 2 хвилини
            </Text>
          </View>
          <View style={styles.testArrow}>
            <Icon name="arrowRight" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </PressableScale>

      <View style={styles.section}>
        <SectionHeader title="Теми" />
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <PressableScale
              key={c.id}
              haptic
              onPress={() => router.push({ pathname: '/blog', params: { category: c.id } })}
              style={[styles.categoryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text variant="subheading">{c.label}</Text>
              <Text variant="caption" color="textSecondary" numberOfLines={2}>
                {c.description}
              </Text>
            </PressableScale>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Добірка" action="Всі статті" onAction={() => router.push('/blog')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.md }} style={styles.bleed}>
          {picks.concat(latest.slice(0, 3)).map((a) => (
            <ArticleCard key={a.slug} article={a} variant="tile" />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Нове в блозі" />
        {latest.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Case Study" action="Всі" onAction={() => router.push('/case-studies')} />
        <View style={{ gap: space.md }}>
          {caseStudies.map((c) => (
            <PressableScale
              key={c.id}
              onPress={() => openLink(c.url)}
              accessibilityRole="link"
              style={[styles.caseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.caseIcon, { backgroundColor: colors.accentSoft }]}>
                <Icon name="briefcase" size={20} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="callout" weight="700">
                  {c.title}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {c.subtitle}
                </Text>
              </View>
              <Icon name="external" size={16} color={colors.textTertiary} />
            </PressableScale>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Безкоштовні матеріали" action="Всі" onAction={() => router.push('/downloads')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.md }} style={styles.bleed}>
          {downloads.map((d) => (
            <PressableScale
              key={d.id}
              onPress={() => openLink(d.url)}
              style={[styles.downloadCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name={d.kind === 'pdf' ? 'download' : 'doc'} size={22} color={colors.primary} />
              <Text variant="callout" weight="700" numberOfLines={2}>
                {d.title}
              </Text>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {d.kind === 'pdf' ? 'PDF · Free' : 'Гайд · Free'}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, { gap: space.md }]}>
        <PressableScale onPress={() => openLink(links.course)} style={[styles.promo, { backgroundColor: colors.text }]}>
          <Icon name="school" size={26} color={colors.background} />
          <View style={{ flex: 1 }}>
            <Text variant="subheading" style={{ color: colors.background }}>
              Онлайн курс «Deschool your emails»
            </Text>
            <Text variant="caption" style={{ color: colors.background, opacity: 0.75 }}>
              На Udemy, у своєму темпі
            </Text>
          </View>
          <Icon name="external" size={16} color={colors.background} />
        </PressableScale>
      </View>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: space.xxl },
  bleed: { marginHorizontal: -space.xl, paddingHorizontal: space.xl },
  testCard: { borderRadius: radius.xl, padding: space.xl, flexDirection: 'row', alignItems: 'center', gap: space.lg },
  testArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  categoryCard: {
    flexGrow: 1,
    flexBasis: '45%',
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: space.xs,
    minHeight: 88,
  },
  caseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  caseIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  downloadCard: {
    width: 170,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: space.sm,
  },
  promo: { flexDirection: 'row', alignItems: 'center', gap: space.lg, padding: space.xl, borderRadius: radius.xl },
});
