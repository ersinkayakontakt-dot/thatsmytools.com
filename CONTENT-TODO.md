# CONTENT-TODO: Was noch an echten Daten fehlt

Diese Website ist inhaltlich vollständig gebaut, aber sie enthält bewusst
**keine erfundenen Unternehmensdaten**. Keine Telefonnummer, keine Adresse,
keine Bewertungen, keine Preise, keine Referenzfälle.

Was fehlt, steht hier. Alles, was in eckigen Klammern steht, ist ein
Platzhalter.

**Wichtigster Hinweis:** Die meisten Angaben werden an genau einer Stelle
gepflegt, nämlich in `src/config/site.ts`. Von dort speisen sich Kopfbereich,
Fußbereich, Kontaktseite, Impressum, alle Telefon- und WhatsApp-Links und
sämtliche strukturierten Daten. Solange dort ein Platzhalter steht, wird der
betreffende Kontaktweg überall automatisch ausgeblendet, statt einen toten
Link zu erzeugen.

Die Reihenfolge unten ist nach Dringlichkeit sortiert.

---

## 0. Umbau auf Komplettaufträge (Stand 30.07.2026)

Die Website wurde von „günstiger Einzeltransport" auf „Komplettservice für
Wohnungsauflösung, Nachlass und Seniorenumzug" umgestellt. Umgesetzt sind:

- ✅ Hero, Startseiten-Reihenfolge und Meta-Daten auf Komplettaufträge
  ausgerichtet; Einzelabholungen stehen weiter unten als Nebensektion
- ✅ Sechs Situationseinstiege auf der Startseite (`src/data/situations.ts`)
- ✅ `/hausverwaltungen-immobilienpartner/` als eigener Einstieg für
  Verwaltungen, Eigentümer und Makler, in Navigation und Sitemap verlinkt
- ✅ Abschnitt „Kostenvoranschläge für Behörden und Kostenträger" auf
  `/kosten/` inklusive Prüfdatum
- ✅ Besichtigungszusage präzisiert (telefonische Ersteinschätzung kostenlos,
  Besichtigung bei geeigneten Komplettaufträgen)
- ✅ Alle zwölf Kosten- und Ratgeberseiten redaktionell auf mobile Lesbarkeit
  geprüft. Die Direktantworten sind in kurze Absätze gegliedert, zwei lange
  H1 gekürzt und der Content-Audit verhindert neue Textwände. Der anschließend
  auf einem echten Mobilgerät gefundene Spaltenfehler in nummerierten
  Schrittlisten ist ebenfalls behoben: Überschrift und Absatz liegen nun
  gemeinsam in der breiten Textspalte.

**Offen aus dem Umbauauftrag – nach Wirkung sortiert:**

1. ✅ **Anfrageformular qualifiziert.** Neu: Umfang (Raum / Wohnung / Haus /
   Gewerbe), Größe in Zimmern oder m², Anlass und sieben Zusatzleistungen.
   Gepflegt in **vier** Schichten, die zusammenpassen müssen:
   `AufwandCheck.astro` (Felder, Zwischenzusammenfassung, sessionStorage),
   `anfrage-erhalten.astro` (Bestätigungsseite) und `public/api/anfrage.php`
   (Mailtext, JSON-Ablage, Betreff). Umfang und Anlass sind Pflichtfelder im
   Browser, serverseitig optional – so scheitert eine zwischengespeicherte
   alte Seite nicht am Absenden.
   **Offen:** Das PHP konnte hier nicht geprüft werden (kein PHP auf dem
   Entwicklungsrechner). Vor dem Livegang eine Testanfrage über den echten
   Server senden und kontrollieren, ob Umfang, Anlass, Größe und
   Zusatzleistungen in der Mail und in der JSON-Ablage ankommen.
