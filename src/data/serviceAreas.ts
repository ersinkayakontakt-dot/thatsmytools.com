/**
 * EINSATZGEBIETE NACH POSTLEITZAHL
 * ================================
 * Eine Quelle für die Frage „Fahren wir da hin?". Verbraucher sind die
 * Formularprüfung, die Einsatzgebietsseite, die Standortauswahl und die
 * strukturierten Daten. Keine Seite zieht ihren Inhalt aus dieser Datei.
 *
 * **KEINE EIGENE SEITE JE POSTLEITZAHL.** Postleitzahlen dienen der
 * Verfügbarkeitsprüfung, nicht der Seitenerzeugung. 190 PLZ-Seiten wären
 * genau die Doorway-Page-Konstruktion, die der Publish Guard an anderer
 * Stelle verhindert.
 *
 * SO WIRD DIE DATEI AKTIVIERT (siehe CONTENT-TODO.md Abschnitt 0, Punkt 3):
 *   1. Amtliche PLZ-Liste beschaffen. `dataSource` unten ausfüllen –
 *      Herausgeber, URL, Abrufdatum. Ohne Herkunftsnachweis keine Daten.
 *   2. Je PLZ `districts` aus der amtlichen Zuordnung eintragen.
 *      Mehrzahl ist Absicht, siehe „Warum districts ein Array ist".
 *   3. **Betriebliche Entscheidung einholen:** `service` und `priority`
 *      je Gebiet. Das kann niemand aus Daten ableiten – es ist die
 *      Antwort auf „Wohin fahren wir tatsächlich, und bis wohin?".
 *   4. `plzDataAvailable` auf true setzen.
 *
 * Solange der Schalter auf false steht, antwortet `getServiceLevel()` mit
 * 'unbekannt'. Das Formular nimmt die Anfrage dann normal an und die
 * Einschätzung erfolgt wie bisher von Hand. Es wird an keiner Stelle
 * behauptet, ein Gebiet werde bedient oder nicht bedient.
 */

/* ------------------------------------------------------------------ */
/* Schalter                                                            */
/* ------------------------------------------------------------------ */

/**
 * Erst true, wenn `serviceAreas` aus einer amtlichen Quelle befüllt UND
 * `service`/`priority` betrieblich entschieden sind. Gekoppelt an
 * `dataSource`: ohne belegte Herkunft bleibt der Schalter aus.
 *
 * Gleiches Muster wie `priceDataAvailable` in `costs.ts`.
 */
export const plzDataAvailable = false;

/**
 * Herkunft der PLZ-Zuordnung. Wird auf der Einsatzgebietsseite sichtbar
 * ausgewiesen, damit die Angabe überprüfbar bleibt.
 * Gleiche Form wie `sources` bei Ratgebern in `types.ts`.
 */
export const dataSource: {
  label: string;
  url: string;
  publisher: string;
  checked: string;
} | null = null;

/** Letzte redaktionelle Überarbeitung dieser Datei. */
export const updated = '2026-09-24';

/* ------------------------------------------------------------------ */
/* Modell                                                              */
/* ------------------------------------------------------------------ */

/**
 * Bedienstatus eines Gebiets.
 *
 * Fasst zwei Angaben zusammen, die in der Aufgabenbeschreibung getrennt
 * standen (`bedient` als Ja/Nein plus `umlandpruefungNoetig` als Flag).
 * Getrennt wären vier Kombinationen möglich, von denen zwei keinen Sinn
 * ergeben („nicht bedient, aber Prüfung nötig"). Ein Aufzählungstyp mit
 * drei Werten lässt die sinnlosen Zustände gar nicht erst entstehen.
 */
export type ServiceLevel =
  /** Regelmäßiges Einsatzgebiet. Anfrage wird normal eingeplant. */
  | 'regulaer'
  /** Erreichbar, aber Anfahrt und Termin werden vorher geprüft. */
  | 'nach-pruefung'
  /** Wird nicht angefahren. Die Anfrage wird trotzdem angenommen und beantwortet. */
  | 'nicht-bedient';

/** Antwort von `getServiceLevel()`, wenn keine Datengrundlage vorliegt. */
export type ServiceLevelAnswer = ServiceLevel | 'unbekannt';

