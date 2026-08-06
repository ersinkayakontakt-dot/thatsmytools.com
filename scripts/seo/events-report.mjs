#!/usr/bin/env node
/**
 * AUSWERTUNG DER MESSDATEN
 * ========================
 *
 * Beantwortet die sechs Fragen, für die das Messsystem gebaut wurde:
 *
 *   1. Welche Landingpage erzeugt Anfragen?
 *   2. Welche Seite erzeugt Telefonklicks?
 *   3. Welche Quelle erzeugt qualifizierte Komplettaufträge?
 *   4. Wo brechen Menschen im Formular ab?
 *   5. Welche Seiten bekommen Besuch, aber lösen nichts aus?
 *   6. Welche Geräte haben technische oder Conversion-Probleme?
 *
 * Aufruf:
 *   npm run seo:events:report
 *   npm run seo:events:report -- --days 30
 *
 * WOHER DIE DATEN KOMMEN
 * Aus den JSONL-Tagesdateien, die public/api/events.php auf dem Server
 * schreibt. Sie müssen vorher heruntergeladen werden – der Endpunkt liegt
 * in einem gesperrten Verzeichnis und hat bewusst keine Leseroute.
 *
 *     data/events/JJJJ-MM-TT.jsonl
 *
 * `data/` ist über .gitignore ausgeschlossen.
 *
 * KEINE EINZELPROFILE
 * Ausgegeben werden ausschließlich Summen. Das Besucher-Pseudonym dient
 * nur dazu, Sitzungen zu zählen; es wird nie ausgegeben und ist nach
 * Tagesende ohnehin nicht mehr zuzuordnen, weil das Tagesgeheimnis
 * verworfen wird.
 *
 * OHNE DATEN PASSIERT NICHTS. Es gibt keine Beispielauswertung.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Report } from './lib/report.mjs';
import { projectRoot } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';

const args = process.argv.slice(2);
const days = Number(args[args.indexOf('--days') + 1]) || 30;

const dataDir = process.env.SEO_DATA_DIR
  ? resolve(process.env.SEO_DATA_DIR)
  : join(projectRoot, 'data');
const eventsDir = join(dataDir, 'events');
const outDir = join(projectRoot, 'tmp', 'seo-reports');

const report = new Report('Messdaten');
const map = await loadSeoMap();

/* ------------------------------------------------------------- Einlesen */

if (!existsSync(eventsDir)) {
  console.log(`
${'='.repeat(66)}
Keine Messdaten vorhanden
${'='.repeat(66)}

Erwartet werden JSONL-Tagesdateien unter data/events/.

SO KOMMEN SIE DORTHIN

  1. In public/api/config.local.php auf dem Server setzen:
         'eventsEnabled' => true
     (vorher Datenschutzerklärung ergänzen und rechtlich prüfen lassen –
      siehe CONTENT-TODO.md)

  2. Die Dateien vom Server holen, zum Beispiel per SFTP aus
         .../api/_storage/events/

  3. Nach data/events/ legen und erneut ausführen.

Solange der Endpunkt abgeschaltet ist, entstehen keine Dateien. Das ist
der beabsichtigte Auslieferungszustand.
`);
  process.exit(0);
}

const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
const events = [];

for (const file of readdirSync(eventsDir).filter((f) => f.endsWith('.jsonl')).sort()) {
  const day = file.replace('.jsonl', '');
  if (day < cutoff) continue;
  for (const line of readFileSync(join(eventsDir, file), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      /* Eine abgeschnittene Zeile am Dateiende ist bei laufendem Betrieb
         normal. Sie wird übersprungen, nicht als Fehler gemeldet. */
    }
  }
}

if (!events.length) {
  report.stat(`Keine Ereignisse in den letzten ${days} Tagen.`);
  report.print();
  process.exit(0);
}

report.stat(`${events.length} Ereignisse aus den letzten ${days} Tagen`);

/* ------------------------------------------------------------ Hilfen */

