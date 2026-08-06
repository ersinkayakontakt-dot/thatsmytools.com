#!/usr/bin/env node
/**
 * LINKGRAPH UND INTERNER AUTHORITY-SCORE
 * ======================================
 *
 * Beantwortet die Frage, die über die interne Autorität entscheidet:
 * Welche Seiten bekommen tatsächlich Gewicht – und sind das die Seiten,
 * die wirtschaftlich zählen?
 *
 * Aufruf:
 *   npm run seo:linkgraph
 *   npm run seo:linkgraph -- --json     maschinenlesbar
 *
 * WARUM DIE ZONE EINES LINKS ZÄHLT
 * --------------------------------
 * Ein Link, der auf jeder der 50 Seiten steht (Navigation, Fußbereich),
 * sagt über die Bedeutung einer Zielseite fast nichts – er ist ein
 * Strukturmerkmal. Ein Link mitten im Fließtext einer thematisch nahen
 * Seite ist dagegen eine redaktionelle Aussage: "Hier geht es weiter."
 * Deshalb werden Zonen unterschiedlich gewichtet:
 *
 *   context     1,00   redaktioneller Link im Hauptinhalt
 *   module      0,60   kuratiertes Empfehlungsmodul
 *   breadcrumb  0,25   Strukturpfad
 *   nav         0,08   auf jeder Seite identisch
 *   footer      0,05   auf jeder Seite identisch
 *   sticky      0,00   mobile Aktionsleiste, rein funktional
 *
 * DIE FORMEL
 * ----------
 * Für jeden internen Link von Seite Q auf Seite Z:
 *
 *   Beitrag = Zonengewicht
 *           × Prioritätsfaktor(Q)
 *           × Positionsfaktor
 *           × Linktextfaktor
 *           ÷ Wurzel(ausgehende Links von Q in derselben Zone)
 *
 *   Prioritätsfaktor(Q) = 0,6 + 0,1 × businessPriority(Q)
 *       Eine starke Seite vererbt mehr. Spanne 0,7 (Priorität 1) bis
 *       1,1 (Priorität 5) – bewusst flach, damit der Score nicht allein
 *       von der eigenen Prioritätsvergabe abhängt.
 *
 *   Positionsfaktor = 1,0 in der oberen Hälfte des Hauptinhalts,
 *                     0,8 darunter. Weiter oben heißt eher gesehen.
 *
 *   Linktextfaktor  = 1,0 bei beschreibendem Text,
 *                     0,5 bei "hier", "mehr", "weiterlesen" ohne Kontext.
 *                     Ein nichtssagender Ankertext überträgt kein Thema.
 *
 *   Wurzel statt geteilt durch die volle Anzahl: Eine Seite mit zwölf
 *   Empfehlungen soll nicht ein Zwölftel weitergeben, sondern spürbar
 *   weniger je Link – aber nicht so wenig, dass gute Übersichtsseiten
 *   bestraft werden.
 *
 * Der Score ist eine RELATIVE Größe zum Vergleich der eigenen Seiten
 * untereinander. Er ist kein PageRank und sagt nichts über Google.
 *
 * BLOCKIEREND
 *   - indexierbare Seite ohne einen einzigen internen Link (verwaist)
 *   - interner Link ins Leere
 *   - Link von einer indexierbaren Seite auf einen Entwurf
 *   - in der Karte geforderter ausgehender Link fehlt im Hauptinhalt
 *   - eine der vier Geldseiten steht nicht unter den stärksten Seiten
 *
 * WARNUNG
 *   - Seite nur über Navigation oder Fußbereich erreichbar
 *   - Prioritätsseite mit sehr wenigen kontextuellen Eingängen
 *   - nichtssagender Linktext
 *   - derselbe Linktext zeigt auf verschiedene Ziele
 *   - geforderter kontextueller Eingang fehlt
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { loadPages, distFiles, projectRoot } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';

const ZONE_WEIGHT = {
  context: 1.0,
  module: 0.6,
  breadcrumb: 0.25,
  nav: 0.08,
  footer: 0.05,
  sticky: 0.0,
};

/** Ankertexte, die für sich genommen nichts über das Ziel aussagen. */
const WEAK_ANCHORS = [
  'hier',
  'mehr',
  'mehr erfahren',
  'weiterlesen',
  'weiter',
  'klicken',
  'klick',
  'erfahren sie mehr',
  'zum artikel',
  'link',
  'mehr dazu',
  'ansehen',
  'jetzt',
  'los',
  '→',
  '>',
];

