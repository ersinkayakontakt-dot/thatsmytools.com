#!/usr/bin/env node
/**
 * Erzeugt die statischen Bilddateien aus HTML-Vorlagen mit einem
 * headless Chromium. Damit bleiben Vorschaubild und Icon im Repository
 * reproduzierbar und müssen nicht in einem Grafikprogramm gepflegt werden.
 *
 *   node scripts/make-images.mjs
 *
 * Warum zugeschnitten wird: Headless-Chromium rechnet die Fensterhöhe aus
 * `--window-size` inklusive Browserleisten. Der tatsächlich gezeichnete
 * Bereich ist dadurch je nach Build einige Dutzend Pixel niedriger als
 * angefordert. Deshalb wird mit Reserve gerendert und das Ergebnis
 * anschließend exakt auf die Zielgröße beschnitten.
 *
 * Chromium wird in dieser Reihenfolge gesucht:
 *   $CHROME_PATH, PLAYWRIGHT_BROWSERS_PATH, übliche Systempfade.
 * Ist keins vorhanden, bricht das Skript ab – der Website-Build läuft
 * davon unabhängig weiter.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { cropTo } from './png.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = join(root, 'public');
const tmpDir = join(root, '.astro', 'shot');

/** Reserve für die Browserleisten in `--window-size`. */
const CHROME_HEIGHT_PADDING = 120;

const candidates = [
  process.env.CHROME_PATH,
  process.env.PLAYWRIGHT_BROWSERS_PATH ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium') : null,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('Kein Chromium gefunden. Setzen Sie CHROME_PATH auf eine Chrome-/Chromium-Binary.');
  process.exit(1);
}

/* ----------------------------------------------------------------- Lauf */

const jobs = [
  { tpl: 'og-template.html', out: 'og-default.png', w: 1200, h: 630 },
  { tpl: 'icon-template.html', out: 'apple-touch-icon.png', w: 180, h: 180 },
  // Wird in den strukturierten Daten als `logo` der Organisation
  // referenziert. Größe und Pfad stehen so auch in src/lib/schema.ts –
  // beides muss zusammenpassen.
  { tpl: 'logo-template.html', out: 'logo.png', w: 512, h: 512 },
];

mkdirSync(tmpDir, { recursive: true });

for (const job of jobs) {
  const src = join(here, job.tpl);
  const tmp = join(tmpDir, job.out);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${job.w},${job.h + CHROME_HEIGHT_PADDING}`,
      `--screenshot=${tmp}`,
      `file://${src}`,
    ],
    { stdio: 'pipe' },
  );
  cropTo(tmp, job.w, job.h);
  writeFileSync(join(outDir, job.out), readFileSync(tmp));
  console.log(`erzeugt: public/${job.out} (${job.w}×${job.h})`);
}

rmSync(tmpDir, { recursive: true, force: true });