export interface ServiceArea {
  /** Exakt fünf Ziffern, als Zeichenkette – führende Null bleibt erhalten. */
  plz: string;
  /** Postalischer Ort, z. B. 'Berlin', 'Potsdam', 'Teltow'. */
  city: string;
  /**
   * Bezirks- oder Ortsslugs, die dieses PLZ-Gebiet berührt.
   *
   * WARUM EIN ARRAY, NICHT EIN EINZELWERT:
   * Postleitzahlgebiete folgen Zustellrouten, nicht Verwaltungsgrenzen.
   * In Berlin überschreitet ein erheblicher Teil der PLZ die Bezirksgrenze.
   * Ein Einzelwert würde jede solche PLZ still falsch zuordnen, und die
   * Prüfung auf „widersprüchliche Bezirkszuordnung" würde die Realität
   * als Fehler melden statt echte Tippfehler.
   *
   * Muss mindestens einen Eintrag haben. Jeder Slug muss in `districts.ts`
   * oder `towns.ts` existieren – `validateServiceAreas()` prüft das.
   */
  districts: string[];
  /**
   * Der Slug mit dem größten Flächenanteil. Für Anzeige und Standortlink,
   * wenn genau ein Bezirk genannt werden muss. Muss in `districts` enthalten sein.
   */
  primaryDistrict: string;
  /** Ortsteile innerhalb dieses PLZ-Gebiets. Darf leer sein. */
  quarters: string[];
  /** Betriebliche Entscheidung, nicht aus Daten ableitbar. */
  service: ServiceLevel;
  /**
   * Priorität für Tourenplanung und interne Verlinkung.
   * 1 = Schwerpunkt, 3 = Randgebiet. `null`, solange nicht entschieden.
   */
  priority: 1 | 2 | 3 | null;
  /** Redaktionelle Notiz, z. B. warum ein Gebiet nur nach Prüfung bedient wird. */
  note?: string;
}

/* ------------------------------------------------------------------ */
/* Daten                                                               */
/* ------------------------------------------------------------------ */

/**
 * Leer, bis die amtliche Liste vorliegt und die Einsatzgebiete entschieden
 * sind. Bewusst keine Beispielzeilen: Ein Platzhalter-Datensatz in einer
 * Datei, die über „fahren wir da hin" entscheidet, wird früher oder später
 * für echt gehalten.
 *
 * Form einer Zeile:
 *
 *   {
 *     plz: '10961',
 *     city: 'Berlin',
 *     districts: ['friedrichshain-kreuzberg', 'tempelhof-schoeneberg'],
 *     primaryDistrict: 'friedrichshain-kreuzberg',
 *     quarters: ['Kreuzberg'],
 *     service: 'regulaer',
 *     priority: 1,
 *   }
 */
export const serviceAreas: ServiceArea[] = [];

/* ------------------------------------------------------------------ */
/* Formatprüfung                                                       */
/* ------------------------------------------------------------------ */

/**
 * Berliner PLZ-Spanne. Untere und obere Grenze des zusammenhängenden
 * Bereichs, den Berlin belegt.
 *
 * ACHTUNG, GRENZE DER AUSSAGE: Das ist eine FORMATPRÜFUNG, keine
 * Bedienaussage. Nicht jede Zahl in dieser Spanne ist eine vergebene
 * Berliner PLZ, und „liegt in Berlin" heißt nicht „wird angefahren".
 * Für die Bedienfrage ausschließlich `getServiceLevel()` verwenden.
 */
export const BERLIN_PLZ_MIN = 10115;
export const BERLIN_PLZ_MAX = 14199;

/**
 * Das Muster einer deutschen Postleitzahl – fünf Ziffern, nichts sonst.
 *
 * Bewusst als Zeichenkette ohne Anker: So lässt es sich zugleich als
 * `pattern`-Attribut im HTML verwenden (dort sind Anker implizit) und im
 * Skript zu einer verankerten RegExp zusammensetzen. Vorher stand dasselbe
 * Muster an drei Stellen – im HTML, im Client-Skript und hier. Drei
 * Stellen laufen irgendwann auseinander.
 */
export const PLZ_PATTERN = '[0-9]{5}';

const PLZ_RE = new RegExp('^' + PLZ_PATTERN + '$');

/** Fünf Ziffern, nichts sonst. */
export function isPlzFormat(value: string): boolean {
  return PLZ_RE.test(value.trim());
}

/**
 * Liegt die PLZ im Berliner Nummernbereich?
 * Formataussage – siehe Warnung bei `BERLIN_PLZ_MIN`.
 */
export function isBerlinPlzRange(value: string): boolean {
  if (!isPlzFormat(value)) return false;
  const n = Number(value.trim());
  return n >= BERLIN_PLZ_MIN && n <= BERLIN_PLZ_MAX;
}

/* ------------------------------------------------------------------ */
/* Abfragen                                                            */
/* ------------------------------------------------------------------ */

