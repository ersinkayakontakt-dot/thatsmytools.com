#!/usr/bin/env node
/**
 * OPPORTUNITY-AUSWERTUNG
 * ======================
 *
 * Übersetzt echte Suchdaten in konkrete Aufgaben, sortiert danach, was
 * dem Betrieb am meisten bringt.
 *
 *   npm run seo:opportunities                    liest data/gsc/ und data/bing/
 *   npm run seo:opportunities -- --api           holt zusätzlich über die API
 *   npm run seo:opportunities -- --days 28
 *
 * WOHER DIE DATEN KOMMEN
 *   data/gsc/*.csv    Export aus der Google Search Console
 *   data/bing/*.csv   Export aus den Bing Webmaster Tools
 *   --api             Search-Console-API, siehe search-data/gsc-api.mjs
 *
 * `data/` ist über .gitignore ausgeschlossen. Suchdaten sind
 * Betriebsdaten und gehören nicht in ein Repository.
 *
 * OHNE DATEN PASSIERT NICHTS
 * Das Skript erfindet keine Zahlen und zeigt keine Beispielauswertung.
 * Liegen keine Exporte vor, sagt es das und erklärt, wie man sie bekommt.
 * Eine Auswertung mit ausgedachten Werten wäre schlimmer als keine: Sie
 * sähe aus wie eine Grundlage für Entscheidungen.
 *
 * DER OPPORTUNITY-SCORE IST KEINE BLACKBOX
 * Die vollständige Formel steht unten bei `scoreOf()` und wird in jedem
 * Bericht mit ausgegeben. Jeder Faktor ist einzeln nachvollziehbar.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Report } from './lib/report.mjs';
import { projectRoot } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';
import { parseExport, toPath, isBrandQuery } from './search-data/parse.mjs';
import { buildBaseline, bucketFor } from './search-data/baseline.mjs';
import { hasCredentials, fetchPerformance, inspectUrls, quotaUsed } from './search-data/gsc-api.mjs';

const args = process.argv.slice(2);
const useApi = args.includes('--api');
const days = Number(args[args.indexOf('--days') + 1]) || 28;

/**
 * Normalerweise data/. Die Selbstprüfung richtet das Skript über
 * SEO_DATA_DIR auf ein Fixture-Verzeichnis, um nachzuweisen, dass die
 * Auswertung rechnet – ohne je erfundene Zahlen nach data/ zu schreiben.
 */
const dataDir = process.env.SEO_DATA_DIR
  ? resolve(process.env.SEO_DATA_DIR)
  : join(projectRoot, 'data');
const outDir = join(projectRoot, 'tmp', 'seo-reports');

const report = new Report('Search-Console-Chancen');
const map = await loadSeoMap();

/* ------------------------------------------------------------------ */
/* Daten einsammeln                                                    */
/* ------------------------------------------------------------------ */

/** Liest alle CSV-Dateien eines Verzeichnisses. */
function readCsvDir(dir, source) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const file of readdirSync(dir).filter((f) => /\.(csv|tsv)$/i.test(f))) {
    const full = join(dir, file);
    try {
      const { dimension, rows } = parseExport(readFileSync(full, 'utf8'), file);
      out.push({ file, dimension, source, rows });
      report.stat(`${source}: ${file} – ${rows.length} Zeilen, Dimension „${dimension}"`);
    } catch (err) {
      report.error(file, err.message, 'Exportdatei prüfen oder Spaltennamen in parse.mjs ergänzen');
    }
  }
  return out;
}

const gscFiles = readCsvDir(join(dataDir, 'gsc'), 'Search Console');
const bingFiles = readCsvDir(join(dataDir, 'bing'), 'Bing');

/** Zeilen mit Suchanfrage UND Seite – nur die API liefert das direkt. */
let queryPageRows = [];

