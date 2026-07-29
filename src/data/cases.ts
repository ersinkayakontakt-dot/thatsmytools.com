import type { CaseStudy } from './types.ts';

/**
 * EINSATZBERICHTE ("Berliner Einsatzatlas")
 * =========================================
 *
 * REGEL: Es werden ausschließlich echte, vom Kunden freigegebene Einsätze
 * veröffentlicht. Erfundene Einsätze sind ausgeschlossen.
 *
 * Die drei Einträge unten sind MUSTER. Sie zeigen die Struktur, enthalten
 * aber bewusst keine erfundenen Zahlen, sondern Platzhalter. Sie sind
 * `real: false` und `status: 'draft'` und deshalb:
 *   - noindex
 *   - nicht in der Sitemap
 *   - auf der öffentlichen Übersicht nicht verlinkt
 * Sie sind nur über die direkte URL erreichbar und tragen oben einen
 * deutlich sichtbaren Hinweis.
 *
 * SO WIRD EIN ECHTER EINSATZBERICHT ANGELEGT:
 *   1. Schriftliche Freigabe des Kunden einholen (Formulierungsvorschlag in
 *      CONTENT-TODO.md). Ohne Freigabe keine Veröffentlichung.
 *   2. Eintrag kopieren, `real: true` setzen, alle Platzhalter durch die
 *      echten Daten ersetzen.
 *   3. Anonymisieren: keine Hausnummer, kein Name, keine erkennbaren
 *      Details auf Fotos. Straßenname nur, wenn ausdrücklich freigegeben.
 *   4. `status: 'published'` setzen. Erst dann geht die Seite online.
 *
 * Aus diesen Daten entsteht später die Auswertung je Bezirk
 * (Anzahl Einsätze, typische Volumen, häufige Kostentreiber).
 */

