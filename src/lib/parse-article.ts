import { parseDocument } from 'htmlparser2';
import type { AnyNode, Element } from 'domhandler';

export type Inline = { text: string; bold?: boolean; italic?: boolean; href?: string };

export type Block =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; inlines: Inline[] }
  | { type: 'list'; items: Inline[][] }
  | { type: 'phrase'; text: string }
  | { type: 'example'; title?: string; inlines: Inline[] }
  | { type: 'images'; urls: string[] }
  | { type: 'embed'; url: string };

export type ParsedArticle = {
  title: string;
  description?: string;
  hero?: string;
  tags: string[];
  blocks: Block[];
};

const BASE = 'https://uppr.com.ua';

const isElement = (n: AnyNode): n is Element => n.type === 'tag' || n.type === 'script' || n.type === 'style';

/** CSS-module class names look like `file-module__hash__name`; match on the stable `__name` suffix. */
const hasClass = (el: Element, name: string) =>
  (el.attribs.class ?? '').split(/\s+/).some((c) => c === name || c.endsWith(`__${name}`));

const absolute = (url: string) => (url.startsWith('http') ? url : `${BASE}${url.startsWith('/') ? '' : '/'}${url}`);

function textOf(node: AnyNode): string {
  if (node.type === 'text') return (node as unknown as { data: string }).data;
  if (isElement(node)) {
    if (node.name === 'br') return '\n';
    return node.children.map(textOf).join('');
  }
  return '';
}

const clean = (s: string) =>
  s
    .replace(/[ \t\r\f\v ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();

function collectInlines(nodes: AnyNode[], style: Omit<Inline, 'text'> = {}, out: Inline[] = []): Inline[] {
  for (const node of nodes) {
    if (node.type === 'text') {
      const text = (node as unknown as { data: string }).data.replace(/\s+/g, ' ');
      if (text) out.push({ text, ...style });
    } else if (isElement(node)) {
      const tag = node.name;
      if (tag === 'br') out.push({ text: '\n', ...style });
      else if (tag === 'a' && node.attribs.href) collectInlines(node.children, { ...style, href: absolute(node.attribs.href) }, out);
      else if (tag === 'strong' || tag === 'b') collectInlines(node.children, { ...style, bold: true }, out);
      else if (tag === 'em' || tag === 'i') collectInlines(node.children, { ...style, italic: true }, out);
      else if (tag !== 'script' && tag !== 'style') collectInlines(node.children, style, out);
    }
  }
  return normalizeInlines(out);
}

/** Merge adjacent runs with identical style and trim the edges. */
function normalizeInlines(runs: Inline[]): Inline[] {
  const merged: Inline[] = [];
  for (const run of runs) {
    const prev = merged[merged.length - 1];
    if (prev && prev.bold === run.bold && prev.italic === run.italic && prev.href === run.href) prev.text += run.text;
    else merged.push({ ...run });
  }
  for (const r of merged) r.text = r.text.replace(/ *\n */g, '\n');
  if (merged.length) {
    merged[0].text = merged[0].text.replace(/^\s+/, '');
    const last = merged[merged.length - 1];
    last.text = last.text.replace(/\s+$/, '');
  }
  return merged.filter((r) => r.text.length > 0);
}

const STOP = Symbol('stop');

function walkSection(nodes: AnyNode[], blocks: Block[]): void | typeof STOP {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    const tag = node.name;

    if (hasClass(node, 'authorBlock') || hasClass(node, 'footerContainer')) return STOP;

    if (tag === 'h1') continue;
    if (tag === 'h2') {
      const text = clean(textOf(node));
      if (text) blocks.push({ type: 'heading', text });
    } else if (tag === 'h3' || tag === 'h4') {
      const text = clean(textOf(node));
      if (!text) continue;
      blocks.push(hasClass(node, 'articlePhrase') ? { type: 'phrase', text } : { type: 'subheading', text });
    } else if (hasClass(node, 'frameWithExampleAndTitle')) {
      const titleEl = node.children.find((c): c is Element => isElement(c) && hasClass(c, 'exampleTitle'));
      const body = node.children.filter((c) => c !== titleEl);
      const inlines = collectInlines(body);
      if (inlines.length) blocks.push({ type: 'example', title: titleEl ? clean(textOf(titleEl)) : undefined, inlines });
    } else if (tag === 'ul' || tag === 'ol') {
      const items = node.children
        .filter(isElement)
        .map((li) => collectInlines(li.children))
        .filter((i) => i.length);
      if (items.length) blocks.push({ type: 'list', items });
    } else if (tag === 'p') {
      const inlines = collectInlines(node.children);
      if (inlines.length) blocks.push({ type: 'paragraph', inlines });
    } else if (tag === 'img' && node.attribs.src) {
      pushImage(blocks, absolute(node.attribs.src));
    } else if (tag === 'iframe' && node.attribs.src) {
      blocks.push({ type: 'embed', url: absolute(node.attribs.src) });
    } else if (tag === 'blockquote') {
      const text = clean(textOf(node));
      if (text) blocks.push({ type: 'phrase', text });
    } else if (tag !== 'script' && tag !== 'style' && tag !== 'svg') {
      if (walkSection(node.children, blocks) === STOP) return STOP;
    }
  }
}

function pushImage(blocks: Block[], url: string) {
  const last = blocks[blocks.length - 1];
  if (last?.type === 'images') last.urls.push(url);
  else blocks.push({ type: 'images', urls: [url] });
}

function findAll(nodes: AnyNode[], test: (el: Element) => boolean, out: Element[] = [], descendIntoMatches = true) {
  for (const n of nodes) {
    if (!isElement(n)) continue;
    const match = test(n);
    if (match) out.push(n);
    if (!match || descendIntoMatches) findAll(n.children, test, out, descendIntoMatches);
  }
  return out;
}

export function parseArticleHtml(html: string): ParsedArticle {
  const doc = parseDocument(html);
  const meta = (key: string) =>
    findAll(doc.children, (el) => el.name === 'meta' && (el.attribs.property === key || el.attribs.name === key))[0]
      ?.attribs.content;

  const h1 = findAll(doc.children, (el) => el.name === 'h1')[0];
  const tags = findAll(doc.children, (el) => hasClass(el, 'tagItem')).map((el) => clean(textOf(el)));

  const sections = findAll(
    doc.children,
    (el) => hasClass(el, 'articleOddSection') || hasClass(el, 'articleEvenSection'),
    [],
    false,
  );

  const blocks: Block[] = [];
  for (const section of sections) {
    if (walkSection(section.children, blocks) === STOP) break;
  }

  const title = h1 ? clean(textOf(h1)) : (meta('og:title') ?? '').replace(/\s*\|.*$/, '');
  const hero = meta('og:image');
  return { title, description: meta('description'), hero: hero ? absolute(hero) : undefined, tags, blocks };
}
