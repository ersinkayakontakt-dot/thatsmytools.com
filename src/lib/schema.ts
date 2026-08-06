import { site, realValue, sameAsUrls, absoluteUrl } from '../config/site';
import { publishedServices } from '../data/services';
import { publishedDistricts } from '../data/districts';
import { publishedTowns } from '../data/towns';
import type { FaqItem } from '../data/types';

/**
 * STRUKTURIERTE DATEN (JSON-LD)
 * =============================
 * Grundsätze:
 *   1. Alles kommt aus src/config/site.ts. Keine doppelte Pflege.
 *   2. Platzhalter werden herausgefiltert. Lieber ein Feld weniger als
 *      ein Feld mit "[ADRESSE EINTRAGEN]" im Schema.
 *   3. Es wird nichts ausgezeichnet, was auf der Seite nicht sichtbar ist.
 *   4. Bewertungen über das eigene Unternehmen werden GAR NICHT
 *      ausgezeichnet – Begründung bei `aggregateRating()` weiter unten.
 *   5. Die Straßenanschrift steht nur im Schema, wenn Kundschaft sie
 *      tatsächlich aufsuchen kann (`site.hasVisitableAddress`).
 *
 * Geprüft wird das alles von `npm run seo:schema`: Es gleicht die
 * ausgegebenen Knoten gegen src/config/site.ts, gegen den sichtbaren Text
 * und gegen die in der Seitenkarte erlaubten Typen ab.
 */

/**
 * Die stabile Unternehmens-@id steht in src/config/site.ts und nicht hier.
 * Sie ist eine Geschäftsentscheidung („so heißt diese Entity dauerhaft"),
 * keine Implementierungsentscheidung dieser Datei.
 */
const ORG_ID = site.entityId;
const WEBSITE_ID = `${site.url}/#website`;

/** Entfernt Felder mit undefined/null/leeren Arrays rekursiv. */
export function clean<T>(obj: T): T {
  if (Array.isArray(obj)) {
    const arr = obj.map(clean).filter((v) => v !== undefined && v !== null);
    return (arr.length ? arr : undefined) as unknown as T;
  }
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const cleaned = clean(v);
      if (cleaned !== undefined && cleaned !== null && cleaned !== '') out[k] = cleaned;
    }
    return (Object.keys(out).length ? out : undefined) as unknown as T;
  }
  return obj;
}

/* ------------------------------------------------------------------ */
/* Adresse und Öffnungszeiten                                          */
/* ------------------------------------------------------------------ */

/**
 * Anschrift für die strukturierten Daten.
 *
 * Zwei Fälle, die auseinandergehalten werden müssen:
 *
 *   hasVisitableAddress: true
 *     Kundschaft kann herkommen. Vollständige Anschrift mit Straße.
 *
 *   hasVisitableAddress: false  (aktueller Stand)
 *     Reiner Dienstleister vor Ort. Dann wird die Straße bewusst NICHT
 *     ausgegeben: Eine Straßenanschrift im LocalBusiness-Schema behauptet
 *     einen Ort, an dem man erscheinen kann. Ausgegeben werden Ort,
 *     Region und Land – zusammen mit `areaServed` beschreibt das die Lage
 *     zutreffend.
 *
 * Das Impressum ist davon unberührt und zeigt die Anschrift vollständig,
 * wie es § 5 DDG verlangt.
 *
 * Fehlt eine echte Straße oder PLZ (Platzhalter), greift ohnehin dieselbe
 * verkürzte Ausgabe – das ist besser als eine erfundene Adresse.
 */
function postalAddress() {
  const street = site.hasVisitableAddress ? realValue(site.address.street) : undefined;
  const zip = site.hasVisitableAddress ? realValue(site.address.postalCode) : undefined;

  return clean({
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode: zip,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  });
}

function openingHoursSpecification() {
  const specs = site.openingHours
    .map((h) => {
      const opens = realValue(h.opens);
      const closes = realValue(h.closes);
      if (!opens || !closes) return undefined;
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens,
        closes,
      };
    })
    .filter(Boolean);
  return specs.length ? specs : undefined;
}

function areaServed() {
  const areas: Record<string, unknown>[] = [
    { '@type': 'City', name: 'Berlin' },
    ...publishedDistricts.map((d) => ({ '@type': 'AdministrativeArea', name: d.fullName })),
    ...publishedTowns.map((t) => ({ '@type': 'City', name: t.name })),
  ];
  return areas;
}

