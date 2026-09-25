import { useCallback, useEffect, useState } from 'react';

import { ArticleError, fetchArticle, readCachedArticle } from './api';
import type { ParsedArticle } from './parse-article';

type State = {
  article: ParsedArticle | null;
  loading: boolean;
  refreshing: boolean;
  error: ArticleError | null;
  /** True when showing a cached copy because the network failed. */
  offline: boolean;
};

const initialState: State = { article: null, loading: true, refreshing: false, error: null, offline: false };

type SetState = (update: (s: State) => State) => void;

/** Fetch from the site; on failure fall back to whatever is already on screen. */
async function revalidate(slug: string, setState: SetState, isActive: () => boolean) {
  try {
    const fresh = await fetchArticle(slug);
    if (isActive()) setState(() => ({ article: fresh, loading: false, refreshing: false, error: null, offline: false }));
  } catch (e) {
    if (!isActive()) return;
    const error = e instanceof ArticleError ? e : new ArticleError(String(e), 'server');
    setState((s) => ({
      ...s,
      loading: false,
      refreshing: false,
      error: s.article ? null : error,
      offline: Boolean(s.article),
    }));
  }
}

/** Stale-while-revalidate: show the cached copy instantly, then refresh from the site. */
export function useArticle(slug: string) {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    let active = true;
    const isActive = () => active;
    (async () => {
      const cached = await readCachedArticle(slug);
      if (!active) return;
      setState(() => (cached ? { ...initialState, article: cached, loading: false } : initialState));
      await revalidate(slug, setState, isActive);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: !s.article, error: null }));
    revalidate(slug, setState, () => true);
  }, [slug]);

  const refresh = useCallback(() => {
    setState((s) => ({ ...s, refreshing: true, error: null }));
    revalidate(slug, setState, () => true);
  }, [slug]);

  return { ...state, reload, refresh };
}