2. ✅ **Sperrmüll-Informationscluster ergänzt.** Der Ratgeber
   `/ratgeber/sperrmuell-moebel-entsorgen-berlin/` beantwortet die
   Informationssuche zu Sofa, Matratze, Möbeln und Elektrogeräten und verweist
   für die Beauftragung auf die bestehende Leistungsseite
   `/leistungen/sperrmuellabholung-berlin/`. So bleiben Informations- und
   Transaktionsintention getrennt, ohne eine zweite konkurrierende
   Leistungsseite anzulegen.
3. **Postleitzahlen** (`src/data/serviceAreas.ts` anlegen). Aktuell existieren
   **keine** PLZ-Daten im Projekt; die PLZ-Prüfung im Formular validiert nur
   das Format. Benötigt: amtliche Berliner PLZ mit Bezirk, Ortsteilen,
   bedient ja/nein, Prioritätsgebiet, Umlandprüfung – plus Prüfungen auf
   Dubletten, ungültige und fehlende PLZ. Keine eigene Seite je PLZ.
4. ✅ **Alle Berliner Bezirke veröffentlicht.** Seit 30.07.2026 bestehen für
   alle 12 Bezirke eigenständige, indexierbare Seiten. Neun neue Inhalte
   liegen in `src/data/additionalDistricts.ts`; der Publish Guard verlangt
   zusätzlich mindestens zwei Inhaltsblöcke und 1.800 Zeichen Gesamtinhalt.
   Offen bleiben 10 Umlandorte, bis das tatsächliche Einsatzgebiet bestätigt
   ist.
5. **Drei Hauptprodukte als eigene Seiten** (Nachlass-Komplettservice,
   Senioren-Wohnwechsel, Immobilie übergabefertig). Die Leistungsseiten decken
   die Themen ab, sind aber als Einzelleistungen aufgebaut, nicht als
   Komplettpakete mit Zusatzleistungen.
6. **Unterseiten auf das Niveau der Startseite heben.** Leistungs-, Standort-
   und Ratgeberseiten nutzen noch das ältere Kartenlayout. Wiederverwendbare
   Bausteine (Hero, Direktantwort, Prozess, Szenarien, Fallbeispiel, Sprung-
   navigation) fehlen als gemeinsames System.
7. **Bildsprache.** Es gibt keine Fotos im Projekt. Vor der Auswahl von
   Stockfotos muss `IMAGE-SOURCES.md` angelegt werden (Datei, Plattform,
   Fotograf, Quelle, Datum, Lizenz, Verwendung). Echte Fotos haben Vorrang.
8. **Einsatzberichte.** Datenstruktur steht (`src/data/cases.ts`), es gibt
   drei Muster, die korrekt auf noindex stehen. Echte, freigegebene Fälle
   fehlen vollständig.

---

## 0a. Offene Entscheidungen aus dem SEO-Ausbau (Stand 06.08.2026)

Diese Punkte hat der technische Ausbau aufgedeckt. Sie lassen sich **nicht
aus dem Code beantworten** – sie brauchen eine Entscheidung oder eine
Prüfung durch den Betreiber. Keiner davon wurde eigenmächtig geändert.

### Dringend, weil rechtlich oder sicherheitsrelevant

1. **Ist die Ablage auf dem Server wirklich geschützt?**
   `public/api/_storage/` enthält hochgeladene Wohnungsfotos und künftig
   Messdaten. Der Schutz hängt allein daran, dass Apache die dortige
   `.htaccess` auswertet. Setzt Hostinger `AllowOverride None`, wären die
   **Fotos öffentlich abrufbar**.
   *Prüfen:* Eine hochgeladene Datei direkt im Browser aufrufen. Es muss
   403 oder 404 kommen.
   *Bessere Lösung:* `storageDir` in `config.local.php` auf einen Pfad
   **oberhalb** des Webverzeichnisses setzen. Dann greift die `.htaccess`
   gar nicht erst.

