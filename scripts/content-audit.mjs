#!/usr/bin/env node
/**
 * INHALTSPRÜFUNG
 * ==============
 * Prüft die Datendateien, bevor gebaut wird:
 *
 *   - Publish Guard: Ist etwas als veröffentlicht markiert, obwohl
 *     Pflichtinhalte fehlen?
 *   - Sind Entwürfe inzwischen vollständig und könnten online gehen?
 *   - Halten die direkten Kurzantworten die 40-bis-100-Wörter-Regel ein?
 *   - Gibt es doppelte Title Tags oder Meta Descriptions in den Daten?
 *   - Zeigen interne Verweise auf Inhalte, die es nicht gibt?
 *   - Stehen noch Platzhalter in veröffentlichten Inhalten?
 *
 * Aufruf: npm run audit:content
 *
 * Die Prüfung läuft über den TypeScript-Quellcode. Damit sie ohne
 * Build-Schritt funktioniert, wird Astros eigener Loader genutzt.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/**
 * Importpfad für die temporäre Prüfdatei.
 *
 * Ein roher Windows-Pfad (`C:\Users\...`) ist in einem Importstring keine
 * gültige Zeichenkette – `\U` liest der Parser als Escape-Sequenz und bricht
 * mit ERR_INVALID_TYPESCRIPT_SYNTAX ab. `pathToFileURL` erzeugt eine
 * file://-URL, die auf allen Plattformen funktioniert.
 */
const mod = (relative) => pathToFileURL(join(root, relative)).href;

/**
 * Das Prüfprogramm wird als temporäre Datei abgelegt und mit Node
 * ausgeführt. `--experimental-strip-types` erlaubt seit Node 22 das
 * direkte Ausführen von TypeScript ohne Buildschritt.
 */
const tmpDir = join(root, '.astro');
mkdirSync(tmpDir, { recursive: true });
const tmpFile = join(tmpDir, 'content-audit.mts');

