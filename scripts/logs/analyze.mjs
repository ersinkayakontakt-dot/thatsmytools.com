#!/usr/bin/env node
/**
 * CRAWL-BERICHT AUS ACCESS-LOGS
 * =============================
 *
 * Beantwortet, was Search Console und Bing Webmaster Tools nicht zeigen:
 * Was holen sich die Bots tatsächlich, wie oft, und wofür verschwenden
 * sie Crawl-Budget?
 *
 *   npm run logs:analyze -- --dir data/logs
 *   npm run logs:analyze -- --dir data/logs --from 2026-07-01 --to 2026-07-31
 *   npm run logs:analyze -- --dir data/logs --verify      mit DNS-Prüfung
 *
 * EINGABE
 * Apache- oder Nginx-Access-Logs, einzeln oder als Verzeichnis, roh oder
 * gzip-komprimiert. Bei Hostinger unter „Erweitert → Zugriffsprotokolle".
 *
 * ROHLOGS GEHÖREN NICHT INS REPOSITORY. `data/` ist über .gitignore
 * ausgeschlossen. Access-Logs enthalten vollständige IP-Adressen und sind
 * damit personenbezogene Daten.
 *
 * DATENSCHUTZ
 * IP-Adressen werden bereits beim Einlesen gekürzt (siehe parse.mjs) und
 * erscheinen in keinem Bericht und in keinem Export. Die vollständige
 * Adresse existiert nur im Arbeitsspeicher und nur dann, wenn `--verify`
 * eine DNS-Prüfung durchführt.
 *
 * KEINE SCHLÜSSE AUS ZU WENIG DATEN
 * Aussagen wie „diese Seite wird nicht gecrawlt" setzen voraus, dass der
 * Zeitraum lang genug ist. Bei weniger als sieben Tagen weist der Bericht
 * ausdrücklich darauf hin und unterlässt die entsprechenden Empfehlungen.
 */
import { createReadStream, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';
import { join, resolve, basename } from 'node:path';
import { promises as dns } from 'node:dns';
import { Report } from '../seo/lib/report.mjs';
import { projectRoot } from '../seo/lib/pages.mjs';
import { loadSeoMap } from '../seo/lib/seoMap.mjs';
import { parseLine, classify, BOTS } from './parse.mjs';

/* ------------------------------------------------------------ Optionen */

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};

const dir = opt('dir', join(projectRoot, 'data', 'logs'));
const from = opt('from', '');
const to = opt('to', '');
const verify = args.includes('--verify');
const outDir = join(projectRoot, 'tmp', 'seo-reports');

const report = new Report('Crawl-Bericht aus Access-Logs');
const map = await loadSeoMap();

/* ------------------------------------------------------------ Einlesen */

const target = resolve(dir);

if (!existsSync(target)) {
  console.log(`
${'='.repeat(66)}
Keine Logdateien gefunden
${'='.repeat(66)}

Erwartet wurde: ${target}

Dieses Werkzeug arbeitet ausschließlich mit echten Logs. Es zeigt keine
Beispielauswertung – eine solche sähe aus wie ein Befund und wäre keiner.

SO KOMMEN DIE LOGS INS PROJEKT

  Bei Hostinger
    1. hPanel öffnen, Website auswählen
    2. Erweitert -> Zugriffsprotokolle
    3. Zeitraum wählen und herunterladen
    4. Dateien nach data/logs/ legen (auch .gz möglich)

  Bei anderen Anbietern liegen sie meist unter
    /var/log/apache2/access.log*   oder   /var/log/nginx/access.log*

Danach:
    npm run logs:analyze

data/ ist über .gitignore ausgeschlossen. Access-Logs enthalten
vollständige IP-Adressen und dürfen nicht ins Repository.
`);
  process.exit(0);
}

const files = statSync(target).isDirectory()
  ? readdirSync(target)
      .filter((f) => /\.(log|txt|gz)$/i.test(f) || /access/i.test(f))
      .map((f) => join(target, f))
  : [target];

if (!files.length) {
  report.error(target, 'Verzeichnis enthält keine Logdateien', 'Dateien mit .log, .txt oder .gz erwartet');
  report.print();
  process.exit(1);
}

/** @type {Map<string, {hits: number, statuses: Map<number, number>, last: string, bots: Map<string, number>}>} */
const byPath = new Map();
const byBot = new Map();
const dates = new Set();
let total = 0;
let unparsed = 0;
let humanHits = 0;

/** Volle IPs je Bot – nur im Speicher, nur für --verify. */
const ipsByBot = new Map();

