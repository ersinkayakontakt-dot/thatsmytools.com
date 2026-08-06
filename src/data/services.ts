import type { Service } from './types.ts';

/**
 * LEISTUNGEN
 * ==========
 * Reihenfolge = Reihenfolge in Navigation und Übersicht.
 * `status: 'draft'` -> noindex, nicht in der Sitemap, nicht verlinkt.
 *
 * Preise stehen bewusst nirgends als Zahl. Erklärt wird, WORAUS sich der
 * Preis zusammensetzt. Sobald echte Auftragsdaten vorliegen, werden in
 * src/data/costs.ts die Spannen ergänzt (siehe CONTENT-TODO.md).
 */

export const services: Service[] = [
  /* ================================================================== */
  {
    slug: 'entruempelung-berlin',
    status: 'published',
    h1: 'Entrümpelung in Berlin',
    navLabel: 'Entrümpelung',
    metaTitle: 'Entrümpelung Berlin: Ablauf, Kosten und Termin | Schnellhelfer24',
    metaDescription:
      'Entrümpelung in Berlin und Umland: Besichtigung oder Fotoeinschätzung, feste Absprache vor Beginn, Abtransport und Entsorgung, auf Wunsch besenreine Übergabe.',
    answer:
      'Bei einer Entrümpelung räumen wir einzelne Räume oder ganze Objekte leer, transportieren den Inhalt ab und führen ihn getrennt der Entsorgung oder Verwertung zu. Wir schätzen den Aufwand vorab anhand von Fotos oder bei einer Besichtigung ein und halten fest, was enthalten ist. Der Einsatz findet in Berlin und im Umland statt. Auf Wunsch übergeben wir die Räume besenrein.',
    teaser: 'Einzelne Räume oder ganze Objekte leerräumen, abtransportieren und getrennt entsorgen.',
    icon: 'boxes',
    serviceType: 'Entrümpelung',
    situations: [
      'Ein Raum, ein Keller oder eine ganze Wohnung soll leer werden.',
      'Nach einem Umzug ist Sperrmüll übrig geblieben.',
      'Eine Immobilie soll verkauft oder neu vermietet werden.',
    ],
    includes: [
      'Anfahrt innerhalb des vereinbarten Einsatzgebiets',
      'Demontage einfacher Möbel, soweit für den Abtransport nötig',
      'Heraustragen aus allen Etagen',
      'Beladung und Abtransport',
      'Getrennte Zuführung zu Entsorgung und Verwertung',
      'Besenreine Übergabe, wenn vereinbart',
    ],
    notIncluded: [
      'Renovierungsarbeiten wie Malern, Tapetenabriss oder Bodenaufnahme (auf Anfrage möglich)',
      'Entsorgung von Sondermüll, für den ein eigener Nachweis nötig ist',
      'Grundreinigung im Sinne einer Endreinigung mit Reinigungsmitteln',
    ],
    blocks: [
      {
        h: 'Was gehört zu einer Entrümpelung?',
        p: [
          'Eine Entrümpelung bedeutet: Der vereinbarte Bereich wird vollständig leergeräumt. Dazu zählen Möbel, Hausrat, Kartons, Textilien, Elektrogeräte und alles, was zuvor als zu räumen markiert wurde. Was mitgenommen wird und was bleibt, klären wir vor Beginn und halten es schriftlich fest.',
          'Der Unterschied zur Haushaltsauflösung liegt im Umfang und im Anlass. Eine Entrümpelung kann auch nur den Keller betreffen. Eine Haushaltsauflösung löst dagegen einen kompletten Haushalt auf, meist samt Bewertung dessen, was noch verwertbar ist.',
        ],
      },
      {
        h: 'Wie läuft eine Entrümpelung ab?',
        steps: [
          {
            title: 'Einschätzung',
            text: 'Sie senden uns Fotos aus jedem betroffenen Raum oder wir vereinbaren eine Besichtigung. Für die Einschätzung brauchen wir außerdem Etage, Aufzug und die Zufahrtssituation.',
          },
          {
            title: 'Absprache',
            text: 'Sie erhalten eine Aufstellung, was enthalten ist, wie viel Zeit wir einplanen und was den Preis verändern würde. Was aussortiert und behalten werden soll, notieren wir vorher.',
          },
          {
            title: 'Vorbereitung',
            text: 'Falls nötig, kümmern wir uns um eine Halteverbotszone. In Berliner Innenstadtlagen ist das häufig sinnvoll, weil sonst die Tragewege sehr lang werden.',
          },
          {
            title: 'Einsatztag',
            text: 'Wir räumen, tragen aus und beladen. Zu behaltende Gegenstände werden zuerst gesichert und getrennt gestellt, damit nichts versehentlich mitgeht.',
          },
          {
            title: 'Übergabe',
            text: 'Gemeinsame Abnahme, auf Wunsch besenrein. Sie erhalten die Rechnung mit den durchgeführten Positionen.',
          },
        ],
      },
      {
        h: 'Was passiert mit verwertbaren Gegenständen?',
        p: [
          'Nicht alles, was aus einer Wohnung kommt, ist Abfall. Gut erhaltene Möbel, funktionierende Elektrogeräte, Werkzeug oder Fahrräder lassen sich weitergeben oder verwerten. Wenn sich daraus ein Wert ergibt, rechnen wir ihn auf den Auftrag an und weisen ihn auf der Rechnung aus.',
          'Umgekehrt gilt: Wir behaupten nicht vorab, eine Entrümpelung werde durch Wertanrechnung kostenlos. Das kommt in der Praxis selten vor und hängt vom tatsächlichen Inhalt ab. Was anrechenbar ist, sagen wir bei der Besichtigung.',
        ],
      },
      {
        h: 'Welche Fotos brauchen wir für eine Einschätzung?',
        list: [
          'Ein Übersichtsfoto pro Raum, aufgenommen von der Tür aus',
          'Zusätzlich volle Schränke geöffnet, damit der Inhalt sichtbar ist',
          'Keller, Dachboden, Balkon und Abstellräume nicht vergessen',
          'Ein Foto des Hausflurs und des Treppenhauses',
          'Die Straße vor dem Haus, damit wir die Halteposition beurteilen können',
        ],
        note: {
          title: 'Warum das wichtig ist',
          text: 'Je vollständiger die Fotos, desto belastbarer die Einschätzung. Fehlt der Keller auf den Bildern, verschiebt sich der Aufwand am Einsatztag und damit auch der Preis.',
          tone: 'info',
        },
      },
      {
        h: 'Wie kurzfristig ist ein Termin möglich?',
        p: [
          'Das hängt von der Auslastung und vom Umfang ab. Kleine Einsätze lassen sich eher kurzfristig einschieben als eine Vier-Zimmer-Wohnung mit vollem Keller. Rufen Sie an, wenn es eilig ist, dann sagen wir Ihnen direkt, was realistisch ist. Eine pauschale Zusage wie "Termin innerhalb von 24 Stunden" geben wir nicht, weil sie sich nicht immer halten lässt.',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Volumen',
        effect: 'stärkster Einzelfaktor',
        why: 'Die Menge bestimmt Fahrzeuggröße, Anzahl der Fahrten und die Entsorgungskosten. Gemessen wird in Kubikmetern, nicht in Quadratmetern.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'deutlicher Aufschlag ohne Aufzug',
        why: 'Jeder Gegenstand wird von Hand getragen. Zwischen zweitem Stock mit Aufzug und viertem Stock ohne Aufzug liegen bei gleicher Menge mehrere Arbeitsstunden.',
      },
      {
        name: 'Tragweg und Parksituation',
        effect: 'mittel',
        why: 'Steht das Fahrzeug 80 Meter entfernt im Hinterhof, verdoppelt sich der Weg pro Trage. In Berliner Altbaugebieten ist eine Halteverbotszone oft günstiger als der Zeitverlust.',
      },
      {
        name: 'Art des Materials',
        effect: 'mittel',
        why: 'Restmüll, Holz, Elektroschrott, Bauschutt und Sperrmüll werden getrennt und unterschiedlich abgerechnet. Bauschutt ist schwer und deshalb pro Kubikmeter teuer.',
      },
      {
        name: 'Zusatzarbeiten',
        effect: 'nach Aufwand',
        why: 'Fest verbaute Küchen, Einbauschränke, Teppichböden oder Lampen bedeuten Demontage. Das wird getrennt kalkuliert, damit es nachvollziehbar bleibt.',
      },
      {
        name: 'Verwertbares',
        effect: 'kann den Preis senken',
        why: 'Was sich weitergeben lässt, wird angerechnet. Die Höhe hängt vom tatsächlichen Zustand ab und wird bei der Besichtigung festgelegt.',
      },
    ],
    faq: [
      {
        q: 'Muss ich bei der Entrümpelung anwesend sein?',
        a: 'Nein, aber jemand muss uns hineinlassen und am Ende abnehmen. Viele Kundinnen und Kunden sind zu Beginn dabei, zeigen die Räume und die Gegenstände, die bleiben sollen, und kommen zur Übergabe wieder. Bei Aufträgen über Hausverwaltungen oder Angehörige aus anderen Städten organisieren wir die Schlüsselübergabe vorher schriftlich.',
      },
      {
        q: 'Kann die Wohnung besenrein übergeben werden?',
        a: 'Ja, wenn das vereinbart ist. Besenrein bedeutet: leer, gefegt, grober Schmutz entfernt. Es ist keine Endreinigung. Wenn der Vermieter eine gereinigte Wohnung mit gewischten Böden und geputzten Fenstern verlangt, sagen Sie uns das vorher, dann planen wir es als eigene Position ein.',
      },
      {
        q: 'Was ist mit persönlichen Dokumenten und Fotos?',
        a: 'Wir sammeln Unterlagen, Fotoalben, Ausweise und ähnliche Fundstücke getrennt und legen sie an einer vereinbarten Stelle ab, statt sie zu entsorgen. Besonders bei Nachlässen kommt einiges zusammen, das später gebraucht wird. Sagen Sie uns vorher, worauf wir achten sollen.',
      },
      {
        q: 'Entrümpeln Sie auch am Wochenende?',
        a: 'Ein Samstagstermin kann individuell geprüft werden. Entscheidend sind Auslastung, Hausordnung und Lärmschutz. Nennen Sie bei der Anfrage Ihr Zeitfenster; verbindlich ist ein Wochenendtermin erst, wenn er ausdrücklich bestätigt wurde.',
      },
      {
        q: 'Was kostet eine Entrümpelung in Berlin?',
        a: 'Der Preis richtet sich nach Volumen, Etage, Zugang, Materialart und Zusatzarbeiten. Eine seriöse Zahl lässt sich erst nach Fotos oder einer Besichtigung nennen. Wir arbeiten mit einer festen Absprache vor Beginn, damit am Einsatztag keine Überraschung entsteht. Die einzelnen Faktoren sind auf dieser Seite und im Kostenbereich erklärt.',
      },
    ],
    related: ['haushaltsaufloesung-berlin', 'kellerentruempelung-berlin', 'sperrmuellabholung-berlin'],
    guides: ['was-kostet-eine-entruempelung-in-berlin', 'sperrmuell-moebel-entsorgen-berlin', 'entruempelung-vorbereiten'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'haushaltsaufloesung-berlin',
    status: 'published',
    h1: 'Haushaltsauflösung in Berlin',
    navLabel: 'Haushaltsauflösung',
    metaTitle: 'Haushaltsauflösung Berlin: Ablauf, Kosten, Wertanrechnung',
    metaDescription:
      'Haushaltsauflösung in Berlin: Hausrat wird gesichtet, Verwertbares angerechnet, alles Übrige getrennt entsorgt. Besichtigung und feste Absprache vor Beginn.',
    answer:
      'Bei einer Haushaltsauflösung wird der gesamte Hausrat einer Wohnung oder eines Hauses aufgelöst. Wir sichten den Bestand, trennen Verwertbares von Abfall, rechnen einen etwaigen Wert auf den Auftrag an und entsorgen den Rest getrennt. Persönliche Unterlagen legen wir zur Seite statt sie wegzuwerfen. Am Ende steht eine leere, auf Wunsch besenreine Wohnung.',
    teaser: 'Kompletter Hausrat: sichten, Verwertbares anrechnen, den Rest fachgerecht entsorgen.',
    icon: 'home',
    serviceType: 'Haushaltsauflösung',
    situations: [
      'Ein Haushalt wird nach einem Umzug ins Heim aufgelöst.',
      'Angehörige lösen den Haushalt einer verstorbenen Person auf.',
      'Ein Haus wird verkauft und muss leer übergeben werden.',
    ],
    includes: [
      'Sichtung des gesamten Hausrats vor Beginn',
      'Trennung in behalten, verwerten, entsorgen',
      'Aussortieren und Sichern persönlicher Unterlagen',
      'Demontage von Möbeln und einfachen Einbauten',
      'Abtransport und getrennte Entsorgung',
      'Anrechnung verwertbarer Gegenstände auf die Rechnung',
      'Besenreine Übergabe nach Vereinbarung',
    ],
    notIncluded: [
      'Bewertung oder Verkauf von Kunst, Antiquitäten und Sammlungen (dafür empfehlen wir eine Fachbewertung vor der Auflösung)',
      'Renovierung und Schönheitsreparaturen',
      'Abmeldung von Verträgen und Behördengänge',
    ],
    blocks: [
      {
        h: 'Wodurch unterscheidet sich eine Haushaltsauflösung von einer Entrümpelung?',
        p: [
          'Der Umfang ist der eine Unterschied: Eine Haushaltsauflösung betrifft den kompletten Hausrat, nicht nur einen Raum. Der zweite Unterschied ist die Sichtung. Bei einer Auflösung geht es auch darum, was erhalten bleibt, was noch einen Wert hat und was zurück an die Familie geht.',
          'Deshalb dauert eine Haushaltsauflösung im Verhältnis länger als eine reine Entrümpelung gleicher Größe. Der Zeitaufwand steckt im Sortieren, nicht im Tragen.',
        ],
      },
      {
        h: 'Was passiert vor dem eigentlichen Einsatz?',
        steps: [
          {
            title: 'Besichtigung',
            text: 'Bei einer kompletten Auflösung empfehlen wir eine Besichtigung statt einer reinen Fotoeinschätzung. Der Bestand ist zu unterschiedlich, um ihn zuverlässig von Bildern abzulesen.',
          },
          {
            title: 'Bestandsliste',
            text: 'Wir gehen mit Ihnen durch, was mitgenommen, was verwertet und was entsorgt wird. Wertgegenstände, Dokumente und Erinnerungsstücke werden getrennt notiert.',
          },
          {
            title: 'Angebot mit Positionen',
            text: 'Sie sehen, wie sich der Aufwand zusammensetzt und welcher Betrag für Verwertbares angerechnet wird.',
          },
          {
            title: 'Durchführung',
            text: 'Je nach Größe ein bis mehrere Tage. Behaltene Gegenstände werden zuerst gesichert.',
          },
          {
            title: 'Übergabe',
            text: 'Abnahme gemeinsam mit Ihnen oder der Hausverwaltung. Auf Wunsch dokumentieren wir den Zustand mit Fotos.',
          },
        ],
      },
      {
        h: 'Wie funktioniert die Wertanrechnung?',
        p: [
          'Verwertbares senkt den Rechnungsbetrag. In der Praxis betrifft das gut erhaltene Möbel, funktionierende Haushaltsgeräte, Werkzeug, Fahrräder, Metalle und gelegentlich Sammlerstücke. Der angerechnete Betrag wird als eigene Position ausgewiesen, damit er nachvollziehbar bleibt.',
          'Was wir nicht tun: mit einer "kostenlosen Haushaltsauflösung" werben. Dass der Wert des Hausrats die Kosten deckt, ist die Ausnahme. Wenn sich bei der Besichtigung abzeichnet, dass es in Ihrem Fall so kommt, sagen wir es Ihnen.',
        ],
        note: {
          title: 'Vor der Auflösung prüfen lassen',
          text: 'Wenn Sie vermuten, dass Kunst, Schmuck, Münzen, Porzellan oder Musikinstrumente von Wert dabei sind, lassen Sie diese vorher gesondert bewerten. Eine Haushaltsauflösung ist nicht der richtige Rahmen für eine Wertermittlung.',
          tone: 'caution',
        },
      },
      {
        h: 'Was gehört bei einer Auflösung besonders beachtet?',
        list: [
          'Versicherungsunterlagen, Rentenbescheide und Verträge werden häufig noch gebraucht',
          'Schlüssel für Keller, Briefkasten, Garage und Nebenräume sammeln',
          'Zählerstände für Strom, Gas und Wasser vor der Übergabe ablesen',
          'Eingebaute Küchen: klären, ob sie bleiben oder mit ausgebaut werden',
          'Bei Mietwohnungen: den Übergabetermin des Vermieters kennen, bevor der Einsatz geplant wird',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Wohnfläche und Füllgrad',
        effect: 'hoch',
        why: 'Zwei Wohnungen mit 70 Quadratmetern können sich im Volumen um den Faktor drei unterscheiden. Entscheidend ist, wie voll die Schränke und Nebenräume sind.',
      },
      {
        name: 'Sortieraufwand',
        effect: 'hoch',
        why: 'Wenn viel gesichtet und getrennt werden muss, steckt der Aufwand in der Arbeitszeit vor Ort, nicht im Abtransport.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'hoch',
        why: 'Bei einer kompletten Auflösung kommen viele Wege zusammen. Ohne Aufzug ist der Unterschied größer als bei jeder anderen Leistung.',
      },
      {
        name: 'Nebenräume',
        effect: 'oft unterschätzt',
        why: 'Keller, Dachboden, Garage und Balkon werden bei der ersten Schätzung häufig vergessen und machen am Ende einen erheblichen Teil des Volumens aus.',
      },
      {
        name: 'Wertanrechnung',
        effect: 'senkt den Preis',
        why: 'Verwertbares wird gegengerechnet. Der Betrag hängt vom tatsächlichen Zustand ab.',
      },
    ],
    faq: [
      {
        q: 'Wie lange dauert eine Haushaltsauflösung?',
        a: 'Eine kleine Wohnung mit wenig Inhalt ist oft an einem Tag erledigt. Bei größeren Wohnungen mit vollem Keller und Dachboden werden zwei bis drei Tage daraus. Die genaue Dauer sagen wir nach der Besichtigung, weil sie stark vom Sortieraufwand abhängt und nicht allein von der Quadratmeterzahl.',
      },
      {
        q: 'Was passiert mit Dokumenten und Fotos?',
        a: 'Wir sammeln sie getrennt und legen sie an einer vereinbarten Stelle ab. Ausweise, Urkunden, Versicherungsunterlagen, Fotoalben und Briefe werfen wir nicht weg. Wenn Sie nicht vor Ort sein können, packen wir alles in beschriftete Kisten, die Sie später durchsehen können.',
      },
      {
        q: 'Können Sie die Wohnung an den Vermieter übergeben?',
        a: 'Nach Absprache und mit entsprechender Vollmacht ja. Das wird häufig gewünscht, wenn Angehörige nicht in Berlin wohnen. Wir dokumentieren die Übergabe mit Fotos und leiten das Protokoll und die Schlüsselzahl an Sie weiter.',
      },
      {
        q: 'Nehmen Sie auch die Einbauküche mit?',
        a: 'Ja, sofern das vereinbart ist. Eine Einbauküche muss demontiert werden, dabei fallen Wasseranschluss, Elektroanschluss und Arbeitsplatte an. Das kalkulieren wir als eigene Position, weil der Aufwand je nach Küche sehr unterschiedlich ist. Klären Sie vorher mit dem Vermieter, ob die Küche überhaupt entfernt werden soll.',
      },
    ],
    // Der Umzug ins Pflegeheim oder in eine kleinere Wohnung ist der
    // häufigste Anlass einer Haushaltsauflösung – deshalb steht der
    // Seniorenumzug hier und nicht nur unter „Umzug".
    related: [
      'wohnungsaufloesung-berlin',
      'nachlassaufloesung-berlin',
      'seniorenumzug-berlin',
      'entruempelung-berlin',
    ],
    guides: ['kosten-haushaltsaufloesung-berlin', 'haushaltsaufloesung-nach-todesfall', 'wohnungsaufloesung-checkliste-pdf'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'wohnungsaufloesung-berlin',
    status: 'published',
    h1: 'Wohnungsauflösung in Berlin',
    navLabel: 'Wohnungsauflösung',
    metaTitle: 'Wohnungsauflösung Berlin: leer und fristgerecht übergeben',
    metaDescription:
      'Wohnungsauflösung in Berlin mit Blick auf den Übergabetermin: räumen, entsorgen, Kleinreparaturen abstimmen und besenrein an den Vermieter übergeben.',
    answer:
      'Eine Wohnungsauflösung räumt eine Mietwohnung vollständig leer, damit sie fristgerecht an den Vermieter zurückgehen kann. Wir richten die Planung am Übergabetermin aus, entfernen auch Einbauten wie Lampen, Teppichböden oder Dübel, wenn das verlangt ist, und übergeben die Wohnung besenrein. Auf Wunsch dokumentieren wir den Zustand und sind bei der Übergabe dabei.',
    teaser: 'Mietwohnung fristgerecht leer bekommen, inklusive Einbauten und Übergabetermin.',
    icon: 'key',
    serviceType: 'Wohnungsauflösung',
    situations: [
      'Der Mietvertrag ist gekündigt und der Übergabetermin steht fest.',
      'Eine Wohnung muss nach einem Heimeinzug aufgelöst werden.',
      'Die Hausverwaltung braucht die Wohnung geräumt zur Neuvermietung.',
    ],
    includes: [
      'Terminplanung ausgerichtet am Übergabedatum',
      'Vollständige Räumung aller Räume und Nebenräume',
      'Entfernen von Lampen, Regalen, Teppichböden und Dübeln nach Absprache',
      'Abtransport und getrennte Entsorgung',
      'Besenreine Übergabe',
      'Anwesenheit bei der Wohnungsübergabe nach Vereinbarung',
    ],
    notIncluded: [
      'Schönheitsreparaturen wie Streichen oder Tapezieren (auf Anfrage über Partnerbetriebe)',
      'Reparatur von Schäden an Wänden, Böden oder Sanitär',
      'Rechtliche Beratung zu Streitigkeiten mit dem Vermieter',
    ],
    blocks: [
      {
        h: 'Warum der Übergabetermin die Planung bestimmt',
        p: [
          'Bei einer Wohnungsauflösung gibt es fast immer ein festes Datum. Läuft die Kündigungsfrist ab, zahlen Sie weiter Miete, solange die Wohnung nicht übergeben ist. Deshalb planen wir rückwärts: Übergabetermin, davor der Puffer für Nacharbeiten, davor der Räumungstag.',
          'Planen Sie mindestens drei bis fünf Tage zwischen Räumung und Übergabe ein. In dieser Zeit lassen sich Dinge nachholen, die erst auffallen, wenn die Wohnung leer ist. Dübellöcher und Bohrspuren sieht man erst, wenn das Regal weg ist.',
        ],
      },
      {
        h: 'Was verlangt der Vermieter üblicherweise?',
        table: {
          caption: 'Typische Anforderungen bei der Wohnungsübergabe in Berlin',
          head: ['Anforderung', 'Was das bedeutet', 'Von uns leistbar'],
          rows: [
            ['Besenrein', 'Leer, gefegt, grober Schmutz entfernt', 'Ja, standardmäßig auf Wunsch'],
            ['Vollständig geräumt', 'Auch Keller, Dachboden, Balkon und Garage', 'Ja, wenn im Auftrag benannt'],
            ['Lampen entfernt, Anschlüsse gesichert', 'Deckenauslässe abgeklemmt und abgedeckt', 'Ja, nach Absprache'],
            ['Dübel entfernt, Löcher verschlossen', 'Bohrlöcher zugespachtelt', 'Nach Absprache als eigene Position'],
            ['Teppichboden entfernt', 'Boden aufgenommen und entsorgt', 'Ja, gesondert kalkuliert'],
            ['Schönheitsreparaturen', 'Streichen, Tapezieren', 'Über Partnerbetriebe, nicht in Eigenleistung'],
          ],
        },
        p: [
          'Nicht jede Forderung im Übergabeprotokoll ist automatisch berechtigt. Ob Schönheitsreparaturen geschuldet sind, hängt vom Mietvertrag ab. Prüfen Sie das, bevor Sie Leistungen beauftragen, die Sie möglicherweise nicht schulden.',
        ],
      },
      {
        h: 'Was tun, wenn die Zeit knapp ist?',
        p: [
          'Rufen Sie an und nennen Sie das Übergabedatum zuerst. Wir sagen Ihnen ehrlich, ob es sich ausgeht. Wenn nicht, ist es besser, Sie wissen es früh genug, um mit dem Vermieter über eine Verlängerung zu sprechen.',
          'Wenn nur ein Teil der Wohnung geräumt werden muss, weil Sie den Rest selbst schaffen, sagen Sie das. Ein Teilauftrag ist oft schneller planbar als eine komplette Räumung.',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Umfang der Räumung',
        effect: 'hoch',
        why: 'Vollständige Räumung inklusive Keller und Dachboden gegenüber reiner Wohnungsräumung macht einen erheblichen Unterschied im Volumen.',
      },
      {
        name: 'Rückbauarbeiten',
        effect: 'mittel bis hoch',
        why: 'Teppichboden aufnehmen, Dübel entfernen, Einbauschränke ausbauen und Lampen abklemmen sind Handarbeit und werden nach Zeitaufwand berechnet.',
      },
      {
        name: 'Termindruck',
        effect: 'kann Aufschlag bedeuten',
        why: 'Wenn wir kurzfristig ein größeres Team stellen oder Arbeiten auf mehrere Fahrzeuge verteilen, entstehen Mehrkosten. Wir sagen das vorher, nicht auf der Rechnung.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'hoch',
        why: 'Berliner Altbauten haben oft vier oder fünf Geschosse ohne Aufzug. Das verlängert jeden Trageweg.',
      },
    ],
    faq: [
      {
        q: 'Muss die Wohnung frisch gestrichen übergeben werden?',
        a: 'Das hängt vom Mietvertrag ab. Viele ältere Klauseln zu Schönheitsreparaturen sind unwirksam, insbesondere starre Fristenpläne. Prüfen Sie Ihren Vertrag oder lassen Sie ihn prüfen, bevor Sie Malerarbeiten beauftragen. Wir übernehmen die Räumung, die rechtliche Einordnung können wir nicht leisten.',
      },
      {
        q: 'Können Sie bei der Übergabe an den Vermieter dabei sein?',
        a: 'Ja, nach Absprache. Das ist besonders hilfreich, wenn Sie nicht in Berlin wohnen. Wir dokumentieren den Zustand mit Fotos, notieren, welche Schlüssel übergeben werden, und leiten Ihnen das Protokoll weiter. Eine Vollmacht brauchen wir dafür schriftlich.',
      },
      {
        q: 'Was ist mit dem Keller und dem Dachboden?',
        a: 'Beides gehört zur Mietsache und muss in der Regel mit geräumt werden. Sagen Sie uns bei der Anfrage, ob Nebenräume dazugehören, und schicken Sie Fotos davon. Vergessene Kellerräume sind der häufigste Grund, warum eine Einschätzung am Einsatztag nicht mehr stimmt.',
      },
      {
        q: 'Wie schnell kann eine Wohnungsauflösung stattfinden?',
        a: 'Wenn der Termin drängt, rufen Sie an statt zu schreiben. Machbar ist vieles, aber es hängt von Umfang und Auslastung ab. Feste Zusagen wie "innerhalb von 24 Stunden" machen wir nicht, weil sie sich nicht in jedem Fall halten lassen und Sie sich darauf verlassen können müssen.',
      },
    ],
    // Der Wechsel in eine kleinere Wohnung ist neben dem Todesfall der
    // zweithäufigste Anlass einer Wohnungsauflösung. Wer danach sucht,
    // braucht meistens beides: Auflösung und begleiteten Umzug.
    related: [
      'haushaltsaufloesung-berlin',
      'nachlassaufloesung-berlin',
      'seniorenumzug-berlin',
      'entruempelung-berlin',
    ],
    guides: ['wohnungsaufloesung-checkliste-pdf', 'checkliste-wohnungsuebergabe', 'kosten-haushaltsaufloesung-berlin'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'nachlassaufloesung-berlin',
    status: 'published',
    h1: 'Nachlassauflösung in Berlin',
    navLabel: 'Nachlassauflösung',
    metaTitle: 'Nachlassauflösung Berlin: ruhig und in Ihrem Tempo',
    metaDescription:
      'Nachlassauflösung in Berlin: Wohnung eines verstorbenen Angehörigen auflösen. Persönliche Unterlagen werden gesichert, Termine richten sich nach Ihnen.',
    answer:
      'Bei einer Nachlassauflösung lösen wir die Wohnung einer verstorbenen Person auf. Persönliche Unterlagen, Fotos und Erinnerungsstücke werden gesichert statt entsorgt. Wir richten uns nach Ihrem Tempo und arbeiten auch mit Nachlasspflegern, Betreuerinnen und Hausverwaltungen zusammen. Auf Wunsch übernehmen wir die Übergabe an den Vermieter, wenn Sie nicht in Berlin sind.',
    teaser: 'Wohnung nach einem Todesfall auflösen. Unterlagen werden gesichert, Termine richten sich nach Ihnen.',
    icon: 'heart',
    serviceType: 'Nachlassauflösung',
    situations: [
      'Ein Angehöriger ist verstorben und die Wohnung muss aufgelöst werden.',
      'Der Nachlass wird von einem Nachlasspfleger oder Betreuer verwaltet.',
      'Die Erben wohnen nicht in Berlin und brauchen jemanden vor Ort.',
    ],
    includes: [
      'Besichtigung zu einem Termin, der Ihnen passt',
      'Getrenntes Sichern von Dokumenten, Fotos und Erinnerungsstücken',
      'Absprache, welche Gegenstände an die Familie gehen',
      'Räumung, Abtransport und getrennte Entsorgung',
      'Wertanrechnung verwertbarer Gegenstände',
      'Besenreine Übergabe und Begleitung der Wohnungsübergabe nach Vereinbarung',
      'Abstimmung mit Nachlasspflegern, Betreuern und Hausverwaltungen',
    ],
    blocks: [
      {
        h: 'Wie wir in dieser Situation arbeiten',
        p: [
          'Eine Nachlassauflösung ist kein normaler Räumungsauftrag. Es geht um die Wohnung eines Menschen, der gestorben ist, und häufig um Angehörige, die gleichzeitig viele andere Dinge zu regeln haben.',
          'Praktisch heißt das: Wir drängen nicht auf einen schnellen Termin. Wir gehen die Wohnung mit Ihnen durch, bevor irgendetwas bewegt wird. Und wir fragen nach, statt zu entscheiden, wenn unklar ist, ob etwas weg soll.',
          'Wenn Sie nicht dabei sein möchten oder es nicht schaffen, ist das ebenfalls in Ordnung. Dann klären wir vorher schriftlich, worauf wir achten, und Sie bekommen alles Gesammelte in beschrifteten Kisten.',
        ],
      },
      {
        h: 'Was wird auf jeden Fall gesichert?',
        list: [
          'Ausweise, Urkunden, Testamente und notarielle Schreiben',
          'Versicherungspolicen, Renten- und Kontounterlagen, Verträge',
          'Fotoalben, Briefe, Tagebücher, handschriftliche Notizen',
          'Schmuck, Uhren, Münzen und Bargeldfunde',
          'Schlüssel aller Art, auch von Nebenräumen und Fahrzeugen',
          'Digitale Datenträger wie Festplatten, Sticks, Handys und Kameras',
        ],
        note: {
          title: 'Bevor geräumt wird',
          text: 'Wenn ein Erbschein oder eine Erbenermittlung noch aussteht, sollte die Wohnung nicht geräumt werden. Klären Sie das vorher. Wir warten lieber, als in einer ungeklärten Lage zu räumen.',
          tone: 'caution',
        },
      },
      {
        h: 'Zusammenarbeit mit Nachlasspflegern und Betreuern',
        p: [
          'Wir arbeiten regelmäßig mit gerichtlich bestellten Nachlasspflegern, rechtlichen Betreuerinnen und Hausverwaltungen zusammen. In diesen Fällen brauchen wir eine schriftliche Beauftragung, eine klare Regelung zur Schlüsselübergabe und eine Absprache, wie Fundstücke dokumentiert werden.',
          'Auf Wunsch erstellen wir eine Fotodokumentation des Zustands vor und nach der Räumung sowie eine Liste der gesicherten Unterlagen. Das erleichtert die Abrechnung gegenüber dem Nachlassgericht.',
        ],
      },
      {
        h: 'Wie viel Zeit sollten Sie einplanen?',
        p: [
          'Wenn es die Umstände zulassen, planen Sie zwei bis vier Wochen zwischen erster Anfrage und Räumung. Diese Zeit brauchen Sie, um Unterlagen zu sichten, Verträge zu kündigen und in Ruhe zu entscheiden, was bleiben soll.',
          'Wenn der Vermieter zügig übergeben haben möchte oder Miete weiterläuft, geht es auch schneller. Sagen Sie uns, unter welchem Zeitdruck Sie stehen, dann planen wir danach.',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Sichtungsaufwand',
        effect: 'hoch',
        why: 'Bei Nachlässen wird deutlich mehr durchgesehen als bei einer normalen Räumung. Diese Zeit ist der größte Posten.',
      },
      {
        name: 'Wohnungsgröße und Füllgrad',
        effect: 'hoch',
        why: 'Über Jahrzehnte bewohnte Wohnungen enthalten oft mehr, als von außen sichtbar ist. Nebenräume kommen fast immer dazu.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'hoch',
        why: 'Wie bei jeder Räumung der Faktor, der bei gleicher Menge die Arbeitszeit am stärksten verändert.',
      },
      {
        name: 'Dokumentationsbedarf',
        effect: 'gering bis mittel',
        why: 'Fotodokumentation und Fundlisten für Nachlassgericht oder Erben kosten zusätzliche Zeit, sind aber oft nötig.',
      },
      {
        name: 'Wertanrechnung',
        effect: 'senkt den Preis',
        why: 'Wird nach Sichtung festgelegt und gesondert auf der Rechnung ausgewiesen.',
      },
    ],
    faq: [
      {
        q: 'Wann darf eine Nachlasswohnung geräumt werden?',
        a: 'Erst wenn geklärt ist, wer verfügungsberechtigt ist. Das sind die Erben oder ein gerichtlich bestellter Nachlasspfleger. Solange die Erbfolge offen ist, sollte nicht geräumt werden. Wir fragen bei der Beauftragung danach und warten, bis die Lage geklärt ist.',
      },
      {
        q: 'Was passiert mit Fundstücken, die uns wichtig sein könnten?',
        a: 'Wir legen sie getrennt ab und entsorgen sie nicht. Dokumente, Fotos, Schmuck und persönliche Gegenstände kommen in beschriftete Kisten an einen mit Ihnen vereinbarten Ort. Wenn Sie nicht vor Ort sind, schicken wir Fotos der Fundstücke, bevor etwas endgültig entschieden wird.',
      },
      {
        q: 'Können Sie die Auflösung übernehmen, wenn wir nicht in Berlin wohnen?',
        a: 'Ja, das ist ein häufiger Fall. Wir organisieren die Schlüsselübergabe, führen die Besichtigung durch und schicken Ihnen Fotos, damit Sie mitentscheiden können. Auf Wunsch übernehmen wir mit Vollmacht auch die Übergabe an den Vermieter und dokumentieren sie.',
      },
      {
        q: 'Rechnen Sie mit dem Nachlassgericht oder der Versicherung ab?',
        a: 'Wir stellen die Rechnung an den Auftraggeber, also an die Erben, den Nachlasspfleger oder die Hausverwaltung. Für die Vorlage bei Gericht oder Behörden erstellen wir die Rechnung mit einzeln ausgewiesenen Positionen. Ob eine Kostenübernahme erfolgt, entscheidet die jeweilige Stelle, nicht wir.',
      },
    ],
    related: ['haushaltsaufloesung-berlin', 'wohnungsaufloesung-berlin', 'messiwohnung-raeumen'],
    guides: ['haushaltsaufloesung-nach-todesfall', 'wohnungsaufloesung-checkliste-pdf', 'kosten-haushaltsaufloesung-berlin'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'messiwohnung-raeumen',
    status: 'published',
    h1: 'Stark vermüllte Wohnung räumen',
    navLabel: 'Vermüllte Wohnung räumen',
    metaTitle: 'Vermüllte Wohnung räumen in Berlin: diskret und ohne Vorwurf',
    metaDescription:
      'Räumung stark vermüllter Wohnungen in Berlin. Unauffällige Anfahrt, keine Fotos nach außen. Anfrage auch durch Angehörige oder Betreuung möglich.',
    answer:
      'Wir räumen stark vermüllte Wohnungen in Berlin und im Umland. Der Einsatz läuft unauffällig ab: neutrale Anfahrt, keine Kommentare im Haus, keine Veröffentlichung von Fotos. Wir arbeiten mit Schutzausrüstung und trennen den Inhalt vor Ort. Anfragen kommen häufig von Angehörigen, Betreuungen oder Hausverwaltungen. Der Zustand der Wohnung ist für uns kein Thema, sondern eine Aufgabe.',
    teaser: 'Diskrete Räumung stark vermüllter Wohnungen. Ohne Vorwurf, ohne Aufsehen im Haus.',
    icon: 'shield',
    serviceType: 'Wohnungsräumung',
    situations: [
      'Eine Wohnung ist über Jahre zugestellt worden und soll geräumt werden.',
      'Angehörige oder eine Betreuung suchen Hilfe für eine schwierige Situation.',
      'Eine Hausverwaltung muss eine stark belastete Wohnung räumen lassen.',
    ],
    includes: [
      'Besichtigung nach Absprache, auf Wunsch ohne Anwesenheit Dritter',
      'Neutrale Anfahrt ohne auffällige Beschriftung nach Absprache',
      'Arbeit mit Schutzausrüstung',
      'Trennung des Inhalts vor Ort',
      'Sichern von Dokumenten, Papieren und persönlichen Gegenständen',
      'Abtransport und getrennte Entsorgung',
      'Besenreine Übergabe',
      'Empfehlung von Partnerbetrieben für Desinfektion oder Schädlingsbekämpfung, falls nötig',
    ],
    notIncluded: [
      'Desinfektion und Schädlingsbekämpfung in Eigenleistung',
      'Sanierung von Boden- oder Wandschäden',
      'Psychosoziale Beratung oder Betreuung',
    ],
    blocks: [
      {
        h: 'Wie der Einsatz abläuft',
        p: [
          'Zuerst schauen wir uns die Wohnung an. Das geht auch zu einer Uhrzeit, zu der wenig Betrieb im Haus ist. Wenn eine Besichtigung nicht möglich ist, reichen Fotos, auch wenn die Einschätzung dann gröber ausfällt.',
          'Am Einsatztag arbeiten wir in normaler Arbeitskleidung, sprechen im Treppenhaus nicht über den Auftrag und stellen das Fahrzeug so, dass es nicht auffällt. Wenn Sie eine Anfahrt ohne Firmenbeschriftung wünschen, sagen Sie das bei der Beauftragung.',
        ],
      },
      {
        h: 'Was wir aus der Wohnung sichern',
        p: [
          'In stark zugestellten Wohnungen finden sich fast immer Dinge, die noch gebraucht werden: Ausweise, Bankunterlagen, Post, Schlüssel, Medikamente, manchmal Bargeld. Wir sammeln das getrennt und übergeben es an die Person, die den Auftrag erteilt hat.',
          'Was mitgenommen werden soll, klären wir vorher. Wenn die Bewohnerin oder der Bewohner selbst entscheiden möchte, richten wir uns danach und arbeiten in dem Tempo, das möglich ist.',
        ],
      },
      {
        h: 'Wenn Sie als Angehörige anfragen',
        p: [
          'Viele Anfragen kommen nicht von der betroffenen Person selbst, sondern von Kindern, Geschwistern oder einer rechtlichen Betreuung. Das ist normal und wir gehen entsprechend vorsichtig damit um.',
          'Wichtig ist, dass die betroffene Person einverstanden ist oder eine Betreuung mit entsprechendem Aufgabenkreis vorliegt. Eine Wohnung gegen den Willen der Bewohnerin oder des Bewohners zu räumen, ist keine Aufgabe eines Dienstleisters, sondern braucht eine rechtliche Grundlage.',
        ],
        note: {
          title: 'Bei Zwangsräumungen',
          text: 'Eine Zwangsräumung wird durch einen Gerichtsvollzieher durchgeführt. Wir können als beauftragtes Unternehmen die Räumung und Einlagerung übernehmen, wenn der Gerichtsvollzieher oder die Hausverwaltung uns beauftragt. Wenden Sie sich in diesem Fall zuerst an die zuständige Stelle.',
          tone: 'caution',
        },
      },
      {
        h: 'Warum wir keine Vorher-Fotos veröffentlichen',
        p: [
          'Auf vielen Websites in diesem Bereich finden sich drastische Bilder aus fremden Wohnungen. Wir zeigen so etwas nicht. Solche Bilder sind für Betroffene beschämend und tragen nichts zur Einschätzung eines Auftrags bei.',
          'Wenn wir Fotos für die Dokumentation machen, bleiben sie beim Auftrag und werden nicht weiterverwendet.',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Volumen und Verdichtung',
        effect: 'sehr hoch',
        why: 'Stark zugestellte Wohnungen enthalten pro Quadratmeter ein Vielfaches des normalen Volumens. Das ist der bestimmende Faktor.',
      },
      {
        name: 'Arbeitsschutz',
        effect: 'mittel',
        why: 'Schutzkleidung, Handschuhe und Atemschutz sind Verbrauchsmaterial und werden pro Einsatz kalkuliert.',
      },
      {
        name: 'Zustand des Materials',
        effect: 'mittel bis hoch',
        why: 'Verdorbene Lebensmittel, Flüssigkeiten oder stark verschmutzter Hausrat brauchen andere Behälter und eine andere Entsorgung als trockener Sperrmüll.',
      },
      {
        name: 'Etage und Zugang',
        effect: 'hoch',
        why: 'Bei großen Mengen wirkt sich jeder zusätzliche Trageweg vielfach aus.',
      },
      {
        name: 'Nacharbeiten',
        effect: 'gesondert',
        why: 'Desinfektion, Schädlingsbekämpfung oder Bodensanierung werden von Fachbetrieben ausgeführt und getrennt beauftragt.',
      },
    ],
    faq: [
      {
        q: 'Merken die Nachbarn etwas?',
        a: 'Wir arbeiten so unauffällig wie möglich. Neutrale Kleidung, keine Gespräche über den Auftrag im Haus, Fahrzeug nach Möglichkeit außer Sichtweite der Wohnungstür. Ganz ohne Bewegung im Treppenhaus geht eine Räumung nicht, aber niemand erfährt von uns, worum es geht.',
      },
      {
        q: 'Ist der Zustand der Wohnung ein Problem für Sie?',
        a: 'Nein. Wir haben solche Wohnungen regelmäßig und bewerten sie nicht. Für die Einschätzung brauchen wir eine ehrliche Beschreibung, damit wir Team, Fahrzeug und Schutzausrüstung richtig planen. Beschönigen hilft niemandem, es führt nur dazu, dass der Termin nicht reicht.',
      },
      {
        q: 'Können Sie auch bei Schädlingsbefall räumen?',
        a: 'Bei aktivem Befall muss zuerst ein Schädlingsbekämpfungsbetrieb ran, sonst wird der Befall beim Abtransport verschleppt. Wir sagen Ihnen bei der Besichtigung, wenn wir das für nötig halten, und arbeiten mit dem Fachbetrieb zusammen. Die Räumung erfolgt dann danach.',
      },
      {
        q: 'Kann ich anonym anfragen?',
        a: 'Für eine erste Einschätzung genügt eine Telefonnummer oder eine E-Mail-Adresse. Namen und Adresse brauchen wir erst, wenn ein Termin zustande kommt. Wenn Sie zunächst nur wissen möchten, wie so etwas abläuft, rufen Sie an, ohne Details zu nennen.',
      },
    ],
    related: ['wohnungsaufloesung-berlin', 'entruempelung-berlin', 'nachlassaufloesung-berlin'],
    guides: ['entruempelung-vorbereiten'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'sperrmuellabholung-berlin',
    status: 'published',
    h1: 'Sperrmüll und Möbel abholen lassen in Berlin',
    navLabel: 'Sperrmüll & Möbel',
    metaTitle: 'Sperrmüllabholung Berlin: einzelne Möbel abholen lassen',
    metaDescription:
      'Sperrmüll und einzelne Möbel in Berlin abholen lassen: Abholung aus der Wohnung, Demontage nach Bedarf, getrennte Entsorgung. Auch für einzelne Stücke.',
    answer:
      'Wir holen Sperrmüll und einzelne Möbel direkt aus der Wohnung ab, nicht nur vom Bordstein. Dazu gehören Schränke, Sofas, Matratzen, Elektrogeräte und Kleinmengen. Wenn nötig, demontieren wir vor Ort. Die Abholung ist auch für einzelne Stücke möglich. Alternativ bietet die BSR eine kostenpflichtige Sperrmüllabholung an, die günstiger, aber weniger flexibel ist.',
    teaser: 'Einzelne Möbel oder Kleinmengen direkt aus der Wohnung abholen lassen.',
    icon: 'truck',
    serviceType: 'Sperrmüllentsorgung',
    situations: [
      'Ein Sofa oder Schrank muss weg, passt aber nicht ins Auto.',
      'Nach dem Umzug sind einzelne Möbel übrig.',
      'Eine alte Waschmaschine oder ein Kühlschrank soll entsorgt werden.',
    ],
    includes: [
      'Abholung aus der Wohnung, auch aus oberen Etagen',
      'Demontage, wenn ein Stück nicht durch die Tür passt',
      'Abtransport und getrennte Entsorgung',
      'Elektrogeräte inklusive fachgerechter Abgabe',
    ],
    notIncluded: [
      'Entsorgung von Bauschutt in größeren Mengen (siehe Bau- und Renovierungsabfälle)',
      'Sondermüll wie Farben, Lacke, Chemikalien und Altöl',
      'Asbesthaltige Materialien',
    ],
    blocks: [
      {
        h: 'Wann lohnt sich eine private Abholung gegenüber der BSR?',
        p: [
          'Die Berliner Stadtreinigung bietet eine kostenpflichtige Sperrmüllabholung an. Sie ist in der Regel günstiger als eine private Abholung, hat aber Einschränkungen: Der Sperrmüll muss meist an einer zugänglichen Stelle bereitgestellt werden, es gibt Wartezeiten auf einen Termin und der Umfang ist begrenzt.',
          'Eine private Abholung lohnt sich, wenn Sie das Stück nicht selbst nach unten tragen können, wenn es kurzfristig weg muss oder wenn mehrere unterschiedliche Sachen zusammenkommen. Prüfen Sie beide Wege, dann entscheiden Sie mit Blick auf Ihre Situation.',
        ],
      },
      {
        h: 'Was wir mitnehmen',
        table: {
          head: ['Kategorie', 'Beispiele', 'Hinweis'],
          rows: [
            ['Möbel', 'Schränke, Sofas, Betten, Tische, Regale', 'Demontage vor Ort möglich'],
            ['Matratzen', 'Einzel- und Doppelmatratzen, Lattenroste', 'Werden getrennt entsorgt'],
            ['Elektrogroßgeräte', 'Kühlschrank, Waschmaschine, Herd, Trockner', 'Abgabe nach Elektrogesetz'],
            ['Elektrokleingeräte', 'Fernseher, Monitore, Mikrowellen', 'Getrennte Sammlung'],
            ['Hausrat', 'Kartons, Textilien, Geschirr, Teppiche', 'Nach Menge'],
            ['Gartenmöbel', 'Stühle, Tische, Sonnenschirme, Kunststoffmöbel', 'Sortenrein getrennt'],
          ],
        },
      },
      {
        h: 'Was wir nicht mitnehmen dürfen',
        list: [
          'Farben, Lacke, Lösungsmittel und Altöl (Schadstoffsammelstelle der BSR)',
          'Autobatterien und Reifen (Handel oder Recyclinghof)',
          'Asbesthaltige Platten und Dämmstoffe (nur zugelassene Fachbetriebe)',
          'Medikamente und medizinischer Abfall',
          'Größere Mengen Bauschutt ohne vorherige Absprache',
        ],
        note: {
          title: 'Im Zweifel fragen',
          text: 'Wenn Sie unsicher sind, ob etwas mitgenommen werden darf, schicken Sie ein Foto. Das ist schneller als eine Diskussion am Einsatztag und verhindert, dass etwas stehen bleibt.',
          tone: 'info',
        },
      },
    ],
    priceFactors: [
      {
        name: 'Anzahl und Größe der Stücke',
        effect: 'hoch',
        why: 'Ein einzelnes Sofa und eine komplette Schlafzimmereinrichtung unterscheiden sich in Ladevolumen und Zeit deutlich.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'hoch',
        why: 'Ein Kleiderschrank aus dem vierten Stock ohne Aufzug ist ein Zwei-Personen-Auftrag, aus dem Erdgeschoss oft nicht.',
      },
      {
        name: 'Demontage',
        effect: 'mittel',
        why: 'Wenn ein Stück zerlegt werden muss, um durch Tür oder Treppenhaus zu passen, kommt Arbeitszeit dazu.',
      },
      {
        name: 'Materialart',
        effect: 'mittel',
        why: 'Elektrogeräte, Matratzen und Holz werden unterschiedlich entsorgt und unterschiedlich berechnet.',
      },
      {
        name: 'Terminwunsch',
        effect: 'gering bis mittel',
        why: 'Ein flexibler Termin lässt sich mit anderen Fahrten kombinieren und ist deshalb günstiger als ein fester Wunschtermin.',
      },
    ],
    faq: [
      {
        q: 'Holen Sie auch ein einzelnes Möbelstück ab?',
        a: 'Ja. Für einzelne Stücke gibt es eine Mindestpauschale, weil Anfahrt und Personal auch für ein Sofa anfallen. Wenn Sie flexibel beim Termin sind, können wir die Abholung mit einer Fahrt in Ihrer Gegend verbinden, das ist günstiger als ein fester Wunschtermin.',
      },
      {
        q: 'Nehmen Sie den Kühlschrank mit?',
        a: 'Ja. Kühl- und Gefriergeräte enthalten Kältemittel und müssen nach dem Elektrogesetz gesondert entsorgt werden. Wir transportieren sie stehend und geben sie an einer zugelassenen Sammelstelle ab. Bitte tauen Sie das Gerät vorher ab, sonst läuft beim Transport Wasser aus.',
      },
      {
        q: 'Muss ich die Sachen nach unten tragen?',
        a: 'Nein, das ist der Unterschied zur klassischen Sperrmüllabholung. Wir holen aus der Wohnung ab, auch aus oberen Etagen. Sagen Sie bei der Anfrage die Etage und ob ein Aufzug vorhanden ist, das bestimmt den Aufwand.',
      },
      {
        q: 'Wie schnell kann abgeholt werden?',
        a: 'Kleine Abholungen lassen sich oft innerhalb weniger Tage einplanen, weil sie sich mit anderen Fahrten kombinieren lassen. Rufen Sie an und nennen Sie Ihren Zeitrahmen, dann sagen wir Ihnen, was möglich ist.',
      },
    ],
    related: ['entruempelung-berlin', 'kellerentruempelung-berlin', 'kleintransport-moebeltransport-berlin'],
    guides: ['sperrmuell-moebel-entsorgen-berlin', 'kosten-sperrmuellabholung-berlin'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'umzug-berlin',
    status: 'published',
    h1: 'Umzug in Berlin',
    navLabel: 'Umzug',
    metaTitle: 'Umzug Berlin: Planung, Ablauf und was den Preis bestimmt',
    metaDescription:
      'Umzug in Berlin und ins Umland: Besichtigung oder Fotoeinschätzung, Halteverbotszone, Tragen und Transport, Möbelmontage. Klare Absprache vor dem Termin.',
    answer:
      'Wir führen Umzüge in Berlin und ins Umland durch: Möbel demontieren, tragen, transportieren und am Zielort wieder aufbauen. Vorher schätzen wir den Umfang bei einer Besichtigung oder anhand von Fotos ein. Auf Wunsch kümmern wir uns um die Halteverbotszone. Wir übernehmen auch Umzüge, bei denen ein Kostenträger beteiligt ist.',
    teaser: 'Von der Halteverbotszone bis zum Aufbau am Zielort. Vorher klar abgestimmt.',
    icon: 'truck',
    serviceType: 'Umzug',
    situations: [
      'Ein Umzug innerhalb Berlins steht an.',
      'Es geht von Berlin ins Umland oder umgekehrt.',
      'Der Umzug muss mit einem Kostenträger abgestimmt werden.',
    ],
    includes: [
      'Einschätzung per Besichtigung oder Fotos',
      'Beantragung der Halteverbotszone nach Absprache',
      'Demontage von Möbeln am Ausgangsort',
      'Tragen, Verladen, Transport',
      'Aufbau am Zielort',
      'Transport von Küchengeräten und Elektrogroßgeräten',
    ],
    notIncluded: [
      'Ein- und Auspacken von Kartons, sofern nicht gesondert vereinbart',
      'Anschluss von Küchen, Wasch- und Spülmaschinen an Wasser und Strom',
      'Einlagerung, sofern nicht gesondert vereinbart',
    ],
    blocks: [
      {
        h: 'Was Sie vor dem Umzugstag klären sollten',
        steps: [
          {
            title: 'Termin und Übergaben abstimmen',
            text: 'Wann bekommen Sie die neuen Schlüssel, wann müssen Sie die alte Wohnung übergeben? Zwischen beiden Terminen sollte Luft sein.',
          },
          {
            title: 'Halteverbotszone prüfen',
            text: 'In dicht bebauten Berliner Lagen ist sie fast immer sinnvoll. Sie muss mit Vorlauf beantragt und rechtzeitig aufgestellt werden.',
          },
          {
            title: 'Zugang klären',
            text: 'Aufzugsgröße, Treppenhausbreite, Hinterhofdurchfahrt und Poller entscheiden über die Tragewege.',
          },
          {
            title: 'Kartons packen',
            text: 'Gut gepackte, beschriftete Kartons sparen am Umzugstag messbar Zeit. Schwer nach unten, leicht nach oben, Bücher in kleine Kartons.',
          },
          {
            title: 'Besonderes benennen',
            text: 'Klavier, Tresor, Aquarium, sehr große Schränke oder empfindliche Stücke müssen vorher bekannt sein.',
          },
        ],
      },
      {
        h: 'Warum die Halteverbotszone in Berlin so oft nötig ist',
        p: [
          'In vielen Berliner Straßen ist tagsüber kein Parkplatz vor dem Haus frei. Ohne Halteverbotszone steht das Fahrzeug dann irgendwo in der Straße, und jeder Karton wird 50 bis 100 Meter weiter getragen. Bei einem Umzug mit mehreren hundert Trageweg-Metern summiert sich das zu Stunden.',
          'Die Zone muss beim zuständigen Straßen- und Grünflächenamt oder über einen Dienstleister beantragt werden. Beantragen Sie sie mit Vorlauf, kurzfristige Genehmigungen sind teurer und nicht überall möglich. Die Schilder müssen rechtzeitig vor dem Termin stehen, sonst gilt das Verbot nicht für bereits parkende Fahrzeuge.',
        ],
      },
      {
        h: 'Umzug mit Beteiligung eines Kostenträgers',
        p: [
          'Wenn ein Jobcenter, das Sozialamt oder eine Pflegekasse an den Umzugskosten beteiligt ist, brauchen Sie in der Regel Kostenvoranschläge, bevor Sie beauftragen. Wichtig ist die Reihenfolge: erst die Zusage, dann der Auftrag. Wer zuerst beauftragt, bleibt oft auf den Kosten sitzen.',
          'Wir erstellen einen Kostenvoranschlag in der Form, die die Stelle benötigt, und unterstützen Sie beim Ausfüllen der Unterlagen. Ob die Kosten übernommen werden, entscheidet ausschließlich die jeweilige Stelle.',
        ],
        note: {
          title: 'Wichtig',
          text: 'Wir können keine Kostenübernahme zusagen und tun das auch nicht. Was wir leisten können: einen sauberen, prüffähigen Kostenvoranschlag und Hilfe beim Zusammenstellen der Unterlagen.',
          tone: 'caution',
        },
      },
    ],
    priceFactors: [
      {
        name: 'Umzugsvolumen',
        effect: 'hoch',
        why: 'Bestimmt Fahrzeuggröße und Teamstärke. Ein Zwei-Zimmer-Haushalt und ein Vier-Zimmer-Haushalt sind zwei völlig verschiedene Einsätze.',
      },
      {
        name: 'Etagen an beiden Adressen',
        effect: 'hoch',
        why: 'Es zählen beide Seiten. Vierter Stock ohne Aufzug am Ausgangsort und Erdgeschoss am Zielort ist etwas anderes als umgekehrt zweimal Aufzug.',
      },
      {
        name: 'Tragewege und Parksituation',
        effect: 'hoch',
        why: 'Der häufigste versteckte Kostenfaktor in Berlin. Eine Halteverbotszone kostet Geld, spart aber meist mehr.',
      },
      {
        name: 'Entfernung',
        effect: 'mittel',
        why: 'Innerhalb Berlins fällt die Fahrzeit kaum ins Gewicht. Ins Umland kommen Fahrzeit und Kilometer dazu.',
      },
      {
        name: 'Montageaufwand',
        effect: 'mittel',
        why: 'Schrankwände, Hochbetten und Einbauschränke brauchen Zeit für Ab- und Aufbau. Verpackte Möbel gehen schneller.',
      },
      {
        name: 'Besondere Stücke',
        effect: 'gesondert',
        why: 'Klavier, Tresor oder sehr schwere Einzelstücke brauchen Spezialgerät und mehr Personal. Deshalb müssen sie vorher benannt werden.',
      },
    ],
    faq: [
      {
        q: 'Wie früh sollte ich einen Umzug anfragen?',
        a: 'Für einen Wunschtermin am Monatsende oder zum Monatsersten sollten Sie drei bis sechs Wochen Vorlauf einplanen, das sind die vollsten Tage. Unter der Woche und Mitte des Monats ist deutlich mehr möglich. Wenn es kurzfristig sein muss, rufen Sie an, statt zu schreiben.',
      },
      {
        q: 'Brauche ich eine Halteverbotszone?',
        a: 'In den meisten innerstädtischen Berliner Lagen ja. Wenn Sie einen eigenen Hof, eine Einfahrt oder eine ruhige Straße mit sicheren Parkmöglichkeiten haben, geht es ohne. Wir schauen uns die Straße bei der Einschätzung an und sagen Ihnen, was wir empfehlen.',
      },
      {
        q: 'Transportieren Sie auch Waschmaschine und Kühlschrank?',
        a: 'Ja. Bitte tauen Sie den Kühlschrank vorher ab und sichern Sie die Trommel der Waschmaschine mit den Transportsicherungen, falls Sie sie noch haben. Ohne Transportsicherung kann die Trommelaufhängung Schaden nehmen. Den Anschluss am Zielort übernehmen wir nicht.',
      },
      {
        q: 'Was ist bei Schäden während des Umzugs?',
        a: 'Sprechen Sie uns direkt am Umzugstag an, dann halten wir es gemeinsam fest. Welcher Versicherungsschutz besteht, sagen wir Ihnen vor der Beauftragung konkret. Fragen Sie danach, das ist ein berechtigter Punkt bei jedem Umzugsangebot.',
      },
    ],
    related: ['seniorenumzug-berlin', 'kleintransport-moebeltransport-berlin', 'entruempelung-berlin'],
    guides: ['umzugskosten-jobcenter-berlin', 'halteverbotszone-berlin-umzug', 'checkliste-wohnungsuebergabe'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'seniorenumzug-berlin',
    status: 'published',
    h1: 'Seniorenumzug in Berlin',
    navLabel: 'Seniorenumzug',
    metaTitle: 'Seniorenumzug Berlin: in kleinere Wohnung oder ins Heim',
    metaDescription:
      'Seniorenumzug in Berlin: Umzug in eine kleinere Wohnung, betreutes Wohnen oder ein Pflegeheim. Mehr Zeit, mehr Absprache, Auflösung der alten Wohnung möglich.',
    answer:
      'Ein Seniorenumzug ist meist ein Umzug in eine kleinere Wohnung, ins betreute Wohnen oder in ein Pflegeheim. Dabei geht es nicht nur um den Transport: Es muss entschieden werden, was mitkommt und was bleibt. Wir planen mehr Zeit ein, richten das neue Zuhause auf Wunsch ein und lösen die alte Wohnung im selben Zug auf.',
    teaser: 'Umzug in kleinere Wohnung, betreutes Wohnen oder Pflegeheim. Mit mehr Zeit und Absprache.',
    icon: 'people',
    serviceType: 'Seniorenumzug',
    situations: [
      'Die Wohnung ist zu groß geworden und ein kleinerer Umzug steht an.',
      'Ein Einzug ins betreute Wohnen oder ins Pflegeheim ist geplant.',
      'Angehörige organisieren den Umzug aus einer anderen Stadt.',
    ],
    includes: [
      'Besichtigung mit ausreichend Zeit für Fragen',
      'Gemeinsames Durchgehen, was mitkommt',
      'Demontage, Transport und Aufbau',
      'Einrichten des neuen Zimmers oder der neuen Wohnung nach Wunsch',
      'Anschließende Auflösung der alten Wohnung, wenn gewünscht',
      'Abstimmung mit Angehörigen, Heim oder Betreuung',
    ],
    blocks: [
      {
        h: 'Warum ein Seniorenumzug anders geplant wird',
        p: [
          'Beim Umzug in eine kleinere Wohnung oder ins Heim passt nicht alles mit. Das ist der schwierige Teil, und er braucht Zeit. Wir planen deshalb den Besichtigungstermin länger und drängen nicht auf schnelle Entscheidungen.',
          'Am Umzugstag selbst ist es hilfreich, wenn eine vertraute Person dabei ist. Wenn Angehörige nicht in Berlin wohnen, halten wir sie per Telefon auf dem Laufenden.',
        ],
      },
      {
        h: 'Umzug ins Pflegeheim oder betreute Wohnen',
        p: [
          'Beim Einzug in ein Heim gibt es oft feste Vorgaben: Welche Möbel dürfen mit, wie groß darf der Schrank sein, wann ist Einzug möglich. Klären Sie das mit der Einrichtung, bevor Sie den Umzug planen.',
          'Praktisch bewährt hat sich, das neue Zimmer möglichst am selben Tag fertig einzurichten. Bett aufgebaut, Schrank eingeräumt, vertraute Bilder aufgehängt. Ein Zimmer voller Kartons ist am ersten Abend eine zusätzliche Belastung.',
        ],
      },
      {
        h: 'Wenn die alte Wohnung aufgelöst werden muss',
        p: [
          'In den meisten Fällen folgt auf den Seniorenumzug die Auflösung der bisherigen Wohnung. Beides in einem Auftrag zu planen, ist einfacher und meist günstiger, weil wir Fahrten und Team zusammenlegen können.',
          'Der Ablauf: erst der Umzug mit allem, was mitkommt, dann in Ruhe die Sichtung der verbliebenen Sachen, dann die Räumung. Zwischen beiden Schritten sollte etwas Zeit liegen, damit noch etwas nachgeholt werden kann.',
        ],
      },
      {
        h: 'Beteiligung von Pflegekasse oder Sozialamt',
        p: [
          'Bei einem Umzug, der pflegebedingt notwendig ist, kommt je nach Fall eine Beteiligung der Pflegekasse oder des Sozialamts in Betracht. Voraussetzung ist fast immer, dass der Antrag vor der Beauftragung gestellt und bewilligt wurde.',
          'Wir erstellen den Kostenvoranschlag in prüffähiger Form und unterstützen beim Zusammenstellen der Unterlagen. Über die Bewilligung entscheidet die jeweilige Stelle.',
        ],
        note: {
          title: 'Reihenfolge beachten',
          text: 'Erst Antrag stellen und Bewilligung abwarten, dann beauftragen. Wer zuerst beauftragt und danach den Antrag stellt, bekommt die Kosten oft nicht erstattet.',
          tone: 'caution',
        },
      },
    ],
    priceFactors: [
      {
        name: 'Umfang des Umzugsguts',
        effect: 'hoch',
        why: 'Ein Umzug ins Pflegeheim umfasst oft nur ein Zimmer und ist deutlich kleiner als ein normaler Wohnungsumzug.',
      },
      {
        name: 'Zeitbedarf für Absprachen',
        effect: 'mittel',
        why: 'Wenn vor Ort entschieden wird, was mitkommt, dauert der Einsatz länger als ein reiner Transport.',
      },
      {
        name: 'Einrichtung am Zielort',
        effect: 'mittel',
        why: 'Aufbauen, einräumen und Bilder aufhängen ist zusätzliche Arbeitszeit, macht aber den Unterschied für den ersten Abend.',
      },
      {
        name: 'Anschlussauflösung',
        effect: 'gesondert kalkuliert',
        why: 'Die Räumung der alten Wohnung wird als eigene Position gerechnet, profitiert aber von der gemeinsamen Planung.',
      },
      {
        name: 'Etage und Aufzug',
        effect: 'hoch',
        why: 'Wie bei jedem Umzug an beiden Adressen entscheidend.',
      },
    ],
    faq: [
      {
        q: 'Können Sie das neue Zimmer im Heim komplett einrichten?',
        a: 'Ja, das ist bei Heimumzügen der Normalfall. Wir bauen das Bett auf, stellen den Schrank, räumen die Kleidung ein und hängen Bilder auf. Sagen Sie uns vorher, wie es aussehen soll, oder machen Sie ein Foto vom alten Zimmer. Vertraute Anordnung hilft besonders bei Menschen mit Demenz.',
      },
      {
        q: 'Übernehmen Sie auch die Auflösung der alten Wohnung?',
        a: 'Ja, meist im selben Auftrag. Wir empfehlen, etwas Zeit zwischen Umzug und Räumung zu lassen. Erfahrungsgemäß fällt in den ersten Tagen im neuen Zuhause auf, dass noch etwas fehlt, das dann leicht nachgeholt werden kann.',
      },
      {
        q: 'Zahlt die Pflegekasse den Umzug?',
        a: 'Eine Beteiligung ist je nach Situation möglich, etwa im Rahmen von Zuschüssen für wohnumfeldverbessernde Maßnahmen oder über das Sozialamt. Entscheidend sind Ihr Einzelfall und die vorherige Antragstellung. Wir liefern den Kostenvoranschlag, die Entscheidung trifft die Kasse oder die Behörde.',
      },
      {
        q: 'Können Angehörige aus einer anderen Stadt alles organisieren?',
        a: 'Ja, das machen wir häufig. Die Besichtigung kann mit der betroffenen Person oder einer Nachbarin stattfinden, Absprachen laufen telefonisch und per E-Mail. Wir schicken Fotos, damit Sie mitentscheiden können, und melden uns nach dem Einsatz mit einem kurzen Bericht.',
      },
    ],
    related: ['umzug-berlin', 'haushaltsaufloesung-berlin', 'wohnungsaufloesung-berlin'],
    guides: ['umzugskosten-jobcenter-berlin', 'kosten-seniorenumzug-berlin', 'checkliste-wohnungsuebergabe'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'kellerentruempelung-berlin',
    status: 'published',
    h1: 'Keller entrümpeln lassen in Berlin',
    navLabel: 'Kellerentrümpelung',
    metaTitle: 'Kellerentrümpelung Berlin: Kellerraum leerräumen lassen',
    metaDescription:
      'Keller entrümpeln in Berlin: Kellerabteile und Kellerräume leerräumen, Inhalt getrennt entsorgen. Auch für Hausverwaltungen mit mehreren Abteilen.',
    answer:
      'Wir räumen Kellerabteile und ganze Kellergeschosse in Berlin leer und entsorgen den Inhalt getrennt. Häufige Anlässe sind eine Wohnungsübergabe, eine Brandschutzauflage oder ein Eigentümerwechsel. Für Hausverwaltungen räumen wir auch mehrere Abteile in einem Termin. Der Aufwand hängt vor allem von der Kellertreppe und der Länge des Trageweges ab.',
    teaser: 'Kellerabteile und ganze Kellergeschosse leerräumen, auch für Hausverwaltungen.',
    icon: 'stairs',
    serviceType: 'Kellerentrümpelung',
    situations: [
      'Der Keller muss bei der Wohnungsübergabe leer sein.',
      'Die Hausverwaltung verlangt freie Fluchtwege im Keller.',
      'Nach einem Eigentümerwechsel stehen verwaiste Abteile leer.',
    ],
    includes: [
      'Räumung einzelner Abteile oder ganzer Kellergeschosse',
      'Zerlegen von Regalen und Einbauten',
      'Abtransport und getrennte Entsorgung',
      'Kehren des geräumten Bereichs',
      'Fotodokumentation für Hausverwaltungen nach Absprache',
    ],
    blocks: [
      {
        h: 'Warum Keller im Verhältnis aufwendiger sind',
        p: [
          'Ein Keller enthält weniger Volumen als eine Wohnung, macht aber pro Kubikmeter mehr Arbeit. Die Gründe: enge Gänge, schmale Treppen, oft schlechtes Licht und Gegenstände, die seit Jahren nicht bewegt wurden.',
          'Dazu kommt, dass in Kellern überdurchschnittlich viel Material anfällt, das getrennt entsorgt werden muss: alte Farben, Autoteile, Elektroschrott, Holz, Metall. Das Sortieren macht bei Kellerräumungen einen größeren Anteil aus als bei Wohnungen.',
        ],
      },
      {
        h: 'Kellerentrümpelung für Hausverwaltungen',
        p: [
          'Wenn in einem Haus mehrere Abteile geräumt werden sollen, planen wir das als einen Einsatz. Das ist deutlich günstiger als einzelne Termine, weil Anfahrt und Rüstzeit nur einmal anfallen.',
          'Was wir dafür brauchen: eine Liste der zu räumenden Abteile, Zugang zum Kellergeschoss und eine Klärung, welche Abteile ausdrücklich nicht angefasst werden dürfen. Auf Wunsch dokumentieren wir jedes Abteil vor und nach der Räumung mit Fotos.',
        ],
        note: {
          title: 'Vor der Räumung verwaister Abteile',
          text: 'Bei Abteilen, deren Nutzer unbekannt sind, muss die rechtliche Lage vorher geklärt sein. Als Dienstleister räumen wir auf Grundlage einer schriftlichen Beauftragung der verfügungsberechtigten Stelle.',
          tone: 'caution',
        },
      },
      {
        h: 'Was oft im Keller gefunden wird und getrennt werden muss',
        list: [
          'Farben, Lacke und Lösungsmittel: gehören zur Schadstoffsammlung, nicht in den Restmüll',
          'Alte Elektrogeräte und Kabel: getrennte Sammlung nach Elektrogesetz',
          'Metall und Schrott: wird sortenrein abgegeben und kann angerechnet werden',
          'Holzregale und Möbel: sortenreine Holzentsorgung',
          'Reifen, Autobatterien: nicht über den Hausmüll entsorgbar',
          'Bauschutt und Fliesenreste: eigener Container, schweres Material',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Trageweg und Treppe',
        effect: 'hoch',
        why: 'Ein Keller mit direkter Außentreppe zum Hof ist ein völlig anderer Aufwand als einer, aus dem alles durch einen langen Gang und ein Treppenhaus getragen wird.',
      },
      {
        name: 'Anzahl der Abteile',
        effect: 'hoch',
        why: 'Bei mehreren Abteilen im selben Termin sinkt der Preis pro Abteil deutlich.',
      },
      {
        name: 'Sortieraufwand',
        effect: 'mittel bis hoch',
        why: 'Keller enthalten viele Materialarten auf engem Raum. Getrennt wird direkt vor Ort.',
      },
      {
        name: 'Schadstoffhaltiges Material',
        effect: 'gesondert',
        why: 'Farben, Lacke und Chemikalien müssen an einer Schadstoffsammelstelle abgegeben werden und werden separat berechnet.',
      },
    ],
    faq: [
      {
        q: 'Können Sie mehrere Kellerabteile an einem Tag räumen?',
        a: 'Ja, und das ist der günstigste Weg. Anfahrt, Fahrzeug und Rüstzeit fallen nur einmal an. Für Hausverwaltungen räumen wir regelmäßig mehrere Abteile in einem Termin. Wir brauchen dafür vorab eine Liste der Abteile und Zugang zum Kellergeschoss.',
      },
      {
        q: 'Was passiert mit Farben und Chemikalien aus dem Keller?',
        a: 'Die werden getrennt gesammelt und an einer Schadstoffsammelstelle abgegeben. Sie dürfen nicht über den normalen Sperrmüll entsorgt werden. Wenn größere Mengen anfallen, sagen wir Ihnen vorher, dass dafür eine eigene Position anfällt.',
      },
      {
        q: 'Wird der Keller danach gekehrt?',
        a: 'Ja, das gehört bei uns dazu. Der geräumte Bereich wird gefegt und grober Schmutz entfernt. Eine Reinigung mit Reinigungsmitteln oder das Entfernen von Schimmelbefall ist nicht enthalten, dafür braucht es einen Fachbetrieb.',
      },
    ],
    related: ['entruempelung-berlin', 'sperrmuellabholung-berlin', 'dachbodenentruempelung-berlin'],
    guides: ['sperrmuell-moebel-entsorgen-berlin', 'was-kostet-eine-entruempelung-in-berlin', 'entruempelung-vorbereiten'],
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'bueroaufloesung-berlin',
    status: 'published',
    h1: 'Büroauflösung in Berlin',
    navLabel: 'Büroauflösung',
    metaTitle: 'Büroauflösung Berlin: Gewerbefläche geräumt übergeben',
    metaDescription:
      'Büroauflösung in Berlin: Mobiliar, IT und Einbauten räumen, Akten gesondert behandeln und die Fläche nach klar vereinbartem Umfang übergeben.',
    answer:
      'Bei einer Büroauflösung räumen wir Gewerbeflächen: Möbel, Technik, einfache Einbauten und Lager. Ein Termin außerhalb der Geschäftszeiten kann individuell geprüft werden, damit der laufende Betrieb im Gebäude nicht gestört wird. Akten und Datenträger behandeln wir gesondert. Umfang und gewünschter Übergabezustand werden vorher festgehalten.',
    teaser: 'Gewerbeflächen räumen, Akten gesondert behandeln, termingerecht übergeben.',
    icon: 'building',
    serviceType: 'Büroauflösung',
    situations: [
      'Ein Büro wird aufgegeben oder verkleinert.',
      'Nach einem Standortwechsel muss die alte Fläche übergeben werden.',
      'Eine Praxis oder ein Ladenlokal wird geschlossen.',
    ],
    includes: [
      'Räumung von Büromöbeln, Regalen und Trennwänden',
      'Abbau einfacher Einbauten',
      'Abtransport von IT-Hardware zur fachgerechten Entsorgung',
      'Gesonderte Behandlung von Akten und Datenträgern nach Absprache',
      'Einsatz außerhalb der Geschäftszeiten nach Vereinbarung',
      'Besenreine Übergabe und Fotodokumentation',
    ],
    notIncluded: [
      'Zertifizierte Aktenvernichtung in Eigenleistung',
      'Rückbau von Elektro- und Sanitärinstallationen',
      'Entfernung fest verklebter Bodenbeläge ohne gesonderte Beauftragung',
    ],
    blocks: [
      {
        h: 'Was bei Gewerbeflächen anders ist',
        p: [
          'Bei Büroauflösungen zählt vor allem der Termin. Übergabefristen im Gewerbemietvertrag sind meist hart, und der Rückbau in den vertraglich vereinbarten Zustand kann umfangreicher sein als bei Wohnraum.',
          'Der zweite Unterschied liegt beim Zugang. In Bürogebäuden gibt es Lastenaufzüge mit begrenzten Zeiten, Anmeldungen beim Facility Management und Auflagen für Anlieferzonen. Klären Sie das früh, es bestimmt die Planung stärker als die Menge.',
        ],
      },
      {
        h: 'Akten und Datenträger',
        p: [
          'Personalakten, Verträge, Buchhaltung und Datenträger dürfen nicht im Sperrmüll landen. Wir sammeln sie getrennt, transportieren sie verschlossen und übergeben sie an die von Ihnen benannte Stelle.',
          'Für eine Vernichtung nach DIN 66399 ist ein dafür geeigneter Fachbetrieb erforderlich. Ob wir die Übergabe an einen solchen Betrieb im konkreten Auftrag koordinieren können, klären wir vor der Beauftragung. Ein eigenes Vernichtungszertifikat stellen wir nicht aus.',
        ],
        note: {
          title: 'Aufbewahrungsfristen prüfen',
          text: 'Handels- und steuerrechtliche Unterlagen unterliegen Aufbewahrungsfristen. Prüfen Sie vor der Vernichtung, welche Unterlagen noch aufbewahrt werden müssen.',
          tone: 'caution',
        },
      },
      {
        h: 'Was mit brauchbarem Mobiliar passiert',
        p: [
          'Büromöbel in gutem Zustand lassen sich weitergeben. Bei größeren Mengen einheitlicher Möbel ist eine Verwertung realistisch und wird auf den Auftrag angerechnet. Bei gemischten Einzelstücken ist das seltener der Fall.',
          'Was wir vorher wissen müssen: Menge, Hersteller und Zustand. Ein Foto pro Möbeltyp genügt für eine erste Einschätzung.',
        ],
      },
    ],
    priceFactors: [
      {
        name: 'Fläche und Ausstattungsdichte',
        effect: 'hoch',
        why: 'Ein Großraumbüro mit 40 Arbeitsplätzen enthält bei gleicher Fläche deutlich mehr als ein Lager.',
      },
      {
        name: 'Zugang und Aufzugszeiten',
        effect: 'hoch',
        why: 'Wenn der Lastenaufzug nur zu bestimmten Zeiten nutzbar ist, verlängert das den Einsatz erheblich.',
      },
      {
        name: 'Einsatzzeitpunkt',
        effect: 'mittel',
        why: 'Arbeiten außerhalb der Geschäftszeiten oder am Wochenende bedeutet Zuschläge, ist aber im Betrieb oft nötig.',
      },
      {
        name: 'Rückbauumfang',
        effect: 'mittel bis hoch',
        why: 'Trennwände, Serverraumausstattung, Bodenbeläge und Beschriftungen sind Handarbeit und werden nach Aufwand gerechnet.',
      },
      {
        name: 'Aktenmenge',
        effect: 'gesondert',
        why: 'Sichere Behandlung und Vernichtung über einen Fachbetrieb wird nach Volumen abgerechnet.',
      },
      {
        name: 'Verwertbares Mobiliar',
        effect: 'senkt den Preis',
        why: 'Einheitliche, gut erhaltene Büromöbel in größerer Stückzahl lassen sich weitergeben.',
      },
    ],
    faq: [
      {
        q: 'Können Sie am Wochenende oder abends räumen?',
        a: 'Ein Termin außerhalb üblicher Geschäftszeiten kann individuell geprüft werden. Maßgeblich sind Auslastung, Hausordnung, Lärmschutz, Zugang und die Zeiten des Lastenaufzugs. Wenn ein Sondertermin möglich ist und Mehrkosten entstehen, gehört das vor Beginn ausdrücklich in das Angebot.',
      },
      {
        q: 'Übernehmen Sie die Aktenvernichtung?',
        a: 'Wir können Akten im Räumungsumfang gesondert behandeln. Für eine Vernichtung nach DIN 66399 ist ein geeigneter Fachbetrieb erforderlich. Ob die Übergabe und ein Vernichtungsnachweis im konkreten Auftrag organisiert werden können, muss vorab schriftlich vereinbart werden. Ein eigenes Zertifikat stellen wir nicht aus.',
      },
      {
        q: 'Was passiert mit alter IT-Hardware?',
        a: 'Rechner, Monitore, Drucker und Netzwerktechnik gehen in die getrennte Elektroaltgeräte-Entsorgung. Wenn Datenträger verbaut sind, weisen Sie uns darauf hin. Festplatten sollten vor der Entsorgung ausgebaut oder über einen Fachbetrieb gelöscht werden.',
      },
      {
        q: 'Bekomme ich eine Rechnung mit ausgewiesener Umsatzsteuer?',
        a: 'Sie erhalten eine Rechnung mit den vereinbarten Positionen. Ob Umsatzsteuer ausgewiesen wird oder ein gesetzlicher Hinweis zur steuerlichen Behandlung auf der Rechnung steht, richtet sich nach dem tatsächlichen steuerlichen Status des Unternehmens. Diese Angabe wird nicht versprochen, bevor der Status bestätigt ist.',
      },
    ],
    related: ['entruempelung-berlin', 'demontage-rueckbau', 'kleintransport-moebeltransport-berlin'],
    guides: ['was-kostet-eine-entruempelung-in-berlin'],
    updated: '2026-07-30',
  },

  /* ================================================================== */
  /* ENTWÜRFE – noindex, nicht in Sitemap, nicht intern verlinkt        */
  /* ================================================================== */
  {
    slug: 'dachbodenentruempelung-berlin',
    status: 'draft',
    h1: 'Dachboden entrümpeln lassen in Berlin',
    navLabel: 'Dachbodenentrümpelung',
    metaTitle: 'Dachbodenentrümpelung Berlin',
    metaDescription: 'Dachboden entrümpeln in Berlin: Räumung über enge Treppen, getrennte Entsorgung.',
    answer:
      'Wir räumen Dachböden und Speicher in Berlin. Der Aufwand hängt vor allem von der Zugangssituation ab: enge Bodentreppen, niedrige Durchgänge und fehlendes Licht bestimmen die Arbeitszeit stärker als die Menge.',
    teaser: 'Dachböden und Speicher räumen, auch bei engen Zugängen.',
    icon: 'stairs',
    serviceType: 'Dachbodenentrümpelung',
    situations: ['Der Dachboden soll ausgebaut werden.', 'Die Hausverwaltung verlangt freie Flächen.'],
    includes: ['Räumung des Dachbodens', 'Abtransport und getrennte Entsorgung', 'Kehren der geräumten Fläche'],
    blocks: [
      {
        h: 'Diese Seite ist ein Entwurf',
        p: [
          'Die Seite wird veröffentlicht, sobald individuelle Inhalte ergänzt sind: typische Berliner Dachbodensituationen, mindestens ein echter Einsatz, eigene FAQ.',
        ],
      },
    ],
    priceFactors: [
      { name: 'Zugang', effect: 'hoch', why: 'Bodentreppe, Luke oder feste Treppe bestimmen den Aufwand.' },
    ],
    faq: [],
    related: ['kellerentruempelung-berlin', 'entruempelung-berlin'],
    updated: '2026-07-29',
  },
  {
    slug: 'demontage-rueckbau',
    status: 'draft',
    h1: 'Demontage und Rückbau',
    navLabel: 'Demontage & Rückbau',
    metaTitle: 'Demontage und Rückbau Berlin',
    metaDescription: 'Demontage von Einbauten und Rückbau in Berlin.',
    answer:
      'Wir demontieren Einbauküchen, Einbauschränke, Trennwände und einfache Einbauten und entsorgen das Material getrennt. Statische Eingriffe und Arbeiten an Elektro- und Sanitärinstallationen gehören nicht dazu.',
    teaser: 'Einbauküchen, Einbauschränke und einfache Einbauten demontieren.',
    icon: 'tools',
    serviceType: 'Demontage',
    situations: ['Eine Einbauküche muss raus.', 'Trennwände sollen zurückgebaut werden.'],
    includes: ['Demontage einfacher Einbauten', 'Abtransport und getrennte Entsorgung'],
    blocks: [
      {
        h: 'Diese Seite ist ein Entwurf',
        p: ['Vor der Veröffentlichung müssen der genaue Leistungsumfang und die Abgrenzung zum Handwerk geklärt werden.'],
      },
    ],
    priceFactors: [{ name: 'Art des Einbaus', effect: 'hoch', why: 'Küche, Trennwand oder Bodenbelag sind sehr unterschiedlich.' }],
    faq: [],
    related: ['bueroaufloesung-berlin', 'entruempelung-berlin'],
    updated: '2026-07-29',
  },
  {
    slug: 'kleintransport-moebeltransport-berlin',
    status: 'draft',
    h1: 'Kleintransport und Möbeltransport in Berlin',
    navLabel: 'Kleintransport',
    metaTitle: 'Kleintransport und Möbeltransport Berlin',
    metaDescription: 'Einzelne Möbel und kleine Mengen in Berlin transportieren lassen.',
    answer:
      'Wir transportieren einzelne Möbel, Küchengeräte und kleinere Mengen innerhalb Berlins und ins Umland. Typische Fälle sind ein Möbelkauf ohne eigenen Transporter oder die Weitergabe von Möbeln innerhalb der Familie.',
    teaser: 'Einzelne Möbel und kleine Mengen transportieren.',
    icon: 'truck',
    serviceType: 'Möbeltransport',
    situations: ['Ein gekauftes Möbelstück muss abgeholt werden.', 'Einzelne Möbel sollen umgestellt werden.'],
    includes: ['Abholung und Lieferung', 'Tragen in die Wohnung', 'Einfache Montage nach Absprache'],
    blocks: [
      {
        h: 'Diese Seite ist ein Entwurf',
        p: ['Vor der Veröffentlichung müssen Mindestpauschale, Einsatzradius und Beispiele ergänzt werden.'],
      },
    ],
    priceFactors: [{ name: 'Entfernung und Etage', effect: 'hoch', why: 'Bestimmt Fahrzeit und Trageaufwand.' }],
    faq: [],
    related: ['umzug-berlin', 'sperrmuellabholung-berlin'],
    updated: '2026-07-29',
  },
  {
    slug: 'besenreine-wohnungsuebergabe',
    status: 'draft',
    h1: 'Besenreine Wohnungsübergabe',
    navLabel: 'Besenreine Übergabe',
    metaTitle: 'Besenreine Wohnungsübergabe Berlin',
    metaDescription: 'Was besenrein bedeutet und wie die Übergabe in Berlin abläuft.',
    answer:
      'Besenrein bedeutet: Die Wohnung ist leer, gefegt und von grobem Schmutz befreit. Es ist keine Endreinigung. Was der Vermieter darüber hinaus verlangt, ergibt sich aus dem Mietvertrag.',
    teaser: 'Leer, gefegt, grober Schmutz entfernt. Was das genau heißt.',
    icon: 'key',
    serviceType: 'Wohnungsübergabe',
    situations: ['Die Wohnung muss übergeben werden.'],
    includes: ['Kehren der geräumten Flächen', 'Entfernen groben Schmutzes'],
    blocks: [
      {
        h: 'Diese Seite ist ein Entwurf',
        p: ['Inhaltlich überschneidet sich das Thema stark mit der Wohnungsauflösung. Vor der Veröffentlichung muss die Suchintention klar abgegrenzt werden, sonst konkurrieren beide Seiten.'],
      },
    ],
    priceFactors: [{ name: 'Fläche', effect: 'mittel', why: 'Bestimmt den Zeitaufwand fürs Kehren.' }],
    faq: [],
    related: ['wohnungsaufloesung-berlin'],
    updated: '2026-07-29',
  },
  {
    slug: 'bau-renovierungsabfaelle',
    status: 'draft',
    h1: 'Bau- und Renovierungsabfälle entsorgen',
    navLabel: 'Bauabfälle',
    metaTitle: 'Bauabfälle und Renovierungsabfälle entsorgen Berlin',
    metaDescription: 'Bauschutt, Tapeten, Bodenbeläge und Renovierungsabfälle in Berlin entsorgen lassen.',
    answer:
      'Wir holen Bau- und Renovierungsabfälle in Berlin ab: Bauschutt, alte Bodenbeläge, Tapeten, Türen und Sanitärobjekte. Bauschutt ist schwer und wird nach Gewicht abgerechnet. Asbesthaltige Materialien nehmen wir nicht mit.',
    teaser: 'Bauschutt, Bodenbeläge und Renovierungsreste abholen lassen.',
    icon: 'tools',
    serviceType: 'Bauabfallentsorgung',
    situations: ['Nach einer Renovierung liegt Material herum.'],
    includes: ['Abholung und getrennte Entsorgung'],
    blocks: [
      {
        h: 'Diese Seite ist ein Entwurf',
        p: ['Vor der Veröffentlichung muss geklärt werden, welche Abfallarten tatsächlich angenommen werden und über welche Entsorgungswege.'],
      },
    ],
    priceFactors: [{ name: 'Gewicht', effect: 'hoch', why: 'Bauschutt wird nach Tonnen abgerechnet, nicht nach Volumen.' }],
    faq: [],
    related: ['sperrmuellabholung-berlin', 'demontage-rueckbau'],
    updated: '2026-07-29',
  },
];

/** Nur veröffentlichte Leistungen – für Navigation, Übersichten, Sitemap. */
export const publishedServices = services.filter((s) => s.status === 'published');

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Liefert nur veröffentlichte verwandte Leistungen (keine toten Links auf Entwürfe). */
export function relatedServices(slug: string): Service[] {
  const svc = getService(slug);
  if (!svc) return [];
  return svc.related
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s) && s!.status === 'published');
}
