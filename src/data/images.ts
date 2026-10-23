import type { ImageMetadata } from 'astro';

import clearanceBoxes from '../assets/entruempelung-gestapelte-kartons.jpg';
import householdPacking from '../assets/haushaltsaufloesung-geschirr-einpacken.jpg';
import propertyManagementKeys from '../assets/hausverwaltung-schluessel.jpg';
import estatePhotos from '../assets/nachlass-fotokiste.jpg';
import apartmentHandover from '../assets/schluesseluebergabe-wohnung.jpg';
import seniorMoveConversation from '../assets/seniorenumzug-gespraech-generationen.jpg';
import emptyApartment from '../assets/wohnungsaufloesung-leere-wohnung.jpg';

import constructionInterior from '../assets/innenausbau-heller-raum.jpg';
import constructionDrywall from '../assets/trockenbau-gipskarton-zuschnitt.jpg';
import constructionDemolition from '../assets/rueckbau-bestandsraum.jpg';
import constructionFloor from '../assets/boden-laminat-verlegung.jpg';
import constructionKitchen from '../assets/kuechenmontage-einbaukueche.jpg';

import drywallJoints from '../assets/trockenbau-plattenfugen.jpg';
import paintingRoller from '../assets/malerarbeiten-farbrolle.jpg';
import wallpaperRolls from '../assets/tapezieren-tapetenrollen.jpg';
import officeSpace from '../assets/bueroaufloesung-arbeitsflaeche.jpg';
import movingBoxes from '../assets/umzug-kartons-tragen.jpg';

import furnitureAssembly from '../assets/moebelmontage-anleitung-werkzeug.jpg';
import guideComparison from '../assets/ratgeber-angebote-vergleichen.jpg';
import costClearing from '../assets/kosten-entruempelung-dachzimmer.jpg';
import costHousehold from '../assets/kosten-haushalt-altbauzimmer.jpg';
import costBulky from '../assets/kosten-sperrmuell-alte-moebel.jpg';
import costSenior from '../assets/kosten-seniorenumzug-packen.jpg';
import guidePhotos from '../assets/ratgeber-fotos-smartphone.jpg';
import guidePrepare from '../assets/ratgeber-entruempelung-packen.jpg';
import guideHandover from '../assets/ratgeber-uebergabe-protokoll.jpg';
import guideBereavement from '../assets/ratgeber-nachlass-sekretaer.jpg';
import guideNoStopping from '../assets/ratgeber-halteverbot-schild.jpg';
import guideApplication from '../assets/ratgeber-antrag-ausfuellen.jpg';
import guideSofa from '../assets/ratgeber-sofa-heraustragen.jpg';
import guideChecklist from '../assets/ratgeber-checkliste-haken.jpg';

