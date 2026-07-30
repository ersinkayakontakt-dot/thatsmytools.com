import type { District } from './types.ts';
import { additionalDistricts } from './additionalDistricts.ts';

/**
 * BERLINER BEZIRKE
 * ================
 * PUBLISH GUARD: Eine Bezirksseite geht erst online, wenn sie eigenständigen
 * Mehrwert hat. Die Prüfung erfolgt automatisch in src/lib/publishGuard.ts:
 *
 *   - eigene Einleitung (mind. 2 Absätze, mind. 350 Zeichen)
 *   - mindestens 4 Ortsteile
 *   - eigene Angaben zu Gebäudesituation und Zufahrt
 *   - mindestens 3 eigene FAQ
 *   - eigener Title und eigene Meta Description
 *   - ein notierter Unterschied zu anderen Bezirksseiten
 *
 * Seiten, die das nicht erfüllen, bleiben 'draft': sie bauen als Seite,
 * sind aber noindex, nicht in der Sitemap und nirgends verlinkt.
 * Damit entstehen keine Doorway Pages.
 */

export const districts: District[] = [
  /* ================================================================== */
  {
    slug: 'pankow',
    status: 'published',
    name: 'Pankow',
    fullName: 'Berlin-Pankow',
    h1: 'Entrümpelung und Umzug in Pankow',
    metaTitle: 'Entrümpelung & Umzug Pankow: Altbau, Hinterhof, 5. Stock',
    metaDescription:
      'Entrümpelung, Auflösung und Umzug in Pankow und Prenzlauer Berg. Was Altbauten ohne Aufzug, Hinterhöfe und die Parksituation für den Aufwand bedeuten.',
    answer:
      'In Pankow arbeiten wir überwiegend in Gründerzeit-Altbauten: vier bis fünf Geschosse, oft ohne Aufzug, häufig mit Seitenflügel und Quergebäude im Hinterhof. Das bestimmt den Aufwand stärker als die Wohnungsgröße. Im Norden des Bezirks, etwa in Buch, Karow und Blankenburg, sieht es anders aus: dort dominieren Einfamilienhäuser und Siedlungsbau mit direkter Zufahrt.',
    quarters: [
      'Prenzlauer Berg',
      'Pankow',
      'Weißensee',
      'Niederschönhausen',
      'Französisch Buchholz',
      'Heinersdorf',
      'Karow',
      'Buch',
      'Blankenburg',
      'Rosenthal',
      'Wilhelmsruh',
      'Blankenfelde',
    ],
    intro: [
      'Pankow ist der einwohnerstärkste Berliner Bezirk und zerfällt für unsere Arbeit in zwei sehr unterschiedliche Hälften. Südlich, in Prenzlauer Berg und Teilen von Weißensee, stehen dicht bebaute Gründerzeitblöcke. Nördlich, in Karow, Buch und Blankenburg, überwiegen Einfamilienhäuser, Siedlungsbau und Grundstücke mit eigener Zufahrt.',
      'Für eine Einschätzung heißt das: Die Adresse sagt oft mehr über den Aufwand als die Quadratmeterzahl. Eine Dreizimmerwohnung im vierten Stock eines Seitenflügels an der Schönhauser Allee ist ein anderer Einsatz als ein gleich großes Haus in Französisch Buchholz mit Auffahrt bis an die Haustür.',
    ],
    buildings: [
      'Gründerzeit-Altbauten mit vier bis fünf Vollgeschossen, überwiegend ohne Aufzug',
      'Vorderhaus, Seitenflügel und Quergebäude um einen oder mehrere Höfe',
      'Schmale, gewendelte Treppenhäuser mit engen Podesten',
      'Dachgeschossausbauten, teils nur über eine zusätzliche Treppe erreichbar',
      'Kellerabteile mit niedrigen Durchgängen und schmalen Gängen',
      'Im Norden: Einfamilienhäuser, Doppelhäuser und Siedlungsbau mit Garage oder Carport',
      'In Buch: größere Wohnanlagen mit Aufzug und Anlieferzonen',
    ],
    access: [
      'In Prenzlauer Berg ist tagsüber fast nie ein Parkplatz vor dem Haus frei. Eine Halteverbotszone ist bei größeren Einsätzen praktisch immer sinnvoll.',
      'Viele Grundstücke sind Blockrandbebauung mit Hof. Der Weg vom Fahrzeug bis zur Wohnungstür kann 60 bis 100 Meter betragen.',
      'Hofdurchfahrten sind oft niedrig. Ob ein größerer Transporter in den Hof passt, sollte vorher geklärt werden.',
      'Poller, Fahrradbügel und Baumscheiben schränken die Haltemöglichkeiten zusätzlich ein.',
      'Nördlich von Pankow-Zentrum ist die Parksituation deutlich entspannter, dort ist eine Halteverbotszone meist verzichtbar.',
      'Rund um die Schönhauser Allee und die Prenzlauer Allee ist der Verkehr im Berufsverkehr zäh. Frühe Termine sind dort effizienter.',
    ],
    blocks: [
      {
        h: 'Warum der fünfte Stock ohne Aufzug den Preis verändert',
        p: [
          'Ein Großteil der Pankower Altbauten hat keinen Aufzug. Jeder Karton, jeder Schrankteil und jede Matratze wird über eine gewendelte Treppe getragen. Bei einer durchschnittlichen Dreizimmerwohnung kommen so schnell mehrere hundert Treppengänge zusammen.',
          'Das ist der Grund, warum wir bei jeder Anfrage nach Etage und Aufzug fragen, bevor wir über die Wohnungsgröße sprechen. Zwischen zweitem Stock mit Aufzug und viertem Stock ohne Aufzug liegen bei gleichem Volumen mehrere Arbeitsstunden.',
        ],
      },
      {
        h: 'Typische Anlässe in Pankow',
        list: [
          'Wohnungsübergaben in Prenzlauer Berg, oft mit knappem Zeitfenster zwischen Auszug und Übergabetermin',
          'Haushaltsauflösungen in Weißensee und Niederschönhausen, häufig langjährig bewohnte Wohnungen mit vollem Keller',
          'Kellerentrümpelungen für Hausverwaltungen in den großen Altbaublöcken',
          'Umzüge innerhalb des Bezirks, häufig von einer größeren in eine kleinere Wohnung',
          'Räumungen von Einfamilienhäusern im Norden, meist bei Verkauf oder Generationswechsel',
        ],
      },
    ],
    cases: [],
    focusServices: [
      'entruempelung-berlin',
      'wohnungsaufloesung-berlin',
      'kellerentruempelung-berlin',
      'umzug-berlin',
    ],
    faq: [
      {
        q: 'Brauche ich in Prenzlauer Berg eine Halteverbotszone?',
        a: 'In den meisten Straßen ja. Der Parkdruck ist tagsüber so hoch, dass ohne reservierte Fläche kein Halten vor dem Haus möglich ist. Der Zeitverlust durch lange Tragewege übersteigt die Kosten der Zone bei größeren Einsätzen fast immer. Wir sagen Ihnen bei der Besichtigung, was für Ihre Straße sinnvoll ist.',
      },
      {
        q: 'Passt ein Transporter in den Hinterhof?',
        a: 'Das hängt von der Durchfahrtshöhe ab, die in Pankower Altbauten oft unter 2,50 Metern liegt. Schicken Sie ein Foto der Durchfahrt mit, dann klären wir das vorher. Wenn es nicht passt, planen wir stattdessen eine Halteverbotszone an der Straße ein.',
      },
      {
        q: 'Räumen Sie auch Kellerabteile in den großen Altbaublöcken?',
        a: 'Ja, auch mehrere Abteile in einem Termin. Für Hausverwaltungen in Pankow ist das der übliche Weg, weil Anfahrt und Rüstzeit nur einmal anfallen. Wir brauchen eine Liste der zu räumenden Abteile und die Klärung, welche ausdrücklich nicht angefasst werden dürfen.',
      },
      {
        q: 'Arbeiten Sie auch im Norden des Bezirks, etwa in Buch oder Blankenburg?',
        a: 'Ja. Dort ist die Situation für uns einfacher: eigene Zufahrt, meist ebenerdiger Zugang oder Aufzug, kein Parkproblem. Bei Einfamilienhäusern kommt dafür oft mehr Volumen zusammen, weil Garage, Schuppen, Dachboden und Garten dazugehören.',
      },
    ],
    differentiator:
      'Zweiteilung des Bezirks: dichte Gründerzeitbebauung im Süden gegen Siedlungs- und Einfamilienhausstruktur im Norden. Schwerpunkt auf Treppenhaus, Hinterhof und Halteverbotszone.',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'marzahn-hellersdorf',
    status: 'published',
    name: 'Marzahn-Hellersdorf',
    fullName: 'Berlin-Marzahn-Hellersdorf',
    h1: 'Entrümpelung und Umzug in Marzahn-Hellersdorf',
    metaTitle: 'Entrümpelung & Umzug Marzahn-Hellersdorf | Plattenbau',
    metaDescription:
      'Entrümpelung, Auflösung und Umzug in Marzahn-Hellersdorf. Was Plattenbauten mit Aufzug, Anlieferzonen und die Siedlungsgebiete in Mahlsdorf bedeuten.',
    answer:
      'In Marzahn-Hellersdorf arbeiten wir überwiegend in Plattenbauten mit Aufzug. Das macht Räumungen und Umzüge planbarer als in der Innenstadt: kurze Wege vom Fahrzeug zum Hauseingang, ausreichend Parkfläche und Aufzüge, die auch größere Möbelteile aufnehmen. Anders sieht es in Mahlsdorf und Kaulsdorf aus, wo Einfamilienhäuser mit Garten, Garage und Nebengebäuden überwiegen.',
    quarters: ['Marzahn', 'Hellersdorf', 'Biesdorf', 'Kaulsdorf', 'Mahlsdorf'],
    intro: [
      'Marzahn-Hellersdorf ist für unsere Arbeit der Gegenentwurf zur Innenstadt. In den großen Wohnanlagen in Marzahn und Hellersdorf gibt es fast überall Aufzüge, breite Hauseingänge und Flächen, auf denen ein Transporter tatsächlich halten kann. Einsätze lassen sich dort zuverlässiger kalkulieren als in Altbaugebieten.',
      'Der östliche Teil des Bezirks ist völlig anders gebaut. Mahlsdorf und Kaulsdorf sind Einfamilienhausgebiete mit großen Grundstücken. Dort ist der Zugang einfach, das Volumen dafür oft deutlich höher als erwartet, weil Keller, Dachboden, Garage, Schuppen und Garten zusammenkommen.',
    ],
    buildings: [
      'Plattenbauten in Zeilen- und Punkthausform, meist fünf bis elf Geschosse mit Aufzug',
      'Standardisierte Wohnungsgrundrisse, dadurch gut einschätzbare Volumen',
      'Kellerabteile in großen Kellergeschossen, oft mit langen Gängen',
      'Große Wohnungsbaugesellschaften und Genossenschaften als Verwalter',
      'In Biesdorf: gemischte Struktur aus Geschossbau und Einfamilienhäusern',
      'In Mahlsdorf und Kaulsdorf: Einfamilienhäuser mit Garage, Schuppen und Garten',
    ],
    access: [
      'Vor den meisten Wohnhäusern sind Anlieferflächen oder ausreichend Parkraum vorhanden. Eine Halteverbotszone ist selten nötig.',
      'Aufzüge sind in den Geschossbauten Standard. Sehr sperrige Teile wie Schrankwände müssen trotzdem manchmal zerlegt werden.',
      'Kellergänge sind lang. Der Weg vom Kellerabteil zum Hausausgang kann 40 bis 60 Meter betragen.',
      'Bei Wohnungsbaugesellschaften ist der Zugang zum Keller oft nur nach Anmeldung möglich.',
      'In Mahlsdorf und Kaulsdorf ist die Zufahrt bis ans Haus in der Regel möglich, teils über unbefestigte Wege.',
      'Die Anbindung über die B1/B5 und die Märkische Allee ist gut, Einsätze am Stadtrand sind zeitlich planbar.',
    ],
    blocks: [
      {
        h: 'Was ein Aufzug beim Preis ausmacht',
        p: [
          'Der Unterschied zwischen einer Räumung im achten Stock mit Aufzug und im vierten Stock ohne Aufzug fällt fast immer zugunsten des Aufzugs aus. Entscheidend ist nicht die Höhe, sondern ob getragen werden muss.',
          'Was in Plattenbauten trotzdem Zeit kostet: Der Aufzug fasst nur eine begrenzte Menge pro Fahrt und wird auch von anderen Bewohnern genutzt. Bei einer kompletten Wohnungsauflösung summieren sich die Wartezeiten. Deshalb planen wir bei größeren Einsätzen einen zweiten Weg über das Treppenhaus mit ein.',
        ],
      },
      {
        h: 'Zusammenarbeit mit Wohnungsbaugesellschaften',
        p: [
          'Ein großer Teil des Wohnungsbestands im Bezirk wird von Wohnungsbaugesellschaften und Genossenschaften verwaltet. Für Räumungen bedeutet das feste Abläufe: schriftliche Beauftragung, angemeldeter Zugang, dokumentierte Übergabe.',
          'Wir liefern auf Wunsch eine Fotodokumentation vor und nach der Räumung sowie eine Rechnung mit einzeln ausgewiesenen Positionen, die sich intern weiterverarbeiten lässt.',
        ],
      },
      {
        h: 'Einfamilienhäuser in Mahlsdorf und Kaulsdorf',
        p: [
          'Bei Hausräumungen im östlichen Bezirksteil wird das Volumen regelmäßig unterschätzt. Ein Einfamilienhaus mit Keller, Dachboden, Garage, Gartenhaus und Terrasse enthält oft ein Vielfaches dessen, was eine gleich große Wohnung fasst.',
          'Für eine belastbare Einschätzung brauchen wir Fotos von allen Nebengebäuden und vom Garten. Alte Gartenmöbel, Zäune, Bauholz und Reifen kommen fast immer dazu.',
        ],
      },
    ],
    cases: [],
    focusServices: [
      'entruempelung-berlin',
      'haushaltsaufloesung-berlin',
      'kellerentruempelung-berlin',
      'umzug-berlin',
    ],
    faq: [
      {
        q: 'Ist eine Halteverbotszone in Marzahn nötig?',
        a: 'Meistens nicht. Vor den Wohnanlagen gibt es in der Regel genug Parkfläche oder ausgewiesene Anlieferbereiche. Wir schauen uns die Adresse vorher an. In Mahlsdorf und Kaulsdorf ist die Zufahrt bis ans Grundstück fast immer möglich.',
      },
      {
        q: 'Arbeiten Sie mit Wohnungsbaugesellschaften zusammen?',
        a: 'Ja. Wir brauchen dafür eine schriftliche Beauftragung, die Klärung des Zugangs und eine Absprache zur Dokumentation. Auf Wunsch liefern wir Fotos vor und nach der Räumung sowie eine positionsweise aufgeschlüsselte Rechnung.',
      },
      {
        q: 'Passen Schrankwände in den Aufzug?',
        a: 'Meistens nur zerlegt. Die Aufzüge in Plattenbauten sind für Personen ausgelegt, nicht für Möbel in voller Länge. Wir demontieren vor Ort, was nicht hineinpasst. Bei sehr großen Einsätzen nutzen wir zusätzlich das Treppenhaus, um die Wartezeiten am Aufzug zu verkürzen.',
      },
      {
        q: 'Räumen Sie auch Grundstücke mit Gartenhaus und Garage?',
        a: 'Ja, das ist in Mahlsdorf und Kaulsdorf der Normalfall. Wichtig ist, dass Nebengebäude und Garten von Anfang an in der Anfrage stehen. Sie machen bei Hausräumungen oft den größeren Teil des Volumens aus und werden bei der ersten Schätzung häufig vergessen.',
      },
    ],
    differentiator:
      'Plattenbau mit Aufzug und guter Anfahrt gegenüber Einfamilienhausgebieten im Osten. Schwerpunkt auf Aufzugslogistik, Wohnungsbaugesellschaften und unterschätztem Volumen bei Hausräumungen.',
    updated: '2026-07-29',
  },

  /* ================================================================== */
  {
    slug: 'charlottenburg-wilmersdorf',
    status: 'published',
    name: 'Charlottenburg-Wilmersdorf',
    fullName: 'Berlin-Charlottenburg-Wilmersdorf',
    h1: 'Entrümpelung und Umzug in Charlottenburg-Wilmersdorf',
    metaTitle: 'Entrümpelung & Umzug Charlottenburg-Wilmersdorf',
    metaDescription:
      'Entrümpelung, Haushaltsauflösung und Umzug in Charlottenburg-Wilmersdorf. Große Altbauwohnungen, Seniorenhaushalte und was bei Nachlässen zu beachten ist.',
    answer:
      'In Charlottenburg-Wilmersdorf haben wir es überwiegend mit großen Altbauwohnungen zu tun, oft über 100 Quadratmeter, häufig lange von derselben Person bewohnt. Der Schwerpunkt liegt deshalb auf Haushaltsauflösungen und Nachlässen. Die Wohnungen enthalten viel, die Sichtung dauert länger als das Tragen, und ein Teil des Inhalts ist verwertbar.',
    quarters: [
      'Charlottenburg',
      'Wilmersdorf',
      'Westend',
      'Schmargendorf',
      'Grunewald',
      'Halensee',
      'Charlottenburg-Nord',
    ],
    intro: [
      'Charlottenburg-Wilmersdorf unterscheidet sich von anderen Berliner Altbaugebieten durch die Größe der Wohnungen. Rund um den Kurfürstendamm, in Wilmersdorf und in Schmargendorf sind Wohnungen mit fünf oder sechs Zimmern keine Ausnahme. Viele davon werden seit Jahrzehnten von denselben Menschen bewohnt.',
      'Für unsere Arbeit bedeutet das einen anderen Schwerpunkt als etwa in Friedrichshain. Es geht seltener um schnelle Umzüge und häufiger um Haushaltsauflösungen, Nachlässe und den Umzug in eine kleinere Wohnung oder ins betreute Wohnen. Der Aufwand steckt in diesen Fällen im Sortieren, nicht im Transport.',
    ],
    buildings: [
      'Große Altbauwohnungen mit hohen Decken, oft 100 bis 180 Quadratmeter',
      'Repräsentative Treppenhäuser, teils mit historischem Personenaufzug geringer Tragfähigkeit',
      'Zusätzliche Mädchenkammern, Speisekammern und Nebenräume mit eigenem Zugang',
      'Große Kellerabteile, häufig über Jahrzehnte gefüllt',
      'In Westend, Grunewald und Schmargendorf: Villen und Stadthäuser mit Garten und Garage',
      'In Charlottenburg-Nord: Zeilenbau der Nachkriegszeit mit einfacherer Zufahrt',
    ],
    access: [
      'Historische Aufzüge sind oft vorhanden, haben aber eine geringe Tragfähigkeit und wenig Grundfläche. Für Möbel sind sie meist nicht nutzbar.',
      'Parkraum ist knapp und in weiten Teilen bewirtschaftet. Bei größeren Einsätzen ist eine Halteverbotszone Standard.',
      'Rund um Kurfürstendamm und Bundesallee ist der Verkehr dicht. Frühe Termine sparen deutlich Zeit.',
      'Viele Häuser haben getrennte Vorder- und Hintereingänge. Welcher genutzt werden darf, klärt die Hausverwaltung.',
      'In Grunewald und Westend ist die Zufahrt bis ans Grundstück meist möglich, die Wege auf dem Grundstück sind dafür lang.',
    ],
    blocks: [
      {
        h: 'Warum große Altbauwohnungen mehr Sortierzeit brauchen',
        p: [
          'Bei einer langjährig bewohnten Sechszimmerwohnung ist nicht das Volumen das Problem, sondern die Entscheidung, was damit geschieht. Bücher, Porzellan, Bilder, Teppiche und Möbel aus mehreren Jahrzehnten müssen gesichtet werden, bevor irgendetwas bewegt wird.',
          'Wir planen bei solchen Aufträgen deshalb einen längeren Besichtigungstermin und rechnen mit mehreren Einsatztagen. Eine Einschätzung allein anhand von Fotos ist in diesen Fällen selten belastbar.',
        ],
      },
      {
        h: 'Wenn Wertgegenstände im Spiel sind',
        p: [
          'In Charlottenburg-Wilmersdorf kommt es häufiger als anderswo vor, dass Kunst, Antiquitäten, Sammlungen oder Musikinstrumente Teil eines Haushalts sind. Eine Haushaltsauflösung ist nicht der richtige Rahmen, um deren Wert zu bestimmen.',
          'Unsere Empfehlung: Lassen Sie solche Stücke vor der Auflösung gesondert bewerten, unabhängig von dem Betrieb, der die Räumung durchführt. Wir sagen Ihnen bei der Besichtigung, was uns auffällt, aber wir sind keine Sachverständigen und geben uns auch nicht als solche aus.',
        ],
        note: {
          title: 'Getrennte Bewertung ist im Interesse beider Seiten',
          text: 'Wenn derselbe Betrieb den Wert schätzt und die Sachen mitnimmt, entsteht ein Interessenkonflikt. Eine unabhängige Bewertung schützt Sie und macht die Zusammenarbeit klarer.',
          tone: 'caution',
        },
      },
      {
        h: 'Typische Anlässe im Bezirk',
        list: [
          'Haushaltsauflösungen nach einem Umzug ins betreute Wohnen oder ins Pflegeheim',
          'Nachlassauflösungen, häufig beauftragt von Angehörigen außerhalb Berlins',
          'Seniorenumzüge von einer großen Altbauwohnung in eine kleinere Wohnung',
          'Kellerentrümpelungen in Häusern mit über Jahrzehnte gefüllten Abteilen',
          'Büroauflösungen in den Gewerbelagen rund um Kurfürstendamm und Bismarckstraße',
        ],
      },
    ],
    cases: [],
    focusServices: [
      'haushaltsaufloesung-berlin',
      'nachlassaufloesung-berlin',
      'seniorenumzug-berlin',
      'entruempelung-berlin',
    ],
    faq: [
      {
        q: 'Kann ich den alten Aufzug für den Umzug nutzen?',
        a: 'Historische Aufzüge in Charlottenburger Altbauten haben oft eine Tragfähigkeit von 200 bis 300 Kilogramm und eine sehr kleine Grundfläche. Für Kartons ist das nutzbar, für Möbel in der Regel nicht. Wir planen deshalb grundsätzlich mit dem Treppenhaus und nutzen den Aufzug nur ergänzend.',
      },
      {
        q: 'Wie lange dauert die Auflösung einer großen Altbauwohnung?',
        a: 'Bei 120 bis 180 Quadratmetern mit Keller rechnen wir in der Regel mit zwei bis drei Einsatztagen, teilweise mehr. Entscheidend ist der Sortieraufwand, nicht die Fläche. Nach der Besichtigung können wir das konkret sagen, vorher wäre jede Zahl geraten.',
      },
      {
        q: 'Wir wohnen nicht in Berlin. Können Sie alles übernehmen?',
        a: 'Ja, das ist bei Nachlässen in diesem Bezirk der Regelfall. Wir organisieren die Schlüsselübergabe, führen die Besichtigung durch und schicken Fotos, damit Sie mitentscheiden können. Mit Vollmacht übernehmen wir auch die Übergabe an die Hausverwaltung und dokumentieren sie.',
      },
      {
        q: 'Bewerten Sie Antiquitäten und Kunst?',
        a: 'Nein. Wir sind keine Sachverständigen und geben keine Wertgutachten ab. Wenn uns bei der Besichtigung etwas auffällt, sagen wir es Ihnen und empfehlen eine unabhängige Bewertung vor der Auflösung. Was wir anrechnen können, benennen wir konkret und weisen es auf der Rechnung aus.',
      },
    ],
    differentiator:
      'Großer Wohnungsbestand mit langer Wohndauer, dadurch Schwerpunkt auf Haushaltsauflösung, Nachlass und Seniorenumzug statt auf schnellen Umzügen. Eigener Abschnitt zum Umgang mit möglichen Wertgegenständen und zum historischen Aufzug.',
    updated: '2026-07-29',
  },

  ...additionalDistricts,
];

export const publishedDistricts = districts.filter((d) => d.status === 'published');

export function getDistrict(slug: string): District | undefined {
  return districts.find((d) => d.slug === slug);
}

/** Alle zwölf Bezirke für die Einsatzgebiets-Übersicht (auch nicht veröffentlichte). */
export const allDistrictNames = districts.map((d) => ({
  name: d.name,
  slug: d.slug,
  published: d.status === 'published',
}));
