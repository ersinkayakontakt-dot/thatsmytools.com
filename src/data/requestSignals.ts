/**
 * ANFRAGESIGNALE: Übergabe-Anforderungen und offene Fragen (GROW-2026-01/02)
 * =========================================================================
 *
 * Zwei feste Auswahllisten des Anfrageformulars. Feste Schlüssel statt
 * Freitext, weil daraus das Nachfrageregister zählt (docs/NACHFRAGE-SYSTEM.md):
 * Freitext ließe sich nur auswerten, wenn man ihn speichert – und dann
 * stünden dort Namen, Adressen und Lebensumstände.
 *
 * CROSS-LAYER: Dieselben Schlüssel stehen in public/api/lib/nachfrage.php
 * (SH24_ANFORDERUNGEN, SH24_OFFEN). PHP kann dieses Modul nicht importieren.
 * `npm run audit:demand:selftest` vergleicht beide Listen und schlägt fehl,
 * wenn eine Seite einen Schlüssel hat, den die andere nicht kennt.
 *
 * Schlüssel sind dauerhaft: Ein umbenannter Schlüssel zerschneidet die
 * Zeitreihe im Register. Neue Schlüssel ergänzen, alte nicht umdeuten.
 */

/** Wer eine Anforderung erbringt. Entscheidet über Anzeige und Register. */
export type Responsibility = 'eigen' | 'fachbetrieb' | 'nicht';

export interface HandoverItem {
  key: string;
  label: string;
  responsibility: Responsibility;
}

/**
 * Was bis zur Übergabe erledigt sein muss.
 *
 * Zuständigkeit nach docs/HANDWERKSRECHT.md: Streichen und Tapezieren sind
 * Anlage-A-Arbeiten und laufen über einen Fachbetrieb (E-011). Reparaturen an
 * Fenstern, Türen, Sanitär und Elektrik bieten wir nicht an – sie stehen
 * trotzdem in der Liste, weil genau diese Lücke gezählt werden soll.
 */
export const handoverItems: readonly HandoverItem[] = [
  { key: 'geraeumt', label: 'Alles geräumt, auch Keller und Nebenräume', responsibility: 'eigen' },
  { key: 'besenrein', label: 'Besenrein', responsibility: 'eigen' },
  { key: 'einbauten', label: 'Einbauten oder Küche zurückbauen', responsibility: 'eigen' },
  { key: 'duebel', label: 'Dübellöcher schließen', responsibility: 'eigen' },
  { key: 'boden-raus', label: 'Teppich oder alten Boden entfernen', responsibility: 'eigen' },
  { key: 'boden-neu', label: 'Neuen Bodenbelag verlegen', responsibility: 'eigen' },
  { key: 'reinigung', label: 'Endreinigung', responsibility: 'eigen' },
  { key: 'streichen', label: 'Wände oder Decken streichen', responsibility: 'fachbetrieb' },
  { key: 'tapeten', label: 'Tapeten entfernen oder neu tapezieren', responsibility: 'fachbetrieb' },
  { key: 'reparaturen', label: 'Reparaturen an Fenstern, Türen, Sanitär oder Elektrik', responsibility: 'nicht' },
  { key: 'unklar', label: 'Noch unklar – Vertrag oder Protokoll liegt vor', responsibility: 'eigen' },
];

export const responsibilityLabel: Record<Responsibility, string> = {
  eigen: 'Übernehmen wir selbst',
  fachbetrieb: 'Stimmen wir mit einem Fachbetrieb ab',
  nicht: 'Bieten wir nicht an – wir sagen es Ihnen offen',
};

export interface OpenQuestion {
  key: string;
  label: string;
}

/**
 * Was unmittelbar vor der Kontaktaufnahme noch unklar ist.
 *
 * Doppelter Zweck: Das erste Gespräch beginnt mit genau dieser Frage, und
 * das Register zählt, welche Unsicherheit am häufigsten vor einer Anfrage
 * steht – die Grundlage, um bestehende Seiten gezielt zu verbessern.
 * Erfasst wird nur, wer absendet; Abbrecher sieht diese Liste nicht.
 */
export const openQuestions: readonly OpenQuestion[] = [
  { key: 'kosten', label: 'Mit welchen Kosten ich rechnen muss' },
  { key: 'machbar', label: 'Ob Sie das überhaupt übernehmen' },
  { key: 'termin', label: 'Ob es bis zu meinem Termin klappt' },
  { key: 'gegenstaende', label: 'Was mit Möbeln und Gegenständen passiert' },
  { key: 'vorbereitung', label: 'Was ich vorher selbst erledigen muss' },
  { key: 'vermieter', label: 'Was der Vermieter oder die Verwaltung verlangen darf' },
  { key: 'ablauf', label: 'Wie der Ablauf am Einsatztag aussieht' },
];

/** Gemeinsamer Parameter für den Übergabe-Einstieg in /angebot-anfragen/. */
export const HANDOVER_VORHABEN = 'uebergabe';
export const handoverRequestHref = '/angebot-anfragen/?leistung=wohnungsaufloesung-berlin&vorhaben=uebergabe';