export const cases: CaseStudy[] = [
  {
    slug: 'muster-wohnungsaufloesung-altbau',
    status: 'draft',
    real: false,
    title: 'Musterbericht: Wohnungsauflösung im Altbau ohne Aufzug',
    metaTitle: 'Musterbericht Wohnungsauflösung Altbau',
    metaDescription: 'Strukturmuster für einen Einsatzbericht. Enthält keine echten Auftragsdaten.',
    location: 'pankow',
    locationLabel: 'Pankow',
    serviceSlug: 'wohnungsaufloesung-berlin',
    summary:
      'Musterbericht zur Darstellung der Struktur. Die Felder werden mit den Daten eines echten, freigegebenen Einsatzes gefüllt.',
    facts: {
      objectType: '[OBJEKTART, z. B. 3-Zimmer-Altbauwohnung]',
      size: '[WOHNFLÄCHE IN M²]',
      floor: '[ETAGE]',
      elevator: '[AUFZUG: ja/nein]',
      duration: '[DAUER IN STUNDEN ODER TAGEN]',
      crew: '[ANZAHL PERSONEN]',
      volume: '[VOLUMEN IN KUBIKMETERN]',
      handover: '[ART DER ÜBERGABE, z. B. besenrein an Hausverwaltung]',
      price: '[ENDPREIS ODER PREISRAHMEN – nur nach Freigabe des Kunden]',
    },
    situation: [
      '[AUSGANGSLAGE BESCHREIBEN: Wer hat beauftragt, was war der Anlass, unter welchem Zeitdruck stand der Auftrag?]',
      '[BESONDERHEITEN DES OBJEKTS: Treppenhaus, Zufahrt, Nebenräume, ungewöhnliche Gegenstände.]',
    ],
    approach: [
      { title: 'Besichtigung', text: '[WAS WURDE BEI DER BESICHTIGUNG FESTGESTELLT UND VEREINBART?]' },
      { title: 'Vorbereitung', text: '[HALTEVERBOTSZONE, TERMINABSTIMMUNG, SCHLÜSSELÜBERGABE.]' },
      { title: 'Durchführung', text: '[WIE WURDE GEARBEITET, WAS WAR AUFWENDIG, WAS GING SCHNELLER ALS ERWARTET?]' },
      { title: 'Übergabe', text: '[WIE LIEF DIE ÜBERGABE, WER HAT ABGENOMMEN?]' },
    ],
    result: ['[ERGEBNIS: Zustand bei Übergabe, Rückmeldung des Auftraggebers, eingehaltene Fristen.]'],
    learning:
      '[WAS LÄSST SICH FÜR ÄHNLICHE FÄLLE ABLEITEN? Genau dieser Absatz macht einen Einsatzbericht für andere Kundinnen und Kunden nützlich.]',
    date: '[EINSATZDATUM]',
    updated: '2026-07-29',
  },

  {
    slug: 'muster-haushaltsaufloesung-nachlass',
    status: 'draft',
    real: false,
    title: 'Musterbericht: Haushaltsauflösung nach einem Erbfall',
    metaTitle: 'Musterbericht Haushaltsauflösung Nachlass',
    metaDescription: 'Strukturmuster für einen Einsatzbericht. Enthält keine echten Auftragsdaten.',
    location: 'charlottenburg-wilmersdorf',
    locationLabel: 'Charlottenburg-Wilmersdorf',
    serviceSlug: 'nachlassaufloesung-berlin',
    summary:
      'Musterbericht zur Darstellung der Struktur bei Nachlassaufträgen. Bei echten Berichten gilt: keine Namen, keine Hausnummern, keine erkennbaren Details.',
    facts: {
      objectType: '[OBJEKTART]',
      size: '[WOHNFLÄCHE IN M²]',
      floor: '[ETAGE]',
      elevator: '[AUFZUG: ja/nein]',
      duration: '[DAUER]',
      crew: '[ANZAHL PERSONEN]',
      volume: '[VOLUMEN IN KUBIKMETERN]',
      handover: '[ART DER ÜBERGABE]',
      price: '[ENDPREIS ODER PREISRAHMEN – nur nach Freigabe]',
    },
    situation: [
      '[AUSGANGSLAGE: Auftraggeber, Entfernung zum Objekt, Zeitrahmen. Bei Nachlässen besonders zurückhaltend formulieren.]',
    ],
    approach: [
      { title: 'Erstkontakt', text: '[WIE KAM DER KONTAKT ZUSTANDE, WELCHE FRAGEN STANDEN AM ANFANG?]' },
      { title: 'Sichtung', text: '[WIE WURDE MIT DOKUMENTEN UND PERSÖNLICHEN GEGENSTÄNDEN VERFAHREN?]' },
      { title: 'Räumung', text: '[ABLAUF UND DAUER.]' },
      { title: 'Übergabe', text: '[ÜBERGABE AN VERMIETER ODER HAUSVERWALTUNG, DOKUMENTATION.]' },
    ],
    result: ['[ERGEBNIS UND RÜCKMELDUNG – nur mit Zustimmung zitieren.]'],
    learning: '[WAS SOLLTEN ANGEHÖRIGE IN EINER ÄHNLICHEN LAGE VORHER WISSEN?]',
    date: '[EINSATZDATUM]',
    updated: '2026-07-29',
  },

  {
    slug: 'muster-kellerentruempelung-hausverwaltung',
    status: 'draft',
    real: false,
    title: 'Musterbericht: Kellerentrümpelung für eine Hausverwaltung',
    metaTitle: 'Musterbericht Kellerentrümpelung Hausverwaltung',
    metaDescription: 'Strukturmuster für einen Einsatzbericht. Enthält keine echten Auftragsdaten.',
    location: 'marzahn-hellersdorf',
    locationLabel: 'Marzahn-Hellersdorf',
    serviceSlug: 'kellerentruempelung-berlin',
    summary:
      'Musterbericht für Aufträge von Hausverwaltungen. Hier sind Dokumentation und Nachvollziehbarkeit wichtiger als bei Privataufträgen.',
    facts: {
      objectType: '[OBJEKTART, z. B. Kellergeschoss mit X Abteilen]',
      size: '[ANZAHL DER ABTEILE]',
      floor: 'Untergeschoss',
      elevator: '[AUFZUG: ja/nein]',
      duration: '[DAUER]',
      crew: '[ANZAHL PERSONEN]',
      volume: '[VOLUMEN IN KUBIKMETERN]',
      handover: '[ART DER ÜBERGABE UND DOKUMENTATION]',
      price: '[ENDPREIS ODER PREISRAHMEN – nur nach Freigabe]',
    },
    situation: ['[ANLASS: z. B. Brandschutzauflage, Eigentümerwechsel, Neuvermietung.]'],
    approach: [
      { title: 'Beauftragung', text: '[WELCHE UNTERLAGEN UND FREIGABEN WAREN NÖTIG?]' },
      { title: 'Vorbereitung', text: '[ANKÜNDIGUNG AN BEWOHNER, ZUGANG, ABGRENZUNG DER ABTEILE.]' },
      { title: 'Durchführung', text: '[ABLAUF, TRENNUNG DER MATERIALIEN.]' },
      { title: 'Dokumentation', text: '[FOTODOKUMENTATION VOR UND NACH DER RÄUMUNG.]' },
    ],
    result: ['[ERGEBNIS UND ABRECHNUNG.]'],
    learning: '[WAS SOLLTEN HAUSVERWALTUNGEN VOR EINER SAMMELRÄUMUNG KLÄREN?]',
    date: '[EINSATZDATUM]',
    updated: '2026-07-29',
  },
];

/** Nur echte, freigegebene, veröffentlichte Einsätze. */
export const publishedCases = cases.filter((c) => c.status === 'published' && c.real);

/** Muster – nur im Entwicklungsmodus verlinkt. */
export const sampleCases = cases.filter((c) => !c.real);

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

export function casesForLocation(locationSlug: string): CaseStudy[] {
  return publishedCases.filter((c) => c.location === locationSlug);
}

export function casesForService(serviceSlug: string): CaseStudy[] {
  return publishedCases.filter((c) => c.serviceSlug === serviceSlug);
}