const count = (rows, keyFn) => {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (k === undefined || k === null || k === '') continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const of = (name) => events.filter((e) => e.event === name);
const sessions = new Set(events.map((e) => e.visitor).filter(Boolean)).size;

report.stat(`${sessions} unterscheidbare Sitzungen (Tagespseudonym, nicht personenbezogen)`);

const sections = [];
const add = (title, question, rows, columns) => sections.push({ title, question, rows, columns });

/* --------------------------------- 1. Welche Seite erzeugt Anfragen? */

const submissions = of('lead_form_submitted');
add(
  'Anfragen je Einstiegsseite',
  'Welche Landingpage erzeugt Anfragen?',
  count(submissions, (e) => e.landing || e.page).map(([landing, n]) => ({
    Einstiegsseite: landing,
    Anfragen: n,
    Priorität: map.byUrl.get(landing)?.businessPriority ?? '—',
  })),
  ['Einstiegsseite', 'Anfragen', 'Priorität'],
);

/* ------------------------------- 2. Welche Seite erzeugt Telefonklicks? */

add(
  'Telefonklicks je Seite',
  'Welche Seite erzeugt Telefonklicks?',
  count(of('phone_click'), (e) => e.page).map(([page, n]) => ({
    Seite: page,
    Telefonklicks: n,
    Position: count(
      of('phone_click').filter((e) => e.page === page),
      (e) => e.location,
    )
      .map(([l, c]) => `${l}: ${c}`)
      .join(', '),
  })),
  ['Seite', 'Telefonklicks', 'Position'],
);

/* --------------------- 3. Welche Quelle erzeugt Komplettaufträge? */

const confirmed = of('lead_confirmed');
add(
  'Bestätigte Anfragen je Kanal',
  'Welche Such- oder Verweisquelle erzeugt qualifizierte Aufträge?',
  count(confirmed, (e) => `${e.channel}${e.referrerHost ? ` (${e.referrerHost})` : ''}`).map(
    ([channel, n]) => ({ Kanal: channel, Anfragen: n }),
  ),
  ['Kanal', 'Anfragen'],
);

add(
  'Bestätigte Anfragen je Leistung',
  'Welche Leistung wird tatsächlich beauftragt?',
  count(confirmed, (e) => e.leistung).map(([leistung, n]) => ({ Leistung: leistung, Anfragen: n })),
  ['Leistung', 'Anfragen'],
);

/* ------------------------------ 4. Wo brechen Menschen im Formular ab? */

const started = of('estimate_started').length;
const stepDone = count(of('estimate_step_completed'), (e) => e.step);
const abandoned = count(of('estimate_abandoned'), (e) => e.step);

const funnel = [{ Schritt: 'Formular geöffnet', Anzahl: started, Abbrüche: '—' }];
for (const [step, n] of stepDone.sort((a, b) => Number(a[0]) - Number(b[0]))) {
  funnel.push({
    Schritt: `Schritt ${step} abgeschlossen`,
    Anzahl: n,
    Abbrüche: abandoned.find(([s]) => s === step)?.[1] ?? 0,
  });
}
funnel.push({ Schritt: 'Anfrage abgeschickt', Anzahl: submissions.length, Abbrüche: '—' });

add('Formularverlauf', 'Wo brechen Nutzer im Formular ab?', funnel, [
  'Schritt',
  'Anzahl',
  'Abbrüche',
]);

/* ---------------- 5. Welche Seiten bekommen Besuch, aber keine Aktion? */

const CONVERSION_EVENTS = new Set([
  'phone_click',
  'whatsapp_click',
  'estimate_cta_click',
  'callback_request',
  'partner_request',
  'estimate_started',
  'lead_form_submitted',
]);

/**
 * Die Quote zählt SITZUNGEN, nicht Ereignisse.
 *
 * Aktionen durch Aufrufe zu teilen ergibt Werte über 100 %, sobald jemand
 * mehr als eine Aktion auslöst – im Test stand dort „133,3 %". Eine Quote,
 * die über hundert Prozent gehen kann, ist als Kennzahl unbrauchbar.
 *
 * Gezählt wird deshalb: Wie viele der Sitzungen, die diese Seite gesehen
 * haben, haben dort auch etwas ausgelöst? Dieser Wert liegt zwangsläufig
 * zwischen 0 und 100 % und beantwortet die eigentliche Frage.
 */
function sessionRate(rows, keyFn) {
  const viewers = new Map();
  const actors = new Map();

  for (const e of rows) {
    const key = keyFn(e);
    if (!key || !e.visitor) continue;
    if (e.event === 'page_view') {
      if (!viewers.has(key)) viewers.set(key, new Set());
      viewers.get(key).add(e.visitor);
    }
    if (CONVERSION_EVENTS.has(e.event)) {
      if (!actors.has(key)) actors.set(key, new Set());
      actors.get(key).add(e.visitor);
    }
  }

  return { viewers, actors };
}

const viewsByPage = new Map(count(of('page_view'), (e) => e.page));
const actionsByPage = new Map(
  count(
    events.filter((e) => CONVERSION_EVENTS.has(e.event)),
    (e) => e.page,
  ),
);
const pageSessions = sessionRate(events, (e) => e.page);

const silent = [...viewsByPage.entries()]
  .map(([page, views]) => {
    const seen = pageSessions.viewers.get(page)?.size ?? 0;
    const acted = pageSessions.actors.get(page)?.size ?? 0;
    return {
      Seite: page,
      Aufrufe: views,
      Aktionen: actionsByPage.get(page) ?? 0,
      Quote: seen ? `${Math.round((acted / seen) * 1000) / 10} %` : '—',
      Priorität: map.byUrl.get(page)?.businessPriority ?? '—',
    };
  })
  // Erst ab einer gewissen Zahl an Aufrufen ist eine Quote aussagekräftig.
  .filter((r) => r.Aufrufe >= 20)
  .sort((a, b) => parseFloat(a.Quote) - parseFloat(b.Quote));

add(
  'Seiten mit Besuch, aber ohne Aktion',
  'Welche Seiten erhalten Traffic, aber keine Aktion?',
  silent,
  ['Seite', 'Aufrufe', 'Aktionen', 'Quote', 'Priorität'],
);

/* ------------------------------------ 6. Geräte und Web Vitals */

const deviceSessions = sessionRate(events, (e) => e.device);
const deviceRows = [];

for (const [device] of count(of('page_view'), (e) => e.device)) {
  const views = of('page_view').filter((e) => e.device === device).length;
  const actions = events.filter((e) => CONVERSION_EVENTS.has(e.event) && e.device === device).length;
  const seen = deviceSessions.viewers.get(device)?.size ?? 0;
  const acted = deviceSessions.actors.get(device)?.size ?? 0;
  const row = {
    Gerät: device,
    Aufrufe: views,
    Aktionen: actions,
    // Sitzungen mit Aktion je Sitzungen mit Aufruf – siehe sessionRate().
    Quote: seen ? `${Math.round((acted / seen) * 1000) / 10} %` : '—',
  };
  for (const metric of ['LCP', 'INP', 'CLS']) {
    const values = of('web_vital')
      .filter((e) => e.device === device && e.metric === metric)
      .map((e) => e.value)
      .sort((a, b) => a - b);
    if (!values.length) {
      row[metric] = '—';
      continue;
    }
    // 75. Perzentil – dasselbe Maß, das Google für Core Web Vitals nutzt.
    // Der Durchschnitt würde einzelne Ausreißer verstecken.
    const p75 = values[Math.floor(values.length * 0.75)];
    row[metric] = metric === 'CLS' ? p75.toFixed(3) : `${p75} ms`;
  }
  deviceRows.push(row);
}

add(
  'Geräte, Conversion und Ladeverhalten',
  'Welche Geräte haben technische oder Conversion-Probleme?',
  deviceRows,
  ['Gerät', 'Aufrufe', 'Aktionen', 'Quote', 'LCP', 'INP', 'CLS'],
);

/* ------------------------------------------------------------ Ausgabe */

for (const section of sections) {
  report.stat('');
  report.stat(`${section.title} – ${section.question}`);
  if (!section.rows.length) {
    report.stat('   (keine Daten)');
    continue;
  }
  for (const row of section.rows.slice(0, 12)) {
    report.stat('   ' + section.columns.map((c) => `${c}: ${row[c]}`).join('  |  '));
  }
}

mkdirSync(outDir, { recursive: true });

const md = [
  '# Messdaten',
  '',
  `Erzeugt am ${new Date().toISOString().slice(0, 10)} aus ${events.length} Ereignissen ` +
    `der letzten ${days} Tage (${sessions} unterscheidbare Sitzungen).`,
  '',
  '> Alle Angaben sind Summen. Es gibt keine Einzelprofile. Das',
  '> Sitzungspseudonym wechselt täglich und ist nach Tagesende auch mit',
  '> Serverzugang keiner Person mehr zuzuordnen.',
  '',
  ...sections.flatMap((s) => [
    `## ${s.title}`,
    '',
    `*${s.question}*`,
    '',
    ...(s.rows.length
      ? [
          `| ${s.columns.join(' | ')} |`,
          `|${s.columns.map(() => '---').join('|')}|`,
          ...s.rows.slice(0, 40).map((r) => `| ${s.columns.map((c) => r[c]).join(' | ')} |`),
        ]
      : ['(keine Daten)']),
    '',
  ]),
].join('\n');

writeFileSync(join(outDir, 'messdaten.md'), md + '\n');
writeFileSync(
  join(outDir, 'messdaten.json'),
  JSON.stringify({ erzeugt: new Date().toISOString().slice(0, 10), tage: days, ereignisse: events.length, sitzungen: sessions, abschnitte: sections }, null, 2) + '\n',
);

report.stat('');
report.stat(`Berichte: ${outDir}`);
report.print();
