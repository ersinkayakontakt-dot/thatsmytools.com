import type { Guide } from './types.ts';

/**
 * RATGEBER UND KOSTENSEITEN
 * =========================
 * Wenige, dafür wirklich hilfreiche Inhalte statt vieler dünner Artikel.
 *
 * Jeder Text beantwortet die Hauptfrage direkt unter der H1 (Feld `answer`,
 * 40–100 Wörter). Das ist der Absatz, den Antwortsysteme zitieren können.
 *
 * Preise stehen bewusst nirgends als Zahl, solange keine ausgewerteten
 * Auftragsdaten vorliegen (siehe src/data/costs.ts).
 */

export const guides: Guide[] = [
  /* ============================ KOSTEN ============================== */
  {
    slug: 'was-kostet-eine-entruempelung-in-berlin',
    status: 'published',
    hub: 'kosten',
    h1: 'Was kostet eine Entrümpelung in Berlin?',
    navLabel: 'Kosten Entrümpelung',
    metaTitle: 'Was kostet eine Entrümpelung in Berlin? Die Faktoren erklärt',
    metaDescription:
      'Wie sich der Preis einer Entrümpelung in Berlin zusammensetzt: Volumen, Etage, Trageweg, Materialart und Zusatzarbeiten. Mit Hinweisen zu unseriösen Angeboten.',
    answer:
      'Der Preis einer Entrümpelung in Berlin ergibt sich aus fünf Größen: dem Volumen in Kubikmetern, der Etage und ob ein Aufzug vorhanden ist, der Länge des Trageweges bis zum Fahrzeug, der Art des Materials und den nötigen Zusatzarbeiten. Verwertbares wird gegengerechnet. Eine seriöse Zahl entsteht erst nach Fotos oder einer Besichtigung, weil sich das Volumen von außen nicht zuverlässig schätzen lässt.',
    teaser: 'Woraus sich der Preis zusammensetzt und woran Sie ein unseriöses Angebot erkennen.',
    blocks: [
      {
        h: 'Warum wir hier keine Pauschalpreise nennen',
        p: [
          'Auf vielen Websites stehen Preistabellen der Art "2-Zimmer-Wohnung ab 690 Euro". Solche Zahlen sind bequem, aber sie sagen wenig, weil sie den entscheidenden Faktor auslassen: wie viel tatsächlich in der Wohnung ist.',
          'Wir nennen deshalb keine Beträge, die wir nicht aus echten abgerechneten Aufträgen belegen können. Sobald genügend ausgewertete Aufträge vorliegen, veröffentlichen wir Spannen an dieser Stelle, zusammen mit der Fallzahl, dem Zeitraum und dem, was in diesen Aufträgen enthalten war.',
          'Was Sie stattdessen hier finden: die vollständige Logik, nach der kalkuliert wird. Damit können Sie jedes Angebot prüfen, auch das von anderen Betrieben.',
        ],
      },
      {
        h: 'Die fünf Faktoren im Einzelnen',
        steps: [
          {
            title: 'Volumen in Kubikmetern',
            text: 'Der bestimmende Faktor. Gerechnet wird, wie viele Kubikmeter herausgetragen und entsorgt werden. Ein voller Kleiderschrank sind rund zwei Kubikmeter, eine typische Zweizimmerwohnung liegt je nach Füllgrad zwischen 15 und 45 Kubikmetern. Quadratmeter sagen darüber nichts aus.',
          },
          {
            title: 'Etage und Aufzug',
            text: 'Jeder Kubikmeter wird von Hand bewegt. Ohne Aufzug steigt die Arbeitszeit pro Kubikmeter mit jeder Etage. Das ist der Grund, warum wir bei jeder Anfrage zuerst nach Etage und Aufzug fragen.',
          },
          {
            title: 'Trageweg und Halteposition',
            text: 'Vom Hauseingang zum Fahrzeug. In Berliner Innenstadtlagen sind 50 bis 100 Meter normal, wenn keine Halteverbotszone eingerichtet ist. Bei 30 Kubikmetern bedeutet das mehrere Kilometer zusätzlichen Weg.',
          },
          {
            title: 'Art des Materials',
            text: 'Restmüll, Sperrmüll, Holz, Elektroaltgeräte, Matratzen, Metall und Bauschutt gehen über getrennte Entsorgungswege mit unterschiedlichen Gebühren. Bauschutt wird nach Gewicht abgerechnet und ist deshalb pro Kubikmeter besonders teuer.',
          },
          {
            title: 'Zusatzarbeiten',
            text: 'Küche demontieren, Teppichboden aufnehmen, Einbauschrank ausbauen, Lampen abklemmen, Dübel entfernen. Diese Positionen sollten im Angebot einzeln stehen, nicht in einer Pauschale verschwinden.',
          },
        ],
      },
      {
        h: 'Wie Wertanrechnung wirklich funktioniert',
        p: [
          'Verwertbares senkt den Rechnungsbetrag. In der Praxis betrifft das gut erhaltene Möbel, funktionierende Elektrogeräte, Werkzeug, Fahrräder und Metall. Der angerechnete Betrag sollte als eigene Position auf der Rechnung stehen.',
          'Vorsicht bei Angeboten, die mit "kostenloser Entrümpelung bei Wertanrechnung" werben. Dass der Wert eines durchschnittlichen Haushalts die Kosten einer Räumung deckt, ist selten. Wer damit wirbt, muss den Wert am Einsatztag irgendwo wieder hereinholen, häufig über Nachforderungen.',
        ],
      },
      {
        h: 'Woran Sie ein unseriöses Angebot erkennen',
        list: [
          'Ein Festpreis wird am Telefon genannt, ohne dass jemand Fotos gesehen oder die Wohnung besichtigt hat.',
          'Der Preis ist auffällig niedriger als bei allen anderen und wird mit Wertanrechnung begründet.',
          'Das Angebot besteht aus einer einzigen Zeile ohne aufgeschlüsselte Positionen.',
          'Auf Nachfrage nach Versicherungsschutz und Entsorgungsweg kommt keine konkrete Antwort.',
          'Es gibt kein vollständiges Impressum mit ladungsfähiger Anschrift.',
          'Es wird auf sofortige Beauftragung gedrängt oder mit angeblich knappen Terminen gearbeitet.',
          'Anzahlung in bar vor Beginn wird verlangt, ohne dass ein schriftlicher Auftrag vorliegt.',
        ],
        note: {
          title: 'Der wichtigste Punkt',
          text: 'Lassen Sie sich vor Beginn schriftlich geben, was enthalten ist und was zusätzlich berechnet wird. Ein seriöser Betrieb hat damit kein Problem.',
          tone: 'info',
        },
      },
      {
        h: 'Wie Sie den Preis selbst beeinflussen können',
        list: [
          'Beim Termin flexibel sein: Ein Dienstag Mitte des Monats ist günstiger als der Monatsletzte.',
          'Vollständige Fotos schicken, inklusive Keller, Dachboden und Balkon. Das verhindert Nachträge.',
          'Selbst vorsortieren, was verkauft, verschenkt oder mitgenommen wird.',
          'Halteverbotszone rechtzeitig beantragen, statt am Einsatztag Zeit im Trageweg zu verlieren.',
          'Mehrere Räume oder Abteile in einem Termin zusammenlegen statt einzeln beauftragen.',
          'Klären, ob wirklich alles weg muss. Ein Teilauftrag ist günstiger als eine Vollräumung.',
        ],
      },
    ],
    faq: [
      {
        q: 'Kann ich einen Festpreis bekommen?',
        a: 'Ja, nach einer Besichtigung oder einer vollständigen Fotoeinschätzung. Dann halten wir schriftlich fest, was enthalten ist und was der Einsatz kostet. Was wir nicht machen: einen Festpreis am Telefon nennen, bevor jemand die Räume gesehen hat. Solche Zahlen halten in der Praxis nicht und führen zu Nachforderungen.',
      },
      {
        q: 'Ist eine Entrümpelung steuerlich absetzbar?',
        a: 'Für Privathaushalte kommt eine Anrechnung als haushaltsnahe Dienstleistung nach § 35a EStG in Betracht. Voraussetzung ist in der Regel eine Rechnung mit ausgewiesenem Arbeitslohn und unbare Zahlung, also Überweisung statt Bargeld. Wir weisen den Arbeitsanteil auf Wunsch gesondert aus. Die steuerliche Beurteilung liegt bei Ihrem Finanzamt oder Steuerberater.',
      },
      {
        q: 'Was kostet es, wenn mehr da ist als gedacht?',
        a: 'Wenn am Einsatztag deutlich mehr Volumen auftaucht als in der Einschätzung, sprechen wir Sie an, bevor wir weiterarbeiten. Sie entscheiden dann, ob der Mehraufwand beauftragt wird. Was wir nicht tun: stillschweigend weiterräumen und die Mehrkosten auf die Rechnung setzen.',
      },
      {
        q: 'Warum ist Bauschutt so teuer?',
        a: 'Bauschutt wird nach Gewicht abgerechnet, nicht nach Volumen. Ein Kubikmeter Fliesen oder Beton wiegt ein Vielfaches eines Kubikmeters Sperrmüll. Dazu kommen andere Entsorgungswege und höhere Deponiegebühren. Deshalb sollte Bauschutt bei der Anfrage immer gesondert genannt werden.',
      },
    ],
    related: ['kosten-haushaltsaufloesung-berlin', 'welche-fotos-fuer-ein-angebot', 'entruempelung-vorbereiten'],
    services: ['entruempelung-berlin', 'kellerentruempelung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'kosten-haushaltsaufloesung-berlin',
    status: 'published',
    hub: 'kosten',
    h1: 'Was kostet eine Haushaltsauflösung in Berlin?',
    navLabel: 'Kosten Haushaltsauflösung',
    metaTitle: 'Kosten Haushaltsauflösung Berlin: Aufwand und Wertanrechnung',
    metaDescription:
      'Wovon der Preis einer Haushaltsauflösung in Berlin abhängt, warum der Sortieraufwand entscheidend ist und was Wertanrechnung realistisch bringt.',
    answer:
      'Bei einer Haushaltsauflösung entsteht der größte Kostenblock nicht durch das Tragen, sondern durch das Sortieren. Der Preis hängt vom Volumen, vom Sichtungsaufwand, von Etage und Aufzug sowie von den Nebenräumen ab. Keller, Dachboden und Garage werden regelmäßig vergessen und machen häufig ein Drittel des Volumens aus. Verwertbares wird angerechnet, deckt die Kosten aber nur in Ausnahmefällen.',
    teaser: 'Warum der Sortieraufwand mehr kostet als das Tragen und was Wertanrechnung wirklich bringt.',
    blocks: [
      {
        h: 'Der Unterschied zur reinen Entrümpelung',
        p: [
          'Bei einer Entrümpelung ist vorher klar, dass alles weg soll. Bei einer Haushaltsauflösung ist genau das die Frage. Jeder Schrank wird geöffnet, jede Schublade durchgesehen, jedes Kästchen geprüft. Das dauert.',
          'In der Kalkulation heißt das: Zwei Aufträge mit identischem Volumen können sich im Preis deutlich unterscheiden, wenn bei einem sortiert werden muss und beim anderen nicht. Wer eine Haushaltsauflösung mit einem reinen Entrümpelungspreis vergleicht, vergleicht zwei verschiedene Leistungen.',
        ],
      },
      {
        h: 'Welche Positionen in ein Angebot gehören',
        table: {
          caption: 'Ein prüffähiges Angebot für eine Haushaltsauflösung',
          head: ['Position', 'Wonach abgerechnet wird', 'Sollte im Angebot stehen'],
          rows: [
            ['Räumung und Sortierung', 'Arbeitsstunden × Personenanzahl', 'Ja, mit geplanter Stundenzahl'],
            ['Abtransport', 'Anzahl Fahrten und Fahrzeuggröße', 'Ja'],
            ['Entsorgung', 'Kubikmeter oder Tonnen je Fraktion', 'Ja, getrennt nach Materialart'],
            ['Demontage', 'Aufwand je Einbaute', 'Ja, einzeln aufgeführt'],
            ['Besenreine Übergabe', 'Pauschal oder nach Fläche', 'Ja, wenn beauftragt'],
            ['Wertanrechnung', 'Gutschrift', 'Ja, als eigene Position mit Betrag'],
            ['Anfahrt', 'Pauschal oder nach Entfernung', 'Ja'],
          ],
        },
        p: [
          'Wenn ein Angebot nur aus einer Zeile und einer Summe besteht, fragen Sie nach der Aufschlüsselung. Nicht, weil die Summe falsch sein muss, sondern weil Sie sonst nicht prüfen können, was passiert, wenn sich etwas ändert.',
        ],
      },
      {
        h: 'Was Wertanrechnung realistisch einbringt',
        p: [
          'Anrechenbar ist, was sich tatsächlich weitergeben lässt: gut erhaltene, gängige Möbel, funktionierende Haushaltsgeräte jüngeren Datums, Werkzeug, Fahrräder, Metall.',
          'Nicht anrechenbar ist der Großteil dessen, was in einem durchschnittlichen Haushalt steht. Massivholzschränke aus den Siebzigern, Polstermöbel, Geschirr, Bücher und Kleidung haben auf dem Gebrauchtmarkt kaum noch Wert, obwohl sie in gutem Zustand sind.',
          'Realistisch ist deshalb: Die Wertanrechnung reduziert den Betrag, sie hebt ihn selten auf. Wenn Ihnen jemand vorab eine kostenlose Auflösung in Aussicht stellt, ohne die Wohnung gesehen zu haben, ist Skepsis angebracht.',
        ],
      },
      {
        h: 'Nebenräume sind der häufigste Kalkulationsfehler',
        p: [
          'Wenn eine Einschätzung am Einsatztag nicht mehr stimmt, liegt es fast immer an Räumen, die bei der Anfrage nicht erwähnt wurden. In der Reihenfolge ihrer Häufigkeit: Keller, Dachboden, Balkon, Garage, Gartenhaus, Abstellraum im Treppenhaus.',
          'Das ist kein Vorwurf. Man denkt bei einer Wohnung an die Wohnung. Aber ein voller Kellerraum kann leicht ein Drittel des Gesamtvolumens ausmachen. Schicken Sie Fotos von allem, was zur Wohnung gehört.',
        ],
      },
      {
        h: 'Wer die Kosten trägt',
        list: [
          'Bei einer Mietwohnung: die Person, die den Mietvertrag hat, oder bei einem Erbfall die Erbengemeinschaft.',
          'Bei einem Nachlass: Die Kosten sind Nachlassverbindlichkeiten und werden aus dem Nachlass beglichen, soweit er reicht.',
          'Bei einer Erbausschlagung: Nicht die ausschlagenden Erben, sondern das Nachlassgericht bzw. der Nachlasspfleger regelt die weitere Abwicklung.',
          'Bei Einzug ins Pflegeheim: Je nach Fall kommt eine Beteiligung des Sozialamts in Betracht, immer nur nach vorheriger Antragstellung.',
          'Bei Zwangsräumung: Zunächst der Gläubiger, der die Räumung betreibt, mit Kostenerstattungsanspruch gegen den Schuldner.',
        ],
        note: {
          title: 'Vor der Beauftragung klären',
          text: 'Wenn ein Kostenträger beteiligt sein soll, muss der Antrag vor der Beauftragung gestellt und bewilligt sein. Wer zuerst beauftragt, bleibt in der Regel auf den Kosten sitzen.',
          tone: 'caution',
        },
      },
    ],
    faq: [
      {
        q: 'Ist eine Haushaltsauflösung teurer als eine Entrümpelung?',
        a: 'Bei gleichem Volumen in der Regel ja, weil der Sortieraufwand dazukommt. Der Unterschied liegt in der Arbeitszeit vor Ort, nicht im Abtransport. Wenn Sie selbst vorsortieren und nur noch abgeräumt werden muss, nähert sich der Preis dem einer Entrümpelung an.',
      },
      {
        q: 'Kann ich die Kosten aus dem Nachlass bezahlen?',
        a: 'Ja, Auflösungskosten gehören zu den Nachlassverbindlichkeiten und werden aus dem Nachlass beglichen, soweit dieser reicht. Für die Abwicklung brauchen Sie eine Rechnung mit einzeln ausgewiesenen Positionen. Bei einer Erbengemeinschaft sollten sich alle Beteiligten vorher über die Beauftragung einig sein.',
      },
      {
        q: 'Was ist mit Möbeln, die noch gut sind?',
        a: 'Was sich weitergeben lässt, rechnen wir an und weisen es auf der Rechnung aus. Realistisch betrifft das nur einen Teil des Hausrats. Wenn Ihnen einzelne Stücke wichtig sind, verkaufen oder verschenken Sie sie vor der Auflösung selbst, dafür erzielen Sie meist mehr als über die Anrechnung.',
      },
      {
        q: 'Wie lange im Voraus sollte ich anfragen?',
        a: 'Für eine Haushaltsauflösung planen Sie am besten zwei bis vier Wochen ein. Diese Zeit brauchen Sie ohnehin, um Unterlagen zu sichten und zu entscheiden, was bleiben soll. Wenn ein Übergabetermin drängt, sagen Sie das bei der ersten Anfrage, dann richten wir die Planung danach aus.',
      },
    ],
    related: ['was-kostet-eine-entruempelung-in-berlin', 'haushaltsaufloesung-nach-todesfall', 'checkliste-wohnungsuebergabe'],
    services: ['haushaltsaufloesung-berlin', 'nachlassaufloesung-berlin', 'wohnungsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'kosten-sperrmuellabholung-berlin',
    status: 'published',
    hub: 'kosten',
    h1: 'Was kostet eine Sperrmüllabholung in Berlin?',
    navLabel: 'Kosten Sperrmüll',
    metaTitle: 'Sperrmüll Berlin: Kosten, BSR-Abholung und private Abholung',
    metaDescription:
      'Sperrmüllentsorgung in Berlin im Vergleich: BSR-Abholung, Recyclinghof und private Abholung aus der Wohnung. Wann sich welcher Weg lohnt.',
    answer:
      'Für Sperrmüll in Berlin gibt es drei Wege: die kostenpflichtige Abholung durch die BSR, die Selbstanlieferung auf einem Recyclinghof und die private Abholung aus der Wohnung. Die BSR ist am günstigsten, verlangt aber Bereitstellung an zugänglicher Stelle und hat Wartezeiten. Die private Abholung kostet mehr, holt dafür aus jeder Etage ab und ist kurzfristiger planbar.',
    teaser: 'BSR, Recyclinghof oder private Abholung: Was wann der sinnvollere Weg ist.',
    blocks: [
      {
        h: 'Die drei Wege im Vergleich',
        table: {
          caption: 'Sperrmüllentsorgung in Berlin',
          head: ['Weg', 'Kosten', 'Sie müssen', 'Sinnvoll wenn'],
          rows: [
            [
              'BSR-Abholung',
              'kostenpflichtig, günstigster Weg',
              'Sperrmüll zur vereinbarten Zeit bereitstellen',
              'Sie tragen können und Zeit haben zu warten',
            ],
            [
              'Recyclinghof',
              'für Privathaushalte in bestimmtem Umfang kostenfrei',
              'selbst transportieren',
              'Sie ein passendes Fahrzeug haben',
            ],
            [
              'Private Abholung',
              'am teuersten',
              'nichts, wir holen aus der Wohnung',
              'Tragen nicht möglich oder es eilt',
            ],
          ],
        },
        p: [
          'Die aktuellen Gebühren und Bedingungen der BSR ändern sich, deshalb nennen wir hier keine Beträge, sondern verweisen auf die offiziellen Angaben der Berliner Stadtreinigung. Prüfen Sie beide Wege, bevor Sie beauftragen. Wenn die BSR für Ihre Situation passt, sagen wir Ihnen das auch.',
        ],
      },
      {
        h: 'Wann sich eine private Abholung wirklich lohnt',
        list: [
          'Wenn das Stück aus einer oberen Etage muss und Sie es nicht tragen können',
          'Wenn ein Übergabetermin drängt und Sie nicht auf einen BSR-Termin warten können',
          'Wenn verschiedene Materialarten zusammenkommen, die getrennt entsorgt werden müssen',
          'Wenn ein Möbelstück zerlegt werden muss, um durch die Tür zu passen',
          'Wenn Elektrogroßgeräte dabei sind, die stehend transportiert werden müssen',
          'Wenn die Menge zu groß für den eigenen Pkw, aber zu klein für einen Container ist',
        ],
      },
      {
        h: 'Was den Preis einer privaten Abholung bestimmt',
        steps: [
          {
            title: 'Mindestpauschale',
            text: 'Anfahrt, Fahrzeug und zwei Personen fallen auch für ein einzelnes Sofa an. Deshalb gibt es eine Untergrenze, unterhalb derer eine Abholung nicht wirtschaftlich ist.',
          },
          {
            title: 'Menge über der Pauschale',
            text: 'Darüber wird nach Volumen gerechnet. Mehrere Stücke in einem Termin sind pro Stück deutlich günstiger als einzelne Fahrten.',
          },
          {
            title: 'Etage und Aufzug',
            text: 'Der Unterschied zwischen Erdgeschoss und viertem Stock ohne Aufzug ist bei einem Kleiderschrank erheblich.',
          },
          {
            title: 'Demontage',
            text: 'Wenn ein Stück zerlegt werden muss, kommt Arbeitszeit dazu. Bei Schrankwänden und Boxspringbetten ist das die Regel.',
          },
          {
            title: 'Terminbindung',
            text: 'Ein flexibler Zeitraum lässt sich mit anderen Fahrten in Ihrer Gegend kombinieren und ist günstiger als ein fester Wunschtermin.',
          },
        ],
      },
      {
        h: 'Was nicht in den Sperrmüll darf',
        list: [
          'Farben, Lacke, Lösungsmittel und Altöl gehören zur Schadstoffsammlung',
          'Autobatterien und Reifen nimmt der Handel oder ein Recyclinghof',
          'Asbesthaltige Platten dürfen nur zugelassene Fachbetriebe entsorgen',
          'Medikamente gehören in die Apotheke oder den Restmüll, nicht in den Sperrmüll',
          'Elektrogeräte werden getrennt gesammelt, nicht mit dem Sperrmüll',
          'Bauschutt in größeren Mengen braucht einen eigenen Container',
        ],
      },
    ],
    faq: [
      {
        q: 'Ist die BSR-Abholung immer günstiger?',
        a: 'In den Gebühren ja, in der Gesamtrechnung nicht immer. Wenn Sie das Stück nicht selbst nach unten tragen können, brauchen Sie Hilfe, und die kostet ebenfalls. Wenn ein Übergabetermin drängt, kann die Wartezeit auf einen Termin teurer werden als die Abholung. Prüfen Sie beides für Ihre Situation.',
      },
      {
        q: 'Nehmen Sie einzelne Möbelstücke mit?',
        a: 'Ja, dafür gilt eine Mindestpauschale, weil Anfahrt und Personal auch für ein einzelnes Sofa anfallen. Wenn Sie beim Termin flexibel sind, kombinieren wir die Abholung mit einer anderen Fahrt in Ihrer Gegend, das ist günstiger als ein fester Wunschtermin.',
      },
      {
        q: 'Was kostet die Entsorgung einer Matratze?',
        a: 'Matratzen werden getrennt entsorgt und nach Stück berechnet. Sie sind sperrig, lassen sich nicht gut stapeln und gehen über einen eigenen Entsorgungsweg. Bei einer Abholung zusammen mit anderen Möbeln fällt der Aufwand kaum ins Gewicht, als Einzelabholung greift die Mindestpauschale.',
      },
    ],
    related: ['was-kostet-eine-entruempelung-in-berlin'],
    services: ['sperrmuellabholung-berlin', 'kellerentruempelung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'kosten-seniorenumzug-berlin',
    status: 'published',
    hub: 'kosten',
    h1: 'Was kostet ein Seniorenumzug in Berlin?',
    navLabel: 'Kosten Seniorenumzug',
    metaTitle: 'Kosten Seniorenumzug Berlin: Umfang, Zuschüsse, Reihenfolge',
    metaDescription:
      'Was einen Seniorenumzug in Berlin teurer oder günstiger macht, wann Pflegekasse oder Sozialamt beteiligt sein können und welche Reihenfolge Sie einhalten müssen.',
    answer:
      'Ein Seniorenumzug kostet weniger als ein normaler Wohnungsumzug, wenn nur ein Zimmer ins Heim mitkommt, und mehr, wenn zusätzlich beraten, eingerichtet und anschließend die alte Wohnung aufgelöst wird. Eine Beteiligung von Pflegekasse oder Sozialamt ist je nach Einzelfall möglich, setzt aber immer voraus, dass der Antrag vor der Beauftragung gestellt und bewilligt wurde.',
    teaser: 'Was den Preis bestimmt und in welcher Reihenfolge Sie bei Kostenträgern vorgehen müssen.',
    blocks: [
      {
        h: 'Drei typische Fälle mit sehr unterschiedlichem Aufwand',
        steps: [
          {
            title: 'Umzug ins Pflegeheim',
            text: 'Meist nur ein Zimmer: Bett, Schrank, Sessel, persönliche Dinge. Der reine Transport ist klein. Zeit kostet das Einrichten vor Ort und die anschließende Auflösung der alten Wohnung.',
          },
          {
            title: 'Umzug ins betreute Wohnen',
            text: 'Eine kleinere, vollständige Wohnung. Vergleichbar mit einem normalen Umzug, aber mit mehr Absprache darüber, was mitkommt und was nicht.',
          },
          {
            title: 'Umzug in eine kleinere Mietwohnung',
            text: 'Der aufwendigste Fall, weil in der Regel etwa die Hälfte des Hausrats bleibt und getrennt entsorgt oder verwertet werden muss.',
          },
        ],
      },
      {
        h: 'Was den Preis nach oben treibt',
        list: [
          'Wenn erst am Umzugstag entschieden wird, was mitkommt. Das kostet Arbeitszeit für das ganze Team.',
          'Etagen ohne Aufzug an einer oder beiden Adressen.',
          'Sehr große alte Möbel, die im neuen Zuhause keinen Platz finden und trotzdem transportiert werden.',
          'Ein enges Zeitfenster für den Einzug ins Heim, weil dann parallel gearbeitet werden muss.',
        ],
      },
      {
        h: 'Was den Preis senkt',
        list: [
          'Vor dem Termin gemeinsam festlegen, was mitkommt, und die Stücke markieren.',
          'Umzug und Wohnungsauflösung als einen Auftrag planen: Fahrten und Team lassen sich zusammenlegen.',
          'Einen Termin unter der Woche und nicht zum Monatswechsel wählen.',
          'Kleidung und Kleinteile vorher in beschriftete Kartons packen, wenn das möglich ist.',
        ],
      },
      {
        h: 'Pflegekasse, Sozialamt, Jobcenter: die Reihenfolge entscheidet',
        p: [
          'Wenn ein Kostenträger beteiligt sein soll, gilt in aller Regel: erst Antrag, dann Bewilligung, dann Beauftragung. Wer diese Reihenfolge umdreht, bekommt die Kosten häufig nicht erstattet, auch wenn die Voraussetzungen sonst vorgelegen hätten.',
          'Was Sie dafür brauchen, ist meist ein Kostenvoranschlag in prüffähiger Form, teils mehrere Vergleichsangebote. Wir erstellen den Kostenvoranschlag so, dass er bei der jeweiligen Stelle eingereicht werden kann, und helfen beim Zusammenstellen der Unterlagen.',
          'Was wir nicht tun: eine Kostenübernahme zusagen. Darüber entscheidet ausschließlich die zuständige Stelle nach Prüfung Ihres Einzelfalls.',
        ],
        note: {
          title: 'Fristen im Blick behalten',
          text: 'Bearbeitungszeiten bei Kostenträgern können mehrere Wochen betragen. Wenn ein Heimplatz zu einem festen Datum frei wird, stellen Sie den Antrag so früh wie möglich.',
          tone: 'caution',
        },
      },
    ],
    faq: [
      {
        q: 'Zahlt die Pflegekasse den Umzug ins Heim?',
        a: 'Die Pflegeversicherung kennt Zuschüsse für wohnumfeldverbessernde Maßnahmen, die je nach Situation auch einen pflegebedingten Umzug betreffen können. Ob das in Ihrem Fall greift, hängt vom Einzelfall ab und entscheidet die Kasse. Wichtig ist die Antragstellung vor der Beauftragung. Wir liefern den Kostenvoranschlag dafür.',
      },
      {
        q: 'Brauche ich mehrere Angebote?',
        a: 'Wenn ein Kostenträger beteiligt ist, verlangen viele Stellen zwei oder drei Vergleichsangebote. Fragen Sie bei der zuständigen Stelle nach, wie viele nötig sind und in welcher Form sie eingereicht werden müssen, bevor Sie die Angebote einholen.',
      },
      {
        q: 'Können Sie die alte Wohnung gleich mit auflösen?',
        a: 'Ja, und in einem Auftrag geplant ist es meist günstiger, weil Fahrten und Team zusammengelegt werden können. Wir empfehlen, ein paar Tage zwischen Umzug und Räumung zu lassen. Erfahrungsgemäß fällt in den ersten Tagen im neuen Zuhause auf, dass noch etwas fehlt.',
      },
    ],
    related: ['kosten-haushaltsaufloesung-berlin', 'checkliste-wohnungsuebergabe'],
    services: ['seniorenumzug-berlin', 'umzug-berlin', 'haushaltsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* =========================== RATGEBER ============================= */
  {
    slug: 'welche-fotos-fuer-ein-angebot',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Welche Fotos brauchen wir für ein Angebot?',
    navLabel: 'Die richtigen Fotos',
    metaTitle: 'Welche Fotos brauchen wir für ein Angebot? Anleitung',
    metaDescription:
      'Anleitung für Fotos, mit denen sich eine Entrümpelung oder ein Umzug zuverlässig einschätzen lässt. Was fotografiert werden muss und was oft vergessen wird.',
    answer:
      'Für eine belastbare Einschätzung brauchen wir pro Raum ein Übersichtsfoto von der Tür aus, geöffnete Schränke, alle Nebenräume wie Keller, Dachboden und Balkon, das Treppenhaus und die Straße vor dem Haus. Zwölf gute Fotos genügen meistens. Fehlt der Keller, verschiebt sich der Aufwand am Einsatztag und damit auch der Preis.',
    teaser: 'Zwölf Fotos genügen. Diese zwölf sollten es sein.',
    blocks: [
      {
        h: 'Die Foto-Checkliste',
        steps: [
          {
            title: 'Ein Übersichtsfoto pro Raum',
            text: 'Von der Tür aus, mit Blick in den Raum. Wichtig ist, dass der ganze Raum drauf ist, nicht ein Detail. Bei großen Räumen zwei Aufnahmen aus gegenüberliegenden Ecken.',
          },
          {
            title: 'Volle Schränke geöffnet',
            text: 'Ein Kleiderschrank sieht von außen aus wie ein Kleiderschrank. Ob er voll oder leer ist, macht mehrere Kubikmeter Unterschied. Türen auf, ein Foto pro Schrank.',
          },
          {
            title: 'Keller, Dachboden, Balkon',
            text: 'Der häufigste Grund, warum eine Einschätzung nicht mehr stimmt. Auch wenn es dort dunkel und unordentlich ist: fotografieren Sie es.',
          },
          {
            title: 'Das Treppenhaus',
            text: 'Ein Foto vom Treppenhaus aus dem Stockwerk der Wohnung nach unten. Wir sehen daran Breite, Wendelung und ob ein Aufzug vorhanden ist.',
          },
          {
            title: 'Der Hauseingang',
            text: 'Zeigt, wie breit die Tür ist und ob Stufen zu überwinden sind.',
          },
          {
            title: 'Die Straße vor dem Haus',
            text: 'Ein Foto aus dem Fenster oder von der gegenüberliegenden Straßenseite. Daran beurteilen wir, ob eine Halteverbotszone nötig ist und wie weit das Fahrzeug entfernt stehen muss.',
          },
        ],
      },
      {
        h: 'Was zusätzlich hilft',
        list: [
          'Ein Foto von allem, was besonders schwer oder sperrig ist: Klavier, Tresor, großes Aquarium, Werkbank',
          'Ein Foto der Einbauküche, wenn sie ausgebaut werden soll',
          'Ein Foto vom Bodenbelag, wenn Teppich aufgenommen werden soll',
          'Bei Häusern zusätzlich Garage, Schuppen, Gartenhaus und Garten',
          'Bei Gewerbeflächen: Lastenaufzug, Anlieferzone und Serverraum',
        ],
      },
      {
        h: 'Wie Sie fotografieren sollten',
        list: [
          'Licht anmachen, auch tagsüber. Dunkle Fotos verschlucken die Hälfte.',
          'Nicht aufräumen vorher. Wir müssen den echten Zustand sehen, nicht den aufgeräumten.',
          'Quer statt hoch fotografieren, dann passt mehr ins Bild.',
          'Nichts schönfärben. Eine zu niedrige Einschätzung hilft niemandem, sie führt nur zu Nachträgen.',
          'Nummerieren oder benennen Sie die Fotos nach Raum, wenn es viele sind.',
        ],
        note: {
          title: 'Was mit Ihren Fotos passiert',
          text: 'Fotos aus Wohnungen sind sensibel. Sie werden ausschließlich für die Einschätzung Ihrer Anfrage verwendet, nicht veröffentlicht und nach der Bearbeitung gelöscht. Näheres steht in der Datenschutzerklärung.',
          tone: 'info',
        },
      },
      {
        h: 'Wann Fotos nicht ausreichen',
        p: [
          'Bei einer kompletten Haushaltsauflösung, bei Häusern mit Grundstück und bei stark zugestellten Wohnungen empfehlen wir eine Besichtigung. Fotos zeigen solche Objekte erfahrungsgemäß deutlich harmloser, als sie sind.',
          'Eine Besichtigung kostet Sie nichts und dauert je nach Objekt zwanzig bis sechzig Minuten. Sie führt zu einer Zahl, auf die Sie sich verlassen können.',
        ],
      },
    ],
    faq: [
      {
        q: 'Wie viele Fotos brauchen Sie?',
        a: 'Für eine normale Wohnung reichen zehn bis fünfzehn Fotos. Wichtiger als die Anzahl ist die Vollständigkeit: jeder Raum, jeder Nebenraum, das Treppenhaus und die Straße. Ein einzelnes Foto vom Wohnzimmer reicht für keine Einschätzung.',
      },
      {
        q: 'Kann ich die Fotos per WhatsApp schicken?',
        a: 'Ja, das ist der einfachste Weg und für die meisten Menschen schneller als ein Formular. Über das Anfrageformular können Sie die Fotos ebenfalls direkt hochladen, dann kommen die Angaben zu Etage, Aufzug und Termin gleich mit an.',
      },
      {
        q: 'Was, wenn ich keine Fotos machen kann?',
        a: 'Dann vereinbaren wir eine Besichtigung. Wenn Sie nicht vor Ort sind, kann auch eine Nachbarin, eine Angehörige oder die Hausverwaltung aufschließen. Sagen Sie uns, was am einfachsten für Sie ist.',
      },
    ],
    related: ['entruempelung-vorbereiten', 'was-kostet-eine-entruempelung-in-berlin'],
    services: ['entruempelung-berlin', 'haushaltsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'entruempelung-vorbereiten',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Eine Entrümpelung richtig vorbereiten',
    navLabel: 'Entrümpelung vorbereiten',
    metaTitle: 'Entrümpelung vorbereiten: Checkliste für den Einsatztag',
    metaDescription:
      'Was Sie vor einer Entrümpelung erledigen sollten: markieren, sichern, Zugang klären, Halteverbot beantragen. Damit am Einsatztag nichts schiefgeht.',
    answer:
      'Vor einer Entrümpelung sollten Sie drei Dinge klären: Was bleibt, wer aufschließt und wo das Fahrzeug steht. Markieren Sie alles, was nicht mitgeht, deutlich sichtbar. Sichern Sie Dokumente, Schlüssel und Wertsachen vorher selbst. Klären Sie Etage, Aufzug und Halteposition. Diese drei Punkte verhindern die meisten Probleme am Einsatztag.',
    teaser: 'Drei Dinge klären, dann läuft der Einsatztag ohne Überraschungen.',
    blocks: [
      {
        h: 'Zwei Wochen vorher',
        list: [
          'Termin bestätigen und den Übergabetermin der Wohnung gegenprüfen',
          'Halteverbotszone beantragen, falls nötig. Kurzfristige Genehmigungen sind teurer.',
          'Klären, ob Nebenräume dazugehören: Keller, Dachboden, Balkon, Garage',
          'Mit dem Vermieter klären, ob Einbauküche, Teppichboden oder Lampen bleiben sollen',
          'Wenn Nachbarn betroffen sind, kurz Bescheid geben. Das erspart Diskussionen im Treppenhaus.',
        ],
      },
      {
        h: 'Eine Woche vorher',
        list: [
          'Dokumente, Ausweise, Verträge und Fotoalben zusammensuchen und an einen sicheren Ort bringen',
          'Wertsachen, Schmuck und Bargeld selbst sichern. Nicht in Schubladen liegen lassen.',
          'Alles, was bleiben soll, in einen Raum stellen oder deutlich markieren',
          'Medikamente und persönliche Pflegemittel gesondert wegräumen',
          'Digitale Geräte prüfen: alte Handys, Festplatten und Laptops enthalten Daten',
        ],
        note: {
          title: 'Markieren, nicht mündlich absprechen',
          text: 'Ein Zettel auf dem Schrank ist zuverlässiger als ein Satz am Telefon. Am Einsatztag arbeiten mehrere Personen parallel, und nicht jede war beim Gespräch dabei.',
          tone: 'info',
        },
      },
      {
        h: 'Am Tag davor',
        list: [
          'Zugang klären: Wer schließt auf, wo liegt der Schlüssel, wer nimmt am Ende ab?',
          'Halteverbotsschilder prüfen. Stehen sie? Ist der Bereich frei?',
          'Kühlschrank abtauen, wenn er mitgeht',
          'Wasser und Strom müssen am Einsatztag noch an sein, jedenfalls das Licht',
          'Telefon erreichbar halten, falls unterwegs Rückfragen kommen',
        ],
      },
      {
        h: 'Am Einsatztag',
        p: [
          'Nehmen Sie sich am Anfang zwanzig Minuten Zeit, um durch die Räume zu gehen und zu zeigen, was bleibt und was mitgeht. Diese zwanzig Minuten sparen erfahrungsgemäß mehr Zeit, als sie kosten.',
          'Danach müssen Sie nicht dabeibleiben. Wichtig ist nur, dass Sie erreichbar sind und zur Abnahme wieder da sind oder jemanden benennen, der das übernimmt.',
        ],
      },
      {
        h: 'Was Sie nicht vorbereiten müssen',
        list: [
          'Möbel zerlegen. Das machen wir und wir machen es schneller.',
          'Sachen nach unten tragen. Das ist Teil des Auftrags.',
          'Sortieren nach Materialart. Getrennt wird beim Verladen.',
          'Putzen. Besenrein übernehmen wir, wenn es beauftragt ist.',
        ],
      },
    ],
    faq: [
      {
        q: 'Muss ich vorher aufräumen?',
        a: 'Nein. Für die Fotos sollten Sie sogar ausdrücklich nicht aufräumen, damit die Einschätzung stimmt. Was Sie tun sollten: alles markieren oder wegstellen, was nicht mitgehen darf, und persönliche Wertsachen selbst sichern.',
      },
      {
        q: 'Wie lange dauert eine Entrümpelung?',
        a: 'Ein Keller oder ein einzelner Raum ist oft in wenigen Stunden erledigt. Eine Zweizimmerwohnung dauert meist einen Tag, größere Wohnungen mit Nebenräumen ein bis drei Tage. Nach Fotos oder Besichtigung sagen wir Ihnen konkret, mit welchem Zeitfenster Sie rechnen sollten.',
      },
      {
        q: 'Kann ich Möbel behalten, die ich später abholen möchte?',
        a: 'Ja, aber stellen Sie sie zusammen und markieren Sie sie deutlich. Am besten in einen Raum, dessen Tür wir geschlossen lassen. Wenn Stücke über die Wohnung verteilt sind und nur mündlich benannt wurden, geht erfahrungsgemäß etwas schief.',
      },
    ],
    related: ['welche-fotos-fuer-ein-angebot', 'checkliste-wohnungsuebergabe', 'was-kostet-eine-entruempelung-in-berlin'],
    services: ['entruempelung-berlin', 'kellerentruempelung-berlin', 'haushaltsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'checkliste-wohnungsuebergabe',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Checkliste für die Wohnungsübergabe',
    navLabel: 'Wohnungsübergabe',
    metaTitle: 'Wohnungsübergabe Checkliste: was vorher erledigt sein muss',
    metaDescription:
      'Checkliste für die Wohnungsübergabe in Berlin: Zählerstände, Schlüssel, Protokoll, besenrein und was Vermieter verlangen dürfen und was nicht.',
    answer:
      'Vor der Wohnungsübergabe sollten die Wohnung geräumt und besenrein sein, alle Zählerstände abgelesen, sämtliche Schlüssel gesammelt und die Mängel dokumentiert sein. Bestehen Sie auf einem schriftlichen Übergabeprotokoll mit Datum, Zählerständen und Schlüsselanzahl. Unterschreiben Sie nichts, das Sie nicht selbst geprüft haben, und fotografieren Sie den Zustand jedes Raums.',
    teaser: 'Zählerstände, Schlüssel, Protokoll: was am Übergabetag erledigt sein muss.',
    blocks: [
      {
        h: 'Vor dem Übergabetermin',
        list: [
          'Wohnung vollständig geräumt, einschließlich Keller, Dachboden, Balkon und Garage',
          'Besenrein: gefegt, grober Schmutz entfernt',
          'Dübel entfernt und Löcher verschlossen, sofern geschuldet',
          'Lampen abgenommen und Deckenauslässe gesichert',
          'Alle Schlüssel gesammelt: Wohnung, Haustür, Briefkasten, Keller, Garage, Fahrradraum',
          'Nachsendeauftrag bei der Post eingerichtet',
          'Strom, Gas, Wasser, Internet und Rundfunkbeitrag ummelden oder kündigen',
        ],
      },
      {
        h: 'Am Übergabetag',
        steps: [
          {
            title: 'Zählerstände ablesen',
            text: 'Strom, Gas, Wasser, Warmwasser und Heizung. Fotografieren Sie jeden Zähler mit sichtbarer Zählernummer. Das ist Ihr Beweis, falls später abweichende Werte auftauchen.',
          },
          {
            title: 'Gemeinsam durch alle Räume gehen',
            text: 'Mit dem Vermieter oder der Hausverwaltung. Jeden Raum ansehen, auch Nebenräume. Nichts unter Zeitdruck abhaken.',
          },
          {
            title: 'Mängel eintragen lassen',
            text: 'Alles, was der Vermieter beanstandet, gehört ins Protokoll. Ebenso alles, was Sie beanstanden, etwa vorhandene Schäden, die nicht von Ihnen stammen.',
          },
          {
            title: 'Schlüssel zählen und eintragen',
            text: 'Die Anzahl jedes Schlüsseltyps gehört ins Protokoll. Fehlende Schlüssel können teuer werden, wenn eine Schließanlage getauscht werden muss.',
          },
          {
            title: 'Protokoll prüfen und unterschreiben',
            text: 'Lesen Sie es vollständig, auch wenn es unangenehm ist, jemanden warten zu lassen. Lassen Sie sich eine unterschriebene Kopie geben oder fotografieren Sie das Protokoll.',
          },
          {
            title: 'Fotos machen',
            text: 'Jeder Raum leer, Böden, Wände, Fenster, Sanitär. Datum ist auf dem Foto ohnehin gespeichert.',
          },
        ],
      },
      {
        h: 'Was Vermieter verlangen dürfen und was nicht',
        p: [
          'Sie schulden die Rückgabe in vertragsgemäßem Zustand. Normale Abnutzung durch vertragsgemäßen Gebrauch ist damit abgegolten, dafür zahlen Sie Miete. Abgelaufene Teppichböden, vergilbte Tapeten und Gebrauchsspuren am Parkett fallen in der Regel darunter.',
          'Ob Schönheitsreparaturen geschuldet sind, hängt vom Mietvertrag ab. Viele ältere Klauseln sind unwirksam, insbesondere starre Fristenpläne und Klauseln, die eine Renovierung unabhängig vom tatsächlichen Zustand verlangen. Auch wer eine unrenovierte Wohnung übernommen hat, schuldet oft keine Endrenovierung.',
          'Diese Seite ersetzt keine Rechtsberatung. Wenn im Übergabeprotokoll erhebliche Forderungen stehen, lassen Sie den Mietvertrag prüfen, bevor Sie zahlen oder Arbeiten beauftragen. Mietervereine und Fachanwältinnen für Mietrecht helfen dabei.',
        ],
        note: {
          title: 'Nicht unter Druck unterschreiben',
          text: 'Wenn Sie sich bei einem Punkt im Protokoll unsicher sind, lassen Sie eintragen, dass Sie ihn nicht anerkennen. Unterschreiben Sie nicht pauschal, um den Termin zu beenden.',
          tone: 'caution',
        },
      },
      {
        h: 'Was besenrein wirklich bedeutet',
        p: [
          'Besenrein heißt: leer, gefegt, grober Schmutz entfernt. Es heißt nicht: geputzt, Fenster gewischt, Bad desinfiziert, Küche entfettet.',
          'Wenn Ihr Vermieter mehr erwartet, klären Sie das vor der Übergabe. Eine Endreinigung ist eine eigene Leistung und wird gesondert beauftragt. Sagen Sie uns bei der Anfrage, was verlangt wird, dann planen wir es ein.',
        ],
      },
    ],
    faq: [
      {
        q: 'Was passiert, wenn ein Schlüssel fehlt?',
        a: 'Bei einer normalen Schließung wird ein Ersatzschlüssel nachgemacht. Kritisch wird es bei einer zertifizierten Schließanlage: Dann kann der Vermieter unter Umständen den Austausch der gesamten Anlage verlangen, was erheblich teurer ist. Suchen Sie fehlende Schlüssel vor dem Termin und melden Sie einen Verlust frühzeitig.',
      },
      {
        q: 'Muss ich die Wohnung streichen?',
        a: 'Das hängt vom Mietvertrag und dessen Wirksamkeit ab. Viele Klauseln zu Schönheitsreparaturen sind unwirksam, besonders bei unrenoviert übernommenen Wohnungen und starren Fristenplänen. Lassen Sie den Vertrag prüfen, bevor Sie Malerarbeiten beauftragen. Ein Mieterverein kann das kostengünstig beurteilen.',
      },
      {
        q: 'Kann jemand anderes die Übergabe für mich machen?',
        a: 'Ja, mit schriftlicher Vollmacht. Das ist üblich, wenn Sie nicht in Berlin sind. Wir übernehmen die Übergabe nach Absprache, dokumentieren den Zustand mit Fotos und leiten Ihnen das Protokoll und die Schlüsselzahl weiter.',
      },
      {
        q: 'Wann bekomme ich die Kaution zurück?',
        a: 'Der Vermieter darf die Kaution eine angemessene Zeit einbehalten, um offene Forderungen zu prüfen, insbesondere die Betriebskostenabrechnung. Ein Teil wird oft bis zur nächsten Abrechnung zurückgehalten. Feste Fristen gibt es nicht, mehrere Monate sind aber üblich und meist zulässig.',
      },
    ],
    related: ['entruempelung-vorbereiten', 'kosten-haushaltsaufloesung-berlin'],
    services: ['wohnungsaufloesung-berlin', 'umzug-berlin', 'haushaltsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'haushaltsaufloesung-nach-todesfall',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Haushaltsauflösung nach einem Todesfall',
    navLabel: 'Nach einem Todesfall',
    metaTitle: 'Haushaltsauflösung nach Todesfall: Reihenfolge und Fristen',
    metaDescription:
      'Was nach einem Todesfall in welcher Reihenfolge zu tun ist, bevor die Wohnung aufgelöst wird: Erbschaft, Mietvertrag, Fristen und Unterlagen.',
    answer:
      'Nach einem Todesfall sollte die Wohnung erst geräumt werden, wenn geklärt ist, wer erbt und ob das Erbe angenommen wird. Der Mietvertrag läuft zunächst weiter und kann meist mit einer Sonderkündigung beendet werden. Sichten Sie zuerst die Unterlagen, dann kündigen Sie, dann planen Sie die Räumung mit Blick auf den Übergabetermin.',
    teaser: 'Was zuerst zu klären ist, bevor die Wohnung geräumt wird.',
    blocks: [
      {
        h: 'Die richtige Reihenfolge',
        steps: [
          {
            title: 'Unterlagen sichten',
            text: 'Bevor irgendetwas bewegt wird: Verträge, Versicherungen, Bankunterlagen, Testament, Mietvertrag. Diese Papiere brauchen Sie für alle weiteren Schritte, und sie sind in einer geräumten Wohnung nicht mehr auffindbar.',
          },
          {
            title: 'Erbschaft klären',
            text: 'Wer erbt, und wird das Erbe angenommen? Die Ausschlagungsfrist beträgt in der Regel sechs Wochen ab Kenntnis. Wer die Wohnung vorher räumt und Gegenstände an sich nimmt, kann das Erbe faktisch angenommen haben. Bei Zweifeln an der Werthaltigkeit des Nachlasses zuerst rechtlich beraten lassen.',
          },
          {
            title: 'Mietvertrag beenden',
            text: 'Das Mietverhältnis endet nicht mit dem Tod. Es geht auf die Erben über. In der Regel besteht ein Sonderkündigungsrecht mit gesetzlicher Frist. Kündigen Sie schriftlich und lassen Sie sich den Zugang bestätigen.',
          },
          {
            title: 'Übergabetermin abstimmen',
            text: 'Erst wenn das Ende des Mietverhältnisses feststeht, können Sie rückwärts planen. Zwischen Räumung und Übergabe sollten einige Tage Puffer liegen.',
          },
          {
            title: 'Räumung beauftragen',
            text: 'Jetzt, nicht früher. Ein seriöser Betrieb wird Sie ohnehin fragen, ob die Erbfolge geklärt ist.',
          },
        ],
        note: {
          title: 'Wichtiger Hinweis',
          text: 'Dies ist eine praktische Orientierung, keine Rechtsberatung. Bei Unsicherheiten zur Erbschaft, zur Haftung für Nachlassverbindlichkeiten oder zur Ausschlagung wenden Sie sich an eine Fachanwältin oder einen Fachanwalt für Erbrecht oder an das Nachlassgericht.',
          tone: 'caution',
        },
      },
      {
        h: 'Was Sie in der Wohnung suchen sollten',
        list: [
          'Testament oder Erbvertrag, auch handschriftliche Notizen',
          'Mietvertrag mit allen Nachträgen',
          'Versicherungspolicen, besonders Sterbegeld-, Lebens- und Hausratversicherung',
          'Renten- und Sozialversicherungsunterlagen',
          'Kontoauszüge und Bankunterlagen, Zugangsdaten',
          'Verträge über Strom, Gas, Telefon, Zeitungsabos, Mitgliedschaften',
          'Grabnutzungsrecht und Unterlagen zu einer Bestattungsvorsorge',
          'Schlüssel, auch für Bankschließfächer',
        ],
      },
      {
        h: 'Wenn Sie nicht in Berlin wohnen',
        p: [
          'Ein großer Teil der Nachlassauflösungen wird von Angehörigen beauftragt, die weit entfernt wohnen. Das ist gut machbar, wenn drei Dinge geklärt sind: Wer hat einen Schlüssel, wer darf beauftragen und wie werden Entscheidungen dokumentiert.',
          'Praktisch bewährt hat sich: eine Besichtigung mit Fotoprotokoll, eine schriftliche Absprache darüber, was gesichert wird, und eine Fotodokumentation der Fundstücke, bevor endgültig entschieden wird. Die Übergabe an den Vermieter können wir mit Vollmacht übernehmen.',
        ],
      },
      {
        h: 'Wenn der Nachlass überschuldet ist',
        p: [
          'Wenn absehbar ist, dass die Schulden das Vermögen übersteigen, sollten Sie keine Räumung beauftragen, bevor die erbrechtliche Lage geklärt ist. Sonst kann es passieren, dass Sie die Kosten privat tragen.',
          'In solchen Fällen kommen eine Erbausschlagung, eine Nachlassverwaltung oder ein Nachlassinsolvenzverfahren in Betracht. Die Wohnungsräumung wird dann von der zuständigen Stelle veranlasst, nicht von Ihnen.',
        ],
      },
    ],
    faq: [
      {
        q: 'Darf ich die Wohnung räumen, bevor der Erbschein da ist?',
        a: 'Wenn klar ist, dass Sie erben und Sie das Erbe annehmen wollen, können Sie handeln. Solange Sie über eine Ausschlagung nachdenken, sollten Sie nichts aus der Wohnung entfernen, weil das als Annahme des Erbes gewertet werden kann. Bei Unsicherheit erst beraten lassen.',
      },
      {
        q: 'Wer zahlt die Auflösung?',
        a: 'Die Kosten sind Nachlassverbindlichkeiten und werden aus dem Nachlass beglichen, soweit dieser reicht. Bei einer Erbengemeinschaft sollten sich alle Beteiligten vorher über die Beauftragung einigen. Für die Abrechnung stellen wir eine Rechnung mit einzeln ausgewiesenen Positionen aus.',
      },
      {
        q: 'Wie schnell muss die Wohnung geräumt sein?',
        a: 'Maßgeblich ist das Ende des Mietverhältnisses nach der Sonderkündigung. Bis dahin läuft die Miete weiter, das ist der eigentliche Zeitdruck. Sprechen Sie mit dem Vermieter, viele zeigen sich bei einer Verlängerung um wenige Wochen entgegenkommend, wenn Sie früh das Gespräch suchen.',
      },
      {
        q: 'Können Sie warten, bis wir so weit sind?',
        a: 'Ja. Wir drängen bei Nachlässen nicht auf schnelle Termine. Melden Sie sich, wenn Sie eine Einschätzung brauchen, auch wenn der Termin noch offen ist. Eine Besichtigung jetzt und eine Räumung in sechs Wochen ist ein normaler Ablauf.',
      },
    ],
    related: ['kosten-haushaltsaufloesung-berlin', 'checkliste-wohnungsuebergabe'],
    services: ['nachlassaufloesung-berlin', 'haushaltsaufloesung-berlin', 'wohnungsaufloesung-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'halteverbotszone-berlin-umzug',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Halteverbotszone für den Umzug in Berlin',
    navLabel: 'Halteverbotszone',
    metaTitle: 'Halteverbotszone Berlin: beantragen, aufstellen, Vorlauf',
    metaDescription:
      'Wie eine Halteverbotszone für den Umzug in Berlin beantragt wird, welcher Vorlauf nötig ist und warum sie sich in den meisten Innenstadtlagen rechnet.',
    answer:
      'Eine Halteverbotszone reserviert die Fläche vor dem Haus für den Umzugstag. In Berlin wird sie bei der zuständigen Straßenverkehrsbehörde des Bezirks oder über einen Dienstleister beantragt. Planen Sie mindestens zwei Wochen Vorlauf ein. Die Schilder müssen rechtzeitig vor dem Termin stehen, sonst gilt das Verbot nicht für bereits geparkte Fahrzeuge.',
    teaser: 'Vorlauf, Antrag und warum sie sich in der Innenstadt fast immer rechnet.',
    blocks: [
      {
        h: 'Warum sich die Zone in Berlin meistens lohnt',
        p: [
          'Ohne reservierte Fläche steht das Fahrzeug dort, wo gerade Platz ist. In dicht bebauten Berliner Lagen sind das schnell 60 bis 100 Meter vom Hauseingang entfernt.',
          'Bei einem durchschnittlichen Umzug werden mehrere hundert Wege zwischen Wohnung und Fahrzeug zurückgelegt. Bei 80 Metern zusätzlich pro Weg summiert sich das auf mehrere Kilometer und damit auf Stunden. Die Kosten der Zone liegen fast immer unter den Kosten dieser Zeit.',
          'Hinzu kommt: Möbel über eine längere Strecke durch den öffentlichen Raum zu tragen erhöht das Risiko von Schäden, besonders bei Regen.',
        ],
      },
      {
        h: 'So läuft der Antrag',
        steps: [
          {
            title: 'Zuständigkeit klären',
            text: 'Zuständig ist das Straßen- und Grünflächenamt bzw. die Straßenverkehrsbehörde des Bezirks, in dem die Adresse liegt. Bei einem Umzug innerhalb Berlins mit zwei Adressen in verschiedenen Bezirken brauchen Sie zwei Anträge.',
          },
          {
            title: 'Antrag stellen',
            text: 'Sie brauchen Adresse, Datum, Uhrzeit, benötigte Länge in Metern und den Grund. Für einen Umzugstransporter werden meist 15 bis 20 Meter beantragt, damit auch das Rangieren möglich ist.',
          },
          {
            title: 'Genehmigung abwarten',
            text: 'Die Bearbeitungszeit unterscheidet sich je nach Bezirk. Zwei Wochen Vorlauf sind ein realistischer Richtwert, kurzfristige Anträge kosten mehr und sind nicht überall möglich.',
          },
          {
            title: 'Schilder aufstellen',
            text: 'Die Schilder müssen mit ausreichendem Vorlauf vor dem Termin aufgestellt werden. Wer sie zu spät aufstellt, kann bereits parkende Fahrzeuge nicht abschleppen lassen. Achten Sie darauf, dass Datum und Uhrzeit auf den Schildern korrekt eingetragen sind.',
          },
          {
            title: 'Fahrzeuge dokumentieren',
            text: 'Fotografieren Sie die aufgestellten Schilder mit Datum und die Kennzeichen der Fahrzeuge, die dann noch parken. Das ist die Grundlage, falls abgeschleppt werden muss.',
          },
        ],
      },
      {
        h: 'Wenn trotzdem jemand parkt',
        p: [
          'Steht am Umzugstag ein Fahrzeug in der Zone, das vor dem Aufstellen der Schilder dort geparkt hat, kann es unter Umständen nicht sofort umgesetzt werden. Genau deshalb ist der Vorlauf beim Aufstellen so wichtig.',
          'Steht ein Fahrzeug dort, das nach dem Aufstellen geparkt hat, verständigen Sie die Polizei oder das Ordnungsamt. Fotografieren Sie vorher die Schilder mit Datum und das Fahrzeug mit Kennzeichen.',
        ],
        note: {
          title: 'Praktischer Tipp',
          text: 'Blockieren Sie die Zone am Abend vorher mit eigenen Fahrzeugen oder Fahrrädern, wenn das möglich ist. Das ist zuverlässiger als jede Diskussion am Umzugsmorgen.',
          tone: 'info',
        },
      },
      {
        h: 'Wann Sie keine Zone brauchen',
        list: [
          'Wenn Sie einen eigenen Hof oder eine Einfahrt haben, in die der Transporter passt',
          'In ruhigen Wohnstraßen am Stadtrand mit ausreichend Parkraum',
          'In Einfamilienhausgebieten im Umland, etwa in Falkensee oder Mahlsdorf',
          'Bei Wohnanlagen mit ausgewiesener Anlieferzone, häufig in Marzahn und Hellersdorf',
          'Bei sehr kleinen Transporten, bei denen nur wenige Wege anfallen',
        ],
      },
    ],
    faq: [
      {
        q: 'Wie viel Vorlauf brauche ich?',
        a: 'Planen Sie mindestens zwei Wochen ein, besser drei. Die Bearbeitungszeiten unterscheiden sich je nach Bezirk erheblich. Kurzfristige Genehmigungen sind teurer und in manchen Bezirken gar nicht möglich. Wenn Ihr Umzugstermin feststeht, beantragen Sie die Zone als Nächstes.',
      },
      {
        q: 'Kümmern Sie sich um die Halteverbotszone?',
        a: 'Ja, nach Absprache übernehmen wir Antrag und Aufstellung. Sagen Sie uns die Adressen und das Datum, dann klären wir den Rest. Sie können es auch selbst beantragen, das ist meist etwas günstiger, kostet aber Zeit und erfordert, dass Sie sich um das Aufstellen kümmern.',
      },
      {
        q: 'Wie lang muss die Zone sein?',
        a: 'Für einen Umzugstransporter werden üblicherweise 15 bis 20 Meter beantragt. Das klingt viel für ein Fahrzeug von sieben Metern, ist aber nötig, um einzuparken, die Hecktüren zu öffnen und eine Ladefläche nutzbar zu machen. Zu kurz beantragt bringt die Zone wenig.',
      },
      {
        q: 'Gilt die Zone auch für Anwohner mit Parkausweis?',
        a: 'Ja. Ein Anwohnerparkausweis berechtigt nicht zum Parken in einem eingerichteten Halteverbot. Wenn ein Fahrzeug nach dem ordnungsgemäßen Aufstellen der Schilder dort parkt, kann es kostenpflichtig umgesetzt werden.',
      },
    ],
    related: ['checkliste-wohnungsuebergabe', 'entruempelung-vorbereiten'],
    services: ['umzug-berlin', 'seniorenumzug-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },
];

export const publishedGuides = guides.filter((g) => g.status === 'published');
export const costGuides = publishedGuides.filter((g) => g.hub === 'kosten');
export const adviceGuides = publishedGuides.filter((g) => g.hub === 'ratgeber');

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Nur veröffentlichte verwandte Ratgeber – verhindert tote Links. */
export function relatedGuides(slugs: string[] | undefined): Guide[] {
  if (!slugs) return [];
  return slugs
    .map((s) => getGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g) && g!.status === 'published');
}
