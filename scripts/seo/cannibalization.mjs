#!/usr/bin/env node
/**
 * KANNIBALISIERUNGS-WÄCHTER
 * =========================
 *
 * Verhindert, dass zwei eigene Seiten um dieselbe Suchanfrage konkurrieren.
 * Zwei Seiten, die dasselbe versprechen, teilen sich die Signale und
 * ranken beide schlechter, als eine starke Seite ranken würde.
 *
 * Aufruf:
 *   npm run seo:cannibalization
 *   npm run seo:cannibalization -- --json
 *
 * WIE ÄHNLICHKEIT GEMESSEN WIRD
 * -----------------------------
 * Zwei unabhängige Verfahren, beide werden im Bericht ausgewiesen. Ein
 * einzelner Wert lädt zu Fehlschlüssen ein:
 *
 *   Jaccard über 5-Wort-Shingles  erkennt wörtlich übernommene Passagen
 *                                 und Ortstausch-Templates
 *   Cosinus über TF-IDF           erkennt thematische Deckung auch bei
 *                                 anderer Formulierung
 *
 * Beide sind reproduzierbar und brauchen keinen externen Dienst. Ein
 * kostenpflichtiger KI-Aufruf als Build-Abhängigkeit wäre hier falsch:
 * Eine Prüfung, die den Produktions-Build blockiert, muss offline,
 * kostenlos und deterministisch laufen.
 *
 * SCHWELLEN
 * ---------
 *   Standortseiten   Jaccard ≥ 0,45 oder Cosinus ≥ 0,90  -> FEHLER
 *       Zwei Bezirksseiten, die sich nur im Ortsnamen unterscheiden, sind
 *       Doorway Pages. Sie dürfen nicht veröffentlicht werden.
 *   Sonstige Seiten  Jaccard ≥ 0,30 oder Cosinus ≥ 0,80  -> WARNUNG
 *       Hier entscheidet die Redaktion. Automatisch zusammenführen wäre
 *       falsch: Zwei ähnliche Seiten können unterschiedliche Absichten
 *       bedienen (Ratgeber gegen Leistung).
 *
 * KEINE AUTOMATISCHE ZUSAMMENFÜHRUNG. Der Bericht schlägt vor, entschieden
 * wird von Menschen.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { loadPages, projectRoot } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';
import { tokenize, shingles, jaccard, tfidfVectors, cosine, headingSimilarity } from './lib/similarity.mjs';

const LOCATION_JACCARD = 0.45;
const LOCATION_COSINE = 0.9;
const GENERAL_JACCARD = 0.3;
const GENERAL_COSINE = 0.8;
const HEADING_SIMILARITY = 0.75;

/**
 * Normalform einer Suchanfrage für den Identitätsvergleich.
 *
 * Hier werden BEWUSST KEINE Stoppwörter entfernt – anders als beim
 * Inhaltsvergleich. "schnellhelfer24" und "schnellhelfer24 über uns" sind
 * zwei verschiedene Suchanfragen; würde man "über" und "uns" streichen,
 * wären sie identisch und der Wächter meldete einen Konflikt, den es nicht
 * gibt. Sortiert wird trotzdem, damit "entrümpelung berlin" und
 * "berlin entrümpelung" als dieselbe Anfrage erkannt werden.
 */
function queryKey(query) {
  return (query.toLocaleLowerCase('de-DE').match(/[a-zäöüß0-9]+/g) ?? []).sort().join(' ');
}

const report = new Report('Keyword-Kannibalisierung');
const map = await loadSeoMap();
const pages = loadPages();
const asJson = process.argv.includes('--json');

const entryFor = (url) => map.byUrl.get(url === '/404' ? '/404/' : url);

/* Nur veröffentlichte, indexierbare Seiten konkurrieren miteinander. */
const candidates = pages
  .filter((p) => p.indexable)
  .map((p) => ({ page: p, entry: entryFor(p.url) }))
  .filter((c) => c.entry);

report.stat(`${candidates.length} indexierbare Seiten im Vergleich`);

/* ------------------------------------------------------------------ */
/* 1. Doppelte primäre Suchanfrage – harte Regel                       */
/* ------------------------------------------------------------------ */

const byQuery = new Map();
for (const { entry } of candidates) {
  if (!entry.primaryQuery) continue;
  const key = queryKey(entry.primaryQuery);
  byQuery.set(key, [...(byQuery.get(key) ?? []), entry]);
}

for (const [, group] of byQuery) {
  if (group.length < 2) continue;
  const best = group.slice().sort((a, b) => b.businessPriority - a.businessPriority)[0];
  report.error(
    group.map((g) => g.url).join(' / '),
    `${group.length} indexierbare Seiten verfolgen dieselbe primäre Suchanfrage: "${group[0].primaryQuery}"`,
    `Empfohlene Hauptseite: ${best.url} (Priorität ${best.businessPriority}). Für die übrigen eine eigene Suchanfrage vergeben, sie auf die Hauptseite kanonisieren oder zusammenführen.`,
  );
}