/**
 * BEWERTUNGEN WERDEN BEWUSST NICHT AUSGEZEICHNET
 * ==============================================
 *
 * Google untersagt „self-serving reviews": Bewertungen über das eigene
 * Unternehmen, ausgezeichnet auf der eigenen Website, sind für Rich
 * Results nicht zulässig. Für `LocalBusiness` und `Organization` gilt das
 * seit 2019 ausdrücklich. Wer es trotzdem tut, riskiert eine manuelle
 * Maßnahme gegen die gesamte Domain – für ein Sternchen, das ohnehin nicht
 * angezeigt würde.
 *
 * Deshalb geben diese beiden Funktionen dauerhaft `undefined` zurück.
 *
 * WAS STATTDESSEN PASSIERT
 * Die Startseite zeigt Wertung, Anzahl, Prüfdatum und einen Link auf das
 * Google-Unternehmensprofil. Das ist eine überprüfbare Aussage über eine
 * fremde Plattform – erlaubt, ehrlich und für Menschen nützlicher als ein
 * Schema-Feld, das niemand sieht.
 *
 * VORHER war die Ausgabe nur zufällig richtig: Sie hing an
 * `hasReviews`, also daran, dass src/data/reviews.ts leer ist. Eine
 * einzige eingetragene Bewertung hätte ein `aggregateRating` mit
 * reviewCount 27 erzeugt – bei einer sichtbaren Bewertung.
 *
 * Falls diese Entscheidung je revidiert wird: `npm run seo:schema`
 * meldet ein `aggregateRating` ohne passende sichtbare Bewertungen als
 * Fehler, und die Selbstprüfung deckt den Fall ab.
 */
function aggregateRating() {
  return undefined;
}

function reviewNodes() {
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Kernknoten                                                          */
/* ------------------------------------------------------------------ */

/**
 * Das Unternehmen. MovingCompany ist ein Subtyp von LocalBusiness und
 * trifft die Tätigkeit (Umzug + Räumung) am genauesten.
 */
export function organizationNode() {
  return clean({
    '@type': ['MovingCompany', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    legalName: realValue(site.legalName),
    url: site.url,
    image: absoluteUrl('/og-default.png'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/apple-touch-icon.png'),
    },
    description:
      'Entrümpelung, Haushaltsauflösung, Wohnungsauflösung und Umzug in Berlin und im Berliner Umland.',
    telephone: realValue(site.phone),
    email: realValue(site.email),
    address: postalAddress(),
    geo: site.geo
      ? { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng }
      : undefined,
    areaServed: areaServed(),
    serviceArea: site.geo
      ? {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: site.geo.lat,
            longitude: site.geo.lng,
          },
          geoRadius: `${site.areaServed.radiusKm * 1000}`,
        }
      : undefined,
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: realValue(site.priceRange),
    paymentAccepted: site.paymentAccepted.map((p) => realValue(p)).filter(Boolean).join(', ') || undefined,
    foundingDate: realValue(site.foundingYear),
    numberOfEmployees: site.employeeCount
      ? { '@type': 'QuantitativeValue', value: site.employeeCount }
      : undefined,
    sameAs: sameAsUrls(),
    // hasMap nur mit einem tatsächlich bestätigten Kartenprofil. Der
    // Verweis zeigt auf dasselbe Google-Unternehmensprofil, das auf der
    // Startseite als Bewertungsquelle sichtbar verlinkt ist.
    hasMap: realValue(site.profiles.googleBusiness),
    aggregateRating: aggregateRating(),
    review: reviewNodes(),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen von Schnellhelfer24',
      itemListElement: publishedServices.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.h1,
          serviceType: s.serviceType,
          url: absoluteUrl(`/leistungen/${s.slug}/`),
        },
      })),
    },
  });
}

export function websiteNode() {
  return clean({
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: site.url,
    name: site.name,
    inLanguage: 'de-DE',
    publisher: { '@id': ORG_ID },
  });
}

export function webPageNode(opts: {
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbId?: string;
  primaryImage?: string;
}) {
  return clean({
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.url)}#webpage`,
    url: absoluteUrl(opts.url),
    name: opts.name,
    description: opts.description,
    inLanguage: 'de-DE',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    breadcrumb: opts.breadcrumbId ? { '@id': opts.breadcrumbId } : undefined,
    primaryImageOfPage: opts.primaryImage
      ? { '@type': 'ImageObject', url: absoluteUrl(opts.primaryImage) }
      : undefined,
  });
}

export function breadcrumbNode(url: string, items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(url)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function serviceNode(opts: {
  url: string;
  name: string;
  serviceType: string;
  description: string;
}) {
  return clean({
    '@type': 'Service',
    '@id': `${absoluteUrl(opts.url)}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: absoluteUrl(opts.url),
    provider: { '@id': ORG_ID },
    areaServed: areaServed(),
    // Bewusst KEIN `offers` mit Preis, solange keine belastbaren
    // Preisdaten vorliegen. Ein erfundener Preis im Schema wäre
    // ein Verstoß gegen die Richtlinien und gegenüber der Kundschaft.
  });
}

/**
 * FAQPage nur ausgeben, wenn die Fragen auch sichtbar auf der Seite stehen.
 * Aufrufer übergeben genau die Items, die sie rendern.
 */
export function faqNode(url: string, items: FaqItem[]) {
  if (!items.length) return undefined;
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(url)}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleNode(opts: {
  url: string;
  headline: string;
  description: string;
  published: string;
  updated: string;
}) {
  const publishedAt = `${opts.published}T00:00:00+00:00`;
  const updatedAt = `${opts.updated}T00:00:00+00:00`;

  return clean({
    '@type': 'Article',
    '@id': `${absoluteUrl(opts.url)}#article`,
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl('/og-default.png'),
      width: 1200,
      height: 630,
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: 'de-DE',
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${absoluteUrl(opts.url)}#webpage` },
  });
}

/** Baut den fertigen @graph für eine Seite. */
export function buildGraph(nodes: (Record<string, unknown> | undefined)[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}