/** Findet das Gebiet zu einer PLZ. `undefined`, wenn nicht erfasst. */
export function findServiceArea(value: string): ServiceArea | undefined {
  if (!isPlzFormat(value)) return undefined;
  const plz = value.trim();
  return serviceAreas.find((area) => area.plz === plz);
}

/**
 * Die eigentliche Frage: Fahren wir da hin?
 *
 * Gibt 'unbekannt' zurück, solange `plzDataAvailable` false ist oder die
 * PLZ nicht erfasst ist. 'unbekannt' ist ein gültiger Zustand, kein
 * Fehler – die Einschätzung erfolgt dann wie bisher von Hand. Aufrufer
 * müssen diesen Fall behandeln und dürfen ihn nicht auf 'nicht-bedient'
 * abbilden: Eine Anfrage abzuweisen, weil eine Tabelle unvollständig ist,
 * wäre schlechter als gar keine Prüfung.
 */
export function getServiceLevel(value: string): ServiceLevelAnswer {
  if (!plzDataAvailable) return 'unbekannt';
  return findServiceArea(value)?.service ?? 'unbekannt';
}

/** Alle erfassten Gebiete eines Bezirks oder Orts, auch die überlappenden. */
export function getAreasByDistrict(slug: string): ServiceArea[] {
  return serviceAreas.filter((area) => area.districts.includes(slug));
}

/** Alle PLZ eines Bezirks oder Orts, aufsteigend sortiert. */
export function getPlzByDistrict(slug: string): string[] {
  return getAreasByDistrict(slug)
    .map((area) => area.plz)
    .sort();
}

/** Gebiete nach Bedienstatus, z. B. für die Einsatzgebietsseite. */
export function getAreasByServiceLevel(level: ServiceLevel): ServiceArea[] {
  return serviceAreas.filter((area) => area.service === level);
}

/**
 * Kompakte PLZ-zu-Status-Zuordnung für das Anfrageformular.
 *
 * Das Formularskript läuft als `is:inline` und kann deshalb nichts
 * importieren – es bekommt seine Daten über `define:vars`. Diese Funktion
 * liefert genau das Nötige: Postleitzahl und Status, keine Ortsteile,
 * keine Bezirke, keine Notizen. Bei 190 Berliner PLZ sind das rund zwei
 * Kilobyte vor der Komprimierung.
 *
 * Die Regel „ohne Datengrundlage keine Aussage" steckt hier und nicht im
 * Formular: Steht `plzDataAvailable` auf false, ist die Zuordnung leer und
 * das Formular zeigt nichts an. So gibt es nur eine Stelle, an der dieser
 * Zustand entschieden wird.
 */
export function serviceLevelMap(): Record<string, ServiceLevel> {
  if (!plzDataAvailable) return {};
  return Object.fromEntries(serviceAreas.map((area) => [area.plz, area.service]));
}

/* ------------------------------------------------------------------ */
/* Prüfung für den Content-Audit                                       */
/* ------------------------------------------------------------------ */

export interface ServiceAreaAudit {
  /** Blockiert die Veröffentlichung. */
  errors: string[];
  /** Braucht eine redaktionelle Entscheidung, blockiert aber nicht. */
  warnings: string[];
}

/**
 * Ersetzt die Modulwerte – ausschließlich für die Selbstprüfung.
 *
 * Ohne diese Einschleusung ließe sich die Prüffunktion nicht gegen
 * Gegenbeispiele laufen lassen: Sie läse immer die echte, leere Tabelle
 * und meldete immer „in Ordnung". Eine Regel, die ihr eigenes
 * Gegenbeispiel nie zu sehen bekommt, prüft nichts.
 */
export interface ServiceAreaInput {
  areas?: ServiceArea[];
  available?: boolean;
  source?: typeof dataSource;
}

/**
 * Prüft die Tabelle gegen sich selbst und gegen die Standortdaten.
 *
 * Die bekannten Slugs werden übergeben, statt `districts.ts` und
 * `towns.ts` hier zu importieren. Sonst zöge jede Seite, die nur die
 * PLZ-Prüfung braucht, den gesamten Standortinhalt mit in das Bündel.
 *
 * Aufruf aus `scripts/content-audit.mjs` – der dritte Parameter bleibt
 * dort weg, dann gelten die Modulwerte:
 *
 *   const plzAudit = validateServiceAreas(
 *     districts.map((d) => d.slug),
 *     towns.map((t) => t.slug),
 *   );
 *   errors.push(...plzAudit.errors);
 *   notes.push(...plzAudit.warnings);
 *
 * Gegenbeispiele stehen in `scripts/service-areas-selftest.mjs`.
 */
