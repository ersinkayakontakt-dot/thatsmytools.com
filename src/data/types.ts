/**
 * Content-Modell
 * ==============
 * Alle Inhaltstypen sind hier zentral typisiert. Neue Leistungen, Bezirke,
 * Ratgeber und Einsatzberichte entstehen durch Ergänzen der Datendateien –
 * nicht durch Duplizieren von Seiten.
 *
 * `status` steuert den Publish Guard:
 *   'published' -> indexierbar, in Sitemap, intern verlinkt
 *   'draft'     -> baut als Seite, aber noindex, nicht in der Sitemap,
 *                  nicht in Übersichten verlinkt
 */

export type PublishStatus = 'published' | 'draft';

export interface FaqItem {
  /** Frage in der Sprache der Kundschaft, nicht in Keyword-Sprache. */
  q: string;
  /** Kurze, eigenständig zitierbare Antwort (ca. 40–100 Wörter). */
  a: string;
}

export interface ContentBlock {
  /** Konkrete Zwischenüberschrift, idealerweise als Frage. */
  h: string;
  /** Absätze. Erlaubt einfaches Inline-Markup: **fett**, [text](/url) */
  p?: string[];
  /** Aufzählung */
  list?: string[];
  /** Nummerierte Schritte */
  steps?: { title: string; text: string }[];
  /** Tabelle für AEO-freundliche, extrahierbare Fakten */
  table?: { caption?: string; head: string[]; rows: string[][] };
  /** Hervorgehobener Hinweiskasten */
  note?: { title: string; text: string; tone?: 'info' | 'caution' };
}

export interface PriceFactor {
  name: string;
  effect: string;
  /** Warum das den Preis beeinflusst – konkret, nicht werblich. */
  why: string;
}

export interface Service {
  slug: string;
  status: PublishStatus;
  /** H1 der Seite */
  h1: string;
  /** Kurzer Name für Navigation, Kacheln, Breadcrumbs */
  navLabel: string;
  /** <title> – max. ca. 60 Zeichen */
  metaTitle: string;
  metaDescription: string;
  /**
   * Direkte Antwort unter der H1 (40–100 Wörter).
   * Wird für AEO/GEO ausgezeichnet und ist der wichtigste Absatz der Seite.
   */
  answer: string;
  /** Ein Satz für Kacheln und Übersichten */
  teaser: string;
  /** Icon-Schlüssel, siehe components/Icon.astro */
  icon: string;
  /** Kundensituationen, die zu dieser Leistung führen */
  situations: string[];
  /** Was im Auftrag enthalten ist */
  includes: string[];
  /** Was ausdrücklich nicht enthalten ist – schafft Vertrauen */
  notIncluded?: string[];
  /** Frei aufgebaute Inhaltsblöcke */
  blocks: ContentBlock[];
  /** Preisfaktoren speziell für diese Leistung */
  priceFactors: PriceFactor[];
  faq: FaqItem[];
  /** slugs verwandter Leistungen */
  related: string[];
  /** slugs passender Ratgeber/Kostenseiten */
  guides?: string[];
  /** serviceType für schema.org/Service */
  serviceType: string;
  updated: string;
}

export interface District {
  slug: string;
  status: PublishStatus;
  name: string;
  /** z. B. "Berlin-Mitte" für Fließtext */
  fullName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answer: string;
  /** Ortsteile – echte Verwaltungsgliederung */
  quarters: string[];
  /** Eigene Einleitung. Ohne diese wird die Seite nicht veröffentlicht. */
  intro: string[];
  /** Typische Gebäude- und Wohnsituationen im Bezirk */
  buildings: string[];
  /** Zufahrt, Parken, Halteverbot, Etagen */
  access: string[];
  /** Individuelle Blöcke */
  blocks?: ContentBlock[];
  /** slugs von Einsatzberichten aus diesem Bezirk */
  cases: string[];
  /** Leistungen, die hier besonders nachgefragt werden */
  focusServices: string[];
  faq: FaqItem[];
  /** Was diese Seite von anderen Bezirksseiten unterscheidet (Redaktionsnotiz) */
  differentiator: string;
  updated: string;
}

export interface Town {
  slug: string;
  status: PublishStatus;
  name: string;
  /** Landkreis */
  county: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answer: string;
  intro: string[];
  quarters: string[];
  buildings: string[];
  access: string[];
  blocks?: ContentBlock[];
  cases: string[];
  focusServices: string[];
  faq: FaqItem[];
  differentiator: string;
  updated: string;
}

export interface CaseStudy {
  slug: string;
  status: PublishStatus;
  /**
   * true = echter, freigegebener Einsatz.
   * false = Muster zur Struktur-Demonstration. Muster sind IMMER 'draft'
   *         und tragen einen sichtbaren Hinweis.
   */
  real: boolean;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Bezirks- oder Ortsslug */
  location: string;
  locationLabel: string;
  serviceSlug: string;
  /** Kurzfassung für Listen */
  summary: string;
  /** Strukturierte Einsatzdaten */
  facts: {
    objectType: string;
    size: string;
    floor: string;
    elevator: string;
    duration: string;
    crew: string;
    volume: string;
    handover: string;
    price: string;
  };
  /** Ausgangslage */
  situation: string[];
  /** Vorgehen */
  approach: { title: string; text: string }[];
  /** Ergebnis */
  result: string[];
  /** Was daraus für ähnliche Fälle folgt */
  learning: string;
  images?: { src: string; alt: string; caption: string; todo?: string }[];
  date: string;
  updated: string;
}

export interface Guide {
  slug: string;
  status: PublishStatus;
  /** 'kosten' -> unter /kosten/, 'ratgeber' -> unter /ratgeber/ */
  hub: 'kosten' | 'ratgeber';
  h1: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  answer: string;
  teaser: string;
  blocks: ContentBlock[];
  faq: FaqItem[];
  related: string[];
  services: string[];
  published: string;
  updated: string;
}

export interface Review {
  /** Nur echte, überprüfbare Bewertungen. */
  author: string;
  rating: number;
  text: string;
  /** Plattform, auf der die Bewertung öffentlich einsehbar ist */
  source: string;
  sourceUrl: string;
  date: string;
  /** Bezug zur Leistung */
  serviceSlug?: string;
}
