export const SITE_URL = 'https://uppr.com.ua';

export const links = {
  training: 'https://englishplus.com.ua/',
  course: 'https://www.udemy.com/course/deschool-your-emails/',
  publicOffer: `${SITE_URL}/public/public-offer`,
  telegram: 'https://t.me/emailingskills',
  instagram: 'https://www.instagram.com/ivanna.tabachuk',
  facebook: 'https://www.facebook.com/ivanna.tabachuk',
  linkedin: 'https://www.linkedin.com/in/ivannatabachuk',
} as const;

export const absoluteUrl = (path: string) =>
  path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