const report = new Report('Linkgraph und interne Autorität');
const map = await loadSeoMap();
const pages = loadPages();
const files = distFiles();

const asJson = process.argv.includes('--json');

/* Nur echte Seiten betrachten. */
const byUrl = new Map(pages.map((p) => [p.url, p]));
const entryFor = (url) => map.byUrl.get(url === '/404' ? '/404/' : url);

const known = new Set(pages.map((p) => p.url));
for (const f of files) known.add(f);

/* ------------------------------------------------------------------ */
/* Kanten sammeln                                                      */
/* ------------------------------------------------------------------ */

/** @type {{from: string, to: string, zone: string, module?: string, text: string, weight: number}[]} */
const edges = [];
const broken = new Map();
const anchorTargets = new Map(); // Linktext -> Set der Ziele

for (const page of pages) {
  const entry = entryFor(page.url);
  const priority = entry?.businessPriority ?? 3;
  const priorityFactor = 0.6 + 0.1 * priority;

  const mainLength = page.main.length || 1;
  const mainStart = page.html.indexOf('<main');

  /* Ausgehende Links je Zone zählen – Grundlage für die Verdünnung. */
  const perZone = new Map();
  for (const link of page.links) {
    if (!link.target || link.external) continue;
    perZone.set(link.zone, (perZone.get(link.zone) ?? 0) + 1);
  }

  for (const link of page.links) {
    if (link.external) continue;
    if (!link.target) continue;
    if (link.target.startsWith('/api/')) continue;

    /* Ziel existiert? */
    const normalized = link.target;
    if (!known.has(normalized) && !known.has(normalized.replace(/\/$/, ''))) {
      broken.set(normalized, [...(broken.get(normalized) ?? []), page.url]);
      continue;
    }

    /* Nur Seiten-zu-Seiten-Kanten fließen in den Score. Downloads (PDF)
       sind Ziele, aber keine Seiten mit eigener Autorität. */
    if (!byUrl.has(normalized)) continue;
    if (normalized === page.url) continue;

    const text = link.text.toLocaleLowerCase('de-DE').trim();
    const weak = WEAK_ANCHORS.includes(text) || text.length < 3;

    const relativePos = mainStart >= 0 ? (link.position - mainStart) / mainLength : 0.5;
    const positionFactor = relativePos <= 0.5 ? 1.0 : 0.8;

    const divisor = Math.sqrt(Math.max(1, perZone.get(link.zone) ?? 1));
    const weight =
      ((ZONE_WEIGHT[link.zone] ?? 0.5) * priorityFactor * positionFactor * (weak ? 0.5 : 1.0)) /
      divisor;

    edges.push({
      from: page.url,
      to: normalized,
      zone: link.zone,
      module: link.module,
      text: link.text,
      weight,
    });

    if (text && !weak) {
      if (!anchorTargets.has(text)) anchorTargets.set(text, new Set());
      anchorTargets.get(text).add(normalized);
    }

    if (weak && link.zone === 'context') {
      report.warn(
        `${page.url} → ${normalized}`,
        `nichtssagender Linktext: "${link.text}"`,
        'Linktext soll den Inhalt der Zielseite benennen, z. B. „was eine Entrümpelung in Berlin kostet"',
      );
    }
  }
}

for (const [target, sources] of broken) {
  report.error(
    sources.slice(0, 3).join(', ') + (sources.length > 3 ? ` (+${sources.length - 3})` : ''),
    `interner Link ins Leere: ${target}`,
    'Ziel anlegen oder den Link entfernen. Tote interne Links kosten Crawl-Budget und Vertrauen.',
  );
}

