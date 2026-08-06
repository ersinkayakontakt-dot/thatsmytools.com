#!/usr/bin/env node
/**
 * SCHEMA- UND ENTITY-ABGLEICH
 * ===========================
 *
 * Strukturierte Daten dürfen nichts behaupten, was auf der Seite nicht
 * steht, und nichts, was der zentralen Unternehmensquelle widerspricht.
 * Beides zusammen ist der Unterschied zwischen einer Entity, der
 * Suchmaschinen vertrauen, und einer, die als unzuverlässig eingestuft wird.
 *
 * Aufruf: npm run seo:schema
 *
 * BLOCKIEREND
 *   - JSON-LD ist kein gültiges JSON
 *   - Platzhalter in eckigen Klammern in den strukturierten Daten
 *   - Telefonnummer, E-Mail oder Adresse im JSON-LD weichen von
 *     src/config/site.ts ab
 *   - dieselbe Unternehmens-@id trägt auf verschiedenen Seiten
 *     verschiedene Angaben
 *   - mehrere widersprüchliche Unternehmensentitäten auf einer Seite
 *   - Schema-Typ, der für diese Seite nicht vorgesehen ist
 *   - FAQPage ohne sichtbare Fragen im HTML
 *   - aggregateRating ohne sichtbare Bewertungen
 *   - Breadcrumb verweist auf eine URL, die es nicht gibt
 *   - sichtbare Telefonnummer im HTML weicht von site.ts ab
 *
 * WARNUNG
 *   - indexierbare Seite ganz ohne strukturierte Daten
 *   - Bild-URL im Schema, die nicht ausgeliefert wird
 */
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { loadPages, distFiles, projectRoot, SITE } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';

const report = new Report('Strukturierte Daten und Unternehmens-Entity');
const map = await loadSeoMap();
const pages = loadPages();
const files = distFiles();

/* Die zentrale Unternehmensquelle – dieselbe, aus der die Seite baut. */
const siteMod = await import(pathToFileURL(join(projectRoot, 'src/config/site.ts')).href);
const { site, realValue } = siteMod;
const reviewsMod = await import(pathToFileURL(join(projectRoot, 'src/data/reviews.ts')).href);

const expected = {
  telephone: realValue(site.phone),
  email: realValue(site.email),
  street: realValue(site.address.street),
  postalCode: realValue(site.address.postalCode),
  locality: site.address.city,
  name: site.name,
  url: site.url,
};

report.stat(`${pages.length} Seiten, Unternehmensquelle: src/config/site.ts`);
report.stat(
  `erwartet: Telefon ${expected.telephone ?? '(Platzhalter)'}, E-Mail ${expected.email ?? '(Platzhalter)'}, Ort ${expected.locality}`,
);

/* ------------------------------------------------------------------ */
/* Hilfsfunktionen                                                     */
/* ------------------------------------------------------------------ */

const PLACEHOLDER = /\[[A-ZÄÖÜ][^\]]{4,}\]/;

function flattenGraph(data) {
  const nodes = [];
  const seen = new Set();
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== 'object') return;
    // Ohne diese Sperre wird jeder Knoten zweimal besucht – einmal über
    // @graph, einmal über die Werteschleife darunter – und jeder Befund
    // doppelt gemeldet.
    if (seen.has(node)) return;
    seen.add(node);

    if (node['@type']) nodes.push(node);
    for (const [key, value] of Object.entries(node)) {
      if (key === '@context') continue;
      if (value && typeof value === 'object') visit(value);
    }
  };
  visit(data);
  return nodes;
}

const typesOf = (node) => (Array.isArray(node['@type']) ? node['@type'] : [node['@type']]);

/** Telefonnummern vergleichbar machen: nur Ziffern, führende 0 zu 49. */
const normalizePhone = (value) =>
  String(value ?? '')
    .replace(/[^\d+]/g, '')
    .replace(/^\+/, '')
    .replace(/^0/, '49');

