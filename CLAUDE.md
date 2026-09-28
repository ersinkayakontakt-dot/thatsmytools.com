# CLAUDE.md — schnellhelfer24.de

Betriebsanleitung für dieses Projekt. Gilt zusätzlich zu den globalen Regeln
in `~/.claude/CLAUDE.md`, nicht statt ihrer. Wo beide etwas sagen, gewinnt
die globale Datei.

**Stack:** Astro 7 (`^7.3.5`, seit 26.09.2026 – davor 5.6.1), TypeScript,
PHP 8 für zwei Endpunkte. Statisch ausgeliefert bei Hostinger. Node
`>=22.18.0` ist Pflicht – die Prüfskripte importieren TypeScript direkt,
ohne Buildschritt.

Für diesen Stack gibt es **kein Canon** in `~/.claude/`. Die dort liegenden
`REACT_FIREBASE_*.md` gehören zu einem anderen Projekt und gelten hier
nicht. Maßgeblich sind: globale Regeln, diese Datei, die unten genannten
Referenzdokumente, Ingenieursurteil.

---

## Zuerst lesen

| Datei | Wofür | Wann |
|---|---|---|
| `HANDOFF.md` | Was als Nächstes den größten Effekt hat, Deployment-Wahrheit, Testpläne | **immer** |
| `CONTENT-TODO.md` | Der Tracker. Alles Offene steht hier | **vor jedem Plan** |
| `src/lib/publishGuard.ts` | Entscheidet, ob eine Seite überhaupt indexiert wird | vor jeder Inhaltsarbeit |
| `SEO-SYSTEM.md` | Was `npm run seo:all` prüft und warum | vor Änderungen an Metadaten, Links, Schema |
| `SEO-LAUNCH-CHECKLIST.md` | Ablauf bis zum Livegang | vor einem Livegang |
| `docs/ENTSCHEIDUNGEN.md` | Getroffene Architektur- und Produktentscheidungen samt Begründung und Abwägung | **bevor du eine davon umwirfst** |
| `docs/ARCHITEKTUR.md` | Warum Astro, warum PHP fürs Formular, Performance-Budget | vor Architekturentscheidungen |
| `docs/HOSTINGER-AKTUALISIEREN.md` | Deployment, geprüfte FTP-Werte, bekannte Fallen | vor jedem Deployment |
| `docs/KI-CRAWLER.md` | Welche KI-Bots erlaubt sind | vor Änderungen an `robots.txt` / `llms.txt` |
| `IMAGE-SOURCES.md` | Herkunftsnachweis jeder Bilddatei | vor dem Einbinden eines Bildes |

Es gibt **keine** Compliance-Datei. Die rechtlich relevante Oberfläche liegt
in `src/pages/datenschutz.astro` und `src/pages/impressum.astro`. Änderungen
an erhobenen Daten, Speicherfristen oder Empfängern gehören dort hinein –
siehe § Datenschutz unten.

---

## Die drei Regeln, die dieses Projekt tragen

### 1. Nichts wird erfunden

Keine Bewertungen, Preise, Referenzfälle, Zertifikate, Reaktionszeiten,
Mitarbeiterzahlen. Was nicht belegt ist, steht nicht auf der Website.

Das ist technisch abgesichert und darf nicht umgangen werden:

- Bewertungsbereich erscheint nur bei echten Einträgen in `src/data/reviews.ts`
- Preise nur, wenn `priceDataAvailable` in `src/data/costs.ts` auf `true` steht
- Einsatzberichte mit `real: false` lassen sich nicht veröffentlichen
- Einsatzgebiete nur, wenn `plzDataAvailable` in `src/data/serviceAreas.ts` steht
- `npm run audit:build` bricht ab, wenn ein Platzhalter in strukturierte Daten gerät

**Auch keine Beispieldaten „zum Testen" in Datendateien.** Ein Platzhalter in
einer Datei, die über „fahren wir da hin" oder „was kostet das" entscheidet,
wird früher oder später für echt gehalten. Testdaten gehören in die
Selbstprüfungen unter `scripts/`, klar als erfunden markiert.

### 2. Eine Quelle je Angabe

Unternehmensdaten ausschließlich in `src/config/site.ts`. Nie im Markup
wiederholen. Steht dort ein Platzhalter, wird der Kontaktweg überall
ausgeblendet statt einen toten Link zu erzeugen.

### 3. Publish Guard

`src/lib/publishGuard.ts` entscheidet über Indexierbarkeit. Wer `status:
'published'` setzt, ohne die Inhalte zu liefern, bekommt beim Build einen
Fehler, und die Seite bleibt trotzdem `noindex` und aus der Sitemap. Die
Regel lässt sich nicht versehentlich umgehen – und soll nicht absichtlich
umgangen werden.

