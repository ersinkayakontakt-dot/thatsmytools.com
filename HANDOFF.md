# Handoff: maximale Auffindbarkeit weiterbauen

Stand: 30.07.2026, Branch `claude/schnellhelfer24-rebuild-nn7fwd`.
Inhaltsaudit, Typprüfung, Produktionsbuild und Build-Audit sind grün.

Diese Datei sagt, **was als Nächstes den größten Effekt auf die
Auffindbarkeit hat, in welcher Reihenfolge und woran fertig erkennbar ist.**
Sie ersetzt keine der beiden Pflichtdateien: offene Inhalte stehen in
`CONTENT-TODO.md`, der Launchablauf in `SEO-LAUNCH-CHECKLIST.md`.

## ⚠️ Befund 24.09.2026 — drei Quelldateien waren nie im Repository

`.gitignore` enthielt das Muster `data/` ohne führenden Schrägstrich.
In dieser Form trifft es **jede** Ebene, also auch `src/data/`. Dadurch
standen drei Dateien nie unter Versionskontrolle:

- `src/data/seo-pages.ts` — ohne sie bricht `npm run seo:metadata` ab
- `src/data/images.ts`
- `src/data/serviceAreas.ts` (am 24.09.2026 neu)

**Ein frischer Klon dieses Repositorys ließ sich nicht bauen.** Die
Live-Website ist davon nicht betroffen: Sie wird aus `dist/` über den
Branch `hostinger-live` ausgeliefert, und `dist/` entsteht lokal, wo die
Dateien vorhanden sind. Betroffen war der Quellstand.

Das Muster steht jetzt als `/data/` und ist damit an das
Wurzelverzeichnis gebunden. **Die drei Dateien müssen noch committet
werden** – ohne das bleibt der Quellstand unvollständig:

```bash
git add src/data/seo-pages.ts src/data/images.ts src/data/serviceAreas.ts
```

Lehre für künftige Datendateien: Nach dem Anlegen einmal
`git status --short src/data/` prüfen. Eine Datei, die dort nicht als
`??` auftaucht, ist unsichtbar – und fällt erst beim nächsten frischen
Klon auf.

---

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
neu deployen. Die tatsächlich ausgelieferte Quell- und Build-Version nach
jedem Livegang im Deployment-Protokoll festhalten.

> **Achtung, überholt.** Der folgende Abschnitt beschreibt den Stand vom
> 30.07.2026. Seither wurde das SEO-System ausgebaut (siehe
> `SEO-SYSTEM.md` und `SEO-AUDIT-REPORT.md`). Der aktuelle Quellstand ist
> **nicht** live; vor dem nächsten Deployment gilt die erweiterte
> Prüfliste oben.

**Live-Stand am 30.07.2026:** Quellcommit `173c3c9`, Buildcommit
`684c333`. 50 indexierbare URLs sind live. Alle zwölf Kosten- und
Ratgeberseiten haben mobil geprüfte, gegliederte Direktantworten ohne
horizontalen Überlauf. Der auf einem echten Mobilgerät gemeldete Spaltenfehler
in nummerierten Schrittlisten ist ebenfalls behoben und live auf 375 Pixel
Breite geprüft. Die drei neuen Ratgeber, der PDF-Download, Sitemap,
404-Verhalten und geschützte API-Pfade wurden von außen geprüft. IndexNow
nahm nach dem Layout-Fix 13 geänderte URLs mit HTTP 200 an.
Google Search Console erkennt 50 Sitemap-URLs; für die drei neuen Ratgeber
wurde die Indexierung beantragt. Der offizielle Rich-Results-Test erkennt
beim Jobcenter-Ratgeber vier gültige Elementtypen. Der einzige verbleibende
optionale Hinweis ist das bewusst fehlende `priceRange`, solange keine
belastbaren Preisdaten vorliegen.

---

## Zuerst lesen