/* ------------------------------------------------------------------ */
/* Score berechnen                                                     */
/* ------------------------------------------------------------------ */

const score = new Map();
const inbound = new Map(); // url -> Kanten

for (const page of pages) {
  score.set(page.url, 0);
  inbound.set(page.url, []);
}

for (const e of edges) {
  score.set(e.to, (score.get(e.to) ?? 0) + e.weight);
  inbound.get(e.to)?.push(e);
}

/* Auf den stärksten Wert normieren – der Score ist relativ. */
const max = Math.max(...score.values(), 1);
const normalized = new Map([...score].map(([url, v]) => [url, Math.round((v / max) * 1000) / 10]));

/* ------------------------------------------------------------------ */
/* Prüfungen                                                           */
/* ------------------------------------------------------------------ */

const indexablePages = pages.filter((p) => p.indexable);

for (const page of indexablePages) {
  const links = inbound.get(page.url) ?? [];
  const contextual = links.filter((l) => l.zone === 'context' || l.zone === 'module');
  const entry = entryFor(page.url);

  /* Verwaist */
  if (links.length === 0) {
    report.error(
      page.url,
      'indexierbare Seite ohne einen einzigen internen Link',
      'Von einer thematisch passenden Seite im Hauptinhalt verlinken. Eine Seite, die nur in der Sitemap steht, wird kaum gecrawlt.',
    );
    continue;
  }

  /* Die Startseite ist über das Logo von jeder Seite aus erreichbar. Für
     sie kontextuelle Eingänge zu verlangen wäre eine Regel ohne Zweck. */
  if (entry?.id === 'home') continue;

  /* Nur über Rahmenbereiche erreichbar */
  if (contextual.length === 0) {
    report.warn(
      page.url,
      'nur über Navigation, Fußbereich oder Breadcrumb erreichbar – kein einziger redaktioneller Link',
      'Aus einem thematisch passenden Absatz heraus verlinken. Rahmenlinks stehen auf jeder Seite und sagen nichts über Relevanz.',
    );
  } else if (entry && entry.businessPriority >= 4 && contextual.length < 3) {
    report.warn(
      page.url,
      `Priorität ${entry.businessPriority}, aber nur ${contextual.length} kontextuelle Eingänge`,
      'Für eine Seite dieser Bedeutung sind mindestens drei redaktionelle Eingänge angemessen',
    );
  }
}

/* Links auf Entwürfe */
for (const e of edges) {
  const from = byUrl.get(e.from);
  const to = byUrl.get(e.to);
  if (!from?.indexable || !to || to.indexable) continue;
  report.error(
    `${e.from} → ${e.to}`,
    'indexierbare Seite verlinkt auf einen Entwurf (noindex)',
    'Link entfernen oder die Zielseite veröffentlichen. Entwürfe dürfen nicht verlinkt sein.',
  );
}

/* Geforderte ausgehende Links */
for (const entry of map.pages) {
  if (!entry.indexable || !entry.requiredOutboundLinks.length) continue;
  const page = byUrl.get(entry.url);
  if (!page) continue;

  const mainTargets = new Set(
    page.links
      .filter((l) => l.zone === 'context' || l.zone === 'module')
      .map((l) => l.target)
      .filter(Boolean),
  );

  for (const id of entry.requiredOutboundLinks) {
    let targetUrl;
    try {
      targetUrl = map.urlOf(id);
    } catch (err) {
      report.error(entry.url, err.message, 'Tippfehler in requiredOutboundLinks in src/data/seo-pages.ts');
      continue;
    }
    if (!mainTargets.has(targetUrl)) {
      report.error(
        entry.url,
        `geforderter Link auf ${targetUrl} (${id}) fehlt im Hauptinhalt`,
        'Über ein Empfehlungsmodul oder einen Absatz im Hauptinhalt verlinken. Ein Link in Navigation oder Fußbereich zählt hier bewusst nicht.',
      );
    }
  }
}

