/** Fragen richten sich nach dem Vorhaben; keine Preise oder Verfügbarkeiten ableiten. */
export interface RequestProfile {
  kind: 'clearance' | 'assembly' | 'project' | 'surface' | 'advice';
  areaLabel: string; areaHint: string; areaPlaceholder: string;
  description: string; photoHint: string; note: string;
}
const general: RequestProfile = {
  kind: 'clearance', areaLabel: 'Wie groß ist der Bereich ungefähr?',
  areaHint: 'Zimmerzahl oder Wohnfläche reichen als Orientierung. Sie können die Angabe auch offenlassen.',
  areaPlaceholder: 'Zum Beispiel: 3 Zimmer, ungefähr 75 m²',
  description: 'Was bleibt, was soll mit und was kommt weg? Gibt es etwas, das wir bei Zugang oder Übergabe beachten sollen?',
  photoHint: 'Raumübersichten und betroffene Möbel helfen. Bitte keine persönlichen Dokumente oder Personen aufnehmen.', note: ''
};
export function requestProfileFor(slug: string): RequestProfile {
  if (['moebelmontage-berlin', 'kuechenmontage-berlin'].includes(slug)) return {
    ...general, kind: 'assembly', areaLabel: 'Möbel und Modelle', areaHint: '', areaPlaceholder: '',
    description: slug === 'moebelmontage-berlin' ? 'Welche Möbel und wie viele? Modell oder Produktlink, Aufbau oder Abbau und vorhandene Anleitung helfen uns weiter.' : 'Welche Küche soll aufgebaut werden? Hersteller, Plan, Maße und Lieferzustand helfen. Elektro- und Wasseranschlüsse werden gesondert geklärt.',
    photoHint: 'Hilfreich sind Pakete oder Möbel, Modellangaben und der Aufstellort. Persönliche Dokumente bitte weglassen.',
    note: 'Für eine Montage brauchen wir keine Angaben zum Füllgrad Ihrer Wohnung.'
  };
  if (['malerarbeiten-berlin', 'tapezieren-berlin'].includes(slug)) return {
    ...general, kind: 'surface', areaLabel: 'Welche Wand- oder Deckenfläche ist betroffen?',
    areaHint: 'Gemeint ist die zu bearbeitende Wand- oder Deckenfläche, nicht die Wohnfläche. Eine grobe Schätzung genügt; unbekannt ist auch in Ordnung.',
    areaPlaceholder: 'Zum Beispiel: 40 m² Wände und 15 m² Decke',
    description: slug === 'malerarbeiten-berlin' ? 'Welche Räume, Wände oder Decken sollen gestrichen werden? Nennen Sie Farbwechsel, Untergrund und ob Material schon vorhanden ist.' : 'Welche Tapete ist gewünscht? Raufaser, Vlies oder Muster? Müssen alte Tapeten entfernt werden, und ist Material vorhanden?',
    photoHint: 'Eine Raumübersicht und Details von Wandbelag, Ecken und Schäden sind hilfreich. Keine persönlichen Unterlagen fotografieren.',
    note: 'Maler- und Tapezierarbeiten werden gesondert mit einem geeigneten Fachbetrieb abgestimmt.'
  };
  if (['innenausbau-berlin','trockenbau-berlin','demontage-rueckbau','bodenbelag-verlegen-berlin'].includes(slug)) return {
    ...general, kind: 'project', areaLabel: slug === 'bodenbelag-verlegen-berlin' ? 'Wie groß ist die Bodenfläche?' : 'Welche Fläche oder welche Räume sind betroffen?',
    areaHint: 'Beschreiben Sie, worauf sich die Fläche bezieht. Maße können wir bei Bedarf gemeinsam klären.',
    areaPlaceholder: 'Zum Beispiel: 20 m² Boden oder eine 4 m lange Trennwand',
    description: 'Was möchten Sie verändern? Beschreiben Sie den jetzigen Zustand, das gewünschte Ergebnis und bereits geplante Arbeiten.',
    photoHint: 'Zeigen Sie die betroffenen Räume und Anschlussstellen. Ein vorhandener Plan kann später gemeinsam besprochen werden.',
    note: 'Wir klären zuerst Umfang und Zuständigkeiten. Erforderliche Facharbeiten werden gesondert abgestimmt.'
  };
  return general;
}
export const adviceProfile: RequestProfile = {
  ...general, kind: 'advice', description: 'Beschreiben Sie einfach, was ansteht und wobei Sie Unterstützung möchten. Sie müssen noch keine passende Leistung kennen.',
  note: 'Noch nicht sicher? Wir klären mit Ihnen, welcher Umfang zu Ihrem Vorhaben passt.'
};
