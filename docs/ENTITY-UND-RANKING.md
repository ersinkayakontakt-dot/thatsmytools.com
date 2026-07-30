# Warum „Schnellhelfer24" nicht gefunden wird, und was dagegen hilft

Stand: 30.07.2026

Anlass: Auf die Frage nach „schnellhelfer24" antwortet Googles KI-Übersicht
sinngemäß, es gebe kein bekanntes Portal dieses Namens, gemeint seien wohl
DeineHelfer24 oder PflegeHelfer24.

Das ist keine Panne und kein schlechtes Ranking. Es ist die korrekte Antwort
auf den derzeitigen Datenstand.

---

## 1. Die Diagnose

Ein Antwortsystem beantwortet keine Namensfrage aus dem Index, sondern aus
dem, was es über eine **Entität** weiß: ein Unternehmen mit Adresse,
Telefonnummer, Kategorie, Profilen und Nennungen an Orten, die es kennt.
Findet es dazu nichts Belastbares, rät es nicht ins Leere, sondern greift zum
nächstähnlichen Namen, den es kennt. Bei einer Endung wie „…helfer24" ist die
Nachbarschaft dicht besetzt.

Es fehlt also nicht Reichweite. Es fehlt **Identität**.

### Was vorhanden ist

- Website live, 50 indexierbare URLs, seit dem **30.07.2026**
- Google Search Console eingerichtet, Sitemap mit 50 URLs erkannt
- IndexNow meldet Änderungen an Bing und die angeschlossenen Dienste
- Ein Google-Unternehmensprofil existiert und ist in `site.profiles`
  hinterlegt
- Echte Kontaktdaten, Anschrift und Firmierung in `src/config/site.ts`
- Ein YouTube-Kanal

### Was fehlt

| Was fehlt | Folge |
|---|---|
| Nennungen in Branchenverzeichnissen | Nichts bestätigt die Angaben der Website von außen |
| Bing Places und Bing Webmaster Tools | ChatGPT Search und Copilot stützen sich auf den Bing-Index |
| Apple Business Connect | Apple Karten und Siri kennen den Betrieb nicht |
| Öffentliche Bewertungen | Null. Ohne sie bleibt das Kartenprofil ein Eintrag ohne Gewicht |
| `sameAs`-Netz | Zwei Einträge. Für eine eindeutige Zuordnung zu wenig |
| Echte Einsatzberichte | Null. Siehe `HANDOFF.md`, Priorität 2 |

### Und der Punkt, der alles andere relativiert

**Die Website ist seit heute live.** Was Google und ChatGPT über den Betrieb
sagen, stammt aus einem Datenstand, in dem es diese Website noch gar nicht
gab. Eine KI-Übersicht, die eine wenige Stunden alte Domain nicht kennt,
funktioniert genau so, wie sie soll.

Das heißt nicht, dass nichts zu tun wäre. Es heißt, dass die richtige Frage
nicht lautet „warum steht da nichts", sondern „was muss in den nächsten
Wochen existieren, damit dort etwas steht". Darum geht es im Rest dieses
Dokuments.

---

## 2. Was die Website dafür mitbringt

Damit klar ist, was noch zu tun ist und was nicht:

- **Strukturierte Daten als zusammenhängender Graph** (`src/lib/schema.ts`):
  `MovingCompany`/`LocalBusiness` mit fester `@id`, dazu `WebSite`,
  `WebPage`, `BreadcrumbList`, `Service`, `FAQPage`. Alle Knoten verweisen
  aufeinander, statt lose nebeneinander zu liegen.
- **`alternateName`, `disambiguatingDescription`, `logo`, `knowsAbout`** –
  neu ergänzt, genau für dieses Problem. `disambiguatingDescription` ist die
  schema.org-Eigenschaft für „Unterschied zu Gleichnamigen".
- **Sichtbare Abgrenzung** auf `/ueber-uns/#name`, wortgleich mit der
  Auszeichnung. Beides stammt aus derselben Variable, es kann nicht
  auseinanderlaufen.
- **`sameAs`-Gerüst** in `site.profiles`, nach Wirkung gestaffelt.
  Platzhalter werden herausgefiltert; sobald ein echtes Profil eingetragen
  ist, steht es automatisch überall.
- **IndexNow** (`npm run indexnow`) mit Zustandsdatei, damit nichts doppelt
  gemeldet wird.
- **robots.txt trennt Suchbots von Trainingssammlern** (`docs/KI-CRAWLER.md`).
- **`llms.txt`** mit Leistungen, Einsatzgebieten und der Abgrenzung.
- **Kurze direkte Antwort unter jeder H1** – das Format, aus dem
  Antwortsysteme zitieren.
