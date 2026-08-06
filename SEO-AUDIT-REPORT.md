# SEO-Auditbericht

Der gemessene Teil wurde am 2026-08-06 mit `npm run seo:report` erzeugt.
Er ist eine Momentaufnahme des gebauten Standes in `dist/` – nicht der
Quelldateien. Der Abschnitt „Ausgangslage" darüber ist redaktionell
und stammt aus `docs/audit-ausgangslage.md`.

## Ausgangslage

Gemessen am 31.07.2026, vor der ersten Änderung.

| Kennzahl | Wert |
|---|---|
| Gebaute Seiten | 70 |
| Davon indexierbar | 50 |
| URLs in der Sitemap | 50 |
| `npm run check` | 0 Fehler |
| `npm run audit:content` | keine Auffälligkeiten |
| `npm run audit:build` | keine Auffälligkeiten |

Die Substanz war gut. Publish Guard, strukturierte Daten mit stabiler `@id`,
IndexNow, eine saubere `robots.txt` mit ausdrücklicher Trennung von Such-
und Trainingsbots – all das war bereits vorhanden und wurde nicht ersetzt.

Was fehlte, war Messbarkeit: Es gab keine Stelle, an der stand, welche
Suchanfrage eine Seite holen soll, wie viel sie wirtschaftlich wert ist und
womit sie nicht konkurrieren darf. Ohne diese Angaben lässt sich weder
Kannibalisierung erkennen noch interne Autorität lenken.

---

## Gefundene Fehler

Die folgenden Punkte wurden nicht vermutet, sondern gemessen. Jeder ist mit
dem Befehl belegt, der ihn gefunden hat.

### Barrierefreiheit: fünf echte AA-Verstöße

`src/styles/global.css` behauptete im Kopfkommentar: *„Alle Farbpaare sind
gegen WCAG 2.2 AA geprüft."* Die Nachrechnung ergab etwas anderes:

| Stelle | Ist | Soll |
|---|---:|---:|
| Primärer Button, Weiß auf Handlungsfarbe | 3,89:1 | 4,5:1 |
| Schwächste Textstufe auf Grundfläche | 4,38:1 | 4,5:1 |
| Schwächste Textstufe auf Karten | 3,97:1 | 4,5:1 |
| Umrisse von Eingabefeldern auf Weiß | 2,76:1 | 3:1 |
| Umrisse auf der Grundfläche | 2,57:1 | 3:1 |

Der erste betraf den wichtigsten Button jeder einzelnen Seite.

Zusätzlich verwendeten sieben Stellen die Flächenfarbe `--accent` für
kleinen Text, obwohl das Designsystem dafür ausdrücklich `--accent-text`
vorsieht. Gefunden wurden sie erst, nachdem die Prüfung um Regeln erweitert
wurde, die nur `color` setzen und den Hintergrund erben – dort steckte die
Mehrzahl der Fälle.

Die Behauptung im Kommentar ist durch `npm run seo:contrast` ersetzt. Sie
wird jetzt bei jedem Lauf nachgerechnet, statt behauptet zu werden.

### Interne Autorität: 22 blockierende Fehler

`npm run seo:linkgraph` prüft 4767 interne Verweise über 50 indexierbare
Seiten. Beim ersten Lauf:

- **Die Über-uns-Seite hatte genau einen kontextuellen Eingang.** Sie war
  praktisch nur über das Menü erreichbar und lag auf Rang 31 von 50.
- **Eine Einzelabholung sammelte mehr interne Autorität als der
  Seniorenumzug.** Das verletzt Auftrag § 2 wörtlich.
- Priorität 4 hatte im Durchschnitt weniger Gewicht als Priorität 3.
- Neun Seiten verlinkten nicht auf Ziele, die für sie vorgesehen waren.

### Messsystem: Ereignisse ohne Empfänger

`src/components/Analytics.astro` sammelte Conversion-Ereignisse in
`window.sh24.events` und sendete sie **nirgendwohin**. Es gab keinen
Endpunkt. Die Messung war eine Warteschlange, die niemand geleert hat.

### Entity: drei stille Widersprüche

- **`hasVisitableAddress: false` wurde nirgends ausgewertet.** Die
  Straßenanschrift landete trotzdem im `LocalBusiness`-Schema und behauptete
  damit einen Ort, an dem Kundschaft erscheinen kann.