writeFileSync(
  tmpFile,
  `
import { auditContent } from '${mod('src/lib/publishGuard.ts')}';
import { services, publishedServices } from '${mod('src/data/services.ts')}';
import { districts } from '${mod('src/data/districts.ts')}';
import { towns } from '${mod('src/data/towns.ts')}';
import { guides } from '${mod('src/data/guides.ts')}';
import { cases } from '${mod('src/data/cases.ts')}';

const errors: string[] = [];
const notes: string[] = [];

/* ----------------------------------------- Publish Guard auswerten */
for (const item of auditContent()) {
  (item.level === 'error' ? errors : notes).push(item.where + ': ' + item.message);
}

/* -------------------------------------- Kurzantworten 40–100 Wörter */
const words = (s: string) => s.trim().split(/\\s+/).length;

const answerful: { label: string; answer: string; published: boolean }[] = [
  ...services.map((s) => ({ label: 'Leistung /' + s.slug + '/', answer: s.answer, published: s.status === 'published' })),
  ...districts.map((d) => ({ label: 'Bezirk ' + d.name, answer: d.answer, published: d.status === 'published' })),
  ...towns.map((t) => ({ label: 'Ort ' + t.name, answer: t.answer, published: t.status === 'published' })),
  ...guides.map((g) => ({ label: 'Ratgeber /' + g.slug + '/', answer: g.answer, published: g.status === 'published' })),
];

for (const a of answerful) {
  if (!a.published) continue;
  const n = words(a.answer);
  if (n < 40) notes.push(a.label + ': Kurzantwort hat nur ' + n + ' Wörter (Ziel 40 bis 100)');
  if (n > 100) notes.push(a.label + ': Kurzantwort hat ' + n + ' Wörter (Ziel 40 bis 100)');
}

/* ------------------------------------------------- Doppelte Metadaten */
function checkDuplicates(label: string, entries: { slug: string; title: string; desc: string; published: boolean }[]) {
  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();
  for (const e of entries) {
    if (!e.published) continue;
    titles.set(e.title, [...(titles.get(e.title) ?? []), e.slug]);
    descs.set(e.desc, [...(descs.get(e.desc) ?? []), e.slug]);
  }
  for (const [t, slugs] of titles) if (slugs.length > 1) errors.push(label + ': gleicher Title bei ' + slugs.join(', ') + ' ("' + t + '")');
  for (const [d, slugs] of descs) if (slugs.length > 1) errors.push(label + ': gleiche Description bei ' + slugs.join(', '));
}

checkDuplicates('Leistungen', services.map((s) => ({ slug: s.slug, title: s.metaTitle, desc: s.metaDescription, published: s.status === 'published' })));
checkDuplicates('Bezirke', districts.map((d) => ({ slug: d.slug, title: d.metaTitle, desc: d.metaDescription, published: d.status === 'published' })));
checkDuplicates('Orte', towns.map((t) => ({ slug: t.slug, title: t.metaTitle, desc: t.metaDescription, published: t.status === 'published' })));
checkDuplicates('Ratgeber', guides.map((g) => ({ slug: g.slug, title: g.metaTitle, desc: g.metaDescription, published: g.status === 'published' })));

/* ------------------------------------------------- Verweise prüfen */
const serviceSlugs = new Set(services.map((s) => s.slug));
const guideSlugs = new Set(guides.map((g) => g.slug));
const publishedServiceSlugs = new Set(publishedServices.map((s) => s.slug));

for (const s of services) {
  for (const r of s.related) if (!serviceSlugs.has(r)) errors.push('Leistung /' + s.slug + '/: verweist auf unbekannte Leistung "' + r + '"');
  for (const g of s.guides ?? []) if (!guideSlugs.has(g)) errors.push('Leistung /' + s.slug + '/: verweist auf unbekannten Ratgeber "' + g + '"');
}
for (const g of guides) {
  for (const r of g.related) if (!guideSlugs.has(r)) errors.push('Ratgeber /' + g.slug + '/: verweist auf unbekannten Ratgeber "' + r + '"');
  for (const s of g.services) if (!serviceSlugs.has(s)) errors.push('Ratgeber /' + g.slug + '/: verweist auf unbekannte Leistung "' + s + '"');
}
for (const loc of [...districts, ...towns]) {
  for (const s of loc.focusServices) {
    if (!serviceSlugs.has(s)) errors.push('Standort ' + loc.name + ': verweist auf unbekannte Leistung "' + s + '"');
    else if (loc.status === 'published' && !publishedServiceSlugs.has(s)) notes.push('Standort ' + loc.name + ': verweist auf die noch nicht veröffentlichte Leistung "' + s + '"');
  }
}
for (const c of cases) {
  if (!serviceSlugs.has(c.serviceSlug)) errors.push('Einsatzbericht /' + c.slug + '/: unbekannte Leistung "' + c.serviceSlug + '"');
}

/* ----------------------------------- Platzhalter in Veröffentlichtem */
const placeholder = /\\[[A-ZÄÖÜ][^\\]]{4,}\\]/;

for (const s of publishedServices) {
  const text = [s.answer, s.teaser, ...s.includes, ...(s.notIncluded ?? []), ...s.faq.map((f) => f.a)].join(' ');
  if (placeholder.test(text)) errors.push('Leistung /' + s.slug + '/: enthält noch Platzhalter im veröffentlichten Text');
}
for (const loc of [...districts, ...towns].filter((l) => l.status === 'published')) {
  const text = [loc.answer, ...loc.intro, ...loc.buildings, ...loc.access].join(' ');
  if (placeholder.test(text)) errors.push('Standort ' + loc.name + ': enthält noch Platzhalter im veröffentlichten Text');
}

/* --------------------------------------------------------- Ausgabe */
console.log('Inhalte geprüft:');
console.log('  Leistungen:      ' + services.filter((s) => s.status === 'published').length + ' veröffentlicht, ' + services.filter((s) => s.status !== 'published').length + ' Entwurf');
console.log('  Bezirke:         ' + districts.filter((d) => d.status === 'published').length + ' veröffentlicht, ' + districts.filter((d) => d.status !== 'published').length + ' Entwurf');
console.log('  Orte im Umland:  ' + towns.filter((t) => t.status === 'published').length + ' veröffentlicht, ' + towns.filter((t) => t.status !== 'published').length + ' Entwurf');
console.log('  Ratgeber:        ' + guides.filter((g) => g.status === 'published').length + ' veröffentlicht');
console.log('  Einsatzberichte: ' + cases.filter((c) => c.status === 'published' && c.real).length + ' echt und veröffentlicht, ' + cases.filter((c) => !c.real).length + ' Muster');
console.log('');

if (errors.length) {
  console.log('FEHLER (' + errors.length + ')');
  console.log('='.repeat(60));
  for (const e of errors) console.log('  ' + e);
  console.log('');
}
if (notes.length) {
  console.log('HINWEISE (' + notes.length + ')');
  console.log('='.repeat(60));
  for (const n of notes) console.log('  ' + n);
  console.log('');
}
if (!errors.length && !notes.length) console.log('Keine Auffälligkeiten.');

process.exit(errors.length ? 1 : 0);
`,
  'utf8',
);

const result = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', tmpFile], {
  stdio: 'inherit',
  cwd: root,
});

rmSync(tmpFile, { force: true });
process.exit(result.status ?? 1);
