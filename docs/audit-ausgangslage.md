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