- **Das Bewertungsband war nur zufällig richtig.** Die sichtbare Angabe
  („5,0 aus 27 Google-Bewertungen") stammt aus `site.ts`, das Schema prüfte
  dagegen `reviews.ts`. Ein einziger Eintrag dort hätte ein
  `aggregateRating` mit 27 Bewertungen erzeugt – bei einer sichtbaren.
- **Das Prüfdatum stand fest im Markup**, während die Zahlen daneben aus der
  Konfiguration kamen.

### Werkzeugfehler, die nur durch Gegenproben auffielen

Diese Fehler steckten in den neu gebauten Prüfwerkzeugen selbst und wären
ohne die Selbstprüfungen unbemerkt geblieben:

- **`0,042` wurde als `42` gelesen.** Die Heuristik hielt drei Stellen nach
  dem Komma für einen Tausendertrenner. Bei einer CTR wäre das der Faktor
  1000 gewesen – und die Auswertung hätte plausibel ausgesehen.
- **Alle sieben Vorschaubilder waren identisch.** `replace` mit einer
  Zeichenkette ersetzt nur das erste Vorkommen, und die Platzhalter standen
  auch im Kommentarkopf der Vorlage.
- **Die Ereignisnamen liefen auseinander.** Das Formular sendet seit jeher
  `estimate_started`, die neu geschriebene Allowlist erwartete `form_start`.
  Der Endpunkt hätte jedes Formularereignis stillschweigend verworfen.
- **Eine Conversion-Quote von 133 %.** Aktionen wurden durch Aufrufe
  geteilt, obwohl eine Sitzung mehrere Aktionen auslösen kann.

---

## Umgesetzte Verbesserungen

| Bereich | Was jetzt gilt |
|---|---|
| Seitenkarte | `src/data/seo-pages.ts` klassifiziert alle 70 Seiten. Title und Description werden aus den Inhaltsdateien **abgeleitet**, nicht kopiert – es gibt keine zweite Quelle. |
| Prüfungen | Neun Befehle unter `npm run seo:*`. **14 absichtlich eingebaute Verletzungen werden erkannt** (`npm run seo:selftest`). |
| Interne Autorität | Sieben Linkmodule, alle mit `data-linkmodule` gekennzeichnet, damit der Graph redaktionelle Links von Rahmenlinks unterscheiden kann. Die Über-uns-Seite hat jetzt 13 kontextuelle Eingänge statt einem. |
| Kontrast | Alle Paare erfüllen AA. Die Markenfarbe wurde um 6 % abgedunkelt – die Wirkung bleibt erhalten, geprüft per Screenshot. |
| Bilder | Vollständige Kette über `astro:assets`: AVIF, WebP, Rückfallformat, vier Breiten, feste Maße, Bild-Sitemap. Sieben individuelle Vorschaubilder mit je eigenem Seitentext. **Sieben Stockfotos** für die Prioritätsseiten, aus 84 Kandidaten ausgewählt und einzeln angesehen – darunter aussortiert: ein KI-generiertes Bild, Aufnahmen mit Mund-Nasen-Schutz und ein englisches „FOR SALE"-Schild. |
| Entity | Straßenanschrift nur bei aufsuchbarer Adresse, keine selbstvergebenen Bewertungen im Schema, stabile `@id` in der Konfiguration. |
| Suchdaten | CSV-Import und API-Adapter, CTR-Grundlinie aus **eigenen** Daten mit Trennung von Marken- und Nicht-Marken-Suchen. **38 Prüfungen** gegen bekannte Sollwerte. |
| Messung | Datensparsamer Endpunkt, gegen einen Angriffstest mit untergeschobenen personenbezogenen Feldern geprüft. |
| Logs | Bot-Auswertung mit drei Nachweisstufen. IP-Adressen werden beim Einlesen gekürzt. |

### Was ausdrücklich NICHT geändert wurde

- Keine neuen Ratgeber, keine Bezirksseiten, keine PLZ-Seiten. Der Auftrag
  schließt das aus, und es wäre der falsche Hebel gewesen.
- Keine URL wurde geändert, keine indexierte Seite entfernt.
- Die Landingpage und ihre Markenwirkung sind unangetastet.
- Kein Framework-Wechsel, keine neue Laufzeitabhängigkeit. Das Projekt hat
  weiterhin genau eine: Astro.
- `focusServices` der Bezirksseiten wurden **nicht** umgeschrieben, um den
  Autoritätsfluss zu lenken. Sie sind eine inhaltliche Aussage darüber, was
  im Gebiet nachgefragt wird. Verändert wurde nur ihre Reihenfolge.

---

# Gemessener Stand

## Überblick

| Prüfung | Fehler | Warnungen |
|---|---:|---:|
| Metadaten und Seitenkarte | 0 | 1 |
| Linkgraph und interne Autorität | 0 | 11 |
| Keyword-Kannibalisierung | 0 | 0 |
| Strukturierte Daten und Unternehmens-Entity | 0 | 0 |
| Bilder | 0 | 1 |
| Kontrast (WCAG 2.2 AA) | 0 | 3 |
| **Summe** | **0** | **16** |

> Keine blockierenden Fehler.

## Vollständige Ausgabe je Prüfung

### Metadaten und Seitenkarte

```
==================================================================
Metadaten und Seitenkarte
==================================================================
  70 gebaute Seiten, 70 Einträge in der Karte
  50 indexierbar, 50 in der Sitemap

WARNUNGEN (1)
  • /angebot-anfragen/
      primäre Suchanfrage "angebot entrümpelung anfordern berlin" taucht in Title und H1 kaum auf (25 % der Wörter)
      → Entweder die Überschrift an die Suchanfrage annähern oder in der Karte eine treffendere Suchanfrage eintragen
```

### Linkgraph und interne Autorität

```
==================================================================
Linkgraph und interne Autorität
==================================================================
  4767 interne Seitenverweise, 50 indexierbare Seiten
  Stärkste zehn Seiten nach internem Authority-Score:
       100  P4  /angebot-anfragen/  (175 kontextuell / 450 gesamt)
      23.1  P3  /einsatzberichte/  (27 kontextuell / 237 gesamt)
      20.5  P5  /  (1 kontextuell / 137 gesamt)
      16.5  P5  /leistungen/entruempelung-berlin/  (41 kontextuell / 110 gesamt)
      14.8  P3  /berlin/  (33 kontextuell / 252 gesamt)
      11.9  P3  /brandenburg/  (30 kontextuell / 111 gesamt)
      11.7  P5  /leistungen/haushaltsaufloesung-berlin/  (30 kontextuell / 99 gesamt)
      11.3  P3  /ueber-uns/  (13 kontextuell / 220 gesamt)
      10.9  P5  /leistungen/wohnungsaufloesung-berlin/  (30 kontextuell / 99 gesamt)
       8.8  P3  /leistungen/  (1 kontextuell / 223 gesamt)
  Durchschnittlicher Score je Priorität (nur Leistungsseiten, muss fallen): P5=11.7  P4=3.9  P3=5.8

WARNUNGEN (11)
  • /hausverwaltungen-immobilienpartner/
      Priorität 4, aber nur 2 kontextuelle Eingänge
      → Für eine Seite dieser Bedeutung sind mindestens drei redaktionelle Eingänge angemessen
  • /hausverwaltungen-immobilienpartner/ (P4) hinter /leistungen/kellerentruempelung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 4.9 Punkte, die unwichtigere 7.7
      → Prüfen, ob /hausverwaltungen-immobilienpartner/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /hausverwaltungen-immobilienpartner/ (P4) hinter /leistungen/umzug-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 4.9 Punkte, die unwichtigere 5
      → Prüfen, ob /hausverwaltungen-immobilienpartner/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/seniorenumzug-berlin/ (P4) hinter /leistungen/kellerentruempelung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 4.8 Punkte, die unwichtigere 7.7
      → Prüfen, ob /leistungen/seniorenumzug-berlin/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/seniorenumzug-berlin/ (P4) hinter /leistungen/umzug-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 4.8 Punkte, die unwichtigere 5
      → Prüfen, ob /leistungen/seniorenumzug-berlin/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/bueroaufloesung-berlin/ (P4) hinter /leistungen/kellerentruempelung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 3.2 Punkte, die unwichtigere 7.7
      → Prüfen, ob /leistungen/bueroaufloesung-berlin/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/bueroaufloesung-berlin/ (P4) hinter /leistungen/umzug-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 3.2 Punkte, die unwichtigere 5
      → Prüfen, ob /leistungen/bueroaufloesung-berlin/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/bueroaufloesung-berlin/ (P4) hinter /leistungen/sperrmuellabholung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 3.2 Punkte, die unwichtigere 4.6
      → Prüfen, ob /leistungen/bueroaufloesung-berlin/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/messiwohnung-raeumen/ (P4) hinter /leistungen/kellerentruempelung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 2.5 Punkte, die unwichtigere 7.7
      → Prüfen, ob /leistungen/messiwohnung-raeumen/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/messiwohnung-raeumen/ (P4) hinter /leistungen/umzug-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 2.5 Punkte, die unwichtigere 5
      → Prüfen, ob /leistungen/messiwohnung-raeumen/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
  • /leistungen/messiwohnung-raeumen/ (P4) hinter /leistungen/sperrmuellabholung-berlin/ (P3)
      Prioritätsumkehr: die wichtigere Seite hat 2.5 Punkte, die unwichtigere 4.6
      → Prüfen, ob /leistungen/messiwohnung-raeumen/ zusätzliche kontextuelle Eingänge verdient – oder ob die Priorität in src/data/seo-pages.ts nicht mehr stimmt
```

### Keyword-Kannibalisierung

```
==================================================================
Keyword-Kannibalisierung
==================================================================
  50 indexierbare Seiten im Vergleich
  1225 Seitenpaare verglichen. Ähnlichste Paare (Grenze: Standort 0.45/0.9, sonst 0.3/0.8):
     Jaccard 0.015  Cosinus 0.548  Überschr. 0.14  /kosten/kosten-sperrmuellabholung-berlin/ ↔ /leistungen/sperrmuellabholung-berlin/
     Jaccard 0.033  Cosinus 0.512  Überschr. 0.67  /kosten/kosten-seniorenumzug-berlin/ ↔ /leistungen/seniorenumzug-berlin/
     Jaccard 0.089  Cosinus 0.453  Überschr. 0.20  /kosten/kosten-sperrmuellabholung-berlin/ ↔ /ratgeber/sperrmuell-moebel-entsorgen-berlin/
     Jaccard 0.045  Cosinus 0.439  Überschr. 0.00  /brandenburg/ ↔ /brandenburg/potsdam/
     Jaccard 0.198  Cosinus 0.424  Überschr. 0.11  /kosten/ ↔ /leistungen/

  Keine Auffälligkeiten.
```

### Strukturierte Daten und Unternehmens-Entity

```
==================================================================
Strukturierte Daten und Unternehmens-Entity
==================================================================
  70 Seiten, Unternehmensquelle: src/config/site.ts
  erwartet: Telefon +49 176 86066817, E-Mail hello@schnellhelfer24.de, Ort Berlin
  1 Unternehmens-@id im Einsatz (erwartet: genau eine)

  Keine Auffälligkeiten.
```

### Bilder

```
==================================================================
Bilder
==================================================================
  7 Inhaltsbilder, 0 Hotlinks
  12 Bilddateien in IMAGE-SOURCES.md nachgewiesen

WARNUNGEN (1)
  • /leistungen/bueroaufloesung-berlin/
      Priorität 4 mit hinterlegtem Bildmotiv ("geräumte, saubere Gewerbefläche; Übergabe an Verwaltung"), aber ohne Inhaltsbild
      → Passendes Bild ergänzen – siehe imageTheme in src/data/seo-pages.ts und IMAGE-SOURCES.md
```

### Kontrast (WCAG 2.2 AA)

```
==================================================================
Kontrast (WCAG 2.2 AA)
==================================================================
  27 Farb-Tokens in :root
  37 erklärte Paare, 15 automatisch gefunden
  schwächstes geprüftes Paar: 3.05:1 – --line-contrast (#87877f) auf --paper-2 (#ecece6)

WARNUNGEN (3)
  • --ink-4 (#6b6b65) auf --paper-2 (#ecece6) – Meta-Zeilen auf Karten
      Kontrast 4.52:1 liegt nur knapp über der Grenze von 4.5:1
      → Bei der nächsten Farbanpassung Reserve einplanen, damit AA nicht versehentlich gerissen wird
  • --white (#ffffff) auf --accent (#d2400f) – primärer Button
      Kontrast 4.69:1 liegt nur knapp über der Grenze von 4.5:1
      → Bei der nächsten Farbanpassung Reserve einplanen, damit AA nicht versehentlich gerissen wird
  • --line-contrast (#87877f) auf --paper-2 (#ecece6) – Upload-Fläche
      Kontrast 3.05:1 liegt nur knapp über der Grenze von 3:1
      → Bei der nächsten Farbanpassung Reserve einplanen, damit AA nicht versehentlich gerissen wird
```

