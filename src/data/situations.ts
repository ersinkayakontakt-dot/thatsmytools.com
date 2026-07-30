/**
 * EINSTIEG NACH KUNDENSITUATION
 * =============================
 * Menschen suchen selten nach "Entrümpelung Dienstleistung". Sie haben eine
 * Situation. Dieser Einstieg spricht die Situation an und führt von dort zur
 * passenden Seite.
 *
 * Reihenfolge = Reihenfolge auf der Startseite. Sie ist wirtschaftlich
 * sortiert: Komplettaufträge (ganze Wohnung, Nachlass, Wohnwechsel,
 * Objektübergabe) stehen oben. Einzelne Möbelstücke und Sperrmüll bleiben im
 * Angebot, bestimmen aber nicht mehr den ersten Eindruck – sie stehen weiter
 * unten auf der Startseite und auf einer eigenen Sammelseite.
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
    title: 'Eine Wohnung muss vollständig aufgelöst werden',
    text: 'Der Übergabetermin steht, die Wohnung ist noch voll. Wir planen rückwärts vom Termin und übergeben besenrein.',
    href: '/leistungen/wohnungsaufloesung-berlin/',
    icon: 'key',
  },
  {
    title: 'Ein Nachlass muss diskret organisiert werden',
    text: 'Unterlagen und Erinnerungsstücke werden vorher festgelegt und gesichert, nicht entsorgt. Die Termine richten sich nach Ihnen, auch wenn Sie nicht in Berlin wohnen.',
    href: '/leistungen/nachlassaufloesung-berlin/',
    icon: 'heart',
  },
  {
    title: 'Ein Seniorenumzug soll komplett begleitet werden',
    text: 'Einpacken, Transport, Aufbau und Einräumen in der neuen Wohnung – und die alte Wohnung übergabefertig hinterlassen.',
    href: '/leistungen/seniorenumzug-berlin/',
    icon: 'home',
  },
  {
    title: 'Eine Immobilie muss leer und übergabefertig werden',
    text: 'Räumung, Keller und Nebenräume, Reinigung und Fotoprotokoll bis zur Schlüsselübergabe an Eigentümer, Verwaltung oder Makler.',
    href: '/leistungen/wohnungsaufloesung-berlin/',
    icon: 'doc',
  },
  {
    title: 'Eine Hausverwaltung braucht einen Räumungspartner',
    text: 'Feste Ansprechperson, nachvollziehbare Leistungspositionen, Schlüsselübernahme und Rechnung an das Unternehmen.',
    href: '/hausverwaltungen-immobilienpartner/',
    icon: 'building',
  },
  {
    title: 'Ein Haushalt muss während einer Renovierung ausgelagert werden',
    text: 'Abbau, Zwischenlagerung und Rücktransport nach der Renovierung – in einem Auftrag geplant statt in drei Terminen.',
    href: '/leistungen/umzug-berlin/',
    icon: 'boxes',
  },
];
