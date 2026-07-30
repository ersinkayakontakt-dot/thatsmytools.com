import type { FaqItem } from './types.ts';

/**
 * ÜBERGREIFENDE HÄUFIGE FRAGEN
 * ============================
 * Diese Fragen betreffen das Unternehmen und den Ablauf allgemein, nicht
 * eine einzelne Leistung. Leistungsspezifische Fragen stehen bei der
 * jeweiligen Leistung, damit keine doppelten Inhalte entstehen.
 *
 * Antworten sind bewusst so geschrieben, dass sie eigenständig zitierbar
 * sind (ca. 40–100 Wörter, keine Rückbezüge auf vorherige Absätze).
 */

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'anfrage',
    title: 'Anfrage und Angebot',
    items: [
      {
        q: 'Wie bekomme ich ein Angebot?',
        a: 'Auf zwei Wegen: Sie schicken uns Fotos aus jedem betroffenen Raum, oder wir vereinbaren eine Besichtigung. Fotos reichen bei überschaubaren Aufträgen. Bei kompletten Haushaltsauflösungen, Häusern mit Grundstück und stark zugestellten Wohnungen empfehlen wir eine Besichtigung, weil sich der Umfang auf Bildern regelmäßig zu harmlos darstellt.',
      },
      {
        q: 'Kostet die Besichtigung etwas?',
        a: 'Nein. Die Besichtigung und die Einschätzung sind kostenfrei und unverbindlich. Sie dauert je nach Objekt zwanzig bis sechzig Minuten. Danach wissen Sie, was der Einsatz kostet, was enthalten ist und wie lange er dauert.',
      },
      {
        q: 'Wie schnell bekomme ich eine Rückmeldung?',
        a: 'Wir melden uns so schnell wie möglich zurück. Eine feste Zusage wie "innerhalb von 30 Minuten" geben wir nicht, weil wir tagsüber im Einsatz sind und sie sich nicht zuverlässig halten ließe. Wenn es eilt, rufen Sie an, statt zu schreiben. Am Telefon bekommen Sie sofort eine Antwort.',
      },
      {
        q: 'Bekomme ich einen Festpreis?',
        a: 'Ja, nach einer Besichtigung oder einer vollständigen Fotoeinschätzung. Dann steht schriftlich fest, was enthalten ist und was der Einsatz kostet. Was wir nicht machen: einen Festpreis nennen, bevor jemand die Räume gesehen hat. Solche Zahlen halten in der Praxis nicht.',
      },
      {
        q: 'Was passiert, wenn am Einsatztag mehr da ist als besprochen?',
        a: 'Dann sprechen wir Sie an, bevor wir weiterarbeiten. Sie entscheiden, ob der Mehraufwand beauftragt wird. Was wir nicht tun: stillschweigend weiterräumen und die Mehrkosten anschließend auf die Rechnung setzen. Deshalb sind vollständige Fotos vorher so wichtig, besonders von Keller und Dachboden.',
      },
    ],
  },
  {
    id: 'ablauf',
    title: 'Ablauf und Termin',
    items: [
      {
        q: 'Wie kurzfristig ist ein Termin möglich?',
        a: 'Das hängt von Umfang und Auslastung ab. Kleine Abholungen lassen sich oft innerhalb weniger Tage einplanen, eine komplette Haushaltsauflösung braucht mehr Vorlauf. Rufen Sie an und nennen Sie Ihren Zeitrahmen, dann sagen wir Ihnen, was realistisch ist. Pauschale Zusagen wie "Termin in 24 Stunden" machen wir nicht.',
      },
      {
        q: 'Muss ich beim Einsatz dabei sein?',
        a: 'Nicht durchgehend. Jemand muss aufschließen und am Ende abnehmen. Sinnvoll ist, zu Beginn zwanzig Minuten dabei zu sein und zu zeigen, was bleibt. Danach genügt es, telefonisch erreichbar zu sein. Bei Aufträgen aus anderen Städten regeln wir die Schlüsselübergabe vorher schriftlich.',
      },
      {
        q: 'Arbeiten Sie auch am Wochenende?',
        a: 'Termine außerhalb üblicher Geschäftszeiten können individuell geprüft werden. Entscheidend sind Auslastung, Hausordnung, Lärmschutz und Zugang. Für einen konkreten Samstag oder Abend nennen Sie bitte Ihr Zeitfenster; möglich ist nur, was vorab ausdrücklich bestätigt wurde.',
      },
      {
        q: 'Was bedeutet besenrein?',
        a: 'Besenrein heißt: leer, gefegt, grober Schmutz entfernt. Es ist keine Endreinigung mit Reinigungsmitteln, kein Fensterputzen und keine Grundreinigung im Bad. Wenn Ihr Vermieter mehr verlangt, sagen Sie es bei der Anfrage, dann planen wir eine Reinigung als eigene Position ein.',
      },
    ],
  },
  {
    id: 'entsorgung',
    title: 'Entsorgung und Verwertung',
    items: [
      {
        q: 'Was passiert mit den Sachen aus meiner Wohnung?',
        a: 'Sie werden getrennt: Was sich weitergeben oder verwerten lässt, geht diesen Weg. Der Rest wird nach Materialart getrennt entsorgt, also Restmüll, Holz, Metall, Elektroaltgeräte, Matratzen und Bauschutt jeweils über den vorgesehenen Weg. Elektrogeräte gehen an zugelassene Sammelstellen.',
      },
      {
        q: 'Bekomme ich Geld für verwertbare Sachen?',
        a: 'Was sich weitergeben lässt, rechnen wir auf den Auftrag an und weisen es als eigene Position auf der Rechnung aus. Realistisch betrifft das nur einen Teil eines durchschnittlichen Haushalts. Dass die Anrechnung die Kosten vollständig deckt, ist die Ausnahme. Wir werben deshalb nicht mit kostenlosen Räumungen.',
      },
      {
        q: 'Was nehmen Sie nicht mit?',
        a: 'Farben, Lacke, Lösungsmittel und Altöl gehören zur Schadstoffsammlung. Autobatterien und Reifen nimmt der Handel oder ein Recyclinghof. Asbesthaltige Materialien dürfen nur zugelassene Fachbetriebe entsorgen. Medikamente und medizinischer Abfall gehen eigene Wege. Bei Unsicherheit schicken Sie ein Foto, dann klären wir es vorher.',
      },
      {
        q: 'Was passiert mit persönlichen Unterlagen und Fotos?',
        a: 'Wir sammeln sie getrennt und legen sie an einer mit Ihnen vereinbarten Stelle ab. Ausweise, Urkunden, Versicherungsunterlagen, Fotoalben und Briefe werden nicht entsorgt. Wenn Sie nicht vor Ort sein können, kommt alles in beschriftete Kisten, die Sie später in Ruhe durchsehen können.',
      },
    ],
  },
  {
    id: 'rechnung',
    title: 'Rechnung und Kostenträger',
    items: [
      {
        q: 'Ist eine Entrümpelung steuerlich absetzbar?',
        a: 'Für Privathaushalte kommt eine Anrechnung als haushaltsnahe Dienstleistung nach § 35a EStG in Betracht. Voraussetzung ist in der Regel eine Rechnung mit gesondert ausgewiesenem Arbeitslohn und unbare Zahlung, also Überweisung statt Bargeld. Wir weisen den Arbeitsanteil auf Wunsch getrennt aus. Die Beurteilung liegt bei Ihrem Finanzamt.',
      },
      {
        q: 'Übernimmt das Jobcenter, das Sozialamt oder die Pflegekasse die Kosten?',
        a: 'Eine Beteiligung ist je nach Einzelfall möglich. Entscheidend ist die Reihenfolge: erst Antrag stellen, Bewilligung abwarten, dann beauftragen. Wer zuerst beauftragt, bleibt meist auf den Kosten sitzen. Wir erstellen den Kostenvoranschlag in prüffähiger Form und helfen beim Zusammenstellen der Unterlagen. Über die Bewilligung entscheidet ausschließlich die zuständige Stelle.',
      },
      {
        q: 'Bekomme ich eine ordentliche Rechnung?',
        a: 'Sie erhalten eine Rechnung mit den vereinbarten Positionen. Ob Umsatzsteuer ausgewiesen wird oder ein anderer gesetzlicher Steuerhinweis erforderlich ist, richtet sich nach dem tatsächlichen steuerlichen Status des Unternehmens. Für Behörden oder Kostenträger kann der Kostenvoranschlag nach deren Vorgaben aufgeschlüsselt werden.',
      },
    ],
  },
];

/** Flache Liste aller FAQ – für JSON-LD auf der FAQ-Seite. */
export const allFaqItems: FaqItem[] = faqGroups.flatMap((g) => g.items);
