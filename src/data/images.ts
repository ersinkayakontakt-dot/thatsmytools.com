/**
 * BILD-REGISTRY
 * =============
 *
 * Alle inhaltstragenden Bilder der Website mit ihrer Herkunft.
 *
 * WARUM EINE REGISTRY UND KEIN IMPORT IN DER SEITE
 * Ein Stockfoto ist eine Übergangslösung. Sobald echte Einsatzbilder
 * vorliegen, soll der Austausch aus zwei Handgriffen bestehen: Datei
 * ersetzen, `imageOrigin` auf `'company'` stellen. Läge der Import in der
 * Seite, müsste man dafür Seitenvorlagen anfassen – und der Nachweis, was
 * woher stammt, wäre über das Projekt verteilt.
 *
 * DER NACHWEIS IST PFLICHT
 * Zu jedem Stockfoto gehört ein Eintrag in IMAGE-SOURCES.md mit Plattform,
 * Fotograf, Originalseite, Abrufdatum und Lizenzstatus. `npm run seo:images`
 * bricht ab, wenn ein ausgeliefertes Bild dort fehlt.
 *
 * WAS EIN SKRIPT NICHT PRÜFEN KANN
 * Ob das Motiv passt, ob eine abgebildete Person würdevoll dargestellt ist
 * und ob die Lizenz zum Zeitpunkt der Verwendung noch gilt. Diese Prüfung
 * bleibt beim Betreiber. Die Registry macht sie nur nachvollziehbar.
 *
 * SO WIRD EIN BILD ERGÄNZT
 *   1. Datei nach src/assets/ legen. Sprechender Dateiname, keine
 *      Zeichenketten wie "pexels-12345".
 *   2. Hier importieren und einen Eintrag anlegen.
 *   3. Alt-Text schreiben: Was ist zu SEHEN? Keine Ortsaufzählung, keine
 *      Wiederholung des Seitentitels, keine Werbewörter.
 *   4. IMAGE-SOURCES.md ergänzen.
 *   5. `npm run seo:images` und `npm run build` laufen lassen.
 */
import type { ImageMetadata } from 'astro';

import leereWohnung from '../assets/wohnungsaufloesung-leere-wohnung.jpg';
import schluessel from '../assets/schluesseluebergabe-wohnung.jpg';
import kartons from '../assets/entruempelung-gestapelte-kartons.jpg';
import einpacken from '../assets/haushaltsaufloesung-geschirr-einpacken.jpg';
import fotokiste from '../assets/nachlass-fotokiste.jpg';
import generationen from '../assets/seniorenumzug-gespraech-generationen.jpg';
import verwaltungSchluessel from '../assets/hausverwaltung-schluessel.jpg';

export interface ImageCredit {
  /** Name, wie er auf der Quellplattform steht. */
  photographer: string;
  /** Pexels, Unsplash, Pixabay … */
  platform: string;
  /** Seite des Bildes auf der Plattform, nicht die Bilddatei. */
  sourceUrl: string;
  /** Lizenzbezeichnung, wie sie dort zum Abrufzeitpunkt stand. */
  license: string;
  /** Abrufdatum im Format JJJJ-MM-TT. */
  retrieved: string;
}

export interface SiteImage {
  id: string;
  /** Über astro:assets importiertes Bild aus src/assets/. */
  src: ImageMetadata;

  /**
   * Was ist auf dem Bild zu sehen und wozu steht es hier?
   * Leer lassen (''), wenn das Bild rein dekorativ ist – dann überspringen
   * Screenreader es, statt eine Beschreibung vorzulesen, die nichts trägt.
   */
  alt: string;

  /** Sichtbare Bildunterschrift. Optional. */
  caption?: string;

  /**
   * stock             gekauftes oder freies Stockfoto, Übergangslösung
   * company           eigenes Bild des Betriebs
   * customer-approved echtes Einsatzbild mit schriftlicher Freigabe
   */
  imageOrigin: 'stock' | 'company' | 'customer-approved';

  /** Wie dringend soll dieses Bild durch ein echtes ersetzt werden? */
  replacementPriority: 'low' | 'medium' | 'high';

  /**
   * Sind Personen zu sehen? Dann kennzeichnet Figure.astro das Bild
   * sichtbar als Symbolbild, solange `imageOrigin === 'stock'` ist.
   * Stockpersonen dürfen niemals als eigene Mitarbeitende oder als echte
   * Kundschaft erscheinen.
   */
  showsPeople: boolean;

  /** IDs aus der SEO-Seitenkarte, auf denen das Bild verwendet wird. */
  pages: string[];

  /** hero = LCP-Bild der Seite, inline = im Fließtext. */
  role: 'hero' | 'inline';

  /** Nur bei Stockfotos: Herkunftsnachweis. */
  credit?: ImageCredit;
}

/**
 * DIE SIEBEN BILDER DER PRIORITÄTSSEITEN
 * ======================================
 *
 * Ausgewählt am 06.08.2026 aus 84 Kandidaten von Pexels. Jedes wurde vor
 * der Übernahme angesehen und gegen die Motivvorgaben aus Auftrag § 10
 * geprüft. Aussortiert wurden dabei unter anderem:
 *
 *   - ein ausdrücklich KI-generiertes Bild (Fotograf „AI25.Studio“)
 *   - Aufnahmen mit Mund-Nasen-Schutz (datieren das Bild sichtbar)
 *   - ein Schild mit englischem „FOR SALE“
 *   - eine Aufnahme, die durch Kopftuch und Haltung als Krankheitsbild
 *     lesbar gewesen wäre
 *   - breit lächelnde Modelle vor Kartonwänden
 *
 * DIE STARTSEITE BEKOMMT BEWUSST KEIN FOTO. Ihr Hero ist rein
 * typografisch aufgebaut; ein Bild dort würde genau die Gestaltung
 * verändern, die als Referenz erhalten bleiben soll.
 *
 * Für /leistungen/messiwohnung-raeumen/ gibt es ebenfalls kein Bild –
 * jedes Motiv wäre entweder beschönigend oder bloßstellend.
 */
