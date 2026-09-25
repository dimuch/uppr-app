import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Appearance, Platform } from 'react-native';

import { removeCachedArticle } from '@/lib/api';
import { storage } from '@/lib/storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Settings = { textScale: number; theme: ThemePreference };
export type ReadingEntry = { progress: number; lastReadAt: number };
export type QuizRecord = { best: number; total: number; takenAt: number };

type LibraryData = {
  bookmarks: Record<string, number>;
  history: Record<string, ReadingEntry>;
  settings: Settings;
  quiz: QuizRecord | null;
};

const KEY = 'library:v1';
const initial: LibraryData = {
  bookmarks: {},
  history: {},
  settings: { textScale: 1, theme: 'system' },
  quiz: null,
};

type LibraryValue = LibraryData & {
  ready: boolean;
  isBookmarked: (slug: string) => boolean;
  toggleBookmark: (slug: string) => boolean;
  recordProgress: (slug: string, progress: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  saveQuizResult: (score: number, total: number) => void;
  clearHistory: () => void;
};

const LibraryContext = createContext<LibraryValue | null>(null);

export function LibraryProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<LibraryData>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    storage.get(KEY, initial).then((saved) => {
      setData({ ...initial, ...saved, settings: { ...initial.settings, ...saved.settings } });
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) storage.set(KEY, data);
  }, [data, ready]);

  // Keep native UI (tab bar, alerts, keyboard) in sync with the chosen theme.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    Appearance.setColorScheme?.(data.settings.theme === 'system' ? 'unspecified' : data.settings.theme);
  }, [data.settings.theme]);

  const toggleBookmark = useCallback((slug: string) => {
    let added = false;
    setData((d) => {
      const bookmarks = { ...d.bookmarks };
      if (bookmarks[slug]) {
        delete bookmarks[slug];
        removeCachedArticle(slug);
      } else {
        bookmarks[slug] = Date.now();
        added = true;
      }
      return { ...d, bookmarks };
    });
    return added;
  }, []);

  const recordProgress = useCallback((slug: string, progress: number) => {
    setData((d) => {
      const prev = d.history[slug]?.progress ?? 0;
      const next = Math.max(prev, Math.min(1, progress));
      if (next - prev < 0.02 && d.history[slug]) return d;
      return { ...d, history: { ...d.history, [slug]: { progress: next, lastReadAt: Date.now() } } };
    });
  }, []);

  const value = useMemo<LibraryValue>(
    () => ({
      ...data,
      ready,
      isBookmarked: (slug) => Boolean(data.bookmarks[slug]),
      toggleBookmark,
      recordProgress,
      updateSettings: (patch) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      saveQuizResult: (score, total) =>
        setData((d) => ({
          ...d,
          quiz: { best: Math.max(score, d.quiz?.best ?? 0), total, takenAt: Date.now() },
        })),
      clearHistory: () => setData((d) => ({ ...d, history: {} })),
    }),
    [data, ready, toggleBookmark, recordProgress],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>');
  return ctx;
}
