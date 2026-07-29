#!/usr/bin/env node
/**
 * INDEXNOW
 * ========
 * Meldet neue, geänderte und gelöschte URLs an IndexNow. Bing, Yandex,
 * Seznam und Naver teilen die Meldungen untereinander. Für Bing ist das
 * der schnellste Weg, damit neue Seiten überhaupt erst gefunden werden,
 * und Bing wiederum ist die Datengrundlage für Copilot und für ChatGPT
 * Search. Deshalb steht IndexNow hier vor Google.
 *
 * Aufruf nach jedem Deployment:
 *
 *   npm run build
 *   npm run indexnow            # meldet nur, was sich geändert hat
 *   npm run indexnow -- --all   # meldet alle indexierbaren URLs
 *   npm run indexnow -- --dry   # zeigt nur an, sendet nichts
 *
 * Wie „geändert" erkannt wird: Nach jedem Lauf wird eine Prüfsumme je
 * Seite in .indexnow-state.json abgelegt. Beim nächsten Lauf werden nur
 * die Seiten gemeldet, deren Inhalt sich unterscheidet, plus die neuen.
 * Gelöschte URLs werden ebenfalls gemeldet, damit sie aus dem Index
 * verschwinden.
 *
 * WICHTIG: Die Schlüsseldatei muss unter
 *   https://schnellhelfer24.de/<KEY>.txt
 * erreichbar sein und genau den Schlüssel enthalten. Sie liegt in
 * public/ und wird beim Build mit ausgeliefert. Ohne erreichbare
 * Schlüsseldatei lehnt IndexNow die Meldung ab (Statuscode 403).
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');
const stateFile = join(root, '.indexnow-state.json');

const HOST = 'schnellhelfer24.de';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

const args = process.argv.slice(2);
const sendAll = args.includes('--all');
const dryRun = args.includes('--dry');

/* ------------------------------------------------- Schlüssel finden */

function findKey() {
  const fromEnv = process.env.INDEXNOW_KEY;
  if (fromEnv) return fromEnv.trim();

  const pub = join(root, 'public');
  if (!existsSync(pub)) return null;
  const candidate = readdirSync(pub).find((f) => /^[a-f0-9]{16,128}\.txt$/i.test(f));
  if (!candidate) return null;
  return candidate.replace(/\.txt$/i, '');
}

const key = findKey();
if (!key) {
  console.error(
    'Kein IndexNow-Schlüssel gefunden.\n' +
      'Erwartet wird eine Datei public/<KEY>.txt mit dem Schlüssel als Inhalt,\n' +
      'oder die Umgebungsvariable INDEXNOW_KEY.',
  );
  process.exit(1);
}

/* --------------------------------------- Ausgelieferte Seiten lesen */

if (!existsSync(dist)) {
  console.error('Kein dist/-Verzeichnis. Bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

/**
 * Sammelt alle gebauten HTML-Seiten und deren Prüfsumme.
 * Seiten mit noindex werden übersprungen: Was nicht indexiert werden
 * soll, wird auch nicht gemeldet. Damit gilt der Publish Guard
 * automatisch auch für IndexNow.
 */
function collectPages(dir, pages = new Map()) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      collectPages(full, pages);
      continue;
    }
    if (entry !== 'index.html') continue;

    const html = readFileSync(full, 'utf8');
    if (/<meta\s+name="robots"\s+content="noindex/i.test(html)) continue;

    const rel = relative(dist, full).replace(/index\.html$/, '').replace(/\\/g, '/');
    const url = `https://${HOST}/${rel}`;

    // Prüfsumme nur über den Inhalt zwischen <main> und </main>,
    // damit Änderungen an Kopf- oder Fußbereich nicht sämtliche
    // Seiten als geändert melden.
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const basis = main ? main[1] : html;
    pages.set(url, createHash('sha1').update(basis).digest('hex').slice(0, 16));
  }
  return pages;
}

const pages = collectPages(dist);

/* --------------------------------------------- Änderungen ermitteln */

let previous = {};
if (existsSync(stateFile)) {
  try {
    previous = JSON.parse(readFileSync(stateFile, 'utf8'));
  } catch {
    console.warn('Zustandsdatei nicht lesbar, es werden alle URLs gemeldet.');
  }
}

const current = Object.fromEntries(pages);

const added = [...pages.keys()].filter((u) => !(u in previous));
const changed = [...pages.keys()].filter((u) => u in previous && previous[u] !== current[u]);
const removed = Object.keys(previous).filter((u) => !pages.has(u));

const toSubmit = sendAll ? [...pages.keys()] : [...added, ...changed, ...removed];

console.log(`Seiten insgesamt: ${pages.size}`);
console.log(`  neu:      ${added.length}`);
console.log(`  geändert: ${changed.length}`);
console.log(`  entfernt: ${removed.length}`);

if (removed.length) {
  console.log(
    '\nHinweis: Entfernte URLs werden mitgemeldet. Damit sie tatsächlich aus dem Index\n' +
      'verschwinden, müssen sie auf dem Server einen 404 oder 410 liefern oder\n' +
      'weitergeleitet sein.',
  );
}

if (!toSubmit.length) {
  console.log('\nNichts zu melden.');
  process.exit(0);
}

if (dryRun) {
  console.log('\nProbelauf, es wird nichts gesendet. Betroffene URLs:');
  for (const u of toSubmit) console.log('  ' + u);
  process.exit(0);
}

/* -------------------------------------------------------- Senden */

// IndexNow nimmt bis zu 10.000 URLs pro Anfrage. In Paketen zu senden
// ist trotzdem robuster.
const CHUNK = 500;
let allOk = true;

for (let i = 0; i < toSubmit.length; i += CHUNK) {
  const chunk = toSubmit.slice(i, i + CHUNK);
  const payload = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList: chunk,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    const hints = {
      200: 'angenommen',
      202: 'angenommen, Schlüssel wird noch geprüft',
      400: 'ungültiges Format',
      403: 'Schlüssel nicht gültig oder Schlüsseldatei nicht erreichbar',
      422: 'URLs gehören nicht zu diesem Host oder Schlüssel passt nicht',
      429: 'zu viele Anfragen, später erneut versuchen',
    };

    const label = hints[res.status] ?? 'unerwartete Antwort';
    console.log(`\nPaket ${i / CHUNK + 1}: HTTP ${res.status} (${label}), ${chunk.length} URLs`);

    if (res.status !== 200 && res.status !== 202) {
      allOk = false;
      const text = await res.text().catch(() => '');
      if (text) console.error(text.slice(0, 500));
    }
  } catch (err) {
    allOk = false;
    console.error('Netzwerkfehler:', err.message);
  }
}

/* -------------------------------------------- Zustand fortschreiben */

if (allOk) {
  writeFileSync(stateFile, JSON.stringify(current, null, 2) + '\n');
  console.log('\nZustand aktualisiert: .indexnow-state.json');
  console.log('Diese Datei gehört ins Repository, damit der nächste Lauf weiß, was sich geändert hat.');
} else {
  console.error('\nEs gab Fehler. Der Zustand wurde NICHT aktualisiert, damit beim nächsten Lauf erneut gemeldet wird.');
  process.exit(1);
}
