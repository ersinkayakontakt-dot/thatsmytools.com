# Das SEO-System

Diese Datei erklärt, wie die Website technisch gegen SEO-Fehler abgesichert
ist: welche Daten wo stehen, welche Prüfungen es gibt, was sie blockieren
und warum sie so gebaut sind.

**Wer nur wissen will, was vor dem Livegang zu tun ist:** siehe
`SEO-LAUNCH-CHECKLIST.md`.
**Wer wissen will, was noch an echten Daten fehlt:** siehe `CONTENT-TODO.md`.

---

## Der Grundgedanke

Eine SEO-Regel, die nur in einem Dokument steht, wird beim dritten Umbau
gebrochen. Eine Regel, die den Build blockiert, nicht.

Deshalb ist fast alles in diesem System entweder

- eine **Datenquelle**, aus der die Website gebaut wird, oder
- eine **Prüfung**, die scheitert, wenn jemand die Regel verletzt.

Und weil eine Prüfung, die nie anschlägt, wertlos ist, gibt es zu jeder
Regelgruppe eine **Selbstprüfung**, die absichtlich kaputte Fälle baut und
erwartet, dass die Regel greift.

---

## 1. Datenmodelle

### `src/data/seo-pages.ts` – die Seitenkarte

Die einzige Stelle, an der steht, **was eine Seite im Suchmarkt sein soll**.

```ts
{
  id: 'service:wohnungsaufloesung-berlin',
  url: '/leistungen/wohnungsaufloesung-berlin/',
  pageType: 'service',
  primaryQuery: 'wohnungsauflösung berlin',
  secondaryQueries: ['wohnung auflösen berlin', …],
  searchIntent: 'transactional',
  businessPriority: 5,
  conversionGoal: 'complete_project_request',
  requiredOutboundLinks: ['guide:…', 'angebot-anfragen', 'berlin'],
  requiredInboundContexts: ['home', 'leistungen', 'guide:…'],
  mustNotCompeteWith: ['service:haushaltsaufloesung-berlin', …],
  allowedSchemaTypes: ['Service', 'WebPage', 'BreadcrumbList', 'FAQPage'],
  imageTheme: 'leere, saubere Wohnung kurz vor der Schlüsselübergabe',
  ownOgImage: true,
  lastmod: '2026-07-29',
}
```

**Title, H1 und Meta Description stehen NICHT darin.** Sie werden aus
`services.ts`, `guides.ts`, `districts.ts`, `towns.ts` und `cases.ts`
gelesen. Nur die vierzehn handgebauten Seiten ohne eigenen Datensatz
tragen ihre Metadaten hier – und ihre `.astro`-Dateien beziehen sie von
hier, statt sie im Frontmatter zu wiederholen.

*Warum:* Der ursprüngliche Auftragstyp sah `title` und `metaDescription`
als Felder vor. Wörtlich umgesetzt hätte das Projekt zwei Quellen für
jede Description gehabt – genau den Fehler, den `HANDOFF.md` unter „Eine
Quelle pro Angabe" ausschließt. Die Karte leitet stattdessen ab.

`indexableUrls()` in dieser Datei speist Sitemap **und** IndexNow. Beide
können nicht auseinanderlaufen.

### `src/data/images.ts` – die Bild-Registry

Jedes inhaltstragende Bild mit Alt-Text, Bildunterschrift, Herkunft und
Austauschstatus. Ein Stockfoto durch ein echtes Einsatzbild zu ersetzen
heißt: Datei tauschen, `imageOrigin` umstellen. Keine Seitenvorlage wird
angefasst.

`showsPeople: true` bei `imageOrigin: 'stock'` erzeugt automatisch den
sichtbaren Hinweis **„Symbolbild."** unter dem Bild. Stockpersonen dürfen
nie als eigene Mitarbeitende oder echte Kundschaft erscheinen.

### `src/config/site.ts` – die Unternehmens-Entity

Unverändert die Quelle für Kontaktdaten, Adresse, Profile und Schema.
Ergänzt wurde:

- `entityId` – die stabile, seitenübergreifende `@id`. **Darf sich nie
  ändern**; eine neue `@id` ist für Suchmaschinen ein neues Unternehmen.
- `ratings.checked` – Prüfdatum der Bewertungsangabe, vorher fest im
  Markup der Startseite.
- `hasVisitableAddress` wird jetzt **ausgewertet**: Bei `false` gibt das
  Schema keine Straßenanschrift aus. Das Impressum zeigt sie weiterhin
  vollständig, wie § 5 DDG verlangt.