2. **Datenschutzerklärung um die Reichweitenmessung ergänzen.**
   Der Endpunkt `public/api/events.php` ist gebaut, aber **abgeschaltet**
   (`'eventsEnabled' => false`). Vor dem Einschalten:
   Zweck, Datenkategorien, Aufbewahrung und Rechtsgrundlage aufnehmen und
   anwaltlich prüfen lassen, ob die Messung ohne Einwilligung zulässig ist.
   Technische Datensparsamkeit allein genügt dafür nicht.

3. **Ist die Lindenstraße für Kundschaft aufsuchbar?**
   `site.hasVisitableAddress` steht auf `false`. Seit dem 03.08.2026 wird
   das Flag auch ausgewertet: Das Schema gibt dann **keine Straßenanschrift**
   aus, nur Ort und Region. Das Impressum zeigt sie weiterhin vollständig.
   Ist die Adresse tatsächlich aufsuchbar, das Flag auf `true` setzen.

### Bewertungsangabe

4. **„5,0 aus 27 Google-Bewertungen" – Stand halten.**
   Die Angabe steht sichtbar auf der Startseite mit Prüfdatum aus
   `site.ratings.checked`. Beim nächsten Abgleich mit dem Google-Profil
   Wert, Anzahl **und Datum** dort aktualisieren.
   Im Schema wird bewusst **kein** `aggregateRating` ausgegeben: Google
   untersagt selbstvergebene Bewertungen für das eigene Unternehmen.

### Inhalte

5. **Bild für `/leistungen/bueroaufloesung-berlin/`.**
   Als einzige Seite mit Priorität 4 hat sie ein hinterlegtes Bildmotiv,
   aber noch kein Bild. `npm run seo:images` weist darauf hin.

6. **Sieben Stockfotos durch echte Einsatzbilder ersetzen.**
   Alle sind in `IMAGE-SOURCES.md` mit `Austausch: offen` verzeichnet.
   Jedes echte Bild aus einem freigegebenen Auftrag ist besser als das
   beste Stockfoto. Ersetzen heißt: Datei in `src/assets/` tauschen,
   `imageOrigin` in `src/data/images.ts` auf `'company'` oder
   `'customer-approved'` stellen, Zeile in `IMAGE-SOURCES.md` anpassen.
   Keine Seitenvorlage wird angefasst.

7. **Alte URLs der Vorgängerseite sammeln.**
   `public/.htaccess`, Abschnitt 3, enthält nur auskommentierte Beispiele.
   Ohne echte Weiterleitungen verliert jede alte Adresse ihre Signale.
   Quellen: Search Console, Bing Webmaster Tools, alte Sitemap, Serverlogs.

### Daten, die die Werkzeuge brauchen

8. **Search-Console-Export** nach `data/gsc/`, **Bing-Export** nach
   `data/bing/`. Dann liefert `npm run seo:opportunities` konkrete
   Aufgaben. Ohne Daten gibt das Werkzeug ausdrücklich nichts aus.

9. **Hostinger-Zugriffsprotokolle** nach `data/logs/`. Dann zeigt
   `npm run logs:analyze`, was die Bots tatsächlich holen.

10. **Search-Console-API-Zugang** (optional, aber deutlich aussagekräftiger):
    Nur über die API kommen Suchanfrage und Seite in derselben Zeile –
    die Voraussetzung, um Kannibalisierung aus echten Daten zu erkennen.
    Einrichtung in `scripts/seo/search-data/gsc-api.mjs`.

---

## A. Ohne diese Angaben kann die Website nicht online gehen

### A1. Kontaktdaten
`src/config/site.ts`