/* Auch sekundäre Begriffe dürfen nicht die primäre einer anderen Seite sein */
const primaryIndex = new Map();
for (const { entry } of candidates) {
  if (entry.primaryQuery) primaryIndex.set(queryKey(entry.primaryQuery), entry);
}
for (const { entry } of candidates) {
  for (const sec of entry.secondaryQueries) {
    const key = queryKey(sec);
    const owner = primaryIndex.get(key);
    if (owner && owner.id !== entry.id) {
      report.warn(
        `${entry.url} ↔ ${owner.url}`,
        `"${sec}" steht bei ${entry.id} als Nebenbegriff, ist aber die Hauptsuchanfrage von ${owner.id}`,
        `Nebenbegriff bei ${entry.id} streichen. Sonst zielen beide Seiten auf dieselbe Ergebnisliste.`,
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* 2. Inhaltliche Ähnlichkeit                                          */
/* ------------------------------------------------------------------ */

const docs = candidates.map((c) => ({ id: c.entry.id, tokens: tokenize(c.page.text) }));
const vectors = new Map(tfidfVectors(docs).map((v) => [v.id, v.vec]));
const shingleSets = new Map(docs.map((d) => [d.id, shingles(d.tokens, 5)]));

/** @type {{a: object, b: object, jaccard: number, cosine: number, heading: number, level: string}[]} */
const conflicts = [];

/**
 * Alle gemessenen Paare, auch die unauffälligen.
 *
 * Grund: Ein Prüfbericht, der "keine Auffälligkeiten" meldet, ohne zu
 * zeigen, dass überhaupt etwas gemessen wurde, ist nicht überprüfbar. Die
 * fünf ähnlichsten Paare stehen deshalb immer im Bericht – auch wenn sie
 * weit unter jeder Schwelle liegen. So ist auf einen Blick erkennbar, ob
 * die Messung funktioniert und wie viel Luft bis zur Grenze bleibt.
 */
const measured = [];

for (let i = 0; i < candidates.length; i += 1) {
  for (let j = i + 1; j < candidates.length; j += 1) {
    const a = candidates[i];
    const b = candidates[j];

    const jac = jaccard(shingleSets.get(a.entry.id), shingleSets.get(b.entry.id));
    const cos = cosine(vectors.get(a.entry.id), vectors.get(b.entry.id));
    const headJac = Math.max(
      headingSimilarity(a.entry.title, b.entry.title),
      headingSimilarity(a.entry.h1, b.entry.h1),
    );

    measured.push({ a: a.entry.url, b: b.entry.url, jac, cos, headJac });

    const bothLocations = a.entry.pageType === 'location' && b.entry.pageType === 'location';
    const declared =
      a.entry.mustNotCompeteWith.includes(b.entry.id) || b.entry.mustNotCompeteWith.includes(a.entry.id);

    let level = null;
    let why = [];

    if (bothLocations && (jac >= LOCATION_JACCARD || cos >= LOCATION_COSINE)) {
      level = 'error';
      why.push('zwei Standortseiten mit nahezu gleichem Inhalt');
    } else if (jac >= GENERAL_JACCARD || cos >= GENERAL_COSINE) {
      // Bei ausdrücklich gegeneinander abgegrenzten Seiten wird schärfer
      // hingesehen: Dort ist die Verwechslungsgefahr bekannt.
      level = declared ? 'error' : 'warn';
      why.push(declared ? 'in mustNotCompeteWith ausdrücklich abgegrenzt' : 'inhaltlich stark überlappend');
    } else if (headJac >= HEADING_SIMILARITY) {
      level = 'warn';
      why.push('Titel und Überschriften sehr ähnlich');
    }

    /* Ein transaktionaler Ratgeber, der einer Leistungsseite die Absicht
       wegnimmt, ist der klassische Fall. */
    if (
      a.entry.pageType === 'guide' &&
      b.entry.pageType === 'service' &&
      a.entry.searchIntent === 'transactional'
    ) {
      level = level ?? 'warn';
      why.push('Ratgeber ist transaktional ausgerichtet und konkurriert mit einer Leistungsseite');
    }

    if (!level) continue;

    const primary =
      a.entry.businessPriority === b.entry.businessPriority
        ? a.entry.pageType === 'service'
          ? a.entry
          : b.entry
        : a.entry.businessPriority > b.entry.businessPriority
          ? a.entry
          : b.entry;
    const other = primary === a.entry ? b.entry : a.entry;

    conflicts.push({
      a: a.entry,
      b: b.entry,
      jaccard: Math.round(jac * 1000) / 1000,
      cosine: Math.round(cos * 1000) / 1000,
      heading: Math.round(headJac * 1000) / 1000,
      level,
      why,
      recommendedPrimary: primary.url,
      recommendedAction:
        bothLocations && level === 'error'
          ? 'Inhalt differenzieren oder die schwächere Seite auf draft setzen. Der Publish Guard hält sie dann aus dem Index.'
          : primary.pageType === 'service' && other.pageType === 'guide'
            ? `Ratgeber ${other.url} eindeutig informational positionieren und den Handlungsaufruf auf ${primary.url} verlagern`
            : `Inhalte abgrenzen oder ${other.url} auf ${primary.url} kanonisieren`,
    });

    const fn = level === 'error' ? report.error.bind(report) : report.warn.bind(report);
    fn(
      `${a.entry.url} ↔ ${b.entry.url}`,
      `Jaccard ${Math.round(jac * 100)} %, Cosinus ${Math.round(cos * 100)} %, Überschriften ${Math.round(headJac * 100)} % – ${why.join('; ')}`,
      `Empfohlene Hauptseite: ${primary.url}. ${conflicts[conflicts.length - 1].recommendedAction}`,
    );
  }
}

/* Beleg, dass gemessen wurde: die ähnlichsten Paare, auch unauffällige. */
report.stat(
  `${measured.length} Seitenpaare verglichen. Ähnlichste Paare (Grenze: Standort ${LOCATION_JACCARD}/${LOCATION_COSINE}, sonst ${GENERAL_JACCARD}/${GENERAL_COSINE}):`,
);
for (const m of measured.sort((x, y) => y.cos - x.cos).slice(0, 5)) {
  report.stat(
    `   Jaccard ${m.jac.toFixed(3)}  Cosinus ${m.cos.toFixed(3)}  Überschr. ${m.headJac.toFixed(2)}  ${m.a} ↔ ${m.b}`,
  );
}

/* ------------------------------------------------------------------ */
/* 3. Wechselnde interne Linkziele für denselben Begriff               */
/* ------------------------------------------------------------------ */
/**
 * Wenn derselbe Ankertext mal auf die Leistungsseite und mal auf den
 * Ratgeber zeigt, sagt die eigene Website nicht eindeutig, welche Seite
 * für den Begriff zuständig ist. Das ist Kannibalisierung, die man selbst
 * verursacht – und die man selbst abstellen kann.
 */
const anchorMap = new Map();
for (const page of pages) {
  if (!page.indexable) continue;
  for (const link of page.links) {
    if (link.external || !link.target) continue;
    if (link.zone === 'nav' || link.zone === 'footer' || link.zone === 'breadcrumb' || link.zone === 'sticky')
      continue;
    const text = link.text.toLocaleLowerCase('de-DE').trim();
    if (text.length < 10) continue;
    if (!anchorMap.has(text)) anchorMap.set(text, new Map());
    const targets = anchorMap.get(text);
    targets.set(link.target, (targets.get(link.target) ?? 0) + 1);
  }
}

for (const [text, targets] of anchorMap) {
  if (targets.size < 2) continue;
  const list = [...targets.entries()].sort((a, b) => b[1] - a[1]);
  report.warn(
    `Linktext „${text}"`,
    `zeigt auf ${targets.size} verschiedene Seiten: ${list.map(([t, n]) => `${t} (${n}×)`).join(', ')}`,
    `Dauerhaft auf ${list[0][0]} festlegen. Ein Begriff, eine Zielseite.`,
  );
}

/* ------------------------------------------------------------------ */
/* Konfliktbericht                                                     */
/* ------------------------------------------------------------------ */

if (asJson || conflicts.length) {
  const out = join(projectRoot, 'tmp', 'seo-cannibalization.json');
  writeFileSync(
    out,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        method: {
          jaccard: '5-Wort-Shingles über den sichtbaren Hauptinhalt, deutsche Stoppwörter entfernt',
          cosine: 'TF-IDF über dieselbe Wortbasis, Vektoren normiert',
          thresholds: {
            location: { jaccard: LOCATION_JACCARD, cosine: LOCATION_COSINE, level: 'error' },
            general: { jaccard: GENERAL_JACCARD, cosine: GENERAL_COSINE, level: 'warn' },
            heading: HEADING_SIMILARITY,
          },
        },
        conflicts: conflicts.map((c) => ({
          urlA: c.a.url,
          urlB: c.b.url,
          primaryQueryA: c.a.primaryQuery,
          primaryQueryB: c.b.primaryQuery,
          intentA: c.a.searchIntent,
          intentB: c.b.searchIntent,
          jaccard: c.jaccard,
          cosine: c.cosine,
          headingSimilarity: c.heading,
          level: c.level,
          reasons: c.why,
          recommendedPrimary: c.recommendedPrimary,
          recommendedAction: c.recommendedAction,
        })),
      },
      null,
      2,
    ) + '\n',
  );
  report.stat(`Konfliktbericht: ${out}`);
}

finish(report);