---

## 2. Prioritätslogik

`businessPriority` von 1 bis 5, vergeben nach der Rangfolge aus dem
Auftrag:

| Stufe | Seiten |
|---|---|
| 5 | Wohnungsauflösung, Entrümpelung, Haushaltsauflösung, Nachlassauflösung, Startseite |
| 4 | Seniorenumzug, Hausverwaltungen, Büroauflösung, vermüllte Wohnung, Anfrageseite |
| 3 | Standortseiten, Hubs, Kellerentrümpelung, Sperrmüll, Umzug |
| 2 | Ratgeber und Kostenseiten |
| 1 | Impressum, Datenschutz |

Die Priorität steuert:

- die Reihenfolge in allen Empfehlungsmodulen und auf den Übersichten,
- den Prioritätsfaktor im internen Authority-Score,
- den Geschäftswert im Opportunity-Score,
- die Härte der Crawl-Prüfung (P4 aufwärts ist ein Fehler, darunter eine
  Warnung).

Sie führt **nicht** zu automatisch erzeugten Links. `requiredOutboundLinks`
bleibt von Hand gepflegt.

---

## 3. Linklogik

### Die Module

| Komponente | Zweck |
|---|---|
| `LinkModule` | gemeinsame Grundform, trägt `data-linkmodule` |
| `RelatedServiceLinks` | verwandte Leistungen, nach Priorität sortiert |
| `RelatedGuides` | passende Ratgeber und Kostenseiten |
| `RelevantLocations` | Einsatzgebiete, begrenzt auf acht plus Hub |
| `CaseStudyLinks` | nur echte, freigegebene Einsätze |
| `RelatedQuestions` | weiterführende Fragen als Linktext |
| `NextStepPanel` | Übergang zum Conversion-Ziel plus kuratierte Verweise |
| `ContextualCompanyLink` | Verweis auf den Betrieb, sechs Textvarianten |

Jedes Modul trägt `data-linkmodule="…"` im Markup. Der Linkgraph
unterscheidet damit **redaktionelle Links von Rahmenlinks**, ohne auf eine
Klassennamensliste im Prüfskript angewiesen zu sein, die beim nächsten
CSS-Umbau still falsch würde.

### Der Authority-Score

```
Beitrag = Zonengewicht
        × (0,6 + 0,1 × Priorität der Quellseite)
        × Positionsfaktor
        × Linktextfaktor
        ÷ Wurzel(ausgehende Links der Quelle in derselben Zone)
```

| Zone | Gewicht | Begründung |
|---|---:|---|
| `context` | 1,00 | redaktioneller Link im Fließtext |
| `module` | 0,60 | kuratiertes Empfehlungsmodul |
| `breadcrumb` | 0,25 | Strukturpfad |
| `nav` | 0,08 | auf jeder Seite identisch |
| `footer` | 0,05 | auf jeder Seite identisch |
| `sticky` | 0,00 | mobile Aktionsleiste, rein funktional |

Positionsfaktor 1,0 in der oberen Hälfte des Hauptinhalts, sonst 0,8.
Linktextfaktor 0,5 bei „hier", „mehr", „weiterlesen" ohne Zusatz.

Die Wurzel statt der vollen Anzahl: Eine Seite mit zwölf Empfehlungen soll
je Link spürbar weniger weitergeben, aber gute Übersichtsseiten nicht
bestrafen.

**Der Score ist relativ.** Er vergleicht die eigenen Seiten untereinander
und sagt nichts über Google.

### Die harte Regel aus § 2

Kleinaufträge (`smallJobPages`) dürfen die großen Leistungen
(`mustOutrankSmallJobs`) nicht überholen. Beides steht in der Seitenkarte,
nicht im Prüfskript – die Prüfung setzt die Entscheidung durch, sie trifft
sie nicht.

Die allgemeine Prioritätsumkehr ist bewusst nur eine **Warnung**. Sie so zu
verschärfen, dass jede höher priorisierte Seite jede niedrigere überholen
muss, würde dazu zwingen, Links zu erfinden: Dass die Kellerentrümpelung
gut verlinkt ist, liegt daran, dass sieben Bezirke sie tatsächlich als
Schwerpunkt nennen und vier Ratgeber sie fachlich brauchen.

---

## 4. Kannibalisierungsregeln