export function validateServiceAreas(
  knownDistrictSlugs: string[],
  knownTownSlugs: string[],
  input: ServiceAreaInput = {},
): ServiceAreaAudit {
  /*
   * Abfrage über `in`, nicht über `??`: Ein Test muss `available: false`
   * und `source: null` ausdrücklich setzen können. Mit `??` fiele beides
   * auf den Modulwert zurück, und der Fall wäre nicht prüfbar.
   */
  const areas = 'areas' in input ? (input.areas ?? []) : serviceAreas;
  const available = 'available' in input ? Boolean(input.available) : plzDataAvailable;
  const source = 'source' in input ? (input.source ?? null) : dataSource;

  const errors: string[] = [];
  const warnings: string[] = [];
  const known = new Set([...knownDistrictSlugs, ...knownTownSlugs]);

  /* Der Schalter darf nicht ohne Datengrundlage anstehen. */
  if (available && areas.length === 0) {
    errors.push('serviceAreas: plzDataAvailable ist true, aber die Tabelle ist leer.');
  }
  if (available && !source) {
    errors.push(
      'serviceAreas: plzDataAvailable ist true, aber dataSource fehlt. ' +
        'PLZ-Zuordnungen brauchen eine belegte amtliche Quelle.',
    );
  }
  if (!available && areas.length > 0) {
    warnings.push(
      `serviceAreas: ${areas.length} ${areas.length === 1 ? 'Gebiet' : 'Gebiete'} erfasst, ` +
        'aber plzDataAvailable steht auf false. ' +
        'Die Daten wirken nirgends. Schalter setzen oder Grund notieren.',
    );
  }

  const seen = new Map<string, number>();

  for (const area of areas) {
    const at = `serviceAreas[${area.plz || '?'}]`;

    /* Format */
    if (!isPlzFormat(area.plz)) {
      errors.push(`${at}: keine gültige fünfstellige Postleitzahl.`);
    }

    /* Dubletten */
    seen.set(area.plz, (seen.get(area.plz) ?? 0) + 1);

    /* Bezirkszuordnung */
    if (area.districts.length === 0) {
      errors.push(`${at}: kein Bezirks- oder Ortsslug zugeordnet.`);
    }
    for (const slug of area.districts) {
      if (!known.has(slug)) {
        errors.push(`${at}: Slug '${slug}' existiert weder in districts.ts noch in towns.ts.`);
      }
    }
    if (!area.districts.includes(area.primaryDistrict)) {
      errors.push(
        `${at}: primaryDistrict '${area.primaryDistrict}' ist nicht in districts aufgeführt.`,
      );
    }

    /* Plausibilität Ort gegen Nummernbereich */
    if (area.city === 'Berlin' && !isBerlinPlzRange(area.plz)) {
      errors.push(`${at}: als Berlin geführt, liegt aber außerhalb von ${BERLIN_PLZ_MIN}–${BERLIN_PLZ_MAX}.`);
    }
    if (area.city !== 'Berlin' && isBerlinPlzRange(area.plz)) {
      warnings.push(
        `${at}: Ort '${area.city}', aber die PLZ liegt im Berliner Bereich. ` +
          'Bei Randlagen möglich – gegen die amtliche Quelle prüfen.',
      );
    }

    /* Betriebliche Entscheidung */
    if (area.service !== 'nicht-bedient' && area.priority === null) {
      warnings.push(`${at}: wird bedient, aber ohne Priorität. Für die Tourenplanung nachtragen.`);
    }
    if (area.service === 'nach-pruefung' && !area.note?.trim()) {
      warnings.push(`${at}: 'nach-pruefung' ohne Notiz. Was genau wird geprüft?`);
    }
  }

  for (const [plz, count] of seen) {
    if (count > 1) errors.push(`serviceAreas: PLZ ${plz} ist ${count}-mal erfasst.`);
  }

  /* Lücken: veröffentlichte Standorte ohne jede PLZ */
  if (available) {
    const covered = new Set(areas.flatMap((area) => area.districts));
    for (const slug of knownDistrictSlugs) {
      if (!covered.has(slug)) {
        errors.push(`serviceAreas: Bezirk '${slug}' hat keine einzige Postleitzahl.`);
      }
    }
    for (const slug of knownTownSlugs) {
      if (!covered.has(slug)) {
        warnings.push(`serviceAreas: Ort '${slug}' hat keine Postleitzahl. Entwurf ohne Gebiet?`);
      }
    }
  }

  return { errors, warnings };
}
