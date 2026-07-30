#!/usr/bin/env node
/**
 * BUILD-PRÜFUNG
 * =============
 * Prüft die fertig gebaute Website auf die Fehler, die bei einer
 * inhaltsgetriebenen Seite tatsächlich vorkommen:
 *
 *   - doppelte Title Tags
 *   - doppelte Meta Descriptions
 *   - fehlende oder mehrfache H1
 *   - fehlende Canonicals oder Canonicals mit falscher Domain
 *   - kaputte interne Links
 *   - indexierbare Seiten, die nicht in der Sitemap stehen (und umgekehrt)
 *   - Sitemap-Einträge, die auf noindex-Seiten zeigen
 *   - fehlende oder zu lange Meta-Angaben
 *   - Bilder ohne Alternativtext
 *
 * Aufruf:
 *   npm run build && npm run audit:build
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const SITE = 'https://schnellhelfer24.de';

if (!existsSync(dist)) {
  console.error('Kein dist/-Verzeichnis. Bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

const problems = [];
const notes = [];
const add = (level, where, message) =>
  (level === 'error' ? problems : notes).push({ where, message });

/* ------------------------------------------------------ Seiten lesen */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(dist);

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}
const pages = files.map((file) => {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dist, file).replace(/\\/g, '/');
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  return {
    file,
    url: url === '/' ? '/' : url,
    html,
    title: (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim(),
    description: (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [, ''])[1].trim(),
    canonical: (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [, ''])[1],
    robots: (html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i) || [, ''])[1],
    h1s: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim(),
    ),
  };
});

const indexable = pages.filter((p) => !/noindex/i.test(p.robots));

console.log(`Geprüft: ${pages.length} Seiten, davon ${indexable.length} indexierbar\n`);

/* --------------------------------------------- Titel und Description */

const byTitle = new Map();
const byDesc = new Map();

for (const p of indexable) {
  if (!p.title) add('error', p.url, 'kein Title Tag');
  else {
    byTitle.set(p.title, [...(byTitle.get(p.title) || []), p.url]);
    if (p.title.length > 65) add('note', p.url, `Title ist ${p.title.length} Zeichen lang, wird in der Suche gekürzt`);
    if (p.title.length < 20) add('note', p.url, `Title ist mit ${p.title.length} Zeichen sehr kurz`);
  }

  if (!p.description) add('error', p.url, 'keine Meta Description');
  else {
    byDesc.set(p.description, [...(byDesc.get(p.description) || []), p.url]);
    if (p.description.length > 165)
      add('note', p.url, `Meta Description ist ${p.description.length} Zeichen lang, wird gekürzt`);
    if (p.description.length < 70)
      add('note', p.url, `Meta Description ist mit ${p.description.length} Zeichen sehr kurz`);
  }

  if (p.h1s.length === 0) add('error', p.url, 'keine H1');
  if (p.h1s.length > 1) add('error', p.url, `${p.h1s.length} H1-Überschriften, es sollte genau eine sein`);

  if (!p.canonical) add('error', p.url, 'kein Canonical');
  else if (!p.canonical.startsWith(SITE))
    add('error', p.url, `Canonical zeigt auf eine fremde Domain: ${p.canonical}`);
}

for (const [title, urls] of byTitle) {
  if (urls.length > 1) add('error', urls.join(', '), `gleicher Title auf ${urls.length} Seiten: "${title}"`);
}
for (const [desc, urls] of byDesc) {
  if (urls.length > 1)
    add('error', urls.join(', '), `gleiche Meta Description auf ${urls.length} Seiten: "${desc.slice(0, 60)}…"`);
}

/* -------------------------------------------------- Interne Links */

const known = new Set(pages.map((p) => p.url));
// Zusätzlich vorhandene Dateien in public/ berücksichtigen
for (const f of walkFiles(dist)) {
  known.add('/' + relative(dist, f).replace(/\\/g, '/'));
}

const linkPattern = /<a\s[^>]*href="([^"#?]+)[^"]*"/gi;
const brokenLinks = new Map();

