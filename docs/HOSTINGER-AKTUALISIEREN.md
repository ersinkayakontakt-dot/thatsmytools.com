# Website bei Hostinger aktualisieren

Kurzfassung: Die Website muss **gebaut** werden, und hochgeladen wird
anschließend **nur der Inhalt von `dist/`** — nicht das Repository.

Das ist der Punkt, an dem es am häufigsten schiefgeht. `src/` enthält
`.astro`-Dateien, die kein Webserver versteht. Erst `npm run build` macht
daraus fertiges HTML.

---

## Was wohin gehört

| Im Repository | Auf dem Server |
|---|---|
| `src/`, `scripts/`, `docs/`, `package.json` | gehört **nicht** auf den Server |
| `public/` | landet über den Build automatisch in `dist/` |
| `dist/` (wird gebaut, nicht versioniert) | **das** kommt in `public_html` |

Und umgekehrt: Zwei Dinge leben nur auf dem Server und dürfen bei keiner
Aktualisierung überschrieben oder gelöscht werden.

| Nur auf dem Server | Warum |
|---|---|
| `api/config.local.php` | enthält die Empfängeradresse für Anfragen |
| `api/_storage/` | enthält hochgeladene Wohnungsfotos und eingegangene Anfragen |

Beide Wege unten schließen diese Pfade ausdrücklich aus.

---

## Weg A: PowerShell vom eigenen Rechner (empfohlen für den Anfang)

Voraussetzung: Node.js ist installiert, das Repository liegt lokal.
Zusätzliche Software wird **nicht** gebraucht, kein FileZilla, kein WinSCP.

### Einmalig: FTP-Zugang im hPanel holen

1. hPanel öffnen → **Dateien** → **FTP-Konten**
2. Dort stehen **FTP-IP / Hostname**, **FTP-Benutzername** und das
   Verzeichnis. Falls noch kein Konto existiert, eines anlegen.
3. Verzeichnis notieren. Bei einer einzelnen Domain ist das meist
   `/public_html`, bei mehreren
   `/domains/schnellhelfer24.de/public_html`.

### Bei jeder Aktualisierung

Zuerst immer ein Probelauf. Der zeigt nur an, was passieren würde:

```powershell
cd C:\Pfad\zum\Projekt

git pull

.\scripts\deploy.ps1 `
  -Server ftp.schnellhelfer24.de `
  -Benutzer u123456789.deploy `
  -Zielverzeichnis /public_html `
  -Probelauf
```

Sieht die Liste richtig aus, dasselbe ohne `-Probelauf`:

```powershell
.\scripts\deploy.ps1 `
  -Server ftp.schnellhelfer24.de `
  -Benutzer u123456789.deploy `
  -Zielverzeichnis /public_html
```

Das Passwort wird abgefragt und nirgends gespeichert. Es steht damit weder
im Skript noch in der PowerShell-Historie.

Das Skript baut vorher automatisch und bricht ab, wenn eine der Prüfungen
fehlschlägt. Es **löscht nichts** auf dem Server, es überschreibt und legt
nur an.

> Falls PowerShell die Ausführung blockiert:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```
> Das gilt nur für dieses eine Fenster.

---

## Weg B: Auf Knopfdruck über GitHub

Nach der Einrichtung genügt ein Klick im Browser, ohne lokalen Build.
Sinnvoll, sobald mehrere Personen beteiligt sind oder von verschiedenen
Rechnern gearbeitet wird.

### Einmalig einrichten

Auf GitHub: **Settings → Secrets and variables → Actions → New repository
secret**. Vier Einträge anlegen:

| Name | Wert |
|---|---|
| `HOSTINGER_FTP_SERVER` | z. B. `ftp.schnellhelfer24.de` |
| `HOSTINGER_FTP_USER` | FTP-Benutzername aus dem hPanel |
| `HOSTINGER_FTP_PASSWORD` | FTP-Passwort |
| `HOSTINGER_FTP_DIR` | z. B. `/public_html/` |

### Auslösen

**Actions → „Zu Hostinger übertragen" → Run workflow.**

Der Haken **Probelauf** ist standardmäßig gesetzt. Erst einmal so laufen
lassen und das Protokoll ansehen. Sieht es gut aus, den Haken entfernen und
erneut starten.

Der Ablauf prüft Inhalte, baut, prüft die gebauten Seiten und überträgt
erst dann. Schlägt eine Prüfung fehl, wird nichts hochgeladen.