| Prüfung | Stufe |
|---|---|
| zwei indexierbare Seiten mit derselben primären Suchanfrage | Fehler |
| Nebenbegriff einer Seite ist die Hauptanfrage einer anderen | Warnung |
| zwei Standortseiten, Jaccard ≥ 0,45 oder Cosinus ≥ 0,90 | Fehler |
| sonstige Seiten, Jaccard ≥ 0,30 oder Cosinus ≥ 0,80 | Warnung |
| dieselben Werte bei Seiten in `mustNotCompeteWith` | Fehler |
| Titel-/H1-Ähnlichkeit ≥ 0,75 | Warnung |
| transaktionaler Ratgeber gegen Leistungsseite | Warnung |
| derselbe Ankertext zeigt auf mehrere Ziele | Warnung |

Zwei unabhängige Verfahren, beide im Bericht ausgewiesen:

- **Jaccard über 5-Wort-Shingles** erkennt wörtlich übernommene Passagen
  und Ortstausch-Templates.
- **Cosinus über TF-IDF** erkennt thematische Deckung auch bei anderer
  Formulierung.

Beide sind offline, kostenlos und deterministisch. Ein kostenpflichtiger
KI-Aufruf als Build-Abhängigkeit wäre hier falsch.

Der Bericht nennt zusätzlich immer die **fünf ähnlichsten Paare**, auch
wenn sie weit unter jeder Schwelle liegen – ein „keine Auffälligkeiten"
ohne Messwerte wäre nicht überprüfbar.

**Keine automatische Zusammenführung.** Der Bericht schlägt vor,
entschieden wird redaktionell.

---

## 5. Die Prüfbefehle

```bash
npm run seo:all           # alle Guards, blockiert bei Fehlern
npm run seo:report        # dasselbe, schreibt SEO-AUDIT-REPORT.md
npm run seo:selftest      # 14 absichtliche Verletzungen, alle müssen greifen

npm run seo:metadata          # Karte gegen gebautes HTML
npm run seo:linkgraph         # Linkgraph und Authority-Score
npm run seo:cannibalization   # Suchanfragen und Inhaltsähnlichkeit
npm run seo:schema            # JSON-LD gegen site.ts und sichtbaren Text
npm run seo:images            # Bilder und Lizenznachweis
npm run seo:contrast          # WCAG 2.2 AA, rechnerisch
npm run seo:events            # Ereignisnamen Code gegen Endpunkt

npm run audit:content     # unverändert, wird von der CI aufgerufen
npm run audit:build       # unverändert, wird von der CI aufgerufen
```

Zusatzflag: `npm run seo:linkgraph -- --json` schreibt den vollständigen
Graphen nach `tmp/seo-linkgraph.json`.

### Was blockiert

Verwaiste indexierbare Seite, toter interner Link, Link auf einen Entwurf,
fehlender geforderter Link, doppelte primäre Suchanfrage, fehlender oder
doppelter Title, fehlende oder mehrfache H1, H1 weicht von der Karte ab,
falsches Canonical, Canonical auf einen Entwurf, `noindex` in der Sitemap,
Platzhalter im JSON-LD, Kontaktdaten im Schema weichen von `site.ts` ab,
mehrere Unternehmens-`@id`, FAQ-Auszeichnung ohne sichtbare Frage,
`aggregateRating` ohne sichtbare Bewertungen, Bild ohne `alt`, Hotlink,
Bild ohne Maße, zwei Bilder mit `fetchpriority="high"`, Stockfoto ohne
Nachweis, Kontrast unter AA, Kleinauftrag überholt eine große Leistung.

### Was nur warnt

Alles, was eine redaktionelle Entscheidung braucht: zu wenige kontextuelle
Eingänge, nichtssagende Linktexte, Title gleich H1, Prioritätsumkehr
zwischen ähnlich wichtigen Seiten, Bildmotiv hinterlegt aber kein Bild
vorhanden, Kontrast knapp über der Grenze.

---

## 6. Search-Console- und Bing-Import

```bash
npm run seo:opportunities              # liest data/gsc/ und data/bing/
npm run seo:opportunities -- --api     # zusätzlich über die API
npm run seo:opportunities:selftest     # 38 Prüfungen gegen bekannte Sollwerte
```

### Zwei Wege

**CSV-Export** – sofort nutzbar, ohne Zugangsdaten. Der Parser versteht
deutsche und englische Kopfzeilen, Komma und Semikolon als Trennzeichen,
Dezimalkomma, Tausenderpunkt, Prozentangaben, BOM und Anführungszeichen in
Suchanfragen. Eine unbekannte Kopfzeile führt zum Abbruch mit Klartext –
nicht zu stillen Nullwerten.