for (const p of pages) {
  for (const m of p.html.matchAll(linkPattern)) {
    const href = m[1];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('/api/')) continue;
    const target = href.endsWith('/') || href.includes('.') ? href : href + '/';
    if (!known.has(target) && !known.has(target.replace(/\/$/, ''))) {
      brokenLinks.set(target, [...(brokenLinks.get(target) || []), p.url]);
    }
  }
}

for (const [target, sources] of brokenLinks) {
  add('error', sources.slice(0, 3).join(', '), `Link ins Leere: ${target}`);
}

/* ------------------------------------------------------ Sitemap */

const sitemapFile = join(dist, 'sitemap.xml');
if (!existsSync(sitemapFile)) {
  add('error', '/sitemap.xml', 'Sitemap fehlt');
} else {
  const xml = readFileSync(sitemapFile, 'utf8');
  const inSitemap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '')));

  for (const url of inSitemap) {
    const page = pages.find((p) => p.url === url);
    if (!page) add('error', url, 'steht in der Sitemap, wurde aber nicht gebaut');
    else if (/noindex/i.test(page.robots)) add('error', url, 'steht in der Sitemap, ist aber noindex');
  }

  for (const p of indexable) {
    // Bestätigungsseite und 404 gehören bewusst nicht hinein
    if (p.url === '/404/' || p.url === '/404.html' || p.url === '/anfrage-erhalten/') continue;
    if (!inSitemap.has(p.url)) add('note', p.url, 'ist indexierbar, steht aber nicht in der Sitemap');
  }

  console.log(`Sitemap: ${inSitemap.size} URLs\n`);
}

/* ------------------------------------------------------- robots.txt */

const robotsFile = join(dist, 'robots.txt');
if (!existsSync(robotsFile)) {
  add('error', '/robots.txt', 'robots.txt fehlt');
} else {
  const txt = readFileSync(robotsFile, 'utf8');
  if (!txt.includes('Sitemap:')) add('error', '/robots.txt', 'kein Sitemap-Verweis in der robots.txt');
  if (/User-agent:\s*OAI-SearchBot[\s\S]{0,80}Disallow:\s*\//i.test(txt))
    add('error', '/robots.txt', 'OAI-SearchBot ist gesperrt, damit ist die Seite in ChatGPT Search nicht auffindbar');
}

/* ----------------------------------------------- Bilder und Schema */

for (const p of pages) {
  for (const m of p.html.matchAll(/<img\s([^>]*)>/gi)) {
    if (!/\salt=/i.test(m[1])) add('error', p.url, 'Bild ohne alt-Attribut');
  }

  const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (indexable.includes(p) && blocks.length === 0) {
    add('note', p.url, 'keine strukturierten Daten');
  }
  for (const b of blocks) {
    try {
      const parsed = JSON.parse(b[1]);
      const graph = parsed['@graph'] || [];
      // Platzhalter dürfen niemals in strukturierten Daten landen
      const asText = JSON.stringify(graph);
      if (/\[[A-ZÄÖÜ][^\]]{5,}\]/.test(asText)) {
        add('error', p.url, 'Platzhalter in den strukturierten Daten');
      }
      if (/aggregateRating/i.test(asText)) {
        add('note', p.url, 'AggregateRating vorhanden – bitte prüfen, ob echte Bewertungen sichtbar auf der Seite stehen');
      }
    } catch {
      add('error', p.url, 'JSON-LD ist kein gültiges JSON');
    }
  }
}

/* ------------------------------------------------------- Ausgabe */

if (problems.length) {
  console.log(`FEHLER (${problems.length})`);
  console.log('='.repeat(60));
  for (const p of problems) console.log(`  ${p.where}\n    ${p.message}`);
  console.log('');
}

if (notes.length) {
  console.log(`HINWEISE (${notes.length})`);
  console.log('='.repeat(60));
  for (const n of notes) console.log(`  ${n.where}\n    ${n.message}`);
  console.log('');
}

if (!problems.length && !notes.length) {
  console.log('Keine Auffälligkeiten.');
}

process.exit(problems.length ? 1 : 0);
