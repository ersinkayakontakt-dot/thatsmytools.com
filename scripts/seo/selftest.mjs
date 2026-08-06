#!/usr/bin/env node
/**
 * SELBSTPRÜFUNG DER SEO-GUARDS
 * ============================
 *
 * Beweist, dass die Prüfungen tatsächlich anschlagen.
 *
 * Ein Guard, der bei einem sauberen Projekt "in Ordnung" meldet, sagt für
 * sich genommen nichts aus – er könnte genauso gut kaputt sein und immer
 * "in Ordnung" melden. Diese Selbstprüfung baut deshalb absichtlich
 * fehlerhafte Kopien der Website und erwartet, dass die zuständige Regel
 * daran scheitert. Scheitert sie nicht, ist die Regel wertlos und DIESE
 * Prüfung schlägt fehl.
 *
 * Aufruf: npm run seo:selftest
 *
 * Vorgehen je Fall:
 *   1. dist/ in ein temporäres Verzeichnis kopieren
 *   2. eine gezielte Verletzung einbauen
 *   3. den zuständigen Guard über SEO_DIST darauf richten
 *   4. erwarten: Exitcode 1 UND ein Text, der den Fall benennt
 *
 * Die echten Projektdateien werden dabei nie verändert.
 */
import { cpSync, readFileSync, writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot } from './lib/pages.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(projectRoot, 'dist');
const work = join(projectRoot, 'tmp', 'seo-selftest');

if (!existsSync(dist)) {
  console.error('Kein dist/-Verzeichnis. Bitte zuerst "npm run build" ausführen.');
  process.exit(1);
}

