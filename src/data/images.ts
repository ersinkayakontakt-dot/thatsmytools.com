import type { ImageMetadata } from 'astro';

import clearanceBoxes from '../assets/entruempelung-gestapelte-kartons.jpg';
import householdPacking from '../assets/haushaltsaufloesung-geschirr-einpacken.jpg';
import propertyManagementKeys from '../assets/hausverwaltung-schluessel.jpg';
import estatePhotos from '../assets/nachlass-fotokiste.jpg';
import apartmentHandover from '../assets/schluesseluebergabe-wohnung.jpg';
import seniorMoveConversation from '../assets/seniorenumzug-gespraech-generationen.jpg';
import emptyApartment from '../assets/wohnungsaufloesung-leere-wohnung.jpg';

import constructionInterior from '../assets/innenausbau-heller-raum.jpg';
import constructionDrywall from '../assets/trockenbau-innenraum.jpg';
import constructionDemolition from '../assets/rueckbau-bestandsraum.jpg';
import constructionFloor from '../assets/boden-laminat-verlegung.jpg';
import constructionKitchen from '../assets/kuechenmontage-einbaukueche.jpg';

export type ImageOrigin = 'stock' | 'company' | 'customer-approved';
export type ImageRole = 'hero' | 'inline';

export interface SiteImage {
  pageId: string;
  role: ImageRole;
  src: ImageMetadata;
  alt: string;
  caption: string;
  imageOrigin: ImageOrigin;
  showsPeople: boolean;
}

/**
 * Zentrale Registry aller inhaltstragenden Bilder.
 *
 * Die Texte entsprechen dem derzeit live ausgelieferten Stand. Stockbilder
 * mit sichtbaren Personen werden von Figure.astro automatisch als
 * Symbolbild gekennzeichnet. Quellen und Lizenzen stehen in
 * IMAGE-SOURCES.md.
 */
export const siteImages: readonly SiteImage[] = [
  { pageId: 'service:innenausbau-berlin', role: 'hero', src: constructionInterior, alt: 'Heller Raum mit weißen Wänden und geschütztem Boden während einer Renovierung', caption: 'Beispielbild: ein Innenraum in der Ausbauphase.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:trockenbau-berlin', role: 'hero', src: constructionDrywall, alt: 'Unfertiger Innenraum mit weißen Wandflächen, Türöffnungen und offener Decke', caption: 'Beispielbild: Wandflächen und Raumübergänge im Innenausbau.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:demontage-rueckbau', role: 'hero', src: constructionDemolition, alt: 'Entkernter Bestandsraum mit freigelegtem Mauerwerk und Baumaterial', caption: 'Beispielbild: freigelegter Bestand vor dem weiteren Ausbau.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:bodenbelag-verlegen-berlin', role: 'hero', src: constructionFloor, alt: 'Handwerker verlegt dunkle Laminatdielen mit Schlagholz und Gummihammer', caption: 'Beispielbild: Laminatdielen werden passgenau verlegt.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:kuechenmontage-berlin', role: 'hero', src: constructionKitchen, alt: 'Helle Einbauküche mit weißen Schränken, Arbeitsfläche und Fenster', caption: 'Beispielbild: angeordnete Küchenmöbel mit zusammenhängender Arbeitsfläche.', imageOrigin: 'stock', showsPeople: false },
  {
    pageId: 'service:wohnungsaufloesung-berlin',
    role: 'hero',
    src: emptyApartment,
    alt: 'Leere Wohnung mit Holzdielen und großen Fenstern, bereit zur Übergabe',
    caption: 'So sieht eine Wohnung am Ende aus: leer, sauber, übergabefertig.',
    imageOrigin: 'stock',
    showsPeople: false,
  },
  {
    pageId: 'service:wohnungsaufloesung-berlin',
    role: 'inline',
    src: apartmentHandover,
    alt: 'Hand hält einen Schlüsselbund mit Haus-Anhänger vor einem hellen Treppenhaus',
    caption: 'Der Schlüssel geht an Vermieter, Verwaltung oder Makler.',
    imageOrigin: 'stock',
    showsPeople: true,
  },
  {
    pageId: 'service:entruempelung-berlin',
    role: 'hero',
    src: clearanceBoxes,
    alt: 'Aufgestellte Umzugskartons und ein Bücherstapel auf einem Holztisch',
    caption: 'Sortiert statt geschaufelt: Was mitgeht, wird vorher festgelegt.',
    imageOrigin: 'stock',
    showsPeople: false,
  },
  {
    pageId: 'service:haushaltsaufloesung-berlin',
    role: 'hero',
    src: householdPacking,
    alt: 'Zwei Hände wickeln eine Schale in Packpapier ein',
    caption: 'Zerbrechliches wird einzeln eingeschlagen, nicht gestapelt.',
    imageOrigin: 'stock',
    showsPeople: true,
  },
  {
    pageId: 'service:nachlassaufloesung-berlin',
    role: 'hero',
    src: estatePhotos,
    alt: 'Hand greift in einen Karton mit alten Familienfotos, weitere Fotos liegen daneben',
    caption: 'Fotos, Briefe und Unterlagen werden gesichert, bevor geräumt wird.',
    imageOrigin: 'stock',
    showsPeople: true,
  },
  {
    pageId: 'service:seniorenumzug-berlin',
    role: 'hero',
    src: seniorMoveConversation,
    alt: 'Ältere und jüngere Frau sitzen nebeneinander auf einem Sofa und sehen gemeinsam in eine Zeitschrift',
    caption: 'Die Entscheidung fällt selten allein – meistens gemeinsam mit der Familie.',
    imageOrigin: 'stock',
    showsPeople: true,
  },
  {
    pageId: 'hausverwaltungen',
    role: 'hero',
    src: propertyManagementKeys,
    alt: 'Person im Anzug hält eine Mappe und einen Schlüsselbund mit Haus-Anhänger',
    caption: 'Schlüsselübernahme, Protokoll und Rückgabe laufen über eine Ansprechperson.',
    imageOrigin: 'stock',
    showsPeople: true,
  },
];

export function imagesForPage(pageId: string): SiteImage[] {
  return siteImages.filter((image) => image.pageId === pageId);
}

export function heroImage(pageId: string): SiteImage | undefined {
  return siteImages.find((image) => image.pageId === pageId && image.role === 'hero');
}
