import type { District } from './types.ts';

/**
 * Eigenständige Inhalte für die neun weiteren Berliner Bezirke.
 *
 * Die Texte beschreiben öffentlich nachvollziehbare Bebauungs- und
 * Verkehrssituationen. Sie behaupten bewusst keine nicht belegten Einsätze,
 * Referenzen oder pauschalen Preise.
 */
export const additionalDistricts: District[] = [
  {
    slug: 'mitte',
    status: 'published',
    name: 'Mitte',
    fullName: 'Berlin-Mitte',
    h1: 'Entrümpelung und Umzug in Berlin-Mitte',
    metaTitle: 'Entrümpelung & Umzug Berlin-Mitte | Zugang planen',
    metaDescription:
      'Entrümpelung, Wohnungsauflösung und Umzug in Mitte, Moabit, Wedding und Tiergarten. Hinweise zu Höfen, Etagen, Ladezonen und kurzen Zeitfenstern.',
    answer:
      'In Berlin-Mitte entscheidet die Logistik über den Aufwand: dichter Verkehr, bewirtschafteter Parkraum, Altbauten mit Seitenflügeln und teils lange Wege vom Fahrzeug bis zur Wohnung. In Moabit und Wedding wechseln Gründerzeithäuser, Nachkriegsbauten und Gewerbehöfe auf engem Raum. Für eine belastbare Einschätzung brauchen wir deshalb Adresse, Etage, Aufzug, Hofzugang und Fotos.',
    quarters: ['Mitte', 'Moabit', 'Hansaviertel', 'Tiergarten', 'Wedding', 'Gesundbrunnen'],
    intro: [
      'Der Bezirk Mitte reicht vom historischen Zentrum über Tiergarten und Moabit bis Wedding und Gesundbrunnen. Entsprechend unterschiedlich sind die Gebäude: repräsentative Altbauten, enge Hinterhöfe, Nachkriegszeilen, große Wohnanlagen und gemischt genutzte Gewerbehöfe liegen oft nur wenige Straßen auseinander.',
      'Für Räumung und Umzug ist weniger der Bezirksname als der konkrete Hauseingang entscheidend. Eine Adresse an einer Hauptstraße kann eine vorher eingerichtete Ladefläche erfordern; im Hinterhaus verlängern Durchfahrten und Höfe den Trageweg. Fotos von Straße, Eingang, Treppenhaus und Aufzug machen eine erste Kalkulation deutlich genauer.',
    ],
    buildings: [
      'Gründerzeitblöcke mit Vorderhaus, Seitenflügel und mehreren Höfen',
      'Altbauten mit vier bis fünf Geschossen, häufig ohne möbeltauglichen Aufzug',
      'Nachkriegsbauten und größere Wohnanlagen in Wedding und Gesundbrunnen',
      'Gemischt genutzte Wohn- und Gewerbehöfe in Moabit und entlang größerer Verkehrsachsen',
      'Neuere Wohngebäude mit Tiefgarage, Aufzug und geregelten Anlieferzeiten',
    ],
    access: [
      'Bewirtschafteter Parkraum und Lieferverkehr machen eine freie Fläche direkt am Haus unsicher.',
      'Hofdurchfahrten können für hohe Transporter zu niedrig oder für breite Fahrzeuge zu eng sein.',
      'An Hauptstraßen und in Bereichen mit Busspur muss die Haltemöglichkeit vorab geklärt werden.',
      'Bei Gebäuden mit Sicherheitsdienst oder Gewerbenutzung können Anmeldung und festes Zeitfenster nötig sein.',
      'Ein kleiner Personenaufzug verkürzt Wege, ersetzt bei großen Möbeln aber nicht die Demontage.',
    ],
    blocks: [
      {
        h: 'Welche Angaben verhindern Überraschungen?',
        p: [
          'Nennen Sie neben Zimmerzahl oder Fläche die Etage, einen vorhandenen Aufzug und den Weg vom Hauseingang zur Straße. Bei Hinterhäusern sind ein Foto der Durchfahrt und die ungefähre Hoflänge besonders hilfreich.',
          'Für Büro- oder Gewerberäume gehören Zufahrtsregeln, Ladezeiten und die Frage nach Akten oder Elektrogeräten in die Anfrage. Solche Stoffströme müssen getrennt geplant werden.',
        ],
      },
      {
        h: 'Wann ist eine Vor-Ort-Besichtigung sinnvoll?',
        p: [
          'Bei kompletten Haushalten, mehreren Nebenräumen, schwer zugänglichen Hinterhäusern oder unklarem Volumen ist eine Besichtigung verlässlicher als eine Schätzung nach Quadratmetern. Bei kleinen, klar fotografierten Mengen kann eine digitale Ersteinschätzung genügen.',
        ],
      },
    ],
    cases: [],
    focusServices: ['entruempelung-berlin', 'wohnungsaufloesung-berlin', 'bueroaufloesung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Brauche ich in Berlin-Mitte eine Halteverbotszone?',
        a: 'Bei einem größeren Auftrag ist sie häufig sinnvoll, aber nicht an jeder Adresse automatisch möglich oder nötig. Entscheidend sind Straßenbreite, Beschilderung, Bus- oder Radspur und der tatsächliche Trageweg. Schicken Sie ein Foto der Straßenseite oder die genaue Adresse; dann lässt sich die Anlieferung vor dem Termin planen.',
      },
      {
        q: 'Reicht ein Personenaufzug für eine Wohnungsauflösung?',
        a: 'Er hilft bei Kartons und kleineren Teilen. Lange Schränke, Sofas oder große Platten passen jedoch oft nicht hinein und müssen zerlegt oder über das Treppenhaus getragen werden. Wichtig sind Kabinenmaß, Türbreite und Traglast. Ein Foto des Aufzugs ist für die Aufwandseinschätzung hilfreicher als die Angabe „Aufzug vorhanden“.',
      },
      {
        q: 'Können auch Keller und Hinterhaus zusammen geräumt werden?',
        a: 'Ja, wenn beide Bereiche von Anfang an in den Umfang aufgenommen werden. Gerade in Blockrandbebauung können zwischen Keller, Hof, Hinterhaus und Straße lange Wege entstehen. Fotos aus jedem Bereich und eine klare Kennzeichnung der zu räumenden Abteile vermeiden Rückfragen und schützen fremdes Eigentum.',
      },
    ],
    differentiator:
      'Innenstadtbezirk mit besonders heterogener Bebauung und hoher logistischer Abhängigkeit von Ladefläche, Hofdurchfahrt, Sicherheitszugang und Zeitfenstern.',
    updated: '2026-07-30',
  },
  {
    slug: 'friedrichshain-kreuzberg',
    status: 'published',
    name: 'Friedrichshain-Kreuzberg',
    fullName: 'Berlin-Friedrichshain-Kreuzberg',
    h1: 'Entrümpelung und Umzug in Friedrichshain-Kreuzberg',
    metaTitle: 'Entrümpelung Friedrichshain-Kreuzberg | Altbau & Hof',
    metaDescription:
      'Entrümpelung und Umzug in Friedrichshain-Kreuzberg. So wirken Altbau, Hinterhof, Gewerbehof, Etage und knapper Parkraum auf Planung und Aufwand.',
    answer:
      'Friedrichshain-Kreuzberg ist geprägt von dichten Altbauquartieren, Hinterhäusern, schmalen Treppen und stark genutztem Straßenraum. Dazu kommen Gewerbehöfe und neuere Wohnanlagen. Eine genaue Adresse, Fotos des Zugangs und Angaben zu Etage und Aufzug sind hier besonders wichtig, weil wenige Meter mehr Trageweg bei einem kompletten Haushalt viele zusätzliche Wege bedeuten.',
    quarters: ['Friedrichshain', 'Kreuzberg'],
    intro: [
      'Ob rund um Boxhagener Platz, Mehringdamm oder Landwehrkanal: Viele Gebäude sind als geschlossene Blöcke mit Vorderhaus, Seitenflügel und Hinterhaus organisiert. Fahrräder, Poller, Außengastronomie und Lieferverkehr verengen den nutzbaren Straßenraum zusätzlich.',
      'Daneben gibt es ehemalige Industrie- und Gewerbehöfe sowie Neubauten mit Tiefgaragenzufahrt. Diese Objekte können breite Treppen oder Lastenaufzüge bieten, verlangen aber häufig eine Anmeldung. Die richtige Vorbereitung hängt deshalb stärker vom Objekt als vom Ortsteil ab.',
    ],
    buildings: [
      'Dicht bebaute Gründerzeitblöcke mit Vorder- und Hinterhäusern',
      'Altbautreppen mit engen Podesten und meist keinem möbeltauglichen Aufzug',
      'Ehemalige Fabrik- und Gewerbehöfe mit mehreren Gebäudeteilen',
      'Nachkriegs- und Plattenbauten im östlichen Friedrichshain',
      'Neubauten mit Aufzug, Tiefgarage und geregeltem Gebäudemanagement',
    ],
    access: [
      'Freie Halteflächen sind tagsüber nicht verlässlich verfügbar.',
      'Der Weg durch mehrere Höfe kann länger sein als der Weg durch das Treppenhaus.',
      'Verkehrsberuhigte Bereiche, Radwege und Baustellen müssen in die Anfahrt einbezogen werden.',
      'Bei Gewerbehöfen sind Torzeiten und Ansprechpartner vorab zu klären.',
      'Sperrige Möbel sollten vor dem Tragen zerlegt werden, wenn Podeste oder Durchfahrten eng sind.',
    ],
    blocks: [
      {
        h: 'Warum ein Lagefoto hier besonders viel sagt',
        p: [
          'Ein Foto vom Hauseingang in Richtung Straße zeigt Parkstreifen, Radweg, Poller und Distanz zum Fahrzeug. Ein zweites Foto vom Hof zeigt, ob Kurven, Stufen oder eine niedrige Durchfahrt im Weg liegen. Diese Informationen verändern die Einsatzplanung stärker als die reine Wohnfläche.',
        ],
      },
      {
        h: 'Wohnung, Keller und Gewerbe getrennt beschreiben',
        p: [
          'In gemischt genutzten Häusern liegen Räume oft in verschiedenen Gebäudeteilen. Listen Sie deshalb Wohnung, Keller, Lager und Hof einzeln auf. Elektrogeräte, Akten, Farben oder andere besondere Materialien gehören ebenfalls separat genannt, damit die zulässige Entsorgung vorab geklärt werden kann.',
        ],
      },
    ],
    cases: [],
    focusServices: ['entruempelung-berlin', 'kellerentruempelung-berlin', 'umzug-berlin', 'bueroaufloesung-berlin'],
    faq: [
      {
        q: 'Kann der Transporter im Innenhof stehen?',
        a: 'Nur wenn Durchfahrt, Tragfähigkeit und Hausregeln das zulassen. Viele Altbaudurchfahrten sind niedrig oder werden als Feuerwehrzufahrt freigehalten. Messen oder fotografieren Sie die engste Stelle. Wenn die Zufahrt nicht nutzbar ist, muss der Trageweg von der Straße aus geplant werden.',
      },
      {
        q: 'Wie werden enge Altbautreppen berücksichtigt?',
        a: 'Etage, Treppenbreite, Kurven und Podeste bestimmen, ob Möbel im Ganzen bewegt werden können. Fotos helfen bei der Vorbereitung der Demontage. Bei schweren oder langen Teilen steigt der Personal- und Zeitbedarf, auch wenn das Gesamtvolumen überschaubar wirkt.',
      },
      {
        q: 'Übernehmen Sie auch kleine Gewerberäume?',
        a: 'Gewerberäume können angefragt werden. Benötigt werden Fotos, Zugangszeiten und eine Liste besonderer Inhalte wie Akten, IT-Geräte oder fest montierte Einbauten. Erst danach lässt sich klären, welche Leistungen und Entsorgungswege zum Auftrag passen.',
      },
    ],
    differentiator:
      'Besonders dichte Blockrandbebauung mit langen Hinterhofwegen, engem öffentlichem Raum und einer Mischung aus Wohnen, Gewerbehöfen und Neubau.',
    updated: '2026-07-30',
  },
  {
    slug: 'spandau',
    status: 'published',
    name: 'Spandau',
    fullName: 'Berlin-Spandau',
    h1: 'Entrümpelung und Umzug in Spandau',
    metaTitle: 'Entrümpelung & Umzug Spandau | Wohnung, Haus, Keller',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug in Spandau. Planung für Altstadt, Großsiedlung, Einfamilienhaus, Keller, Garage und längere Anfahrten.',
    answer:
      'In Spandau reicht die Bandbreite von dichter Altstadtbebauung und großen Wohnanlagen bis zu Einfamilienhäusern in Gatow, Kladow oder Heiligensee-nahen Lagen. Bei Wohnungen zählen Etage, Aufzug und Parkplatz; bei Häusern werden Keller, Dachboden, Garage und Garten häufig unterschätzt. Eine vollständige Raumliste verhindert, dass Nebenflächen erst am Einsatztag sichtbar werden.',
    quarters: ['Spandau', 'Haselhorst', 'Siemensstadt', 'Staaken', 'Gatow', 'Kladow', 'Hakenfelde', 'Falkenhagener Feld', 'Wilhelmstadt'],
    intro: [
      'Spandau ist kein einheitliches Einsatzgebiet. Rund um Altstadt und Wilhelmstadt treffen Altbauten und dichter Straßenraum aufeinander. In Staaken und Falkenhagener Feld prägen größere Wohnanlagen das Bild, während Gatow und Kladow viele Grundstücke mit Haus, Garage und Nebengebäuden haben.',
      'Das Volumen lässt sich bei einer Wohnung meist über Räume und Fotos erfassen. Bei einem Haus sollte dagegen jeder Bereich einzeln dokumentiert werden. Ein halbvoller Keller, eine Garage und ein Gartenschuppen können zusammen mehr Material enthalten als das eigentliche Wohngeschoss.',
    ],
    buildings: [
      'Altbauten und kleinteilige Bestandsgebäude rund um Altstadt und Wilhelmstadt',
      'Große Wohnanlagen und Geschossbauten in Staaken und Falkenhagener Feld',
      'Siedlungshäuser und Einfamilienhäuser mit Keller, Garage und Garten',
      'Reihenhäuser mit schmalem Grundstückszugang',
      'Wohn- und Gewerbebauten in Siemensstadt und Haselhorst',
    ],
    access: [
      'In der Altstadt und an Geschäftsstraßen ist die Haltemöglichkeit begrenzt.',
      'Große Wohnanlagen haben häufig Aufzüge, aber lange Wege durch Flure und Außenanlagen.',
      'Bei Grundstücken ist die Zufahrt meist einfacher; Tore, Kieswege und Stufen sind trotzdem relevant.',
      'Anfahrtszeit und Rückweg zur Verwertung sollten bei Terminen am westlichen Stadtrand gebündelt geplant werden.',
      'Schlüssel und Zufahrt zu Keller- oder Garagenbereichen müssen vor Beginn verfügbar sein.',
    ],
    blocks: [
      {
        h: 'Die Raumliste für ein vollständiges Angebot',
        list: [
          'alle Wohnräume und Flure',
          'Keller und Dachboden',
          'Garage, Carport und Schuppen',
          'Balkon, Terrasse und Garten',
          'fest montierte Einbauten, die entfernt werden sollen',
        ],
      },
      {
        h: 'Was bei großen Wohnanlagen zählt',
        p: [
          'Ein Aufzug erleichtert den Transport, aber der Weg vom Wohnungseingang bis zur Ladefläche kann lang sein. Nennen Sie Hauseingang, Etage, Aufzugsgröße und die nächstmögliche Fahrzeugposition. Bei verwalteten Anlagen sollte außerdem geklärt sein, ob Schutzmatten oder feste Nutzungszeiten vorgeschrieben sind.',
        ],
      },
    ],
    cases: [],
    focusServices: ['haushaltsaufloesung-berlin', 'entruempelung-berlin', 'kellerentruempelung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Wie schätze ich das Volumen eines Hauses richtig ein?',
        a: 'Gehen Sie Bereich für Bereich vor und fotografieren Sie auch Nebenräume. Besonders Keller, Dachboden, Garage und Gartenhaus werden leicht vergessen. Eine grobe Raumliste zusammen mit Übersichtsfotos ist für die erste Einschätzung besser als eine Quadratmeterzahl.',
      },
      {
        q: 'Ist ein Termin am westlichen Stadtrand möglich?',
        a: 'Spandau gehört vollständig zum Berliner Einsatzgebiet. Ob ein bestimmter Wunschtermin möglich ist, hängt von Umfang und aktueller Tourenplanung ab. Geben Sie frühzeitig Zeitfenster und Adresse an; kleinere Aufträge lassen sich manchmal mit einer Fahrt in derselben Richtung verbinden.',
      },
      {
        q: 'Kann eine Wohnungsübergabe vorbereitet werden?',
        a: 'Beschreiben Sie im Auftrag genau, was entfernt werden soll und welchen Zustand die Verwaltung erwartet. „Besenrein“ bedeutet nicht automatisch Reparatur, Renovierung oder Rückbau. Solche Zusatzarbeiten müssen ausdrücklich vereinbart und auf ihre Machbarkeit geprüft werden.',
      },
    ],
    differentiator:
      'Westlicher Flächenbezirk mit Kontrast zwischen Altstadt/Großsiedlung und Häusern mit umfangreichen Nebenflächen; Touren- und Volumenplanung stehen im Vordergrund.',
    updated: '2026-07-30',
  },
  {
    slug: 'steglitz-zehlendorf',
    status: 'published',
    name: 'Steglitz-Zehlendorf',
    fullName: 'Berlin-Steglitz-Zehlendorf',
    h1: 'Entrümpelung und Umzug in Steglitz-Zehlendorf',
    metaTitle: 'Entrümpelung Steglitz-Zehlendorf | Haus & Nachlass',
    metaDescription:
      'Entrümpelung, Nachlassauflösung und Umzug in Steglitz-Zehlendorf. Häuser, Villen, große Keller und Wohnungswechsel sorgfältig planen.',
    answer:
      'In Steglitz-Zehlendorf stehen neben Geschosswohnungen viele Reihenhäuser, Einfamilienhäuser und Villen. Bei Haushalts- und Nachlassauflösungen liegt der Aufwand daher oft in den Nebenflächen: Keller, Dachboden, Garage, Gartenhaus und lange genutzte Abstellräume. Eine Besichtigung ist bei vollständigen Häusern meist aussagekräftiger als Fotos einzelner Zimmer.',
    quarters: ['Steglitz', 'Lichterfelde', 'Lankwitz', 'Zehlendorf', 'Dahlem', 'Nikolassee', 'Wannsee'],
    intro: [
      'Der Bezirk verbindet dichte Wohn- und Geschäftsstraßen in Steglitz mit ruhigen Siedlungsgebieten und großen Grundstücken im Südwesten. Auch innerhalb eines Ortsteils wechseln Mehrfamilienhäuser, Reihenhäuser und freistehende Häuser. Entsprechend unterschiedlich sind Tragewege und Gesamtvolumen.',
      'Bei langjährig bewohnten Häusern sollte vor der Räumung geklärt sein, welche Unterlagen, Erinnerungsstücke oder möglicherweise wertvollen Gegenstände zurückbleiben. Eine klare Freigabe je Raum schützt alle Beteiligten und verhindert, dass Entscheidungen unter Zeitdruck fallen.',
    ],
    buildings: [
      'Mehrfamilienhäuser und Altbauten entlang dichter Steglitzer Straßen',
      'Reihen- und Doppelhäuser mit mehreren Ebenen',
      'Freistehende Einfamilienhäuser und Villen mit größeren Grundstücken',
      'Häuser mit ausgebautem oder schwer zugänglichem Dachgeschoss',
      'Große Keller, Garagen und Gartenhäuser mit eigenständigem Volumen',
    ],
    access: [
      'Auf Grundstücken ist die Fahrzeugposition oft gut, der Weg bis zu hinteren Nebengebäuden kann lang sein.',
      'Kelleraußentreppen, schmale Innentreppen und mehrere Ebenen erhöhen die Trageleistung.',
      'In Geschäfts- und Altbaustraßen von Steglitz bleibt Parkraum ein Planungsfaktor.',
      'Bei Privatwegen oder gemeinschaftlichen Zufahrten sollten Nutzungsregeln vorab geklärt werden.',
      'Schwere Möbel aus Obergeschossen müssen gegebenenfalls vor Ort zerlegt werden.',
    ],
    blocks: [
      {
        h: 'Nachlass zuerst sichern, dann räumen',
        p: [
          'Vor einer Nachlassauflösung sollten persönliche Dokumente, Schlüssel, Datenträger, Schmuck und Gegenstände mit möglichem ideellem oder wirtschaftlichem Wert gesichtet sein. Wenn Angehörige nicht in Berlin wohnen, helfen eine eindeutige Raumfreigabe und eine dokumentierte Schlüsselübergabe.',
          'Eine Räumungsfirma ersetzt keine unabhängige Bewertung von Kunst, Antiquitäten oder Sammlungen. Verdächtige Stücke sollten vorab separat begutachtet werden.',
        ],
      },
      {
        h: 'Warum Nebenflächen separat kalkuliert werden',
        p: [
          'Keller, Dachboden, Garage und Gartenhaus haben andere Laufwege und Materialarten als Wohnräume. Sie gehören deshalb als eigene Positionen in die Anfrage. Das verbessert die Personal-, Fahrzeug- und Entsorgungsplanung.',
        ],
      },
    ],
    cases: [],
    focusServices: ['nachlassaufloesung-berlin', 'haushaltsaufloesung-berlin', 'seniorenumzug-berlin', 'entruempelung-berlin'],
    faq: [
      {
        q: 'Ist bei einem ganzen Haus eine Besichtigung nötig?',
        a: 'Sie ist meist sinnvoll, weil Fotos selten alle Ebenen und Nebenflächen vollständig zeigen. Bei der Besichtigung lassen sich Zugänge, Tragewege, Demontage und besondere Materialien gemeinsam erfassen. Erst danach ist ein verbindlicher Leistungsumfang realistisch.',
      },
      {
        q: 'Was passiert mit möglichen Wertgegenständen?',
        a: 'Gegenstände mit möglichem Wert sollten vor der Räumung unabhängig geprüft werden. Wir geben keine Wertgutachten ab. Entscheidend ist eine klare Vereinbarung, welche Stücke bleiben, übergeben oder entfernt werden dürfen. So geraten persönliche oder wertvolle Dinge nicht versehentlich in den Räumungsumfang.',
      },
      {
        q: 'Können Angehörige den Auftrag aus der Ferne organisieren?',
        a: 'Eine Organisation mit Schlüsselübergabe und digitaler Abstimmung ist grundsätzlich möglich. Vor Beginn müssen Auftraggeber, Verfügungsberechtigung, Umfang und zurückzubehaltende Gegenstände eindeutig geklärt sein. Für Übergaben an Verwaltung oder Eigentümer sollte ebenfalls schriftlich feststehen, was beauftragt wurde.',
      },
    ],
    differentiator:
      'Hoher Anteil größerer Häuser und langjähriger Haushalte; Schwerpunkt auf vollständiger Erfassung von Nebenflächen, Nachlasssicherung und mehrgeschossigen Tragewegen.',
    updated: '2026-07-30',
  },
  {
    slug: 'tempelhof-schoeneberg',
    status: 'published',
    name: 'Tempelhof-Schöneberg',
    fullName: 'Berlin-Tempelhof-Schöneberg',
    h1: 'Entrümpelung und Umzug in Tempelhof-Schöneberg',
    metaTitle: 'Entrümpelung Tempelhof-Schöneberg | Lokal geplant',
    metaDescription:
      'Entrümpelung und Umzug in Schöneberg, Friedenau, Tempelhof, Mariendorf, Marienfelde und Lichtenrade. Zugang und Tragewege richtig planen.',
    answer:
      'Tempelhof-Schöneberg verbindet dichte Altbauquartiere in Schöneberg und Friedenau mit Nachkriegsbauten, Gewerbelagen und Siedlungsgebieten im Süden. Im Norden stehen Parkraum, Hinterhof und Etage im Mittelpunkt; in Marienfelde oder Lichtenrade eher Keller, Garage und Grundstück. Deshalb braucht jede Anfrage eine objektbezogene statt nur bezirksbezogene Einschätzung.',
    quarters: ['Schöneberg', 'Friedenau', 'Tempelhof', 'Mariendorf', 'Marienfelde', 'Lichtenrade'],
    intro: [
      'Zwischen Nollendorfplatz und Lichtenrade ändern sich Bebauung und Zugang mehrfach. Schöneberg und Friedenau haben viele Altbauten mit Innenhöfen und knappen Stellflächen. Tempelhof mischt Geschosswohnen und Gewerbe, während weiter südlich Reihen- und Einfamilienhäuser häufiger werden.',
      'Das wirkt direkt auf den Ablauf: Im Altbau muss der Weg zur Straße gesichert werden, in einem Haus müssen alle Nebenflächen erfasst sein. Für kleinere Mengen reichen oft Fotos; für eine vollständige Auflösung mit Keller oder Dachboden ist eine Besichtigung belastbarer.',
    ],
    buildings: [
      'Altbauten mit Vorderhaus, Seitenflügel und kleinen Höfen in Schöneberg und Friedenau',
      'Nachkriegsbauten und größere Wohnanlagen in Tempelhof',
      'Wohn- und Gewerbeobjekte entlang wichtiger Verkehrsachsen',
      'Reihenhäuser und Siedlungsbauten in Mariendorf und Marienfelde',
      'Einfamilienhäuser mit Keller, Garage und Garten in Lichtenrade',
    ],
    access: [
      'In den nördlichen Altbauquartieren ist eine verlässliche Ladefläche nicht selbstverständlich.',
      'Hinterhöfe und Seitenflügel verlängern den Weg auch bei niedrigen Etagen.',
      'Gewerbeobjekte können feste Tor- oder Ladezeiten haben.',
      'Bei Reihenhäusern sind Zugänge durch Vorgarten oder schmale Wege zu berücksichtigen.',
      'Im Süden ist die Zufahrt häufig einfacher, dafür verteilt sich der Inhalt auf mehr Flächen.',
    ],
    blocks: [
      {
        h: 'Nord und Süd brauchen unterschiedliche Vorbereitung',
        table: {
          head: ['Objektsituation', 'Vorab besonders klären'],
          rows: [
            ['Altbau/Hinterhaus', 'Etage, Aufzug, Hofweg, Ladefläche'],
            ['Wohnanlage', 'Aufzugsmaß, Gebäuderegeln, Weg zum Stellplatz'],
            ['Haus/Siedlung', 'Keller, Dachboden, Garage, Garten und Stufen'],
            ['Gewerbe', 'Zugangszeit, Einbauten und besondere Materialarten'],
          ],
        },
      },
      {
        h: 'Was Fotos zeigen sollten',
        p: [
          'Neben Übersichtsbildern jedes Raums sind Eingang, Treppe, Aufzug und der Weg zur Straße wichtig. Bei Häusern kommen Keller, Dachboden und Nebengebäude hinzu. So lässt sich früh erkennen, ob Demontage oder zusätzliche Tragewege einzuplanen sind.',
        ],
      },
    ],
    cases: [],
    focusServices: ['entruempelung-berlin', 'wohnungsaufloesung-berlin', 'haushaltsaufloesung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Ist Schöneberg teurer als Lichtenrade?',
        a: 'Nicht der Ortsteil bestimmt den Preis, sondern Menge, Zugang und Leistungsumfang. Ein Altbau ohne Aufzug kann mehr Tragezeit verursachen; ein Haus in Lichtenrade kann dafür deutlich mehr Nebenflächen enthalten. Erst mit Fotos und Zugangsdaten lässt sich beides sinnvoll vergleichen.',
      },
      {
        q: 'Muss ich Keller und Dachboden extra angeben?',
        a: 'Ja. Beide Bereiche sollten mit eigenen Fotos und einer groben Mengenangabe in der Anfrage stehen. Sie haben oft andere Zugänge und Inhalte als die Wohnung. Das beeinflusst Zeit, Demontage, Fahrzeugbedarf und die Trennung unterschiedlicher Materialien.',
      },
      {
        q: 'Kann ein Auftrag in einem Gewerbehof stattfinden?',
        a: 'Das kann geprüft werden. Wichtig sind Ansprechpartner, Tor- und Ladezeiten, verfügbare Aufzüge sowie Angaben zu Einbauten, Akten und Elektrogeräten. Bei besonderen Materialien muss vor einer Zusage der passende Entsorgungsweg feststehen.',
      },
    ],
    differentiator:
      'Ausgeprägter Nord-Süd-Wechsel von dichtem Altbau über Gewerbe und Wohnanlagen bis zu Siedlungs- und Einfamilienhäusern.',
    updated: '2026-07-30',
  },
  {
    slug: 'neukoelln',
    status: 'published',
    name: 'Neukölln',
    fullName: 'Berlin-Neukölln',
    h1: 'Entrümpelung und Umzug in Neukölln',
    metaTitle: 'Entrümpelung & Umzug Neukölln | Altbau bis Rudow',
    metaDescription:
      'Entrümpelung und Umzug in Neukölln, Britz, Buckow, Rudow und Gropiusstadt. Planung für Altbau, Wohnanlage, Aufzug, Keller und Haus.',
    answer:
      'Neukölln reicht vom dicht bebauten Altbau im Norden über Britzer Siedlungen und die Gropiusstadt bis zu Einfamilienhäusern in Buckow und Rudow. Damit wechseln die entscheidenden Faktoren: Im Norden zählen Treppe, Hinterhof und Ladefläche; in großen Wohnanlagen Aufzug und Außenweg; bei Häusern Keller, Garage und Garten.',
    quarters: ['Neukölln', 'Britz', 'Buckow', 'Rudow', 'Gropiusstadt'],
    intro: [
      'Nord-Neukölln ist durch geschlossene Altbaublöcke, Hinterhäuser und stark genutzte Straßen geprägt. Südlich des S-Bahn-Rings wird die Bebauung offener: Siedlungen, große Wohnanlagen und Einfamilienhausgebiete verändern Zugang und Volumen.',
      'Eine pauschale Bezirksschätzung wäre deshalb unzuverlässig. Für die Vorbereitung braucht es die konkrete Gebäudesituation. Bei einer Wohnung sind Etage und Aufzug zentral, bei einem Haus eine vollständige Liste aller Nebenflächen.',
    ],
    buildings: [
      'Gründerzeit-Altbauten mit Vorderhaus, Seitenflügel und Hinterhof im Norden',
      'Siedlungs- und Reihenhausbebauung in Britz und Buckow',
      'Große Geschosswohnanlagen in der Gropiusstadt',
      'Einfamilienhäuser mit Keller, Garage und Garten in Rudow',
      'Gemischt genutzte Wohn- und Gewerbehöfe entlang größerer Straßen',
    ],
    access: [
      'In Nord-Neukölln sind Parkraum, Radwege und enge Hofwege vorab zu prüfen.',
      'Aufzüge in Wohnanlagen sparen Treppenwege, können aber klein oder stark genutzt sein.',
      'Zwischen Hauseingang und Stellplatz liegen in Großanlagen oft längere Außenwege.',
      'Bei Häusern im Süden ist die Zufahrt einfacher, der Inhalt verteilt sich jedoch auf mehr Bereiche.',
      'Kellerabteile müssen eindeutig bezeichnet und zugänglich sein.',
    ],
    blocks: [
      {
        h: 'Drei Gebäudetypen, drei Planungen',
        p: [
          'Beim Altbau stehen Ladefläche, Etage und Demontage im Vordergrund. In einer Wohnanlage sind Aufzugsmaß, Gebäuderegeln und Weg zur Straße wichtig. Beim Haus zählen Vollständigkeit und Nebenflächen. Diese Unterscheidung ist für die Kalkulation nützlicher als die Quadratmeterzahl allein.',
        ],
      },
      {
        h: 'So dokumentieren Sie Kellerabteile sicher',
        p: [
          'Fotografieren Sie das Abteil, den Zugang und seine Kennzeichnung. Bei mehreren Abteilen sollte schriftlich feststehen, welche geräumt werden dürfen. Dadurch wird fremdes Eigentum geschützt und der Laufweg vom Keller bis zum Ausgang sichtbar.',
        ],
      },
    ],
    cases: [],
    focusServices: ['entruempelung-berlin', 'wohnungsaufloesung-berlin', 'kellerentruempelung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Was ist bei einem Hinterhaus in Nord-Neukölln wichtig?',
        a: 'Neben Etage und Aufzug sind Durchfahrt, Hoflänge und die nächstmögliche Fahrzeugposition wichtig. Ein Foto vom Eingang zur Straße und eines durch den Hof zeigt den Trageweg. Bei niedrigen Durchfahrten muss von der Straße getragen werden.',
      },
      {
        q: 'Wie wird ein Auftrag in der Gropiusstadt geplant?',
        a: 'Nennen Sie Hauseingang, Etage, Aufzugsgröße und den Weg zum Parkplatz oder zur Anlieferzone. In großen Anlagen kann der Außenweg länger sein als erwartet. Falls die Hausverwaltung Nutzungszeiten oder Schutzmaßnahmen vorgibt, sollten diese vorab bekannt sein.',
      },
      {
        q: 'Räumen Sie auch Garage und Gartenhaus in Rudow?',
        a: 'Beide Bereiche können Teil einer Haushaltsauflösung sein, wenn sie in der Anfrage vollständig beschrieben werden. Schicken Sie eigene Fotos und nennen Sie besondere Materialien. Für Stoffe, die nicht regulär übernommen werden können, muss vorab ein zulässiger Weg geklärt werden.',
      },
    ],
    differentiator:
      'Starker Übergang vom dichten nördlichen Altbau über Großwohnanlagen bis zu Haus- und Siedlungsgebieten im Süden.',
    updated: '2026-07-30',
  },
  {
    slug: 'treptow-koepenick',
    status: 'published',
    name: 'Treptow-Köpenick',
    fullName: 'Berlin-Treptow-Köpenick',
    h1: 'Entrümpelung und Umzug in Treptow-Köpenick',
    metaTitle: 'Entrümpelung Treptow-Köpenick | Haus & Wohnung',
    metaDescription:
      'Entrümpelung und Umzug in Treptow-Köpenick. Hinweise für Altbau, Wohnanlage, Einfamilienhaus, Grundstück, Keller und lange Wege.',
    answer:
      'Treptow-Köpenick ist Berlins flächengrößter Bezirk und reicht von innerstädtischen Altbauten bis zu wasser- und waldnahen Siedlungsgebieten. Bei Wohnungen zählen Etage und Stellplatz, bei Häusern und Grundstücken das Gesamtvolumen aus Keller, Dachboden, Garage, Schuppen und Außenbereich. Auch die Tourenplanung spielt wegen der langen Wege im Bezirk eine größere Rolle.',
    quarters: ['Alt-Treptow', 'Plänterwald', 'Baumschulenweg', 'Johannisthal', 'Adlershof', 'Altglienicke', 'Bohnsdorf', 'Oberschöneweide', 'Niederschöneweide', 'Köpenick', 'Friedrichshagen', 'Rahnsdorf', 'Grünau', 'Müggelheim', 'Schmöckwitz'],
    intro: [
      'Im Nordwesten des Bezirks finden sich Altbauten und dichter Geschosswohnungsbau. In Adlershof und den Schöneweider Ortsteilen kommen Gewerbe- und Neubauflächen hinzu. Richtung Müggelsee und südöstlicher Stadtgrenze nehmen Häuser, größere Grundstücke und private Zufahrten zu.',
      'Für eine vollständige Einschätzung sollten Objekt und Außenflächen getrennt beschrieben werden. Alte Gartenmöbel, Holz, Geräte oder Inhalte aus Schuppen sind nicht automatisch im Volumen eines Hauses enthalten. Bei entlegeneren Adressen ist außerdem ein klares Zeitfenster wichtig, damit Personal und Fahrzeug passend geplant werden.',
    ],
    buildings: [
      'Alt- und Bestandsbauten in Alt-Treptow, Baumschulenweg und Köpenick',
      'Große Wohnanlagen und Nachkriegsbauten in mehreren Ortsteilen',
      'Umgenutzte Industrie- und Gewerbeobjekte in Ober- und Niederschöneweide',
      'Neubau- und Forschungsstandorte in Adlershof',
      'Einfamilien- und Wochenendhäuser mit Grundstück und Nebengebäuden im Südosten',
    ],
    access: [
      'Innerstädtische Lagen können knappen Parkraum und längere Hofwege haben.',
      'Gewerbeobjekte erfordern häufig angemeldete Zufahrt und feste Ladezeiten.',
      'Bei Grundstücken sind Torbreite, Untergrund und Weg zu Schuppen oder Gartenhaus relevant.',
      'Private oder schmale Zufahrtswege können die Fahrzeuggröße begrenzen.',
      'Lange Fahrwege innerhalb des Bezirks sprechen für eine vollständige Mengenaufnahme vor dem Termin.',
    ],
    blocks: [
      {
        h: 'Warum Grundstücke eine eigene Bestandsaufnahme brauchen',
        p: [
          'Ein Grundstück kann mehrere voneinander getrennte Arbeitsbereiche enthalten. Fotografieren Sie Garage, Schuppen, Gartenhaus und Außenlager jeweils von innen und außen. Nennen Sie außerdem Stufen, weichen Untergrund oder enge Tore.',
          'Bauchemikalien, Farben, Batterien und ähnliche Materialien dürfen nicht stillschweigend zum normalen Räumungsgut gerechnet werden. Sie müssen vorab benannt und auf einen zulässigen Entsorgungsweg geprüft werden.',
        ],
      },
      {
        h: 'Tourenplanung bei langen Wegen',
        p: [
          'Eine präzise Mengenangabe reduziert Nachfahrten. Gerade am äußeren Stadtrand ist es wichtig, Fahrzeugbedarf und Personal vor Abfahrt festzulegen. Übersichtsfotos und Maße großer Einzelstücke helfen dabei.',
        ],
      },
    ],
    cases: [],
    focusServices: ['haushaltsaufloesung-berlin', 'entruempelung-berlin', 'kellerentruempelung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Gehören Garten und Schuppen automatisch zur Hausräumung?',
        a: 'Nein, der beauftragte Umfang sollte jeden Bereich ausdrücklich nennen. Gartenmöbel, Geräte, Holz und Inhalte aus Nebengebäuden können erhebliches Zusatzvolumen bilden. Separate Fotos sorgen dafür, dass Fahrzeug und Entsorgungswege passend geplant werden.',
      },
      {
        q: 'Sind Einsätze in Rahnsdorf oder Schmöckwitz möglich?',
        a: 'Diese Ortsteile liegen im Berliner Einsatzgebiet. Die konkrete Terminmöglichkeit hängt von Umfang und Tourenplanung ab. Teilen Sie Adresse, gewünschtes Zeitfenster und vollständige Fotos früh mit, damit die Fahrt ohne unnötige Nachfahrt vorbereitet werden kann.',
      },
      {
        q: 'Was muss bei einer schmalen Grundstückszufahrt angegeben werden?',
        a: 'Hilfreich sind ungefähre Torbreite, Untergrund, Wendemöglichkeit und Distanz bis zum Gebäude. Ein Foto aus beiden Richtungen zeigt meist, ob das geplante Fahrzeug bis zum Haus gelangt oder ein längerer Trageweg entsteht.',
      },
    ],
    differentiator:
      'Flächengrößter Bezirk mit weiten Touren, Gewerbestandorten sowie besonders vielen Grundstücks- und Nebenflächen im Südosten.',
    updated: '2026-07-30',
  },
  {
    slug: 'lichtenberg',
    status: 'published',
    name: 'Lichtenberg',
    fullName: 'Berlin-Lichtenberg',
    h1: 'Entrümpelung und Umzug in Lichtenberg',
    metaTitle: 'Entrümpelung & Umzug Lichtenberg | Zugang prüfen',
    metaDescription:
      'Entrümpelung und Umzug in Lichtenberg, Karlshorst, Rummelsburg und Hohenschönhausen. Planung für Altbau, Plattenbau, Aufzug und Haus.',
    answer:
      'Lichtenberg kombiniert Gründerzeitquartiere, große Wohnanlagen, Plattenbauten und ruhige Hausgebiete. In Friedrichsfelde oder Hohenschönhausen helfen Aufzüge, dafür können Wege durch lange Flure und Außenanlagen entstehen. In Karlshorst, Malchow oder Wartenberg sind Keller, Grundstück und Nebengebäude häufiger Teil des Umfangs. Zugangsdaten und vollständige Fotos bleiben deshalb entscheidend.',
    quarters: ['Lichtenberg', 'Friedrichsfelde', 'Karlshorst', 'Rummelsburg', 'Fennpfuhl', 'Alt-Hohenschönhausen', 'Neu-Hohenschönhausen', 'Falkenberg', 'Malchow', 'Wartenberg'],
    intro: [
      'Der Bezirk besitzt sehr unterschiedliche Wohnformen. Dichte Bestandsquartiere liegen neben standardisierten Großsiedlungen; im Norden und in Karlshorst finden sich außerdem Reihen- und Einfamilienhäuser. Das macht Zugang und Menge objektabhängig.',
      'Ein vorhandener Aufzug ist hilfreich, beschreibt den Aufwand aber nicht vollständig. Kabinenmaß, Weg zum Hauseingang und Stellplatz gehören ebenso zur Prüfung. Bei Häusern muss die Anfrage dagegen alle Ebenen und Nebenflächen abdecken.',
    ],
    buildings: [
      'Altbauten und Bestandsquartiere in Lichtenberg, Rummelsburg und Karlshorst',
      'Plattenbauten und größere Wohnanlagen in Fennpfuhl und Hohenschönhausen',
      'Nachkriegszeilen mit gemeinschaftlichen Außenflächen',
      'Reihen- und Einfamilienhäuser in nördlichen Ortsteilen',
      'Kelleranlagen mit vielen Abteilen und längeren Fluren',
    ],
    access: [
      'Aufzüge sind in Großsiedlungen häufig vorhanden, aber nicht immer für lange Möbel geeignet.',
      'Der Weg von der Haustür zur nächsten Stellfläche kann durch Grün- und Fußwege verlängert sein.',
      'Kellerzugänge liegen teils auf einer anderen Gebäudeseite als der Haupteingang.',
      'Bei verwalteten Anlagen können Anmeldung und Schutzvorgaben gelten.',
      'In Hausgebieten erleichtert eine Zufahrt den Transport, Nebenflächen erhöhen jedoch das Volumen.',
    ],
    blocks: [
      {
        h: 'Aufzug vorhanden – welche Angaben fehlen noch?',
        p: [
          'Benötigt werden Türbreite, Kabinenmaß, Traglast und die Frage, ob Stufen bis zum Aufzug führen. Bei großen Wohnanlagen kommt der Außenweg hinzu. Ein Video vom Weg Wohnung–Aufzug–Ausgang kann die Situation kompakt zeigen.',
        ],
      },
      {
        h: 'Mehrere Kellerabteile eindeutig zuordnen',
        p: [
          'Bei Aufträgen in größeren Anlagen sollten Abteilnummern und Schlüssel vorab geprüft sein. Eine schriftliche Liste der freigegebenen Bereiche verhindert Verwechslungen. Die Menge jedes Abteils wird separat fotografiert.',
        ],
      },
    ],
    cases: [],
    focusServices: ['entruempelung-berlin', 'wohnungsaufloesung-berlin', 'kellerentruempelung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Macht ein Aufzug die Räumung automatisch einfach?',
        a: 'Er reduziert Treppenwege, aber Größe, Verfügbarkeit und Entfernung zum Stellplatz bleiben entscheidend. Große Möbel müssen möglicherweise zerlegt werden. Bei stark genutzten Aufzügen entstehen Wartezeiten, die in der Ablaufplanung berücksichtigt werden.',
      },
      {
        q: 'Können mehrere Kellerabteile gemeinsam geräumt werden?',
        a: 'Ja, wenn alle Abteile eindeutig benannt, zugänglich und vom Auftraggeber freigegeben sind. Fotos je Abteil und eine Liste der Nummern schützen fremdes Eigentum und zeigen, welches Gesamtvolumen sowie welche Laufwege zu erwarten sind.',
      },
      {
        q: 'Was ist bei einer Wohnungsübergabe an die Verwaltung wichtig?',
        a: 'Klären Sie schriftlich, welchen Zustand die Verwaltung verlangt. Räumung und besenreine Übergabe sind von Reparatur, Renovierung oder Rückbau zu unterscheiden. Nur ausdrücklich vereinbarte Zusatzleistungen gehören zum Auftrag.',
      },
    ],
    differentiator:
      'Mischung aus Großsiedlungen mit Aufzugslogistik, langen Außenwegen und nördlichen Hausgebieten mit Nebenflächen.',
    updated: '2026-07-30',
  },
  {
    slug: 'reinickendorf',
    status: 'published',
    name: 'Reinickendorf',
    fullName: 'Berlin-Reinickendorf',
    h1: 'Entrümpelung und Umzug in Reinickendorf',
    metaTitle: 'Entrümpelung Reinickendorf | Wohnung, Haus, Nachlass',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug in Reinickendorf, Tegel, Frohnau und Märkischem Viertel. Zugang und Nebenflächen planen.',
    answer:
      'Reinickendorf umfasst dichte Mehrfamilienhausgebiete, das Märkische Viertel und weitläufige Einfamilienhauslagen von Hermsdorf bis Frohnau. Bei Wohnanlagen zählen Aufzug und Weg zur Ladefläche; bei Häusern werden Keller, Dachboden, Garage und Garten zum eigenen Projekt. Für komplette Haushalte ist eine Raum-für-Raum-Aufnahme die sicherste Grundlage.',
    quarters: ['Reinickendorf', 'Tegel', 'Konradshöhe', 'Heiligensee', 'Frohnau', 'Hermsdorf', 'Waidmannslust', 'Lübars', 'Wittenau', 'Märkisches Viertel', 'Borsigwalde'],
    intro: [
      'Im Süden und rund um Tegel gibt es Geschosswohnen, Bestandsbauten und Gewerbe. Das Märkische Viertel bringt große Wohnanlagen mit Aufzügen und weitläufigen Außenbereichen hinzu. In Frohnau, Hermsdorf, Heiligensee und Lübars dominieren stärker Häuser und Grundstücke.',
      'Diese Struktur verändert den Auftrag: Eine Wohnung kann gut über Etage, Aufzug und Fotos beschrieben werden. Bei einem Haus genügt die Wohnfläche nicht, weil Nebenräume und Außenbereiche das Volumen stark vergrößern können.',
    ],
    buildings: [
      'Mehrfamilien- und Bestandsbauten in Reinickendorf, Tegel und Wittenau',
      'Große Wohnanlagen im Märkischen Viertel',
      'Reihenhäuser und Siedlungsbauten in mehreren nördlichen Ortsteilen',
      'Freistehende Häuser mit Keller, Garage und Garten',
      'Grundstücke mit Schuppen, Werkstatt oder weiteren Nebengebäuden',
    ],
    access: [
      'Bei Wohnanlagen ist der Fußweg vom Hauseingang zur Stellfläche zu erfassen.',
      'Aufzugsmaße und Gebäuderegeln sollten vorab bekannt sein.',
      'In Tegeler Geschäftsstraßen kann die Ladefläche knapp sein.',
      'Bei Grundstücken zählen Torbreite, Untergrund und Entfernung zu Nebengebäuden.',
      'Mehrere Ebenen und Kelleraußentreppen erhöhen die Zahl der Tragewege.',
    ],
    blocks: [
      {
        h: 'Wohnanlage oder Haus: die richtige Checkliste',
        table: {
          head: ['Wohnanlage', 'Haus und Grundstück'],
          rows: [
            ['Etage und Aufzugsmaß', 'alle Etagen und Treppen'],
            ['Weg zur Ladefläche', 'Keller und Dachboden'],
            ['Hausregeln und Zeitfenster', 'Garage und Nebengebäude'],
            ['Kennzeichnung der Kellerabteile', 'Garten- und Außenmaterial'],
          ],
        },
      },
      {
        h: 'Wann eine Besichtigung Zeit spart',
        p: [
          'Bei langjährig bewohnten Häusern, Nachlässen oder mehreren Nebengebäuden verhindert eine Besichtigung fehlende Positionen. Dabei lassen sich auch zurückzubehaltende Gegenstände und schwer zugängliche Bereiche markieren.',
        ],
      },
    ],
    cases: [],
    focusServices: ['haushaltsaufloesung-berlin', 'nachlassaufloesung-berlin', 'entruempelung-berlin', 'umzug-berlin'],
    faq: [
      {
        q: 'Was muss ich für ein Haus in Frohnau oder Hermsdorf fotografieren?',
        a: 'Fotografieren Sie jeden Raum sowie Keller, Dachboden, Garage, Schuppen und Gartenbereiche separat. Ergänzen Sie Eingang, Treppen und Zufahrt. Nur so lässt sich erkennen, wie sich Menge und Tragewege über das Grundstück verteilen.',
      },
      {
        q: 'Wie wird eine Wohnung im Märkischen Viertel eingeschätzt?',
        a: 'Neben Übersichtsfotos werden Etage, Aufzugsgröße und die Entfernung zwischen Hauseingang und Stellplatz benötigt. In großen Anlagen können Flur- und Außenwege erheblich sein, obwohl ein Aufzug vorhanden ist.',
      },
      {
        q: 'Kann eine Nachlassauflösung dokumentiert werden?',
        a: 'Der gewünschte Dokumentationsumfang sollte vorab vereinbart werden, etwa Fotos bestimmter Bereiche oder eine protokollierte Schlüsselübergabe. Persönliche Dokumente und mögliche Wertgegenstände sollten vor Räumungsbeginn gesichert oder eindeutig ausgenommen sein.',
      },
    ],
    differentiator:
      'Nördlicher Bezirk mit Kontrast zwischen Großwohnanlage und weitläufigen Hausgrundstücken; zweigleisige Checkliste für Aufzug versus Nebenflächen.',
    updated: '2026-07-30',
  },
];
