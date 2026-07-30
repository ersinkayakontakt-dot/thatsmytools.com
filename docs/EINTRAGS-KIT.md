# Eintrags-Kit: dieselben Angaben für alle Portale

> **Diese Datei wird erzeugt.** Sie nicht von Hand ändern —
> `npm run kit` überschreibt sie. Quelle ist `src/config/site.ts`.
>
> Erzeugt am 30.7.2026.

Beim Anlegen eines Profils **nichts abtippen, sondern von hier kopieren.**
Eine einzige abweichende Schreibweise macht die Nennung wertlos: Sie wird
dann nicht als Bestätigung gelesen, sondern als Hinweis auf ein anderes
Unternehmen.

Warum das der zweitgrößte Hebel überhaupt ist, steht in
`docs/ENTITY-UND-RANKING.md`.

---

## Der Datenblock

| Feld | Wert zum Kopieren |
|---|---|
| Name (überall identisch) | Schnellhelfer24 |
| Vollständige Firmierung | Schnellhelfer24 – Inhaber Ersin Kaya |
| Rechtsform | Einzelunternehmen |
| Inhaber | Ersin Kaya |
| Telefon (international) | +49 176 86066817 |
| Telefon (Anzeigeform) | 0176 86066817 |
| WhatsApp | +49 176 86066817 |
| E-Mail | hello@schnellhelfer24.de |
| Anschrift | Lindenstr. 16, 10969 Berlin |
| Website | https://schnellhelfer24.de |
| Gründungsjahr | 2019 |

**Zur Anschrift:** `hasVisitableAddress` steht auf `false`.
Der Betrieb ist ein Dienstleistungsgebiet-Unternehmen. Die Adresse wird in Google und Bing **hinterlegt, aber nicht öffentlich angezeigt**. Stattdessen wird das Einsatzgebiet gepflegt. Beide Portale müssen dieselbe Aussage ergeben wie die Website.

### Erreichbarkeit

Mo–Fr: **FEHLT**  
Sa: **FEHLT**

> Solange hier **FEHLT** steht, in keinem Portal Zeiten eintragen. Erfundene Öffnungszeiten sind die Angabe, an der Kundschaft eine Firma am schnellsten als unseriös einstuft, weil sie sich sofort überprüfen lässt.

### Kurzbeschreibung (bis ca. 200 Zeichen)

> Entrümpelung, Haushaltsauflösung und Umzug in Berlin und im Umland. Einschätzung nach Fotos oder Besichtigung, feste Absprache vor Beginn, auf Wunsch besenreine Übergabe.

### Namensvarianten

- Schnellhelfer 24
- Schnellhelfer24 Berlin
- Schnellhelfer24 Entrümpelung

Diese Schreibweisen **nicht** als Profilnamen verwenden. Der Profilname ist
überall `Schnellhelfer24`, ohne Zusatz und ohne Suchbegriffe. Keywords im
Namen verstoßen gegen die Richtlinien von Google und kosten im Zweifel das
Profil.

### Abgrenzung zu ähnlichen Namen

Für Profilfelder, die einen längeren Text erlauben:

> Schnellhelfer24 ist ein eigenständiger Berliner Dienstleistungsbetrieb für Entrümpelung, Haushaltsauflösung, Wohnungsauflösung, Nachlassauflösung und Umzüge in Berlin und im angrenzenden Brandenburg. Das Unternehmen gehört zu keiner Kette und steht in keiner Verbindung zu ähnlich benannten Anbietern wie DeineHelfer24, PflegeHelfer24 oder anderen Diensten mit der Endung „helfer24".

---

## Einsatzgebiet

Pankow, Marzahn-Hellersdorf, Charlottenburg-Wilmersdorf, Mitte, Friedrichshain-Kreuzberg, Spandau, Steglitz-Zehlendorf, Tempelhof-Schöneberg, Neukölln, Treptow-Köpenick, Lichtenberg, Reinickendorf, Potsdam, Falkensee

Nur Gebiete eintragen, die tatsächlich bedient werden.
**Offen:** Das tatsächliche Einsatzgebiet ist in `areaServed.note` noch nicht bestätigt.

## Leistungen

Mit **denselben Bezeichnungen** wie auf der Website eintragen, einzeln, nicht
als Fließtext.

