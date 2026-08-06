# Bildquellen und Lizenznachweis

Diese Datei ist der Nachweis, woher jedes inhaltstragende Bild dieser
Website stammt und unter welcher Lizenz es verwendet wird.

`npm run seo:images` gleicht die ausgelieferten Bilddateien gegen die
Tabelle unten ab. Ein Bild ohne Eintrag lässt den Prüflauf scheitern und
blockiert damit die Veröffentlichung. Das ist Absicht: Ein Stockfoto ohne
belegbare Lizenz ist ein Abmahnrisiko, kein Gestaltungsdetail.

---

## Eigene Grafiken (keine Lizenzfrage)

| Datei | Herkunft | Zweck |
|---|---|---|
| `public/favicon.svg` | eigene Zeichnung im Repository | Browser-Symbol |
| `public/apple-touch-icon.png` | erzeugt aus `scripts/icon-template.html` | Startbildschirm-Symbol |
| `public/og-default.png` | erzeugt aus `scripts/og-template.html` | allgemeines Vorschaubild |
| `public/og/*.png` (7 Dateien) | erzeugt aus `scripts/og-template.html`, Texte aus `src/data/seo-pages.ts` | Vorschaubild je Prioritätsseite |

Alles eigene Erzeugnisse. Keine Nachweispflicht gegenüber Dritten.

---

## Stockfotos

