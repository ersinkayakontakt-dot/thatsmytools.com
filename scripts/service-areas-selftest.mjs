#!/usr/bin/env node
/**
 * SELBSTPRÜFUNG DER EINSATZGEBIETS-PRÜFUNG
 * ========================================
 *
 * Beweist, dass `validateServiceAreas()` tatsächlich anschlägt.
 *
 * Dieselbe Begründung wie bei `npm run seo:selftest`: Eine Prüfung, die
 * bei sauberen Daten „in Ordnung" meldet, sagt für sich genommen nichts –
 * sie könnte genauso gut kaputt sein und immer „in Ordnung" melden. Hier
 * ist das besonders scharf, weil `serviceAreas` derzeit LEER ist. Über
 * eine leere Tabelle läuft jede Schleife fehlerfrei. Ohne diese Datei
 * wäre die gesamte Prüffunktion ungetestet und niemandem fiele es auf.
 *
 * Aufruf: npm run audit:plz:selftest
 *
 * Vorgehen je Fall:
 *   1. einen Datensatz mit genau einer gezielten Verletzung bauen
 *   2. `validateServiceAreas()` darauf laufen lassen
 *   3. erwarten: der zuständige Text steht im richtigen Topf
 *      (Fehler blockieren, Warnungen nicht – die Unterscheidung wird
 *      mitgeprüft, sonst könnte ein Fehler still zur Warnung verkommen)
 *
 * Der letzte Fall ist die Gegenprobe: saubere Daten müssen NULL Fehler
 * und NULL Warnungen ergeben. Ohne ihn bestünde diese Prüfung auch dann,
 * wenn `validateServiceAreas()` wahllos alles beanstandet.
 *
 * Die echte Datendatei wird nie verändert – die Prüffunktion nimmt die
 * Testdaten über ihren dritten Parameter entgegen.
 */
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/*
 * Ein roher Windows-Pfad ist in einem Importstring keine gültige
 * Zeichenkette – `\U` liest der Parser als Escape-Sequenz. `pathToFileURL`
 * erzeugt eine file://-URL, die auf allen Plattformen funktioniert.
 * Node ab 22.18 führt die TypeScript-Quelle ohne Buildschritt aus.
 */
const { validateServiceAreas } = await import(
  pathToFileURL(join(root, 'src/data/serviceAreas.ts')).href
);

/* ------------------------------------------------------------------ */
/* Testdaten                                                           */
/* ------------------------------------------------------------------ */

/*
 * ACHTUNG: Alles hier ist erfunden und dient ausschließlich dem Test.
 * Diese Zahlen sind KEINE geprüften Postleitzahlen und dürfen nicht in
 * `src/data/serviceAreas.ts` übernommen werden. Die echte Tabelle wird
 * ausschließlich aus einer amtlichen Quelle befüllt.
 */

/** Bekannte Slugs, klein gehalten, damit Lücken eindeutig zuzuordnen sind. */
const DISTRICTS = ['mitte', 'spandau'];
const TOWNS = ['potsdam'];

const SOURCE = {
  label: 'Testquelle',
  url: 'https://example.invalid/plz',
  publisher: 'Nur für die Selbstprüfung',
  checked: '2026-09-24',
};

/** Ein in jeder Hinsicht gültiges Gebiet. Jeder Fall bricht genau eine Regel. */
const gueltig = (overrides = {}) => ({
  plz: '10115',
  city: 'Berlin',
  districts: ['mitte'],
  primaryDistrict: 'mitte',
  quarters: ['Mitte'],
  service: 'regulaer',
  priority: 1,
  ...overrides,
});

/* ------------------------------------------------------------------ */
/* Die Gegenbeispiele                                                  */
/* ------------------------------------------------------------------ */