for (const file of files) {
  const stream = /\.gz$/i.test(file) ? createReadStream(file).pipe(createGunzip()) : createReadStream(file);
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    const row = parseLine(line);
    if (!row) {
      unparsed += 1;
      continue;
    }
    if (from && row.date < from) continue;
    if (to && row.date > to) continue;

    total += 1;
    dates.add(row.date);

    const who = classify(row.userAgent);

    if (who.type === 'mensch') {
      humanHits += 1;
      continue; // Menschen interessieren hier nicht – dafür gibt es die Messung.
    }
    if (who.type === 'unbekannt') continue;

    const bot = byBot.get(who.id) ?? {
      hits: 0,
      statuses: new Map(),
      paths: new Map(),
      last: '',
      purpose: who.purpose ?? '',
      def: who.def,
    };
    bot.hits += 1;
    bot.statuses.set(row.status, (bot.statuses.get(row.status) ?? 0) + 1);
    bot.paths.set(row.path, (bot.paths.get(row.path) ?? 0) + 1);
    if (row.date > bot.last) bot.last = row.date;
    byBot.set(who.id, bot);

    if (verify && who.def?.hosts?.length) {
      if (!ipsByBot.has(who.id)) ipsByBot.set(who.id, new Set());
      const set = ipsByBot.get(who.id);
      if (set.size < 5) set.add(row.rawIp); // Stichprobe genügt
    }

    const page = byPath.get(row.path) ?? { hits: 0, statuses: new Map(), last: '', bots: new Map() };
    page.hits += 1;
    page.statuses.set(row.status, (page.statuses.get(row.status) ?? 0) + 1);
    page.bots.set(who.id, (page.bots.get(who.id) ?? 0) + 1);
    if (row.date > page.last) page.last = row.date;
    byPath.set(row.path, page);
  }
}

const dayList = [...dates].sort();
const dayCount = dayList.length;

report.stat(`${files.length} Datei(en), ${total} auswertbare Zeilen`);
if (unparsed) {
  report.stat(`${unparsed} Zeilen nicht erkannt (anderes Logformat?)`);
}
report.stat(`Zeitraum: ${dayList[0] ?? '—'} bis ${dayList[dayList.length - 1] ?? '—'} (${dayCount} Tage)`);
report.stat(`${humanHits} Zugriffe von Browsern (hier nicht weiter ausgewertet)`);
report.stat('IP-Adressen wurden beim Einlesen gekürzt und erscheinen nirgends.');

if (!total) {
  report.error(target, 'Keine auswertbaren Zeilen gefunden', 'Logformat prüfen – erwartet wird Common oder Combined');
  report.print();
  process.exit(1);
}

/* ---------------------------------------------------- Bot-Verifikation */

const verified = new Map();

if (verify) {
  report.stat('');
  report.stat('DNS-Verifikation (Reverse- und anschließendes Forward-Lookup):');
  for (const [id, ips] of ipsByBot) {
    const def = BOTS.find((b) => b.id === id);
    let ok = 0;
    let checked = 0;
    for (const ip of ips) {
      checked += 1;
      try {
        const names = await dns.reverse(ip);
        const matches = names.some((n) => def.hosts.some((h) => h.test(n)));
        if (!matches) continue;
        // Gegenprobe: Löst der Hostname wieder auf dieselbe Adresse auf?
        // Ohne diesen Schritt ließe sich ein Reverse-Eintrag fälschen.
        const back = await dns.resolve(names[0]).catch(() => []);
        if (back.includes(ip)) ok += 1;
      } catch {
        /* Kein Reverse-Eintrag – zählt als nicht verifiziert. */
      }
    }
    verified.set(id, { ok, checked });
    report.stat(`   ${id.padEnd(20)} ${ok} von ${checked} Stichproben bestätigt`);
  }
} else {
  report.stat('');
  report.stat('Ohne --verify sind alle Bots nur „erkannt", nicht technisch bestätigt.');
}

/* ------------------------------------------------------- Bot-Übersicht */

report.stat('');
report.stat('Botzugriffe:');
const botRows = [...byBot.entries()].sort((a, b) => b[1].hits - a[1].hits);
for (const [id, bot] of botRows) {
  const v = verified.get(id);
  const stufe = !v ? 'erkannt' : v.ok > 0 ? 'technisch verifiziert' : 'NICHT verifiziert';
  report.stat(
    `   ${id.padEnd(20)} ${String(bot.hits).padStart(7)} Zugriffe  zuletzt ${bot.last}  [${stufe}]`,
  );
}

/* --------------------------------------------------- Auffälligkeiten */

const indexablePaths = new Set(map.inSitemap.map((p) => p.url));
const allKnownPaths = new Set(map.pages.map((p) => p.url));