| Feld | Was gebraucht wird |
|---|---|
| ~~`phone` / `phoneDisplay`~~ ✅ | Eingetragen: `+49 176 86066817` / `0176 86066817`. Muss **identisch** im Google-Unternehmensprofil hinterlegt werden. |
| ~~`whatsapp`~~ ✅ | Eingetragen: `+49 176 86066817` (identisch mit der Telefonnummer). |
| ~~`email`~~ ✅ | Eingetragen: `hello@schnellhelfer24.de`. Postfach muss unter der Domain tatsächlich empfangen – vor Launch mit einer Testmail prüfen. |
| ~~`address.street`, `address.postalCode`~~ ✅ | Eingetragen: Lindenstr. 16, 10969 Berlin. `hasVisitableAddress` steht weiterhin auf `false` (Service Area Business) – umstellen, falls Kundschaft die Adresse aufsuchen kann. |

Ohne Telefonnummer fehlt der zweitwichtigste Conversion-Weg der ganzen Seite.

### A2. Firmierung und Rechtliches
`src/config/site.ts`, erscheint im Impressum

- ~~`legalName`~~ ✅ `Schnellhelfer24 – Inhaber Ersin Kaya` – gegen die
  Gewerbeanmeldung prüfen, die Schreibweise muss exakt übereinstimmen
- ~~`legalForm`~~ ✅ `Einzelunternehmen`
- ~~`owner`~~ ✅ `Ersin Kaya`
- ~~`contentResponsible`~~ ✅ `Ersin Kaya` (§ 18 Abs. 2 MStV; identisch mit
  dem Inhaber – ändern, falls eine andere Person verantwortlich zeichnet)
- `register.vatId` **oder** `register.taxNumber`. Bei Kleinunternehmerregelung
  nach § 19 UStG stattdessen einen entsprechenden Hinweis
- ~~`register.court` / `register.number`~~ – entfällt, da Einzelunternehmen.
  Der Abschnitt rendert im Build aber weiterhin seinen Platzhaltertext und
  muss aus der Impressum-Vorlage entfernt werden
- `register.supervisoryAuthority`: **prüfen.** Güterkraftverkehr mit Fahrzeugen
  über 3,5 t zulässigem Gesamtgewicht ist nach § 3 GüKG erlaubnispflichtig.
  Falls einschlägig, gehört die Erlaubnis ins Impressum.

### A3. Erreichbarkeit
`src/config/site.ts` → `openingHours`, `openingHoursNote`

Nur **echte** Zeiten eintragen. Solange dort Platzhalter stehen, zeigt die
Kontaktseite einen ehrlichen Hinweis statt erfundener Öffnungszeiten.

Keine „24/7"-Angabe ohne echten Bereitschaftsdienst. Das ist die Behauptung,
an der Kundschaft eine Firma am schnellsten als unseriös einstuft, weil sie
sich sofort überprüfen lässt.

### A4. Formular-Empfänger
`public/api/config.local.php` anlegen (Vorlage: `config.example.php`)

Ohne diese Datei nimmt das Formular keine Anfragen an, sondern leitet mit
einer Fehlermeldung zurück. Das ist Absicht: besser ein sichtbarer Fehler als
Anfragen, die still verschwinden.

### A5. Rechtliche Prüfung
- Impressum durch eine Anwältin oder einen Anwalt prüfen lassen
- Datenschutzerklärung ergänzen und prüfen lassen:
  - ~~Hostingunternehmen mit Anschrift~~ ✅ HOSTINGER operations, UAB,
    Švitrigailos str. 34, LT-03230 Vilnius, Litauen. Quelle: Hostinger
    Privacy Policy (Stand 30.07.2026). **Gegen die eigene Rechnung und den
    AV-Vertrag prüfen** – Hostinger nennt daneben auch `HOSTINGER, UAB` und
    `Hostinger International Ltd` (Zypern); maßgeblich ist die Firmierung
    auf dem eigenen Vertrag
  - AV-Vertrag nach Art. 28 DSGVO tatsächlich abschließen (in hPanel
    verfügbar) – die Erklärung behauptet ihn bereits
  - Speicherdauer der Logfiles beim Hoster erfragen und eintragen
  - E-Mail-Anbieter, über den Anfragen empfangen werden
  - ~~konkrete Löschfristen~~ ✅ festgelegt: Anfragen 6 Monate nach dem
    letzten Kontakt, Fotos 90 Tage nach dem Upload. Die 90 Tage stimmen mit
    `retentionDays => 90` in `public/api/anfrage.php` überein – bei Änderung
    beide Stellen anfassen. Für die 6 Monate gibt es **noch keinen
    technischen Löschlauf**: Anfragen liegen im Postfach und müssen
    organisatorisch gelöscht werden, sonst verspricht die Erklärung etwas,
    was nicht passiert
  - prüfen, ob ein Datenschutzbeauftragter zu benennen ist (§ 38 BDSG)
