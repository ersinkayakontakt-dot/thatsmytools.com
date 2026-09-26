/**
 * ZENTRALE SEO-SEITENKARTE
 * ========================
 *
 * Die einzige Stelle, an der steht, WAS eine Seite im Suchmarkt sein soll:
 * welche Suchanfrage sie holt, welche Absicht dahinter steht, wie viel sie
 * wirtschaftlich wert ist, welches Ziel sie verfolgt und mit wem sie
 * ausdrücklich NICHT konkurrieren darf.
 *
 * ABGELEITET, NICHT DUPLIZIERT
 * ----------------------------
 * Title, H1 und Meta Description stehen NICHT hier. Sie stehen dort, wo der
 * Inhalt steht – in services.ts, guides.ts, districts.ts, towns.ts,
 * cases.ts – und werden von hier nur gelesen. Eine zweite Quelle für
 * dieselbe Angabe wäre der sicherste Weg, dass beide auseinanderlaufen.
 * Nur die vierzehn handgebauten Seiten ohne eigenen Datensatz tragen ihre
 * Metadaten hier direkt; ihre .astro-Dateien lesen sie von hier.
 *
 * Was hier steht, ist also genau das, was NIRGENDWO sonst steht.
 *
 * WIRTSCHAFTLICHE PRIORITÄT (1 bis 5)
 * -----------------------------------
 *   5  Wichtigste Umsatz- und Autoritätsseiten
 *   4  Profitable ergänzende Leistungen
 *   3  Relevante Informations- und Standortseiten
 *   2  Unterstützende Ratgeber
 *   1  Rechtliches, Organisatorisches, Untergeordnetes
 *
 * Die Priorität steuert interne Verlinkung, Empfehlungsmodule, den
 * Authority-Score und die Gewichtung im Opportunity-Score. Sie ist KEIN
 * Freibrief für Linkspam: `requiredOutboundLinks` bleibt kuratiert.
 *
 * REGELN, DIE DIE GUARDS DURCHSETZEN (npm run seo:all)
 * ----------------------------------------------------
 *   - Jede indexierbare URL hat genau einen Datensatz.
 *   - Keine zwei indexierbaren Seiten teilen sich `primaryQuery`.
 *   - Entwürfe stehen auf noindex und nicht in der Sitemap.
 *   - Canonicals zeigen auf die eigene URL, nie auf einen Entwurf.
 *   - `mustNotCompeteWith` wird gegen Titel- und Inhaltsähnlichkeit geprüft.
 *   - `requiredOutboundLinks` muss im gebauten HTML tatsächlich vorkommen.
 */
import type { PublishStatus } from './types.ts';
import { services } from './services.ts';
import { guides } from './guides.ts';
import { districts } from './districts.ts';
import { towns } from './towns.ts';
import { cases } from './cases.ts';
import {
  serviceIsIndexable,
  guideIsIndexable,
  locationIsIndexable,
  caseIsIndexable,
} from '../lib/publishGuard.ts';

/* ------------------------------------------------------------------ */
/* Typen                                                               */
/* ------------------------------------------------------------------ */

export type PageType =
  | 'home'
  | 'hub'
  | 'service'
  | 'location'
  | 'guide'
  | 'case-study'
  | 'company'
  | 'contact'
  | 'legal';

export type SearchIntent =
  | 'transactional'
  | 'commercial'
  | 'informational'
  | 'navigational'
  | 'local';

export type ConversionGoal =
  | 'complete_project_request'
  | 'callback'
  | 'phone_call'
  | 'whatsapp'
  | 'partner_request'
  | 'information';

export type BusinessPriority = 1 | 2 | 3 | 4 | 5;

export interface SeoPage {
  id: string;
  url: string;
  pageType: PageType;
  status: PublishStatus;
  /** Besteht die Seite Publish Guard UND Statusprüfung? */
  indexable: boolean;

  /* Abgeleitet aus der Inhaltsquelle – hier nur gelesen. */
  title: string;
  h1: string;
  metaDescription: string;
  canonicalUrl: string;

  /* Steuerfelder – nur hier gepflegt. */
  primaryQuery: string;
  secondaryQueries: string[];
  searchIntent: SearchIntent;
  targetRegion: string[];
  businessPriority: BusinessPriority;
  conversionGoal: ConversionGoal;

  parentHub?: string;
  relatedPages: string[];
  /** IDs von Seiten, die kontextuell (nicht über Navigation) hierher verlinken müssen. */
  requiredInboundContexts: string[];
  /** IDs, auf die diese Seite im Hauptinhalt verlinken muss. */
  requiredOutboundLinks: string[];
  mustNotCompeteWith: string[];
  allowedSchemaTypes: string[];

  imageTheme?: string;
  /**
   * Eigenes Social- und Suchvorschaubild statt des allgemeinen.
   *
   * Nur für Seiten setzen, bei denen sich eine eigene Darstellung lohnt –
   * ein identisches Vorschaubild auf fünfzig Seiten sagt nichts aus, aber
   * fünfzig fast gleiche Bilder auch nicht.
   *
   * Die Datei entsteht aus `npm run images:og` und heißt `/og/<id>.png`.
   */
  ownOgImage?: boolean;
  lastEditorialReview?: string;
  /** Datum für die Sitemap. Nur anfassen, wenn sich der Hauptinhalt ändert. */
  lastmod: string;
}

/**
 * Pfad des Vorschaubilds einer Seite.
 *
 * Eine Funktion und kein Feld, damit Skript und Seite denselben Namen
 * bilden. Zwei Stellen, die denselben Dateinamen zusammensetzen, laufen
 * irgendwann auseinander.
 */
export function ogImageFor(page: { id: string; ownOgImage?: boolean }): string {
  if (!page.ownOgImage) return '/og-default.png';
  return `/og/${page.id.replace(/[^a-z0-9-]+/gi, '-')}.png`;
}

