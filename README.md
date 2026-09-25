# UPPR — mobile app

Native iOS/Android companion to [uppr.com.ua](https://uppr.com.ua), built with Expo SDK 57 + Expo Router.

## Run it on your phone

```bash
npm start            # starts Metro; scan the QR code with Expo Go
npm start -- --tunnel  # if phone and Mac are on different networks
```

Other scripts: `npm run web`, `npx tsc --noEmit`, `npm run lint`.

## How content works

- `src/data/articles.ts` — article catalog (slug, title, category, date, tags, reading time). Add new posts here.
- Article bodies are fetched live from uppr.com.ua and parsed into native blocks by `src/lib/parse-article.ts`
  (headings, paragraphs, lists, highlighted phrases, email examples, image grids, embeds).
- Opened articles are cached on-device; bookmarked ones stay available offline.
- `src/data/quiz.ts` — Email Level Test questions (sample set; replace with the official questions).
- `src/data/resources.ts` — downloads and case studies; `src/data/site.ts` — external links.

## Structure

```
src/app/(tabs)/     Home, Blog, Test, Saved, More (native tab bar; web uses a floating bar)
src/app/article/    Reader: progress bar, text size, share, bookmark, offline copy
src/app/quiz.tsx    Full-screen quiz flow
src/components/     Design-system components
src/theme/          Tokens (colors, type, spacing) + light/dark theme provider
src/state/          Bookmarks, reading history, settings, quiz record (AsyncStorage)
```

Links like `https://uppr.com.ua/blog/articles/<slug>` are mapped to the in-app reader by `src/app/+native-intent.tsx`
(needs universal links / app links configured before a store release).

Note: in the web preview, article bodies can't load because the site doesn't send CORS headers. On iOS/Android they load normally.
