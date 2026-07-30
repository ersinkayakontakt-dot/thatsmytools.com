# Handoff: maximale Auffindbarkeit weiterbauen

Stand: 30.07.2026, Branch `claude/schnellhelfer24-rebuild-nn7fwd`, letzter
Commit `e3a2e00`. Arbeitsverzeichnis sauber, Build grün.

Diese Datei sagt, **was als Nächstes den größten Effekt auf die
Auffindbarkeit hat, in welcher Reihenfolge und woran fertig erkennbar ist.**
Sie ersetzt keine der beiden Pflichtdateien: offene Inhalte stehen in
`CONTENT-TODO.md`, der Launchablauf in `SEO-LAUNCH-CHECKLIST.md`.

## Live-Deployment bei Hostinger

Die Domain `schnellhelfer24.de` ist in Hostinger mit dem Repository
`ersinkayakontakt-dot/thatsmytools.com` verbunden. Hostinger muss den Branch
`hostinger-live` nach `public_html` deployen. Dieser Branch enthält nur den
fertigen Inhalt aus `dist/`.

Den Astro-Quellbranch
`claude/schnellhelfer24-rebuild-nn7fwd` niemals direkt nach `public_html`
deployen: Hostinger führt dabei keinen Astro-Build aus und die Domain liefert
ohne `index.html` einen HTTP-403-Fehler.

Vor einem künftigen Livegang zuerst die vier Prüfungen ausführen, danach
`dist/` als neuen Stand von `hostinger-live` veröffentlichen und in Hostinger
neu deployen. Der am 30.07.2026 geprüfte Live-Stand basiert auf Quellcommit
`8c3e562` und Build-Commit `fd43637`.

---

## Zuerst lesen

1. `CONTENT-TODO.md` § 0 – was beim Umbau auf Komplettaufträge schon
   umgesetzt ist und was offen blieb.
2. `SEO-LAUNCH-CHECKLIST.md` – Kopfabschnitt „Was in KI-Antworten wirklich
   zählt" und die Abschnitte „Strukturierte Daten und KI-Auffindbarkeit"
   sowie „Analytics und Consent".
3. `src/lib/publishGuard.ts` – **die Datei entscheidet, ob eine Seite
   überhaupt indexiert wird.** Wer sie nicht kennt, schreibt Inhalte, die
   danach auf `noindex` stehen.

## Grundregeln, die nicht verhandelbar sind

- **Nichts erfinden.** Keine Bewertungen, Referenzkunden, Einsätze,
  Zertifikate, Partnerlogos, Preisbeispiele, Mitarbeiterzahlen. Unbekannte
  Unternehmensdaten bleiben Platzhalter in eckigen Klammern; `isPlaceholder()`
  blendet sie überall automatisch aus.
- **Eine Quelle pro Angabe.** Unternehmensdaten ausschließlich in
  `src/config/site.ts`. Nie im Markup wiederholen.
- **Cross-Layer prüfen.** Wer ein Formularfeld ergänzt, fasst vier Stellen an:
  `AufwandCheck.astro`, `anfrage-erhalten.astro`, `public/api/anfrage.php`
  und die Zusammenfassung. Wer einen Slug umbenennt, prüft `related`,
  `focusServices`, `situations.ts`, Navigation und Sitemap.
- **Nach jeder Änderung:** `npm run build && npm run check &&
  npm run audit:content && npm run audit:build`. Alle vier müssen sauber sein.

---

## Priorität 1 — Neun Bezirksseiten veröffentlichen

**Warum zuerst:** Das ist die größte indexierbare Fläche, die schon zur
Hälfte existiert. Aktuell sind **3 von 12** Bezirken veröffentlicht
(`pankow`, `marzahn-hellersdorf`, `charlottenburg-wilmersdorf`). Neun stehen
als Entwurf in `src/data/districts.ts` und liefern damit `noindex` –
darunter genau die wirtschaftlich interessanten Gebiete.

Reihenfolge nach Auftragswert:

1. `steglitz-zehlendorf` (Dahlem, Nikolassee, Wannsee, Zehlendorf)
2. `mitte` (Mitte, Moabit, Wedding, Tiergarten)
3. `tempelhof-schoeneberg`
4. `friedrichshain-kreuzberg`
5. `treptow-koepenick`
6. `reinickendorf`
7. `spandau`
8. `lichtenberg`
9. `neukoelln`

**Was der Publish Guard je Seite verlangt** (aus `publishGuard.ts`, exakt):

| Feld | Anforderung |
|---|---|
| `intro` | mindestens 2 Absätze, zusammen ≥ 350 Zeichen |
| `quarters` | ≥ 4 Ortsteile (stehen bereits drin) |
| `buildings` | ≥ 3 Angaben zur Gebäudesituation |
| `access` | ≥ 3 Angaben zu Zufahrt und Zugang |
| `faq` | ≥ 3 eigene Fragen, nicht kopiert |
| `focusServices` | ≥ 2 Slugs vorhandener Leistungen |
| `differentiator` | nicht leer – worin sich der Bezirk unterscheidet |
| `answer` | ≥ 120 Zeichen, 40–100 Wörter (Kurzantwort unter der H1) |
| `metaDescription` | ≥ 80 Zeichen, projektweit eindeutig |

Erst wenn alles erfüllt ist, `status: 'published'` setzen. Wer vorher
umschaltet, bekommt beim Build eine Warnung und die Seite bleibt trotzdem
`noindex` – die Regel lässt sich nicht umgehen.

**Inhaltlich:** reale logistische Besonderheiten beschreiben – Altbau ohne
Aufzug, Hinterhof, Vorgarten, lange Laufwege, Parksituation, Villengrundstück,
Diskretionsbedarf. Keine erfundenen Einsätze, keine Behauptung von
Ortskenntnis, die es nicht gibt. Kein Bezirk wird als „reich" bezeichnet.

**Fertig, wenn:** `npm run audit:content` die Seite nicht mehr als
unvollständig meldet, `audit:build` sie in der Sitemap führt und die
Description projektweit einmalig ist.

## Priorität 2 — Zehn Umlandorte, gleiche Regeln

`src/data/towns.ts`, aktuell 2 von 12 veröffentlicht. Entwürfe:
`teltow`, `kleinmachnow`, `hennigsdorf`, `oranienburg`, `bernau-bei-berlin`,
`ahrensfelde`, `hoppegarten`, `schoenefeld`, `koenigs-wusterhausen`,
`ludwigsfelde`.

**Vorher eine betriebliche Entscheidung einholen:** Welche Orte werden
tatsächlich angefahren und bis wohin? Eine Seite für einen Ort, den niemand
bedient, ist eine Doorway Page. Lieber vier ehrliche Orte als zehn leere.

## Priorität 3 — Erste echte Einsatzberichte

`src/data/cases.ts` – Struktur steht, es gibt drei Muster (`real: false`,
korrekt auf `noindex`). **Null echte Fälle.** Für lokale KI-Antworten und für
Vertrauen ist das der größte Hebel, den kein technischer Kniff ersetzt.

Pro Fall nötig: Leistung, Bezirk, Objektgröße, Räume, Etage, Aufzug,
Besonderheit, enthaltene Leistungen, Dauer, Personenzahl, realer Preis oder
Preisrahmen, Bilder, **schriftliche Kundenzustimmung**, Datum.
`checkCase()` blockiert die Veröffentlichung, solange `real: false` ist oder
noch Platzhalter im Text stehen.

Drei belegte Fälle schlagen dreißig erfundene. Ohne Zustimmung: nicht
veröffentlichen, auch nicht anonymisiert erfinden.

## Priorität 4 — Postleitzahlen als Datei

Es gibt **keine** PLZ-Daten im Projekt; die Formularprüfung testet nur fünf
Ziffern. Anlegen: `src/data/serviceAreas.ts` mit PLZ, Stadt, Bezirk,
Ortsteilen, `bedient`, `prioritaet`, `umlandpruefungNoetig`. Amtliche Quelle
verwenden.