Alle sieben stammen von **Pexels**. Die Pexels-Lizenz erlaubt die
kostenlose Nutzung, auch kommerziell, ohne Namensnennung
(<https://www.pexels.com/license/>). Die Namensnennung erfolgt hier
trotzdem – sie kostet nichts und macht den Nachweis prüfbar.

Ausgewählt am 06.08.2026 aus 84 Kandidaten. Jedes Bild wurde vor der
Übernahme angesehen.

| Datei | Fotograf | Originalseite | Abgerufen | Verwendet auf | Funktion | Personen | Austausch |
|---|---|---|---|---|---|---|---|
| `wohnungsaufloesung-leere-wohnung.jpg` | Max Vakhtbovych | [8146158](https://www.pexels.com/photo/white-room-with-wooden-flooring-8146158/) | 2026-08-06 | `/leistungen/wohnungsaufloesung-berlin/` | Hero | nein | offen |
| `schluesseluebergabe-wohnung.jpg` | Jakub Zerdzicki | [29998475](https://www.pexels.com/photo/hand-holding-house-keychain-symbolizing-real-estate-29998475/) | 2026-08-06 | `/leistungen/wohnungsaufloesung-berlin/` | Inline | ja (Hand) | offen |
| `entruempelung-gestapelte-kartons.jpg` | Kaboompics.com | [4498114](https://www.pexels.com/photo/stack-of-carton-boxes-and-books-on-shabby-table-4498114/) | 2026-08-06 | `/leistungen/entruempelung-berlin/` | Hero | nein | offen |
| `haushaltsaufloesung-geschirr-einpacken.jpg` | Ketut Subiyanto | [4246185](https://www.pexels.com/photo/crop-young-woman-packing-fragile-goods-for-transportation-4246185/) | 2026-08-06 | `/leistungen/haushaltsaufloesung-berlin/` | Hero | ja (Hände) | offen |
| `nachlass-fotokiste.jpg` | fish socks | [34384398](https://www.pexels.com/photo/exploring-vintage-family-photo-collection-in-shoebox-34384398/) | 2026-08-06 | `/leistungen/nachlassaufloesung-berlin/` | Hero | ja (Hand) | offen |
| `seniorenumzug-gespraech-generationen.jpg` | cottonbro studio | [7232043](https://www.pexels.com/photo/a-mother-and-daughter-looking-at-a-magazine-7232043/) | 2026-08-06 | `/leistungen/seniorenumzug-berlin/` | Hero | ja (Gesichter) | offen |
| `hausverwaltung-schluessel.jpg` | Pavel Danilyuk | [7937684](https://www.pexels.com/photo/close-up-shot-of-keychain-on-person-s-hand-7937684/) | 2026-08-06 | `/hausverwaltungen-immobilienpartner/` | Hero | ja (Hände) | offen |

Lizenzstatus beim Abruf, wörtlich von der Quellseite: *„Free to use.
Attribution is not required. Modification allowed."*

Alle Dateien liegen in `src/assets/` und werden über `astro:assets` als
AVIF, WebP und JPEG in vier Breiten ausgeliefert. Die Originale wurden auf
2400 px Breite reduziert – die Quelldateien haben 6000 bis 8000 px und
hätten das Repository unnötig aufgebläht.

### Was aussortiert wurde – und warum

Die Auswahl bestand nicht darin, die ersten sieben Treffer zu nehmen.
Aussortiert wurden unter anderem:

| Bild | Grund |
|---|---|
| Beratungsszene, Fotograf „AI25.Studio – AI GENERATIVE" | **KI-generierte Personen.** Der Auftrag schließt sie ausdrücklich aus. Ohne Ansehen des Bildes wäre es übernommen worden. |
| Wohnungsübergabe mit drei Personen | Alle drei tragen Mund-Nasen-Schutz. Das datiert das Bild sichtbar. |
| Person vor einem „FOR SALE"-Schild | Englisches Schild, erkennbar nicht Deutschland. |
| Ältere Frau mit Kopftuch auf dem Sofa | Haltung und Kopftuch sind als Krankheitsbild lesbar. Für eine Seite über Seniorenumzüge unangemessen. |
| Ältere Menschen beim Wäscheaufhängen vor gelbem Holzhaus | Skandinavisches Umfeld, kein Bezug zum Umzug. |
| Breit lächelnde Modelle vor Kartonwänden | „Künstlich lachende Models" – im Auftrag ausgeschlossen. |
| Karton mit Aufschrift „WINTER CLOTHS" | Englische Beschriftung. |
| Generische Bürohändedrücke im Anzug | Passt nicht zum Ton eines Handwerksbetriebs. |

### Seiten ohne Bild – bewusst

| Seite | Grund |
|---|---|
| Startseite | Der Hero ist rein typografisch aufgebaut. Ein Foto dort würde genau die Gestaltung verändern, die als Referenz für alle Unterseiten dient. Das Vorschaubild für soziale Netzwerke gibt es trotzdem. |
| `/leistungen/messiwohnung-raeumen/` | Jedes verfügbare Motiv wäre entweder beschönigend oder bloßstellend. In `src/data/seo-pages.ts` ist für diese Seite deshalb gar kein Bildmotiv hinterlegt. |
| `/leistungen/bueroaufloesung-berlin/` | Noch offen. Der Bild-Guard weist als Warnung darauf hin. |

---

## Was beim Ergänzen auszufüllen ist

Für **jedes** Stockfoto eine Zeile:

| Feld | Beispiel | Warum |
|---|---|---|
| Lokaler Dateiname | `wohnungsuebergabe-schluessel.jpg` | sprechend, nicht `pexels-12345.jpg` |
| Plattform | Pexels | wo es herkommt |
| Fotograf | Vorname Nachname | wie dort angegeben |
| Originalseite | vollständige URL der **Bildseite**, nicht der Bilddatei | dort steht die Lizenz |
| Abrufdatum | 2026-08-03 | Lizenzen ändern sich |
| Lizenzstatus beim Abruf | „Pexels-Lizenz, kommerzielle Nutzung ohne Namensnennung erlaubt" | wörtlich, wie auf der Seite gelesen |
| Verwendet auf | `/leistungen/wohnungsaufloesung-berlin/` | Auffindbarkeit bei Rückfragen |
| Bildfunktion | Hero / Inline | Ladeverhalten |
| Stockfoto | ja | steuert die Symbolbild-Kennzeichnung |
| Personen sichtbar | ja / nein | bei „ja" wird das Bild sichtbar als Symbolbild gekennzeichnet |
| Austauschstatus | offen / ersetzt am … | Fortschritt zu echten Einsatzbildern |

### Vorlage

```markdown
| Datei | Plattform | Fotograf | Originalseite | Abgerufen | Lizenz beim Abruf | Verwendet auf | Funktion | Stock | Personen | Austausch |
|---|---|---|---|---|---|---|---|---|---|---|
| dateiname.jpg | Pexels | Name | https://… | 2026-08-03 | Pexels-Lizenz, kommerziell frei | /leistungen/… | Hero | ja | ja | offen |
```

---

## Regeln, die nicht verhandelbar sind

1. **Kein Hotlinking.** Bilder werden heruntergeladen und über
   `src/assets/` ausgeliefert. `npm run seo:images` bricht bei einer
   fremden Domain im `src`-Attribut ab.
2. **Keine Bilder aus der Google-Bildersuche**, aus Blogs, von
   Agenturseiten oder von Wettbewerbern.
3. **Stockpersonen sind niemals „unser Team", „unsere Kunden" oder
   „ein echter Einsatz".** Zeigt ein Stockfoto Personen, setzt
   `Figure.astro` automatisch den Hinweis „Symbolbild." unter das Bild.
   Eine andere Darstellung wäre nach § 5 UWG irreführend.
4. **Keine Schockmotive.** Keine Müllberge, keine beschämenden
   Wohnungsbilder, keine weinenden oder hilflos dargestellten älteren
   Menschen. Die Seite `/leistungen/messiwohnung-raeumen/` trägt deshalb
   bewusst gar kein Bildmotiv in der Seitenkarte.
5. **Keine KI-erzeugten Personen.**
6. **Die endgültige Lizenzfreigabe liegt beim Betreiber.** Diese Datei
   dokumentiert, was zum Abrufzeitpunkt auf der Quellseite stand. Sie
   ersetzt keine eigene Prüfung vor dem Livegang.

---

## Ziel: echte Einsatzbilder

Stockfotos sind eine Übergangslösung. Jedes echte Bild aus einem
abgeschlossenen, freigegebenen Auftrag ist besser als das beste Stockfoto –
für das Vertrauen der Kundschaft ebenso wie für die lokale Auffindbarkeit.

Der Austausch ist bewusst billig gemacht: Datei in `src/assets/` ersetzen,
in `src/data/images.ts` `imageOrigin` auf `'company'` beziehungsweise
`'customer-approved'` stellen, hier die Zeile aktualisieren. Es muss keine
Seitenvorlage angefasst werden.

Was dafür pro Bild vorliegen muss, steht in `CONTENT-TODO.md`.
