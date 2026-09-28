import { cases } from './cases.ts';
import { districts } from './districts.ts';
import { guides } from './guides.ts';
import { services } from './services.ts';
import { towns } from './towns.ts';
import {
  caseIsIndexable,
  guideIsIndexable,
  locationIsIndexable,
  serviceIsIndexable,
} from '../lib/publishGuard.ts';

export type PageType =
  | 'home'
  | 'service'
  | 'location'
  | 'guide'
  | 'case'
  | 'hub'
  | 'conversion'
  | 'company'
  | 'legal'
  | 'error';

export type SearchIntent = 'transactional' | 'commercial' | 'informational' | 'navigational';
export type BusinessPriority = 1 | 2 | 3 | 4 | 5;
export type ConversionGoal =
  | 'complete_project_request'
  | 'callback'
  | 'phone_call'
  | 'whatsapp'
  | 'partner_request'
  | 'information';

export interface SeoPage {
  id: string;
  url: string;
  pageType: PageType;
  title: string;
  metaDescription: string;
  h1: string;
  primaryQuery: string;
  secondaryQueries: string[];
  searchIntent: SearchIntent;
  businessPriority: BusinessPriority;
  conversionGoal: ConversionGoal;
  targetRegion: string[];
  requiredOutboundLinks: string[];
  requiredInboundContexts: string[];
  mustNotCompeteWith: string[];
  allowedSchemaTypes: string[];
  imageTheme?: string;
  ownOgImage: boolean;
  lastmod: string;
  indexable: boolean;
  inSitemap: boolean;
}

type StaticPage = Omit<SeoPage, 'secondaryQueries' | 'requiredOutboundLinks' | 'requiredInboundContexts' | 'mustNotCompeteWith' | 'allowedSchemaTypes' | 'ownOgImage' | 'inSitemap'> &
  Partial<Pick<SeoPage, 'secondaryQueries' | 'requiredOutboundLinks' | 'requiredInboundContexts' | 'mustNotCompeteWith' | 'allowedSchemaTypes' | 'ownOgImage' | 'inSitemap'>>;

const WEBPAGE = ['WebPage'];
const HUB_SCHEMA = ['CollectionPage', 'WebPage', 'BreadcrumbList'];
const CONTENT_SCHEMA = ['WebPage', 'BreadcrumbList', 'FAQPage'];
const ARTICLE_SCHEMA = ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'];

