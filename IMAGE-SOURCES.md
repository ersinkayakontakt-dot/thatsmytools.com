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

Die folgenden Stockfotos stammen von **Pexels**. Die Pexels-Lizenz erlaubt die
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
AVIF, WebP und JPEG in mehreren zum Layout passenden Breiten ausgeliefert. Die Originale wurden auf
2400 px Breite reduziert – die Quelldateien haben 6000 bis 8000 px und
hätten das Repository unnötig aufgebläht.

### Bauleistungen: ergänzt am 19.10.2026

Fünf Pexels-Motive vor der Übernahme visuell geprüft. Auf Startseite und Leistungsseiten sichtbar als Beispielbild bezeichnet; keine eigenen Referenzaufträge. Lizenz beim Abruf: Pexels-Lizenz, kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich. Quelle: https://www.pexels.com/license/

| Datei | Fotograf | Originalseite | Abruf | Verwendung | Personen | Austausch |
|---|---|---|---|---|---|---|
| `innenausbau-heller-raum.jpg` | Josh Kobayashi | [Pexels](https://www.pexels.com/photo/room-during-renovation-5404462/) | 2026-10-19 | Startseite und `/leistungen/innenausbau-berlin/` | nein | eigene Auftragsfotos offen |
| `trockenbau-innenraum.jpg` | Pavel Danilyuk | [Pexels](https://www.pexels.com/photo/interior-of-unfinished-building-with-white-paint-7937303/) | 2026-10-19 | nicht mehr eingesetzt (20.10.2026) | nein | fachlich ersetzt |
| `rueckbau-bestandsraum.jpg` | Francesco Ungaro | [Pexels](https://www.pexels.com/photo/major-home-renovation-15798781/) | 2026-10-19 | Startseite und `/leistungen/demontage-rueckbau/` | nein | eigene Auftragsfotos offen |
| `boden-laminat-verlegung.jpg` | 8 K (Kelly) | [Pexels](https://www.pexels.com/photo/crop-man-installing-laminate-flooring-4263067/) | 2026-10-19 | Startseite und `/leistungen/bodenbelag-verlegen-berlin/` | ja | eigene Auftragsfotos offen |
| `kuechenmontage-einbaukueche.jpg` | Peter Vang | [Pexels](https://www.pexels.com/photo/bright-modern-kitchen-with-wood-flooring-35618257/) | 2026-10-19 | Startseite und `/leistungen/kuechenmontage-berlin/` | nein | eigene Auftragsfotos offen |

### Korrektur und Erweiterung am 20.10.2026

Sechs weitere Motive visuell geprüft. Das bisherige Foto trockenbau-innenraum.jpg zeigt lediglich einen unfertigen Raum und ist für Trockenbau fachlich nicht aussagekräftig; am 20.10.2026 aus der Bild-Registry entfernt. Ersatz: erkennbarer Gipskartonzuschnitt und Plattenfugen. Das Tapeziermotiv wurde auf Hände und Tapetenrollen zugeschnitten. Alle Motive bleiben sichtbar als Beispielbilder gekennzeichnet.

Lizenz beim Abruf: Pexels-Lizenz, kostenlose Nutzung und Bearbeitung; Namensnennung nicht erforderlich. https://www.pexels.com/license/

| Datei | Fotograf | Originalseite | Abruf | Verwendung | Personen | Austausch |
|---|---|---|---|---|---|---|
| `trockenbau-gipskarton-zuschnitt.jpg` | Jimmy Nilsson Masth | [Pexels](https://www.pexels.com/photo/man-cutting-a-plasterboard-11427405/) | 2026-10-20 | Trockenbau, Startseite | ja | eigene Auftragsfotos offen |
| `trockenbau-plattenfugen.jpg` | Antoni Shkraba | [Pexels](https://www.pexels.com/photo/a-construction-worker-working-at-site-5493673/) | 2026-10-20 | Trockenbau, Innenausbau | ja | eigene Auftragsfotos offen |
| `malerarbeiten-farbrolle.jpg` | Blue Bird | [Pexels](https://www.pexels.com/photo/person-painting-the-wall-with-a-roller-7218578/) | 2026-10-20 | Malerarbeiten, Innenausbau, Startseite | ja | eigene Auftragsfotos offen |
| `tapezieren-tapetenrollen.jpg` | Nataliya Vaitkevich | [Pexels](https://www.pexels.com/photo/woman-carrying-rolls-of-wallpaper-5641758/) | 2026-10-20 | Tapezieren, Startseite | ja (Hände) | eigene Auftragsfotos offen |
| `bueroaufloesung-arbeitsflaeche.jpg` | cottonbro studio | [Pexels](https://www.pexels.com/photo/an-empty-office-5483236/) | 2026-10-20 | Büroauflösung | nein | eigene Auftragsfotos offen |
| `umzug-kartons-tragen.jpg` | Ketut Subiyanto | [Pexels](https://www.pexels.com/photo/man-and-woman-carrying-carton-box-4246009/) | 2026-10-20 | Umzug | ja | eigene Auftragsfotos offen |

### Möbelmontage: ergänzt am 21.10.2026

| Datei | Fotograf | Originalseite | Abruf | Verwendung | Lizenz | Personen |
|---|---|---|---|---|---|---|
| `moebelmontage-anleitung-werkzeug.jpg` | Athena Sandrini | [Pexels 5805485](https://www.pexels.com/photo/instruction-to-furniture-assembly-with-instruments-5805485/) | 2026-10-21 | Startseite und Möbelmontage | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |

Motiv vor Einbau angesehen, als Beispielbild gekennzeichnet; kein eigener Referenzauftrag.

### Seiten ohne Bild und Ratgeber: ergänzt am 21.10.2026 (BILD-2026-03)

76 Kandidaten über `npm run images:fetch` geholt (Themen `messiwohnung`, `sperrmuell`, `keller`, `bodenvergleich`, `verkaufsfertig`), jeden als Kontaktbogen und die Favoriten in voller Größe angesehen. Abruf in 2400 px Breite über die Pexels-Bild-URL. Alle als Beispielbild gekennzeichnet; Bilder mit Personen erhalten zusätzlich automatisch den Symbolbild-Hinweis.

| Datei | Fotograf | Originalseite | Abruf | Verwendung | Lizenz | Personen |
|---|---|---|---|---|---|---|
| `messiwohnung-muellsack-handschuhe.jpg` | Carlos Daniel | [Pexels 12316616](https://www.pexels.com/photo/trash-on-the-garbage-bag-12316616/) | 2026-10-21 | `/leistungen/messiwohnung-raeumen/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `sperrmuell-tisch-heraustragen.jpg` | Blue Bird | [Pexels 7218131](https://www.pexels.com/photo/man-carrying-a-wooden-table-7218131/) | 2026-10-21 | `/leistungen/sperrmuellabholung-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Gesicht, klein) |
| `keller-kartons-hinter-gitter.jpg` | Mathias Reding | [Pexels 11666897](https://www.pexels.com/photo/bars-in-a-window-11666897/) | 2026-10-21 | `/leistungen/kellerentruempelung-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `boden-dielenmuster-vergleich.jpg` | Gerzon Piñata | [Pexels 24366011](https://www.pexels.com/photo/close-up-of-a-woman-holding-wood-samples-24366011/) | 2026-10-21 | `/ratgeber/laminat-oder-vinyl-mietwohnung/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `verkaufsfertig-leere-wohnung.jpg` | Max Vakhtbovych | [Pexels 8146335](https://www.pexels.com/photo/spacious-empty-room-with-parquet-flooring-8146335/) | 2026-10-21 | `/ratgeber/geerbte-wohnung-verkaufsfertig-machen/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |

Auswahlgründe und Aussortiertes:

- **Messiwohnung:** nur Handschuhe und Müllsack – weder Bewohner noch Wohnräume, also weder beschönigend noch bloßstellend (der frühere Grund für „bewusst ohne Bild"). Der rote Ärmelaufdruck ist unscharf und nicht lesbar, kein erkennbares Fremdlogo. Aussortiert: Schutzanzug im Wohnzimmer (dramatisierend, wirkt wie Desinfektion), Sortieranlagen und Straßenszenen (kein Wohnungsbezug).
- **Sperrmüll:** Aussortiert: Sofas und Sessel auf der Straße vor Graffiti oder Bruchbuden (Elendsmotiv, erkennbar nicht Berlin) und Gefängniszellen-Treffer der Suche „old mattress".
- **Keller:** Der erste Lauf brachte nur Weinkeller und Lagerhallen. Zweiter Lauf mit neuen Suchbegriffen; gewählt das vergitterte Kellerfenster, weil es einem deutschen Kellerabteil am nächsten kommt. Aussortiert: US-Hobbykeller, Lagerhallen, englisch beschriftete Kartons.
- **Leere Wohnung:** Nr. 04 der Kandidaten war dieselbe Wohnung wie `wohnungsaufloesung-leere-wohnung.jpg` – aussortiert, damit nicht zwei Seiten dasselbe Objekt zeigen. Gewählt eine andere Wohnung mit europäischen Heizkörpern.

### Ratgeber- und Kostenseiten: ergänzt am 23.10.2026 (BILD-2026-04)

155 Kandidaten aus 13 Themen über `npm run images:fetch`, jeder Kontaktbogen angesehen, Favoriten mit Schrift oder möglichen Logos zusätzlich in voller Größe. Abruf in 2400 px Breite. Alle als Beispielbild gekennzeichnet, mit Personen zusätzlich als Symbolbild.

| Datei | Fotograf | Originalseite | Abruf | Verwendung | Lizenz | Personen |
|---|---|---|---|---|---|---|
| `ratgeber-angebote-vergleichen.jpg` | RDNE Stock project | [Pexels 7821540](https://www.pexels.com/photo/person-working-on-documents-7821540/) | 2026-10-23 | `/ratgeber/innenausbau-angebote-vergleichen/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `kosten-entruempelung-dachzimmer.jpg` | Đặng Thanh Tú | [Pexels 19271472](https://www.pexels.com/photo/cafe-interior-with-vintage-furniture-and-decor-19271472/) | 2026-10-23 | `/kosten/was-kostet-eine-entruempelung-in-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `kosten-haushalt-altbauzimmer.jpg` | Karl Solano | [Pexels 5317149](https://www.pexels.com/photo/disorganized-furniture-in-abandoned-house-5317149/) | 2026-10-23 | `/kosten/kosten-haushaltsaufloesung-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `kosten-sperrmuell-alte-moebel.jpg` | Arti Kh | [Pexels 15864302](https://www.pexels.com/photo/vintage-abandoned-interior-15864302/) | 2026-10-23 | `/kosten/kosten-sperrmuellabholung-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `kosten-seniorenumzug-packen.jpg` | Vy Van Bui | [Pexels 35821967](https://www.pexels.com/photo/elderly-man-carrying-cardboard-boxes-outdoors-35821967/) | 2026-10-23 | `/kosten/kosten-seniorenumzug-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Gesicht) |
| `ratgeber-fotos-smartphone.jpg` | Tima Miroshnichenko | [Pexels 6474473](https://www.pexels.com/photo/person-holding-black-iphone-6474473/) | 2026-10-23 | `/ratgeber/welche-fotos-fuer-ein-angebot/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `ratgeber-entruempelung-packen.jpg` | SHVETS production | [Pexels 7203849](https://www.pexels.com/photo/crop-faceless-woman-packing-belongings-into-cardboard-box-before-relocation-7203849/) | 2026-10-23 | `/ratgeber/entruempelung-vorbereiten/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `ratgeber-uebergabe-protokoll.jpg` | Tima Miroshnichenko | [Pexels 6169648](https://www.pexels.com/photo/a-person-filling-up-a-form-on-a-clipboard-6169648/) | 2026-10-23 | `/ratgeber/checkliste-wohnungsuebergabe/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hände) |
| `ratgeber-nachlass-sekretaer.jpg` | Brett A | [Pexels 38545752](https://www.pexels.com/photo/vintage-wooden-desk-with-writing-supplies-38545752/) | 2026-10-23 | `/ratgeber/haushaltsaufloesung-nach-todesfall/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `ratgeber-halteverbot-schild.jpg` | Reinis Brūzītis | [Pexels 33548609](https://www.pexels.com/photo/brick-wall-with-no-parking-sign-on-street-corner-33548609/) | 2026-10-23 | `/ratgeber/halteverbotszone-berlin-umzug/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |
| `ratgeber-antrag-ausfuellen.jpg` | Tima Miroshnichenko | [Pexels 7567551](https://www.pexels.com/photo/a-hand-holding-a-pen-7567551/) | 2026-10-23 | `/ratgeber/umzugskosten-jobcenter-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Hand) |
| `ratgeber-sofa-heraustragen.jpg` | RDNE Stock project | [Pexels 7464722](https://www.pexels.com/photo/man-in-blue-denim-jeans-sitting-on-green-sofa-7464722/) | 2026-10-23 | `/ratgeber/sperrmuell-moebel-entsorgen-berlin/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | ja (Gesicht, seitlich) |
| `ratgeber-checkliste-haken.jpg` | Tara Winstead | [Pexels 8850706](https://www.pexels.com/photo/red-check-mark-over-black-box-8850706/) | 2026-10-23 | `/ratgeber/wohnungsaufloesung-checkliste-pdf/` | Pexels-Lizenz: kostenlose Nutzung und Bearbeitung, Namensnennung nicht erforderlich | nein |

Aussortiert, unter anderem: Umzugswagen mit US-Firmenaufschriften (U-Haul, „Moving Company“, DHL); ein Lastwagen in einer erkennbar südostasiatischen Straße für die Berliner Halteverbotsseite (stattdessen zweiter Suchlauf, echtes deutsches Halteverbotsschild); zwei Personen mit Bettgestell vor Burger-King-Logo und Ladenschildern; Kartons mit englischer Beschriftung („Keep/Donate/Trash“, „Winter Cloths“, „Kitchen“); Maskenträger (datiert das Bild); verfallene Räume und Straßenmüll als Elendsmotiv.

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
| Startseiten-Hero | Bleibt typografisch. Der folgende Bauleistungsbereich enthält seit 19.10.2026 fünf Beispielbilder. |
| `/leistungen/messiwohnung-raeumen/` | Bis 21.10.2026 bewusst ohne Bild (jedes Motiv beschönigend oder bloßstellend). Seitdem neutrales Arbeitsmotiv ohne Bewohner und Räume, siehe BILD-2026-03 oben. |
| `/leistungen/bueroaufloesung-berlin/` | Seit 20.10.2026 mit Beispielbild einer Bürofläche ausgestattet; eigenes Auftragsfoto weiterhin offen. |

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
