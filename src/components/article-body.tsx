import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { Fragment } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';

import { Icon } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import type { Block, Inline } from '@/lib/parse-article';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

export const openLink = (url: string) => WebBrowser.openBrowserAsync(url, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET });

function Inlines({ inlines }: { inlines: Inline[] }) {
  const { colors } = useTheme();
  return (
    <>
      {inlines.map((run, i) => (
        <RNText
          key={i}
          onPress={run.href ? () => openLink(run.href!) : undefined}
          accessibilityRole={run.href ? 'link' : undefined}
          style={[
            run.bold && { fontWeight: '700' },
            run.italic && { fontStyle: 'italic' },
            run.href && { color: colors.primary, textDecorationLine: 'underline' },
          ]}>
          {run.text}
        </RNText>
      ))}
    </>
  );
}

const embedLabel = (url: string) =>
  /youtube|youtu\.be|vimeo/.test(url)
    ? { icon: 'video' as const, title: 'Дивитися відео', subtitle: 'Відкриється у вбудованому браузері' }
    : { icon: 'doc' as const, title: 'Відкрити матеріал', subtitle: 'Документ або таблиця' };

export function ArticleBody({ blocks, scale = 1 }: { blocks: Block[]; scale?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.lg }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <Text key={i} variant="heading" scale={scale} accessibilityRole="header" style={{ marginTop: space.md }}>
                {block.text}
              </Text>
            );
          case 'subheading':
            return (
              <Text key={i} variant="subheading" scale={scale} accessibilityRole="header">
                {block.text}
              </Text>
            );
          case 'paragraph':
            return (
              <Text key={i} scale={scale} selectable style={{ lineHeight: 26 * scale }}>
                <Inlines inlines={block.inlines} />
              </Text>
            );
          case 'list':
            return (
              <View key={i} style={{ gap: space.sm }}>
                {block.items.map((item, j) => (
                  <View key={j} style={{ flexDirection: 'row', gap: space.md }}>
                    <View style={[styles.dot, { backgroundColor: colors.primary, marginTop: 10 * scale }]} />
                    <Text scale={scale} selectable style={{ flex: 1, lineHeight: 26 * scale }}>
                      <Inlines inlines={item} />
                    </Text>
                  </View>
                ))}
              </View>
            );
          case 'phrase':
            return (
              <View key={i} style={[styles.phrase, { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}>
                <Icon name="quote" size={18} color={colors.primary} />
                <Text variant="subheading" scale={scale} selectable>
                  {block.text}
                </Text>
              </View>
            );
          case 'example':
            return (
              <View key={i} style={[styles.example, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.exampleHeader, { borderColor: colors.border }]}>
                  <Icon name="mail" size={14} color={colors.textSecondary} />
                  <Text variant="overline" color="textSecondary">
                    {(block.title ?? 'Приклад').toUpperCase()}
                  </Text>
                </View>
                <Text scale={scale} selectable style={{ padding: space.lg, lineHeight: 25 * scale }}>
                  <Inlines inlines={block.inlines} />
                </Text>
              </View>
            );
          case 'images':
            return (
              <View key={i} style={styles.grid}>
                {block.urls.map((url) => (
                  <Image
                    key={url}
                    source={{ uri: url }}
                    style={[styles.image, { width: block.urls.length > 1 ? '48.5%' : '100%', backgroundColor: colors.surfaceMuted }]}
                    contentFit="cover"
                    transition={200}
                    accessibilityIgnoresInvertColors
                  />
                ))}
              </View>
            );
          case 'embed': {
            const e = embedLabel(block.url);
            return (
              <PressableScale
                key={i}
                haptic
                onPress={() => openLink(block.url)}
                accessibilityRole="link"
                style={[styles.embed, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.embedIcon, { backgroundColor: colors.accentSoft }]}>
                  <Icon name={e.icon} size={22} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="callout" weight="700">
                    {e.title}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {e.subtitle}
                  </Text>
                </View>
                <Icon name="external" size={16} color={colors.textTertiary} />
              </PressableScale>
            );
          }
          default:
            return <Fragment key={i} />;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { width: 6, height: 6, borderRadius: 3 },
  phrase: { borderLeftWidth: 3, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  example: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: '3%', rowGap: space.sm } as object,
  image: { aspectRatio: 4 / 3, borderRadius: radius.md },
  embed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  embedIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
