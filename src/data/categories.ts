import type { ServiceCategory } from './types.ts';
import { services } from './services.ts';

/**
 * LEISTUNGSFAMILIEN
 * =================
 * Die Ebene zwischen „alle Leistungen" und der einzelnen Leistung.
 *
 * HERKUNFT: Diese Gruppierung gab es schon – sie stand fest verdrahtet als
 * `groups`-Konstante in `src/pages/leistungen/index.astro`. Dort war sie
 * unsichtbar für jede Prüfung, hatte kein Schema und keinen Breadcrumb.
 * Hier ist sie jetzt Daten und damit prüfbar, verlinkbar und erweiterbar.
 *
 * WAS SICH DADURCH NICHT ÄNDERT: Die drei bestehenden Familien behalten
 * Titel, Text und Reihenfolge exakt. Die Übersichtsseite sieht aus wie
 * vorher. Das ist Absicht – diese Änderung soll die Struktur öffnen, nicht
 * das Aussehen verändern.
 *
 * KEINE EIGENE SEITE JE FAMILIE. Eine Familie bekommt nur dann eine
 * Hub-Seite (`hub: true`), wenn sie eine eigenständige Suchintention
 * bedient. „Räumen und auflösen" bedient keine – wer das sucht, sucht
 * „Entrümpelung" oder „Haushaltsauflösung", und dafür gibt es bereits
 * starke Leistungsseiten. Eine Hub-Seite dazwischen würde mit ihnen
 * konkurrieren; `npm run seo:cannibalization` würde das zu Recht melden.
 */

export const categories: ServiceCategory[] = [
  /* ================================================================== */
  {
    slug: 'raeumen',
    status: 'published',
    hub: false,
    name: 'Räumen und auflösen',
    title: 'Räumen und auflösen',
    teaser: 'Von einem einzelnen Kellerabteil bis zur kompletten Auflösung eines Haushalts.',
    services: [
      'entruempelung-berlin',
      'haushaltsaufloesung-berlin',
      'wohnungsaufloesung-berlin',
      'nachlassaufloesung-berlin',
      'messiwohnung-raeumen',
      'kellerentruempelung-berlin',
    ],
    updated: '2026-09-26',
  },

  /* ================================================================== */
  {
    slug: 'transport',
    status: 'published',
    hub: false,
    name: 'Transportieren und entsorgen',
    title: 'Transportieren und entsorgen',
    teaser:
      'Einzelne Stücke oder ganze Haushalte bewegen, getrennt entsorgen, sicher übergeben.',
    services: ['umzug-berlin', 'seniorenumzug-berlin', 'sperrmuellabholung-berlin'],
    updated: '2026-09-26',
  },

  /* ================================================================== */
  {
    slug: 'gewerbe',
    status: 'published',
    hub: false,
    name: 'Für Betriebe und Verwaltungen',
    title: 'Für Betriebe und Verwaltungen',
    teaser: 'Gewerbeflächen räumen, Akten gesondert behandeln, termingerecht übergeben.',
    services: ['bueroaufloesung-berlin'],
    updated: '2026-09-26',
  },

  /* ================================================================== */
  /*
   * INNENAUSBAU – Entwurf, bewusst leer. Recherchiert am 26.09.2026.
   *
   * RECHTLICHER RAHMEN, belegt in docs/HANDWERKSRECHT.md:
   * Ohne Eintragung in die Handwerksrolle zulässig sind Trockenbau
   * (Grenze: kein Putz), Bodenlegen einschließlich Laminat und Vinyl
   * (Anlage B2 Nr. 3, Verzeichniseintragung nötig), Montage genormter
   * Bauteile (B2 Nr. 24) und einfache Tätigkeiten nach § 1 Abs. 2 S. 2
   * HwO. NICHT zulässig sind Malern, Fliesen, Parkett, Estrich,
   * Tischlerarbeiten, Stuckateur, Raumausstatter und Rollläden.
   *
   * Der Betreiber hat am 26.09.2026 EIGENAUSFÜHRUNG ohne Nachunternehmer
   * festgelegt. Das schließt die Anlage-A-Gewerke aus, solange keine
   * Eintragung besteht – Koordination wäre frei gewesen, Eigenausführung
   * ist es nicht.
   *
   * ACHTUNG, DIE FALLE LIEGT IN DER BÜNDELUNG: § 1 Abs. 2 S. 3 HwO lässt
   * mehrere einfache Tätigkeiten nur zu, solange die Gesamtbetrachtung
   * sie nicht einem zulassungspflichtigen Handwerk zuordnet. Jede
   * Einzelleistung kann erlaubt sein und eine Seite, die sie zu
   * „Komplettrenovierung" bündelt, trotzdem unzulässig. Das Bündeln
   * passiert genau hier, in der Kategorie-Ebene.
   *
   * OFFEN:
   *   1. Schriftliche Auskunft der HWK Berlin zum konkreten Zuschnitt.
   *      Vier ungeklärte Punkte, Fragenliste in docs/HANDWERKSRECHT.md.
   *   2. Ob die Familie eine Hub-Seite verdient. Die Recherche sagt für
   *      Stufe 1 NEIN: „innenausbau berlin" gehört dem Objektgeschäft,
   *      nicht dem Wohnungsmarkt. Wiedervorlage erst bei drei
   *      veröffentlichten Leistungen plus Nachfragebeleg.
   *   3. Der Name. Empfohlen ist `herrichten` statt `innenausbau` –
   *      passt zur Verb-Systematik der anderen Familien und behauptet
   *      kein Gewerk.
   *
   * Solange `services` leer ist, erscheint die Familie nirgends – weder
   * auf /leistungen/ noch in der Navigation. Der Publish Guard verhindert
   * zusätzlich, dass sie versehentlich veröffentlicht wird.
   */
  {
    slug: 'innenausbau',
    status: 'draft',
    hub: true,
    name: 'Innenausbau',
    title: 'Innenausbau und Renovierung',
    teaser: 'Räume herrichten, statt sie nur zu leeren.',
    services: [],
    updated: '2026-09-26',
  },
];