0. **`CLAUDE.md`** – seit 26.09.2026 die Betriebsanleitung des Projekts:
   die drei tragenden Regeln, das vollständige Pflicht-Gate, die
   Cross-Layer-Karte, die geprüften Deployment-Werte und die Fallen, die
   schon einmal Zeit gekostet haben. Die Regeln unten in dieser Datei
   bleiben gültig; `CLAUDE.md` ordnet sie und ergänzt, was dort fehlte.
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

  **Fünfte Stelle seit 24.09.2026:** Wer ein Feld ergänzt, das tatsächlich
  **übertragen und gespeichert** wird, trägt es zusätzlich in
  `src/pages/datenschutz.astro` § 4 ein. Die Seite zählt auf, was
  verarbeitet wird – ein Feld, das dort fehlt, ist kein Schönheitsfehler,
  sondern eine unvollständige Auskunft. Rein anzeigende Felder betrifft
  das nicht.

  **Neu seit 24.09.2026:** Auf der Astro-Seite steht das Muster einer
  Postleitzahl ausschließlich in `PLZ_PATTERN`
  (`src/data/serviceAreas.ts`). Es speist das `pattern`-Attribut des
  Feldes und die RegExp im Formularskript. Wer es dort neu hinschreibt,
  baut die dritte Kopie wieder auf, die gerade entfernt wurde.

  **Zweite, unvermeidbare Kopie:** `public/api/anfrage.php` prüft die PLZ
  serverseitig mit einem eigenen `preg_match('/^\d{5}$/')`. PHP kann das
  TypeScript-Modul nicht importieren, und die Serverprüfung darf ohnehin
  nicht von der Clientseite abhängen. Wer das Muster ändert, ändert beide
  Stellen.

  **Neu seit 06.08.2026 – zwei weitere Schichten:**
  Wer eine Seite anlegt oder umbenennt, braucht auch einen Eintrag in
  `src/data/seo-pages.ts`; ohne ihn schlägt `npm run seo:metadata` fehl.
  Wer ein Mess-Ereignis ergänzt, trägt den Namen zusätzlich in
  `ALLOWED_EVENTS` in `public/api/events.php` ein – sonst verwirft der
  Endpunkt es stillschweigend. `npm run seo:events` prüft genau das.
  Diese Prüfung existiert, weil die Namen bereits einmal auseinanderliefen.
- **Nach jeder Änderung:** 

  ```bash
  npm run build && npm run check && npm run audit:content && npm run audit:build && npm run seo:all
  ```

  Alle fünf müssen sauber sein. `npm run seo:all` ist seit dem 06.08.2026
  der eigentliche Torwächter: Er bündelt Metadaten-, Linkgraph-,
  Kannibalisierungs-, Schema-, Bild- und Kontrastprüfung. Was er als
  FEHLER meldet, blockiert die Veröffentlichung; Warnungen brauchen eine
  redaktionelle Entscheidung.

  Zusätzlich, wenn Prüfregeln oder Ereignisnamen angefasst wurden:
  `npm run seo:selftest` (14 absichtliche Verletzungen müssen alle
  erkannt werden) und `npm run seo:events`.

  Wer `validateServiceAreas()` in `src/data/serviceAreas.ts` anfasst,
  führt zusätzlich `npm run audit:plz:selftest` aus – 13 Gegenbeispiele
  plus eine Gegenprobe mit sauberen Daten. Diese Prüfung ist nicht
  optional: Solange `serviceAreas` leer ist, läuft jede Schleife der
  Prüffunktion über nichts und meldet folgenlos „in Ordnung".

  Wer `public/api/lib/smtp.php` anfasst, führt
  `npm run audit:mail:selftest` aus – 14 Fälle, die ein echtes
  SMTP-Gespräch gegen einen Testserver fahren. Ebenfalls nicht optional:
  Ein Fehler im Versand äußert sich als „die Mail kommt nicht an", also
  als genau das Symptom, das dieser Code beheben soll. Dazu
  `php -l public/api/anfrage.php` und `php -l public/api/lib/smtp.php`.

  Die vollständige Beschreibung des Systems steht in `SEO-SYSTEM.md`.

---

## Erledigt am 30.07.2026 — Neun Bezirksseiten veröffentlicht

Alle **12 von 12** Berliner Bezirken sind nun indexierbar. Die neun neuen,
eigenständigen Inhalte liegen in `src/data/additionalDistricts.ts`. Sie
behaupten keine konkreten Einsätze, sondern erklären objektive Gebäude-,
Zugangs- und Verkehrssituationen. Der Berlin-Hub verlinkt alle Bezirke.

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

**Der verschärfte Publish Guard verlangt je Seite:**

