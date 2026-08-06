#!/usr/bin/env node
/**
 * INDIVIDUELLE SOCIAL- UND SUCHVORSCHAUBILDER
 * ===========================================
 *
 * Erzeugt für jede Seite mit `ownOgImage: true` ein eigenes 1200×630-Bild
 * aus scripts/og-template.html.
 *
 *   npm run images:og
 *   npm run images:og -- --dry     zeigt nur, was erzeugt würde
 *
 * WOHER DIE TEXTE KOMMEN
 * Aus der SEO-Seitenkarte: Überschrift ist die H1 der Seite, der Untertext
 * der erste Satz der Meta Description. Damit kann das Vorschaubild nichts
 * behaupten, was auf der Seite nicht steht – und es muss nichts doppelt
 * gepflegt werden.
 *
 * WARUM CHROMIUM UND KEIN BILDPROGRAMM
 * Das Ergebnis ist reproduzierbar und liegt als HTML im Repository. Wer den
 * Text ändert, ändert die Seitenkarte und lässt neu rendern – niemand muss
 * eine Photoshop-Datei suchen.
 *
 * Wird KEIN Chromium gefunden, bricht das Skript ab. Der Website-Build läuft
 * davon unabhängig weiter; die Seiten fallen dann auf /og-default.png
 * zurück, weil `ogImageFor()` das so vorsieht.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = join(root, 'public', 'og');
const tmpDir = join(root, '.astro', 'og');

const dryRun = process.argv.includes('--dry');

/* Reserve für die Browserleisten in --window-size, siehe make-images.mjs. */
const CHROME_HEIGHT_PADDING = 120;
const WIDTH = 1200;
const HEIGHT = 630;

const candidates = [
  process.env.CHROME_PATH,
  '/c/Program Files/Google/Chrome/Application/chrome.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = candidates.find((p) => existsSync(p));

/* ------------------------------------------------------ Seitenkarte lesen */

const { seoPages, ogImageFor } = await import(
  pathToFileURL(join(root, 'src/data/seo-pages.ts')).href
);

const jobs = seoPages
  .filter((p) => p.ownOgImage)
  .map((p) => ({
    id: p.id,
    file: ogImageFor(p).replace(/^\/og\//, ''),
    headline: p.h1,
    // Erster Satz der Meta Description. Der ganze Text wäre auf 1200 px
    // zu lang und würde umbrechen, bis das Layout kippt.
    text: firstSentence(p.metaDescription),
    foot: p.targetRegion.join(' & '),
  }));

function firstSentence(text) {
  const cut = text.split(/(?<=[.!?])\s/)[0] ?? text;
  return cut.length > 120 ? `${cut.slice(0, 117).trimEnd()}…` : cut;
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

console.log(`${jobs.length} Seiten mit eigenem Vorschaubild:\n`);
for (const job of jobs) {
  console.log(`  ${job.file.padEnd(46)} ${job.headline}`);
}
console.log('');

if (dryRun) {
  console.log('Probelauf, es wird nichts erzeugt.');
  process.exit(0);
}

if (!chrome) {
  console.error(
    'Kein Chromium gefunden. CHROME_PATH auf eine Chrome-/Chromium-Binary setzen.\n' +
      'Ohne Vorschaubilder fallen die Seiten auf /og-default.png zurück – die Website\n' +
      'bleibt funktionsfähig, verliert aber die individuelle Vorschau.',
  );
  process.exit(1);
}

/* ------------------------------------------------------------- Rendern */

const template = readFileSync(join(here, 'og-template.html'), 'utf8');
mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

/* PNG-Werkzeuge aus make-images.mjs mitbenutzen statt sie zu kopieren. */
const { cropTo } = await import(pathToFileURL(join(here, 'png.mjs')).href);

for (const job of jobs) {
  // replaceAll, nicht replace: `replace` mit einem String tauscht nur das
  // erste Vorkommen. Als die Platzhalter noch im Kopfkommentar der Vorlage
  // standen, wurde deshalb der Kommentar ersetzt und alle sieben Bilder
  // waren identisch.
  const html = template
    .replaceAll('{{HEADLINE}}', escapeHtml(job.headline))
    .replaceAll('{{TEXT}}', escapeHtml(job.text))
    .replaceAll('{{FOOT}}', escapeHtml(job.foot));

  const src = join(tmpDir, `${job.id.replace(/[^a-z0-9-]+/gi, '-')}.html`);
  writeFileSync(src, html, 'utf8');

  const shot = join(tmpDir, job.file);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT + CHROME_HEIGHT_PADDING}`,
      `--screenshot=${shot}`,
      pathToFileURL(src).href,
    ],
    { stdio: 'pipe' },
  );

  cropTo(shot, WIDTH, HEIGHT);
  writeFileSync(join(outDir, job.file), readFileSync(shot));
  console.log(`erzeugt: public/og/${job.file} (${WIDTH}×${HEIGHT})`);
}

rmSync(tmpDir, { recursive: true, force: true });

console.log(
  '\nHinweis: Die Bilder liegen in public/og/ und gehören ins Repository,\n' +
    'damit sie ohne Chromium gebaut werden können.',
);
