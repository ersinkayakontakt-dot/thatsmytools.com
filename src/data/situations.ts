/**
 * EINSTIEG NACH KUNDENSITUATION
 * =============================
 * Menschen suchen selten nach "Entrümpelung Dienstleistung". Sie haben eine
 * Situation. Dieser Einstieg spricht die Situation an und führt von dort zur
 * passenden Seite.
 *
 * Reihenfolge = Reihenfolge auf der Startseite.
 */

export interface Situation {
  /** In der Ich-Perspektive der Kundschaft formuliert. */
  title: string;
  /** Ein Satz, der zeigt, dass die Situation verstanden ist. */
  text: string;
  href: string;
  /** Icon-Schlüssel */
  icon: string;
}

export const situations: Situation[] = [
  {
    title: 'Eine Wohnung muss komplett leer werden',
    text: 'Übergabetermin steht fest, die Wohnung ist noch voll. Wir planen rückwärts vom Termin.',
    href: '/leistungen/wohnungsaufloesung-berlin/',
    icon: 'key',
  },
  {
    title: 'Wir lösen den Haushalt eines Angehörigen auf',
    text: 'Unterlagen und Erinnerungsstücke werden gesichert, nicht entsorgt. Termine richten sich nach Ihnen.',
    href: '/leistungen/nachlassaufloesung-berlin/',
    icon: 'heart',
  },
  {
    title: 'Keller oder Dachboden sind voll',
    text: 'Einzelne Abteile oder ganze Kellergeschosse, auch mehrere in einem Termin.',
    href: '/leistungen/kellerentruempelung-berlin/',
    icon: 'stairs',
  },
  {
    title: 'Ich brauche kurzfristig einen Transport',
    text: 'Einzelne Möbel, Sperrmüll oder Elektrogeräte direkt aus der Wohnung, nicht nur vom Bordstein.',
    href: '/leistungen/sperrmuellabholung-berlin/',
    icon: 'truck',
  },
  {
    title: 'Eine vermüllte Wohnung muss diskret geräumt werden',
    text: 'Unauffällige Anfahrt, keine Kommentare im Haus, keine Fotos nach außen.',
    href: '/leistungen/messiwohnung-raeumen/',
    icon: 'shield',
  },
  {
    title: 'Ein Büro oder Gewerberaum muss übergeben werden',
    text: 'Auch außerhalb der Geschäftszeiten. Akten und Datenträger werden gesondert behandelt.',
    href: '/leistungen/bueroaufloesung-berlin/',
    icon: 'building',
  },
  {
    title: 'Ein Umzug steht an',
    text: 'Von der Halteverbotszone bis zum Aufbau am Zielort. Innerhalb Berlins und ins Umland.',
    href: '/leistungen/umzug-berlin/',
    icon: 'boxes',
  },
  {
    title: 'Meine Eltern ziehen in eine kleinere Wohnung oder ins Heim',
    text: 'Mehr Zeit für Absprachen, Einrichten am Zielort, auf Wunsch Auflösung der alten Wohnung.',
    href: '/leistungen/seniorenumzug-berlin/',
    icon: 'people',
  },
];