---

## Pflicht-Gate nach jeder Änderung

```bash
npm run build && npm run check && npm run audit:content && npm run audit:build && npm run seo:all
```

Alle fünf müssen sauber sein. `npm run seo:all` ist der eigentliche
Torwächter: Metadaten, Linkgraph, Kannibalisierung, Schema, Bilder,
Kontrast. **FEHLER blockieren die Veröffentlichung, Warnungen brauchen eine
redaktionelle Entscheidung.**

Stand 28.09.2026: 0 Fehler, **12 Warnungen** (73 Seiten, 53 indexierbar,
nach zwei neuen Leistungen unverändert). Diese Zahl ist die Messlatte –
steigt sie durch eine Änderung, ist die Änderung schuld.

Sie lag bis zum 27.09.2026 bei 16. Vier Warnungen sind durch gezielte
kontextuelle Verlinkung entfallen, nicht durch Nachgeben: Der P4-Durchschnitt
im Linkgraph stieg von 3,8 auf 5,2. Wer die Zahl senkt, schreibt hier den
neuen Stand hin und begründet ihn – wer sie steigen lässt, sucht die Ursache.

### Zusätzlich, je nach Bereich

| Angefasst | Zusätzlich ausführen |
|---|---|
| Prüfregeln oder Ereignisnamen | `npm run seo:selftest` (14 Verletzungen) und `npm run seo:events` |
| `src/data/serviceAreas.ts` | `npm run audit:plz:selftest` (13 Gegenbeispiele + Gegenprobe) |
| `public/api/lib/smtp.php` | `npm run audit:mail:selftest` (14 Fälle, echtes SMTP-Gespräch) |
| irgendein PHP | `php -l public/api/anfrage.php` und `php -l public/api/lib/smtp.php` |

**Die Selbsttests sind nicht optional.** Zwei von ihnen prüfen Code, der über
leeren Daten läuft: Solange `serviceAreas` leer ist, läuft jede Schleife der
PLZ-Prüfung über nichts und meldet folgenlos „in Ordnung". Und ein Fehler im
Mailversand äußert sich als „die Mail kommt nicht an" – als genau das
Symptom, das der Code beheben soll.

Wer eine neue Prüfregel schreibt, schreibt ihr Gegenbeispiel dazu. Und prüft
den Test selbst, indem er die Regel absichtlich bricht und bestätigt, dass
der Test fehlschlägt.

---

## Cross-Layer-Karte

Die häufigste Fehlerquelle in diesem Projekt: Eine Ebene wird geändert, eine
andere bleibt zurück. Wer eines der folgenden Dinge anfasst, fasst **alle**
genannten Stellen an.

| Änderung | Betroffene Stellen |
|---|---|
| **Formularfeld ergänzen** | `AufwandCheck.astro` (Feld, Zwischenzusammenfassung, `sessionStorage`) · `anfrage-erhalten.astro` (Beschriftung) · `public/api/anfrage.php` (Mailtext, JSON-Ablage, ggf. Betreff) |
| **… und es wird übertragen und gespeichert** | zusätzlich `src/pages/datenschutz.astro` § 4. Ein Feld, das dort fehlt, ist eine unvollständige Auskunft. Rein anzeigende Felder betrifft das nicht |
| **Seite anlegen oder umbenennen** | Eintrag in `src/data/seo-pages.ts`, sonst schlägt `npm run seo:metadata` fehl. Dazu `related`, `focusServices`, `situations.ts`, Navigation, Sitemap |
| **Mess-Ereignis ergänzen** | Name zusätzlich in `ALLOWED_EVENTS` in `public/api/events.php`, sonst verwirft der Endpunkt es stillschweigend. `npm run seo:events` prüft das |
| **PLZ-Muster ändern** | `PLZ_PATTERN` in `src/data/serviceAreas.ts` (speist HTML-`pattern` **und** Client-RegExp) · dazu das eigene `preg_match` in `public/api/anfrage.php`. PHP kann das TS-Modul nicht importieren, und die Serverprüfung darf nicht von der Clientseite abhängen |
| **Neue Datendatei unter `src/data/`** | Danach `git status --short src/data/` prüfen. Taucht sie dort nicht als `??` auf, ist sie unsichtbar – siehe § Fallen |

---

## Datenschutz und Sicherheit

- **Fotos** liegen in `public/api/_storage/uploads/`, geschützt allein durch
  `.htaccess` (bestätigt: liefert 403). Robuster wäre `storageDir` in
  `config.local.php` auf einen Pfad **oberhalb** des Webverzeichnisses.