/* Geforderte kontextuelle Eingänge */
for (const entry of map.pages) {
  if (!entry.indexable || !entry.requiredInboundContexts.length) continue;
  const sources = new Set(
    (inbound.get(entry.url) ?? [])
      .filter((l) => l.zone === 'context' || l.zone === 'module')
      .map((l) => l.from),
  );
  for (const id of entry.requiredInboundContexts) {
    let sourceUrl;
    try {
      sourceUrl = map.urlOf(id);
    } catch (err) {
      report.error(entry.url, err.message, 'Tippfehler in requiredInboundContexts in src/data/seo-pages.ts');
      continue;
    }
    if (!sources.has(sourceUrl)) {
      report.warn(
        entry.url,
        `erwarteter kontextueller Eingang von ${sourceUrl} (${id}) fehlt`,
        'Von dort aus im Fließtext oder über ein Empfehlungsmodul verlinken',
      );
    }
  }
}

/* Uneinheitliche Ankertexte: derselbe Text auf verschiedene Ziele */
for (const [text, targets] of anchorTargets) {
  if (targets.size > 1 && text.length > 8) {
    report.warn(
      `Linktext „${text}"`,
      `zeigt auf ${targets.size} verschiedene Ziele: ${[...targets].join(', ')}`,
      'Für denselben Begriff dauerhaft dieselbe Zielseite wählen, sonst konkurrieren die Ziele um dieselbe Bedeutung',
    );
  }
}

/* ------------------------------------------------------------------ */
/* Rangliste und Abnahmekriterium                                      */
/* ------------------------------------------------------------------ */

const ranking = indexablePages
  .map((p) => ({
    url: p.url,
    id: entryFor(p.url)?.id ?? '—',
    priority: entryFor(p.url)?.businessPriority ?? 0,
    score: normalized.get(p.url) ?? 0,
    total: (inbound.get(p.url) ?? []).length,
    contextual: (inbound.get(p.url) ?? []).filter((l) => l.zone === 'context' || l.zone === 'module')
      .length,
  }))
  .sort((a, b) => b.score - a.score);

const rankById = new Map(ranking.map((r, i) => [r.id, i + 1]));

report.stat(`${edges.length} interne Seitenverweise, ${indexablePages.length} indexierbare Seiten`);
report.stat('Stärkste zehn Seiten nach internem Authority-Score:');
for (const r of ranking.slice(0, 10)) {
  report.stat(
    `   ${String(r.score).padStart(5)}  P${r.priority}  ${r.url}  (${r.contextual} kontextuell / ${r.total} gesamt)`,
  );
}

/**
 * Abnahmekriterium aus dem Auftrag: Die vier Geldseiten müssen dauerhaft zu
 * den stärksten Seiten gehören. Als Grenze gilt die obere Hälfte der
 * indexierbaren Seiten – das ist streng genug, um echte Vernachlässigung
 * zu erkennen, und locker genug, dass Hubs und Startseite oben stehen
 * dürfen, ohne die Prüfung zu sprengen.
 */
const half = Math.ceil(ranking.length / 2);
for (const id of map.moneyPages) {
  const rank = rankById.get(id);
  if (!rank) {
    report.error(id, 'Geldseite taucht in der Rangliste nicht auf', 'Ist die Seite indexierbar?');
    continue;
  }
  if (rank > half) {
    const r = ranking[rank - 1];
    report.error(
      `${r.url} (${id})`,
      `steht auf Rang ${rank} von ${ranking.length} im internen Authority-Score – erwartet wird die obere Hälfte`,
      'Mehr kontextuelle Eingänge aus thematisch nahen Ratgebern und Standortseiten schaffen',
    );
  }
}