| Feld | Anforderung |
|---|---|
| `intro` | mindestens 2 Absätze, zusammen ≥ 350 Zeichen |
| `quarters` | ≥ 2 Ortsteile |
| `buildings` | ≥ 3 Angaben zur Gebäudesituation |
| `access` | ≥ 3 Angaben zu Zufahrt und Zugang |
| `faq` | ≥ 3 eigene Fragen, nicht kopiert |
| `focusServices` | ≥ 2 Slugs vorhandener Leistungen |
| `differentiator` | nicht leer – worin sich der Bezirk unterscheidet |
| `answer` | ≥ 120 Zeichen, 40–100 Wörter (Kurzantwort unter der H1) |
| `metaDescription` | ≥ 80 Zeichen, projektweit eindeutig |
| Gesamtinhalt | ≥ 1.800 Zeichen und mindestens 2 Inhaltsblöcke |

`scripts/content-audit.mjs` vergleicht veröffentlichte Standorttexte
zusätzlich auf starke Wortmengen-Überschneidung. Dadurch werden spätere
Ortstausch-Templates als Fehler gemeldet.

## Priorität 1 — Zehn Umlandorte, gleiche Regeln

`src/data/towns.ts`, aktuell 2 von 12 veröffentlicht. Entwürfe:
`teltow`, `kleinmachnow`, `hennigsdorf`, `oranienburg`, `bernau-bei-berlin`,
`ahrensfelde`, `hoppegarten`, `schoenefeld`, `koenigs-wusterhausen`,
`ludwigsfelde`.

**Vorher eine betriebliche Entscheidung einholen:** Welche Orte werden
tatsächlich angefahren und bis wohin? Eine Seite für einen Ort, den niemand
bedient, ist eine Doorway Page. Lieber vier ehrliche Orte als zehn leere.

## Priorität 2 — Erste echte Einsatzberichte

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

## Priorität 3 — Postleitzahlen als Datei

**Stand 24.09.2026: `src/data/serviceAreas.ts` ist angelegt, an den
Content-Audit und an das Anfrageformular angeschlossen.** Modell,
Abfragen und Prüffunktion stehen; `validateServiceAreas()` läuft bei
jedem `npm run audit:content` mit und ist durch
`npm run audit:plz:selftest` abgesichert.

`serviceAreas` ist leer und `plzDataAvailable` steht auf `false`. Der
Audit weist das in der Zusammenfassung aus, damit der Zustand nicht
unbemerkt bleibt, und das Formular zeigt in diesem Zustand keinen
Gebietshinweis an. **Es fehlen nur noch Daten, kein Code.**

**Zwei Abweichungen von der ursprünglichen Beschreibung, bewusst:**

1. `districts` ist ein **Array**, kein Einzelwert `bezirk`.
   Postleitzahlgebiete folgen Zustellrouten, nicht Verwaltungsgrenzen; in
   Berlin überschreitet ein erheblicher Teil der PLZ die Bezirksgrenze. Ein
   Einzelwert würde jede solche PLZ still falsch zuordnen, und die
   ursprünglich geforderte Prüfung auf „widersprüchliche Bezirkszuordnung"
   würde die Realität als Fehler melden statt echte Tippfehler. Für die
   Anzeige gibt es `primaryDistrict`.