- Verzeichnis von Verarbeitungstätigkeiten nach Art. 30 DSGVO anlegen

---

## B. Aussagen der bisherigen Website prüfen

Die bisherige Seite wirbt mit sozial geförderten Umzügen und einer möglichen
Kostenübernahme durch Jobcenter, Sozialamt oder Pflegekasse. Das ist ein
starkes Alleinstellungsmerkmal und im Text der neuen Website vorsichtig
formuliert übernommen worden („Beteiligung möglich", „wir unterstützen bei der
Antragstellung", „über die Bewilligung entscheidet die zuständige Stelle").

Zu klären, bevor daraus mehr gemacht wird:

- [ ] Wird **direkt** mit Jobcenter, Sozialamt oder Pflegekasse abgerechnet,
      oder wird nur ein Kostenvoranschlag erstellt?
      → `costCoverage.directBilling` in `src/config/site.ts`
- [x] Eigener Ratgeber zu Berliner Jobcenter-Umzugskosten veröffentlicht:
      `/ratgeber/umzugskosten-jobcenter-berlin/`. Er stützt sich auf
      veröffentlichte Vorgaben von Bundesagentur und Berliner Jobcentern,
      verspricht keine Bewilligung und keine garantierte Direktabrechnung.
- [ ] Wird weiterhin **Gartenpflege** angeboten? Die neue Website führt sie
      nicht mehr, weil sie thematisch nicht zur Positionierung Räumung,
      Auflösung und Umzug passt und die Autorität verwässert. Wenn sie
      betrieblich wichtig ist, sollte sie als eigener Bereich zurückkommen,
      nicht als Nebensatz.

**Niemals ohne Beleg verwenden:**
„Kostenübernahme garantiert", „zertifizierte Entsorgung", „24/7",
„garantierter Festpreis", „DSGVO-konform mit Nachweis", eine Zahl wie „288+"
zufriedene Kunden, „ab 69,99 €".

---

## C. Vertrauensinhalte, die den größten Unterschied machen

### C1. Echte Bewertungen
`src/data/reviews.ts` (aktuell leer)

Solange die Liste leer ist, erscheint auf der Website **kein**
Bewertungsbereich und es wird **kein** AggregateRating in die strukturierten
Daten geschrieben. Das ist technisch aneinander gekoppelt und lässt sich
nicht versehentlich umgehen.

So werden Bewertungen ergänzt:

1. Nur Bewertungen übernehmen, die öffentlich nachlesbar sind
   (Google-Unternehmensprofil, Bing Places, ProvenExpert).
2. `sourceUrl` muss zur Bewertungsübersicht führen.
3. Autorennamen exakt so übernehmen, wie sie öffentlich stehen.
4. Text nicht glätten oder kürzen. Auszüge kennzeichnen.
5. Zusätzlich in `src/config/site.ts` unter `ratings` `verified: true` setzen
   und `ratingValue` sowie `reviewCount` aus der Quelle übernehmen.

