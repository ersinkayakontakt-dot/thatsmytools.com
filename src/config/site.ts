/**
 * ZENTRALE UNTERNEHMENS- UND ENTITY-KONFIGURATION
 * ===============================================
 *
 * Diese Datei ist die EINZIGE Quelle für Unternehmensdaten.
 * Sie wird verwendet von:
 *   - Header, Footer, Kontaktseite, Impressum
 *   - allen JSON-LD-Bausteinen (Organization, LocalBusiness, MovingCompany, …)
 *   - allen Telefon-, WhatsApp- und E-Mail-Links
 *   - der Analytics-Konfiguration
 *
 * REGEL: Nichts hier darf erfunden sein.
 * Unbekannte Werte bleiben als Platzhalter in eckigen Klammern stehen:
 *   "[ECHTE ADRESSE EINTRAGEN]"
 *
 * Platzhalter werden von `isPlaceholder()` erkannt. Komponenten und
 * strukturierte Daten blenden Platzhalter-Werte automatisch aus bzw.
 * markieren sie im Entwicklungsmodus sichtbar.
 *
 * Siehe CONTENT-TODO.md für die vollständige Liste der offenen Angaben.
 */

/** Erkennt Platzhalter der Form "[…]". */
export function isPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const v = value.trim();
  return v.startsWith('[') && v.endsWith(']');
}

/** Gibt den Wert zurück – oder undefined, wenn es ein Platzhalter ist. */
export function realValue(value: string | undefined | null): string | undefined {
  return isPlaceholder(value) ? undefined : (value as string).trim();
}

/** Reduziert eine Telefonnummer auf die tel:-Form (+49…). */
export function telHref(phone: string): string {
  const real = realValue(phone);
  if (!real) return '';
  const digits = real.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}

