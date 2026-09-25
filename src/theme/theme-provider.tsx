import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { palette, type ColorScheme, type Palette } from './tokens';
import { useLibrary } from '@/state/library';

type ThemeValue = { scheme: ColorScheme; colors: Palette };

const ThemeContext = createContext<ThemeValue>({ scheme: 'light', colors: palette.light });

/** Resolves the app theme from the user's preference (system / light / dark). */
export function AppThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const { settings } = useLibrary();
  const scheme: ColorScheme =
    settings.theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : settings.theme;

  const value = useMemo(() => ({ scheme, colors: palette[scheme] }), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