/**
 * Steuerfelder, wie sie unten je Seite eingetragen werden.
 *
 * Die fünf Listenfelder dürfen beim Eintragen fehlen und werden von `fill()`
 * auf ein leeres Array gesetzt. Sie müssen deshalb echt optional sein –
 * `Omit<…> & { x?: T }` würde sie NICHT optional machen, weil der
 * Schnitttyp das Pflichtfeld aus dem Omit behält.
 */
type ListFields =
  | 'secondaryQueries'
  | 'relatedPages'
  | 'requiredInboundContexts'
  | 'requiredOutboundLinks'
  | 'mustNotCompeteWith';

type EditorialCore = Omit<
  SeoPage,
  | 'id'
  | 'url'
  | 'status'
  | 'indexable'
  | 'title'
  | 'h1'
  | 'metaDescription'
  | 'canonicalUrl'
  | ListFields
>;

type Editorial = EditorialCore & Partial<Pick<SeoPage, ListFields>>;

/** Dasselbe, nachdem `fill()` die Listen ergänzt hat. */
type EditorialComplete = EditorialCore & Pick<SeoPage, ListFields>;

const SITE = 'https://schnellhelfer24.de';

/* ------------------------------------------------------------------ */
/* 1. Leistungsseiten                                                  */
/* ------------------------------------------------------------------ */

/**
 * Die vier Seiten mit Priorität 5 sind die wirtschaftliche Spitze des
 * Angebots. Alles darunter darf sichtbar bleiben, aber nicht mehr interne
 * Autorität einsammeln als sie.
 *
 * `mustNotCompeteWith` steht dort, wo zwei Seiten dieselbe Situation
 * bedienen könnten. Der Guard prüft dann Titel- und Inhaltsnähe schärfer.
 */
