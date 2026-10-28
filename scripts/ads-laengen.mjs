#!/usr/bin/env node
/**
 * Prüft die Zeichengrenzen im Anzeigenentwurf docs/GOOGLE-ADS-ENTWURF.md:
 * Überschrift ≤ 30, Beschreibung ≤ 90, Pfadteil ≤ 15 (Google-Hilfe
 * „Responsive Suchanzeigen“). Liest die Tabellen der Abschnitte direkt,
 * damit Entwurf und Prüfung nicht auseinanderlaufen.
 *
 *   node scripts/ads-laengen.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const text = readFileSync(join(root, 'docs', 'GOOGLE-ADS-ENTWURF.md'), 'utf8');
const teil = text.slice(text.indexOf('## 5. Anzeigentexte'), text.indexOf('## 6. Messung'));

let art = '';
const fehler = [];
let gezaehlt = 0;
for (const zeile of teil.split(/\r?\n/)) {
  if (/^\| Nr\. \| Überschrift/.test(zeile)) art = 'Überschrift';
  else if (/^\| Nr\. \| Beschreibung/.test(zeile)) art = 'Beschreibung';
  const m = zeile.match(/^\| (\d+) \| (.+) \|$/);
  if (m && art) {
    const max = art === 'Überschrift' ? 30 : 90;
    const laenge = [...m[2]].length;
    gezaehlt++;
    if (laenge > max) fehler.push(`${art} „${m[2]}“: ${laenge} > ${max}`);
  }
  const p = zeile.match(/^Pfad: `schnellhelfer24\.de\/(.+)`$/);
  if (p) {
    for (const teilPfad of p[1].split('/')) {
      gezaehlt++;
      if ([...teilPfad].length > 15) fehler.push(`Pfad „${teilPfad}“: ${[...teilPfad].length} > 15`);
    }
  }
}

if (gezaehlt === 0) {
  console.error('Keine Anzeigentexte gefunden – Abschnittsüberschriften geändert?');
  process.exit(1);
}
if (fehler.length) {
  for (const f of fehler) console.error('  ' + f);
  process.exit(1);
}
console.log(`${gezaehlt} Anzeigentexte und Pfadteile innerhalb der Grenzen.`);