**API** über ein Dienstkonto (`GOOGLE_APPLICATION_CREDENTIALS` in
`.env.local`, Datei außerhalb des Repositories). Sie liefert, was der
CSV-Export nicht kann: Suchanfrage **und** Seite in derselben Zeile. Ohne
diese Verbindung lässt sich Kannibalisierung aus echten Daten nicht sauber
erkennen. Ohne zusätzliche Bibliothek: ein signiertes JWT und ein POST,
beides kann Node selbst.

### Die eigene CTR-Grundlinie

Getrennt nach Positionsgruppe, Gerät und Marke gegen Nicht-Marke.

*Warum nicht die bekannten Branchentabellen:* Sie stammen aus anderen
Branchen, anderen Ländern und aus Zeiten ohne KI-Antworten über den
Ergebnissen. Gegen einen fremden Durchschnitt zu optimieren heißt, ein
Ziel zu verfolgen, das es hier nie gab.

Die Trennung von Markensuchen ist keine Feinheit: Wer nach dem Firmennamen
sucht, klickt fast immer. Beides zusammen zu rechnen lässt jede normale
Seite unterdurchschnittlich aussehen.

Gruppen mit zu wenig Daten werden als `niedrig` gekennzeichnet und im
Score abgewertet, statt stillschweigend mitgerechnet zu werden.

### Der Opportunity-Score

```
Score = log10(Impressionen + 1)
      × Hebel
      × (0,4 + 0,15 × Priorität)   [× 1,2 bei Komplettauftrag/Partneranfrage]
      × Datenvertrauen              [hoch 1,0 · mittel 0,7 · niedrig 0,4]
      ÷ Aufwand                     [Meta 1,0 · Abschnitt 1,5 · Umbau 2,5]
```

Der Hebel je Art: Quick Win `(21 − Position) ÷ 17`, CTR-Lücke
`(erwartet − tatsächlich) ÷ erwartet`, Kannibalisierung der Anteil der
zweitstärksten Seite.

Die Formel steht im Skriptkopf **und** in jedem erzeugten Bericht. Sie ist
eine Reihenfolge, keine Prognose – sie sagt keine Klickzahlen und keine
Platzierungen voraus.

### Bing und KI-Sichtbarkeit

Bing-Exporte nach `data/bing/`. Bing ist die Datengrundlage für Copilot
und ChatGPT Search; wer dort nicht indexiert ist, kann in diesen Antworten
nicht zitiert werden. IndexNow (`npm run indexnow`) ist der schnellste Weg
in den Bing-Index.

---

## 7. Messsystem

```bash
npm run seo:events           # Ereignisnamen abgleichen
npm run seo:events:report    # Auswertung aus data/events/
```

### Aufbau

`src/components/Analytics.astro` sammelt und sendet per `sendBeacon` an
`public/api/events.php`. Kein Drittanbieter, kein Cookie, keine Kennung
über Sitzungen hinweg.

**Der Endpunkt ist standardmäßig abgeschaltet.** Er wird erst aktiv, wenn
in `config.local.php` ausdrücklich `'eventsEnabled' => true` gesetzt wird.

### Wie die Datensparsamkeit erzwungen wird

Der Endpunkt **baut jeden Datensatz aus einer Allowlist neu auf**, statt
die eingehende Struktur zu bereinigen. Ein unbekanntes Feld kann damit
nicht durchrutschen, auch nicht versehentlich.

Geprüft mit einem Angriffstest: Gesendet wurden `ip`, `userAgent`, `name`,
`telefon`, `email`, `nachricht`, ein Seitenpfad mit
`?email=…&tel=…` und ein `leistung`-Feld mit einer E-Mail-Adresse.
Gespeichert wurde:

```json
{"ts":"…","event":"lead_confirmed","page":"/anfrage-erhalten/",
 "visitor":"0618f96…","device":"mobile","channel":"direct","location":"danke"}
```

Weitere Vorkehrungen:

- **Kein IP-Speicher.** Das Sitzungspseudonym entsteht aus einem
  Tagesgeheimnis, das täglich neu erzeugt und beim Wechsel gelöscht wird.
  Nach Tagesende ist eine Zuordnung auch mit Serverzugang unmöglich.
- **Query-Strings werden abgeschnitten**, nicht gefiltert.
- **Web-Vitals-Werte werden gerundet** – hochaufgelöste Messwerte sind ein
  Fingerabdruck-Merkmal.
