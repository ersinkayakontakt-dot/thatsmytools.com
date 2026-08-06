#!/usr/bin/env node
/**
 * SAMMELPRÜFUNG
 * =============
 *
 * Führt alle SEO-Guards nacheinander aus und fasst das Ergebnis zusammen.
 * Dies ist der Befehl, der vor jedem Deployment laufen muss.
 *
 *   npm run seo:all
 *   npm run seo:all -- --report    schreibt zusätzlich SEO-AUDIT-REPORT.md
 *
 * Jeder Guard läuft in einem eigenen Prozess. Das ist etwas langsamer als
 * ein gemeinsamer Lauf, hat aber zwei Vorteile, die schwerer wiegen:
 * Ein Absturz in einer Prüfung legt die übrigen nicht lahm, und jeder
 * Guard bleibt einzeln aufrufbar, wenn man nur an einer Sache arbeitet.
 *
 * Exitcode 1, sobald irgendein Guard einen FEHLER meldet. Warnungen
 * blockieren nicht – sie brauchen eine redaktionelle Entscheidung, und die
 * darf ein Skript nicht erzwingen.
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot, distDir } from './lib/pages.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const writeReport = process.argv.includes('--report');

if (!existsSync(distDir)) {
  console.error('Kein dist/-Verzeichnis. Bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

const GUARDS = [
  ['metadata.mjs', 'Metadaten und Seitenkarte'],
  ['linkgraph.mjs', 'Linkgraph und interne Autorität'],
  ['cannibalization.mjs', 'Keyword-Kannibalisierung'],
  ['schema.mjs', 'Strukturierte Daten und Unternehmens-Entity'],
  ['images.mjs', 'Bilder'],
  ['contrast.mjs', 'Kontrast (WCAG 2.2 AA)'],
];

const results = [];

for (const [file, label] of GUARDS) {
  const run = spawnSync(process.execPath, [join(here, file)], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  const output = (run.stdout ?? '') + (run.stderr ?? '');
  process.stdout.write(output);

  /* Fehler- und Warnungszahlen aus der Ausgabe lesen. */
  const errors = Number((output.match(/FEHLER \((\d+)\)/) ?? [, 0])[1]);
  const warnings = Number((output.match(/WARNUNGEN \((\d+)\)/) ?? [, 0])[1]);

  results.push({
    file,
    label,
    errors,
    warnings,
    // Ein Absturz (kein sauberer Exitcode 0/1) ist selbst ein Fehler und
    // darf nicht als "bestanden" durchgehen.
    crashed: run.status !== 0 && run.status !== 1,
    status: run.status,
    output,
  });
}

/* ------------------------------------------------------------------ */
/* Zusammenfassung                                                     */
/* ------------------------------------------------------------------ */

const line = '='.repeat(66);
console.log(`\n${line}\nZUSAMMENFASSUNG\n${line}`);

let totalErrors = 0;
let totalWarnings = 0;

for (const r of results) {
  totalErrors += r.errors;
  totalWarnings += r.warnings;
  const mark = r.crashed ? 'ABSTURZ' : r.errors ? 'FEHLER ' : r.warnings ? 'Hinweis' : 'in Ordnung';
  console.log(
    `  ${mark.padEnd(11)} ${r.label.padEnd(46)} ${r.errors} Fehler, ${r.warnings} Warnungen`,
  );
  if (r.crashed) {
    console.log(`              Exitcode ${r.status} – die Prüfung selbst ist fehlgeschlagen`);
  }
}

console.log('');
if (totalErrors) {
  console.log(`  ${totalErrors} Fehler blockieren die Veröffentlichung.`);
} else {
  console.log('  Keine blockierenden Fehler.');
}
if (totalWarnings) {
  console.log(`  ${totalWarnings} Warnungen brauchen eine redaktionelle Entscheidung.`);
}
console.log('');

/* ------------------------------------------------------------------ */
/* Auditbericht                                                        */
/* ------------------------------------------------------------------ */

if (writeReport) {
  const today = new Date().toISOString().slice(0, 10);

  /**
   * Die Vorgeschichte – Ausgangslage, gefundene Fehler, umgesetzte
   * Verbesserungen – lässt sich nicht messen, sondern nur aufschreiben.
   * Sie steht deshalb in einer eigenen Datei und wird hier eingebettet.
   *
   * Trennung der Zuständigkeiten: Alles unterhalb von „Überblick" ist
   * gemessen und wird bei jedem Lauf überschrieben. Alles darüber ist
   * redaktionell und bleibt erhalten.
   */
  const introFile = join(projectRoot, 'docs', 'audit-ausgangslage.md');
  const intro = existsSync(introFile) ? readFileSync(introFile, 'utf8').trim() : '';

  const md = [
    '# SEO-Auditbericht',
    '',
    `Der gemessene Teil wurde am ${today} mit \`npm run seo:report\` erzeugt.`,
    'Er ist eine Momentaufnahme des gebauten Standes in `dist/` – nicht der',
    'Quelldateien. Der Abschnitt „Ausgangslage" darüber ist redaktionell',
    'und stammt aus `docs/audit-ausgangslage.md`.',
    '',
    ...(intro ? [intro, ''] : []),
    '---',
    '',
    '# Gemessener Stand',
    '',
    '## Überblick',
    '',
    '| Prüfung | Fehler | Warnungen |',
    '|---|---:|---:|',
    ...results.map((r) => `| ${r.label} | ${r.errors} | ${r.warnings} |`),
    `| **Summe** | **${totalErrors}** | **${totalWarnings}** |`,
    '',
    totalErrors
      ? `> ${totalErrors} Fehler blockieren die Veröffentlichung.`
      : '> Keine blockierenden Fehler.',
    '',
    '## Vollständige Ausgabe je Prüfung',
    '',
    ...results.flatMap((r) => [
      `### ${r.label}`,
      '',
      '```',
      r.output.trim(),
      '```',
      '',
    ]),
  ].join('\n');

  const out = join(projectRoot, 'SEO-AUDIT-REPORT.md');
  writeFileSync(out, md + '\n', 'utf8');
  console.log(`  Bericht geschrieben: ${out}\n`);
}

process.exit(totalErrors || results.some((r) => r.crashed) ? 1 : 0);
