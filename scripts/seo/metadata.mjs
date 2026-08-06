#!/usr/bin/env node
/**
 * METADATEN-GUARD
 * ===============
 *
 * Vergleicht die zentrale Seitenkarte mit dem, was tatsächlich gebaut wurde.
 * Das ist die Prüfung, die verhindert, dass die Karte zur Behauptung wird:
 * Solange sie mit dem ausgelieferten HTML abgeglichen wird, kann sie nicht
 * still danebenliegen.
 *
 * Aufruf: npm run seo:metadata
 *
 * BLOCKIEREND
 *   - gebaute Seite ohne Eintrag in der Karte (und umgekehrt)
 *   - indexierbare Seite ohne Title, ohne Description oder ohne H1
 *   - mehr als eine H1
 *   - doppelter Title oder doppelte Description
 *   - Canonical fehlt, zeigt auf eine fremde Domain oder auf eine andere Seite
 *   - Canonical zeigt auf einen Entwurf
 *   - Karte sagt indexierbar, HTML sagt noindex (und umgekehrt)
 *   - H1 im HTML weicht von der H1 in der Karte ab
 *   - noindex-Seite steht in der Sitemap
 *   - indexierbare Seite fehlt in der Sitemap
 *
 * WARNUNG
 *   - Title länger als 65 oder kürzer als 20 Zeichen
 *   - Description länger als 165 oder kürzer als 70 Zeichen
 *   - Title und H1 vollständig identisch
 *   - primäre Suchanfrage kommt in H1 und Title gar nicht vor
 */
import { Report, finish } from './lib/report.mjs';
import { loadPages, sitemapUrls, SITE } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';
import { queryCoverage } from './lib/similarity.mjs';

const report = new Report('Metadaten und Seitenkarte');
const map = await loadSeoMap();
const built = loadPages();
const sitemap = sitemapUrls();

report.stat(`${built.length} gebaute Seiten, ${map.pages.length} Einträge in der Karte`);
report.stat(`${built.filter((p) => p.indexable).length} indexierbar, ${sitemap?.size ?? 0} in der Sitemap`);

/* --------------------------------------------- Karte ↔ Build abgleichen */

const builtByUrl = new Map(built.map((p) => [p.url, p]));

for (const page of built) {
  // Die 404-Seite wird als /404 gebaut (ohne Schrägstrich), in der Karte
  // steht sie als /404/. Beide Formen zeigen auf dieselbe Datei.
  const key = page.url === '/404' ? '/404/' : page.url;
  if (!map.byUrl.has(key)) {
    report.error(
      page.url,
      'Seite wurde gebaut, hat aber keinen Eintrag in der SEO-Seitenkarte',
      'Eintrag in src/data/seo-pages.ts ergänzen: primäre Suchanfrage, Suchintention, wirtschaftliche Priorität und Conversion-Ziel',
    );
  }
}

for (const entry of map.pages) {
  const key = entry.url === '/404/' ? '/404' : entry.url;
  if (!builtByUrl.has(key) && !builtByUrl.has(entry.url)) {
    report.error(
      entry.url,
      `steht als "${entry.id}" in der Seitenkarte, wurde aber nicht gebaut`,
      'Entweder die Seite anlegen oder den Eintrag aus src/data/seo-pages.ts entfernen',
    );
  }
}

/* ------------------------------------------------ Pflichtangaben prüfen */

const titles = new Map();
const descriptions = new Map();

