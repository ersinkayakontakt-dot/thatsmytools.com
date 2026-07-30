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
    related: ['sperrmuell-moebel-entsorgen-berlin', 'was-kostet-eine-entruempelung-in-berlin'],
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
    related: ['umzugskosten-jobcenter-berlin', 'kosten-haushaltsaufloesung-berlin', 'checkliste-wohnungsuebergabe'],
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
    related: ['wohnungsaufloesung-checkliste-pdf', 'entruempelung-vorbereiten', 'kosten-haushaltsaufloesung-berlin'],
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
    related: ['wohnungsaufloesung-checkliste-pdf', 'kosten-haushaltsaufloesung-berlin', 'checkliste-wohnungsuebergabe'],
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
    related: ['umzugskosten-jobcenter-berlin', 'checkliste-wohnungsuebergabe', 'entruempelung-vorbereiten'],
    services: ['umzug-berlin', 'seniorenumzug-berlin'],
    published: '2026-07-29',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'umzugskosten-jobcenter-berlin',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Umzugskosten vom Jobcenter in Berlin: Antrag und Ablauf',
    navLabel: 'Jobcenter und Umzugskosten',
    metaTitle: 'Jobcenter Umzugskosten Berlin: Antrag, Zusicherung, Angebote',
    metaDescription:
      'Jobcenter-Umzugskosten in Berlin: Wann eine Zusicherung nötig ist, welche Unterlagen verlangt werden und warum der Antrag vor der Beauftragung gestellt wird.',
    answer:
      'Das Jobcenter kann notwendige und angemessene Umzugskosten übernehmen, wenn die zuständige Stelle die Kosten vor dem Umzug schriftlich zugesichert hat. Unterschreiben Sie den neuen Mietvertrag und beauftragen Sie kein Umzugsunternehmen, bevor die Prüfung abgeschlossen ist. In Berlin werden für einen Firmenumzug regelmäßig eine Begründung und mehrere Kostenvoranschläge verlangt. Welche Kosten tatsächlich anerkannt werden, entscheidet das Jobcenter im Einzelfall.',
    teaser:
      'Zusicherung, Zuständigkeit, Kostenvoranschläge und die richtige Reihenfolge vor dem Umzug.',
    blocks: [
      {
        h: 'Was hat sich seit Juli 2026 geändert?',
        p: [
          'Seit dem 1. Juli 2026 heißt das bisherige Bürgergeld **Grundsicherungsgeld**. Die Berliner Jobcenter weisen darauf hin, dass vorhandene Formulare und Online-Dienste weiter genutzt werden können und bereits erlassene Bescheide gültig bleiben.',
          'Viele Menschen suchen weiterhin nach „Bürgergeld Umzugskosten“. Gemeint ist dieselbe praktische Frage: Welche Kosten erkennt das Jobcenter an und welche Zustimmung ist vor dem Umzug notwendig?',
          'Für die Entscheidung zählt nicht die Bezeichnung der Leistung, sondern die vorherige Abstimmung mit der zuständigen Leistungsstelle. Die [Bundesagentur für Arbeit](https://www.arbeitsagentur.de/grundsicherung/wohnen) empfiehlt ausdrücklich, einen neuen Mietvertrag erst nach dieser Abstimmung zu unterschreiben.',
        ],
      },
      {
        h: 'Welche Reihenfolge schützt vor abgelehnten Kosten?',
        steps: [
          {
            title: 'Umzugsgrund schriftlich erklären',
            text: 'Beschreiben Sie konkret, warum der Wohnungswechsel erforderlich ist. Je nach Grund können Nachweise sinnvoll sein, etwa eine Kündigung, ein ärztlicher Hinweis, Unterlagen zur Familiengröße oder Angaben zur bisherigen Wohnung.',
          },
          {
            title: 'Neue Wohnung prüfen lassen',
            text: 'Reichen Sie das Wohnungsangebot ein, bevor Sie den Mietvertrag unterschreiben. Das Jobcenter prüft insbesondere, ob die Aufwendungen der neuen Unterkunft anerkannt werden können.',
          },
          {
            title: 'Umzugskosten gesondert beantragen',
            text: 'Die Zustimmung zur neuen Wohnung ersetzt nicht automatisch die Zusicherung der Umzugskosten. Beantragen Sie Mietfahrzeug, Hilfsmittel oder Firmenumzug ausdrücklich und schriftlich.',
          },
          {
            title: 'Geforderte Kostenvoranschläge einreichen',
            text: 'Für einen Umzug durch ein Unternehmen verlangen Berliner Jobcenter regelmäßig Vergleichsangebote. Das Jobcenter Treptow-Köpenick nennt drei Kostenvoranschläge und eine Begründung, warum ein Firmenumzug notwendig ist.',
          },
          {
            title: 'Erst nach schriftlicher Entscheidung beauftragen',
            text: 'Lösen Sie keine Kosten aus, solange die Zusicherung fehlt. Eine telefonische Auskunft ist für eine spätere Erstattung deutlich schwerer nachzuweisen als eine schriftliche Entscheidung.',
          },
        ],
        note: {
          title: 'Der entscheidende Satz',
          text: 'Wohnungsbeschaffungs-, Umzugs- und Kautionskosten werden grundsätzlich nur übernommen, wenn die zuständige Stelle vorher zugestimmt hat. Reichen Sie deshalb zuerst Antrag und Unterlagen ein und beauftragen Sie erst danach.',
          tone: 'caution',
        },
      },
      {
        h: 'Welche Kosten können berücksichtigt werden?',
        table: {
          caption: 'Mögliche Kostenarten – die Bewilligung bleibt eine Einzelfallentscheidung',
          head: ['Kostenart', 'Was dazu gehören kann', 'Wichtig'],
          rows: [
            [
              'Selbst organisierter Umzug',
              'Mietfahrzeug, notwendige Kartons und Hilfsmittel',
              'Vorher beantragen und Belege aufbewahren',
            ],
            [
              'Helfende Personen',
              'In Berlin kann eine Verpflegungspauschale anerkannt werden',
              'Höhe und Personenzahl vorher klären',
            ],
            [
              'Umzugsunternehmen',
              'Transport des Umzugsguts bei begründetem Ausnahmefall',
              'Notwendigkeit begründen und Vergleichsangebote einreichen',
            ],
            [
              'Mietkaution',
              'Kaution oder Genossenschaftsanteile häufig als Darlehen',
              'Beim zuständigen Jobcenter des neuen Wohnorts beantragen',
            ],
            [
              'Weitere Wohnungswechselkosten',
              'Im Einzelfall Wohnungsbeschaffung oder unvermeidbare Doppelmiete',
              'Nur nach vorheriger Prüfung und Zusicherung',
            ],
          ],
        },
        p: [
          'Die Berliner Ausführungshinweise unterscheiden zwischen den Kosten der neuen Unterkunft und den einmaligen Kosten des Wohnungswechsels. Deshalb sollten Sie im Antrag genau benennen, welche Positionen Sie beantragen.',
          'Ein Kostenvoranschlag sollte die Leistung nachvollziehbar aufschlüsseln. Für eine [Umzugsanfrage bei Schnellhelfer24](/angebot-anfragen/) können Sie den Anlass „Kostenträger“ auswählen. Wir erstellen damit eine prüfbare Kalkulationsgrundlage; über die Bewilligung entscheidet ausschließlich Ihre Leistungsstelle.',
        ],
      },
      {
        h: 'Welches Jobcenter ist zuständig?',
        p: [
          'Bei einem Umzug innerhalb Berlins erteilt in der Regel die Stelle die Zusicherung zu den Umzugskosten, die Ihre bisherigen Leistungen bewilligt. Für die Anerkennung der neuen Unterkunft kann zusätzlich die Stelle am neuen Wohnort beteiligt sein.',
          'Bei einem Zuzug nach Berlin oder einem Wegzug aus Berlin kann die Zuständigkeit zwischen bisherigem und künftigem Träger aufgeteilt sein. Lassen Sie sich deshalb schriftlich bestätigen, wohin Wohnungsangebot, Kautionsantrag und Umzugskostenantrag gehören.',
          'Die Berliner Senatsverwaltung beschreibt die Zuständigkeit und Voraussetzungen in ihren [Fragen und Antworten zu den Kosten der Unterkunft](https://www.berlin.de/sen/soziales/soziale-sicherung/kosten-der-unterkunft-av-wohnen/kosten-der-unterkunft-fragen-und-antworten/).',
        ],
      },
      {
        h: 'Was sollte im Kostenvoranschlag stehen?',
        list: [
          'vollständiger Name und Anschrift des Umzugsunternehmens',
          'Abhol- und Zieladresse sowie geplanter Zeitraum',
          'Wohnungsgröße, Etagen, Aufzüge und relevante Tragewege',
          'Umfang des Umzugsguts und voraussichtliche Fahrzeuggröße',
          'Anzahl der eingesetzten Personen und kalkulierte Arbeitszeit',
          'vereinbarte Zusatzleistungen wie Demontage oder Halteverbotszone',
          'Gesamtbetrag und erkennbare Gültigkeitsdauer des Angebots',
        ],
        note: {
          title: 'Keine Bewilligungsgarantie',
          text: 'Ein vollständiger Kostenvoranschlag verbessert die Prüfbarkeit, garantiert aber keine Kostenübernahme. Maßgeblich bleiben Erforderlichkeit, Angemessenheit und die schriftliche Entscheidung der zuständigen Stelle.',
          tone: 'info',
        },
      },
    ],
    faq: [
      {
        q: 'Zahlt das Jobcenter immer ein Umzugsunternehmen?',
        a: 'Nein. Berliner Jobcenter gehen grundsätzlich davon aus, dass ein Umzug zunächst selbst organisiert wird. Ein Firmenumzug kann in einem begründeten Ausnahmefall berücksichtigt werden, beispielsweise wenn Selbsthilfe nicht möglich oder nicht zumutbar ist. Die Notwendigkeit muss vor der Beauftragung erklärt und durch die Leistungsstelle anerkannt werden.',
      },
      {
        q: 'Wie viele Kostenvoranschläge werden benötigt?',
        a: 'Das Jobcenter Treptow-Köpenick verlangt für einen Firmenumzug drei Kostenvoranschläge. Andere Berliner Stellen können vergleichbar verfahren, die konkrete Anforderung sollten Sie jedoch bei Ihrem zuständigen Jobcenter erfragen. Reichen Sie nur Angebote ein, die denselben Leistungsumfang abbilden, damit sie tatsächlich vergleichbar sind.',
      },
      {
        q: 'Darf ich den Mietvertrag schon unterschreiben?',
        a: 'Die Bundesagentur für Arbeit und die Berliner Stellen empfehlen, den neuen Mietvertrag erst nach der Abstimmung und Zusicherung zu unterschreiben. Andernfalls besteht das Risiko, dass die neue Miete oder weitere Umzugskosten nicht vollständig anerkannt werden. Lassen Sie sich die Entscheidung schriftlich geben.',
      },
      {
        q: 'Rechnet Schnellhelfer24 direkt mit dem Jobcenter ab?',
        a: 'Eine direkte Abrechnung ist derzeit nicht pauschal zugesagt. Schnellhelfer24 kann einen nachvollziehbaren Kostenvoranschlag für die Prüfung erstellen. Ob eine Direktzahlung, Erstattung an Sie oder eine andere Abwicklung möglich ist, muss vor der Beauftragung mit dem zuständigen Jobcenter und im konkreten Angebot geklärt werden.',
      },
    ],
    related: ['halteverbotszone-berlin-umzug', 'kosten-seniorenumzug-berlin', 'welche-fotos-fuer-ein-angebot'],
    services: ['umzug-berlin', 'seniorenumzug-berlin'],
    sources: [
      {
        label: 'Wohnen und Miete beim Grundsicherungsgeld',
        url: 'https://www.arbeitsagentur.de/grundsicherung/wohnen',
        publisher: 'Bundesagentur für Arbeit',
        checked: '2026-07-30',
      },
      {
        label: 'Kosten der Unterkunft – Fragen und Antworten',
        url: 'https://www.berlin.de/sen/soziales/soziale-sicherung/kosten-der-unterkunft-av-wohnen/kosten-der-unterkunft-fragen-und-antworten/',
        publisher: 'Land Berlin',
        checked: '2026-07-30',
      },
      {
        label: 'Umzugskosten',
        url: 'https://www.berlin.de/jobcenter-treptow-koepenick/wegweiser/artikel.1530795.php',
        publisher: 'Jobcenter Berlin Treptow-Köpenick',
        checked: '2026-07-30',
      },
    ],
    published: '2026-07-30',
    updated: '2026-07-30',
  },

  /* ================================================================== */
  {
    slug: 'sperrmuell-moebel-entsorgen-berlin',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Sofa, Matratze und Möbel in Berlin entsorgen',
    navLabel: 'Möbel und Sperrmüll entsorgen',
    metaTitle: 'Möbel entsorgen Berlin: Sofa, Matratze und Sperrmüll',
    metaDescription:
      'Sofa, Matratze, Schrank oder Elektrogerät in Berlin entsorgen: Recyclinghof, BSR-Abholung und kompletter Abholservice verständlich verglichen.',
    answer:
      'Einzelne Möbel, Matratzen und bis zu drei Kubikmeter Sperrmüll können Berliner Privathaushalte selbst zu einem BSR-Recyclinghof bringen. Wer nicht transportieren kann, bucht eine BSR-Abholung oder einen privaten Abholservice. Elektrogeräte gehören niemals in den Hausmüll. Entscheidend sind Menge, Etage, Demontage und Trageweg: Bei wenigen bereitgestellten Teilen genügt oft die BSR, bei Räumen oder Zusatzarbeiten ist ein Komplettservice sinnvoller.',
    teaser:
      'Recyclinghof, BSR-Abholung und Komplettservice – welche Lösung zu Menge und Aufwand passt.',
    blocks: [
      {
        h: 'Welche Entsorgungsmöglichkeit passt zu meiner Situation?',
        table: {
          caption: 'Die drei üblichen Wege für sperrige Gegenstände in Berlin',
          head: ['Situation', 'Passender Weg', 'Was Sie selbst erledigen'],
          rows: [
            [
              'Wenige Teile, eigenes Fahrzeug',
              'BSR-Recyclinghof',
              'Tragen, verladen, transportieren und vor Ort sortieren',
            ],
            [
              'Bereitgestellter Sperrmüll',
              'BSR-Sperrmüllabholung',
              'Termin buchen, Annahmeregeln beachten und Angaben vollständig machen',
            ],
            [
              'Möbel stehen noch in der Wohnung',
              'Abhol- oder Räumungsservice',
              'Umfang zeigen; Demontage, Tragen und Abtransport vereinbaren',
            ],
            [
              'Ganzer Raum oder mehrere Bereiche',
              'Entrümpelung oder Wohnungsauflösung',
              'Festlegen, was bleibt, verwertet, gespendet oder entsorgt wird',
            ],
          ],
        },
        p: [
          'Die günstigste Lösung ist nicht automatisch die passende. Ein kostenloser Recyclinghof hilft nur, wenn Fahrzeug, Tragende und Zeit vorhanden sind. Bei einem schweren Sofa aus dem vierten Stock kann der Transportaufwand größer sein als die eigentliche Entsorgung.',
          'Für eine einzelne Abholung bietet Schnellhelfer24 die [Sperrmüllabholung in Berlin](/leistungen/sperrmuellabholung-berlin/) an. Wenn zusätzlich Schränke geleert, Möbel demontiert oder mehrere Räume geräumt werden, passt eher eine [Entrümpelung](/leistungen/entruempelung-berlin/).',
        ],
      },
      {
        h: 'Was nimmt die BSR als Sperrmüll an?',
        list: [
          'zerlegte große und kleine Möbel, darunter Betten, Schränke, Tische und Sofas',
          'Teppiche und Matratzen',
          'Hölzer aus dem Wohnbereich',
          'Schrott wie Fahrräder oder Kinderwagen',
          'Laminat, Türblätter und bestimmte Kunststoffteile',
          'Elektrogeräte bei der Abholung nur in Verbindung mit Sperrmüll',
          'Alttextilien in getrennten, beschrifteten Säcken',
          'begrenzte Mengen verpackten Restabfalls nach den Vorgaben der BSR',
        ],
        note: {
          title: 'Nicht zum normalen Sperrmüll',
          text: 'Bauabfälle, Autoreifen, Autobatterien und Schadstoffe wie Farben oder Lacke nimmt die reguläre BSR-Sperrmüllabholung nicht mit. Solche Stoffe benötigen den jeweils vorgesehenen Entsorgungsweg.',
          tone: 'caution',
        },
      },
      {
        h: 'Wie entsorge ich Sofa, Matratze und Schrank?',
        steps: [
          {
            title: 'Weiterverwendung prüfen',
            text: 'Gut erhaltene Möbel zuerst verschenken, verkaufen oder einer geeigneten Annahmestelle anbieten. Fotografieren Sie Zustand, Maße und erkennbare Schäden ehrlich.',
          },
          {
            title: 'Maße und Transportweg aufnehmen',
            text: 'Notieren Sie Breite, Höhe und Tiefe. Prüfen Sie Treppenhaus, Aufzug, Haustür und Weg bis zur möglichen Fahrzeugposition. Bei Schränken zählt außerdem, ob sie demontiert werden müssen.',
          },
          {
            title: 'Menge vollständig angeben',
            text: 'Nennen Sie alle Teile, nicht nur das größte Möbelstück. Ein Sofa plus Matratze plus Schrankteile ist ein anderer Auftrag als eine einzelne Couch.',
          },
          {
            title: 'Termin und Bereitstellung klären',
            text: 'Bei der BSR gelten deren Buchungs- und Bereitstellungsbedingungen. Bei einem privaten Service sollte schriftlich feststehen, ob Abbau, Tragen, Verladen und Entsorgung enthalten sind.',
          },
        ],
      },
      {
        h: 'Was gilt für Waschmaschine und andere Elektrogeräte?',
        p: [
          'Elektroaltgeräte gehören nicht in den Hausmüll. Die BSR nimmt große und kleine Geräte auf ihren Recyclinghöfen kostenlos an. Eine Abholung ist nach Angaben der BSR in Verbindung mit einer Sperrmüllbestellung möglich.',
          'Strom- und Wasseranschlüsse müssen vor der Abholung bereits getrennt sein. Arbeiten an festen Elektro-, Gas- oder Wasseranschlüssen gehören in fachkundige Hände.',
          'Bei einer Anfrage sollten Sie Gerätetyp, ungefähres Gewicht, Etage, Aufzug und Anschlusszustand nennen. So lässt sich vorab klären, ob Tragen und Mitnahme möglich sind.',
        ],
      },
      {
        h: 'Warum darf Sperrmüll nicht einfach an die Straße?',
        p: [
          'Sperrmüll darf nur entsprechend einer vereinbarten Abholung oder an einer zugelassenen Annahmestelle abgegeben werden. Eine Ablage auf Gehweg, Straße oder Grundstücksrand ohne geregelte Abholung ist illegal.',
          'Die BSR weist darauf hin, dass illegale Ablagerungen erhebliche Bußgelder und bei gefährlichen Bestandteilen weitere strafrechtliche Folgen haben können. Fremden Sperrmüll sollten Sie dem Ordnungsamt melden, nicht dazustellen.',
        ],
      },
    ],
    faq: [
      {
        q: 'Kann ich eine Matratze kostenlos entsorgen?',
        a: 'Berliner Privathaushalte können Sperrmüll in haushaltsüblichen Mengen selbst zu einem BSR-Recyclinghof bringen; die BSR nennt bis zu drei Kubikmeter pro Anlieferung. Sie benötigen dafür ein geeignetes Fahrzeug und müssen die Matratze selbst tragen und transportieren. Eine Abholung ist kostenpflichtig.',
      },
      {
        q: 'Holt die BSR Möbel aus der Wohnung?',
        a: 'Bei der Buchung fragt die BSR unter anderem Gebäudeteil, Stockwerk, Treppen, Transportweg, Dachboden und Aufzug ab und bietet bestimmte Zusatzleistungen an. Welche Hilfe für Ihren konkreten Auftrag verfügbar ist, ergibt sich aus dem aktuellen BSR-Buchungsportal. Prüfen Sie die Angaben dort vor dem Abschluss.',
      },
      {
        q: 'Was kostet eine private Möbelabholung?',
        a: 'Der Preis hängt vor allem von Anzahl und Größe der Teile, Etage, Aufzug, Trageweg, Demontage und Entsorgungsart ab. Ohne diese Angaben ist ein Festpreis nicht belastbar. Fotos von Möbeln, Treppenhaus und Zugang ermöglichen eine deutlich genauere Einschätzung.',
      },
      {
        q: 'Kann eine Waschmaschine zusammen mit Möbeln abgeholt werden?',
        a: 'Grundsätzlich kann eine Elektrogeräte-Mitnahme zusammen mit Sperrmüll möglich sein. Das Gerät muss vorher fachgerecht von Strom und Wasser getrennt sein. Geben Sie Gerät, Etage und Aufzug bei der Buchung ausdrücklich an; versteckte oder unangekündigte Zusatzteile können den geplanten Transport verändern.',
      },
    ],
    related: ['kosten-sperrmuellabholung-berlin', 'entruempelung-vorbereiten', 'welche-fotos-fuer-ein-angebot'],
    services: ['sperrmuellabholung-berlin', 'entruempelung-berlin', 'kellerentruempelung-berlin'],
    sources: [
      {
        label: 'Sperrmüllabfuhr: Annahme, Termine und Alternativen',
        url: 'https://www.bsr.de/sperrmuell-buchen',
        publisher: 'Berliner Stadtreinigung',
        checked: '2026-07-30',
      },
      {
        label: 'Elektroaltgeräte richtig entsorgen',
        url: 'https://www.bsr.de/elektrogeraete',
        publisher: 'Berliner Stadtreinigung',
        checked: '2026-07-30',
      },
    ],
    published: '2026-07-30',
    updated: '2026-07-30',
  },

  /* ================================================================== */
  {
    slug: 'wohnungsaufloesung-checkliste-pdf',
    status: 'published',
    hub: 'ratgeber',
    h1: 'Wohnungsauflösung planen: Checkliste zum Ausdrucken',
    navLabel: 'Checkliste Wohnungsauflösung',
    metaTitle: 'Wohnungsauflösung Checkliste: kostenloses PDF für Berlin',
    metaDescription:
      'Kostenlose Checkliste für die Wohnungsauflösung: Unterlagen, Sortierung, Termine, Entsorgung und Wohnungsübergabe in der richtigen Reihenfolge planen.',
    answer:
      'Eine Wohnungsauflösung beginnt nicht mit dem Wegwerfen, sondern mit Terminen, Vollmachten und einer klaren Sortierung. Sichern Sie zuerst Unterlagen und persönliche Gegenstände. Markieren Sie anschließend, was bleibt, verkauft, verschenkt oder entsorgt wird. Klären Sie dann Räumung, Abmeldungen und Wohnungsübergabe. Die kostenlose PDF-Checkliste führt in dieser Reihenfolge durch alle Schritte und lässt Platz für Termine, Zuständigkeiten und Notizen.',
    teaser:
      'Alle Schritte von den Unterlagen bis zur Schlüsselübergabe – als Seite und kostenlose Druck-PDF.',
    blocks: [
      {
        h: 'Die fünf Phasen einer Wohnungsauflösung',
        steps: [
          {
            title: 'Auftrag und Fristen klären',
            text: 'Mietende, Übergabetermin, Vollmacht und entscheidungsberechtigte Personen festhalten. Bei einem Nachlass zuerst die Erb- und Verfügungsberechtigung klären.',
          },
          {
            title: 'Unterlagen und Persönliches sichern',
            text: 'Verträge, Urkunden, Fotos, Schlüssel, Wertsachen, Medikamente und digitale Geräte aus der späteren Sortierung herausnehmen.',
          },
          {
            title: 'Bestand sichtbar entscheiden',
            text: 'Mit vier eindeutigen Kategorien arbeiten: behalten, verkaufen oder verschenken, spenden, entsorgen. Unklare Dinge bekommen eine begrenzte Prüfzone statt vieler verteilter Stapel.',
          },
          {
            title: 'Räumung und Zusatzarbeiten planen',
            text: 'Volumen, Etage, Aufzug, Keller, Dachboden, Demontage, Bodenbeläge und Trageweg vollständig aufnehmen. Erst danach Angebote vergleichen.',
          },
          {
            title: 'Übergabe vorbereiten',
            text: 'Zählerstände, Schlüssel, Zustand und offene Arbeiten dokumentieren. Zwischen Räumung und Übergabe möglichst einen Puffertag lassen.',
          },
        ],
      },
      {
        h: 'Was muss vor der ersten Entsorgung gesichert werden?',
        list: [
          'Personalausweise, Geburts- und Heiratsurkunden, Testamente und Vollmachten',
          'Mietvertrag, Übergabeprotokolle, Betriebskosten- und Versorgerunterlagen',
          'Bank-, Versicherungs-, Renten- und Steuerunterlagen',
          'Schlüssel für Wohnung, Keller, Briefkasten, Garage und Schließfächer',
          'Medikamente, Hilfsmittel und sensible Gesundheitsunterlagen',
          'Fotos, Briefe, Schmuck, Sammlungen und Erinnerungsstücke',
          'Computer, Telefone, Datenträger und Zugangsdaten',
          'Gegenstände, über die mehrere Angehörige gemeinsam entscheiden müssen',
        ],
        note: {
          title: 'Bei einem Todesfall',
          text: 'Nichts endgültig verwerten oder entsorgen, solange nicht geklärt ist, wer verfügen darf und ob eine Erbausschlagung erwogen wird. Die [Reihenfolge nach einem Todesfall](/ratgeber/haushaltsaufloesung-nach-todesfall/) ist gesondert erklärt.',
          tone: 'caution',
        },
      },
      {
        h: 'Welche Angaben braucht ein vergleichbares Angebot?',
        table: {
          caption: 'Diese Angaben sollten bei allen angefragten Betrieben identisch sein',
          head: ['Bereich', 'Benötigte Angabe', 'Typischer Nachweis'],
          rows: [
            ['Objekt', 'Räume, Keller, Dachboden, Balkon und Nebenflächen', 'Raumliste und Übersichtsfotos'],
            ['Zugang', 'Etage, Aufzug, Treppenhaus und Trageweg', 'Fotos von Zugang und Straße'],
            ['Bestand', 'Füllgrad, große Möbel, Elektrogeräte, Sondermaterial', 'Fotos bei geöffneten Schränken'],
            ['Leistungsumfang', 'Demontage, Bodenbeläge, Reinigung, Übergabe', 'schriftliche Aufgabenliste'],
            ['Termin', 'Räumungsfenster und späteste Übergabe', 'bestätigter Terminplan'],
            ['Abrechnung', 'enthaltene Arbeiten und mögliche Zusatzkosten', 'schriftliches Angebot'],
          ],
        },
        p: [
          'Wenn jeder Betrieb andere Informationen erhält, sind die Preise nicht vergleichbar. Schicken Sie deshalb dieselbe Raumliste und dieselben Fotos an alle angefragten Unternehmen.',
          'Die Anleitung [Welche Fotos braucht ein Angebot?](/ratgeber/welche-fotos-fuer-ein-angebot/) zeigt, welche Aufnahmen Volumen und Arbeitsweg sichtbar machen.',
        ],
      },
      {
        h: 'Was gehört in die letzte Übergabeprüfung?',
        list: [
          'alle vereinbarten Räume und Nebenflächen vollständig kontrolliert',
          'Fenster, Türen, Einbauten und sichtbare Schäden fotografiert',
          'Strom-, Gas-, Wasser- und Heizungszähler abgelesen und fotografiert',
          'Anzahl und Art aller übergebenen Schlüssel notiert',
          'offene Arbeiten nur konkret und mit Zuständigkeit ins Protokoll aufgenommen',
          'Protokoll vollständig gelesen und eine unterschriebene Kopie erhalten',
          'Versorger, Versicherungen und relevante Vertragspartner informiert',
          'Nachsendeauftrag und neue Kontaktadresse eingerichtet, falls erforderlich',
        ],
        p: [
          'Ein Übergabeprotokoll dokumentiert den Zustand und kann spätere Streitpunkte reduzieren. Unterschreiben Sie keine pauschalen Zusatzpflichten, die Sie nicht geprüft haben. Bei Unsicherheit hilft eine unabhängige Mietrechtsberatung.',
          'Eine ausführlichere Vorbereitung steht in der [Checkliste zur Wohnungsübergabe](/ratgeber/checkliste-wohnungsuebergabe/).',
        ],
      },
      {
        h: 'Wie benutze ich die PDF-Checkliste?',
        p: [
          'Drucken Sie die Liste aus und tragen Sie oben Objekt, Übergabetermin und verantwortliche Person ein. Jede Aufgabe hat ein Kontrollkästchen sowie Platz für Termin oder Notiz.',
          'Bei mehreren Beteiligten empfiehlt sich eine Farbe pro Person. Fotografieren Sie die ausgefüllte Liste nach jedem Termin, damit keine Information nur auf einem einzelnen Blatt bleibt.',
          'Die PDF enthält bewusst keine Preise und keine pauschalen rechtlichen Aussagen. Sie ist ein Arbeitsplan, der sich für Umzug, Haushaltsauflösung, Nachlassauflösung und Übergabe anpassen lässt.',
        ],
      },
    ],
    faq: [
      {
        q: 'Wie früh sollte eine Wohnungsauflösung beginnen?',
        a: 'Sobald der Übergabetermin feststeht, sollte rückwärts geplant werden. Bei einer vollständig eingerichteten Wohnung sind mehrere Wochen Vorlauf sinnvoll. Zwischen Räumung und Übergabe sollte möglichst mindestens ein Puffertag liegen, damit vergessene Bereiche oder offene Arbeiten nicht am Übergabetermin auffallen.',
      },
      {
        q: 'Muss die Wohnung besenrein übergeben werden?',
        a: 'Maßgeblich sind Mietvertrag, wirksame Vereinbarungen und der konkrete Zustand. Besenrein bedeutet üblicherweise grob gereinigt und frei von zurückgelassenem Besitz, ist aber keine pauschale Renovierungspflicht. Bei Streit über Schönheitsreparaturen sollten Sie den Vertrag unabhängig prüfen lassen.',
      },
      {
        q: 'Kann ich die Checkliste auch für einen Nachlass verwenden?',
        a: 'Ja, aber erst nachdem geklärt ist, wer über den Nachlass verfügen darf. Ergänzen Sie bei einer Erbengemeinschaft die entscheidungsberechtigten Personen und dokumentieren Sie Freigaben. Persönliche Unterlagen und Erinnerungsstücke sollten vor jeder Verkaufs- oder Entsorgungsentscheidung gesondert gesichert werden.',
      },
    ],
    related: ['checkliste-wohnungsuebergabe', 'haushaltsaufloesung-nach-todesfall', 'welche-fotos-fuer-ein-angebot'],
    services: ['wohnungsaufloesung-berlin', 'haushaltsaufloesung-berlin', 'nachlassaufloesung-berlin'],
    sources: [
      {
        label: '10 Fragen zur Wohnungsrückgabe',
        url: 'https://www.berliner-mieterverein.de/magazin/online/hintergrund/10-fragen-zur-wohnungsrueckgabe-wie-eine-gute-uebergabe-gelingt-121822.htm',
        publisher: 'Berliner Mieterverein',
        checked: '2026-07-30',
      },
      {
        label: 'Hinweise zu Übergabeprotokoll und Zählerständen',
        url: 'https://www.verbraucherzentrale.de/sites/default/files/2021-12/energiefuhrerschein_unterrichtsvorschlag_uberarbeitet.pdf',
        publisher: 'Verbraucherzentrale',
        checked: '2026-07-30',
      },
    ],
    download: {
      href: '/downloads/wohnungsaufloesung-checkliste.pdf',
      label: 'Wohnungsauflösung-Checkliste als PDF',
      description:
        'Vier Seiten mit Aufgaben, Kontrollkästchen, Zuständigkeiten und Platz für Übergabetermin, Zählerstände und Schlüssel.',
    },
    published: '2026-07-30',
    updated: '2026-07-30',
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
