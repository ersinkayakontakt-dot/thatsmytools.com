#!/usr/bin/env node
/**
 * STOCKFOTO-KANDIDATEN HOLEN
 * ==========================
 *
 * Lädt Kandidaten von Pexels in ein Arbeitsverzeichnis, damit sie VOR der
 * Verwendung angesehen und ausgewählt werden können. Das Skript wählt
 * bewusst nichts selbst aus – es sammelt nur.
 *
 *   npm run images:fetch              alle Suchbegriffe
 *   npm run images:fetch -- --theme wohnungsuebergabe
 *   npm run images:fetch -- --list    zeigt die Suchbegriffe
 *
 * SCHLÜSSEL
 * Kostenlos unter https://www.pexels.com/api/ – dann eine Datei
 * `.env.local` im Projektwurzelverzeichnis anlegen:
 *
 *     PEXELS_API_KEY=hier_der_schluessel
 *
 * `.env*` ist in .gitignore ausgeschlossen, der Schlüssel landet also nie
 * im Repository. Alternativ als Umgebungsvariable PEXELS_API_KEY setzen.
 *
 * ERGEBNIS
 *   tmp/image-candidates/<thema>/<nr>-<fotograf>.jpg   die Bilder
 *   tmp/image-candidates/manifest.json                 die Nachweisdaten
 *
 * `tmp/` ist gitignored. Ausgewählte Bilder wandern von Hand nach
 * src/assets/ und bekommen einen Eintrag in src/data/images.ts sowie eine
 * Zeile in IMAGE-SOURCES.md.
 *
 * WAS DIESES SKRIPT NICHT TUT
 * Es entscheidet nicht, ob ein Motiv passt. Ob eine abgebildete ältere
 * Person würdevoll dargestellt ist, ob ein Umzugswagen deutsch aussieht,
 * ob ein fremdes Firmenlogo im Bild steht – das muss ein Mensch ansehen.
 * Deshalb landen die Dateien in einem Arbeitsverzeichnis und nicht
 * automatisch in src/assets/.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outRoot = join(root, 'tmp', 'image-candidates');

/* ------------------------------------------------------------- Schlüssel */

function readKey() {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const match = readFileSync(envFile, 'utf8').match(/^\s*PEXELS_API_KEY\s*=\s*(.+)\s*$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  }
  return null;
}

/* ------------------------------------------------------------- Suchbegriffe */

/**
 * Je Bildthema aus `imageTheme` der SEO-Seitenkarte mehrere Suchbegriffe.
 *
 * Englisch, weil der Bestand englischsprachig verschlagwortet ist. Die
 * Begriffe zielen auf die Wirkung aus Auftrag § 10 – Ordnung, Ruhe,
 * Sorgfalt – und meiden ausdrücklich Schock- und Elendsmotive.
 */
const THEMES = {
  wohnungsuebergabe: {
    forPage: 'service:wohnungsaufloesung-berlin',
    theme: 'leere, saubere Wohnung kurz vor der Schlüsselübergabe',
    queries: ['empty bright apartment room', 'handing over keys apartment', 'clean empty living room'],
  },
  entruempelung: {
    forPage: 'service:entruempelung-berlin',
    theme: 'geordnete Umzugskartons und Teamarbeit beim Heraustragen',
    queries: ['stacked moving boxes hallway', 'movers carrying boxes', 'organized cardboard boxes room'],
  },
  haushaltsaufloesung: {
    forPage: 'service:haushaltsaufloesung-berlin',
    theme: 'sorgfältiges Einpacken persönlicher Gegenstände',
    queries: ['packing dishes into box carefully', 'wrapping belongings paper', 'labeling moving boxes'],
  },
  nachlass: {
    forPage: 'service:nachlassaufloesung-berlin',
    theme: 'respektvoll behandelte Erinnerungsstücke, ruhige Planung unter Angehörigen',
    queries: ['old photographs letters table', 'family discussing documents table', 'wooden memory box'],
  },
  seniorenumzug: {
    forPage: 'service:seniorenumzug-berlin',
    theme: 'ältere Person in heller, würdevoller Umgebung',
    queries: ['senior woman bright living room', 'adult child helping elderly parent home', 'senior couple planning together'],
  },
  hausverwaltung: {
    forPage: 'hausverwaltungen',
    theme: 'Übergabe an Eigentümer oder Verwaltung, professioneller Objekttermin',
    queries: ['property manager clipboard apartment', 'business handshake empty office', 'real estate inspection room'],
  },
  umzug: {
    forPage: 'service:umzug-berlin',
    theme: 'neutrale professionelle Umzugssituation',
    queries: ['furniture wrapped moving blanket', 'moving van loading europe', 'two movers carrying sofa'],
  },
};