import clutterBag from '../assets/messiwohnung-muellsack-handschuhe.jpg';
import bulkyTable from '../assets/sperrmuell-tisch-heraustragen.jpg';
import cellarBoxes from '../assets/keller-kartons-hinter-gitter.jpg';
import floorSamples from '../assets/boden-dielenmuster-vergleich.jpg';
import readyApartment from '../assets/verkaufsfertig-leere-wohnung.jpg';

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
  { pageId: 'guide:innenausbau-angebote-vergleichen', role: 'hero', src: guideComparison, alt: 'Zwei Hände vergleichen ausgedruckte Angebote, Positionen sind farbig markiert', caption: 'Beispielbild: Angebote werden Position für Position verglichen.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:was-kostet-eine-entruempelung-in-berlin', role: 'hero', src: costClearing, alt: 'Dachzimmer mit Polsterstuhl, Beistelltisch, Bildern und alten Gegenständen', caption: 'Beispielbild: Ein eingerichteter Raum vor der Räumung – Menge und Zugang bestimmen den Aufwand.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:kosten-haushaltsaufloesung-berlin', role: 'hero', src: costHousehold, alt: 'Altbauzimmer mit Holzdielen, Heizkörper, Stühlen und Stehlampe', caption: 'Beispielbild: Ein vollständig eingerichteter Haushalt vor der Auflösung.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:kosten-sperrmuellabholung-berlin', role: 'hero', src: costBulky, alt: 'Alter Holzstuhl und Sessel in einem leeren Raum mit hohen Fenstern', caption: 'Beispielbild: Einzelne ausrangierte Möbel, bereitgestellt zur Abholung.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:kosten-seniorenumzug-berlin', role: 'hero', src: costSenior, alt: 'Älterer Mann packt Umzugskartons', caption: 'Beispielbild: Beim Seniorenumzug wird ausgewählt, was mitkommt.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:welche-fotos-fuer-ein-angebot', role: 'hero', src: guidePhotos, alt: 'Hände fotografieren mit dem Smartphone einen Raum mit Sofa', caption: 'Beispielbild: Ein Übersichtsfoto je Raum reicht für die erste Einschätzung.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:entruempelung-vorbereiten', role: 'hero', src: guidePrepare, alt: 'Person packt Gegenstände in einen offenen Umzugskarton', caption: 'Beispielbild: Was bleiben soll, wird vorher getrennt und gekennzeichnet.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:checkliste-wohnungsuebergabe', role: 'hero', src: guideHandover, alt: 'Hand füllt ein Formular auf einem Klemmbrett aus, im Hintergrund Kartons', caption: 'Beispielbild: Das Übergabeprotokoll hält Zustand und Zählerstände fest.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:haushaltsaufloesung-nach-todesfall', role: 'hero', src: guideBereavement, alt: 'Geöffneter alter Sekretär mit Papieren und Unterlagen', caption: 'Beispielbild: Unterlagen werden gesichtet, bevor irgendetwas geräumt wird.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:halteverbotszone-berlin-umzug', role: 'hero', src: guideNoStopping, alt: 'Verkehrsschild Absolutes Halteverbot vor einer Klinkerwand', caption: 'Beispielbild: Das Halteverbotsschild für den Umzugstag.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:umzugskosten-jobcenter-berlin', role: 'hero', src: guideApplication, alt: 'Hand füllt mit einem Kugelschreiber ein Formular aus', caption: 'Beispielbild: Der Antrag wird vor der Beauftragung gestellt.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:sperrmuell-moebel-entsorgen-berlin', role: 'hero', src: guideSofa, alt: 'Mann trägt ein grünes Sofa durch eine Wohnungstür', caption: 'Beispielbild: Ein Sofa wird aus der Wohnung getragen.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:wohnungsaufloesung-checkliste-pdf', role: 'hero', src: guideChecklist, alt: 'Blatt mit drei Kästchen, das erste ist rot abgehakt', caption: 'Beispielbild: Aufgabe für Aufgabe abhaken.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:messiwohnung-raeumen', role: 'hero', src: clutterBag, alt: 'Hände in Arbeitshandschuhen halten einen offenen schwarzen Müllsack mit gemischtem Abfall', caption: 'Beispielbild: Abfall wird mit Schutzhandschuhen gesammelt und getrennt.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:sperrmuellabholung-berlin', role: 'hero', src: bulkyTable, alt: 'Mann trägt einen Holztisch durch ein Wohnzimmer, das Sofa ist mit Folie abgedeckt', caption: 'Beispielbild: ein ausrangiertes Möbelstück wird aus der Wohnung getragen.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:kellerentruempelung-berlin', role: 'hero', src: cellarBoxes, alt: 'Gestapelte Kartons und ein Kanister hinter einem vergitterten Kellerfenster', caption: 'Beispielbild: eingelagerte Kartons hinter einem Kellerfenster.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'guide:laminat-oder-vinyl-mietwohnung', role: 'hero', src: floorSamples, alt: 'Hände halten drei Dielenmuster in hellen und mittleren Holzdekoren zum Vergleich', caption: 'Beispielbild: Dielenmuster werden vor der Auswahl verglichen.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'guide:geerbte-wohnung-verkaufsfertig-machen', role: 'hero', src: readyApartment, alt: 'Leerer, heller Raum mit hellem Holzdekorboden, Heizkörpern und grau gestrichener Wand', caption: 'Beispielbild: eine geräumte, hergerichtete Wohnung vor Verkauf oder Vermietung.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:moebelmontage-berlin', role: 'hero', src: furnitureAssembly, alt: 'Montageanleitung mit Schraubendrehern, Holzdübeln und Verbindungsschrauben', caption: 'Beispielbild: Anleitung und Beschläge für den Aufbau von Fertigmöbeln.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:trockenbau-berlin', role: 'hero', src: constructionDrywall, alt: 'Handwerker schneidet eine Gipskartonplatte vor einer bereits beplankten Wand', caption: 'Beispielbild: Zuschnitt von Gipskartonplatten für den Trockenbau.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:trockenbau-berlin', role: 'inline', src: drywallJoints, alt: 'Handwerker bearbeitet Fugen einer Wand aus grünen Gipskartonplatten', caption: 'Beispielbild: Fugenbearbeitung an einer beplankten Trockenbauwand.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:malerarbeiten-berlin', role: 'hero', src: paintingRoller, alt: 'Hand führt eine Farbrolle über eine helle Wandfläche', caption: 'Beispielbild: Wandbeschichtung mit der Farbrolle.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:tapezieren-berlin', role: 'hero', src: wallpaperRolls, alt: 'Hände halten verschiedene Tapetenrollen vor einer gemusterten Wand', caption: 'Beispielbild: unterschiedliche Tapeten für die Materialauswahl.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:bueroaufloesung-berlin', role: 'hero', src: officeSpace, alt: 'Unbesetzte Bürofläche mit Schreibtischen, Stühlen und großen Fenstern', caption: 'Beispielbild: Bürofläche mit Arbeitsplätzen vor einer möglichen Räumung.', imageOrigin: 'stock', showsPeople: false },
  { pageId: 'service:umzug-berlin', role: 'hero', src: movingBoxes, alt: 'Zwei Personen tragen einen großen Umzugskarton durch ein Wohnzimmer', caption: 'Beispielbild: gemeinsames Tragen eines Umzugskartons.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:innenausbau-berlin', role: 'inline', src: drywallJoints, alt: 'Handwerker bearbeitet Plattenfugen an einer Trockenbauwand', caption: 'Beispielbild: Plattenfugen vor weiteren Oberflächenarbeiten.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:innenausbau-berlin', role: 'inline', src: paintingRoller, alt: 'Farbrolle beschichtet eine helle Wand', caption: 'Beispielbild: der Anstrich folgt der abgestimmten Wandvorbereitung.', imageOrigin: 'stock', showsPeople: true },
  { pageId: 'service:innenausbau-berlin', role: 'hero', src: constructionInterior, alt: 'Heller Raum mit weißen Wänden und geschütztem Boden während einer Renovierung', caption: 'Beispielbild: ein Innenraum in der Ausbauphase.', imageOrigin: 'stock', showsPeople: false },
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