const CASES = [
  /* --- Fehler: blockieren die Veröffentlichung --------------------- */
  {
    name: 'Schalter steht an, aber die Tabelle ist leer',
    bucket: 'errors',
    expect: 'die Tabelle ist leer',
    input: { areas: [], available: true, source: SOURCE },
  },
  {
    name: 'Schalter steht an, aber die Herkunft ist nicht belegt',
    bucket: 'errors',
    expect: 'dataSource fehlt',
    input: { areas: [gueltig()], available: true, source: null },
  },
  {
    name: 'Postleitzahl hat nicht fünf Ziffern',
    bucket: 'errors',
    expect: 'keine gültige fünfstellige Postleitzahl',
    input: {
      areas: [gueltig({ plz: '1011', city: 'Testort', districts: ['potsdam'], primaryDistrict: 'potsdam' })],
      available: true,
      source: SOURCE,
    },
  },
  {
    name: 'dieselbe Postleitzahl zweimal erfasst',
    bucket: 'errors',
    expect: 'ist 2-mal erfasst',
    input: { areas: [gueltig(), gueltig()], available: true, source: SOURCE },
  },
  {
    name: 'Gebiet ohne jeden Bezirks- oder Ortsslug',
    bucket: 'errors',
    expect: 'kein Bezirks- oder Ortsslug zugeordnet',
    input: { areas: [gueltig({ districts: [] })], available: true, source: SOURCE },
  },
  {
    name: 'Slug, den es weder in districts.ts noch in towns.ts gibt',
    bucket: 'errors',
    expect: 'existiert weder in districts.ts noch in towns.ts',
    input: {
      areas: [gueltig({ districts: ['gibt-es-nicht'], primaryDistrict: 'gibt-es-nicht' })],
      available: true,
      source: SOURCE,
    },
  },
  {
    name: 'primaryDistrict steht nicht in der eigenen Bezirksliste',
    bucket: 'errors',
    expect: 'ist nicht in districts aufgeführt',
    input: {
      areas: [gueltig({ districts: ['mitte'], primaryDistrict: 'spandau' })],
      available: true,
      source: SOURCE,
    },
  },
  {
    name: 'als Berlin geführt, liegt aber außerhalb des Berliner Nummernbereichs',
    bucket: 'errors',
    expect: 'liegt aber außerhalb',
    input: { areas: [gueltig({ plz: '99999' })], available: true, source: SOURCE },
  },
  {
    name: 'veröffentlichter Bezirk ohne eine einzige Postleitzahl',
    bucket: 'errors',
    expect: "Bezirk 'spandau' hat keine einzige Postleitzahl",
    input: { areas: [gueltig()], available: true, source: SOURCE },
  },

  /* --- Warnungen: brauchen eine Entscheidung, blockieren nicht ----- */
  {
    name: 'Gebiete erfasst, aber der Schalter steht aus',
    bucket: 'warnings',
    expect: 'Die Daten wirken nirgends',
    input: { areas: [gueltig()], available: false, source: SOURCE },
  },
  {
    name: 'Ort außerhalb Berlins, aber Postleitzahl im Berliner Bereich',
    bucket: 'warnings',
    expect: 'die PLZ liegt im Berliner Bereich',
    input: {
      areas: [gueltig({ plz: '13581', city: 'Teltow', districts: ['potsdam'], primaryDistrict: 'potsdam' })],
      available: true,
      source: SOURCE,
    },
  },
  {
    name: 'Gebiet wird bedient, aber ohne Priorität für die Tourenplanung',
    bucket: 'warnings',
    expect: 'ohne Priorität',
    input: { areas: [gueltig({ priority: null })], available: true, source: SOURCE },
  },
  {
    name: "'nach-pruefung' ohne Notiz, was geprüft wird",
    bucket: 'warnings',
    expect: 'ohne Notiz',
    input: { areas: [gueltig({ service: 'nach-pruefung' })], available: true, source: SOURCE },
  },

  /* --- Gegenprobe -------------------------------------------------- */
  {
    name: 'GEGENPROBE: saubere Daten ergeben null Fehler und null Warnungen',
    bucket: 'clean',
    input: {
      available: true,
      source: SOURCE,
      areas: [
        gueltig({ plz: '10115', districts: ['mitte'], primaryDistrict: 'mitte' }),
        gueltig({ plz: '13581', districts: ['spandau'], primaryDistrict: 'spandau', priority: 2 }),
        gueltig({
          plz: '14467',
          city: 'Potsdam',
          districts: ['potsdam'],
          primaryDistrict: 'potsdam',
          quarters: ['Innenstadt'],
          service: 'nach-pruefung',
          priority: 3,
          note: 'Anfahrt wird vorher abgestimmt.',
        }),
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* Ausführung                                                          */
/* ------------------------------------------------------------------ */

let passed = 0;
let failed = 0;

console.log('Selbstprüfung der Einsatzgebiets-Prüfung');
console.log('='.repeat(66));
console.log('Jeder Fall baut eine echte Verletzung und erwartet, dass die Regel greift.\n');

for (const testCase of CASES) {
  let result;
  try {
    result = validateServiceAreas(DISTRICTS, TOWNS, testCase.input);
  } catch (err) {
    console.log(`  FEHLGESCHLAGEN  ${testCase.name}`);
    console.log(`                  Die Prüfung ist abgestürzt: ${err.message}`);
    failed += 1;
    continue;
  }

  if (testCase.bucket === 'clean') {
    const clean = result.errors.length === 0 && result.warnings.length === 0;
    if (clean) {
      console.log(`  bestanden       ${testCase.name}`);
      passed += 1;
    } else {
      console.log(`  FEHLGESCHLAGEN  ${testCase.name}`);
      console.log('                  Saubere Daten wurden beanstandet:');
      for (const line of [...result.errors, ...result.warnings]) {
        console.log(`                    • ${line}`);
      }
      failed += 1;
    }
    continue;
  }

  const hit = result[testCase.bucket].some((line) => line.includes(testCase.expect));
  const andereSeite = testCase.bucket === 'errors' ? 'warnings' : 'errors';
  const verrutscht = result[andereSeite].some((line) => line.includes(testCase.expect));

  if (hit) {
    console.log(`  erkannt         ${testCase.name}`);
    passed += 1;
  } else if (verrutscht) {
    console.log(`  FALSCHER TOPF   ${testCase.name}`);
    console.log(
      `                  erwartet als ${testCase.bucket === 'errors' ? 'Fehler' : 'Warnung'}, ` +
        `gefunden als ${andereSeite === 'errors' ? 'Fehler' : 'Warnung'}.`,
    );
    console.log('                  Ein Fehler, der zur Warnung wird, blockiert nicht mehr.');
    failed += 1;
  } else {
    console.log(`  NICHT ERKANNT   ${testCase.name}`);
    console.log(`                  erwartet wurde der Text "${testCase.expect}" unter ${testCase.bucket}`);
    console.log(`                  bekommen: ${result.errors.length} Fehler, ${result.warnings.length} Warnungen`);
    for (const line of [...result.errors, ...result.warnings]) {
      console.log(`                    • ${line}`);
    }
    failed += 1;
  }
}

console.log('');
console.log('='.repeat(66));
console.log(`  ${passed} von ${CASES.length} Fällen bestanden.`);
if (failed) {
  console.log(`  ${failed} Regeln haben ihr Gegenbeispiel NICHT gefunden und prüfen damit nichts.`);
}
console.log('');

process.exit(failed ? 1 : 0);