**Wie man an Bewertungen kommt:** Nach jedem abgeschlossenen Einsatz fragen,
solange die Erleichterung noch frisch ist. Am besten mit einem kurzen Link
per WhatsApp direkt nach der Übergabe. Zwei Sätze reichen:
„Wenn Sie zufrieden waren, hilft uns eine kurze Bewertung sehr. Hier ist der
Link." Bei Nachlassaufträgen zurückhaltend sein und erst nach ein paar Tagen
fragen.

### C2. Echte Fotos
Die Website ist so gebaut, dass sie **ohne** Fotos funktioniert. Das ist eine
Notlösung, keine Absicht. Fotos sind der stärkste Vertrauensfaktor in dieser
Branche.

Gebraucht werden, in dieser Reihenfolge:

- [ ] **Team vor dem Fahrzeug**, in Arbeitskleidung, an einem echten
      Einsatzort. Ersetzt die rechte Spalte im Hero.
- [ ] **Fahrzeug mit Beschriftung**, wenn vorhanden.
- [ ] **Einsatzfotos**: beladenes Fahrzeug, Tragesituation im Treppenhaus,
      geräumter Raum. Ohne erkennbare Personen Dritter, ohne Hausnummern.
- [ ] **Vorher/Nachher** eines geräumten Raums, nur mit schriftlicher Freigabe.
- [ ] **Porträt der Person, die ans Telefon geht**, für die Über-uns-Seite.

Regeln:

- Keine Stockfotos von Menschen. Man erkennt sie, und sie zerstören genau das
  Vertrauen, das sie erzeugen sollen.
- **Keine KI-generierten Mitarbeiterbilder.**
- Keine drastischen Bilder aus stark vermüllten Wohnungen. Für Betroffene
  beschämend, für die Einschätzung eines Auftrags wertlos.
- Jedes Bild braucht eine echte Bildunterschrift und einen Alternativtext.
- Vor dem Einbau auf das Performance-Budget achten, siehe
  `docs/ARCHITEKTUR.md`, Abschnitt 8.

### C3. Nachweise
`src/config/site.ts` → `credentials`. Alles steht auf `held: false` und wird
deshalb nirgends erwähnt. Erst wenn ein Nachweis tatsächlich vorliegt, auf
`true` setzen.

- [ ] Betriebshaftpflichtversicherung: Versicherer und Deckungssumme
- [ ] Transportversicherung für Umzugsgut: besteht sie, in welchem Umfang?
- [ ] Entsorgungsweg: eigener Nachweis nach § 56 KrWG oder Name des
      Entsorgungspartners
- [ ] Anzeige oder Erlaubnis als Sammler nach §§ 53/54 KrWG
- [ ] Partnerbetrieb für Aktenvernichtung nach DIN 66399 samt Schutzklasse

Der Versicherungsschutz ist die Frage, die aufmerksame Kundschaft **immer**
stellt. Eine konkrete Antwort darauf ist mehr wert als jedes Werbeversprechen.

### C4. Zahlungsarten und Preisspanne
`src/config/site.ts` → `paymentAccepted`, `priceRange`

---

## D. Preisdaten aktivieren

`src/data/costs.ts`, aktuell `priceDataAvailable = false`

Der gesamte Kostenbereich erklärt bislang nur die Rechenlogik, ohne Zahlen.
Das ist ehrlich, aber es ist nicht das Ziel. **Echte, belegte Preisspannen
wären der stärkste Inhalt der gesamten Website**, weil kein Wettbewerber sie
abschreiben kann und weil danach am häufigsten gesucht wird.

So wird die Datei gefüllt:

1. Aus den abgerechneten Aufträgen die **tatsächlich berechneten Endpreise**
   je Kategorie zusammenstellen, nicht die Angebotspreise.
2. Mindestens 20 Fälle je Kategorie, sonst ist die Spanne nicht belastbar.
3. Statt eines Einzelwerts eine Spanne (`from`, `to`) und die Fallzahl
   (`cases`) eintragen.
