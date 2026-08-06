/**
 * GEBAUTE SEITEN EINLESEN
 * =======================
 *
 * Liest `dist/` einmal ein und stellt allen Guards dieselbe Sicht auf die
 * ausgelieferte Website bereit. Bewusst gegen das **gebaute HTML** statt
 * gegen die Quelldateien: Nur so wird geprüft, was Suchmaschinen und
 * Antwortsysteme tatsächlich sehen. Ein Fehler, der erst beim Rendern
 * entsteht, ist im Quellcode nicht sichtbar.
 *
 * Kein HTML-Parser als Abhängigkeit. Die Seiten stammen aus dem eigenen
 * Build, sind valide und folgen einer bekannten Struktur – reguläre
 * Ausdrücke reichen und halten das Projekt frei von einer weiteren
 * Bibliothek. Was hier NICHT funktionieren würde: beliebiges Fremd-HTML.
 *
 * ZONENERKENNUNG
 * --------------
 * Für den Authority-Score ist entscheidend, WO ein Link steht. Ein Link im
 * Fließtext ist ein redaktionelles Signal, ein Link in der Navigation steht
 * auf jeder Seite und sagt über Relevanz fast nichts aus.
 *
 *   nav        <header class="site-header">      auf jeder Seite identisch
 *   footer     <footer class="site-footer">      auf jeder Seite identisch
 *   sticky     <div class="stickybar">           mobile Aktionsleiste
 *   breadcrumb <nav class="crumbs">              Strukturpfad
 *   module     [data-linkmodule="…"]             kuratiertes Empfehlungsmodul
 *   context    sonst innerhalb von <main>        redaktioneller Fließtext
 *
 * Die Module tragen ihr `data-linkmodule` selbst im Markup. Das ist
 * verlässlicher als eine Klassennamensliste hier im Skript, die bei jedem
 * CSS-Umbau stillschweigend falsch wird.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(here, '..', '..', '..');

/**
 * Normalerweise wird `dist/` geprüft. Die Selbstprüfung
 * (scripts/seo/selftest.mjs) baut absichtlich kaputte Kopien und richtet
 * die Guards über SEO_DIST darauf. Ohne diese Möglichkeit ließe sich nicht
 * nachweisen, dass eine Regel überhaupt anschlägt – und eine Regel, die nie
 * an einem Gegenbeispiel scheitert, prüft nichts.
 */
export const distDir = process.env.SEO_DIST
  ? resolve(process.env.SEO_DIST)
  : join(projectRoot, 'dist');

export const SITE = 'https://schnellhelfer24.de';

export function requireDist() {
  if (!existsSync(distDir)) {
    console.error('Kein dist/-Verzeichnis. Bitte zuerst "npm run build" ausführen.');
    process.exit(1);
  }
}

function walk(dir, filter, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, filter, out);
    else if (filter(entry)) out.push(full);
  }
  return out;
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? m[1] : undefined;
};

const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Findet für jede Zeichenposition im HTML die zuständige Zone. */
function zoneRanges(html) {
  /** @type {{start: number, end: number, zone: string, module?: string}[]} */
  const ranges = [];

  const push = (openRe, zone) => {
    const m = html.match(openRe);
    if (!m) return;
    const start = m.index;
    // Bis zum schließenden Gegenstück. Die vier Rahmenbereiche sind nicht
    // ineinander verschachtelt, deshalb genügt das nächste Vorkommen.
    const closeTag = `</${m[0].match(/^<(\w+)/)[1]}>`;
    const end = html.indexOf(closeTag, start);
    ranges.push({ start, end: end === -1 ? html.length : end, zone });
  };

  push(/<header[^>]*class="[^"]*site-header/i, 'nav');
  push(/<footer[^>]*class="[^"]*site-footer/i, 'footer');
  push(/<div[^>]*class="[^"]*stickybar/i, 'sticky');
  push(/<nav[^>]*class="[^"]*crumbs/i, 'breadcrumb');

  // Empfehlungsmodule dürfen mehrfach vorkommen und liegen innerhalb <main>.
  for (const m of html.matchAll(/<(\w+)[^>]*data-linkmodule="([^"]+)"[^>]*>/gi)) {
    const start = m.index;
    const tagName = m[1];
    // Verschachtelte gleichnamige Tags korrekt überspringen.
    let depth = 1;
    let pos = start + m[0].length;
    const re = new RegExp(`<(/?)${tagName}\\b`, 'gi');
    re.lastIndex = pos;
    let hit;
    let end = html.length;
    while ((hit = re.exec(html))) {
      depth += hit[1] ? -1 : 1;
      if (depth === 0) {
        end = hit.index;
        break;
      }
    }
    ranges.push({ start, end, zone: 'module', module: m[2] });
  }

  return ranges;
}

function zoneAt(ranges, pos) {
  // Module gewinnen gegenüber Rahmenbereichen, weil sie enger liegen.
  let found = null;
  for (const r of ranges) {
    if (pos < r.start || pos > r.end) continue;
    if (!found || r.end - r.start < found.end - found.start) found = r;
  }
  return found ?? { zone: 'context' };
}