/* ------------------------------------------------------------------ */
/* Abfragen                                                            */
/* ------------------------------------------------------------------ */

export const publishedCategories = categories.filter((c) => c.status === 'published');

/** Familien mit eigener Hub-Seite. Grundlage für getStaticPaths. */
export const hubCategories = categories.filter((c) => c.hub);

export function getCategory(slug: string): ServiceCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Die Familie, zu der eine Leistung gehört. `undefined`, wenn keine. */
export function categoryOfService(serviceSlug: string): ServiceCategory | undefined {
  return categories.find((c) => c.services.includes(serviceSlug));
}

/* ------------------------------------------------------------------ */
/* Prüfung                                                             */
/* ------------------------------------------------------------------ */

/**
 * Slugs, die von statischen Seiten belegt sind.
 *
 * Eine Hub-Seite liegt unter `/<slug>/` auf oberster Ebene. Astro gibt
 * statischen Routen Vorrang vor dynamischen, eine Kollision fiele also
 * nicht auf – die Kategorieseite wäre einfach unerreichbar. Deshalb hier
 * die harte Prüfung, nach demselben Muster wie der Dublettenschutz in
 * `seo-pages.ts`.
 */
const BELEGTE_SLUGS = new Set([
  'leistungen',
  'berlin',
  'brandenburg',
  'kosten',
  'ratgeber',
  'einsatzberichte',
  'kontakt',
  'impressum',
  'datenschutz',
  'ueber-uns',
  'fragen',
  'bewerten',
  'angebot-anfragen',
  'anfrage-erhalten',
  'hausverwaltungen-immobilienpartner',
  '404',
]);

export interface CategoryAudit {
  errors: string[];
  warnings: string[];
}

/**
 * Prüft die Familien gegen sich selbst und gegen den Leistungsbestand.
 *
 * Wird von `scripts/content-audit.mjs` aufgerufen. Die bekannten
 * Leistungs-Slugs kommen aus dem Import oben – anders als bei
 * `validateServiceAreas()` ist das hier unbedenklich, weil diese Datei
 * ohnehin nur zur Bauzeit gelesen wird und nicht in ein Client-Bündel
 * gerät.
 */