- **Löschfrist** der Uploads: `retentionDays` (90). Muss mit der Angabe in
  `datenschutz.astro` übereinstimmen.
- **`config.local.php`** enthält seit dem SMTP-Versand ein Passwort. Niemals
  einchecken, auf dem Server Rechte 600.
- **Kein Geheimnis in Fehlertexten oder der JSON-Ablage.** Der SMTP-Client
  hält nur die Antwort des Servers fest, nie den gesendeten Befehl – bei
  `AUTH LOGIN` stünde dort sonst das Passwort. Ein Selbsttestfall sichert das ab.
- **Rate Limiting** je pseudonymisiertem IP-Hash, Honeypot, Zeitfalle,
  MIME-Prüfung über den Dateiinhalt. Beim Ändern nicht aufweichen.
- **Zertifikatsprüfung beim Deployment nie abschalten.** Über die Verbindung
  geht das FTP-Passwort.

---

## Deployment

Zwei Branches, die nicht verwechselt werden dürfen:

- Quellbranch (aktuell `claude/schnellhelfer24-rebuild-nn7fwd`) – Astro-Quellcode
- `hostinger-live` – enthält nur den fertigen Inhalt aus `dist/`

**Den Quellbranch niemals nach `public_html` deployen.** Hostinger führt
dabei keinen Astro-Build aus, und die Domain liefert ohne `index.html` einen
HTTP-403.

Geprüfte Werte für das Skript (Stand 26.09.2026):

```powershell
.\scripts\deploy.ps1 -Server srv2025.hstgr.io -Benutzer u906625645.schnellhelfer24 -Zielverzeichnis /
```

Begründung aller drei Werte und der bekannten Fallen steht in
`docs/HOSTINGER-AKTUALISIEREN.md`. Kurz:

- **Nicht** `ftp.schnellhelfer24.de` – das FTPS-Zertifikat lautet auf
  `*.hstgr.io`, der Name passt nicht dazu
- `-Zielverzeichnis /`, weil der domainspezifische Zugang bereits in
  `public_html` startet
- Das Skript löscht nie, es überschreibt und legt an. Ein Abbruch mitten in
  der Übertragung macht die Website nicht kaputt

`public/api/` wird beim Build nach `dist/api/` kopiert – die PHP-Dateien und
`api/lib/` gehen also beim normalen Deployment automatisch mit.

---

## Was lokal prüfbar ist und was nicht

PHP 8.3 ist seit 24.09.2026 auf dem Entwicklungsrechner installiert.

**Lokal prüfbar:** Syntax (`php -l`), das SMTP-Gespräch
(`npm run audit:mail:selftest`), der gesamte Astro-Build und alle Audits.

**Nur auf dem Server:** tatsächliche Mailzustellung, Datei-Uploads,
`.htaccess`-Verhalten, Rate Limiting unter echten Bedingungen. Wer etwas
davon behauptet, ohne es dort gemessen zu haben, behauptet zu viel.

---

## Fallen, die schon einmal Zeit gekostet haben

- **`.gitignore` und `src/data/`** – das Muster `data/` ohne führenden
  Schrägstrich trifft jede Ebene. Drei Quelldateien waren dadurch nie im
  Repository, ein frischer Klon ließ sich nicht bauen. Korrigiert zu
  `/data/` am 24.09.2026. Nach dem Anlegen einer Datendatei einmal
  `git status --short src/data/` prüfen.
- **`mail()` meldet Erfolg ohne Zustellung.** Es bestätigt nur die Übernahme
  durch das lokale Postprogramm. Ohne passenden SPF-Eintrag verwerfen
  Postfächer die Mail stillschweigend. Deshalb der SMTP-Versand – und
  deshalb stehen `mailWeg` und `mailFehler` in der JSON-Ablage, damit „keine
  Mail da" auf eine Ursache eingrenzbar ist.
- **Ein grüner Lauf über leeren Daten beweist nichts.** Gilt für die
  PLZ-Prüfung ebenso wie für neue Guards.
- **Astro `is:inline`-Skripte können nichts importieren.** Daten kommen über
  `define:vars` hinein. `astro check` prüft auch `scripts/` – ungenutzte
  Parameter dort mit `_` präfixen.
- **Zeilenenden sind CRLF.** Mehrzeilige Suchmuster in Skripten scheitern
  sonst stillschweigend.

---

## Offene Punkte

Stehen **nicht hier**, sondern im Tracker `CONTENT-TODO.md` und in
`HANDOFF.md`. Diese Datei beschreibt den Dauerzustand, der Tracker den
wechselnden.

Vor jedem Plan: Tracker lesen und in der Antwort sagen, was dort gefunden
wurde – auch wenn es nichts war.