Alle Verbraucher greifen auf dieselbe Datei zu: Formularprüfung,
Einsatzgebietsseite, Standortauswahl, strukturierte Daten. Prüfungen auf
Dubletten, ungültige PLZ, fehlende Berliner PLZ und widersprüchliche
Bezirkszuordnung gehören in `scripts/content-audit.mjs`.

**Keine eigene Seite je PLZ.** Postleitzahlen dienen der
Verfügbarkeitsprüfung, nicht der Seitenerzeugung.

## Priorität 5 — Sammelseite für Kleinaufträge

`/moebel-sperrmuell-abholung-berlin/` als eine starke Seite für Sofa,
Matratze, Schrank, Waschmaschine, Kühlschrank, Kellerreste – mit den
Qualifizierungsfragen (weitere Möbel? ganzer Raum? Keller? Übergabe geplant?).

**Achtung Konflikt:** `/leistungen/sperrmuellabholung-berlin/` bedient
dieselbe Suchintention. Entweder die alte Seite per `redirects` in
`astro.config.mjs` auf die neue leiten und alle internen Verweise umhängen
(`related` in `services.ts`, `situations.ts`, Startseite, Footer), oder die
neue Seite gar nicht bauen. Zwei konkurrierende Seiten sind schlechter als
eine.

---

## Was fertig ist und nicht angefasst werden muss

- Positionierung auf Komplettaufträge: Hero, Startseitenreihenfolge,
  Situationseinstiege, Meta-Daten
- `/hausverwaltungen-immobilienpartner/` inklusive Schema und Verlinkung
- Anfrageformular mit Umfang, Größe, Anlass und Zusatzleistungen über alle
  vier Schichten
- Kostenträger-Abschnitt auf `/kosten/` mit Prüfdatum
- `robots.txt`: Suchbots erlaubt (OAI-SearchBot, ChatGPT-User,
  PerplexityBot, Claude-SearchBot, Claude-User, DuckAssistBot,
  Applebot-Extended), Trainingssammler gesperrt
- `llms.txt` auf die neue Positionierung umgestellt, mit Anlässen und
  Kostenträger-Abschnitt
- Kontaktdaten, Anschrift, Firmierung vollständig in `src/config/site.ts`
- Impressum ohne Platzhalter; interne Hinweiskästen nur noch im Dev-Modus

## Offene Punkte, die niemand aus dem Code beantworten kann

Diese brauchen eine Antwort vom Betreiber, nicht Recherche:

- Empfängt `hello@schnellhelfer24.de` tatsächlich? (Testmail)
- AV-Vertrag mit Hostinger nach Art. 28 DSGVO abgeschlossen?
- Logfile-Speicherdauer beim Hoster, E-Mail-Anbieter für Anfragen
- USt-IdNr., Steuernummer oder Kleinunternehmerregelung nach § 19 UStG
- Echte Erreichbarkeitszeiten (`openingHours` steht auf Platzhaltern)
- Fahrzeuge über 3,5 t? Dann Erlaubnis nach § 3 GüKG ins Impressum
- Betriebshaftpflicht vorhanden? Nur dann darf sie erwähnt werden
- Welche Umlandorte werden wirklich bedient?
- Ist die Lindenstraße für Kundschaft aufsuchbar? Dann
  `hasVisitableAddress: true`

## Testanfrage vor dem Livegang

`public/api/anfrage.php` wurde um `umfang`, `flaeche`, `anlass` und
`zusatzleistungen[]` erweitert, konnte hier aber nicht ausgeführt werden
(kein PHP auf dem Entwicklungsrechner). Auf dem Server eine echte Anfrage
senden und prüfen, ob alle vier Angaben in der Mail und in der JSON-Ablage
unter `api/_storage/anfragen/` ankommen und ob der Betreff den Umfang enthält.