export function validateCategories(): CategoryAudit {
  const errors: string[] = [];
  const warnings: string[] = [];

  const bekannteSlugs = new Set(services.map((s) => s.slug));
  const gesehen = new Map<string, number>();
  const zuordnung = new Map<string, string[]>();

  for (const c of categories) {
    const at = `Kategorie '${c.slug}'`;

    gesehen.set(c.slug, (gesehen.get(c.slug) ?? 0) + 1);

    if (c.hub && BELEGTE_SLUGS.has(c.slug)) {
      errors.push(`${at}: Slug ist bereits von einer statischen Seite belegt – die Hub-Seite wäre nicht erreichbar.`);
    }

    for (const s of c.services) {
      if (!bekannteSlugs.has(s)) {
        errors.push(`${at}: verweist auf unbekannte Leistung '${s}'.`);
      }
      zuordnung.set(s, [...(zuordnung.get(s) ?? []), c.slug]);
    }

    if (c.status === 'published' && c.services.length === 0) {
      errors.push(`${at}: als veröffentlicht markiert, enthält aber keine Leistung.`);
    }

    /*
     * Eine Hub-Seite ohne Inhalt ist eine dünne Seite. Sie darf existieren,
     * solange sie Entwurf bleibt – dann baut sie als noindex und lässt sich
     * intern ansehen. Veröffentlicht wäre sie ein Schaden.
     */
    if (c.hub && c.status === 'published') {
      if (!c.h1) errors.push(`${at}: Hub-Seite ohne H1.`);
      if (!c.answer || c.answer.length < 120) {
        errors.push(`${at}: Hub-Seite braucht eine direkte Antwort von mindestens 120 Zeichen.`);
      }
      if (!c.metaDescription || c.metaDescription.length < 80) {
        errors.push(`${at}: Hub-Seite braucht eine eigene Meta Description (mind. 80 Zeichen).`);
      }
      if (!c.intro || c.intro.length < 2) {
        errors.push(`${at}: Hub-Seite braucht eine eigene Einleitung mit mindestens 2 Absätzen.`);
      }
      if (!c.faq || c.faq.length < 3) {
        errors.push(`${at}: Hub-Seite braucht mindestens 3 eigene FAQ.`);
      }
      if (c.services.length < 2) {
        errors.push(`${at}: Hub-Seite lohnt erst ab 2 Leistungen, sonst genügt die Leistungsseite.`);
      }
      if (!c.differentiator?.trim()) {
        errors.push(`${at}: Hub-Seite ohne notierten Unterschied zu den anderen Familien.`);
      }
    }

    if (c.hub && c.status === 'draft') {
      warnings.push(`${at}: Hub-Seite ist Entwurf – baut als noindex und ist nicht verlinkt.`);
    }
  }

  for (const [slug, anzahl] of gesehen) {
    if (anzahl > 1) errors.push(`Kategorie '${slug}' ist ${anzahl}-mal definiert.`);
  }

  /* Eine Leistung darf nicht in zwei Familien stehen – sonst ist der
     Breadcrumb mehrdeutig und der Linkgraph doppelt gewichtet. */
  for (const [slug, fam] of zuordnung) {
    if (fam.length > 1) {
      errors.push(`Leistung '${slug}' gehört zu mehreren Familien: ${fam.join(', ')}.`);
    }
  }

  /* Veröffentlichte Leistung ohne Familie: kein Fehler, aber sie taucht
     dann auf /leistungen/ nicht auf. Das ist fast immer ein Versehen. */
  for (const s of services) {
    if (s.status !== 'published') continue;
    if (!zuordnung.has(s.slug)) {
      warnings.push(`Leistung '${s.slug}' ist veröffentlicht, gehört aber zu keiner Familie – sie erscheint nicht auf /leistungen/.`);
    }
  }

  return { errors, warnings };
}
