import { Tabs, TabList, TabSlot, TabTrigger, type TabListProps, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from './icon';
import { Text } from './text';
import { useTheme } from '@/theme/theme-provider';
import { radius, space } from '@/theme/tokens';

const tabs: { name: string; href: '/' | '/blog' | '/test' | '/saved' | '/more'; label: string; icon: IconName }[] = [
  { name: 'index', href: '/', label: 'Головна', icon: 'home' },
  { name: 'blog', href: '/blog', label: 'Блог', icon: 'blog' },
  { name: 'test', href: '/test', label: 'Тест', icon: 'test' },
  { name: 'saved', href: '/saved', label: 'Збережене', icon: 'saved' },
  { name: 'more', href: '/more', label: 'Ще', icon: 'more' },
];

/** Web fallback: a floating pill tab bar (native tabs are iOS/Android only). */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <FloatingBar>
          {tabs.map((t) => (
            <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
              <TabButton icon={t.icon}>{t.label}</TabButton>
            </TabTrigger>
          ))}
        </FloatingBar>
      </TabList>
    </Tabs>
  );
}

function FloatingBar({ children, ...props }: TabListProps) {
  const { colors } = useTheme();
  return (
    <View {...props} style={styles.bar}>
      <View style={[styles.inner, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

function TabButton({ children, isFocused, icon, ...props }: TabTriggerSlotProps & { icon: IconName }) {
  const { colors } = useTheme();
  return (
    <Pressable {...props} style={[styles.button, isFocused && { backgroundColor: colors.primarySoft }]}>
      <Icon name={icon} size={20} color={isFocused ? colors.primary : colors.textTertiary} />
      <Text variant="caption" style={{ color: isFocused ? colors.primary : colors.textTertiary, fontSize: 11 }}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', bottom: space.lg, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  inner: {
    flexDirection: 'row',
    gap: space.xs,
    padding: space.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  button: { alignItems: 'center', gap: 2, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.pill, minWidth: 64 },
});