/**
 * Kleinaufträge dürfen die großen Leistungen nicht überholen.
 *
 * Das ist die wörtliche Regel aus Auftrag § 2 und deshalb ein FEHLER:
 * „Kleine Einzelabholungen … dürfen aber nicht mehr interne Autorität
 * erhalten als komplette Räumungen, Nachlassauflösungen oder
 * Seniorenumzüge."
 *
 * Welche Seiten das betrifft, steht in `smallJobPages` und
 * `mustOutrankSmallJobs` in src/data/seo-pages.ts – nicht hier. Die
 * Prüfung soll die Entscheidung durchsetzen, nicht sie treffen.
 */
const scoreById = new Map(ranking.map((r) => [r.id, r]));

for (const smallId of map.smallJobPages) {
  const small = scoreById.get(smallId);
  if (!small) continue; // Entwurf, nicht indexierbar – dann gibt es nichts zu prüfen
  for (const bigId of map.mustOutrankSmallJobs) {
    const big = scoreById.get(bigId);
    if (!big) continue;
    if (small.score <= big.score) continue;
    report.error(
      `${small.url} über ${big.url}`,
      `Kleinauftrag hat ${small.score} Punkte, die größere Leistung nur ${big.score}`,
      `${big.url} braucht mehr kontextuelle Eingänge aus thematisch passenden Seiten. Links zum Kleinauftrag NICHT künstlich entfernen – die Seite soll auffindbar bleiben.`,
    );
  }
}

/**
 * Allgemeine Prioritätsumkehr – nur eine WARNUNG.
 *
 * Anders als die Regel oben steht sie so nicht im Auftrag. Sie würde sonst
 * dazu zwingen, Links zu erfinden: Dass die Kellerentrümpelung gut verlinkt
 * ist, liegt daran, dass sieben Bezirke sie tatsächlich als Schwerpunkt
 * nennen und vier Ratgeber sie fachlich brauchen. Diese Links zu entfernen
 * oder anderswo künstliche zu setzen, wäre genau der Linkspam, den der
 * Auftrag ausschließt. Die Warnung zeigt die Lage; entschieden wird
 * redaktionell.
 */
const serviceRanking = ranking.filter((r) => map.byId.get(r.id)?.pageType === 'service');

for (const strong of serviceRanking) {
  for (const weak of serviceRanking) {
    if (weak.priority >= strong.priority) continue;
    if (weak.score <= strong.score) continue;
    report.warn(
      `${strong.url} (P${strong.priority}) hinter ${weak.url} (P${weak.priority})`,
      `Prioritätsumkehr: die wichtigere Seite hat ${strong.score} Punkte, die unwichtigere ${weak.score}`,
      `Prüfen, ob ${strong.url} zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt`,
    );
  }
}

/* Durchschnitt je Prioritätsstufe – muss monoton fallen. */
const byPriorityLevel = new Map();
for (const r of serviceRanking) {
  if (!byPriorityLevel.has(r.priority)) byPriorityLevel.set(r.priority, []);
  byPriorityLevel.get(r.priority).push(r.score);
}
const averages = [...byPriorityLevel.entries()]
  .map(([p, list]) => [p, Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10])
  .sort((a, b) => b[0] - a[0]);

report.stat(
  'Durchschnittlicher Score je Priorität (nur Leistungsseiten, muss fallen): ' +
    averages.map(([p, avg]) => `P${p}=${avg}`).join('  '),
);

/* ------------------------------------------------------------------ */
/* Ausgabe                                                             */
/* ------------------------------------------------------------------ */

if (asJson) {
  const out = join(projectRoot, 'tmp', 'seo-linkgraph.json');
  writeFileSync(
    out,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        formula:
          'Zonengewicht × (0,6 + 0,1 × Priorität) × Positionsfaktor × Linktextfaktor ÷ Wurzel(ausgehende Links der Quelle in derselben Zone)',
        zoneWeights: ZONE_WEIGHT,
        ranking,
        edges: edges.map((e) => ({
          from: e.from,
          to: e.to,
          zone: e.zone,
          text: e.text,
          weight: Math.round(e.weight * 1000) / 1000,
        })),
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`Linkgraph geschrieben: ${out}`);
}

finish(report);
