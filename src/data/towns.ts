import type { Town } from './types.ts';

/**
 * BERLINER UMLAND (BRANDENBURG)
 * =============================
 * Es gilt derselbe Publish Guard wie für Bezirke: Eine Ortsseite geht erst
 * online, wenn sie eigenständige Inhalte hat. Alles andere bleibt Entwurf.
 *
 * Bewusst KEINE automatisch erzeugten Kombinationen aus Leistung und Ort.
 */

export const towns: Town[] = [
  /* ================================================================== */
  {
    slug: 'potsdam',
    status: 'published',
    name: 'Potsdam',
    county: 'kreisfreie Stadt',
    h1: 'Entrümpelung und Umzug in Potsdam',
    metaTitle: 'Entrümpelung & Umzug Potsdam: Altbau, Villa, Plattenbau',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug in Potsdam. Was enge Innenstadtstraßen, Villengrundstücke und die Wohngebiete am Stern für den Aufwand bedeuten.',
    answer:
      'In Potsdam treffen drei sehr unterschiedliche Bauformen aufeinander: die historische Innenstadt mit engen Straßen und Denkmalschutz, die Villengebiete in der Berliner und Nauener Vorstadt und die Wohngebiete am Stern, am Schlaatz und in der Waldstadt mit Aufzügen und guter Zufahrt. Der Aufwand für eine Räumung hängt in Potsdam stärker vom Stadtteil ab als von der Wohnungsgröße.',
    quarters: [
      'Innenstadt',
      'Babelsberg',
      'Berliner Vorstadt',
      'Nauener Vorstadt',
      'Potsdam-West',
      'Bornstedt',
      'Am Stern',
      'Schlaatz',
      'Waldstadt',
      'Drewitz',
      'Golm',
      'Bornim',
      'Groß Glienicke',
      'Fahrland',
    ],
    intro: [
      'Potsdam liegt für uns am westlichen Rand des regelmäßigen Einsatzgebiets und ist über die Anbindung Richtung Zehlendorf und über die A115 gut erreichbar. Wir fahren dort regelmäßig hin, planen aber die Anfahrt in die Kalkulation ein, weil sie länger dauert als ein innerstädtischer Einsatz in Berlin.',
      'Für die Einschätzung ist in Potsdam der Stadtteil die wichtigste Angabe. In der Innenstadt und in Babelsberg sind die Straßen eng, das Halten vor dem Haus ist oft nur mit Genehmigung möglich, und viele Gebäude stehen unter Denkmalschutz. In den Wohngebieten im Süden und Osten ist die Zufahrt dagegen unproblematisch.',
    ],
    buildings: [
      'Historische Innenstadtbebauung, teils unter Denkmalschutz, mit schmalen Treppenhäusern',
      'Babelsberg: kleinteilige Bebauung, enge Straßen, viele Zwei- und Dreifamilienhäuser',
      'Berliner und Nauener Vorstadt: Villen und Stadthäuser mit Garten, Nebengebäuden und langen Wegen auf dem Grundstück',
      'Am Stern, Schlaatz, Waldstadt und Drewitz: Geschossbau mit Aufzug und Anlieferflächen',
      'Bornstedter Feld und Golm: neuere Wohnanlagen und Reihenhäuser',
      'Ortsteile im Norden wie Fahrland und Marquardt: dörfliche Struktur mit Einfamilienhäusern und Grundstücken',
    ],
    access: [
      'In der Innenstadt und in Babelsberg sind die Straßen eng und der Parkraum bewirtschaftet. Eine Halteverbotszone ist bei größeren Einsätzen fast immer nötig.',
      'Denkmalgeschützte Gebäude haben teils enge Hauseingänge und Treppen, die den Transport großer Möbel erschweren.',
      'In den Vorstädten ist die Zufahrt bis ans Grundstück meist möglich, der Weg vom Fahrzeug bis zur Haustür kann trotzdem lang sein.',
      'In den Wohngebieten im Süden gibt es Anlieferflächen und Aufzüge, dort ist eine Zone selten erforderlich.',
      'Die Anfahrt aus Berlin dauert je nach Verkehrslage 40 bis 70 Minuten und wird in der Kalkulation berücksichtigt.',
    ],
    blocks: [
      {
        h: 'Was bei denkmalgeschützten Gebäuden zu beachten ist',
        p: [
          'In Potsdams historischer Innenstadt stehen viele Gebäude unter Denkmalschutz. Für eine Räumung heißt das vor allem: sorgfältig arbeiten. Historische Treppengeländer, Stuck in den Fluren, alte Türblätter und originale Böden vertragen keine unachtsamen Transporte.',
          'Wir arbeiten in solchen Häusern mit Kantenschutz und Abdeckungen im Treppenhaus. Wenn Sie wissen, dass das Haus unter Denkmalschutz steht, sagen Sie es bei der Anfrage. Wir planen dann mehr Zeit für die Vorbereitung ein.',
        ],
      },
      {
        h: 'Villengrundstücke in den Vorstädten',
        p: [
          'Bei Haus- und Villenräumungen in der Berliner Vorstadt, in Nauen oder in Bornim ist die Zufahrt selten das Problem. Der Aufwand steckt im Volumen: Keller, Dachboden, Garage, Gartenhaus, Terrasse und Garten kommen zusammen.',
          'Für eine belastbare Einschätzung brauchen wir Fotos von allen Nebengebäuden. Bei Grundstücken über 800 Quadratmetern empfehlen wir statt einer Fotoeinschätzung eine Besichtigung, weil der Umfang sonst regelmäßig unterschätzt wird.',
        ],
      },
    ],
    cases: [],
    focusServices: [
      'haushaltsaufloesung-berlin',
      'entruempelung-berlin',
      'umzug-berlin',
      'nachlassaufloesung-berlin',
    ],
    faq: [
      {
        q: 'Fahren Sie nach Potsdam?',
        a: 'Ja, Potsdam gehört zu unserem regelmäßigen Einsatzgebiet. Die Anfahrt aus Berlin dauert je nach Verkehr 40 bis 70 Minuten und wird in der Kalkulation berücksichtigt. Bei kleinen Einzelabholungen lohnt sich eine Terminkombination mit anderen Fahrten in Richtung Südwesten.',
      },
      {
        q: 'Brauche ich in der Potsdamer Innenstadt eine Halteverbotszone?',
        a: 'In den meisten Innenstadtstraßen und in Babelsberg ja. Die Straßen sind eng, der Parkraum bewirtschaftet, und ohne reservierte Fläche wird der Trageweg schnell sehr lang. Die Zone wird bei der Stadt Potsdam beantragt und braucht Vorlauf.',
      },
      {
        q: 'Was ist bei einem Haus mit großem Grundstück zu beachten?',
        a: 'Nebengebäude und Garten gehören in die Anfrage. Garage, Gartenhaus, Schuppen und Gartenabfälle machen bei Grundstücksräumungen oft mehr als die Hälfte des Volumens aus. Ab etwa 800 Quadratmetern Grundstücksfläche empfehlen wir eine Besichtigung statt einer Fotoeinschätzung.',
      },
      {
        q: 'Arbeiten Sie auch in den nördlichen Ortsteilen wie Fahrland oder Marquardt?',
        a: 'Ja, das sind Potsdamer Ortsteile und gehören zum Einsatzgebiet. Dort ist die Zufahrt in der Regel unproblematisch. Rechnen Sie mit etwas längerer Anfahrt als in die Potsdamer Innenstadt.',
      },
    ],
    differentiator:
      'Drei klar unterschiedliche Bebauungsformen in einer Stadt, Denkmalschutz in der Innenstadt, Villengrundstücke mit unterschätztem Volumen. Eigener Abschnitt zum Arbeiten in denkmalgeschützten Treppenhäusern.',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'falkensee',
    status: 'published',
    name: 'Falkensee',
    county: 'Landkreis Havelland',
    h1: 'Entrümpelung und Umzug in Falkensee',
    metaTitle: 'Entrümpelung & Umzug Falkensee: Häuser, Grundstücke, Keller',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug in Falkensee. Einfamilienhäuser mit großen Grundstücken, Nebengebäude und was das für den Umfang bedeutet.',
    answer:
      'Falkensee grenzt direkt an Spandau und ist über die B5 schnell erreichbar. Der Ort besteht fast vollständig aus Einfamilienhäusern auf großen Grundstücken, viele davon aus ehemaligen Wochenendhäusern entstanden. Für Räumungen heißt das: einfache Zufahrt, aber deutlich mehr Volumen als bei einer Wohnung, weil Garage, Schuppen, Keller und Garten dazugehören.',
    quarters: ['Falkenhagen', 'Seegefeld', 'Finkenkrug', 'Falkenhain', 'Waldheim', 'Neufinkenkrug'],
    intro: [
      'Falkensee liegt unmittelbar an der Berliner Stadtgrenze und ist von Spandau aus in kurzer Zeit erreichbar. Für uns ist es einer der am einfachsten anzufahrenden Orte im Umland, entsprechend gut lassen sich Termine dort mit Einsätzen im Berliner Westen kombinieren.',
      'Die Bebauung ist fast durchgehend kleinteilig: Einfamilienhäuser, Doppelhäuser und Bungalows auf Grundstücken, die häufig 600 bis 1.000 Quadratmeter groß sind. Ein Teil des Bestands ist aus früheren Wochenendhäusern und Datschen entstanden, die nach und nach zu Wohnhäusern ausgebaut wurden. Diese Häuser haben oft mehr Nebengebäude als Wohnfläche.',
    ],
    buildings: [
      'Einfamilien- und Doppelhäuser mit ein bis zwei Vollgeschossen',
      'Bungalows und ausgebaute ehemalige Wochenendhäuser',
      'Fast immer Keller oder Kriechkeller, häufig gefüllt',
      'Garagen, Carports, Gartenhäuser und Geräteschuppen',
      'Große Gärten mit Gewächshäusern, Zäunen und Gartenmöbeln',
      'Vereinzelt kleinere Mehrfamilienhäuser im Zentrum rund um den Bahnhof',
    ],
    access: [
      'Die Zufahrt bis ans Grundstück ist fast überall möglich. Eine Halteverbotszone ist praktisch nie nötig.',
      'Manche Nebenstraßen sind unbefestigt oder sandig. Bei Nässe kann das für schwere Fahrzeuge relevant werden.',
      'Grundstückszufahrten sind teilweise schmal und von Hecken oder Zäunen begrenzt.',
      'Die Wege auf dem Grundstück selbst sind oft lang, besonders bei Gartenhäusern im hinteren Bereich.',
      'Anfahrt aus Berlin-Spandau in der Regel unter 30 Minuten, über die B5 oder die Falkenseer Chaussee.',
    ],
    blocks: [
      {
        h: 'Warum Hausräumungen mehr Volumen haben als erwartet',
        p: [
          'Bei einer Wohnungsräumung kennen die meisten Menschen den Inhalt ihrer Wohnung recht gut. Bei einem Haus mit Grundstück ist das anders. Was über zwanzig oder dreißig Jahre in Keller, Garage, Schuppen und Gartenhaus gelandet ist, wird bei der ersten Schätzung fast immer zu niedrig angesetzt.',
          'Typisch für Falkensee: alte Gartenmöbel, Fahrräder, Autoteile, Bauholz, Farbreste, Zaunelemente, Gewächshausreste, Reifen und Werkzeug. Vieles davon muss getrennt entsorgt werden, was zusätzlich Zeit kostet.',
        ],
      },
      {
        h: 'Was wir für eine Einschätzung brauchen',
        list: [
          'Fotos von jedem Raum im Haus, aufgenommen von der Tür aus',
          'Fotos vom Keller, auch von schwer zugänglichen Ecken',
          'Fotos von Garage, Schuppen, Gartenhaus und Gewächshaus',
          'Ein Foto vom Garten mit Blick auf abzuräumende Flächen',
          'Ein Foto der Grundstückszufahrt von der Straße aus',
          'Angabe, ob Gartenabfälle, Bauschutt oder Altreifen dabei sind',
        ],
        note: {
          title: 'Grundstücksräumung besser vor Ort einschätzen',
          text: 'Ab etwa 700 Quadratmetern Grundstück empfehlen wir eine Besichtigung. Fotos zeigen den Garten und die Nebengebäude erfahrungsgemäß deutlich harmloser, als sie sind.',
          tone: 'info',
        },
      },
      {
        h: 'Typische Anlässe in Falkensee',
        list: [
          'Hausauflösung nach einem Erbfall, häufig beauftragt von Kindern, die in Berlin oder weiter entfernt wohnen',
          'Räumung vor dem Verkauf eines Grundstücks',
          'Umzug in eine kleinere Wohnung, oft zurück nach Berlin',
          'Kellerräumung und Entsorgung von Bauresten nach einer Sanierung',
          'Abholung einzelner Möbel und Elektrogroßgeräte',
        ],
      },
    ],
    cases: [],
    focusServices: [
      'haushaltsaufloesung-berlin',
      'entruempelung-berlin',
      'umzug-berlin',
      'sperrmuellabholung-berlin',
    ],
    faq: [
      {
        q: 'Fahren Sie nach Falkensee?',
        a: 'Ja, regelmäßig. Falkensee grenzt direkt an Spandau, die Anfahrt liegt meist unter 30 Minuten. Auch kleinere Aufträge lassen sich dort gut einplanen, weil sich Termine mit Einsätzen im Berliner Westen kombinieren lassen.',
      },
      {
        q: 'Räumen Sie auch Gartenhaus und Garage mit?',
        a: 'Ja, und das sollte von Anfang an in der Anfrage stehen. Bei Grundstücken in Falkensee machen Nebengebäude regelmäßig den größeren Teil des Volumens aus. Wenn sie erst am Einsatztag auftauchen, stimmt die vorherige Einschätzung nicht mehr.',
      },
      {
        q: 'Nehmen Sie Gartenabfälle und Bauschutt mit?',
        a: 'Grünschnitt und Bauschutt werden getrennt entsorgt und gesondert berechnet, weil sie über andere Wege gehen als Sperrmüll. Bauschutt ist schwer und wird nach Gewicht abgerechnet. Sagen Sie uns bei der Anfrage, ob und wie viel davon anfällt.',
      },
      {
        q: 'Kommt der Transporter auf mein Grundstück?',
        a: 'In den meisten Fällen ja. Kritisch sind schmale Zufahrten zwischen Hecken oder Zäunen und unbefestigte Wege bei Nässe. Ein Foto der Zufahrt von der Straße aus reicht uns, um das vorher zu beurteilen.',
      },
    ],
    differentiator:
      'Reines Einfamilienhausgebiet direkt an der Stadtgrenze. Schwerpunkt auf Grundstücksräumung, Nebengebäuden und dem systematisch unterschätzten Volumen, statt auf Etagen und Halteverbotszone.',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  /* ENTWÜRFE – noindex, nicht in Sitemap, nicht verlinkt               */
  /* ================================================================== */
  draftTown('hennigsdorf', 'Hennigsdorf', 'Landkreis Oberhavel'),
  draftTown('oranienburg', 'Oranienburg', 'Landkreis Oberhavel'),
  draftTown('bernau-bei-berlin', 'Bernau bei Berlin', 'Landkreis Barnim'),
  draftTown('ahrensfelde', 'Ahrensfelde', 'Landkreis Barnim'),
  draftTown('hoppegarten', 'Hoppegarten', 'Landkreis Märkisch-Oderland'),
  draftTown('schoenefeld', 'Schönefeld', 'Landkreis Dahme-Spreewald'),
  draftTown('koenigs-wusterhausen', 'Königs Wusterhausen', 'Landkreis Dahme-Spreewald'),
  draftTown('teltow', 'Teltow', 'Landkreis Potsdam-Mittelmark'),
  draftTown('kleinmachnow', 'Kleinmachnow', 'Landkreis Potsdam-Mittelmark'),
  draftTown('ludwigsfelde', 'Ludwigsfelde', 'Landkreis Teltow-Fläming'),
];

function draftTown(slug: string, name: string, county: string): Town {
  return {
    slug,
    status: 'draft',
    name,
    county,
    h1: `Entrümpelung und Umzug in ${name}`,
    metaTitle: `Entrümpelung & Umzug ${name}`,
    metaDescription: `Entrümpelung, Auflösung und Umzug in ${name}. Diese Seite befindet sich in Vorbereitung.`,
    answer: `${name} liegt im ${county}. Diese Ortsseite wird derzeit mit ortsspezifischen Inhalten ergänzt und ist noch nicht veröffentlicht.`,
    quarters: [],
    intro: [],
    buildings: [],
    access: [],
    cases: [],
    focusServices: [],
    faq: [],
    differentiator: '',
    updated: '2026-07-29',
  };
}

export const publishedTowns = towns.filter((t) => t.status === 'published');

export function getTown(slug: string): Town | undefined {
  return towns.find((t) => t.slug === slug);
}

export const allTownNames = towns.map((t) => ({
  name: t.name,
  slug: t.slug,
  county: t.county,
  published: t.status === 'published',
}));