const SERVICE_SEO: Record<string, Editorial> = {
  'wohnungsaufloesung-berlin': {
    pageType: 'service',
    primaryQuery: 'wohnungsauflösung berlin',
    secondaryQueries: [
      'wohnung auflösen berlin',
      'wohnungsauflösung berlin kosten',
      'wohnung räumen lassen berlin',
      'wohnungsauflösung mit übergabe',
    ],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: [
      'guide:wohnungsaufloesung-checkliste-pdf',
      'guide:checkliste-wohnungsuebergabe',
      'guide:kosten-haushaltsaufloesung-berlin',
      'angebot-anfragen',
      'berlin',
    ],
    requiredInboundContexts: ['home', 'leistungen', 'guide:wohnungsaufloesung-checkliste-pdf'],
    mustNotCompeteWith: ['service:haushaltsaufloesung-berlin', 'service:entruempelung-berlin', 'home'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'leere, saubere Wohnung kurz vor der Schlüsselübergabe',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'entruempelung-berlin': {
    pageType: 'service',
    primaryQuery: 'entrümpelung berlin',
    secondaryQueries: ['entrümpelung berlin kosten', 'entrümpeln lassen berlin', 'entrümpelungsfirma berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: [
      'guide:was-kostet-eine-entruempelung-in-berlin',
      'guide:entruempelung-vorbereiten',
      'angebot-anfragen',
      'berlin',
    ],
    requiredInboundContexts: ['home', 'leistungen', 'guide:was-kostet-eine-entruempelung-in-berlin'],
    mustNotCompeteWith: ['service:haushaltsaufloesung-berlin', 'service:kellerentruempelung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'geordnete Umzugskartons und Teamarbeit beim Heraustragen',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'haushaltsaufloesung-berlin': {
    pageType: 'service',
    primaryQuery: 'haushaltsauflösung berlin',
    secondaryQueries: [
      'haushalt auflösen berlin',
      'haushaltsauflösung mit wertanrechnung',
      // "haushaltsauflösung berlin kosten" bewusst NICHT hier: Das ist die
      // Hauptsuchanfrage von /kosten/kosten-haushaltsaufloesung-berlin/.
    ],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: [
      'guide:kosten-haushaltsaufloesung-berlin',
      'guide:haushaltsaufloesung-nach-todesfall',
      'angebot-anfragen',
      'berlin',
    ],
    requiredInboundContexts: ['home', 'leistungen', 'guide:kosten-haushaltsaufloesung-berlin'],
    mustNotCompeteWith: ['service:wohnungsaufloesung-berlin', 'service:nachlassaufloesung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'sorgfältiges Einpacken persönlicher Gegenstände',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'nachlassaufloesung-berlin': {
    pageType: 'service',
    primaryQuery: 'nachlassauflösung berlin',
    secondaryQueries: ['nachlass auflösen berlin', 'nachlassverwertung berlin', 'wohnung nach todesfall auflösen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: [
      'guide:haushaltsaufloesung-nach-todesfall',
      'guide:wohnungsaufloesung-checkliste-pdf',
      'angebot-anfragen',
      'ueber-uns',
    ],
    requiredInboundContexts: ['home', 'leistungen', 'guide:haushaltsaufloesung-nach-todesfall'],
    mustNotCompeteWith: ['service:haushaltsaufloesung-berlin', 'guide:haushaltsaufloesung-nach-todesfall'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'respektvoll behandelte Erinnerungsstücke, ruhige Planung unter Angehörigen',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },

  'seniorenumzug-berlin': {
    pageType: 'service',
    primaryQuery: 'seniorenumzug berlin',
    // "seniorenumzug kosten berlin" gehört dem Kostenratgeber, nicht hierher.
    secondaryQueries: ['umzug senioren berlin', 'umzug ins pflegeheim berlin', 'umzug altersgerechte wohnung berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 4,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: ['guide:kosten-seniorenumzug-berlin', 'angebot-anfragen', 'ueber-uns'],
    requiredInboundContexts: ['home', 'leistungen', 'guide:kosten-seniorenumzug-berlin'],
    mustNotCompeteWith: ['service:umzug-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'ältere Person in heller, würdevoller Umgebung; Gespräch mit erwachsenen Kindern',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'umzug-berlin': {
    pageType: 'service',
    primaryQuery: 'umzug berlin',
    secondaryQueries: ['umzugsunternehmen berlin', 'umzugsfirma berlin', 'umzug berlin kosten'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    // Auftrag § 2 listet den reinen Umzug an neunter Stelle – hinter
    // Seniorenumzug (5) und Hausverwaltungen (8). Priorität 3 statt 4:
    // Ein Umzug ohne Räumung ist der Auftrag mit der geringsten Marge in
    // dieser Gruppe.
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: [
      'guide:halteverbotszone-berlin-umzug',
      'guide:umzugskosten-jobcenter-berlin',
      'angebot-anfragen',
    ],
    requiredInboundContexts: ['leistungen', 'guide:halteverbotszone-berlin-umzug'],
    mustNotCompeteWith: ['service:seniorenumzug-berlin', 'service:kleintransport-moebeltransport-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'neutrale professionelle Umzugssituation, Verpackung von Möbeln',
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'messiwohnung-raeumen': {
    pageType: 'service',
    primaryQuery: 'messiwohnung räumen berlin',
    secondaryQueries: ['vermüllte wohnung räumen berlin', 'messi entrümpelung berlin', 'wohnung entrümpeln messie'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 4,
    conversionGoal: 'callback',
    parentHub: 'leistungen',
    requiredOutboundLinks: ['service:wohnungsaufloesung-berlin', 'angebot-anfragen'],
    requiredInboundContexts: ['leistungen'],
    mustNotCompeteWith: ['service:entruempelung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    // Bewusst KEIN Bild: Schockmotive sind hier ausgeschlossen, und ein
    // beschönigendes Symbolbild wäre gegenüber Betroffenen unredlich.
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'bueroaufloesung-berlin': {
    pageType: 'service',
    primaryQuery: 'büroauflösung berlin',
    secondaryQueries: ['büro auflösen berlin', 'geschäftsauflösung berlin', 'gewerbefläche räumen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 4,
    conversionGoal: 'partner_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: ['hausverwaltungen', 'angebot-anfragen'],
    requiredInboundContexts: ['leistungen', 'hausverwaltungen'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'geräumte, saubere Gewerbefläche; Übergabe an Verwaltung',
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  'kellerentruempelung-berlin': {
    pageType: 'service',
    primaryQuery: 'kellerentrümpelung berlin',
    secondaryQueries: ['keller entrümpeln berlin', 'kellerabteil räumen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    requiredOutboundLinks: ['service:entruempelung-berlin', 'angebot-anfragen'],
    requiredInboundContexts: ['leistungen'],
    mustNotCompeteWith: ['service:entruempelung-berlin', 'service:dachbodenentruempelung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  // Kleinauftrag. Bleibt auffindbar, bekommt aber ausdrücklich WENIGER
  // interne Autorität als jede Kompletträumung – siehe Auftrag § 2.
  'sperrmuellabholung-berlin': {
    pageType: 'service',
    primaryQuery: 'sperrmüllabholung berlin',
    secondaryQueries: ['sperrmüll abholen lassen berlin', 'möbel abholen lassen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'whatsapp',
    parentHub: 'leistungen',
    requiredOutboundLinks: ['guide:sperrmuell-moebel-entsorgen-berlin', 'angebot-anfragen'],
    requiredInboundContexts: ['leistungen', 'guide:sperrmuell-moebel-entsorgen-berlin'],
    mustNotCompeteWith: [
      'guide:sperrmuell-moebel-entsorgen-berlin',
      'guide:kosten-sperrmuellabholung-berlin',
      'service:kleintransport-moebeltransport-berlin',
    ],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },

  /* ---- Entwürfe. Noindex, aber vollständig klassifiziert, damit beim
     Veröffentlichen keine Kannibalisierung entsteht. ------------------ */
  'dachbodenentruempelung-berlin': {
    pageType: 'service',
    primaryQuery: 'dachboden entrümpeln berlin',
    secondaryQueries: ['dachbodenentrümpelung berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    mustNotCompeteWith: ['service:kellerentruempelung-berlin', 'service:entruempelung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
  },
  'kleintransport-moebeltransport-berlin': {
    pageType: 'service',
    primaryQuery: 'möbeltransport berlin',
    secondaryQueries: ['kleintransport berlin', 'einzelnes möbelstück transportieren berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'whatsapp',
    parentHub: 'leistungen',
    mustNotCompeteWith: ['service:umzug-berlin', 'service:sperrmuellabholung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
  },
  'besenreine-wohnungsuebergabe': {
    pageType: 'service',
    primaryQuery: 'besenreine übergabe berlin',
    secondaryQueries: ['wohnung besenrein übergeben'],
    searchIntent: 'commercial',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    mustNotCompeteWith: ['service:wohnungsaufloesung-berlin', 'guide:checkliste-wohnungsuebergabe'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
  },
  'demontage-rueckbau': {
    pageType: 'service',
    primaryQuery: 'möbeldemontage berlin',
    secondaryQueries: ['rückbau berlin', 'küche demontieren lassen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
  },
  'bau-renovierungsabfaelle': {
    pageType: 'service',
    primaryQuery: 'bauschutt entsorgen berlin',
    secondaryQueries: ['renovierungsabfälle entsorgen berlin'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    parentHub: 'leistungen',
    mustNotCompeteWith: ['service:entruempelung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-29',
  },
};

/* ------------------------------------------------------------------ */
/* 2. Ratgeber und Kostenseiten                                        */
/* ------------------------------------------------------------------ */

/**
 * Ratgeber holen Informationssuchen und geben sie an genau EINE passende
 * Leistungsseite weiter. Sie dürfen der Leistung die Suchintention nicht
 * wegnehmen – deshalb steht die zugehörige Leistung immer auch in
 * `mustNotCompeteWith`: Der Guard prüft dort schärfer auf Titel- und
 * Inhaltsnähe.
 */
const GUIDE_SEO: Record<string, Editorial> = {
  'was-kostet-eine-entruempelung-in-berlin': {
    pageType: 'guide',
    primaryQuery: 'was kostet eine entrümpelung in berlin',
    secondaryQueries: ['entrümpelung kosten berlin', 'entrümpelung preis pro qm'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'kosten',
    requiredOutboundLinks: ['service:entruempelung-berlin', 'angebot-anfragen'],
    mustNotCompeteWith: ['service:entruempelung-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'kosten-haushaltsaufloesung-berlin': {
    pageType: 'guide',
    primaryQuery: 'kosten haushaltsauflösung berlin',
    secondaryQueries: ['haushaltsauflösung preis berlin', 'was kostet eine haushaltsauflösung'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'kosten',
    requiredOutboundLinks: ['service:haushaltsaufloesung-berlin', 'angebot-anfragen'],
    mustNotCompeteWith: ['service:haushaltsaufloesung-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'kosten-sperrmuellabholung-berlin': {
    pageType: 'guide',
    primaryQuery: 'sperrmüll kosten berlin',
    secondaryQueries: ['bsr sperrmüll kosten', 'sperrmüll abholung preis berlin'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'kosten',
    requiredOutboundLinks: ['service:sperrmuellabholung-berlin'],
    mustNotCompeteWith: ['service:sperrmuellabholung-berlin', 'guide:sperrmuell-moebel-entsorgen-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'kosten-seniorenumzug-berlin': {
    pageType: 'guide',
    primaryQuery: 'kosten seniorenumzug berlin',
    secondaryQueries: ['seniorenumzug zuschuss', 'umzug pflegekasse zuschuss'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'kosten',
    requiredOutboundLinks: ['service:seniorenumzug-berlin', 'angebot-anfragen'],
    mustNotCompeteWith: ['service:seniorenumzug-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'welche-fotos-fuer-ein-angebot': {
    pageType: 'guide',
    primaryQuery: 'fotos für angebot entrümpelung',
    secondaryQueries: ['welche fotos für kostenvoranschlag räumung'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'complete_project_request',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['angebot-anfragen'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'entruempelung-vorbereiten': {
    pageType: 'guide',
    primaryQuery: 'entrümpelung vorbereiten',
    secondaryQueries: ['checkliste entrümpelung', 'was vor der entrümpelung tun'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:entruempelung-berlin'],
    mustNotCompeteWith: ['service:entruempelung-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'checkliste-wohnungsuebergabe': {
    pageType: 'guide',
    primaryQuery: 'checkliste wohnungsübergabe',
    secondaryQueries: ['wohnungsübergabe was beachten', 'übergabeprotokoll wohnung'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:wohnungsaufloesung-berlin'],
    mustNotCompeteWith: ['service:besenreine-wohnungsuebergabe'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'haushaltsaufloesung-nach-todesfall': {
    pageType: 'guide',
    primaryQuery: 'haushaltsauflösung nach todesfall',
    secondaryQueries: ['wohnung auflösen nach todesfall', 'nachlass reihenfolge fristen'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'callback',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:nachlassaufloesung-berlin', 'ueber-uns'],
    mustNotCompeteWith: ['service:nachlassaufloesung-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'halteverbotszone-berlin-umzug': {
    pageType: 'guide',
    primaryQuery: 'halteverbotszone berlin beantragen',
    secondaryQueries: ['halteverbot umzug berlin kosten', 'haltverbotszone berlin vorlauf'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:umzug-berlin'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'umzugskosten-jobcenter-berlin': {
    pageType: 'guide',
    primaryQuery: 'umzugskosten jobcenter berlin',
    secondaryQueries: ['jobcenter umzug antrag berlin', 'zusicherung umzugskosten jobcenter'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:umzug-berlin', 'angebot-anfragen'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'sperrmuell-moebel-entsorgen-berlin': {
    pageType: 'guide',
    primaryQuery: 'möbel entsorgen berlin',
    secondaryQueries: ['sofa entsorgen berlin', 'matratze entsorgen berlin'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:sperrmuellabholung-berlin'],
    mustNotCompeteWith: ['service:sperrmuellabholung-berlin', 'guide:kosten-sperrmuellabholung-berlin'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  'wohnungsaufloesung-checkliste-pdf': {
    pageType: 'guide',
    primaryQuery: 'wohnungsauflösung checkliste pdf',
    secondaryQueries: ['checkliste wohnungsauflösung kostenlos', 'wohnungsauflösung ablauf checkliste'],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    parentHub: 'ratgeber',
    requiredOutboundLinks: ['service:wohnungsaufloesung-berlin'],
    mustNotCompeteWith: ['service:wohnungsaufloesung-berlin', 'guide:checkliste-wohnungsuebergabe'],
    allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
};

/* ------------------------------------------------------------------ */
/* 3. Statische Seiten                                                 */
/* ------------------------------------------------------------------ */

/**
 * Diese vierzehn Seiten haben keinen Datensatz in src/data/. Ihre
 * Metadaten stehen deshalb HIER – und die zugehörigen .astro-Dateien lesen
 * sie von hier, statt sie im Frontmatter noch einmal zu schreiben.
 */
interface StaticPage extends Editorial {
  id: string;
  url: string;
  title: string;
  h1: string;
  metaDescription: string;
  status: PublishStatus;
  /** false für Bestätigungsseite und 404 – gebaut, aber nie indexiert. */
  indexable: boolean;
  /** false = gehört nicht in die Sitemap, obwohl indexierbar. */
  inSitemap?: boolean;
}

const STATIC_PAGES: StaticPage[] = [
  {
    id: 'home',
    url: '/',
    title: 'Wohnungsauflösung & Seniorenumzug Berlin | Schnellhelfer24',
    h1: 'Wohnungsauflösung, Nachlass und Seniorenumzug in Berlin',
    metaDescription:
      'Komplette Wohnungsauflösungen, Nachlässe und Seniorenumzüge in Berlin und im Umland – von der Sichtung bis zur besenreinen Übergabe, persönlich koordiniert.',
    status: 'published',
    indexable: true,
    pageType: 'home',
    // Die Startseite nimmt bewusst KEINE der vier Geldsuchanfragen. Sie
    // würde sie den Leistungsseiten wegnehmen, auf die die interne
    // Autorität gerade gelenkt wird. Sie holt die Marke und die
    // Kombinationssuche.
    primaryQuery: 'schnellhelfer24',
    secondaryQueries: [
      'entrümpelung und wohnungsauflösung berlin',
      'räumungsfirma berlin komplettservice',
      'wohnungsauflösung seniorenumzug berlin',
    ],
    searchIntent: 'navigational',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 5,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: [
      'service:wohnungsaufloesung-berlin',
      'service:nachlassaufloesung-berlin',
      'service:seniorenumzug-berlin',
      'hausverwaltungen',
      'ueber-uns',
      'angebot-anfragen',
    ],
    mustNotCompeteWith: [
      'service:wohnungsaufloesung-berlin',
      'service:entruempelung-berlin',
      'service:haushaltsaufloesung-berlin',
      'service:nachlassaufloesung-berlin',
    ],
    allowedSchemaTypes: ['Organization', 'LocalBusiness', 'WebSite', 'WebPage', 'FAQPage'],
    // Kein `imageTheme`: Der Hero der Startseite ist bewusst rein
    // typografisch. Ein Foto dort würde die Gestaltung verändern, die als
    // Referenz für alle Unterseiten dient. Das Vorschaubild für soziale
    // Netzwerke gibt es trotzdem.
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'leistungen',
    url: '/leistungen/',
    title: 'Leistungen: Entrümpelung, Auflösung und Umzug in Berlin',
    h1: 'Leistungen',
    metaDescription:
      'Alle Leistungen im Überblick: Entrümpelung, Haushalts- und Wohnungsauflösung, Nachlass, Keller, Büro, Sperrmüll, Umzug und Seniorenumzug in Berlin.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'räumung und umzug leistungen berlin',
    secondaryQueries: ['entrümpelungsfirma leistungen berlin'],
    searchIntent: 'commercial',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: [
      'service:wohnungsaufloesung-berlin',
      'service:entruempelung-berlin',
      'service:haushaltsaufloesung-berlin',
      'service:nachlassaufloesung-berlin',
    ],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ItemList'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  {
    id: 'kosten',
    url: '/kosten/',
    title: 'Kosten und Ablauf: Was eine Räumung in Berlin bestimmt',
    h1: 'Kosten und Ablauf',
    metaDescription:
      'Wie sich Preise für Entrümpelung, Haushaltsauflösung und Umzug in Berlin zusammensetzen, welche Faktoren wirken und woran Sie ein unseriöses Angebot erkennen.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'räumung kosten berlin',
    secondaryQueries: ['kostenvoranschlag entrümpelung berlin', 'preise räumung berlin'],
    searchIntent: 'commercial',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: [
      'guide:was-kostet-eine-entruempelung-in-berlin',
      'guide:kosten-haushaltsaufloesung-berlin',
      'angebot-anfragen',
    ],
    mustNotCompeteWith: ['guide:was-kostet-eine-entruempelung-in-berlin'],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'berlin',
    url: '/berlin/',
    title: 'Einsatzgebiet Berlin: alle zwölf Bezirke | Schnellhelfer24',
    h1: 'Einsatzgebiet Berlin',
    metaDescription:
      'Entrümpelung, Auflösung und Umzug in allen zwölf Berliner Bezirken. Was Altbau, Plattenbau, Hinterhof und Parksituation für den Aufwand bedeuten.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'entrümpelung berlin bezirke',
    secondaryQueries: ['einsatzgebiet räumung berlin'],
    searchIntent: 'local',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: ['service:entruempelung-berlin'],
    mustNotCompeteWith: ['service:entruempelung-berlin'],
    // FAQPage ist zulässig: Der Gebiets-Hub zeigt echte, sichtbare Fragen.
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ItemList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'brandenburg',
    url: '/brandenburg/',
    title: 'Einsatzgebiet Berliner Umland | Schnellhelfer24',
    h1: 'Einsatzgebiet Berliner Umland',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug im Berliner Umland: Potsdam, Falkensee und weitere Orte in Brandenburg. Was bei Häusern mit Grundstück zu beachten ist.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'entrümpelung berliner umland',
    secondaryQueries: ['haushaltsauflösung brandenburg', 'räumung umland berlin'],
    searchIntent: 'local',
    targetRegion: ['Berliner Umland', 'Brandenburg'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: ['service:haushaltsaufloesung-berlin'],
    mustNotCompeteWith: ['berlin'],
    // FAQPage ist zulässig: Der Umland-Hub zeigt echte, sichtbare Fragen.
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ItemList', 'FAQPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  {
    id: 'ratgeber',
    url: '/ratgeber/',
    title: 'Ratgeber: Räumung, Umzug und Übergabe in Berlin',
    h1: 'Ratgeber',
    metaDescription:
      'Praktische Berlin-Ratgeber zu Entrümpelung, Sperrmüll, Jobcenter-Umzugskosten, Wohnungsauflösung und Übergabe – mit Quellen und kostenloser PDF-Checkliste.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'ratgeber entrümpelung umzug berlin',
    secondaryQueries: [],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    requiredOutboundLinks: ['guide:haushaltsaufloesung-nach-todesfall'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ItemList'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'einsatzberichte',
    url: '/einsatzberichte/',
    title: 'Einsatzberichte aus Berlin | Schnellhelfer24',
    h1: 'Einsatzberichte',
    metaDescription:
      'Anonymisierte Berichte aus abgeschlossenen Räumungen und Umzügen in Berlin: Bezirk, Objektgröße, Etage, Dauer, enthaltene Leistungen und Art der Übergabe.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'einsatzberichte entrümpelung berlin',
    secondaryQueries: ['referenzen räumung berlin', 'entrümpelung beispiele berlin'],
    searchIntent: 'commercial',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: ['angebot-anfragen'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ItemList'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  {
    id: 'hausverwaltungen',
    url: '/hausverwaltungen-immobilienpartner/',
    title: 'Räumungen für Hausverwaltungen und Eigentümer in Berlin',
    h1: 'Ein Räumungspartner, der die Übergabe zu Ende bringt',
    metaDescription:
      'Wohnungs- und Hausräumungen für Hausverwaltungen, Eigentümer und Makler in Berlin: feste Ansprechperson, Schlüsselübernahme, Fotoprotokoll, Rechnung ans Unternehmen.',
    status: 'published',
    indexable: true,
    pageType: 'service',
    primaryQuery: 'räumung hausverwaltung berlin',
    secondaryQueries: [
      'entrümpelung für hausverwaltungen berlin',
      'räumungspartner immobilienverwaltung berlin',
      'wohnungsräumung eigentümer berlin',
    ],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 4,
    conversionGoal: 'partner_request',
    requiredOutboundLinks: ['service:wohnungsaufloesung-berlin', 'service:bueroaufloesung-berlin', 'ueber-uns'],
    requiredInboundContexts: ['home', 'service:bueroaufloesung-berlin'],
    mustNotCompeteWith: ['service:wohnungsaufloesung-berlin'],
    allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
    imageTheme: 'Übergabe an Eigentümer oder Verwaltung, professioneller Objekttermin',
    ownOgImage: true,
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'fragen',
    url: '/fragen/',
    title: 'Häufige Fragen zu Räumung, Entsorgung und Umzug',
    h1: 'Häufige Fragen',
    metaDescription:
      'Antworten auf die häufigsten Fragen zu Angebot, Ablauf, Entsorgung, Wertanrechnung, Rechnung und Kostenträgern bei Räumungen und Umzügen in Berlin.',
    status: 'published',
    indexable: true,
    pageType: 'hub',
    primaryQuery: 'häufige fragen entrümpelung berlin',
    secondaryQueries: [],
    searchIntent: 'informational',
    targetRegion: ['Berlin'],
    businessPriority: 2,
    conversionGoal: 'information',
    requiredOutboundLinks: ['angebot-anfragen'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['FAQPage', 'WebPage', 'BreadcrumbList'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-29',
  },
  {
    id: 'ueber-uns',
    url: '/ueber-uns/',
    title: 'Über Schnellhelfer24: wer wir sind und wie wir arbeiten',
    h1: 'Über Schnellhelfer24',
    metaDescription:
      'Schnellhelfer24 räumt, löst auf und zieht um in Berlin und im Umland. Wie wir arbeiten, worauf wir uns nicht einlassen und was Sie von uns erwarten können.',
    status: 'published',
    indexable: true,
    pageType: 'company',
    primaryQuery: 'schnellhelfer24 wer wir sind',
    secondaryQueries: ['entrümpelungsfirma berlin seriös', 'wer steckt hinter schnellhelfer24'],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'callback',
    // Auftrag § 4: Die Über-uns-Seite braucht kontextuelle Eingänge
    // AUSSERHALB der globalen Navigation. Der Linkgraph-Guard prüft das.
    requiredInboundContexts: [
      'home',
      'kontakt',
      'service:nachlassaufloesung-berlin',
      'service:seniorenumzug-berlin',
      'hausverwaltungen',
    ],
    requiredOutboundLinks: ['angebot-anfragen', 'kontakt'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['AboutPage', 'WebPage', 'BreadcrumbList', 'Organization'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'kontakt',
    url: '/kontakt/',
    title: 'Kontakt: Schnellhelfer24 in Berlin erreichen',
    h1: 'Kontakt',
    metaDescription:
      'So erreichen Sie Schnellhelfer24: Telefon, WhatsApp, E-Mail und Anfrageformular. Was wir für eine schnelle Einschätzung von Ihnen brauchen.',
    status: 'published',
    indexable: true,
    pageType: 'contact',
    primaryQuery: 'schnellhelfer24 kontakt',
    secondaryQueries: ['entrümpelung berlin telefonnummer'],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 3,
    conversionGoal: 'phone_call',
    requiredOutboundLinks: ['angebot-anfragen', 'ueber-uns'],
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['ContactPage', 'WebPage', 'BreadcrumbList'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'angebot-anfragen',
    url: '/angebot-anfragen/',
    title: 'Kostenlose Einschätzung anfordern | Schnellhelfer24',
    h1: 'Kostenlose Einschätzung anfordern',
    metaDescription:
      'Aufwand-Check: Leistung, Ort, Umfang, Etage und Zeitraum angeben, Fotos anhängen. Sie erhalten eine persönliche Einschätzung, kostenlos und unverbindlich.',
    status: 'published',
    indexable: true,
    pageType: 'contact',
    primaryQuery: 'angebot entrümpelung anfordern berlin',
    secondaryQueries: ['kostenvoranschlag räumung berlin anfordern'],
    searchIntent: 'transactional',
    targetRegion: ['Berlin', 'Berliner Umland'],
    businessPriority: 4,
    conversionGoal: 'complete_project_request',
    requiredOutboundLinks: [],
    mustNotCompeteWith: ['kosten'],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'ContactPage'],
    lastEditorialReview: '2026-07-31',
    lastmod: '2026-07-30',
  },
  {
    id: 'impressum',
    url: '/impressum/',
    title: 'Impressum | Schnellhelfer24',
    h1: 'Impressum',
    metaDescription:
      'Anbieterkennzeichnung von Schnellhelfer24: Firmierung, Anschrift, Kontaktdaten und Registerangaben für Entrümpelung und Umzug in Berlin.',
    status: 'published',
    indexable: true,
    pageType: 'legal',
    primaryQuery: 'schnellhelfer24 impressum',
    secondaryQueries: [],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 1,
    conversionGoal: 'information',
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-30',
  },
  {
    id: 'datenschutz',
    url: '/datenschutz/',
    title: 'Datenschutzerklärung | Schnellhelfer24',
    h1: 'Datenschutzerklärung',
    metaDescription:
      'Wie Schnellhelfer24 mit personenbezogenen Daten und mit Fotos aus Anfragen umgeht.',
    status: 'published',
    indexable: true,
    pageType: 'legal',
    primaryQuery: 'schnellhelfer24 datenschutz',
    secondaryQueries: [],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 1,
    conversionGoal: 'information',
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList'],
    lastmod: '2026-07-30',
  },

  /* --- Gebaut, aber nie indexiert. Stehen hier, damit die Guards sie
     kennen und nicht als "unbekannte Seite" melden. ------------------- */
  {
    id: 'anfrage-erhalten',
    url: '/anfrage-erhalten/',
    title: 'Ihre Anfrage ist angekommen | Schnellhelfer24',
    h1: 'Ihre Anfrage ist angekommen',
    metaDescription: 'Bestätigung Ihrer Anfrage bei Schnellhelfer24 und die nächsten Schritte.',
    status: 'published',
    indexable: false,
    inSitemap: false,
    pageType: 'contact',
    primaryQuery: '',
    secondaryQueries: [],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 1,
    conversionGoal: 'information',
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage'],
    lastmod: '2026-07-30',
  },
  {
    id: 'bewerten',
    url: '/bewerten/',
    title: 'Bewertung schreiben | Schnellhelfer24',
    h1: 'Danke, dass Sie sich die Minute nehmen',
    metaDescription:
      'Direkter Weg zur Bewertung von Schnellhelfer24 bei Google. Dauert etwa eine Minute.',
    status: 'published',
    // Bewusst noindex: Die Seite ist ein Werkzeug für den Betrieb – eine
    // kurze, aussprechbare Adresse für Rechnungen, Karten und QR-Codes.
    // Sie hat keinen Suchwert und soll keinen bekommen.
    indexable: false,
    inSitemap: false,
    pageType: 'company',
    primaryQuery: '',
    secondaryQueries: [],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 1,
    conversionGoal: 'information',
    mustNotCompeteWith: [],
    allowedSchemaTypes: ['WebPage'],
    lastmod: '2026-08-06',
  },
  {
    id: '404',
    url: '/404/',
    title: 'Seite nicht gefunden | Schnellhelfer24',
    h1: 'Diese Seite gibt es nicht',
    metaDescription: 'Diese Seite existiert nicht oder wurde verschoben.',
    status: 'published',
    indexable: false,
    inSitemap: false,
    pageType: 'legal',
    primaryQuery: '',
    secondaryQueries: [],
    searchIntent: 'navigational',
    targetRegion: ['Berlin'],
    businessPriority: 1,
    conversionGoal: 'information',
    mustNotCompeteWith: [],
    allowedSchemaTypes: [],
    lastmod: '2026-07-30',
  },
];

/* ------------------------------------------------------------------ */
/* Zusammenbau                                                         */
/* ------------------------------------------------------------------ */

function fill(base: Editorial): EditorialComplete {
  return {
    ...base,
    secondaryQueries: base.secondaryQueries ?? [],
    relatedPages: base.relatedPages ?? [],
    requiredInboundContexts: base.requiredInboundContexts ?? [],
    requiredOutboundLinks: base.requiredOutboundLinks ?? [],
    mustNotCompeteWith: base.mustNotCompeteWith ?? [],
  };
}

const pages: SeoPage[] = [];

/* Statische Seiten */
for (const p of STATIC_PAGES) {
  const e = fill(p);
  pages.push({
    id: p.id,
    url: p.url,
    status: p.status,
    indexable: p.indexable,
    title: p.title,
    h1: p.h1,
    metaDescription: p.metaDescription,
    canonicalUrl: `${SITE}${p.url}`,
    ...e,
  });
}

/* Leistungen – Metadaten aus services.ts */
for (const s of services) {
  const editorial = SERVICE_SEO[s.slug];
  if (!editorial) {
    // Laut scheitern statt still übergehen: Eine Leistung ohne SEO-Definition
    // würde sonst unbemerkt ohne Suchintention und ohne Priorität live gehen.
    throw new Error(
      `Leistung "${s.slug}" fehlt in SERVICE_SEO (src/data/seo-pages.ts). ` +
        'Jede Seite braucht eine primäre Suchanfrage und eine wirtschaftliche Priorität.',
    );
  }
  const url = `/leistungen/${s.slug}/`;
  pages.push({
    id: `service:${s.slug}`,
    url,
    status: s.status,
    indexable: serviceIsIndexable(s),
    title: s.metaTitle,
    h1: s.h1,
    metaDescription: s.metaDescription,
    canonicalUrl: `${SITE}${url}`,
    ...fill(editorial),
  });
}

/* Ratgeber und Kostenseiten – Metadaten aus guides.ts */
for (const g of guides) {
  const editorial = GUIDE_SEO[g.slug];
  if (!editorial) {
    throw new Error(
      `Ratgeber "${g.slug}" fehlt in GUIDE_SEO (src/data/seo-pages.ts). ` +
        'Ohne Eintrag ist nicht festgelegt, welche Leistungsseite er stärken soll.',
    );
  }
  const url = `/${g.hub}/${g.slug}/`;
  pages.push({
    id: `guide:${g.slug}`,
    url,
    status: g.status,
    indexable: guideIsIndexable(g),
    title: g.metaTitle,
    h1: g.h1,
    metaDescription: g.metaDescription,
    canonicalUrl: `${SITE}${url}`,
    ...fill(editorial),
  });
}

/**
 * Standortseiten werden abgeleitet, nicht einzeln gepflegt.
 *
 * Das ist hier KEIN Ortstausch-Template: Der Inhalt jeder Seite ist
 * eigenständig geschrieben und wird vom Publish Guard und von der
 * Ähnlichkeitsprüfung dagegen abgesichert. Abgeleitet wird nur die
 * Suchanfrage – und die lautet bei einer Bezirksseite nun einmal
 * tatsächlich "entrümpelung <bezirk>".
 */
function locationEditorial(name: string, region: string[], hub: string): Editorial {
  const lower = name.toLocaleLowerCase('de-DE');
  return {
    pageType: 'location',
    primaryQuery: `entrümpelung ${lower}`,
    secondaryQueries: [
      `wohnungsauflösung ${lower}`,
      `haushaltsauflösung ${lower}`,
      `umzug ${lower}`,
    ],
    searchIntent: 'local',
    targetRegion: region,
    businessPriority: 3,
    conversionGoal: 'complete_project_request',
    parentHub: hub,
    // Standortseiten führen auf die stärkste dort nachgefragte Leistung
    // und zurück auf den Gebiets-Hub – mehr nicht. Auftrag § 4.
    requiredOutboundLinks: [hub, 'angebot-anfragen'],
    mustNotCompeteWith: [hub],
    allowedSchemaTypes: ['WebPage', 'BreadcrumbList', 'FAQPage'],
    lastmod: '2026-07-30',
  };
}

for (const d of districts) {
  const url = `/berlin/${d.slug}/`;
  pages.push({
    id: `district:${d.slug}`,
    url,
    status: d.status,
    indexable: locationIsIndexable(d),
    title: d.metaTitle,
    h1: d.h1,
    metaDescription: d.metaDescription,
    canonicalUrl: `${SITE}${url}`,
    ...fill(locationEditorial(d.name, ['Berlin'], 'berlin')),
    lastmod: d.updated,
  });
}

for (const t of towns) {
  const url = `/brandenburg/${t.slug}/`;
  pages.push({
    id: `town:${t.slug}`,
    url,
    status: t.status,
    indexable: locationIsIndexable(t),
    title: t.metaTitle,
    h1: t.h1,
    metaDescription: t.metaDescription,
    canonicalUrl: `${SITE}${url}`,
    ...fill(locationEditorial(t.name, ['Berliner Umland', 'Brandenburg'], 'brandenburg')),
    lastmod: t.updated,
  });
}

for (const c of cases) {
  const url = `/einsatzberichte/${c.slug}/`;
  pages.push({
    id: `case:${c.slug}`,
    url,
    status: c.status,
    indexable: caseIsIndexable(c),
    title: c.metaTitle,
    h1: c.title,
    metaDescription: c.metaDescription,
    canonicalUrl: `${SITE}${url}`,
    ...fill({
      pageType: 'case-study',
      // Einsatzberichte holen keine eigene Suchanfrage. Sie belegen die
      // Leistungsseite, auf die sie verweisen.
      primaryQuery: '',
      secondaryQueries: [],
      searchIntent: 'commercial',
      targetRegion: ['Berlin'],
      businessPriority: 3,
      conversionGoal: 'complete_project_request',
      parentHub: 'einsatzberichte',
      requiredOutboundLinks: [`service:${c.serviceSlug}`],
      mustNotCompeteWith: [],
      allowedSchemaTypes: ['Article', 'WebPage', 'BreadcrumbList'],
      lastmod: c.updated,
    }),
  });
}

export const seoPages: SeoPage[] = pages;

/* ------------------------------------------------------------------ */
/* Zugriff                                                             */
/* ------------------------------------------------------------------ */

const byId = new Map(seoPages.map((p) => [p.id, p]));
const byUrl = new Map(seoPages.map((p) => [p.url, p]));

export function seoPage(id: string): SeoPage {
  const page = byId.get(id);
  // Absichtlich ein Absturz und kein undefined: Ein Tippfehler in einer
  // Link-ID soll beim Build auffallen, nicht als fehlender Link im Markup
  // durchrutschen.
  if (!page) throw new Error(`Unbekannte SEO-Seiten-ID: "${id}"`);
  return page;
}

export function seoPageByUrl(url: string): SeoPage | undefined {
  return byUrl.get(url);
}

/** Nur die Seiten, die tatsächlich indexiert werden dürfen. */
export const indexableSeoPages = seoPages.filter((p) => p.indexable);

/** Seiten, die in die XML-Sitemap gehören. */
export const sitemapSeoPages = seoPages.filter(
  (p) => p.indexable && (STATIC_PAGES.find((s) => s.id === p.id)?.inSitemap ?? true),
);

/** Nach wirtschaftlicher Priorität, stärkste zuerst. */
export function byPriority(min: BusinessPriority = 1): SeoPage[] {
  return indexableSeoPages
    .filter((p) => p.businessPriority >= min)
    .sort((a, b) => b.businessPriority - a.businessPriority);
}

/**
 * Alle indexierbaren URLs – Grundlage für Sitemap und IndexNow.
 *
 * Stand früher in src/lib/publishGuard.ts, mit einer von Hand gepflegten
 * Liste der statischen Seiten daneben. Jetzt fällt sie aus der Karte ab:
 * Eine neue Seite eintragen genügt, Sitemap und IndexNow folgen.
 */
export function indexableUrls(): { url: string; lastmod: string }[] {
  return sitemapSeoPages.map((p) => ({ url: p.url, lastmod: p.lastmod }));
}

/**
 * Kleinaufträge.
 *
 * Auftrag § 2: „Kleine Einzelabholungen sollen weiterhin auffindbar sein,
 * dürfen aber nicht mehr interne Autorität erhalten als komplette
 * Räumungen, Nachlassauflösungen oder Seniorenumzüge."
 *
 * Diese Seiten bleiben also im Index und in der Navigation – sie dürfen nur
 * nicht stärker verlinkt sein als die Seiten in `mustOutrankSmallJobs`.
 * Der Linkgraph prüft genau das.
 */
export const smallJobPages = [
  'service:sperrmuellabholung-berlin',
  'service:kleintransport-moebeltransport-berlin',
  'service:dachbodenentruempelung-berlin',
] as const;

/** Seiten, die jeder Kleinauftrag im Authority-Score unterschreiten muss. */
export const mustOutrankSmallJobs = [
  'service:wohnungsaufloesung-berlin',
  'service:entruempelung-berlin',
  'service:haushaltsaufloesung-berlin',
  'service:nachlassaufloesung-berlin',
  'service:seniorenumzug-berlin',
] as const;

/** Die vier Seiten, auf die die interne Autorität gelenkt wird. */
export const moneyPages = [
  'service:wohnungsaufloesung-berlin',
  'service:entruempelung-berlin',
  'service:haushaltsaufloesung-berlin',
  'service:nachlassaufloesung-berlin',
] as const;
