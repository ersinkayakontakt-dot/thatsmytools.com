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

- `legalName`: vollständige Firmierung, exakt wie in Gewerbeanmeldung oder
  Handelsregister
- `legalForm`: Einzelunternehmen, GbR, GmbH, UG …
- `owner`: Inhaberin/Inhaber oder Geschäftsführung
- `contentResponsible`: verantwortliche Person nach § 18 Abs. 2 MStV
- `register.vatId` **oder** `register.taxNumber`. Bei Kleinunternehmerregelung
  nach § 19 UStG stattdessen einen entsprechenden Hinweis
- `register.court` und `register.number`: nur bei GmbH, UG, OHG, KG
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
  - Hostingunternehmen mit Anschrift, Speicherdauer der Logfiles,
    Auftragsverarbeitungsvertrag nach Art. 28 DSGVO
  - E-Mail-Anbieter, über den Anfragen empfangen werden
  - konkrete Löschfristen für Anfragen (Vorschlag: 6 Monate) und für Fotos
    (Vorschlag: 90 Tage, muss zu `retentionDays` in `config.local.php` passen)
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
- [ ] Gibt es Erfahrung damit, welche Unterlagen die Berliner Jobcenter
      konkret verlangen? Daraus würde eine eigene, sehr gut rankende Seite
      „Umzug mit Kostenübernahme in Berlin" (siehe Abschnitt F).
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

Veröffentlicht sind bisher drei Bezirke (Pankow, Marzahn-Hellersdorf,
Charlottenburg-Wilmersdorf) und zwei Orte im Umland (Potsdam, Falkensee). Alle
übrigen sind angelegt, aber als Entwurf: noindex, nicht in der Sitemap,
nirgends verlinkt.

Das ist Absicht. Zwölf fast gleiche Bezirksseiten wären Doorway Pages und
schaden mehr, als sie nützen.

Eine Standortseite geht online, wenn sie hat:

- eigene Einleitung, mindestens zwei Absätze und 350 Zeichen
- mindestens vier Ortsteile
- mindestens drei eigene Angaben zur Gebäudesituation
- mindestens drei eigene Angaben zu Zufahrt, Parken und Tragewegen
- mindestens drei eigene FAQ
- eigenen Title, eigene Meta Description, eigene Kurzantwort
- einen notierten Unterschied zu den anderen Standortseiten
  (`differentiator`)
- idealerweise mindestens einen echten Einsatzbericht aus der Gegend

`npm run audit:content` prüft das und meldet auch, wenn ein Entwurf
inzwischen vollständig ist und veröffentlicht werden könnte.

**Woher die Inhalte kommen:** nicht aus Recherche, sondern aus der eigenen
Arbeit. Nach jedem Einsatz eine Notiz: Wie war das Treppenhaus? Konnte das
Fahrzeug halten? Was war anders als erwartet? Nach fünf Einsätzen in einem
Bezirk schreibt sich die Seite fast von selbst und ist besser als alles, was
Wettbewerber dort stehen haben.

---

## G. Sonstiges

- [ ] `foundingYear` und `employeeCount` in `src/config/site.ts`, nur echte
      Angaben. `employeeCount` bleibt sonst `null` und wird nicht ausgegeben.
- [ ] Über-uns-Seite: echte Geschichte des Betriebs, Namen der
      Ansprechpartner. Der Abschnitt „Woher wir kommen" ist bewusst kurz
      gehalten und wartet auf echte Angaben.
- [ ] `profiles` in `src/config/site.ts`: URLs von Google-Unternehmensprofil,
      Bing Places und, falls vorhanden, Social-Media-Profilen. Sie fließen als
      `sameAs` in die strukturierten Daten und sind wichtig dafür, dass
      Suchmaschinen das Unternehmen eindeutig zuordnen.
- [ ] `areaServed.note`: Wie weit wird tatsächlich gefahren? Der Radius von
      50 km ist eine Annahme.
- [ ] Alte URLs der bisherigen Website sammeln und in `public/.htaccess`
      weiterleiten. Ohne das gehen alle bisherigen Rankings verloren. Quellen:
      Google Search Console, Bing Webmaster Tools, alte Sitemap, Serverlogs.

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