/**
 * @typedef {Object} PageLink
 * @property {string} href       Ziel, wie im Markup
 * @property {string} target     Normalisiertes internes Ziel mit / am Ende
 * @property {string} text       Sichtbarer Ankertext
 * @property {string} zone       nav | footer | sticky | breadcrumb | module | context
 * @property {string} [module]   Name des Empfehlungsmoduls
 * @property {boolean} external
 * @property {number} position   Zeichenposition im HTML (für Reihenfolge)
 */

function parseLinks(html, ranges) {
  /** @type {PageLink[]} */
  const links = [];
  for (const m of html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const raw = attr(`<a ${m[1]}>`, 'href');
    if (!raw) continue;
    const external = /^(https?:)?\/\//i.test(raw) && !raw.startsWith(SITE);
    const isPage = raw.startsWith('/') || raw.startsWith(SITE);
    const bare = raw.replace(SITE, '').split('#')[0].split('?')[0];
    const z = zoneAt(ranges, m.index);
    links.push({
      href: raw,
      target: isPage && bare ? (bare.endsWith('/') || bare.includes('.') ? bare : `${bare}/`) : '',
      text: stripTags(m[2]),
      zone: z.zone,
      module: z.module,
      external,
      position: m.index,
    });
  }
  return links;
}

/** Alle <picture>-Bereiche mit den darin angebotenen Bildformaten. */
function pictureRanges(html) {
  const out = [];
  for (const m of html.matchAll(/<picture[^>]*>([\s\S]*?)<\/picture>/gi)) {
    out.push({
      start: m.index,
      end: m.index + m[0].length,
      types: [...m[1].matchAll(/<source[^>]*\stype="([^"]+)"/gi)].map((s) => s[1]),
    });
  }
  return out;
}

function parseImages(html, ranges, pictures) {
  const images = [];
  for (const m of html.matchAll(/<img\s([^>]*?)\/?>/gi)) {
    const tag = `<img ${m[1]}>`;
    const z = zoneAt(ranges, m.index);
    const pic = pictures.find((p) => m.index > p.start && m.index < p.end);
    images.push({
      src: attr(tag, 'src') ?? '',
      alt: attr(tag, 'alt'),
      width: attr(tag, 'width'),
      height: attr(tag, 'height'),
      srcset: attr(tag, 'srcset'),
      sizes: attr(tag, 'sizes'),
      loading: attr(tag, 'loading'),
      fetchpriority: attr(tag, 'fetchpriority'),
      decoding: attr(tag, 'decoding'),
      zone: z.zone,
      position: m.index,
      /** Angebotene Formate aus dem umgebenden <picture>, z. B. image/avif. */
      pictureTypes: pic ? pic.types : null,
    });
  }
  return images;
}

function parseJsonLd(html) {
  const blocks = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      blocks.push({ ok: true, data: JSON.parse(m[1]) });
    } catch (err) {
      blocks.push({ ok: false, error: err.message, raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

/** Liest alle gebauten Seiten ein. */
export function loadPages() {
  requireDist();
  return walk(distDir, (e) => e.endsWith('.html')).map((file) => {
    const html = readFileSync(file, 'utf8');
    const rel = relative(distDir, file).split('\\').join('/');
    const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
    const ranges = zoneRanges(html);
    const main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ?? [, ''])[1];
    const g = (re) => (html.match(re) ?? [, ''])[1].trim();

    const robots = g(/<meta\s+name="robots"\s+content="([^"]*)"/i);
    return {
      file,
      url,
      html,
      main,
      title: stripTags(g(/<title>([\s\S]*?)<\/title>/i)),
      description: g(/<meta\s+name="description"\s+content="([^"]*)"/i),
      canonical: g(/<link\s+rel="canonical"\s+href="([^"]*)"/i),
      ogImage: g(/<meta\s+property="og:image"\s+content="([^"]*)"/i),
      robots,
      indexable: !/noindex/i.test(robots),
      h1s: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1])),
      headings: [...html.matchAll(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
        level: Number(m[1]),
        text: stripTags(m[2]),
      })),
      links: parseLinks(html, ranges),
      images: parseImages(html, ranges, pictureRanges(html)),
      jsonld: parseJsonLd(html),
      /** Sichtbarer Text des Hauptbereichs – Grundlage der Ähnlichkeitsprüfung. */
      text: stripTags(main),
    };
  });
}

/** Alle Dateien in dist/ – für die Prüfung interner Links auf Downloads. */
export function distFiles() {
  requireDist();
  return new Set(
    walk(distDir, () => true).map((f) => '/' + relative(distDir, f).split('\\').join('/')),
  );
}

/** URLs aus der gebauten Sitemap. */
export function sitemapUrls() {
  const file = join(distDir, 'sitemap.xml');
  if (!existsSync(file)) return null;
  const xml = readFileSync(file, 'utf8');
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));
}

export { stripTags };
