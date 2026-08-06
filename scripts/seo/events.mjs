#!/usr/bin/env node
/**
 * MESS-EREIGNISSE: NAMEN ABGLEICHEN
 * =================================
 *
 * Vergleicht die Ereignisnamen, die der Website-Code sendet, mit der
 * Allowlist in public/api/events.php.
 *
 * Aufruf: npm run seo:events
 *
 * WARUM ES DIESE PRÜFUNG GIBT
 * Der Endpunkt verwirft unbekannte Ereignisse stillschweigend – das ist
 * für die Datensparsamkeit richtig, macht aber jede Namensabweichung
 * unsichtbar. Es gibt keinen Fehler, keine Meldung, nur eine Auswertung,
 * in der Zahlen fehlen. Beim Bau dieses Systems ist genau das passiert:
 * Das Anfrageformular sendet `estimate_started`, die neu geschriebene
 * Allowlist erwartete `form_start`. Sämtliche Formularereignisse wären
 * spurlos verschwunden.
 *
 * Die Namen stehen in vier verschiedenen Schreibweisen im Quelltext:
 *
 *   data-track="phone_click"        direkt im Markup
 *   track="related_service_click"   als Eigenschaft an eine Komponente
 *   track: 'callback_request'       in einer Zuordnungstabelle
 *   sh24.track('estimate_started')  im Skript
 *
 * Alle vier werden erfasst. Wer eine fünfte Schreibweise einführt, muss
 * sie hier ergänzen – sonst prüft diese Datei weniger, als sie behauptet.
 *
 * BLOCKIEREND
 *   - Der Code sendet ein Ereignis, das der Endpunkt nicht kennt.
 *     Es käme nie in der Auswertung an.
 *
 * WARNUNG
 *   - Der Endpunkt erlaubt ein Ereignis, das niemand sendet.
 *     Meist ein Überbleibsel; die Liste soll beschreiben, was es gibt.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { projectRoot } from './lib/pages.mjs';

const report = new Report('Mess-Ereignisse');

/* ------------------------------------------------- Allowlist einlesen */

const endpointFile = join(projectRoot, 'public/api/events.php');
const php = readFileSync(endpointFile, 'utf8');

const listMatch = php.match(/const ALLOWED_EVENTS = \[([\s\S]*?)\];/);
if (!listMatch) {
  report.error(
    'public/api/events.php',
    'ALLOWED_EVENTS nicht gefunden',
    'Wurde die Konstante umbenannt? Dann muss auch scripts/seo/events.mjs angepasst werden.',
  );
  finish(report);
}

const allowed = new Set(
  [...listMatch[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]),
);

/* ------------------------------------------- Verwendete Namen sammeln */

/** Die vier Schreibweisen, in denen ein Ereignisname im Quelltext steht. */
const PATTERNS = [
  { re: /\bdata-track="([a-z_]+)"/g, what: 'data-track im Markup' },
  { re: /\btrack="([a-z_]+)"/g, what: 'track-Eigenschaft' },
  { re: /\btrack:\s*'([a-z_]+)'/g, what: 'track in einer Tabelle' },
  { re: /\btrack\('([a-z_]+)'/g, what: 'track()-Aufruf' },
];

/** @type {Map<string, Set<string>>} Ereignisname -> Fundstellen */
const used = new Map();

function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(astro|ts|js|mjs)$/.test(entry)) continue;

    const code = readFileSync(full, 'utf8');
    const where = relative(projectRoot, full).split('\\').join('/');

    for (const { re, what } of PATTERNS) {
      re.lastIndex = 0;
      for (const m of code.matchAll(re)) {
        const name = m[1];
        if (!used.has(name)) used.set(name, new Set());
        used.get(name).add(`${where} (${what})`);
      }
    }
  }
}

scan(join(projectRoot, 'src'));

report.stat(`${allowed.size} Ereignisse in der Allowlist des Endpunkts`);
report.stat(`${used.size} Ereignisnamen im Quelltext gefunden`);

/* ------------------------------------------------------------ Abgleich */

for (const [name, places] of [...used].sort()) {
  if (allowed.has(name)) continue;
  report.error(
    name,
    `wird gesendet, steht aber nicht in ALLOWED_EVENTS – der Endpunkt verwirft es stillschweigend`,
    `Entweder in public/api/events.php aufnehmen oder im Quelltext umbenennen. Fundstellen: ${[...places].join(', ')}`,
  );
}

for (const name of [...allowed].sort()) {
  if (used.has(name)) continue;
  report.warn(
    name,
    'steht in ALLOWED_EVENTS, wird aber nirgends gesendet',
    'Aus der Liste entfernen, wenn das Ereignis nicht mehr vorgesehen ist – die Liste soll beschreiben, was es tatsächlich gibt',
  );
}

/* Erlaubte Detailfelder gegenprüfen: Was der Endpunkt nicht kennt, geht
   verloren. Das ist gewollt, soll aber nicht unbemerkt geschehen. */
const knownDetailFields = ['location', 'step', 'lastStep', 'count', 'leistung', 'metric', 'value', 'rating'];
const detailPattern = /track\([^,]+,\s*\{([^}]*)\}/g;
const seenFields = new Set();

for (const dir of ['src']) {
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(astro|ts|js|mjs)$/.test(entry)) continue;
      const code = readFileSync(full, 'utf8');
      for (const m of code.matchAll(detailPattern)) {
        for (const f of m[1].matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:/g)) seenFields.add(f[1]);
      }
    }
  };
  walk(join(projectRoot, dir));
}

for (const field of [...seenFields].sort()) {
  if (knownDetailFields.includes(field)) continue;
  report.warn(
    `Detailfeld „${field}"`,
    'wird mitgesendet, aber vom Endpunkt nicht übernommen',
    'Entweder in events.php aufnehmen oder im Quelltext weglassen. Nicht übernommene Felder verlassen zwar den Browser, werden aber nicht gespeichert.',
  );
}

finish(report);