| Leistung | Kurztext |
|---|---|
| Entrümpelung in Berlin | Einzelne Räume oder ganze Objekte leerräumen, abtransportieren und getrennt entsorgen. |
| Haushaltsauflösung in Berlin | Kompletter Hausrat: sichten, Verwertbares anrechnen, den Rest fachgerecht entsorgen. |
| Wohnungsauflösung in Berlin | Mietwohnung fristgerecht leer bekommen, inklusive Einbauten und Übergabetermin. |
| Nachlassauflösung in Berlin | Wohnung nach einem Todesfall auflösen. Unterlagen werden gesichert, Termine richten sich nach Ihnen. |
| Stark vermüllte Wohnung räumen | Diskrete Räumung stark vermüllter Wohnungen. Ohne Vorwurf, ohne Aufsehen im Haus. |
| Sperrmüll und Möbel abholen lassen in Berlin | Einzelne Möbel oder Kleinmengen direkt aus der Wohnung abholen lassen. |
| Umzug in Berlin | Von der Halteverbotszone bis zum Aufbau am Zielort. Vorher klar abgestimmt. |
| Seniorenumzug in Berlin | Umzug in kleinere Wohnung, betreutes Wohnen oder Pflegeheim. Mit mehr Zeit und Absprache. |
| Keller entrümpeln lassen in Berlin | Kellerabteile und ganze Kellergeschosse leerräumen, auch für Hausverwaltungen. |
| Büroauflösung in Berlin | Gewerbeflächen räumen, Akten gesondert behandeln, termingerecht übergeben. |

## Bilder

| Zweck | Datei |
|---|---|
| Logo (quadratisch, 512 × 512) | https://schnellhelfer24.de/logo.png |
| Vorschaubild | https://schnellhelfer24.de/og-default.png |

Echte Fotos von Fahrzeugen und Team haben Vorrang, sobald es welche gibt.
Profile mit echten Fotos werden deutlich häufiger angeklickt. Keine
Stockfotos, keine KI-Bilder.

---

## Bewertungen einsammeln

Der kurze Weg für Rechnung, Visitenkarte und QR-Code:

**https://schnellhelfer24.de/bewerten/**

Die Seite ist `noindex` und leitet auf das Google-Bewertungsformular
weiter. Ändert sich der Google-Link, ändert sich nur
`site.reviewLink` — nicht das bereits gedruckte Material.

**Noch nicht hinterlegt.** Im Google-Unternehmensprofil unter „Rezensionen" auf „Mehr Rezensionen erhalten" gehen. Google erzeugt dort einen Link der Form https://g.page/r/…/review, der mit einem Klick direkt ins Bewertungsfenster führt. Diesen in `site.reviewLink` eintragen. Bis dahin öffnet /bewerten/ nur den Karteneintrag — das kostet zwei Klicks, und jeder Klick kostet Bewertungen.

Keine Gutscheine, keine Rabatte, keine Gewinnspiele als Gegenleistung. Das
ist nach UWG abmahnfähig, und Google löscht solche Bewertungen.

---

## Reihenfolge der Portale

Nach Wirkung sortiert. Nach jedem angelegten Profil die URL in
`src/config/site.ts` unter `profiles` eintragen — sie wird dann
automatisch als `sameAs` ausgezeichnet, und der Kreis schließt sich:
Die Website nennt die Profile, die Profile nennen die Website.

### Stufe 1 — Karten und Suche

- [ ] **Google-Unternehmensprofil** — Kategorien: *Entrümpelungsdienst*
      (primär), *Umzugsunternehmen*, *Entsorgungsunternehmen*. Die genauen
      Bezeichnungen aus der Auswahlliste des Portals übernehmen.
- [ ] **Bing Webmaster Tools** — Sitemap https://schnellhelfer24.de/sitemap.xml einreichen
- [ ] **Bing Places** — Import aus dem Google-Profil möglich, Angaben danach
      trotzdem gegen diese Datei prüfen
- [ ] **Apple Business Connect** — kostenlos, speist Apple Karten und Siri

### Stufe 2 — Branchenverzeichnisse

- [ ] Gelbe Seiten
- [ ] Das Örtliche
- [ ] 11880
- [ ] Cylex
- [ ] GoLocal
- [ ] OpenStreetMap
- [ ] wlw (nur B2B sinnvoll)

### Stufe 3 — Eigene Kanäle

- [ ] LinkedIn-Unternehmensseite
- [ ] Facebook-Seite
- [ ] Instagram-Profil

---

## Stand der Profile

Bereits eingetragen und als `sameAs` ausgezeichnet:

- googleBusiness: https://www.google.com/maps?cid=17944767786079972495
- youtube: https://www.youtube.com/channel/UCEoMRI2OM4uR-wfm8Gh2b8Q

Noch offen in `site.profiles`:

- [ ] bingPlaces
- [ ] appleMaps
- [ ] gelbeSeiten
- [ ] dasOertliche
- [ ] elf1880
- [ ] cylex
- [ ] golocal
- [ ] provenExpert
- [ ] linkedin
- [ ] facebook
- [ ] instagram
