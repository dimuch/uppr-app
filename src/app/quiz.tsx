import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Button } from '@/components/states';
import { Text } from '@/components/text';
import { levelFor, quiz as questions } from '@/data/quiz';
import { useLibrary } from '@/state/library';
import { useTheme } from '@/theme/theme-provider';
import { gradients, MAX_CONTENT_WIDTH, radius, space } from '@/theme/tokens';

const haptic = (type: Haptics.NotificationFeedbackType) => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(type);
};

export default function QuizScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { saveQuizResult } = useLibrary();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const answered = picked !== null;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const correct = i === q.correct;
    if (correct) setScore((s) => s + 1);
    haptic(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      saveQuizResult(score, questions.length);
      setDone(true);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/test'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View style={styles.topBar}>
        <PressableScale onPress={close} hitSlop={12} accessibilityLabel="Закрити тест" style={[styles.close, { backgroundColor: colors.surfaceMuted }]}>
          <Icon name="close" size={18} color={colors.text} />
        </PressableScale>
        <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
          <View
            style={{
              width: `${((done ? questions.length : index + (answered ? 1 : 0)) / questions.length) * 100}%`,
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: 4,
            }}
          />
        </View>
        <Text variant="caption" color="textSecondary" style={{ minWidth: 36, textAlign: 'right' }}>
          {done ? questions.length : index + 1}/{questions.length}
        </Text>
      </View>

      {done ? (
        <Result score={score} onRestart={restart} onClose={close} bottomInset={insets.bottom} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.body}>
            <Text variant="heading">{q.prompt}</Text>
            {q.context && (
              <View style={[styles.context, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Icon name="mail" size={14} color={colors.textTertiary} />
                <Text variant="callout" color="textSecondary" style={{ flex: 1 }}>
                  {q.context}
                </Text>
              </View>
            )}
            <View style={{ gap: space.md, marginTop: space.lg }} accessibilityRole="radiogroup">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isPicked = i === picked;
                const state = !answered ? 'idle' : isCorrect ? 'correct' : isPicked ? 'wrong' : 'dim';
                const border =
                  state === 'correct' ? colors.success : state === 'wrong' ? colors.danger : isPicked ? colors.primary : colors.border;
                const bg = state === 'correct' ? colors.successSoft : colors.surface;
                return (
                  <PressableScale
                    key={opt}
                    onPress={() => choose(i)}
                    disabled={answered}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isPicked, disabled: answered }}
                    accessibilityLabel={`${opt}${answered && isCorrect ? ', правильна відповідь' : ''}`}
                    style={[styles.option, { borderColor: border, backgroundColor: bg, opacity: state === 'dim' ? 0.55 : 1 }]}>
                    <Text style={{ flex: 1 }}>{opt}</Text>
                    {state === 'correct' && <Icon name="check" size={18} color={colors.success} />}
                    {state === 'wrong' && <Icon name="xmark" size={18} color={colors.danger} />}
                  </PressableScale>
                );
              })}
            </View>
            {answered && (
              <View style={[styles.explain, { backgroundColor: colors.primarySoft }]} accessibilityLiveRegion="polite">
                <Text variant="callout" weight="700" color={picked === q.correct ? 'success' : 'danger'}>
                  {picked === q.correct ? 'Так і є!' : 'Не зовсім.'}
                </Text>
                <Text variant="callout">{q.explanation}</Text>
              </View>
            )}
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg, borderColor: colors.border }]}>
            <Button
              label={index + 1 === questions.length ? 'Показати результат' : 'Далі'}
              icon="arrowRight"
              disabled={!answered}
              onPress={next}
            />
          </View>
        </>
      )}
    </View>
  );
}

function Result({ score, onRestart, onClose, bottomInset }: { score: number; onRestart: () => void; onClose: () => void; bottomInset: number }) {
  const level = levelFor(score);
  return (
    <ScrollView contentContainerStyle={[styles.body, { paddingBottom: bottomInset + space.xl, gap: space.xl }]}>
      <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.resultCard}>
        <Icon name="trophy" size={44} color="#fff" />
        <Text variant="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>
          ВАШ РІВЕНЬ
        </Text>
        <Text variant="hero" style={{ color: '#fff' }}>
          {level.title}
        </Text>
        <Text variant="heading" style={{ color: '#fff' }}>
          {score} з {questions.length}
        </Text>
        <Text variant="callout" center style={{ color: 'rgba(255,255,255,0.9)' }}>
          {level.description}
        </Text>
      </LinearGradient>
      <Button label="Читати статті KISS" onPress={() => { onClose(); router.push({ pathname: '/blog', params: { category: 'kiss' } }); }} />
      <Button kind="secondary" label="Пройти ще раз" onPress={onRestart} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.xl, paddingVertical: space.md, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  close: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  body: { padding: space.xl, gap: space.md, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  context: { flexDirection: 'row', gap: space.sm, padding: space.lg, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth },
  option: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, borderRadius: radius.lg, borderWidth: 1.5, minHeight: 56 },
  explain: { padding: space.lg, borderRadius: radius.lg, gap: space.xs, marginTop: space.md },
  footer: { paddingHorizontal: space.xl, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
  resultCard: { borderRadius: radius.xl, padding: space.xxl, alignItems: 'center', gap: space.sm },
});