4. `basis` ausfüllen: Zeitraum, Gesamtzahl der Fälle, was in diesen Aufträgen
   enthalten war, Grenzen der Aussage.
5. `priceDataAvailable` auf `true` setzen.

Vorbereitete Kategorien:

- Entrümpelung nach Wohnungsgröße (Keller, 1 bis 4+ Zimmer, Einfamilienhaus)
- Mehraufwand ohne Aufzug nach Etage

**Was zu erheben ist, damit das in einigen Monaten möglich ist:**
Volumen in Kubikmetern, Etage, Aufzug ja/nein, Trageweg in Metern,
Arbeitsstunden mal Personen, Materialarten und Mengen, Wertanrechnung,
Endpreis, Bezirk. Ein Feld pro Auftrag in einer Tabelle genügt.

---

## E. Einsatzberichte: der Berliner Einsatzatlas

`src/data/cases.ts`

Aktuell enthalten: drei **Musterberichte**. Sie sind `real: false` und
`status: 'draft'`, also noindex, nicht in der Sitemap und öffentlich nirgends
verlinkt. Sichtbar sind sie nur im Entwicklungsmodus. Sie zeigen die Struktur
und enthalten ausschließlich Platzhalter, keine erfundenen Zahlen.

So entsteht ein echter Bericht:

1. **Freigabe einholen.** Formulierungsvorschlag für nach dem Einsatz:

   > „Wir schreiben manchmal kurz auf, wie ein Einsatz abgelaufen ist, damit
   > andere in einer ähnlichen Lage besser einschätzen können, was auf sie
   > zukommt. Ohne Namen, ohne Adresse, ohne erkennbare Fotos. Wären Sie damit
   > einverstanden? Wenn ja, schicke ich Ihnen den Text vorher zum Lesen."

   Zustimmung schriftlich festhalten, per E-Mail oder WhatsApp genügt.

2. Eintrag in `src/data/cases.ts` anlegen, `real: true` setzen, alle
   Platzhalter durch echte Daten ersetzen.
3. Anonymisieren: kein Name, keine Hausnummer, keine erkennbaren Details auf
   Fotos. Straßenname nur, wenn ausdrücklich freigegeben.
4. `status: 'published'` setzen und beim jeweiligen Bezirk unter `cases`
   verknüpfen.

Der Publish Guard verhindert die Veröffentlichung, solange noch Platzhalter im
Text stehen oder `real: false` gesetzt ist.

**Ziel:** drei Berichte je veröffentlichtem Bezirk. Danach lassen sich daraus
die Auswertungen je Bezirk erzeugen, die für Antwortsysteme zitierfähig sind.

---

## F. Standortseiten freischalten

**Stand 30.07.2026:** Alle zwölf Berliner Bezirke sind veröffentlicht und
werden intern verlinkt. Zwei Orte im Umland (Potsdam, Falkensee) sind
veröffentlicht; zehn weitere bleiben Entwurf, bis das tatsächliche
Einsatzgebiet bestätigt ist.

Die neuen Berliner Seiten beschreiben objektive Gebäude-, Zugangs- und
Verkehrssituationen und behaupten keine konkreten Einsätze. Der Audit prüft
zusätzlich auf stark ähnliche Standorttexte, damit spätere Erweiterungen
nicht zu Doorway Pages werden.

Eine Standortseite geht online, wenn sie hat:

- eigene Einleitung, mindestens zwei Absätze und 350 Zeichen
- mindestens zwei Ortsteile (Friedrichshain-Kreuzberg hat amtlich nur zwei)
- mindestens drei eigene Angaben zur Gebäudesituation
- mindestens drei eigene Angaben zu Zufahrt, Parken und Tragewegen
- mindestens drei eigene FAQ
- eigenen Title, eigene Meta Description, eigene Kurzantwort
- einen notierten Unterschied zu den anderen Standortseiten
  (`differentiator`)
