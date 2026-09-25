import { SITE_URL } from './site';

export type CategoryId = 'emails' | 'kiss' | 'case-study' | 'hr' | 'business-english';

export type Category = { id: CategoryId; label: string; description: string };

export const categories: Category[] = [
  { id: 'emails', label: 'Імейли', description: 'Фолоапи, шаблони, ділове листування' },
  { id: 'kiss', label: 'KISS', description: 'Keep it short and simple' },
  { id: 'case-study', label: 'Кейси', description: 'Розбори реальних імейлів' },
  { id: 'hr', label: 'HR', description: 'Резюме та співбесіди' },
  { id: 'business-english', label: 'English', description: 'Як вчити англійську з розумом' },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;

export type ArticleMeta = {
  slug: string;
  title: string;
  category: CategoryId;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  tags: string[];
  minutes: number;
  /** Override when the cover doesn't follow the `<slug>_main.webp` convention. */
  cover?: string;
};

/**
 * Article catalog (metadata only). Bodies are fetched live from uppr.com.ua.
 * Not included: `ten-odd-words-in-emails` (returns HTTP 500 on the site as of 2026-09-25).
 */
export const articles: ArticleMeta[] = [
  { slug: 'reader-eXperience-RX', title: 'Reader eXperience (RX) або як стати дизайнером власних імейлів', category: 'emails', date: '2022-04-11', tags: ['kissemails', 'RX'], minutes: 5 },
  { slug: 'professional-follow-up-dont-write-a-trash', title: 'Професійний фолоап або як не писати різний треш, коли вам не відповідають', category: 'emails', date: '2022-03-08', tags: ['kissemails', 'followup', 'RX'], minutes: 6 },
  { slug: 'not-sure-if-you-saw-my-last-email', title: 'Пасивно-агресивні фолоапи або Not sure if you saw my last email', category: 'emails', date: '2022-03-01', tags: ['followup', 'kissemails', 'template'], minutes: 4 },
  { slug: 'case-study-delivery-director-fail-email', title: 'Case study: Delivery Director Failemail', category: 'case-study', date: '2022-01-10', tags: ['template', 'RX'], minutes: 4 },
  { slug: 'case-study-can-u-catch-me-up', title: 'Case study: Can u catch me up', category: 'case-study', date: '2022-01-09', tags: ['template', 'RX'], minutes: 3 },
  { slug: 'stupid-emails-introductions', title: 'Stupid Emails Introductions або як не варто починати імейл', category: 'kiss', date: '2021-12-26', tags: ['kissemails', 'RX', 'vocabulary'], minutes: 5 },
  { slug: 'context-is-the-king', title: 'Контекст — король або мантра для ефективних імейлів', category: 'emails', date: '2021-12-01', tags: ['template', 'RX'], minutes: 4 },
  { slug: 'ten-odd-words-in-emails-2', title: '10 «зайвих» слів у вашому імейлі — частина 2', category: 'kiss', date: '2021-11-23', tags: ['kissemails', 'ghostphrase', 'RX'], minutes: 4 },
  { slug: 'to-meet-or-not-to-meet', title: 'To meet or not to meet', category: 'emails', date: '2021-10-10', tags: ['kissemails', 'RX', 'meeting', 'template'], minutes: 4 },
  { slug: 'captain-obvious-is-writing', title: 'Пише Капітан Очевидність…', category: 'kiss', date: '2021-08-20', tags: ['kissemails', 'bugs'], minutes: 7 },
  { slug: 'kiss-emails', title: 'KISS імейли', category: 'kiss', date: '2021-08-08', tags: ['kissemails', 'RX'], minutes: 5 },
  { slug: 'thanks-in-advance', title: 'Наперед вдячний! Чи не такий уже і вдячний?', category: 'emails', date: '2021-07-31', tags: ['kissemails', 'RX', 'template'], minutes: 5 },
  { slug: 'get-your-emails-read', title: 'Як писати імейли, на які відповідають?', category: 'kiss', date: '2021-07-02', tags: ['kissemails', 'RX'], minutes: 5 },
  { slug: 'very-looong-emails', title: 'Причини ваших ну дуже дооовгих імейлів', category: 'kiss', date: '2021-06-24', tags: ['kissemails', 'RX'], minutes: 4 },
  { slug: 'bullshit-free-sales-emails', title: 'Bullsh*t-free sales emails', category: 'emails', date: '2021-06-03', tags: ['kissemails', 'sales', 'template'], minutes: 4 },
  { slug: 'english-learning-or-new-type-of-procrastination', title: 'Вивчення англійської — новий вид прокрастинації?', category: 'business-english', date: '2021-05-20', tags: ['learningtips'], minutes: 2 },
  { slug: 'thank-you-for-the-interview', title: 'Імейл-подяка після співбесіди', category: 'hr', date: '2021-05-01', tags: ['job interview', 'template', 'RX'], minutes: 5 },
  { slug: 'case-study-followup-fail-email-typical-bug', title: 'Case study: Followup Failemail + Typical Bug', category: 'case-study', date: '2021-04-02', tags: ['followup', 'bugs', 'sales'], minutes: 5 },
  { slug: 'subject-line', title: 'Тема імейлу: KISS tool', category: 'kiss', date: '2021-03-14', tags: ['kissemails', 'template'], minutes: 5 },
  { slug: 'hope-you-are-well', title: 'Hope you are well! No?', category: 'emails', date: '2021-02-09', tags: ['kissemails', 'RX', 'ghostphrase'], minutes: 4 },
  { slug: 'strong-words-instead-of-very', title: 'Strong words (instead of very)', category: 'kiss', date: '2020-11-14', tags: ['kissemails', 'resume', 'vocabulary'], minutes: 2 },
  { slug: 'photo-zvit-spalah-dnipro', title: 'Фото-звіт: воркшоп про email-комунікації англійською, SPALAH, Дніпро', category: 'business-english', date: '2020-11-04', tags: ['kissemails'], minutes: 2 },
  { slug: 'asap', title: 'Прочитайте це ASAP', category: 'emails', date: '2020-10-24', tags: ['kissemails', 'RX', 'vocabulary'], minutes: 4 },
  { slug: 'action-verbs-for-resume', title: 'Action verbs for resume', category: 'hr', date: '2020-09-14', tags: ['resume', 'vocabulary'], minutes: 2 },
  { slug: 'need-of-the-day-off', title: 'Як попросити про day off?', category: 'emails', date: '2020-08-14', tags: ['template'], minutes: 4 },
  { slug: 'please-find-attached-2', title: 'Не please find attached єдиним', category: 'kiss', date: '2020-07-21', tags: ['kissemails', 'vocabulary', 'RX'], minutes: 3 },
  { slug: 'please-find-attached', title: 'Хоч please find attached нам залиште', category: 'kiss', date: '2020-07-18', tags: ['kissemails', 'vocabulary', 'RX'], minutes: 4 },
  { slug: 'four-sticky-work-situations', title: '4 делікатних ситуації на роботі + шаблон імейлу на кожну', category: 'emails', date: '2020-07-01', tags: ['kissemails', 'template'], minutes: 4, cover: `${SITE_URL}/assets/images/blog-articles/four_sticky_situations_main.jpg` },
  { slug: 'acronyms-which-you-should-use-in-emails', title: '10 акронімів, які ви даремно не використовуєте в імейлах', category: 'kiss', date: '2020-06-03', tags: ['kissemails', 'vocabulary'], minutes: 3 },
  { slug: 'best-is-not-always-the-best', title: '«Best» — не завжди the best', category: 'emails', date: '2020-05-25', tags: ['RX', 'vocabulary'], minutes: 2 },
  { slug: 'i-am-writing-to-inform', title: 'Case study: «I am writing to inform…» або олдскульна класика', category: 'case-study', date: '2020-05-13', tags: ['kissemails', 'RX', 'template'], minutes: 3 },
  { slug: 'junk-phrases-in-emails', title: '«Капосні» фрази у вашому імейлі', category: 'kiss', date: '2020-04-19', tags: ['kissemails', 'RX', 'vocabulary'], minutes: 5 },
  { slug: 'films-on-english-kings-speech', title: 'Фільми англіською #1 — Король говорить', category: 'business-english', date: '2020-04-01', tags: ['films', 'vocabulary'], minutes: 7 },
  { slug: 'english-way-out', title: 'Як стати на шлях англійської і вже не відступати?', category: 'business-english', date: '2020-02-01', tags: ['learningtips', 'template', 'kissemails'], minutes: 4 },
  { slug: 'ten-no-phrases-for-your-own-CV', title: '10 NO-фраз для вашого CV або не дражни рекрутера!', category: 'hr', date: '2019-10-17', tags: ['resume'], minutes: 5 },
  { slug: 'follow-up-letter-friendly-reminder', title: 'Лист-дружнє нагадування або Follow Up Letter', category: 'emails', date: '2019-09-22', tags: ['template', 'followup'], minutes: 3 },
  { slug: 'watching-cartoons-in-english-tangled', title: 'Дивимося мультики англіською #3 — Tangled', category: 'business-english', date: '2019-08-28', tags: ['cartoons', 'vocabulary'], minutes: 5 },
  { slug: 'learning-english-with-blogs', title: 'Вчимо англійську з… блогами', category: 'business-english', date: '2019-08-18', tags: ['learningtips'], minutes: 4 },
  { slug: 'watching-cartoons-in-english-frozen', title: 'Дивимося мультики англіською #2 — Frozen', category: 'business-english', date: '2019-08-05', tags: ['cartoons', 'vocabulary'], minutes: 5 },
  { slug: 'watching-cartoons-in-english-rio', title: 'Дивимося мультики англіською #1 — Ріо', category: 'business-english', date: '2019-07-25', tags: ['cartoons', 'vocabulary'], minutes: 3 },
  { slug: 'english-in-KISS-style', title: 'Англійська в стилі KISS. Абревіатури', category: 'kiss', date: '2019-07-11', tags: ['kissemails', 'vocabulary'], minutes: 2 },
  { slug: 'eighty-twenty-how-to-learn-right', title: '80/20 або як не вчити все підряд', category: 'business-english', date: '2019-05-27', tags: ['learningtips'], minutes: 4 },
];

export const featuredSlugs = ['reader-eXperience-RX', 'kiss-emails', 'please-find-attached-2'];

const bySlug = new Map(articles.map((a) => [a.slug, a]));
export const getArticleMeta = (slug: string) => bySlug.get(slug);

export const coverUrl = (a: Pick<ArticleMeta, 'slug' | 'cover'>, width: 320 | 640 | 750 = 640) =>
  a.cover ??
  `${SITE_URL}/assets/images/blog-articles/responsive/${width}/${a.slug.replace(/-/g, '_')}_main.webp`;

export const articleUrl = (slug: string) => `${SITE_URL}/blog/articles/${slug}`;

const months = ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'];
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
};

export const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort();
