#!/usr/bin/env node
/**
 * SELBSTPRÜFUNG DES SUCHDATEN-IMPORTS
 * ===================================
 *
 * Prüft Parser, CTR-Grundlinie und Score gegen Eingaben, deren richtiges
 * Ergebnis bekannt ist.
 *
 *   npm run seo:opportunities:selftest
 *
 * WARUM DAS NÖTIG IST
 * Ein Zahlen-Parser scheitert leise. „3,4" wird zu 3, „4,2 %" wird zu 4,2
 * statt 0,042, „1.234" wird zu 1,234 – und die Auswertung läuft trotzdem
 * durch und liefert plausibel aussehende, falsche Ergebnisse. Genau davor
 * schützen diese Fälle.
 *
 * WICHTIG: Die Eingaben hier sind FIKTIV und dienen ausschließlich dem
 * Nachweis, dass gerechnet wird. Sie erscheinen in keinem Bericht und
 * werden nie als echte Kennzahlen dargestellt.
 */
import { parseExport, toNumber, toRate, toPath, isBrandQuery } from './parse.mjs';
import { buildBaseline, bucketFor } from './baseline.mjs';

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed += 1;
    console.log(`  ok        ${name}`);
  } else {
    failed += 1;
    console.log(`  FEHLER    ${name}`);
    console.log(`            erwartet: ${JSON.stringify(expected)}`);
    console.log(`            bekommen: ${JSON.stringify(actual)}`);
  }
}

function near(name, actual, expected, tolerance = 0.0001) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (ok) {
    passed += 1;
    console.log(`  ok        ${name}`);
  } else {
    failed += 1;
    console.log(`  FEHLER    ${name}`);
    console.log(`            erwartet: ${expected} (±${tolerance})`);
    console.log(`            bekommen: ${actual}`);
  }
}

console.log('Selbstprüfung: Suchdaten-Import');
console.log('='.repeat(66));
console.log('Fiktive Eingaben mit bekanntem Sollwert. Keine echten Kennzahlen.\n');

/* ------------------------------------------------------- Zahlenformate */

console.log('Zahlenformate');
near('deutsches Dezimalkomma "3,4"', toNumber('3,4'), 3.4);
near('englischer Dezimalpunkt "3.4"', toNumber('3.4'), 3.4);
near('deutscher Tausenderpunkt "1.234"', toNumber('1.234'), 1234);
near('englisches Tausenderkomma "1,234"', toNumber('1,234'), 1234);
near('gemischt deutsch "1.234,56"', toNumber('1.234,56'), 1234.56);
near('gemischt englisch "1,234.56"', toNumber('1,234.56'), 1234.56);
near('Prozent deutsch "4,2 %"', toRate('4,2 %'), 0.042);
near('Prozent englisch "4.2%"', toRate('4.2%'), 0.042);
near('Anteil ohne Prozentzeichen "0,042"', toRate('0,042'), 0.042);
near('leerer Wert', toNumber(''), 0);

/* --------------------------------------------------------- CSV-Formate */

console.log('\nCSV-Formate');

const germanCsv =
  '﻿Häufigste Suchanfragen;Klicks;Impressionen;Klickrate;Position\n' +
  'entrümpelung berlin;12;1.240;0,97 %;8,4\n' +
  '"wohnungsauflösung berlin, kosten";3;210;1,43 %;12,1\n';

const germanParsed = parseExport(germanCsv, 'deutsch.csv');
check('Dimension erkannt', germanParsed.dimension, 'query');
check('Zeilenzahl', germanParsed.rows.length, 2);
check('BOM entfernt, Suchanfrage gelesen', germanParsed.rows[0].query, 'entrümpelung berlin');
near('Tausenderpunkt in Impressionen', germanParsed.rows[0].impressions, 1240);
near('deutsche CTR', germanParsed.rows[0].ctr, 0.0097);
near('deutsche Position', germanParsed.rows[0].position, 8.4);
check(
  'Komma innerhalb von Anführungszeichen',
  germanParsed.rows[1].query,
  'wohnungsauflösung berlin, kosten',
);