if (useApi) {
  if (!hasCredentials()) {
    report.error(
      'API',
      'Kein Zugang zur Search-Console-API hinterlegt',
      'GOOGLE_APPLICATION_CREDENTIALS in .env.local setzen – siehe scripts/seo/search-data/gsc-api.mjs',
    );
  } else {
    const end = new Date();
    const start = new Date(end.getTime() - days * 86400000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    try {
      queryPageRows = await fetchPerformance({
        siteUrl: 'sc-domain:schnellhelfer24.de',
        startDate: fmt(start),
        endDate: fmt(end),
        dimensions: ['query', 'page', 'device'],
      });
      report.stat(`API: ${queryPageRows.length} Zeilen (Suchanfrage × Seite × Gerät), ${quotaUsed()} Abfragen`);
    } catch (err) {
      report.error('API', err.message, 'Zugang prüfen. Der CSV-Weg funktioniert unabhängig davon.');
    }
  }
}

const queryRows = gscFiles.filter((f) => f.dimension === 'query').flatMap((f) => f.rows);
const pageRows = gscFiles.filter((f) => f.dimension === 'page').flatMap((f) => f.rows);
const bingQueryRows = bingFiles.filter((f) => f.dimension === 'query').flatMap((f) => f.rows);

const anyData = queryRows.length || pageRows.length || queryPageRows.length || bingQueryRows.length;

if (!anyData) {
  report.stat('Keine Suchdaten gefunden.');
  console.log(`
${'='.repeat(66)}
Keine Suchdaten vorhanden
${'='.repeat(66)}

Dieses Werkzeug rechnet ausschließlich mit echten Daten. Es zeigt keine
Beispielauswertung, weil eine solche wie eine Entscheidungsgrundlage
aussähe.

SO KOMMEN DIE DATEN INS PROJEKT

  Google Search Console
    1. https://search.google.com/search-console öffnen
    2. Leistung → Suchergebnisse
    3. Zeitraum auf die letzten 3 Monate stellen
    4. Oben rechts „Exportieren" → CSV herunterladen
    5. Die entpackten Dateien nach data/gsc/ legen

  Bing Webmaster Tools
    1. https://www.bing.com/webmasters öffnen
    2. Suchleistung → Filter setzen
    3. Exportieren → CSV
    4. Die Dateien nach data/bing/ legen

  Search-Console-API (liefert Suchanfrage UND Seite in einer Zeile)
    Einrichtung siehe scripts/seo/search-data/gsc-api.mjs,
    danach:  npm run seo:opportunities -- --api

data/ ist über .gitignore ausgeschlossen – Suchdaten bleiben lokal.
`);
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/* Grundlinie                                                          */
/* ------------------------------------------------------------------ */

const baselineRows = queryPageRows.length ? queryPageRows : queryRows;
const baseline = buildBaseline(baselineRows);

report.stat('Eigene CTR-Grundlinie (nicht aus Branchentabellen):');
for (const b of baseline.describe()) {
  report.stat(
    `   Position ${b.positionsgruppe.padEnd(6)} ${b.art.padEnd(11)} CTR ${String(b.ctr).padStart(5)} %  ` +
      `(${b.impressionen} Impressionen, Vertrauen: ${b.datenvertrauen})`,
  );
}

/* ------------------------------------------------------------------ */
/* Opportunity-Score                                                   */
/* ------------------------------------------------------------------ */

/**
 * DIE FORMEL
 * ==========
 *
 *   Score = Sichtbarkeit × Hebel × Geschäftswert × Datenvertrauen ÷ Aufwand
 *
 * Sichtbarkeit   log10(Impressionen + 1)
 *                Logarithmisch, weil der Sprung von 10 auf 100
 *                Impressionen mehr bedeutet als der von 5000 auf 5090.
 *
 * Hebel          je nach Art der Chance:
 *                  Quick Win        (21 − Position) ÷ 17, begrenzt auf 0…1
 *                                   Position 4 → 1,0, Position 20 → 0,06
 *                  CTR-Lücke        (erwartete CTR − tatsächliche CTR)
 *                                   ÷ erwartete CTR, begrenzt auf 0…1
 *                  Verlust          relativer Rückgang, begrenzt auf 0…1
 *
 * Geschäftswert  0,4 + 0,15 × businessPriority   (0,55 bis 1,15)
 *                mal 1,2, wenn das Conversion-Ziel ein Komplettauftrag
 *                oder eine Partneranfrage ist – dort hängt der Umsatz dran.
 *
 * Datenvertrauen hoch 1,0 · mittel 0,7 · niedrig 0,4
 *                Eine Chance auf Basis von 30 Impressionen ist keine
 *                Chance, sondern Rauschen.
 *
 * Aufwand        1,0 Title oder Description ändern
 *                1,5 Abschnitt ergänzen
 *                2,5 Seite umschreiben oder zusammenführen
 *
 * Kannibalisierungsrisiko wird nicht als Faktor verrechnet, sondern als
 * eigene Chance ausgegeben – sonst verschwindet es in einer Zahl.
 *
 * Der Score ist eine REIHENFOLGE, keine Prognose. Er sagt nicht voraus,
 * wie viele Klicks eine Maßnahme bringt.
 */
const EFFORT = { meta: 1.0, abschnitt: 1.5, umbau: 2.5 };
const CONFIDENCE_FACTOR = { hoch: 1.0, mittel: 0.7, niedrig: 0.4 };

function businessValue(pageId) {
  const page = pageId ? map.byId.get(pageId) : null;
  if (!page) return 0.55;
  const base = 0.4 + 0.15 * page.businessPriority;
  const converts =
    page.conversionGoal === 'complete_project_request' || page.conversionGoal === 'partner_request';
  return base * (converts ? 1.2 : 1.0);
}

function scoreOf({ impressions, leverage, pageId, confidence, effort }) {
  const visibility = Math.log10((impressions ?? 0) + 1);
  const lever = Math.max(0, Math.min(1, leverage));
  const value = businessValue(pageId);
  const trust = CONFIDENCE_FACTOR[confidence] ?? 0.4;
  const cost = EFFORT[effort] ?? 1.5;
  return Math.round(((visibility * lever * value * trust) / cost) * 100) / 100;
}

const opportunities = [];
const pageIdForPath = (path) => map.byUrl.get(path)?.id ?? null;

/* ------------------------------------------------- 1. Quick Wins */

const quickWinSource = queryPageRows.length ? queryPageRows : queryRows;
for (const row of quickWinSource) {
  const position = row.position ?? 99;
  if (position < 4 || position > 20) continue;
  if ((row.impressions ?? 0) < 20) continue;
  if (isBrandQuery(row.query)) continue;

  const path = row.page ? toPath(row.page) : null;
  const pageId = path ? pageIdForPath(path) : null;
  const confidence = row.impressions >= 300 ? 'hoch' : row.impressions >= 60 ? 'mittel' : 'niedrig';

  opportunities.push({
    art: 'Quick Win',
    suchanfrage: row.query,
    seite: path ?? '(aus dem CSV-Export nicht ableitbar)',
    impressionen: row.impressions,
    klicks: row.clicks ?? 0,
    position: Math.round(position * 10) / 10,
    ursache: `Steht auf Position ${position.toFixed(1)} – nah genug an der ersten Seite, dass eine gezielte Verbesserung wirken kann.`,
    massnahme: path
      ? `Auf ${path} einen eigenen Abschnitt ergänzen, der genau diese Frage beantwortet, und den Begriff in eine Zwischenüberschrift nehmen.`
      : 'Zuerst über die API klären, welche Seite für diese Anfrage rankt (--api). Der CSV-Export verbindet Anfrage und Seite nicht.',
    erwartung: 'Bessere Position, dadurch mehr Klicks bei gleicher Impressionszahl.',
    datenvertrauen: confidence,
    score: scoreOf({
      impressions: row.impressions,
      leverage: (21 - position) / 17,
      pageId,
      confidence,
      effort: 'abschnitt',
    }),
  });
}

/* ------------------------------------------------- 2. CTR-Lücken */

const ctrSource = queryPageRows.length ? queryPageRows : [...queryRows, ...pageRows];
for (const row of ctrSource) {
  if ((row.impressions ?? 0) < 50) continue;
  const expected = baseline.expected(row);
  if (!expected.ctr) continue;

  const actual = row.ctr ?? 0;
  const gap = (expected.ctr - actual) / expected.ctr;
  // Erst ab einem Drittel unter der eigenen Grundlinie ist es auffällig.
  if (gap < 0.33) continue;

  const path = row.page ? toPath(row.page) : null;
  const pageId = path ? pageIdForPath(path) : null;
  const entry = pageId ? map.byId.get(pageId) : null;

  opportunities.push({
    art: 'CTR-Lücke',
    suchanfrage: row.query ?? '(Seitenexport ohne Suchanfrage)',
    seite: path ?? '—',
    impressionen: row.impressions,
    klicks: row.clicks ?? 0,
    position: Math.round((row.position ?? 0) * 10) / 10,
    ursache:
      `CTR ${(actual * 100).toFixed(1)} % gegen eigene Grundlinie ${(expected.ctr * 100).toFixed(1)} % ` +
      `auf Positionsgruppe ${bucketFor(row.position ?? 99)}. Das Ergebnis wird gesehen, aber nicht geklickt – ` +
      'meist passen Title oder Description nicht zur Erwartung.',
    massnahme: entry
      ? `Title und Meta Description von ${path} prüfen: Nennen sie das, wonach gesucht wird, und den konkreten Nutzen? Aktueller Title: „${entry.title}"`
      : 'Title und Description der betroffenen Seite prüfen.',
    erwartung: 'Mehr Klicks bei gleicher Position und gleicher Impressionszahl.',
    datenvertrauen: expected.confidence,
    score: scoreOf({
      impressions: row.impressions,
      leverage: gap,
      pageId,
      confidence: expected.confidence,
      effort: 'meta',
    }),
  });
}

/* ------------------------------- 3. Kannibalisierung aus echten Daten */

/**
 * Nur mit Suchanfrage-und-Seite-Daten möglich, also nur über die API.
 *
 * Und selbst dann ist nicht jede zweite URL ein Problem: Eine Marken-
 * suche zieht legitim mehrere eigene Seiten. Erst wenn sich Impressionen
 * bei NICHT-Marken-Anfragen deutlich auf mehrere Seiten verteilen und die
 * Seiten dieselbe Absicht bedienen, ist es Kannibalisierung.
 */
if (queryPageRows.length) {
  const byQuery = new Map();
  for (const row of queryPageRows) {
    if (isBrandQuery(row.query)) continue;
    if (!byQuery.has(row.query)) byQuery.set(row.query, []);
    byQuery.get(row.query).push(row);
  }

  for (const [query, rows] of byQuery) {
    const pages = new Map();
    for (const r of rows) {
      const path = toPath(r.page);
      pages.set(path, (pages.get(path) ?? 0) + r.impressions);
    }
    if (pages.size < 2) continue;

    const total = [...pages.values()].reduce((a, b) => a + b, 0);
    if (total < 50) continue;

    const sorted = [...pages.entries()].sort((a, b) => b[1] - a[1]);
    const secondShare = sorted[1][1] / total;
    // Unter 20 % Anteil ist die zweite Seite ein Streuer, kein Wettbewerber.
    if (secondShare < 0.2) continue;

    const entries = sorted.map(([p]) => map.byUrl.get(p)).filter(Boolean);
    const sameIntent =
      entries.length >= 2 && new Set(entries.map((e) => e.searchIntent)).size === 1;

    const main = entries.slice().sort((a, b) => b.businessPriority - a.businessPriority)[0];
    const confidence = total >= 300 ? 'hoch' : total >= 100 ? 'mittel' : 'niedrig';

    opportunities.push({
      art: 'Kannibalisierung',
      suchanfrage: query,
      seite: sorted.map(([p, imp]) => `${p} (${Math.round((imp / total) * 100)} %)`).join(' vs. '),
      impressionen: total,
      klicks: rows.reduce((a, r) => a + (r.clicks ?? 0), 0),
      position: Math.round((rows.reduce((a, r) => a + r.position, 0) / rows.length) * 10) / 10,
      ursache: sameIntent
        ? `${pages.size} eigene Seiten mit derselben Suchintention teilen sich die Impressionen.`
        : `${pages.size} eigene Seiten erscheinen zu dieser Anfrage. Die Suchintentionen unterscheiden sich – das kann in Ordnung sein.`,
      massnahme: main
        ? `Prüfen, ob ${main.url} die gewünschte Hauptseite ist. Wenn ja: interne Links für diesen Begriff dorthin bündeln und die andere Seite inhaltlich abgrenzen.`
        : 'Hauptseite für diesen Begriff festlegen und interne Verlinkung darauf ausrichten.',
      erwartung: 'Signale bündeln sich auf einer Seite statt sich zu verteilen.',
      datenvertrauen: sameIntent ? confidence : 'niedrig',
      score: scoreOf({
        impressions: total,
        leverage: sameIntent ? secondShare : secondShare * 0.4,
        pageId: main?.id,
        confidence,
        effort: 'umbau',
      }),
    });
  }
} else {
  report.info(
    'Kannibalisierung',
    'Aus CSV-Exporten nicht ermittelbar – sie verbinden Suchanfrage und Seite nicht',
    'Mit `npm run seo:opportunities -- --api` laufen lassen, sobald der API-Zugang steht',
  );
}

/* ------------------------------------------------------------------ */
/* Bing und KI-Sichtbarkeit                                            */
/* ------------------------------------------------------------------ */

if (bingQueryRows.length) {
  report.stat(`Bing: ${bingQueryRows.length} Suchanfragen importiert`);
  const bingImpressions = bingQueryRows.reduce((a, r) => a + (r.impressions ?? 0), 0);
  report.stat(`Bing-Impressionen gesamt: ${bingImpressions}`);
  report.info(
    'Bing',
    'Bing speist Copilot und ChatGPT Search. Sichtbarkeit dort wirkt auf die KI-Auffindbarkeit.',
    'Bei Lücken zuerst prüfen, ob die Seiten in Bing überhaupt indexiert sind – IndexNow meldet sie (npm run indexnow)',
  );
} else {
  report.info(
    'Bing',
    'Keine Bing-Daten in data/bing/',
    'Export aus den Bing Webmaster Tools dort ablegen. Ohne Bing fehlt die Datengrundlage für Copilot und ChatGPT Search.',
  );
}

/* ------------------------------------------------------------------ */
/* Indexierung prüfen – quotenschonend                                 */
/* ------------------------------------------------------------------ */

let inspection = [];
if (useApi && hasCredentials()) {
  /**
   * Priorisierung statt Gießkanne: Zuerst die wirtschaftlich wichtigsten
   * Seiten, dann Seiten mit auffälligen Chancen. Das Tageskontingent von
   * 2000 Abfragen wird so nicht an Nebenseiten verbraucht.
   */
  const suspicious = new Set(
    opportunities
      .filter((o) => o.seite.startsWith('/'))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((o) => o.seite),
  );

  const priorityUrls = map.indexable
    .filter((p) => p.businessPriority >= 4 || suspicious.has(p.url))
    .sort((a, b) => b.businessPriority - a.businessPriority)
    .map((p) => `https://schnellhelfer24.de${p.url}`);

  try {
    inspection = await inspectUrls('sc-domain:schnellhelfer24.de', priorityUrls, 40);
    report.stat(`URL-Prüfung: ${inspection.length} Seiten, ${quotaUsed()} API-Abfragen gesamt`);
    for (const item of inspection) {
      if (item.canonicalMismatch) {
        report.warn(
          item.url,
          `Google wählt ein anderes Canonical (${item.googleCanonical}) als die Seite angibt (${item.userCanonical})`,
          'Häufig ein Zeichen für zwei zu ähnliche Seiten – Kannibalisierungsbericht prüfen',
        );
      }
      if (item.verdict && item.verdict !== 'PASS') {
        report.warn(item.url, `Indexierungsstatus: ${item.coverageState ?? item.verdict}`, 'In der Search Console im Detail ansehen');
      }
    }
  } catch (err) {
    report.error('URL-Prüfung', err.message);
  }
}

/* ------------------------------------------------------------------ */
/* Ausgabe                                                             */
/* ------------------------------------------------------------------ */

opportunities.sort((a, b) => b.score - a.score);

report.stat(`${opportunities.length} Chancen erkannt`);
for (const o of opportunities.slice(0, 15)) {
  report.stat(
    `   ${String(o.score).padStart(6)}  ${o.art.padEnd(18)} ${String(o.suchanfrage).slice(0, 42).padEnd(44)} ${o.seite.slice(0, 40)}`,
  );
}

mkdirSync(outDir, { recursive: true });

const meta = {
  erzeugt: new Date().toISOString().slice(0, 10),
  zeitraumTage: days,
  quellen: {
    searchConsoleCsv: gscFiles.map((f) => f.file),
    bingCsv: bingFiles.map((f) => f.file),
    api: queryPageRows.length > 0,
  },
  formel:
    'Score = log10(Impressionen+1) × Hebel × (0,4 + 0,15 × Priorität) × Datenvertrauen ÷ Aufwand',
  ctrGrundlinie: baseline.describe(),
};

writeFileSync(
  join(outDir, 'opportunities.json'),
  JSON.stringify({ ...meta, opportunities, urlInspection: inspection }, null, 2) + '\n',
);

/* CSV für die Weiterverarbeitung in einer Tabelle. */
const csvEscape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csvHead = [
  'Score', 'Art', 'Suchanfrage', 'Seite', 'Impressionen', 'Klicks', 'Position',
  'Datenvertrauen', 'Mögliche Ursache', 'Empfohlene Maßnahme', 'Erwartete Verbesserung',
];
writeFileSync(
  join(outDir, 'opportunities.csv'),
  [
    csvHead.join(';'),
    ...opportunities.map((o) =>
      [o.score, o.art, o.suchanfrage, o.seite, o.impressionen, o.klicks, o.position,
       o.datenvertrauen, o.ursache, o.massnahme, o.erwartung].map(csvEscape).join(';'),
    ),
  ].join('\n') + '\n',
);

/* Markdown-Bericht. */
const md = [
  '# Chancen aus echten Suchdaten',
  '',
  `Erzeugt am ${meta.erzeugt} aus ${gscFiles.length} Search-Console-Datei(en), ` +
    `${bingFiles.length} Bing-Datei(en)${meta.quellen.api ? ' und der Search-Console-API' : ''}.`,
  '',
  '> Dieser Bericht enthält **keine** Prognose. Der Score ordnet Aufgaben nach',
  '> erwartetem Nutzen; er sagt keine Klickzahlen und keine Platzierungen voraus.',
  '',
  '## Der Score',
  '',
  '```',
  meta.formel,
  '```',
  '',
  '## Eigene CTR-Grundlinie',
  '',
  '| Positionsgruppe | Art | CTR | Impressionen | Datenvertrauen |',
  '|---|---|---:|---:|---|',
  ...meta.ctrGrundlinie.map(
    (b) => `| ${b.positionsgruppe} | ${b.art} | ${b.ctr} % | ${b.impressionen} | ${b.datenvertrauen} |`,
  ),
  '',
  '## Chancen',
  '',
  ...(opportunities.length
    ? opportunities.slice(0, 40).flatMap((o) => [
        `### ${o.score} · ${o.art} · ${o.suchanfrage}`,
        '',
        `- **Seite:** ${o.seite}`,
        `- **Aktuell:** ${o.impressionen} Impressionen, ${o.klicks} Klicks, Position ${o.position}`,
        `- **Mögliche Ursache:** ${o.ursache}`,
        `- **Empfohlene Maßnahme:** ${o.massnahme}`,
        `- **Erwartete Art der Verbesserung:** ${o.erwartung}`,
        `- **Datenvertrauen:** ${o.datenvertrauen}`,
        '',
      ])
    : ['Keine Chancen oberhalb der Schwellen gefunden.', '']),
].join('\n');

writeFileSync(join(outDir, 'opportunities.md'), md + '\n');

report.stat(`Berichte: ${outDir}`);
report.print();
process.exit(report.ok ? 0 : 1);
