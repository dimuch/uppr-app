/**
 * Generates the app icon, Android adaptive icon layers, splash icon and favicon
 * from a single vector "[UP]" mark. Run: `npm run icons`
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../assets/images/', import.meta.url);
const BRAND = new URL('../assets/brand/', import.meta.url);

const PINK = '#E0559F';
const VIOLET = '#7B61FF';
const ORANGE = '#FF9320';

/** Mark geometry in its own coordinate space (~704 x 336, including stroke). */
const MARK = { cx: 346, cy: 200, width: 704, stroke: 58 };
const bracketsPath = 'M68 60 H23 V340 H68 M624 60 H669 V340 H624';
const upPath = 'M160 60 V250 A85 85 0 0 0 330 250 V60 M400 340 V60 H460 A72 72 0 0 1 460 204 H400';

/** Places the mark centered in a `size` canvas at `widthRatio` of the canvas width. */
function mark(size, widthRatio, { letters, brackets }) {
  const scale = (size * widthRatio) / MARK.width;
  const tx = size / 2 - MARK.cx * scale;
  const ty = size / 2 - MARK.cy * scale;
  return `
    <g transform="translate(${tx} ${ty}) scale(${scale})" fill="none" stroke-width="${MARK.stroke}"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="${bracketsPath}" stroke="${brackets}" />
      <path d="${upPath}" stroke="${letters}" />
    </g>`;
}

const gradientDefs = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${PINK}" />
    <stop offset="1" stop-color="${VIOLET}" />
  </linearGradient>`;

const background = (size) => `
  <defs>
    ${gradientDefs('bg')}
    <radialGradient id="glow" cx="0.22" cy="0.18" r="0.75">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28" />
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" />
  <rect width="${size}" height="${size}" fill="url(#glow)" />`;

const svg = (size, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;

const white = { letters: '#FFFFFF', brackets: 'rgba(255,255,255,0.62)' };

const assets = {
  // iOS + fallback icon: full-bleed square, no transparency (the OS applies the corner mask).
  'icon.png': svg(1024, background(1024) + mark(1024, 0.62, white)),
  // Android adaptive icon: gradient layer + mark inside the 66% safe zone.
  'android-icon-background.png': svg(1024, background(1024)),
  'android-icon-foreground.png': svg(1024, mark(1024, 0.46, white)),
  'android-icon-monochrome.png': svg(1024, mark(1024, 0.46, { letters: '#FFFFFF', brackets: '#FFFFFF' })),
  // Splash: brand-gradient mark on transparent, works on light and dark backgrounds.
  'splash-icon.png': svg(
    1024,
    `<defs><linearGradient id="mk" gradientUnits="userSpaceOnUse" x1="40" y1="60" x2="620" y2="340">
       <stop offset="0" stop-color="${PINK}" /><stop offset="1" stop-color="${VIOLET}" /></linearGradient></defs>` +
      mark(1024, 0.9, { letters: 'url(#mk)', brackets: ORANGE }),
  ),
  'favicon.png': svg(1024, background(1024) + mark(1024, 0.7, white)),
};

const sizes = { 'favicon.png': 64 };

await mkdir(OUT, { recursive: true });
await mkdir(BRAND, { recursive: true });
for (const [file, source] of Object.entries(assets)) {
  const size = sizes[file] ?? 1024;
  await sharp(Buffer.from(source)).resize(size, size).png({ compressionLevel: 9 }).toFile(new URL(file, OUT).pathname);
  console.log(`✔ assets/images/${file} (${size}px)`);
}
await writeFile(new URL('uppr-mark.svg', BRAND), assets['splash-icon.png']);
await writeFile(new URL('app-icon.svg', BRAND), assets['icon.png']);
console.log('✔ assets/brand/*.svg (editable sources)');