const args = process.argv.slice(2);
const only = args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null;

if (args.includes('--list')) {
  console.log('Verfügbare Themen:\n');
  for (const [key, t] of Object.entries(THEMES)) {
    console.log(`  ${key.padEnd(20)} ${t.theme}`);
    console.log(`  ${''.padEnd(20)} Seite: ${t.forPage}`);
    console.log(`  ${''.padEnd(20)} Suche: ${t.queries.join(' | ')}\n`);
  }
  process.exit(0);
}

const key = readKey();
if (!key) {
  console.error(
    'Kein Pexels-Schlüssel gefunden.\n\n' +
      'Kostenlos unter https://www.pexels.com/api/ anfordern, dann im\n' +
      'Projektwurzelverzeichnis eine Datei .env.local anlegen:\n\n' +
      '    PEXELS_API_KEY=hier_der_schluessel\n\n' +
      '.env* ist in .gitignore ausgeschlossen – der Schlüssel bleibt lokal.',
  );
  process.exit(1);
}

/* ------------------------------------------------------------- Abrufen */

const PER_QUERY = 4;
const manifest = [];

async function search(query) {
  const url =
    'https://api.pexels.com/v1/search?query=' +
    encodeURIComponent(query) +
    `&per_page=${PER_QUERY}&orientation=landscape&size=large`;

  const res = await fetch(url, { headers: { Authorization: key } });
  if (res.status === 401) {
    console.error('Pexels lehnt den Schlüssel ab (HTTP 401). Stimmt PEXELS_API_KEY?');
    process.exit(1);
  }
  if (res.status === 429) {
    console.error('Pexels-Kontingent erschöpft (HTTP 429). Später erneut versuchen.');
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`Pexels antwortet mit HTTP ${res.status} für "${query}".`);
    return [];
  }
  const data = await res.json();
  return data.photos ?? [];
}

const themes = only ? { [only]: THEMES[only] } : THEMES;
if (only && !THEMES[only]) {
  console.error(`Unbekanntes Thema "${only}". Verfügbar: ${Object.keys(THEMES).join(', ')}`);
  process.exit(1);
}

mkdirSync(outRoot, { recursive: true });

for (const [themeKey, theme] of Object.entries(themes)) {
  const dir = join(outRoot, themeKey);
  mkdirSync(dir, { recursive: true });
  console.log(`\n${themeKey} – ${theme.theme}`);

  let n = 0;
  for (const query of theme.queries) {
    const photos = await search(query);
    for (const photo of photos) {
      n += 1;
      const safeAuthor = String(photo.photographer)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const file = `${String(n).padStart(2, '0')}-${safeAuthor}.jpg`;

      // `large` reicht zum Ansehen und schont das Kontingent. Das echte
      // Bild wird erst nach der Auswahl in voller Größe geholt.
      const imgRes = await fetch(photo.src.large);
      if (!imgRes.ok) continue;
      writeFileSync(join(dir, file), Buffer.from(await imgRes.arrayBuffer()));

      manifest.push({
        theme: themeKey,
        forPage: theme.forPage,
        query,
        file: `${themeKey}/${file}`,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        platform: 'Pexels',
        sourceUrl: photo.url,
        fullSizeUrl: photo.src.original,
        width: photo.width,
        height: photo.height,
        altFromPlatform: photo.alt ?? '',
        license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
        licenseUrl: 'https://www.pexels.com/license/',
        retrieved: new Date().toISOString().slice(0, 10),
      });

      console.log(`  ${file.padEnd(34)} ${photo.photographer}`);
    }
  }
}

writeFileSync(join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(
  `\n${manifest.length} Kandidaten in tmp/image-candidates/\n` +
    'Nachweisdaten: tmp/image-candidates/manifest.json\n\n' +
    'NÄCHSTER SCHRITT: Bilder ansehen und auswählen. Erst dann nach\n' +
    'src/assets/ übernehmen, in src/data/images.ts eintragen und die Zeile\n' +
    'in IMAGE-SOURCES.md ergänzen.',
);