2. `bedient` und `umlandpruefungNoetig` sind zu einem Aufzählungstyp
   `service: 'regulaer' | 'nach-pruefung' | 'nicht-bedient'` zusammengefasst.
   Zwei Flags ergäben vier Kombinationen, von denen zwei sinnlos sind
   („nicht bedient, aber Prüfung nötig").

**Offen, in dieser Reihenfolge:**

1. Amtliche PLZ-Liste beschaffen und `dataSource` ausfüllen (Herausgeber,
   URL, Abrufdatum). Ohne Herkunftsnachweis keine Daten – `plzDataAvailable`
   lässt sich dann nicht setzen, ohne dass die Prüfung Fehler meldet.
2. **Betriebliche Entscheidung:** `service` und `priority` je Gebiet.
   Dieselbe Frage wie bei den Umlandorten – wohin wird tatsächlich gefahren?
Mehr ist nicht offen. Sobald beides vorliegt, wirkt es ohne weitere
Codeänderung: Der Audit prüft die Tabelle, und das Formular zeigt den
Gebietshinweis an.

**✅ Erledigt am 24.09.2026 — Formular angeschlossen.**
Das PLZ-Muster steht nur noch an einer Stelle: `PLZ_PATTERN` in
`serviceAreas.ts` speist das `pattern`-Attribut des Feldes **und** die
RegExp im Skript. Vorher stand dasselbe Muster dreimal im Projekt.

Sobald eine erfasste PLZ eingetippt wird, erscheint unter dem Feld ein
Hinweis zum Einsatzgebiet (`aria-live="polite"`). Er ist **rein
informativ und blockiert das Absenden nie** – auch `nicht-bedient` nicht.
Wer dort wohnt, bekommt trotzdem eine Antwort. Die Texte stehen als
`plzTexts` im Frontmatter von `AufwandCheck.astro` und sind über
`satisfies Record<ServiceLevel, string>` an den Aufzählungstyp gebunden:
Kommt ein Status dazu, schlägt die Typprüfung fehl, statt dass der neue
Fall im Browser stillschweigend nichts anzeigt.

Das Skript läuft als `is:inline` und kann deshalb nichts importieren. Es
bekommt seine Daten über `define:vars` aus `serviceLevelMap()` – nur PLZ
und Status, keine Ortsteile, keine Bezirke. Im heutigen Zustand steht
dort `{}`, das Client-Bündel bleibt bei 2,2 kB.

**Der Status wird mitgesendet** – verstecktes Feld `gebiet`, vom Skript
gesetzt. Übertragen wird der **Schlüssel** (`regulaer` / `nach-pruefung` /
`nicht-bedient`), nicht der Anzeigetext: So bleibt die Leitung stabil,
wenn eine der beiden Seiten ihre Formulierung ändert. Alle fünf Schichten
sind gepflegt:

| Schicht | Was dort steht |
|---|---|
| `AufwandCheck.astro` | verstecktes Feld, `plzShort` für die Zwischenzusammenfassung, `sessionStorage` |
| `anfrage-erhalten.astro` | Beschriftung „Einsatzgebiet" |
| `public/api/anfrage.php` | `$gebietsLabels`, Mailzeile, JSON-Ablage über `$fields` |
| `datenschutz.astro` § 4 | Absatz zur abgeleiteten Gebietsangabe |

Das PHP prüft den Wert **gegen eine feste Liste** und verwirft alles
andere. Das widerspricht nicht der Regel bei den Zusatzleistungen: Die
sind eine wachsende Auswahl, die am Server nicht scheitern soll; das
Einsatzgebiet ist ein abgeleiteter Status mit genau drei möglichen
Werten. Ein leerer Wert ist gültig – ohne JavaScript, bei unbekannter PLZ
oder solange keine Daten gepflegt sind. Die Anfrage geht trotzdem durch.

**✅ Erledigt am 24.09.2026 — Prüfung angeschlossen.**
`scripts/content-audit.mjs` ruft `validateServiceAreas()` auf und prüft
damit bei jedem Build Dubletten, ungültige PLZ, unbekannte Slugs,
`primaryDistrict` außerhalb der eigenen Liste, Ort gegen Nummernbereich
und fehlende Gebiete. Fehler blockieren, Warnungen erscheinen als
Hinweise. Übergeben werden **alle** Bezirks- und Ortsslugs, nicht nur die
veröffentlichten: Eine PLZ darf auf einen Ortsentwurf zeigen.

Der dritte, optionale Parameter von `validateServiceAreas()` existiert
ausschließlich für die Selbstprüfung – im Audit bleibt er weg, dann
gelten die Modulwerte. Die Prüfung selbst ist durch
`npm run audit:plz:selftest` abgesichert (13 Gegenbeispiele plus
Gegenprobe, `scripts/service-areas-selftest.mjs`).

`getServiceLevel()` antwortet 'unbekannt', solange keine Daten vorliegen.
Dieser Fall muss behandelt werden und darf **nicht** auf 'nicht-bedient'
abgebildet werden: Eine Anfrage abzuweisen, weil eine Tabelle unvollständig
ist, wäre schlechter als gar keine Prüfung.

**Keine eigene Seite je PLZ.** Postleitzahlen dienen der
Verfügbarkeitsprüfung, nicht der Seitenerzeugung.

## Priorität 4 — Sammelseite für Kleinaufträge

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

- **SMTP-Block in `config.local.php` eintragen** (seit 24.09.2026 der
  einzige offene Schritt für den Mailversand). Das Postfach
  `hello@schnellhelfer24.de` existiert bereits und wird verwendet –
  zugleich als `recipient`, `from` und `smtpUser`. Nötig ist nur noch das
  Passwort in `config.local.php`, Rechte 600. Ohne diesen Block läuft der
  Versand weiter über `mail()`, und das ist die Ursache dafür, dass
  bisher keine Mail ankam.
- Empfängt `hello@schnellhelfer24.de` tatsächlich? (Testmail – erst
  aussagekräftig, wenn der SMTP-Block steht)
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
`zusatzleistungen[]` erweitert, am 24.09.2026 zusätzlich um `gebiet` und
den SMTP-Versand.

**Seit 24.09.2026 ist PHP auf dem Entwicklungsrechner installiert**
(PHP 8.3, `winget install --id PHP.PHP.8.3`). Die frühere Aussage „kein
PHP auf dem Entwicklungsrechner" gilt nicht mehr. Lokal prüfbar sind
damit **Syntax** (`php -l`) und das **SMTP-Gespräch**
(`npm run audit:mail:selftest`).

Weiterhin **nicht** lokal prüfbar und nur auf dem Server zu belegen:
tatsächliche Mailzustellung, Datei-Uploads, `.htaccess`-Verhalten,
Rate Limiting unter echten Bedingungen.

Auf dem Server eine echte Anfrage senden und prüfen, ob alle Angaben in
der Mail und in der JSON-Ablage unter `api/_storage/anfragen/` ankommen
und ob der Betreff den Umfang enthält.

**DNS-Stand, am 24.09.2026 gemessen — hier ist nichts mehr zu tun:**

| Prüfung | Befund |
|---|---|
| MX | `mx1/mx2.hostinger.com` → Hostinger Mail, nicht Titan |
| SPF | `v=spf1 include:_spf.mail.hostinger.com ~all` |
| DKIM | `hostingermail-a`, `-b`, `-c` alle im DNS |
| `smtp.hostinger.com:465` | erreichbar |

Der SPF-Eintrag deckt Hostingers **Mailserver** ab – nicht den Webserver,
über den `mail()` verschickt. Genau darin liegt die Ursache: Die Domain
ist sauber eingerichtet, nur nahm der bisherige Versandweg einen Weg
daran vorbei.

**Zum Versandweg (der Grund, warum bisher keine Mail ankam):**

1. Mail angekommen? Auch den Spam-Ordner ansehen.
2. Neueste JSON-Datei öffnen: `mailWeg` muss `smtp` sein. Steht dort
   `mail()`, greift der SMTP-Block in `config.local.php` nicht.
   `mailVersand` muss `ok` sein; `mailFehler` nennt sonst den
   gescheiterten Schritt.
3. Im Kopf der angekommenen Mail `spf=pass` und `dkim=pass` prüfen. Das
   ist der eigentliche Beweis – eine angekommene Mail allein kann Glück sein.
4. Rückfallebene: `smtpHost` testweise leeren, Anfrage senden. `mailWeg`
   muss wieder `mail()` sein und die Anfrage trotzdem durchgehen.

**Wenn weiterhin keine Mail ankommt, grenzt die JSON-Ablage ein:**

| Befund | Bedeutung |
|---|---|
| keine Datei | Anfrage erreicht PHP nicht – Routing, 403 oder Deployment |
| `mailWeg: mail()` | `config.local.php` greift nicht oder der SMTP-Block fehlt |
| `mailVersand: fehlgeschlagen` + `mailFehler` | SMTP-Problem, der Text nennt den Schritt |
| `mailVersand: ok`, Mail fehlt | Zustellung/Spamfilter – SPF und DKIM prüfen |
| `mailHinweis` vorhanden | `from` wich von `smtpUser` ab und wurde korrigiert |

**Zusätzlich für `gebiet` (erst sinnvoll, wenn PLZ-Daten gepflegt sind):**

1. Mit einer erfassten PLZ absenden – die Mailzeile „Einsatzgebiet:" muss
   den ausgeschriebenen Text zeigen, die JSON-Ablage den Schlüssel.
2. Mit einer unbekannten PLZ absenden – es muss „(nicht ermittelt)"
   dastehen und die Anfrage trotzdem durchgehen.
3. **Adversativ:** mit abgeschaltetem JavaScript oder manipuliertem Feld
   (`gebiet=<beliebiger Text>`) absenden. Erwartet wird „(nicht
   ermittelt)"; es darf kein fremder Text in der Mail landen.
