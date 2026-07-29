/**
 * PREISDATEN
 * ==========
 * Hier stehen KEINE erfundenen Zahlen.
 *
 * `priceDataAvailable = false` bedeutet: Es liegen noch keine freigegebenen
 * Preisspannen aus echten Aufträgen vor. Solange das so ist, zeigen alle
 * Kostenseiten die Preisfaktoren und die Rechenlogik, aber keine Beträge.
 *
 * SO WIRD DIE DATEI AKTIVIERT (siehe CONTENT-TODO.md):
 *   1. Aus mindestens 20 abgerechneten Aufträgen je Kategorie die tatsächlich
 *      berechneten Endpreise zusammenstellen.
 *   2. Spanne (von/bis) statt Einzelwert eintragen, dazu die Fallzahl.
 *   3. `basis` ausfüllen: Zeitraum, Anzahl Fälle, was enthalten war.
 *   4. `priceDataAvailable` auf true setzen.
 *
 * Erst dann erscheinen die Zahlen auf der Website – mit sichtbarer
 * Angabe von Datenbasis, Fallzahl, Zeitraum und Grenzen der Aussage.
 * Das ist die Grundlage dafür, dass die Angaben von Suchmaschinen und
 * Antwortsystemen als belastbare Quelle behandelt werden können.
 */

export const priceDataAvailable = false;

export interface PriceRange {
  label: string;
  /** Untere Grenze in Euro brutto */
  from: number | null;
  /** Obere Grenze in Euro brutto */
  to: number | null;
  /** Anzahl der Aufträge, aus denen die Spanne stammt */
  cases: number | null;
  note?: string;
}

export interface PriceDataset {
  id: string;
  title: string;
  /** Datenbasis: Zeitraum, Fallzahl, Einschränkungen */
  basis: {
    period: string;
    totalCases: number | null;
    included: string;
    limits: string;
    updated: string;
  };
  ranges: PriceRange[];
}

/**
 * Struktur steht, Werte fehlen. Die Labels sind bereits die richtigen
 * Kategorien – so lässt sich die Datei ausfüllen, ohne sie umzubauen.
 */
export const priceDatasets: PriceDataset[] = [
  {
    id: 'entruempelung-nach-groesse',
    title: 'Entrümpelung nach Wohnungsgröße',
    basis: {
      period: '[ZEITRAUM EINTRAGEN, z. B. 01/2025 bis 12/2025]',
      totalCases: null,
      included: '[WAS WAR IN DIESEN AUFTRÄGEN ENTHALTEN? z. B. Räumung, Abtransport, Entsorgung, besenrein]',
      limits:
        'Die Spannen gelten für Berlin und das nähere Umland. Sie enthalten keine Sonderleistungen wie Küchendemontage, Bodenaufnahme oder Schadstoffentsorgung.',
      updated: '[DATUM DER LETZTEN AUSWERTUNG]',
    },
    ranges: [
      { label: 'Einzelner Kellerraum oder Abteil', from: null, to: null, cases: null },
      { label: '1-Zimmer-Wohnung', from: null, to: null, cases: null },
      { label: '2-Zimmer-Wohnung', from: null, to: null, cases: null },
      { label: '3-Zimmer-Wohnung', from: null, to: null, cases: null },
      { label: '4-Zimmer-Wohnung und größer', from: null, to: null, cases: null },
      { label: 'Einfamilienhaus mit Nebengebäuden', from: null, to: null, cases: null },
    ],
  },
  {
    id: 'aufschlag-ohne-aufzug',
    title: 'Mehraufwand ohne Aufzug',
    basis: {
      period: '[ZEITRAUM EINTRAGEN]',
      totalCases: null,
      included: '[VERGLEICHSBASIS BESCHREIBEN: gleiche Volumenklasse mit und ohne Aufzug]',
      limits:
        'Der Vergleich ist nur innerhalb derselben Volumenklasse aussagekräftig. Trageweg und Treppenform wirken zusätzlich.',
      updated: '[DATUM DER LETZTEN AUSWERTUNG]',
    },
    ranges: [
      { label: '1. Obergeschoss ohne Aufzug', from: null, to: null, cases: null },
      { label: '2. Obergeschoss ohne Aufzug', from: null, to: null, cases: null },
      { label: '3. Obergeschoss ohne Aufzug', from: null, to: null, cases: null },
      { label: '4. Obergeschoss und höher ohne Aufzug', from: null, to: null, cases: null },
    ],
  },
];

export function getPriceDataset(id: string): PriceDataset | undefined {
  return priceDatasets.find((d) => d.id === id);
}

/**
 * Preisfaktoren, die für alle Leistungen gelten.
 * Diese Liste erscheint auf dem Kosten-Hub und auf der Startseite.
 */
export const universalPriceFactors = [
  {
    name: 'Volumen in Kubikmetern',
    weight: 'bestimmend',
    text: 'Nicht die Quadratmeter der Wohnung entscheiden, sondern wie viel tatsächlich herausgetragen wird. Zwei gleich große Wohnungen können sich um den Faktor drei unterscheiden.',
  },
  {
    name: 'Etage und Aufzug',
    weight: 'sehr hoch',
    text: 'Jeder Gegenstand wird von Hand getragen. Der Unterschied zwischen zweitem Stock mit Aufzug und viertem ohne Aufzug beträgt bei gleicher Menge mehrere Arbeitsstunden.',
  },
  {
    name: 'Trageweg und Halteposition',
    weight: 'hoch',
    text: 'In Berlin oft der versteckte Faktor. Steht das Fahrzeug 80 Meter entfernt, verdoppelt sich jeder Weg. Eine Halteverbotszone kostet Geld und spart meist mehr.',
  },
  {
    name: 'Materialart',
    weight: 'mittel bis hoch',
    text: 'Restmüll, Holz, Elektroschrott, Matratzen und Bauschutt werden getrennt und unterschiedlich abgerechnet. Bauschutt geht nach Gewicht, nicht nach Volumen.',
  },
  {
    name: 'Zusatzarbeiten',
    weight: 'nach Aufwand',
    text: 'Küchendemontage, Teppichboden aufnehmen, Dübel entfernen, Einbauschränke ausbauen. Wird getrennt ausgewiesen, damit die Rechnung nachvollziehbar bleibt.',
  },
  {
    name: 'Termin',
    weight: 'gering bis mittel',
    text: 'Ein flexibler Termin lässt sich mit anderen Fahrten kombinieren. Ein fester Wunschtermin am Monatsende ist teurer als ein Dienstag Mitte des Monats.',
  },
  {
    name: 'Verwertbares',
    weight: 'senkt den Preis',
    text: 'Was sich weitergeben lässt, wird gegengerechnet und auf der Rechnung ausgewiesen. Dass der Wert die Kosten deckt, ist die Ausnahme, nicht die Regel.',
  },
];