/* 1. Fehlerhafte Antworten an Bots */
const errorPaths = [...byPath.entries()]
  .filter(([, p]) => [...p.statuses.keys()].some((s) => s >= 400))
  .sort((a, b) => b[1].hits - a[1].hits);

for (const [path, p] of errorPaths.slice(0, 20)) {
  const codes = [...p.statuses.entries()].map(([s, n]) => `${s}×${n}`).join(', ');
  report.error(
    path,
    `Bots erhalten Fehlerstatus: ${codes}`,
    allKnownPaths.has(path)
      ? 'Die Seite existiert in der Seitenkarte – hier stimmt etwas mit der Auslieferung nicht.'
      : 'Unbekannte URL. Entweder eine alte Adresse (dann in .htaccess weiterleiten) oder ein Fremdaufruf (dann ignorieren).',
  );
}

/* 2. Weiterleitungen, die Bots durchlaufen */
const redirects = [...byPath.entries()].filter(([, p]) =>
  [...p.statuses.keys()].some((s) => s === 301 || s === 302),
);
for (const [path, p] of redirects.slice(0, 15)) {
  const n = (p.statuses.get(301) ?? 0) + (p.statuses.get(302) ?? 0);
  report.warn(
    path,
    `${n} Weiterleitungen an Bots`,
    'Interne Verweise direkt auf das Ziel richten. Jede Weiterleitung kostet einen zusätzlichen Abruf.',
  );
}

/* 3. Wichtige Seiten ohne Crawl-Aktivität */
if (dayCount >= 7) {
  for (const page of map.inSitemap) {
    if (byPath.has(page.url)) continue;
    const level = page.businessPriority >= 4 ? 'error' : 'warn';
    report[level === 'error' ? 'error' : 'warn'](
      page.url,
      `Priorität ${page.businessPriority}, aber in ${dayCount} Tagen kein einziger Botzugriff`,
      'In der Search Console die Indexierung beantragen und prüfen, ob die Seite intern ausreichend verlinkt ist (npm run seo:linkgraph).',
    );
  }
} else {
  report.info(
    'Zeitraum',
    `Nur ${dayCount} Tage Daten – zu wenig, um fehlende Crawls zu beurteilen`,
    'Mindestens 7, besser 28 Tage exportieren. Große Bots besuchen kleine Seiten nicht täglich.',
  );
}

/* 4. Verschwendetes Crawl-Budget */
const wasted = [...byPath.entries()]
  .filter(([path]) => !allKnownPaths.has(path))
  .sort((a, b) => b[1].hits - a[1].hits);

const wastedHits = wasted.reduce((a, [, p]) => a + p.hits, 0);
const botHits = botRows.reduce((a, [, b]) => a + b.hits, 0);

if (wastedHits) {
  report.stat('');
  report.stat(
    `${wastedHits} von ${botHits} Botzugriffen (${Math.round((wastedHits / botHits) * 100)} %) gehen auf URLs, die es nicht gibt:`,
  );
  for (const [path, p] of wasted.slice(0, 15)) {
    report.stat(`   ${String(p.hits).padStart(6)}×  ${path}`);
  }
}

/* 5. noindex-Seiten mit Botzugriff */
for (const [path, p] of byPath) {
  const entry = map.byUrl.get(path);
  if (!entry || entry.indexable) continue;
  report.warn(
    path,
    `${p.hits} Botzugriffe auf eine nicht indexierbare Seite`,
    'Entwürfe sind nirgends verlinkt – wie findet der Bot sie? Meist über einen alten Link oder die Sitemap eines früheren Stands.',
  );
}

/* 6. Bots, die laut robots.txt gesperrt sind, aber zugreifen */
const BLOCKED = ['GPTBot', 'ClaudeBot', 'Meta'];
for (const id of BLOCKED) {
  const bot = byBot.get(id);
  if (!bot) continue;
  report.warn(
    id,
    `${bot.hits} Zugriffe, obwohl in robots.txt gesperrt`,
    'robots.txt ist eine Bitte, keine Sperre. Wenn das stört, auf Serverebene aussperren – aber prüfen, ob der Bot wirklich echt ist (--verify).',
  );
}

/* 7. OAI-SearchBot ausdrücklich prüfen – er entscheidet über die
      Auffindbarkeit in ChatGPT Search. */
const oai = byBot.get('OAI-SearchBot');
if (!oai) {
  report.warn(
    'OAI-SearchBot',
    `In ${dayCount} Tagen kein Zugriff`,
    'robots.txt erlaubt ihn ausdrücklich. Bleibt er aus, ist die Seite in ChatGPT Search nicht auffindbar – zuerst die Bing-Indexierung prüfen, sie ist die Grundlage.',
  );
} else {
  report.info(
    'OAI-SearchBot',
    `${oai.hits} Zugriffe, zuletzt ${oai.last}`,
    'Die Seite ist für ChatGPT Search erreichbar.',
  );
}