const englishCsv =
  'Top pages,Clicks,Impressions,CTR,Position\n' +
  'https://schnellhelfer24.de/leistungen/entruempelung-berlin/,45,2300,1.96%,6.2\n';

const englishParsed = parseExport(englishCsv, 'english.csv');
check('englische Kopfzeile, Dimension', englishParsed.dimension, 'page');
near('englische Impressionen', englishParsed.rows[0].impressions, 2300);
near('englische CTR', englishParsed.rows[0].ctr, 0.0196);

/* Unbekannte Kopfzeile muss laut scheitern, nicht still nullen. */
let threw = false;
try {
  parseExport('Spalte A;Spalte B\n1;2\n', 'unbekannt.csv');
} catch {
  threw = true;
}
check('unbekannte Kopfzeile bricht ab', threw, true);

/* ------------------------------------------------------------- Pfade */

console.log('\nURL-Normalisierung');
check('absolute URL zu Pfad', toPath('https://schnellhelfer24.de/kontakt/'), '/kontakt/');
check('Schrägstrich ergänzt', toPath('https://schnellhelfer24.de/kontakt'), '/kontakt/');
check('Parameter entfernt', toPath('https://schnellhelfer24.de/kosten/?x=1'), '/kosten/');
check('Anker entfernt', toPath('https://schnellhelfer24.de/fragen/#faq'), '/fragen/');
check('Wurzel', toPath('https://schnellhelfer24.de/'), '/');

console.log('\nMarkenerkennung');
check('Marke erkannt', isBrandQuery('schnellhelfer24 berlin'), true);
check('Marke mit Leerzeichen', isBrandQuery('schnell helfer 24'), true);
check('keine Marke', isBrandQuery('entrümpelung berlin'), false);

/* --------------------------------------------------------- Grundlinie */

console.log('\nCTR-Grundlinie');
check('Positionsgruppe 2,1', bucketFor(2.1), '1-3');
check('Positionsgruppe 5,0', bucketFor(5.0), '4-6');
check('Positionsgruppe 8,7', bucketFor(8.7), '7-10');
check('Positionsgruppe 15', bucketFor(15), '11-20');
check('Positionsgruppe 40', bucketFor(40), '21+');

/**
 * Aufbau: 2000 Impressionen auf Position 5 mit 100 Klicks ergeben 5 %.
 * Eine Markenanfrage mit 50 % CTR darf diesen Wert NICHT anheben – genau
 * dafür ist die Trennung da.
 */
const baseline = buildBaseline([
  { query: 'entrümpelung berlin', device: 'desktop', position: 5, clicks: 100, impressions: 2000 },
  { query: 'schnellhelfer24', device: 'desktop', position: 5, clicks: 500, impressions: 1000 },
]);

const nonBrand = baseline.expected({ query: 'wohnungsauflösung berlin', device: 'desktop', position: 5 });
near('Grundlinie ohne Markeneinfluss', nonBrand.ctr, 0.05);
check('Datenvertrauen bei 2000 Impressionen', nonBrand.confidence, 'hoch');

const brand = baseline.expected({ query: 'schnellhelfer24', device: 'desktop', position: 5 });
near('Markengrundlinie getrennt', brand.ctr, 0.5);

const thin = buildBaseline([
  { query: 'seltene anfrage', device: 'mobile', position: 9, clicks: 1, impressions: 30 },
]);
check(
  'zu wenige Daten werden als unsicher gemeldet',
  thin.expected({ query: 'seltene anfrage', device: 'mobile', position: 9 }).confidence,
  'niedrig',
);

/* --------------------------------------------------------------- Ende */

console.log('\n' + '='.repeat(66));
console.log(`  ${passed} Prüfungen bestanden, ${failed} fehlgeschlagen.`);
if (failed) {
  console.log('  Der Import rechnet falsch. Auswertungen darauf wären wertlos.');
}
console.log('');

process.exit(failed ? 1 : 0);
