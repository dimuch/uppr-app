import { articleUrl } from '@/data/articles';
import { parseArticleHtml, type ParsedArticle } from './parse-article';
import { storage } from './storage';

const CACHE_VERSION = 1;
const cacheKey = (slug: string) => `article:v${CACHE_VERSION}:${slug}`;

type CachedArticle = { savedAt: number; article: ParsedArticle };

export class ArticleError extends Error {
  constructor(
    message: string,
    public readonly kind: 'offline' | 'server' | 'empty',
  ) {
    super(message);
  }
}

const TIMEOUT_MS = 15000;

export async function fetchArticle(slug: string): Promise<ParsedArticle> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(articleUrl(slug), { signal: controller.signal, headers: { Accept: 'text/html' } });
  } catch {
    throw new ArticleError('Немає з’єднання з сайтом', 'offline');
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new ArticleError(`Сайт повернув помилку ${res.status}`, 'server');

  const article = parseArticleHtml(await res.text());
  if (!article.blocks.length) throw new ArticleError('Не вдалося прочитати статтю', 'empty');

  await storage.set<CachedArticle>(cacheKey(slug), { savedAt: Date.now(), article });
  return article;
}

export const readCachedArticle = async (slug: string) =>
  (await storage.get<CachedArticle | null>(cacheKey(slug), null))?.article ?? null;

export const removeCachedArticle = (slug: string) => storage.remove(cacheKey(slug));