for (const page of built) {
  const key = page.url === '/404' ? '/404/' : page.url;
  const entry = map.byUrl.get(key);
  if (!entry) continue;

  /* Indexierbarkeit muss auf beiden Seiten dasselbe sagen. */
  if (entry.indexable !== page.indexable) {
    report.error(
      page.url,
      `Karte sagt ${entry.indexable ? 'indexierbar' : 'noindex'}, das gebaute HTML sagt ${page.indexable ? 'indexierbar' : 'noindex'}`,
      'Entweder den Publish Guard erfüllen oder `index={…}` in der Seite an die Karte angleichen',
    );
  }

  /* H1 muss zur Karte passen – sonst behauptet die Karte etwas Falsches. */
  if (page.h1s.length === 0) {
    if (page.indexable) report.error(page.url, 'keine H1', 'Genau eine H1 setzen, die die Seitenfrage benennt');
  } else if (page.h1s.length > 1) {
    report.error(
      page.url,
      `${page.h1s.length} H1-Überschriften`,
      'Genau eine H1 je Seite. Die übrigen zu H2 machen.',
    );
  } else if (entry.h1 && page.h1s[0] !== entry.h1) {
    report.error(
      page.url,
      `H1 im HTML ("${page.h1s[0]}") weicht von der Seitenkarte ab ("${entry.h1}")`,
      'Karte oder Seite angleichen. Die Karte ist die Grundlage aller SEO-Auswertungen; eine falsche H1 dort verfälscht sie.',
    );
  }

  if (!page.indexable) continue;

  /* Title */
  if (!page.title) {
    report.error(page.url, 'kein Title', 'Title in der Inhaltsquelle bzw. in der Seitenkarte ergänzen');
  } else {
    titles.set(page.title, [...(titles.get(page.title) ?? []), page.url]);
    if (page.title.length > 65)
      report.warn(page.url, `Title ist ${page.title.length} Zeichen lang und wird in der Suche gekürzt`, 'Auf höchstens 65 Zeichen kürzen, das Wichtigste nach vorn');
    if (page.title.length < 20)
      report.warn(page.url, `Title ist mit ${page.title.length} Zeichen sehr kurz`, 'Um die Leistung oder den Ort ergänzen');
  }

  /* Description */
  if (!page.description) {
    report.error(page.url, 'keine Meta Description', 'Description in der Inhaltsquelle bzw. in der Seitenkarte ergänzen');
  } else {
    descriptions.set(page.description, [...(descriptions.get(page.description) ?? []), page.url]);
    if (page.description.length > 165)
      report.warn(page.url, `Meta Description ist ${page.description.length} Zeichen lang und wird gekürzt`, 'Auf höchstens 165 Zeichen kürzen');
    if (page.description.length < 70)
      report.warn(page.url, `Meta Description ist mit ${page.description.length} Zeichen sehr kurz`, 'Konkreten Nutzen und Ort ergänzen');
  }

  /* Canonical */
  if (!page.canonical) {
    report.error(page.url, 'kein Canonical', 'Base.astro setzt es automatisch – prüfen, ob die Seite das Layout verwendet');
  } else if (!page.canonical.startsWith(SITE)) {
    report.error(page.url, `Canonical zeigt auf eine fremde Domain: ${page.canonical}`, 'site.url in src/config/site.ts prüfen');
  } else {
    const target = page.canonical.replace(SITE, '');
    if (target !== key) {
      report.error(
        page.url,
        `Canonical zeigt auf ${target} statt auf die eigene URL`,
        'Der `path`-Parameter des Layouts muss die eigene URL sein',
      );
    }
    const canonicalTarget = map.byUrl.get(target);
    if (canonicalTarget && !canonicalTarget.indexable) {
      report.error(
        page.url,
        `Canonical zeigt auf ${target}, und das ist ein Entwurf (noindex)`,
        'Canonical auf eine veröffentlichte Seite richten oder die Zielseite veröffentlichen',
      );
    }
  }

  /* Title und H1 sollten sich unterscheiden: Der Title wirbt in der
     Ergebnisliste, die H1 bestätigt nach dem Klick. Sind sie identisch,
     wird eine der beiden Gelegenheiten verschenkt. */
  if (page.title && page.h1s[0] && page.title === page.h1s[0]) {
    report.warn(
      page.url,
      'Title und H1 sind wortgleich',
      'Title darf einen Zusatznutzen nennen (Ablauf, Kosten, Termin), die H1 bleibt die reine Seitenfrage',
    );
  }

  /* Trägt die Seite ihre primäre Suchanfrage überhaupt sichtbar? */
  if (entry.primaryQuery) {
    const coverage = queryCoverage(entry.primaryQuery, `${page.title} ${page.h1s[0] ?? ''}`);
    if (coverage < 0.5) {
      report.warn(
        page.url,
        `primäre Suchanfrage "${entry.primaryQuery}" taucht in Title und H1 kaum auf (${Math.round(coverage * 100)} % der Wörter)`,
        'Entweder die Überschrift an die Suchanfrage annähern oder in der Karte eine treffendere Suchanfrage eintragen',
      );
    }
  }
}

for (const [title, urls] of titles) {
  if (urls.length > 1)
    report.error(urls.join(', '), `gleicher Title auf ${urls.length} Seiten: "${title}"`, 'Jede Seite braucht einen eigenen Title – sonst konkurrieren sie um dieselbe Ergebnisliste');
}
for (const [desc, urls] of descriptions) {
  if (urls.length > 1)
    report.error(urls.join(', '), `gleiche Meta Description auf ${urls.length} Seiten: "${desc.slice(0, 60)}…"`, 'Description je Seite eigenständig formulieren');
}

/* ------------------------------------------------------------ Sitemap */

if (!sitemap) {
  report.error('/sitemap.xml', 'Sitemap fehlt', 'src/pages/sitemap.xml.ts prüfen');
} else {
  for (const url of sitemap) {
    const page = builtByUrl.get(url);
    if (!page) {
      report.error(url, 'steht in der Sitemap, wurde aber nicht gebaut', 'Eintrag aus der Seitenkarte entfernen oder Seite anlegen');
    } else if (!page.indexable) {
      report.error(url, 'steht in der Sitemap, ist aber noindex', 'Eine Sitemap voller noindex-Seiten ist ein Qualitätssignal in die falsche Richtung');
    }
  }
  for (const entry of map.inSitemap) {
    if (!sitemap.has(entry.url)) {
      report.error(
        entry.url,
        'ist laut Karte indexierbar und sitemap-pflichtig, fehlt aber in der Sitemap',
        'indexableUrls() in src/data/seo-pages.ts prüfen',
      );
    }
  }
}

finish(report);