/** Baut einen wa.me-Link mit vorbereitetem Text. */
export function whatsappHref(phone: string, text?: string): string {
  const real = realValue(phone);
  if (!real) return '';
  const digits = real.replace(/[^\d]/g, '').replace(/^0/, '49');
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${q}`;
}

export const site = {
  /* ------------------------------------------------------------------ */
  /* Identität                                                           */
  /* ------------------------------------------------------------------ */

  /** Marken-/Anzeigename. Muss überall identisch sein (NAP-Konsistenz). */
  name: 'Schnellhelfer24',

  /** Vollständige Firmierung laut Handelsregister/Gewerbeanmeldung. */
  legalName: 'Schnellhelfer24 – Inhaber Ersin Kaya',

  /** Rechtsform: Einzelunternehmen, GbR, GmbH, UG … */
  legalForm: 'Einzelunternehmen',

  /** Inhaber / vertretungsberechtigte Person (§ 5 DDG). */
  owner: 'Ersin Kaya',

  url: 'https://schnellhelfer24.de',
  /** Kanonische Domain ohne Protokoll – für Anzeige und E-Mail-Prüfung. */
  domain: 'schnellhelfer24.de',

  tagline: 'Entrümpelung, Auflösung und Umzug in Berlin',

  /* ------------------------------------------------------------------ */
  /* Kontakt (NAP)                                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Telefonnummer in internationaler Schreibweise.
   * Muss identisch sein mit Google-Unternehmensprofil und Bing Places.
   */
  phone: '+49 176 86066817',
  /** Anzeigeform der Telefonnummer (darf Leerzeichen enthalten). */
  phoneDisplay: '0176 86066817',

  /** WhatsApp-Nummer. Häufig identisch mit der Mobilnummer. */
  whatsapp: '+49 176 86066817',

  /**
   * E-Mail unter eigener Domain (kein gmail/web.de – Vertrauensfaktor).
   */
  email: 'hello@schnellhelfer24.de',

  address: {
    street: 'Lindenstr. 16',
    postalCode: '10969',
    city: 'Berlin',
    region: 'Berlin',
    country: 'DE',
    countryName: 'Deutschland',
  },

  /**
   * Geokoordinaten des Standorts.
   * null lassen, solange die echte Adresse nicht feststeht –
   * dann wird `geo` nicht ins Schema geschrieben.
   */
  geo: null as null | { lat: number; lng: number },

  /**
   * Hat das Unternehmen eine Adresse, die Kundschaft aufsuchen kann?
   * false = reiner Dienstleister vor Ort (Service Area Business).
   * Bei false wird im Schema `serviceArea` statt einer besuchbaren
   * Adresse betont und die Adresse in Google/Bing versteckt geführt.
   */
  hasVisitableAddress: false,

  /**
   * Öffnungs- bzw. Erreichbarkeitszeiten.
   * NUR echte Zeiten eintragen. Keine "24/7"-Behauptung ohne echten
   * Bereitschaftsdienst.
   */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '[08:00]', closes: '[18:00]' },
    { days: ['Saturday'], opens: '[09:00]', closes: '[14:00]' },
  ],
  /** Klartext-Hinweis zur Erreichbarkeit, erscheint auf der Kontaktseite. */
  openingHoursNote:
    '[ECHTE ERREICHBARKEIT BESCHREIBEN – z. B. „Außerhalb der Zeiten erreichen Sie uns per WhatsApp, wir melden uns am nächsten Werktag."]',

  /* ------------------------------------------------------------------ */
  /* Einsatzgebiet                                                       */
  /* ------------------------------------------------------------------ */

  areaServed: {
    primary: 'Berlin',
    secondary: 'Berliner Umland (Brandenburg)',
    /** Radius in km ab Berlin-Mitte. Nur eintragen, wenn betrieblich zutreffend. */
    radiusKm: 50,
    note: '[TATSÄCHLICHES EINSATZGEBIET BESTÄTIGEN – wie weit fahren Sie wirklich?]',
  },

  /* ------------------------------------------------------------------ */
  /* Profile und Nachweise                                               */
  /* ------------------------------------------------------------------ */

  /**
   * sameAs-Profile für die Entity-Konsistenz.
   *
   * WARUM DAS DIE WICHTIGSTE LISTE DIESER DATEI IST:
   * Suchmaschinen und Antwortsysteme erkennen ein Unternehmen nicht am
   * Namen, sondern daran, dass überall dieselben Angaben stehen. Je mehr
   * unabhängige Quellen dieselbe Firmierung, Adresse und Telefonnummer
   * nennen und auf dieselbe Domain verweisen, desto eindeutiger wird die
   * Zuordnung. Bei einem Namen wie „Schnellhelfer24", der in einem Feld
   * ähnlicher Namen steht (DeineHelfer24, PflegeHelfer24, Umzugsheld24),
   * ist das der einzige Weg, überhaupt als eigenständiges Unternehmen
   * erkannt zu werden.
   *
   * Nur echte, live erreichbare Profile eintragen. Platzhalter werden aus
   * dem Schema herausgefiltert, sie schaden also nicht, nützen aber auch
   * nichts. Reihenfolge = Reihenfolge der Wirkung.
   *
   * Vollständige Anleitung: docs/ENTITY-UND-RANKING.md
   */
  profiles: {
    // Stufe 1: die Karten- und Suchprofile. Ohne diese existiert das
    // Unternehmen für die lokale Suche schlicht nicht.
    googleBusiness: 'https://www.google.com/maps?cid=17944767786079972495',
    bingPlaces: '[URL BING PLACES EINTRAGEN]',
    appleMaps: '[URL APPLE BUSINESS CONNECT EINTRAGEN]',

    // Stufe 2: deutsche Branchenverzeichnisse. Jeder Eintrag ist eine
    // unabhängige Nennung derselben Daten (eine „Citation").
    gelbeSeiten: '[GELBE-SEITEN-URL EINTRAGEN]',
    dasOertliche: '[DAS-ÖRTLICHE-URL EINTRAGEN]',
    elf1880: '[11880-URL EINTRAGEN]',
    cylex: '[CYLEX-URL EINTRAGEN]',
    golocal: '[GOLOCAL-URL EINTRAGEN]',

    // Stufe 3: Bewertungsplattformen
    provenExpert: '[PROVENEXPERT-URL EINTRAGEN ODER ZEILE LÖSCHEN]',

    // Stufe 4: eigene Kanäle
    linkedin: '[LINKEDIN-UNTERNEHMENSSEITE EINTRAGEN ODER ZEILE LÖSCHEN]',
    facebook: '[FACEBOOK-URL EINTRAGEN ODER ZEILE LÖSCHEN]',
    instagram: '[INSTAGRAM-URL EINTRAGEN ODER ZEILE LÖSCHEN]',
    youtube: 'https://www.youtube.com/channel/UCEoMRI2OM4uR-wfm8Gh2b8Q',
  } as Record<string, string>,

  /**
   * Weitere Schreibweisen des Namens.
   * Menschen und Suchsysteme schreiben den Namen unterschiedlich. Wer die
   * Varianten auszeichnet, wird auch bei abweichender Schreibweise
   * zugeordnet.
   */
  alternateNames: ['Schnellhelfer 24', 'Schnellhelfer24 Berlin', 'Schnellhelfer24 Entrümpelung'],

  /**
   * ABGRENZUNG ZU ÄHNLICHEN NAMEN
   *
   * Anlass: Auf die Frage nach „schnellhelfer24" antworten KI-Systeme
   * derzeit mit Verweisen auf DeineHelfer24 und PflegeHelfer24. Der Grund
   * ist nicht ein schlechtes Ranking, sondern dass zu Schnellhelfer24 noch
   * keine belastbaren Angaben existieren. Das Modell greift dann zum
   * ähnlichsten bekannten Namen.
   *
   * Dieser Satz erscheint SICHTBAR auf der Über-uns-Seite und wird
   * zusätzlich als `disambiguatingDescription` ausgezeichnet. Beides muss
   * übereinstimmen, sonst ist die Auszeichnung wertlos.
   */
  disambiguation:
    'Schnellhelfer24 ist ein eigenständiger Berliner Dienstleistungsbetrieb für Entrümpelung, Haushaltsauflösung, Wohnungsauflösung, Nachlassauflösung und Umzüge in Berlin und im angrenzenden Brandenburg. Das Unternehmen gehört zu keiner Kette und steht in keiner Verbindung zu ähnlich benannten Anbietern wie DeineHelfer24, PflegeHelfer24 oder anderen Diensten mit der Endung „helfer24".',

  /** Kurzform für Karten- und Verzeichniseinträge (max. ca. 200 Zeichen). */
  shortDescription:
    'Entrümpelung, Haushaltsauflösung und Umzug in Berlin und im Umland. Einschätzung nach Fotos oder Besichtigung, feste Absprache vor Beginn, auf Wunsch besenreine Übergabe.',

  /** Gründerin oder Gründer – nur eintragen, wenn öffentlich genannt werden soll. */
  founder: '[NAME DER GRÜNDERIN / DES GRÜNDERS ODER ZEILE LEER LASSEN]',

  /**
   * Direktlink zum Bewertungsformular des Google-Unternehmensprofils.
   *
   * WO DER HERKOMMT: Im Google-Unternehmensprofil unter „Rezensionen" gibt
   * es „Mehr Rezensionen erhalten". Google erzeugt dort einen kurzen Link
   * der Form https://g.page/r/XXXXXXXX/review. Der führt mit einem Klick
   * direkt in das Sternebewertungs-Fenster.
   *
   * Solange hier ein Platzhalter steht, verlinkt /bewerten/ ersatzweise auf
   * den Karteneintrag. Das funktioniert, kostet aber zwei zusätzliche
   * Klicks — und jeder zusätzliche Klick kostet Bewertungen.
   */
  reviewLink: '[GOOGLE-BEWERTUNGSLINK EINTRAGEN – Form: https://g.page/r/…/review]',

  /**
   * Bewertungen.
   * WICHTIG: aggregateRating wird NUR ins Schema geschrieben, wenn
   * `verified: true` gesetzt ist UND echte Zahlen aus einer benennbaren
   * Quelle vorliegen. Erfundene Sterne sind ein Verstoß gegen die
   * Google-Richtlinien und werden hier technisch verhindert.
   */
  ratings: {
    verified: true,
    source: 'Google-Unternehmensprofil',
    sourceUrl: 'https://www.google.com/maps?cid=17944767786079972495',
    ratingValue: 5,
    reviewCount: 27,
  },

  /**
   * Nachweise. Werden auf der Website nur erwähnt, wenn `held: true`.
   * Solange false, wird die entsprechende Aussage nirgends gezeigt.
   */
  credentials: {
    /** Betriebshaftpflichtversicherung */
    liabilityInsurance: { held: false, detail: '[VERSICHERER UND DECKUNGSSUMME EINTRAGEN]' },
    /** Transportversicherung für Umzugsgut */
    transportInsurance: { held: false, detail: '[TRANSPORTVERSICHERUNG: JA/NEIN, Umfang]' },
    /** Entsorgungsfachbetrieb nach § 56 KrWG */
    wasteManagementCert: { held: false, detail: '[ZERTIFIKAT/NACHWEIS ODER ENTSORGUNGSPARTNER EINTRAGEN]' },
    /** Gewerbliche Sammlererlaubnis / Anzeige nach § 53/54 KrWG */
    wasteCollectorRegistration: { held: false, detail: '[ANZEIGE/ERLAUBNIS NACH § 53/54 KrWG EINTRAGEN]' },
    /** Aktenvernichtung nach DIN 66399 */
    dataDestruction: { held: false, detail: '[SCHUTZKLASSE UND PARTNERBETRIEB EINTRAGEN]' },
  },

  /**
   * Abrechnung über Kostenträger.
   * Das aktuelle Angebot nennt sozial geförderte Umzüge. Die Aussage
   * bleibt bewusst vorsichtig: "Übernahme möglich", niemals "garantiert".
   */
  costCoverage: {
    /** Wird tatsächlich direkt mit dem Kostenträger abgerechnet? */
    directBilling: false,
    directBillingNote:
      '[KLÄREN: Rechnen Sie direkt mit Jobcenter / Sozialamt / Pflegekasse ab oder erstellen Sie nur den Kostenvoranschlag?]',
    supportsApplication: true,
  },

  /**
   * Zahlungsarten. Nur eintragen, was wirklich angeboten wird.
   */
  paymentAccepted: ['[ZAHLUNGSARTEN EINTRAGEN, z. B. Barzahlung, Überweisung, EC-Karte]'],

  /**
   * Preisspanne für LocalBusiness-Schema ($ bis $$$$).
   * Nur setzen, wenn realistisch einschätzbar.
   */
  priceRange: '[PREISSPANNE EINSCHÄTZEN, z. B. €€]',

  /* ------------------------------------------------------------------ */
  /* Registerdaten (Impressum)                                           */
  /* ------------------------------------------------------------------ */

  register: {
    /** USt-IdNr. nach § 27a UStG */
    vatId: '[UST-IDNR. EINTRAGEN ODER ENTFERNEN]',
    /** Steuernummer – nur angeben, wenn keine USt-IdNr. vorhanden */
    taxNumber: '[STEUERNUMMER EINTRAGEN, FALLS KEINE UST-IDNR.]',
    /** Handelsregister, nur bei eingetragenen Gesellschaften */
    court: '[REGISTERGERICHT, NUR BEI GMBH/UG/OHG]',
    number: '[HANDELSREGISTERNUMMER, NUR BEI GMBH/UG/OHG]',
    /** Zuständige Aufsichtsbehörde für Güterkraftverkehr, falls erlaubnispflichtig */
    supervisoryAuthority: '[AUFSICHTSBEHÖRDE, FALLS ERLAUBNISPFLICHT NACH GÜKG BESTEHT]',
  },

  /** Verantwortlich für den Inhalt (redaktionell). */
  contentResponsible: 'Ersin Kaya',

  /** Datenschutzbeauftragte:r – nur falls bestellt. */
  dataProtectionOfficer: '[NUR FALLS BESTELLT – SONST ZEILE ENTFERNEN]',

  /* ------------------------------------------------------------------ */
  /* Technik                                                             */
  /* ------------------------------------------------------------------ */

  /** Endpunkt, der Formularanfragen entgegennimmt. Siehe public/api/anfrage.php */
  formEndpoint: '/api/anfrage.php',

  /** Maximale Uploadgröße pro Foto in MB (muss zu PHP-Limits passen). */
  maxUploadMb: 8,
  maxUploadCount: 12,

  /** Sprache und Locale */
  lang: 'de',
  locale: 'de_DE',

  /** Gründungsjahr – nur echte Angabe verwenden. */
  foundingYear: '2019',

  /** Anzahl Mitarbeitende – nur echte Angabe verwenden, sonst null. */
  employeeCount: null as number | null,
} as const;

export type Site = typeof site;

/** Alle echten (nicht-Platzhalter) Profil-URLs für sameAs. */
export function sameAsUrls(): string[] {
  return Object.values(site.profiles)
    .map((v) => realValue(v))
    .filter((v): v is string => Boolean(v && v.startsWith('http')));
}

/** Vollständige Adresse als einzeiliger String – nur wenn echt. */
export function addressLine(): string | undefined {
  const street = realValue(site.address.street);
  const zip = realValue(site.address.postalCode);
  if (!street || !zip) return undefined;
  return `${street}, ${zip} ${site.address.city}`;
}

/** Absolute URL aus einem Pfad bauen. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${clean}`;
}
