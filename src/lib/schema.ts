import { site, realValue, sameAsUrls, absoluteUrl } from '../config/site';
import { publishedServices } from '../data/services';
import { publishedDistricts } from '../data/districts';
import { publishedTowns } from '../data/towns';
import { reviews, hasReviews } from '../data/reviews';
import type { FaqItem } from '../data/types';

/**
 * STRUKTURIERTE DATEN (JSON-LD)
 * =============================
 * Grundsätze:
 *   1. Alles kommt aus src/config/site.ts. Keine doppelte Pflege.
 *   2. Platzhalter werden herausgefiltert. Lieber ein Feld weniger als
 *      ein Feld mit "[ADRESSE EINTRAGEN]" im Schema.
 *   3. Es wird nichts ausgezeichnet, was auf der Seite nicht sichtbar ist.
 *      AggregateRating gibt es nur, wenn echte Bewertungen vorliegen und
 *      auch angezeigt werden.
 */

const ORG_ID = `${site.url}/#organisation`;
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

function postalAddress() {
  const street = realValue(site.address.street);
  const zip = realValue(site.address.postalCode);
  // Ohne echte Straße/PLZ wird nur die Stadt ausgegeben – das ist korrekt
  // für ein Unternehmen, das im Einsatzgebiet arbeitet, und besser als
  // eine erfundene Adresse.
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

function aggregateRating() {
  // Doppelte Absicherung: Flag in der Konfiguration UND tatsächlich
  // vorhandene, sichtbare Bewertungen.
  if (!site.ratings.verified || !hasReviews) return undefined;
  if (!site.ratings.ratingValue || !site.ratings.reviewCount) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: site.ratings.ratingValue,
    reviewCount: site.ratings.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

function reviewNodes() {
  if (!hasReviews) return undefined;
  return reviews.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    reviewBody: r.text,
    datePublished: r.date,
    publisher: { '@type': 'Organization', name: r.source },
  }));
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
    description:
      'Entrümpelung, Haushaltsauflösung, Wohnungsauflösung und Umzug in Berlin und im Berliner Umland.',
    telephone: realValue(site.phone),
    email: realValue(site.email),
    address: postalAddress(),
    geo: site.geo
      ? { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng }
      : undefined,
    areaServed: areaServed(),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', address: postalAddress() },
      geoRadius: `${site.areaServed.radiusKm * 1000}`,
    },
    openingHoursSpecification: openingHoursSpecification(),
    priceRange: realValue(site.priceRange),
    paymentAccepted: site.paymentAccepted.map((p) => realValue(p)).filter(Boolean).join(', ') || undefined,
    foundingDate: realValue(site.foundingYear),
    numberOfEmployees: site.employeeCount
      ? { '@type': 'QuantitativeValue', value: site.employeeCount }
      : undefined,
    sameAs: sameAsUrls(),
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
  return clean({
    '@type': 'Article',
    '@id': `${absoluteUrl(opts.url)}#article`,
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    datePublished: opts.published,
    dateModified: opts.updated,
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