/** Ein Fall: Verletzung einbauen, erwarteten Text nennen. */
const CASES = [
  {
    name: 'toter interner Link',
    guard: 'linkgraph.mjs',
    expect: 'Link ins Leere',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace('<main', '<main><p><a href="/gibt-es-nicht/">Seite, die es nicht gibt</a></p>'),
      );
    },
  },
  {
    name: 'verwaiste indexierbare Seite',
    guard: 'linkgraph.mjs',
    expect: 'ohne einen einzigen internen Link',
    break: (dir) => {
      // Alle Verweise auf die Über-uns-Seite entfernen.
      forEachHtml(dir, (html) => html.replaceAll('href="/ueber-uns/"', 'href="/kontakt/"'));
    },
  },
  {
    name: 'Link von einer indexierbaren Seite auf einen Entwurf',
    guard: 'linkgraph.mjs',
    expect: 'verlinkt auf einen Entwurf',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(
          '<main',
          '<main><p><a href="/leistungen/demontage-rueckbau/">Demontage und Rückbau</a></p>',
        ),
      );
    },
  },
  {
    name: 'doppelter Title auf zwei Seiten',
    guard: 'metadata.mjs',
    expect: 'gleicher Title auf',
    break: (dir) => {
      const source = readFileSync(join(dir, 'kontakt', 'index.html'), 'utf8');
      const title = source.match(/<title>([\s\S]*?)<\/title>/)[1];
      patch(join(dir, 'fragen', 'index.html'), (html) =>
        html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`),
      );
    },
  },
  {
    name: 'Canonical zeigt auf eine andere Seite',
    guard: 'metadata.mjs',
    expect: 'Canonical zeigt auf',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(
          /<link rel="canonical" href="[^"]*"/,
          '<link rel="canonical" href="https://schnellhelfer24.de/fragen/"',
        ),
      );
    },
  },
  {
    name: 'noindex-Seite steht in der Sitemap',
    guard: 'metadata.mjs',
    expect: 'ist aber noindex',
    break: (dir) => {
      patch(join(dir, 'sitemap.xml'), (xml) =>
        xml.replace(
          '</urlset>',
          '  <url><loc>https://schnellhelfer24.de/brandenburg/teltow/</loc><lastmod>2026-07-30</lastmod></url>\n</urlset>',
        ),
      );
    },
  },
  {
    name: 'H1 weicht von der Seitenkarte ab',
    guard: 'metadata.mjs',
    expect: 'weicht von der Seitenkarte ab',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '<h1>Etwas ganz anderes</h1>'),
      );
    },
  },
  {
    name: 'Platzhalter in den strukturierten Daten',
    guard: 'schema.mjs',
    expect: 'Platzhalter in den strukturierten Daten',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace('"telephone":', '"faxNumber":"[FAXNUMMER EINTRAGEN]","telephone":'),
      );
    },
  },
  {
    name: 'Telefonnummer im Schema weicht von site.ts ab',
    guard: 'schema.mjs',
    expect: 'weicht von src/config/site.ts',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(/"telephone":"[^"]*"/, '"telephone":"+49 30 12345678"'),
      );
    },
  },
  {
    name: 'erfundenes aggregateRating ohne sichtbare Bewertungen',
    guard: 'schema.mjs',
    expect: 'aggregateRating',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(
          '"telephone":',
          '"aggregateRating":{"@type":"AggregateRating","ratingValue":5,"reviewCount":99},"telephone":',
        ),
      );
    },
  },
  {
    name: 'Bild ohne alt-Attribut',
    guard: 'images.mjs',
    expect: 'ohne alt-Attribut',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace('<main', '<main><img src="/og-default.png" width="120" height="63">'),
      );
    },
  },
  {
    name: 'Bild von einer fremden Domain (Hotlink)',
    guard: 'images.mjs',
    expect: 'fremden Domain',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(
          '<main',
          '<main><img src="https://images.example.com/foto.jpg" alt="Ein Beispielbild" width="800" height="600">',
        ),
      );
    },
  },
  {
    name: 'zwei Bilder mit fetchpriority="high"',
    guard: 'images.mjs',
    expect: 'fetchpriority',
    break: (dir) => {
      patch(join(dir, 'kontakt', 'index.html'), (html) =>
        html.replace(
          '<main',
          '<main>' +
            '<img src="/og-default.png" alt="Erstes Bild" width="800" height="420" fetchpriority="high">' +
            '<img src="/og-default.png" alt="Zweites Bild" width="800" height="420" fetchpriority="high">',
        ),
      );
    },
  },
  {
    name: 'zwei Standortseiten mit identischem Inhalt (Ortstausch-Template)',
    guard: 'cannibalization.mjs',
    expect: 'Standortseiten',
    break: (dir) => {
      const source = readFileSync(join(dir, 'berlin', 'pankow', 'index.html'), 'utf8');
      const target = join(dir, 'berlin', 'spandau', 'index.html');
      const original = readFileSync(target, 'utf8');
      // Nur den Hauptteil übernehmen, Kopfdaten der Zielseite behalten –
      // genau das Muster, das ein Ortstausch-Template erzeugen würde.
      const body = source.match(/<main[\s\S]*?<\/main>/)[0].replaceAll('Pankow', 'Spandau');
      writeFileSync(target, original.replace(/<main[\s\S]*?<\/main>/, body));
    },
  },
];

/* ------------------------------------------------------------------ */

function patch(file, fn) {
  writeFileSync(file, fn(readFileSync(file, 'utf8')));
}

function forEachHtml(dir, fn) {
  const { readdirSync, statSync } = require('node:fs');
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.html')) patch(full, fn);
    }
  };
  walk(dir);
}

/* `require` gibt es in ESM nicht – hier über createRequire bereitstellen. */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

let passed = 0;
let failed = 0;

console.log('Selbstprüfung der SEO-Guards');
console.log('='.repeat(66));
console.log('Jeder Fall baut eine echte Verletzung und erwartet, dass die Regel greift.\n');

rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

for (const [index, testCase] of CASES.entries()) {
  const dir = join(work, `fall-${index + 1}`);
  cpSync(dist, dir, { recursive: true });

  try {
    testCase.break(dir);
  } catch (err) {
    console.log(`  FEHLGESCHLAGEN  ${testCase.name}`);
    console.log(`                  Der Fall ließ sich nicht aufbauen: ${err.message}`);
    failed += 1;
    continue;
  }

  const run = spawnSync(process.execPath, [join(here, testCase.guard)], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: { ...process.env, SEO_DIST: dir },
  });
  const output = (run.stdout ?? '') + (run.stderr ?? '');

  const caught = run.status === 1 && output.includes(testCase.expect);
  if (caught) {
    console.log(`  erkannt         ${testCase.name}  (${testCase.guard})`);
    passed += 1;
  } else {
    console.log(`  NICHT ERKANNT   ${testCase.name}  (${testCase.guard})`);
    console.log(`                  erwartet wurde der Text "${testCase.expect}", Exitcode 1`);
    console.log(`                  bekommen: Exitcode ${run.status}`);
    failed += 1;
  }

  rmSync(dir, { recursive: true, force: true });
}

rmSync(work, { recursive: true, force: true });

console.log('');
console.log('='.repeat(66));
console.log(`  ${passed} von ${CASES.length} Verletzungen wurden erkannt.`);
if (failed) {
  console.log(`  ${failed} Regeln haben ihr Gegenbeispiel NICHT gefunden und prüfen damit nichts.`);
}
console.log('');

process.exit(failed ? 1 : 0);