- **Publish Guard**: keine dünnen Standortseiten.

Technisch fehlt hier nichts mehr. Es fehlen Einträge und Belege außerhalb der
eigenen Website.

**Damit keine falsche Erwartung entsteht:** Schema, `llms.txt` und robots.txt
erzwingen keine Nennung durch ein KI-System. Sie machen die Website maschinell
eindeutig lesbar. Ob sie genannt wird, entscheidet sich an den Signalen von
Dritten aus Abschnitt 3 und 4.

---

## 3. Die Reihenfolge, die tatsächlich etwas bewegt

Nach Wirkung pro Aufwand sortiert.

### Stufe 1: Das Kartenprofil in Ordnung bringen (diese Woche)

Das Profil existiert, aber ein existierendes Profil ist nicht dasselbe wie
ein sauberes.

1. **Angaben gegenprüfen und mit der Website zeichengenau abgleichen.**
   - Name exakt `Schnellhelfer24`, ohne Zusatz. Keine Keywords im Namen, das
     verstößt gegen die Richtlinien und kostet im Zweifel das Profil.
   - Telefonnummer identisch mit `site.phone`: `0176 86066817`.
   - Als **Dienstleistungsgebiet-Unternehmen** geführt, solange
     `hasVisitableAddress` auf `false` steht. Beides muss dieselbe Aussage
     ergeben.
   - **Offener Punkt aus `CONTENT-TODO.md`:** Im öffentlichen Panel kann noch
     die alte Anschrift Lindenstraße 14 stehen. Eine falsche Adresse im
     Kartenprofil ist genau das Signal, das die Zuordnung kaputt macht.
     Erneut verifizieren und kontrollieren.
   - Hauptkategorie *Entrümpelungsdienst*, dazu *Umzugsunternehmen* und
     *Entsorgungsunternehmen*.
   - Leistungen einzeln pflegen, mit denselben Bezeichnungen wie auf der
     Website.
   - Einsatzgebiet eintragen: die Bezirke, die wirklich bedient werden.
2. **Bing Webmaster Tools** einrichten, Sitemap einreichen, IndexNow-Schlüssel
   bestätigen.
3. **Bing Places** – separat von den Webmaster Tools. Der Import aus dem
   Google-Profil funktioniert und spart Zeit; Angaben trotzdem gegenprüfen.
4. **Apple Business Connect** – kostenlos, in wenigen Minuten erledigt, von
   Mitbewerbern fast nie genutzt. Speist Apple Karten und Siri.

> Warum Bing so weit oben steht, obwohl es wenig Marktanteil hat: ChatGPT
> Search und Microsoft Copilot stützen sich auf den Bing-Index. Wer dort
> fehlt, kann in diesen Antworten nicht vorkommen. Bing nimmt neue Seiten
> außerdem deutlich schneller auf als Google.

### Stufe 2: Übereinstimmende Nennungen (nächste Woche)

Der Fachbegriff ist *Citations*. Das Prinzip ist simpler, als es klingt: Je
mehr voneinander unabhängige Quellen **dieselbe** Firmierung, Anschrift und
Telefonnummer nennen, desto sicherer ordnet ein System sie einer Entität zu.
Derzeit gibt es außer dem Google-Profil keine einzige.

**Werkzeug dafür:** `npm run kit` erzeugt `docs/EINTRAGS-KIT.md` — alle
Angaben in genau der Form, in der sie in die Portale gehören, direkt aus
`src/config/site.ts`. Beim Anlegen eines Profils von dort kopieren, nicht
abtippen. Fehlende Angaben erscheinen im Kit als sichtbare Fehlstelle statt
als geratener Wert.

Kostenlos und in einem Nachmittag zu erledigen:

- Gelbe Seiten, Das Örtliche, 11880, Cylex, GoLocal, wlw (für B2B),
  Yelp Deutschland
- **OpenStreetMap** – wird selten genannt, speist aber unzählige Karten und
  Apps weiter unten in der Kette. Ein sauberer Eintrag mit Website und
  Telefonnummer wirkt breiter, als die Bekanntheit vermuten lässt.
- Branchenverzeichnis der IHK Berlin, falls Mitgliedschaft besteht

**Der Punkt, an dem das schiefgeht:** eine einzige abweichende Schreibweise.
„Schnellhelfer 24" an einer Stelle und „Schnellhelfer24" an einer anderen,
Lindenstraße 14 statt 16, oder zwei verschiedene Telefonnummern – und die
Wirkung kehrt sich um. Deshalb wird alles aus `src/config/site.ts` kopiert
und nicht neu getippt.