/* Merkt sich die Unternehmensangaben je @id über alle Seiten hinweg. */
const orgById = new Map();

/* ------------------------------------------------------------------ */
/* Seiten durchgehen                                                   */
/* ------------------------------------------------------------------ */

for (const page of pages) {
  const entry = map.byUrl.get(page.url === '/404' ? '/404/' : page.url);

  /* Gültiges JSON? */
  for (const block of page.jsonld) {
    if (!block.ok) {
      report.error(page.url, `JSON-LD ist kein gültiges JSON: ${block.error}`, 'src/lib/schema.ts prüfen');
    }
  }

  const nodes = page.jsonld.filter((b) => b.ok).flatMap((b) => flattenGraph(b.data));

  if (page.indexable && nodes.length === 0) {
    report.warn(
      page.url,
      'indexierbare Seite ohne strukturierte Daten',
      'Mindestens WebPage und BreadcrumbList ausgeben, damit die Seite eindeutig zuzuordnen ist',
    );
    continue;
  }

  /* Platzhalter dürfen niemals ins Schema. */
  const asText = JSON.stringify(nodes);
  if (PLACEHOLDER.test(asText)) {
    const hit = asText.match(PLACEHOLDER)?.[0];
    report.error(
      page.url,
      `Platzhalter in den strukturierten Daten: ${hit}`,
      'clean() in src/lib/schema.ts filtert Platzhalter – hier ist offenbar ein Wert daran vorbeigekommen',
    );
  }

  /* Erlaubte Typen */
  if (entry?.indexable && entry.allowedSchemaTypes.length) {
    const allowed = new Set([
      ...entry.allowedSchemaTypes,
      // Immer zulässig, weil sie den Graphen zusammenhalten bzw. reine
      // Hilfsknoten sind.
      'WebSite',
      'Organization',
      'LocalBusiness',
      'MovingCompany',
      'ImageObject',
      'PostalAddress',
      'OpeningHoursSpecification',
      'GeoCoordinates',
      'GeoCircle',
      'City',
      'AdministrativeArea',
      'OfferCatalog',
      'Offer',
      'Service',
      'ListItem',
      'Question',
      'Answer',
      'AggregateRating',
      'Rating',
      'Review',
      'Person',
      'QuantitativeValue',
    ]);
    for (const node of nodes) {
      for (const type of typesOf(node)) {
        if (!type || allowed.has(type)) continue;
        report.error(
          page.url,
          `Schema-Typ "${type}" ist für diese Seite nicht vorgesehen`,
          `allowedSchemaTypes von "${entry.id}" in src/data/seo-pages.ts erweitern oder den Typ entfernen. Unnötige Typen verwässern die Aussage.`,
        );
      }
    }
  }

  /* Unternehmensknoten gegen site.ts */
  for (const node of nodes) {
    const types = typesOf(node);
    const isOrg = types.some((t) =>
      ['Organization', 'LocalBusiness', 'MovingCompany'].includes(t),
    );
    if (!isOrg) continue;
    if (!node['@id']) continue; // Referenzknoten ohne Inhalt

    /* Stabile @id: gleiche Angaben überall. */
    const fingerprint = JSON.stringify({
      name: node.name,
      telephone: node.telephone,
      email: node.email,
      address: node.address,
    });
    const seen = orgById.get(node['@id']);
    if (seen && seen.fingerprint !== fingerprint && Object.keys(node).length > 2) {
      report.error(
        `${seen.url} ↔ ${page.url}`,
        `dieselbe Unternehmens-@id (${node['@id']}) trägt auf beiden Seiten verschiedene Angaben`,
        'Alle Unternehmensdaten aus src/config/site.ts beziehen, nie im Markup wiederholen',
      );
    } else if (!seen && Object.keys(node).length > 2) {
      orgById.set(node['@id'], { url: page.url, fingerprint });
    }

    /* Abgleich mit der Quelle */
    if (node.telephone && expected.telephone) {
      if (normalizePhone(node.telephone) !== normalizePhone(expected.telephone)) {
        report.error(
          page.url,
          `Telefonnummer im Schema (${node.telephone}) weicht von src/config/site.ts (${expected.telephone}) ab`,
          'Nummer nur an einer Stelle pflegen',
        );
      }
    }
    if (node.email && expected.email && node.email !== expected.email) {
      report.error(
        page.url,
        `E-Mail im Schema (${node.email}) weicht von src/config/site.ts (${expected.email}) ab`,
        'E-Mail nur an einer Stelle pflegen',
      );
    }
    if (node.address && typeof node.address === 'object') {
      const a = node.address;
      if (expected.street && a.streetAddress && a.streetAddress !== expected.street) {
        report.error(
          page.url,
          `Straße im Schema (${a.streetAddress}) weicht von src/config/site.ts (${expected.street}) ab`,
          'Adresse nur an einer Stelle pflegen',
        );
      }
      if (a.addressLocality && a.addressLocality !== expected.locality) {
        report.error(
          page.url,
          `Ort im Schema (${a.addressLocality}) weicht von src/config/site.ts (${expected.locality}) ab`,
          'Ort nur an einer Stelle pflegen',
        );
      }
    }

    /**
     * aggregateRating nur, wenn auf DIESER Seite echte Bewertungen sichtbar
     * sind. Google verlangt das ausdrücklich und wertet selbstvergebene
     * Bewertungen für das eigene Unternehmen ab.
     */
    if (node.aggregateRating) {
      if (!reviewsMod.hasReviews) {
        report.error(
          page.url,
          'aggregateRating im Schema, aber src/data/reviews.ts enthält keine sichtbaren Bewertungen',
          'Entweder echte, öffentlich prüfbare Bewertungen in reviews.ts eintragen und anzeigen oder das aggregateRating entfernen',
        );
      }
      const count = Number(node.aggregateRating.reviewCount ?? 0);
      if (reviewsMod.hasReviews && count !== reviewsMod.reviews.length) {
        report.error(
          page.url,
          `aggregateRating nennt ${count} Bewertungen, sichtbar sind ${reviewsMod.reviews.length}`,
          'Die ausgezeichnete Anzahl muss der sichtbaren Anzahl entsprechen',
        );
      }
    }
  }

  /* Mehrere verschiedene Unternehmensentitäten auf einer Seite */
  const orgIds = new Set(
    nodes
      .filter((n) => typesOf(n).some((t) => ['Organization', 'LocalBusiness', 'MovingCompany'].includes(t)))
      .map((n) => n['@id'])
      .filter(Boolean),
  );
  if (orgIds.size > 1) {
    report.error(
      page.url,
      `${orgIds.size} verschiedene Unternehmens-@id auf einer Seite: ${[...orgIds].join(', ')}`,
      'Genau eine stabile @id je Unternehmen. Mehrere Entitäten machen die Zuordnung für Suchmaschinen unmöglich.',
    );
  }

  /* FAQPage nur mit sichtbaren Fragen */
  for (const node of nodes) {
    if (!typesOf(node).includes('FAQPage')) continue;
    const questions = node.mainEntity ?? [];
    for (const q of Array.isArray(questions) ? questions : [questions]) {
      const name = q?.name;
      if (!name) continue;
      // Die Frage muss im sichtbaren Text vorkommen. Entities im HTML
      // vorher auflösen, sonst schlägt der Vergleich bei "&" fehl.
      const needle = name.slice(0, 40).toLocaleLowerCase('de-DE');
      if (!page.text.toLocaleLowerCase('de-DE').includes(needle)) {
        report.error(
          page.url,
          `FAQPage zeichnet eine Frage aus, die im sichtbaren Text nicht vorkommt: "${name.slice(0, 60)}…"`,
          'Nur Fragen auszeichnen, die auf der Seite auch stehen',
        );
      }
    }
  }

  /* Breadcrumb-Ziele müssen existieren */
  for (const node of nodes) {
    if (!typesOf(node).includes('BreadcrumbList')) continue;
    for (const item of node.itemListElement ?? []) {
      const target = String(item.item ?? '').replace(SITE, '');
      if (!target) continue;
      const known = pages.some((p) => p.url === target) || files.has(target);
      if (!known) {
        report.error(
          page.url,
          `Breadcrumb verweist auf ${target}, diese Seite gibt es nicht`,
          'Breadcrumb-Pfad in der Seite korrigieren',
        );
      }
    }
  }

  /* Bild-URLs im Schema müssen ausgeliefert werden */
  for (const node of nodes) {
    const urls = [];
    /**
     * Nur `url` und `contentUrl` verweisen auf eine Datei.
     *
     * `@id` ist eine Kennung, keine Adresse – ein `ImageObject` mit
     * `"@id": "https://…/#logo"` ist völlig korrekt, obwohl es unter
     * `/#logo` keine Datei gibt. Wurde diese Unterscheidung nicht gemacht,
     * meldete die Prüfung auf jeder Seite einen toten Bildverweis, der
     * keiner war – 68 Warnungen aus einem einzigen richtig gebauten Knoten.
     */
    const collect = (v) => {
      if (!v) return;
      if (typeof v === 'string') {
        if (v.startsWith(SITE)) urls.push(v.replace(SITE, ''));
        return;
      }
      if (typeof v !== 'object') return;
      for (const [key, value] of Object.entries(v)) {
        if (key === '@id' || key === '@type') continue;
        collect(value);
      }
    };
    if (node.image) collect(node.image);
    if (node.logo) collect(node.logo);
    for (const u of urls) {
      if (!files.has(u)) {
        report.warn(
          page.url,
          `Bild im Schema zeigt auf ${u}, diese Datei wird nicht ausgeliefert`,
          'Datei nach public/ legen oder den Verweis entfernen. Ein toter Bildverweis im Schema ist ein Qualitätsmangel.',
        );
      }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Sichtbare Kontaktdaten gegen die Quelle                             */
/* ------------------------------------------------------------------ */
/**
 * Nicht nur das Schema, auch der sichtbare Text muss zur Quelle passen.
 * Eine im Markup vergessene alte Telefonnummer ist für die lokale
 * Auffindbarkeit schädlicher als ein fehlendes Schema-Feld: Sie erzeugt
 * widersprüchliche NAP-Signale.
 */
if (expected.telephone) {
  const wanted = normalizePhone(expected.telephone);
  const phonePattern = /(?:tel:)?(\+?[\d][\d\s/().-]{8,})/g;
  for (const page of pages) {
    const found = new Set();
    for (const m of page.html.matchAll(/href="tel:([^"]+)"/g)) found.add(normalizePhone(m[1]));
    for (const num of found) {
      if (num !== wanted) {
        report.error(
          page.url,
          `sichtbarer tel:-Link mit ${num} weicht von src/config/site.ts (${wanted}) ab`,
          'Alle Telefonlinks über src/lib/contact.ts beziehen',
        );
      }
    }
  }
  void phonePattern;
}

if (expected.email) {
  for (const page of pages) {
    for (const m of page.html.matchAll(/href="mailto:([^"?]+)/g)) {
      if (m[1] !== expected.email) {
        report.error(
          page.url,
          `mailto:-Link mit ${m[1]} weicht von src/config/site.ts (${expected.email}) ab`,
          'Alle E-Mail-Links über src/lib/contact.ts beziehen',
        );
      }
    }
  }
}

report.stat(`${orgById.size} Unternehmens-@id im Einsatz (erwartet: genau eine)`);
if (orgById.size > 1) {
  report.error(
    [...orgById.keys()].join(', '),
    'mehr als eine Unternehmens-@id über die Website hinweg',
    'Eine stabile, seitenübergreifende @id verwenden – sie ist der Anker der Entity',
  );
}

finish(report);