- mindestens zwei individuelle Inhaltsblöcke und 1.800 Zeichen Gesamtinhalt
- idealerweise mindestens einen echten Einsatzbericht aus der Gegend

`npm run audit:content` prüft das und meldet auch, wenn ein Entwurf
inzwischen vollständig ist und veröffentlicht werden könnte.

**Für spätere Aktualisierungen:** objektive Ortsinformationen dürfen
recherchiert werden; Aussagen über eigene Erfahrung nur aus dokumentierter
Arbeit. Nach jedem Einsatz notieren: Treppenhaus, Fahrzeugposition, Aufzug,
Trageweg und unerwartete Besonderheiten. Echte Fälle kommen ausschließlich
mit Freigabe in `cases.ts`.

---

## G. Sonstiges

- [x] `foundingYear` auf 2019 gesetzt (Quelle: Google-Unternehmensprofil,
      geprüft 30.07.2026). `employeeCount` bleibt mangels bestätigter Angabe
      `null` und wird nicht ausgegeben.
- [ ] Über-uns-Seite: echte Geschichte des Betriebs, Namen der
      Ansprechpartner. Der Abschnitt „Woher wir kommen" ist bewusst kurz
      gehalten und wartet auf echte Angaben.
- [x] Google-Unternehmensprofil und YouTube in `profiles` eingetragen.
      Bing Places und weitere Profile bleiben offen. Die URLs fließen als
      `sameAs` in die strukturierten Daten und sind wichtig dafür, dass
      Suchmaschinen das Unternehmen eindeutig zuordnen.
- [ ] Google-Unternehmensprofil nach den vorgenommenen Änderungen erneut
      verifizieren. Bis Google freigibt, kann im öffentlichen Panel noch die
      alte Anschrift Lindenstraße 14 erscheinen; auf Website und im Profil
      ist der Betrieb als Dienstleistungsgebiet ohne Kundenstandort geführt.
- [ ] Steuerstatus bestätigen (USt-Ausweis oder Kleinunternehmerhinweis).
      Bis dahin verspricht die Website nur eine ordnungsgemäße Rechnung,
      keinen Umsatzsteuerausweis.
- [ ] Exakte Erreichbarkeitszeiten bestätigen. Sonder- und
      Wochenendtermine werden bis dahin nur als individuell prüfbar
      beschrieben.
- [ ] Für `bau-renovierungsabfaelle` zulässige Abfallarten und tatsächliche
      Entsorgungswege bestätigen; die Seite bleibt bis dahin Entwurf.
- [ ] `areaServed.note`: Wie weit wird tatsächlich gefahren? Der Radius von
      50 km ist eine Annahme.
- [ ] Alte URLs der bisherigen Website aus Google Search Console oder
      Serverlogs sammeln und in `public/.htaccess` weiterleiten. Öffentliche
      Websuche und Wayback-CDX fanden am 30.07.2026 keine belegten alten
      Unterseiten; deshalb wurden bewusst keine geratenen Redirects angelegt.

---

## Prüfliste vor dem Livegang

```bash
npm run audit:content   # Inhalte, Publish Guard, Platzhalter
npm run build
npm run audit:build     # Titles, Descriptions, H1, Links, Sitemap, Schema
```

Zusätzlich von Hand:

- [ ] Auf der Website nach `[` suchen: kein Platzhalter darf öffentlich
      sichtbar sein außer in Impressum und Datenschutz, wo sie absichtlich
      markiert sind, bis die echten Angaben eingetragen wurden.
- [ ] Telefonnummer auf einem echten Smartphone antippen: wählt sie?
- [ ] WhatsApp-Link auf einem echten Smartphone antippen: öffnet er den Chat
      mit der richtigen Nummer?
- [ ] Testanfrage über das Formular mit zwei Fotos: kommt die E-Mail an?
- [ ] Impressum und Datenschutz gegen die eingetragenen Daten prüfen.