- **DNT und Global Privacy Control** werden auf beiden Seiten beachtet.
- Antwort immer `204`, unabhängig vom Ergebnis.

### Namensdrift verhindern

`npm run seo:events` vergleicht die Ereignisnamen in `src/` mit der
Allowlist des Endpunkts. Diese Prüfung gibt es, weil die Namen beim Bau
bereits einmal auseinandergelaufen sind: Das Formular sendet
`estimate_started`, eine neu geschriebene Allowlist erwartete `form_start`.
Der Endpunkt hätte jedes Formularereignis stillschweigend verworfen – ohne
Fehler, ohne Meldung, nur mit fehlenden Zahlen.

### Restrisiko

Gefälschte Beacons können die Zahlen verzerren. Für eine
Marketing-Auswertung tragbar. **Kein Ereignis darf je eine
Geschäftsentscheidung im Code auslösen.**

### Rechtlicher Stand

Technische Datensparsamkeit ist **nicht** automatisch dasselbe wie
Einwilligungsfreiheit. Vor dem Einschalten: Datenschutzerklärung ergänzen
und anwaltlich prüfen lassen. Siehe `CONTENT-TODO.md`.

---

## 8. Loganalyse

```bash
npm run logs:analyze -- --dir data/logs
npm run logs:analyze -- --dir data/logs --from 2026-07-01 --to 2026-07-31
npm run logs:analyze -- --dir data/logs --verify
```

Versteht Apache- und Nginx-Logs im Common- und Combined-Format, einzeln
oder als Verzeichnis, roh oder gzip-komprimiert.

**IP-Adressen werden beim Einlesen gekürzt**, nicht erst beim Bericht –
damit sie gar nicht erst durch das Programm wandern. Die vollständige
Adresse existiert nur im Arbeitsspeicher und nur bei `--verify`.

### Drei Nachweisstufen

| Stufe | Bedeutung |
|---|---|
| erkannt | Der User-Agent nennt diesen Bot. |
| technisch verifiziert | Reverse-DNS **und** Forward-Lookup bestätigen ihn. |
| nicht verifiziert | Prüfung fehlgeschlagen oder nicht durchgeführt. |

Ein User-Agent ist eine Behauptung, kein Nachweis. Jeder kann sich
„Googlebot" nennen. Eine Auswertung, die alle drei Stufen in einen Topf
wirft, führt zu falschen Schlüssen.

### Was der Bericht zeigt

Botzugriffe je Bot, meistgeholte Seiten mit Priorität, Fehlerstatus,
Weiterleitungen, Prioritätsseiten ohne Crawl, Zugriffe auf nicht
indexierbare Seiten, gesperrte Bots die trotzdem zugreifen, ausdrücklich
die OAI-SearchBot-Aktivität, und den Anteil des verschwendeten
Crawl-Budgets.

Bei weniger als sieben Tagen Daten unterlässt das Werkzeug die Aussage
„diese Seite wird nicht gecrawlt". Große Bots besuchen kleine Seiten nicht
täglich.

---

## 9. Wo welche Daten liegen

| Verzeichnis | Inhalt | Im Repository? |
|---|---|---|
| `src/data/` | Seitenkarte, Inhalte, Bild-Registry | ja |
| `src/assets/` | Bilddateien | ja |
| `public/og/` | erzeugte Vorschaubilder | ja |
| `data/gsc/`, `data/bing/` | Suchdaten-Exporte | **nein** |
| `data/events/` | heruntergeladene Messdaten | **nein** |
| `data/logs/` | Access-Logs | **nein** |
| `tmp/` | erzeugte Berichte, Arbeitsdateien | **nein** |
| `.env.local` | API-Schlüssel | **nein** |

Such-, Mess- und Logdaten sind Betriebsdaten. Access-Logs enthalten
vollständige IP-Adressen und sind personenbezogen.

---

## 10. Voraussetzungen

- **Node ab 22.18.** Die Prüfskripte importieren `src/data/seo-pages.ts`
  direkt; Node führt TypeScript seit dieser Version ohne Buildschritt aus.
- **Genau eine Laufzeitabhängigkeit:** Astro. `sharp` kommt über Astro und
  wird für `astro:assets` genutzt. Es wurde nichts hinzugefügt.
- **Chromium** nur für `npm run images:og` und `npm run make-images`. Fehlt
  es, fallen die Seiten auf das allgemeine Vorschaubild zurück; der Build
  läuft weiter.
- **PHP 8.0** auf dem Server für `anfrage.php` und `events.php`.