export const images: SiteImage[] = [
  {
    id: 'wohnungsaufloesung-hero',
    src: leereWohnung,
    alt: 'Leere Wohnung mit Holzdielen und großen Fenstern, bereit zur Übergabe',
    caption: 'So sieht eine Wohnung am Ende aus: leer, sauber, übergabefertig.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: false,
    pages: ['service:wohnungsaufloesung-berlin'],
    role: 'hero',
    credit: {
      photographer: 'Max Vakhtbovych',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/white-room-with-wooden-flooring-8146158/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'wohnungsaufloesung-schluessel',
    src: schluessel,
    alt: 'Hand hält einen Schlüsselbund mit Haus-Anhänger vor einem hellen Treppenhaus',
    caption: 'Der Schlüssel geht an Vermieter, Verwaltung oder Makler.',
    imageOrigin: 'stock',
    replacementPriority: 'medium',
    showsPeople: true,
    pages: ['service:wohnungsaufloesung-berlin'],
    role: 'inline',
    credit: {
      photographer: 'Jakub Zerdzicki',
      platform: 'Pexels',
      sourceUrl:
        'https://www.pexels.com/photo/hand-holding-house-keychain-symbolizing-real-estate-29998475/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'entruempelung-hero',
    src: kartons,
    alt: 'Aufgestellte Umzugskartons und ein Bücherstapel auf einem Holztisch',
    caption: 'Sortiert statt geschaufelt: Was mitgeht, wird vorher festgelegt.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: false,
    pages: ['service:entruempelung-berlin'],
    role: 'hero',
    credit: {
      photographer: 'Kaboompics.com',
      platform: 'Pexels',
      sourceUrl:
        'https://www.pexels.com/photo/stack-of-carton-boxes-and-books-on-shabby-table-4498114/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'haushaltsaufloesung-hero',
    src: einpacken,
    alt: 'Zwei Hände wickeln eine Schale in Packpapier ein',
    caption: 'Zerbrechliches wird einzeln eingeschlagen, nicht gestapelt.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: true,
    pages: ['service:haushaltsaufloesung-berlin'],
    role: 'hero',
    credit: {
      photographer: 'Ketut Subiyanto',
      platform: 'Pexels',
      sourceUrl:
        'https://www.pexels.com/photo/crop-young-woman-packing-fragile-goods-for-transportation-4246185/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'nachlassaufloesung-hero',
    src: fotokiste,
    alt: 'Hand greift in einen Karton mit alten Familienfotos, weitere Fotos liegen daneben',
    caption: 'Fotos, Briefe und Unterlagen werden gesichert, bevor geräumt wird.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: true,
    pages: ['service:nachlassaufloesung-berlin'],
    role: 'hero',
    credit: {
      photographer: 'fish socks',
      platform: 'Pexels',
      sourceUrl:
        'https://www.pexels.com/photo/exploring-vintage-family-photo-collection-in-shoebox-34384398/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'seniorenumzug-hero',
    src: generationen,
    alt: 'Ältere und jüngere Frau sitzen nebeneinander auf einem Sofa und sehen gemeinsam in eine Zeitschrift',
    caption: 'Die Entscheidung fällt selten allein – meistens gemeinsam mit der Familie.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: true,
    pages: ['service:seniorenumzug-berlin'],
    role: 'hero',
    credit: {
      photographer: 'cottonbro studio',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/a-mother-and-daughter-looking-at-a-magazine-7232043/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
  {
    id: 'hausverwaltungen-hero',
    src: verwaltungSchluessel,
    alt: 'Person im Anzug hält eine Mappe und einen Schlüsselbund mit Haus-Anhänger',
    caption: 'Schlüsselübernahme, Protokoll und Rückgabe laufen über eine Ansprechperson.',
    imageOrigin: 'stock',
    replacementPriority: 'high',
    showsPeople: true,
    pages: ['hausverwaltungen'],
    role: 'hero',
    credit: {
      photographer: 'Pavel Danilyuk',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/close-up-shot-of-keychain-on-person-s-hand-7937684/',
      license: 'Pexels-Lizenz: kostenlos nutzbar, auch kommerziell, ohne Namensnennung',
      retrieved: '2026-08-06',
    },
  },
];

const byId = new Map(images.map((img) => [img.id, img]));

/** Ein Bild aus der Registry. Bricht bei unbekannter ID ab. */
export function siteImage(id: string): SiteImage {
  const img = byId.get(id);
  // Absichtlich ein Absturz: Ein Tippfehler soll beim Build auffallen und
  // nicht als fehlendes Bild auf der Live-Seite.
  if (!img) throw new Error(`Unbekanntes Bild: "${id}". Bekannt: ${[...byId.keys()].join(', ')}`);
  return img;
}

/** Alle Bilder einer Seite, Hero zuerst. */
export function imagesForPage(pageId: string): SiteImage[] {
  return images
    .filter((img) => img.pages.includes(pageId))
    .sort((a, b) => (a.role === 'hero' ? -1 : 0) - (b.role === 'hero' ? -1 : 0));
}

/** Das LCP-Bild einer Seite, falls es eines gibt. */
export function heroImage(pageId: string): SiteImage | undefined {
  return images.find((img) => img.role === 'hero' && img.pages.includes(pageId));
}

/** Noch auszutauschende Stockfotos – speist CONTENT-TODO.md. */
export const pendingRealPhotos = images.filter((img) => img.imageOrigin === 'stock');