const staticPages: StaticPage[] = [
  {
    id: 'home',
    url: '/',
    pageType: 'home',
    title: 'Wohnungsauflösung & Seniorenumzug Berlin | Schnellhelfer24',
    metaDescription:
      'Komplette Wohnungsauflösungen, Nachlässe und Seniorenumzüge in Berlin und im Umland – von der Sichtung bis zur besenreinen Übergabe, persönlich koordiniert.',
    h1: 'Wohnungsauflösung, Nachlass und Seniorenumzug in Berlin',
    primaryQuery: 'wohnungsauflösung und seniorenumzug berlin',
    secondaryQueries: ['nachlassauflösung berlin', 'komplette wohnungsauflösung berlin'],
    searchIntent: 'transactional',
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Berlin', 'Berliner Umland'],
    requiredOutboundLinks: [
      'service:wohnungsaufloesung-berlin',
      'service:nachlassaufloesung-berlin',
      'service:seniorenumzug-berlin',
      'angebot-anfragen',
    ],
    allowedSchemaTypes: ['WebPage', 'FAQPage'],
    ownOgImage: true,
    lastmod: '2026-07-30',
    indexable: true,
  },
  {
    id: 'leistungen',
    url: '/leistungen/',
    pageType: 'hub',
    title: 'Leistungen: Entrümpelung, Auflösung und Umzug in Berlin',
    metaDescription:
      'Alle Leistungen im Überblick: Entrümpelung, Haushalts- und Wohnungsauflösung, Nachlass, Keller, Büro, Sperrmüll, Umzug und Seniorenumzug in Berlin.',
    h1: 'Leistungen',
    primaryQuery: 'entruempelung aufloesung umzug berlin leistungen',
    searchIntent: 'commercial',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Berlin', 'Berliner Umland'],
    allowedSchemaTypes: [...HUB_SCHEMA, 'FAQPage'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'kosten',
    url: '/kosten/',
    pageType: 'hub',
    title: 'Kosten und Ablauf: Was eine Räumung in Berlin bestimmt',
    metaDescription:
      'Wie sich Preise für Entrümpelung, Haushaltsauflösung und Umzug in Berlin zusammensetzen, welche Faktoren wirken und woran Sie ein unseriöses Angebot erkennen.',
    h1: 'Kosten und Ablauf',
    primaryQuery: 'kosten räumung berlin',
    searchIntent: 'commercial',
    businessPriority: 3,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: [...HUB_SCHEMA, 'FAQPage'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'berlin',
    url: '/berlin/',
    pageType: 'hub',
    title: 'Einsatzgebiet Berlin: alle zwölf Bezirke | Schnellhelfer24',
    metaDescription:
      'Entrümpelung, Auflösung und Umzug in allen zwölf Berliner Bezirken. Was Altbau, Plattenbau, Hinterhof und Parksituation für den Aufwand bedeuten.',
    h1: 'Einsatzgebiet Berlin',
    primaryQuery: 'entruempelung berlin bezirke',
    searchIntent: 'transactional',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: [...HUB_SCHEMA, 'FAQPage'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'brandenburg',
    url: '/brandenburg/',
    pageType: 'hub',
    title: 'Einsatzgebiet Berliner Umland | Schnellhelfer24',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug im Berliner Umland: Potsdam, Falkensee und weitere Orte in Brandenburg. Was bei Häusern mit Grundstück zu beachten ist.',
    h1: 'Einsatzgebiet Berliner Umland',
    primaryQuery: 'entruempelung berliner umland',
    searchIntent: 'transactional',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Brandenburg', 'Berliner Umland'],
    allowedSchemaTypes: [...HUB_SCHEMA, 'FAQPage'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'ratgeber',
    url: '/ratgeber/',
    pageType: 'hub',
    title: 'Ratgeber: Räumung, Umzug und Übergabe in Berlin',
    metaDescription:
      'Praktische Berlin-Ratgeber zu Entrümpelung, Sperrmüll, Jobcenter-Umzugskosten, Wohnungsauflösung und Übergabe – mit Quellen und kostenloser PDF-Checkliste.',
    h1: 'Ratgeber',
    primaryQuery: 'ratgeber entrümpelung umzug berlin',
    searchIntent: 'informational',
    businessPriority: 2,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: HUB_SCHEMA,
    lastmod: '2026-07-30',
    indexable: true,
  },
  {
    id: 'einsatzberichte',
    url: '/einsatzberichte/',
    pageType: 'hub',
    title: 'Einsatzberichte aus Berlin | Schnellhelfer24',
    metaDescription:
      'Anonymisierte Berichte aus abgeschlossenen Räumungen und Umzügen in Berlin: Bezirk, Objektgröße, Etage, Dauer, enthaltene Leistungen und Art der Übergabe.',
    h1: 'Einsatzberichte',
    primaryQuery: 'einsatzberichte räumung berlin',
    searchIntent: 'commercial',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: HUB_SCHEMA,
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'hausverwaltungen',
    url: '/hausverwaltungen-immobilienpartner/',
    pageType: 'service',
    title: 'Räumungen für Hausverwaltungen und Eigentümer in Berlin',
    metaDescription:
      'Wohnungs- und Hausräumungen für Hausverwaltungen, Eigentümer und Makler in Berlin: feste Ansprechperson, Schlüsselübernahme, Fotoprotokoll, Rechnung ans Unternehmen.',
    h1: 'Ein Räumungspartner, der die Übergabe zu Ende bringt',
    primaryQuery: 'räumung hausverwaltung berlin',
    secondaryQueries: ['wohnungsräumung für vermieter berlin'],
    searchIntent: 'transactional',
    businessPriority: 4,
    conversionGoal: 'partner_request',
    targetRegion: ['Berlin', 'Berliner Umland'],
    requiredOutboundLinks: ['angebot-anfragen'],
    allowedSchemaTypes: CONTENT_SCHEMA,
    imageTheme: 'Schlüsselübergabe und dokumentierte Wohnungsräumung',
    ownOgImage: true,
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'angebot-anfragen',
    url: '/angebot-anfragen/',
    pageType: 'conversion',
    title: 'Kostenlose Einschätzung anfordern | Schnellhelfer24',
    metaDescription:
      'Aufwand-Check: Leistung, Ort, Umfang, Etage und Zeitraum angeben, Fotos anhängen. Sie erhalten eine persönliche Einschätzung, kostenlos und unverbindlich.',
    h1: 'Kostenlose Einschätzung anfordern',
    primaryQuery: 'angebot entrümpelung anfordern berlin',
    searchIntent: 'transactional',
    businessPriority: 4,
    conversionGoal: 'complete_project_request',
    targetRegion: ['Berlin', 'Berliner Umland'],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'kontakt',
    url: '/kontakt/',
    pageType: 'company',
    title: 'Kontakt: Schnellhelfer24 in Berlin erreichen',
    metaDescription:
      'So erreichen Sie Schnellhelfer24: Telefon, WhatsApp, E-Mail und Anfrageformular. Was wir für eine schnelle Einschätzung von Ihnen brauchen.',
    h1: 'Kontakt',
    primaryQuery: 'schnellhelfer24 kontakt',
    searchIntent: 'navigational',
    businessPriority: 3,
    conversionGoal: 'phone_call',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: ['ContactPage', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'fragen',
    url: '/fragen/',
    pageType: 'guide',
    title: 'Häufige Fragen zu Räumung, Entsorgung und Umzug',
    metaDescription:
      'Antworten auf die häufigsten Fragen zu Angebot, Ablauf, Entsorgung, Wertanrechnung, Rechnung und Kostenträgern bei Räumungen und Umzügen in Berlin.',
    h1: 'Häufige Fragen',
    primaryQuery: 'fragen entrümpelung umzug berlin',
    searchIntent: 'informational',
    businessPriority: 2,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: CONTENT_SCHEMA,
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'ueber-uns',
    url: '/ueber-uns/',
    pageType: 'company',
    title: 'Über Schnellhelfer24: wer wir sind und wie wir arbeiten',
    metaDescription:
      'Schnellhelfer24 räumt, löst auf und zieht um in Berlin und im Umland. Wie wir arbeiten, worauf wir uns nicht einlassen und was Sie von uns erwarten können.',
    h1: 'Über Schnellhelfer24',
    primaryQuery: 'schnellhelfer24 über uns',
    searchIntent: 'navigational',
    businessPriority: 3,
    conversionGoal: 'callback',
    targetRegion: ['Berlin', 'Berliner Umland'],
    allowedSchemaTypes: ['AboutPage', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'impressum',
    url: '/impressum/',
    pageType: 'legal',
    title: 'Impressum | Schnellhelfer24',
    metaDescription:
      'Anbieterkennzeichnung von Schnellhelfer24: Firmierung, Anschrift, Kontaktdaten und Registerangaben für Entrümpelung und Umzug in Berlin.',
    h1: 'Impressum',
    primaryQuery: 'schnellhelfer24 impressum',
    searchIntent: 'navigational',
    businessPriority: 1,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'datenschutz',
    url: '/datenschutz/',
    pageType: 'legal',
    title: 'Datenschutzerklärung | Schnellhelfer24',
    metaDescription: 'Wie Schnellhelfer24 mit personenbezogenen Daten und mit Fotos aus Anfragen umgeht.',
    h1: 'Datenschutzerklärung',
    primaryQuery: 'schnellhelfer24 datenschutz',
    searchIntent: 'navigational',
    businessPriority: 1,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
    indexable: true,
  },
  {
    id: 'bewerten',
    url: '/bewerten/',
    pageType: 'conversion',
    title: 'Bewertung schreiben | Schnellhelfer24',
    metaDescription: 'Direkter Weg zur Bewertung von Schnellhelfer24 bei Google. Dauert etwa eine Minute.',
    h1: 'Danke, dass Sie sich die Minute nehmen',
    primaryQuery: '',
    searchIntent: 'navigational',
    businessPriority: 1,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: [],
    lastmod: '2026-08-03',
    indexable: false,
    inSitemap: false,
  },
  {
    id: 'anfrage-erhalten',
    url: '/anfrage-erhalten/',
    pageType: 'conversion',
    title: 'Ihre Anfrage ist angekommen | Schnellhelfer24',
    metaDescription: 'Bestätigung Ihrer Anfrage bei Schnellhelfer24 und die nächsten Schritte.',
    h1: 'Ihre Anfrage ist angekommen',
    primaryQuery: '',
    searchIntent: 'navigational',
    businessPriority: 1,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: WEBPAGE,
    lastmod: '2026-07-29',
    indexable: false,
    inSitemap: false,
  },
  {
    id: '404',
    url: '/404/',
    pageType: 'error',
    title: 'Seite nicht gefunden | Schnellhelfer24',
    metaDescription: 'Diese Seite existiert nicht oder wurde verschoben.',
    h1: 'Diese Seite gibt es nicht',
    primaryQuery: '',
    searchIntent: 'navigational',
    businessPriority: 1,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    allowedSchemaTypes: [],
    lastmod: '2026-07-29',
    indexable: false,
    inSitemap: false,
  },
];

const servicePriority = (slug: string): BusinessPriority => {
  if (
    ['entruempelung-berlin', 'haushaltsaufloesung-berlin', 'wohnungsaufloesung-berlin', 'nachlassaufloesung-berlin'].includes(slug)
  )
    return 5;
  if (['seniorenumzug-berlin', 'bueroaufloesung-berlin', 'messiwohnung-raeumen'].includes(slug)) return 4;
  /*
   * Zusatzleistungen, die an einen anderen Auftrag andocken statt eigene
   * Aufträge zu gewinnen. Sie verdienen Geld, aber im selben Termin -
   * ihre Seite ist der Beleg für den Zusatz, nicht der Einstieg.
   *
   * Die Unterscheidung ist nicht kosmetisch: Der Linkgraph prüft, dass
   * wertvollere Seiten mehr interne Autorität tragen als geringere.
   * Stünde der Rückbau auf derselben Stufe wie die Kellerentrümpelung,
   * meldete er zu Recht eine Prioritätsumkehr gegen die
   * Messiwohnungs-Räumung - eine Seite, die eigene Aufträge gewinnt.
   *
   * Boden und Küche folgen derselben Logik: Sie setzen die Kette nach
   * der Räumung fort (Familie `herrichten`, E-005/E-006) und stehen
   * deshalb auf derselben Stufe wie der Rückbau, nicht darüber.
   */
  if (['demontage-rueckbau', 'bodenbelag-verlegen-berlin', 'kuechenmontage-berlin'].includes(slug)) return 2;
  return 3;
};

const serviceGoal = (slug: string): ConversionGoal => {
  if (slug === 'sperrmuellabholung-berlin') return 'whatsapp';
  if (slug === 'nachlassaufloesung-berlin' || slug === 'seniorenumzug-berlin') return 'callback';
  return 'complete_project_request';
};

const serviceImageThemes: Record<string, string> = {
  'entruempelung-berlin': 'sortierte Kartons und vorbereitete Räumung',
  'haushaltsaufloesung-berlin': 'sorgfältiges Einpacken von Hausrat',
  'wohnungsaufloesung-berlin': 'leere, saubere Wohnung kurz vor der Schlüsselübergabe',
  'nachlassaufloesung-berlin': 'gesicherte Familienfotos und persönliche Unterlagen',
  'seniorenumzug-berlin': 'ruhiges Planungsgespräch zwischen den Generationen',
  'bueroaufloesung-berlin': 'geordnetes, leergeräumtes Büro vor der Übergabe',
};

const ownOgServices = new Set([
  'entruempelung-berlin',
  'haushaltsaufloesung-berlin',
  'wohnungsaufloesung-berlin',
  'nachlassaufloesung-berlin',
  'seniorenumzug-berlin',
]);

const servicePages: SeoPage[] = services.map((service) => {
  const indexable = serviceIsIndexable(service);
  const id = `service:${service.slug}`;
  return {
    id,
    url: `/leistungen/${service.slug}/`,
    pageType: 'service',
    title: service.metaTitle,
    metaDescription: service.metaDescription,
    h1: service.h1,
    primaryQuery: service.h1.toLocaleLowerCase('de-DE'),
    secondaryQueries: service.situations.slice(0, 2).map((item) => item.toLocaleLowerCase('de-DE')),
    searchIntent: 'transactional',
    businessPriority: servicePriority(service.slug),
    conversionGoal: serviceGoal(service.slug),
    targetRegion: ['Berlin', 'Berliner Umland'],
    requiredOutboundLinks: indexable ? ['angebot-anfragen'] : [],
    requiredInboundContexts: [],
    mustNotCompeteWith: service.related.map((slug) => `service:${slug}`),
    allowedSchemaTypes: CONTENT_SCHEMA,
    imageTheme: serviceImageThemes[service.slug],
    ownOgImage: ownOgServices.has(service.slug),
    lastmod: service.updated,
    indexable,
    inSitemap: indexable,
  };
});

const districtPages: SeoPage[] = districts.map((district) => {
  const indexable = locationIsIndexable(district);
  return {
    id: `district:${district.slug}`,
    url: `/berlin/${district.slug}/`,
    pageType: 'location',
    title: district.metaTitle,
    metaDescription: district.metaDescription,
    h1: district.h1,
    primaryQuery: district.h1.toLocaleLowerCase('de-DE'),
    secondaryQueries: district.quarters.slice(0, 2).map((quarter) => `entrümpelung ${quarter}`),
    searchIntent: 'transactional',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: [district.fullName, 'Berlin'],
    requiredOutboundLinks: [],
    requiredInboundContexts: indexable ? ['berlin'] : [],
    mustNotCompeteWith: [],
    allowedSchemaTypes: CONTENT_SCHEMA,
    ownOgImage: false,
    lastmod: district.updated,
    indexable,
    inSitemap: indexable,
  };
});

const townPages: SeoPage[] = towns.map((town) => {
  const indexable = locationIsIndexable(town);
  return {
    id: `town:${town.slug}`,
    url: `/brandenburg/${town.slug}/`,
    pageType: 'location',
    title: town.metaTitle,
    metaDescription: town.metaDescription,
    h1: town.h1,
    primaryQuery: town.h1.toLocaleLowerCase('de-DE'),
    secondaryQueries: town.quarters.slice(0, 2).map((quarter) => `entrümpelung ${quarter}`),
    searchIntent: 'transactional',
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    targetRegion: [town.name, town.county, 'Brandenburg'],
    requiredOutboundLinks: [],
    requiredInboundContexts: indexable ? ['brandenburg'] : [],
    mustNotCompeteWith: [],
    allowedSchemaTypes: CONTENT_SCHEMA,
    ownOgImage: false,
    lastmod: town.updated,
    indexable,
    inSitemap: indexable,
  };
});

const guidePages: SeoPage[] = guides.map((guide) => {
  const indexable = guideIsIndexable(guide);
  const relatedService = guide.services.find((slug) => services.some((service) => service.slug === slug && serviceIsIndexable(service)));
  return {
    id: `guide:${guide.slug}`,
    url: `/${guide.hub}/${guide.slug}/`,
    pageType: 'guide',
    title: guide.metaTitle,
    metaDescription: guide.metaDescription,
    h1: guide.h1,
    primaryQuery: guide.h1.toLocaleLowerCase('de-DE').replace(/[?!.]+$/g, ''),
    secondaryQueries: [],
    searchIntent: 'informational',
    businessPriority: 2,
    conversionGoal: 'information',
    targetRegion: ['Berlin'],
    requiredOutboundLinks: relatedService ? [`service:${relatedService}`] : [],
    requiredInboundContexts: [guide.hub],
    mustNotCompeteWith: guide.services.map((slug) => `service:${slug}`),
    allowedSchemaTypes: ARTICLE_SCHEMA,
    ownOgImage: false,
    lastmod: guide.updated,
    indexable,
    inSitemap: indexable,
  };
});

const casePages: SeoPage[] = cases.map((caseStudy) => {
  const indexable = caseIsIndexable(caseStudy);
  return {
    id: `case:${caseStudy.slug}`,
    url: `/einsatzberichte/${caseStudy.slug}/`,
    pageType: 'case',
    title: caseStudy.metaTitle,
    metaDescription: caseStudy.metaDescription,
    h1: caseStudy.title,
    primaryQuery: indexable ? `${caseStudy.serviceSlug} ${caseStudy.locationLabel} erfahrung` : '',
    secondaryQueries: [],
    searchIntent: 'commercial',
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    targetRegion: [caseStudy.locationLabel, 'Berlin'],
    requiredOutboundLinks: indexable ? [`service:${caseStudy.serviceSlug}`] : [],
    requiredInboundContexts: indexable ? ['einsatzberichte'] : [],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ARTICLE_SCHEMA,
    ownOgImage: false,
    lastmod: caseStudy.updated,
    indexable,
    inSitemap: indexable,
  };
});

const normalizeStaticPage = (page: StaticPage): SeoPage => ({
  secondaryQueries: [],
  requiredOutboundLinks: [],
  requiredInboundContexts: [],
  mustNotCompeteWith: [],
  allowedSchemaTypes: WEBPAGE,
  ownOgImage: false,
  inSitemap: page.indexable,
  ...page,
});

export const seoPages: SeoPage[] = [
  ...staticPages.map(normalizeStaticPage),
  ...servicePages,
  ...districtPages,
  ...townPages,
  ...guidePages,
  ...casePages,
];

const byId = new Map(seoPages.map((page) => [page.id, page]));
const byUrl = new Map(seoPages.map((page) => [page.url, page]));

if (byId.size !== seoPages.length) throw new Error('Doppelte ID in src/data/seo-pages.ts');
if (byUrl.size !== seoPages.length) throw new Error('Doppelte URL in src/data/seo-pages.ts');

export const indexableSeoPages = seoPages.filter((page) => page.indexable);
export const sitemapSeoPages = seoPages.filter((page) => page.indexable && page.inSitemap);

export function seoPage(id: string): SeoPage {
  const page = byId.get(id);
  if (!page) throw new Error(`Unbekannte SEO-Seiten-ID: "${id}"`);
  return page;
}

export function seoPageByUrl(url: string): SeoPage | undefined {
  const normalized = url === '/404' ? '/404/' : url;
  return byUrl.get(normalized);
}

export function indexableUrls(): { url: string; lastmod: string }[] {
  return sitemapSeoPages.map(({ url, lastmod }) => ({ url, lastmod }));
}

export function ogImageFor(page: SeoPage): string {
  if (!page.ownOgImage) return '/og-default.png';
  return `/og/${page.id.replace(/[^a-z0-9-]+/gi, '-')}.png`;
}

export const moneyPages = new Set([
  'service:entruempelung-berlin',
  'service:wohnungsaufloesung-berlin',
  'service:haushaltsaufloesung-berlin',
  'service:nachlassaufloesung-berlin',
]);

export const smallJobPages = new Set([
  'service:kellerentruempelung-berlin',
  'service:sperrmuellabholung-berlin',
]);

export const mustOutrankSmallJobs = new Set([
  'service:entruempelung-berlin',
  'service:wohnungsaufloesung-berlin',
  'service:haushaltsaufloesung-berlin',
  'service:nachlassaufloesung-berlin',
]);