Jeden angelegten Eintrag anschließend in `site.profiles` nachtragen. Dann
steht er automatisch im `sameAs`, und der Kreis schließt sich: Die Website
nennt die Profile, die Profile nennen die Website.

### Stufe 3: Die eigene Markensuche gewinnen (Woche 2–4)

Das ist die direkte Antwort auf das Ausgangsproblem. Ziel: Wer
„schnellhelfer24" eingibt, findet auf der ersten Seite ausschließlich diesen
Betrieb. Genau diese Seite lesen die Antwortsysteme.

Dafür braucht es mehrere Ergebnisse, die man selbst besitzt:

- die Website
- das Google-Unternehmensprofil
- ein LinkedIn-Unternehmensprofil (kostenlos, rankt für Markennamen
  zuverlässig)
- Facebook-Seite und Instagram-Profil, auch ohne aktive Bespielung
- der YouTube-Kanal, sobald es echte Aufnahmen gibt
- ein ProvenExpert-Profil, sobald echte Bewertungen vorliegen

Jedes dieser Profile trägt dieselbe Kurzbeschreibung
(`site.shortDescription`) und verlinkt auf die Startseite.

### Stufe 4: Bewertungen (ab sofort, dauerhaft)

Derzeit null. Mit 20 echten Bewertungen ist das Kartenprofil in einem
Berliner Bezirk konkurrenzfähig. Das ist neben echten Einsatzberichten der
größte Hebel, den kein technischer Kniff ersetzt.

**Werkzeug dafür:** `schnellhelfer24.de/bewerten/` ist der kurze Weg zum
Bewertungsformular — aussprechbar, aufdruckbar, als QR-Code verwendbar. Die
Seite steht auf `noindex`, sie ist ein Werkzeug für den Betrieb und kein
Inhalt für Suchmaschinen. Ändert sich der Google-Link, ändert sich nur
`site.reviewLink`, nicht das gedruckte Material.

Offen: Den Direktlink der Form `https://g.page/r/…/review` aus dem
Google-Profil holen („Rezensionen" → „Mehr Rezensionen erhalten") und in
`site.reviewLink` eintragen. Bis dahin öffnet die Seite nur den
Karteneintrag, und das kostet zwei zusätzliche Klicks.

Der einzige Weg, der zulässig ist und trägt:

- Bei der Übergabe fragen, wenn die Kundschaft zufrieden ist. Nicht per
  Serienmail hinterher.
- `schnellhelfer24.de/bewerten/` als QR-Code auf die Rechnung und auf eine
  Karte im Fahrzeug.
- Keine Gutscheine, keine Rabatte, keine Gewinnspiele als Gegenleistung. Das
  ist wettbewerbsrechtlich angreifbar und Google löscht solche Bewertungen.
- Auf jede Bewertung antworten, auch und gerade auf kritische. Die Antwort
  liest die nächste Kundschaft mit.

Sobald echte Bewertungen vorliegen: in `src/data/reviews.ts` eintragen und
`ratings.verified` setzen. Erst dann erscheinen Bewertungsbereich und
`AggregateRating`, beides ist technisch aneinander gekoppelt.

---

## 4. Die weniger offensichtlichen Hebel

Keine Tricks, sondern Dinge, die in diesem Gewerbe schlicht kaum jemand tut.

### 4.1 Der schnellste Umsatz kommt nicht aus der Suche

Für Entrümpelung und Auflösung sitzt die Nachfrage in wenigen Berufsgruppen,
die regelmäßig und planbar beauftragen:

- Hausverwaltungen (Mieterwechsel, Räumungen nach Titel)
- Nachlasspflegerinnen und Nachlasspfleger, beim Nachlassgericht gelistet
- rechtliche Betreuungen und Betreuungsvereine
- Seniorenumzugsdienste und Pflegedienste als Zulieferer
- Immobilienmaklerinnen und -makler vor der Vermarktung
- Insolvenzverwaltungen bei Geschäftsauflösungen

Zwanzig persönliche Anschreiben mit einem sauberen einseitigen Ablaufblatt
bringen realistisch schneller Aufträge als drei Monate SEO. Und jeder dieser
Kontakte ist zugleich eine potenzielle echte Nennung. Für diese Gruppe ist
`/hausverwaltungen-immobilienpartner/` gebaut: Die Seite ist kein
Akquiseweg, sondern der Beleg, dass der Betrieb ordentlich arbeitet.

### 4.2 Digitale Presse mit einem echten Anlass

Nicht „Firma bietet Entrümpelung an". Das druckt niemand. Was funktioniert,
sind Geschichten mit Substanz:

- Was passiert eigentlich mit dem, was aus einer Wohnung kommt? Mit Zahlen
  aus dem eigenen Betrieb, sobald welche vorliegen.
- Zusammenarbeit mit einem Sozialkaufhaus oder einer Verschenkinitiative.
- Ein Kiezblog oder eine Bezirkszeitung ist realistischer und für die lokale
  Relevanz nützlicher als ein Fachportal.

Ein einziger Link aus einem Berliner Lokalmedium wiegt mehr als fünfzig
Verzeichniseinträge. Aber er lässt sich nicht kaufen, nur verdienen.

### 4.3 Nachfrage nach dem eigenen Namen erzeugen

Eine Entität, nach deren Namen niemand sucht, bleibt für Suchsysteme schwach,
egal wie gut die Website ist. Suchanfragen nach dem Markennamen sind das
Signal, an dem sich echte Bekanntheit von Selbstdarstellung unterscheiden
lässt.

Was das erzeugt, passiert offline:

- Fahrzeugbeschriftung mit Name und Domain, gut lesbar
- Name auf Rechnung, Übergabeprotokoll und Visitenkarte
- Aushänge in den Bezirken, in denen tatsächlich gearbeitet wird
- Kooperationen, bei denen der Name genannt wird

Das ist der Grund, warum kleine Betriebe mit beschriftetem Transporter und
ohne SEO oft besser gefunden werden als solche mit teurer Website ohne beides.

### 4.4 Was man selbst prüfen kann

Einmal im Monat, dauert zehn Minuten:

- `site:schnellhelfer24.de` bei Google **und** bei Bing – wie viele der 50
  Seiten sind aufgenommen?
- „schnellhelfer24" bei Google, Bing und in ChatGPT eingeben: Was wird
  genannt? Diese Antwort ist das eigentliche Erfolgsmaß dieses Dokuments.
- „Entrümpelung Neukölln" & Co. im Inkognito-Fenster: Steht das Kartenprofil
  dabei?
- Search Console und Bing Webmaster Tools auf Fehler prüfen.

### 4.5 Was ausdrücklich nicht getan wird

- Keine gekauften Links, keine Linktausch-Netzwerke, keine PBNs.
- Keine gekauften oder erfundenen Bewertungen. In Deutschland ist das nach
  UWG abmahnfähig, unabhängig von der Reaktion der Plattform.
- Keine Standortseiten für Orte, die nicht bedient werden. Der Publish Guard
  verhindert das technisch, und das ist Absicht.
- Keine Keywords im Namen des Unternehmensprofils.
- Kein automatisch erzeugter Massentext. Fünfzig gute Seiten schlagen
  fünfhundert mittelmäßige, besonders bei einer jungen Domain.

---

## 5. Realistischer Zeitplan

Gerechnet ab dem Livegang am 30.07.2026.

| Zeitraum | Was passiert |
|---|---|
| Woche 1 | Kartenprofil bereinigt und neu verifiziert, Bing Webmaster Tools, Bing Places und Apple angelegt |
| Woche 2–3 | Verzeichniseinträge, erste Indexierung bei Bing, erste Bewertungen eingesammelt |
| Woche 4–6 | Google hat die Seiten aufgenommen, erste Kartentreffer bei sehr konkreten Suchen |
| Monat 2–3 | Die Markensuche gehört einem selbst, KI-Antworten nennen den Betrieb korrekt |
| Monat 4–6 | Sichtbarkeit bei allgemeinen Suchen wie „Entrümpelung Berlin Kosten", erste echte Einsatzberichte online |

Der Punkt, an dem die KI-Übersicht die Frage richtig beantwortet, liegt
erfahrungsgemäß nach Stufe 1 und 2, also im Bereich von Wochen, nicht von
Monaten. Vorher ist die Frage schlicht verfrüht.

---

## 6. Zusammengefasst

Die Website ist nicht das Problem. Sie ist seit heute live, technisch sauber
ausgezeichnet und beschreibt ein Unternehmen mit echten Daten. Was fehlt, sind
drei Dinge in dieser Reihenfolge:

1. **Das Kartenprofil bereinigen und verifizieren**, dazu Bing Webmaster
   Tools, Bing Places und Apple Business Connect
2. **Übereinstimmende Nennungen** in Verzeichnissen, jeweils in
   `site.profiles` nachgetragen
3. **Echte Bewertungen und echte Einsatzberichte** – die einzigen Signale,
   die sich nicht bauen lassen

Alles andere in diesem Dokument ist Beschleunigung. Ohne diese drei Punkte
beschleunigt es nichts.