/* --------------------------------------------------- Meistgecrawlte Seiten */

report.stat('');
report.stat('Am häufigsten von Bots geholt:');
for (const [path, p] of [...byPath.entries()].sort((a, b) => b[1].hits - a[1].hits).slice(0, 15)) {
  const entry = map.byUrl.get(path);
  const prio = entry ? `P${entry.businessPriority}` : '—';
  report.stat(`   ${String(p.hits).padStart(6)}×  ${prio.padEnd(3)} ${path}  (zuletzt ${p.last})`);
}

/* ------------------------------------------------------------ Ausgabe */

mkdirSync(outDir, { recursive: true });

const md = [
  '# Crawl-Bericht',
  '',
  `Erzeugt am ${new Date().toISOString().slice(0, 10)} aus ${files.length} Logdatei(en), ` +
    `${total} Zeilen, Zeitraum ${dayList[0]} bis ${dayList[dayList.length - 1]} (${dayCount} Tage).`,
  '',
  '> IP-Adressen wurden beim Einlesen gekürzt. Weder dieser Bericht noch',
  '> die JSON-Ausgabe enthalten personenbeziehbare Daten.',
  '',
  '## Bots',
  '',
  '| Bot | Zugriffe | Zuletzt | Nachweisstufe | Zweck |',
  '|---|---:|---|---|---|',
  ...botRows.map(([id, bot]) => {
    const v = verified.get(id);
    const stufe = !v ? 'erkannt' : v.ok > 0 ? 'technisch verifiziert' : 'nicht verifiziert';
    return `| ${id} | ${bot.hits} | ${bot.last} | ${stufe} | ${bot.purpose || '—'} |`;
  }),
  '',
  '## Am häufigsten geholt',
  '',
  '| Zugriffe | Priorität | Pfad | Zuletzt |',
  '|---:|---|---|---|',
  ...[...byPath.entries()]
    .sort((a, b) => b[1].hits - a[1].hits)
    .slice(0, 40)
    .map(([path, p]) => {
      const entry = map.byUrl.get(path);
      return `| ${p.hits} | ${entry ? `P${entry.businessPriority}` : '—'} | ${path} | ${p.last} |`;
    }),
  '',
  '## Verschwendetes Crawl-Budget',
  '',
  wastedHits
    ? `${wastedHits} von ${botHits} Botzugriffen (${Math.round((wastedHits / botHits) * 100)} %) gehen auf URLs, die es nicht gibt.`
    : 'Keine Zugriffe auf unbekannte URLs.',
  '',
  ...(wasted.length
    ? ['| Zugriffe | Pfad |', '|---:|---|', ...wasted.slice(0, 30).map(([p, v]) => `| ${v.hits} | ${p} |`)]
    : []),
  '',
  '## Abgleich mit der Sitemap',
  '',
  `Sitemap: ${indexablePaths.size} URLs. Davon in diesem Zeitraum von Bots geholt: ` +
    `${[...indexablePaths].filter((u) => byPath.has(u)).length}.`,
  '',
].join('\n');

writeFileSync(join(outDir, 'crawl-bericht.md'), md + '\n');
writeFileSync(
  join(outDir, 'crawl-bericht.json'),
  JSON.stringify(
    {
      erzeugt: new Date().toISOString().slice(0, 10),
      dateien: files.map((f) => basename(f)),
      zeilen: total,
      zeitraum: { von: dayList[0], bis: dayList[dayList.length - 1], tage: dayCount },
      hinweis: 'IP-Adressen wurden beim Einlesen gekürzt und sind hier nicht enthalten.',
      bots: botRows.map(([id, b]) => ({
        id,
        zugriffe: b.hits,
        zuletzt: b.last,
        zweck: b.purpose,
        nachweis: verified.has(id)
          ? verified.get(id).ok > 0
            ? 'technisch verifiziert'
            : 'nicht verifiziert'
          : 'erkannt',
      })),
      seiten: [...byPath.entries()].map(([path, p]) => ({
        pfad: path,
        zugriffe: p.hits,
        zuletzt: p.last,
        status: Object.fromEntries(p.statuses),
        inSeitenkarte: allKnownPaths.has(path),
      })),
    },
    null,
    2,
  ) + '\n',
);

report.stat('');
report.stat(`Berichte: ${outDir}`);
report.print();
process.exit(report.ok ? 0 : 1);
