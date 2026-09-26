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

/**
 * Leistungsfamilie – die Ebene über den einzelnen Leistungen.
 *
 * WARUM ES DIESEN TYP GIBT:
 * Die Gruppierung existierte bereits, stand aber fest verdrahtet in
 * `src/pages/leistungen/index.astro`. Damit hatte sie kein Datenmodell,
 * keine URL, kein Schema und keinen Breadcrumb – und liesse sich nicht
 * prüfen. Eine zweite Leistungsfamilie (Innenausbau) braucht genau das.
 *
 * ZWEI ARTEN VON KATEGORIEN, unterschieden durch `hub`:
 *   hub: false  reine Gruppierung auf /leistungen/. Keine eigene Seite.
 *               Das ist der richtige Zustand für eine Familie, die keine
 *               eigenständige Suchintention bedient.
 *   hub: true   eigene Hub-Seite. Muss dann inhaltlich tragen – der
 *               Publish Guard verlangt dieselbe Tiefe wie bei einer
 *               Standortseite, damit keine dünne Kachelwand entsteht.
 *
 * Eine Kategorie ohne eigene Suchintention bekommt KEINE Hub-Seite.
 * Das ist die Indexierbarkeitsregel dieser Ebene.
 */
export interface ServiceCategory {
  slug: string;
  status: PublishStatus;
  /** Eigene Hub-Seite unter /<slug>/ – oder nur Gruppierung auf /leistungen/? */
  hub: boolean;
  /** Kurzform für Navigation und Breadcrumb */
  name: string;
  /** Überschrift der Gruppe auf /leistungen/ */
  title: string;
  /** Ein Satz, der erklärt, wofür die Gruppe da ist */
  teaser: string;
  /**
   * Slugs der zugehörigen Leistungen, redaktionell gesetzt.
   * Die Reihenfolge INNERHALB der Gruppe bestimmt die wirtschaftliche
   * Priorität aus der Seitenkarte, nicht diese Liste.
   */
  services: string[];

  /* ------ Nur für hub: true. Ohne diese Felder bleibt die Seite Entwurf. ---- */

  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Direkte Antwort unter der H1 (40–100 Wörter), zitierfähig */
  answer?: string;
  /** Eigene Einleitung, mindestens zwei Absätze */
  intro?: string[];
  blocks?: ContentBlock[];
  faq?: FaqItem[];
  /** Was diese Familie von den anderen unterscheidet (Redaktionsnotiz) */
  differentiator?: string;

  updated: string;
}

export interface Service {
  slug: string;
  status: PublishStatus;
  /**
   * Slug der Leistungsfamilie aus `categories.ts`.
   *
   * Optional, damit die fünfzehn bestehenden Leistungen unverändert gültig
   * bleiben. `validateCategories()` prüft, dass jede veröffentlichte
   * Leistung genau einer Familie zugeordnet ist – die Zuordnung steht auf
   * der Kategorieseite in `services`, nicht hier, damit die Reihenfolge
   * innerhalb einer Familie redaktionell bleibt.
   */
  category?: string;
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
  /** Belegbare Primärquellen für rechtliche, behördliche oder technische Aussagen. */
  sources?: {
    label: string;
    url: string;
    publisher: string;
    checked: string;
  }[];
  /** Optionaler, lokal gehosteter Download zum Ratgeber. */
  download?: {
    href: string;
    label: string;
    description: string;
  };
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