### Warum nicht automatisch bei jedem Push

Der Auslöser ist bewusst nur manuell. Solange in `src/config/site.ts` noch
Platzhalter stehen und Impressum wie Datenschutz nicht geprüft sind, darf
kein Push versehentlich auf die Live-Domain gehen. In
`.github/workflows/deploy.yml` ist der Push-Auslöser vorbereitet und
auskommentiert — er kann später aktiviert werden.

---

## Was Hostingers eigene Git-Funktion nicht kann

Im hPanel gibt es unter **Erweitert → GIT** eine Anbindung an ein
Repository. Die zieht den Quellcode direkt in `public_html` — führt aber
**keinen Build aus**. Für dieses Projekt funktioniert das nicht, weil dann
`.astro`-Dateien statt HTML auf dem Server lägen.

Nutzbar wäre sie nur, wenn man `dist/` mit ins Repository aufnimmt. Davon
ist abzuraten: Der Ordner wird bei jedem Build komplett neu geschrieben und
würde die Versionsgeschichte mit Tausenden unnötiger Änderungen füllen.

---

## Erste Einrichtung auf dem Server

Nur beim allerersten Mal nötig, danach nie wieder:

1. **Nach dem ersten Hochladen** im hPanel-Dateimanager prüfen, dass
   `public_html/.htaccess` wirklich da ist. Punktdateien werden von
   manchen Programmen ausgeblendet. Ohne sie fehlen Weiterleitungen,
   Sicherheitskopfzeilen und der Schutz des Ablageverzeichnisses.

2. **`public_html/api/config.local.php` anlegen.** Vorlage ist die daneben
   liegende `config.example.php`. Mindestens eintragen:

   ```php
   <?php
   return [
       'recipient' => 'anfrage@schnellhelfer24.de',
       'from'      => 'website@schnellhelfer24.de',
   ];
   ```

   Ohne diese Datei nimmt das Formular keine Anfragen an, sondern leitet
   mit einer Fehlermeldung zurück. Das ist Absicht: besser ein sichtbarer
   Fehler als Anfragen, die still verschwinden.

3. **Schreibrechte für `api/_storage`** setzen (0700 genügt).
   Noch sicherer: `storageDir` in `config.local.php` auf ein Verzeichnis
   **oberhalb** von `public_html` zeigen lassen, dann liegen die Fotos gar
   nicht erst im Webbereich.

4. **PHP-Version prüfen:** hPanel → **Erweitert → PHP-Konfiguration**.
   Nötig ist **8.0 oder neuer**.

---

## Nach jeder Aktualisierung prüfen

- [ ] Startseite mit **Strg + F5** neu laden (der Browser hält HTML sonst kurz fest)
- [ ] `https://schnellhelfer24.de/api/_storage/` muss **403 oder 404** liefern, niemals ein Verzeichnislisting
- [ ] Eine Testanfrage über `/angebot-anfragen/` senden und prüfen, ob die E-Mail ankommt
- [ ] `npm run indexnow` ausführen — meldet geänderte URLs an Bing und die übrigen IndexNow-Dienste

`npm run indexnow` läuft bewusst lokal und nicht im GitHub-Ablauf, weil die
Datei `.indexnow-state.json` danach ins Repository zurückgeschrieben werden
muss. Sie merkt sich, welche Seiten bereits gemeldet wurden.

---

## Wenn etwas nicht stimmt

| Symptom | Ursache |
|---|---|
| Seite sieht unverändert aus | Browser-Cache. Strg + F5. HTML wird laut `.htaccess` nicht zwischengespeichert, CSS und JS dagegen ein Jahr — die tragen aber eine Prüfsumme im Namen. |
| Alles ohne Gestaltung, nur Text | `_assets/` fehlt oder wurde nicht mit übertragen. |
| Unterseiten liefern 404 | `.htaccess` fehlt in `public_html`. |
| Formular meldet einen Fehler | `api/config.local.php` fehlt oder `api/_storage` ist nicht beschreibbar. |
| `500 Internal Server Error` | Meist eine zu alte PHP-Version. Im hPanel auf 8.0+ stellen. |
| FTPS-Verbindung schlägt fehl | Im hPanel prüfen, ob der Zugang aktiv ist. Manche Firmennetze blockieren Port 21. |
