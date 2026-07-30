# Architektur und Deployment

Diese Datei erklärt, warum die Website so gebaut ist, wie sie gebaut ist, und
wie sie auf einen Server kommt.

---

## 1. Ausgangslage

Das Repository war leer. Es gab keinen bestehenden Tech-Stack, der zu
übernehmen gewesen wäre, und keine Alt-Codebasis, deren Struktur zu
berücksichtigen war. Die Entscheidung konnte also frei getroffen werden.

Fachlich vorhanden war die bisherige Website unter `schnellhelfer24.de` mit
den Schwerpunkten Umzüge, Entrümpelungen und sozial geförderte Umzüge in
Berlin. Diese Positionierung wurde übernommen und geschärft (siehe
`CONTENT-TODO.md`, Abschnitt „Aussagen der bisherigen Website prüfen").

---

## 2. Entscheidung: Astro, statisch, ohne Framework-Insel

**Gewählt: Astro 5 mit TypeScript, `output: 'static'`, keine UI-Bibliothek.**

Begründung entlang der Anforderungen:

| Anforderung | Warum Astro statisch passt |
|---|---|
| Kerninhalte server- oder vorgerendert | Jede Seite ist fertiges HTML. Kein Inhalt entsteht erst im Browser. |
| Sehr wenig JavaScript | Ausgeliefert werden rund 2 KB eigenes Skript. Keine Framework-Laufzeit. |
| Läuft auf einfachem Hosting | Reine Dateien. Kein Node-Prozess, kein Container, kein Build auf dem Server. |
| Strukturierter Content, leicht erweiterbar | Leistungen, Bezirke, Ratgeber und Einsatzberichte liegen als typisierte Daten in `src/data/`. Neue Seiten entstehen durch Ergänzen von Einträgen, nicht durch Kopieren von Dateien. |
| Wartbarkeit | Eine Person mit HTML- und CSS-Kenntnissen kann Inhalte pflegen, ohne ein Framework zu lernen. |
| Performance | Kein Hydration-Overhead, kein Client-Router, keine externen Schriften. |

**Bewusst nicht gewählt:**

- **Next.js**: Bräuchte für den vollen Nutzen einen Node-Prozess. Der
  Mehrwert (Server-Komponenten, ISR) wird hier nirgends gebraucht, die
  laufenden Kosten und die Wartungslast sind aber real.
- **WordPress**: Für eine Seite mit dieser Struktur ein sehr großes System
  mit dauerhafter Update- und Sicherheitspflicht. Ein individuelles Theme
  wäre aufwendiger als die gesamte hier gebaute Website. Sinnvoll wäre es
  erst, wenn mehrere Personen ohne technische Kenntnisse regelmäßig Inhalte
  pflegen. Dann ist ein Wechsel jederzeit möglich, weil die Inhalte
  strukturiert vorliegen.
- **Ein Headless CMS**: Zusätzliche Abhängigkeit, zusätzliche Kosten,
  zusätzlicher Ausfallpunkt. Bei aktuell rund 40 gepflegten Seiten nicht
  gerechtfertigt.

### Wann diese Entscheidung neu zu treffen ist

- Wenn mehrere Personen ohne Git-Kenntnisse täglich Inhalte ändern sollen.
- Wenn Einsatzberichte künftig aus einem Auftragssystem kommen.
- Wenn personalisierte oder eingeloggte Bereiche entstehen.

---

## 3. Warum das Formular in PHP läuft

Die Website selbst ist statisch. Das Anfrageformular braucht aber einen
Server: serverseitige Prüfung, Rate Limiting, Datei-Uploads, Mailversand.

`public/api/anfrage.php` ist der einzige dynamische Teil.

**Warum PHP und nicht Node:**

- Auf klassischen Webhosting-Tarifen (unter anderem bei Hostinger) ist PHP
  ohne Zusatzkosten vorhanden. Node.js erfordert dort einen anderen Tarif
  oder fehlt ganz.
- Der Endpunkt ist eine einzelne Datei ohne Abhängigkeiten. Keine
  `node_modules`, kein Prozess, der abstürzen und neu gestartet werden kann.
- Das Deployment bleibt „Dateien hochladen".

**Wenn Node auf dem Server verfügbar ist**, kann derselbe Endpunkt als
Astro-Serverroute nachgebaut werden. Die Feldnamen im Formular bleiben
identisch, es ändert sich nur `site.formEndpoint` in
`src/config/site.ts`. Die Prüf- und Sicherheitslogik in der PHP-Datei ist
kommentiert und lässt sich eins zu eins übertragen.

**Voraussetzung:** PHP 8.0 oder neuer.

---

## 4. Verzeichnisse

```
src/
  config/site.ts        Zentrale Unternehmens- und Entity-Konfiguration
  data/                 Content-Modell (Leistungen, Bezirke, Orte, Ratgeber, …)
  lib/
    publishGuard.ts     Prüft, ob eine Seite indexiert werden darf
    schema.ts           JSON-LD-Bausteine
    contact.ts          Aufbereitete Kontaktwege
    text.ts             Kleines Inline-Markup, Datumsformat
  layouts/Base.astro    Kopfdaten, strukturierte Daten, Kopf-/Fußbereich
  components/           Wiederverwendbare Bausteine
  pages/                Routen (inkl. sitemap.xml.ts, robots.txt.ts, llms.txt.ts)
  styles/global.css     Designsystem

public/
  .htaccess             Weiterleitungen, Sicherheitskopfzeilen, Caching
  api/anfrage.php       Formular-Endpunkt
  api/_storage/         Laufzeitablage (nicht im Repository)
  <key>.txt             IndexNow-Schlüsseldatei
  og-default.png        Social-Media-Vorschaubild
  favicon.svg, apple-touch-icon.png, site.webmanifest

scripts/
  content-audit.mjs     Prüft die Datendateien vor dem Build
  build-audit.mjs       Prüft die gebaute Website (SEO, Links, Bilder)
  indexnow.mjs          Meldet geänderte URLs an IndexNow
  make-images.mjs       Erzeugt og-default.png und apple-touch-icon.png
```

---

## 5. Befehle

```bash
npm install
npm run dev            # Entwicklungsserver, TODO-Hinweise sind sichtbar
npm run build          # Baut nach dist/
npm run preview        # Gebaute Website lokal ansehen
npm run check          # TypeScript- und Astro-Prüfung

npm run audit:content  # Publish Guard, Verweise, Kurzantworten, Platzhalter
npm run audit:build    # Titles, Descriptions, H1, Canonicals, Links, Sitemap
npm run indexnow       # Nach dem Deployment: geänderte URLs melden
node scripts/make-images.mjs   # Vorschaubild und Icon neu erzeugen
```

Redaktionshinweise (`<Todo>`) und die Betreiberkästen `legal-check` auf
Impressum und Datenschutz sind im Entwicklungsmodus sichtbar und in der
Produktionsausgabe unsichtbar. Beide lesen dieselbe Bedingung aus
`src/lib/internalNotes.ts` (`showInternalNotes`) – neue interne Hinweise
bitte ebenfalls damit schalten, nicht mit einer eigenen Abfrage. Um sie
testweise auch im Build zu sehen:

```bash
PUBLIC_SHOW_TODOS=1 npm run build
```

---

## 6. Deployment

### Variante A: Hostinger oder anderes Webhosting mit Apache

1. `npm run build`
2. Inhalt von `dist/` in das Webverzeichnis laden (bei Hostinger meist
   `public_html`), einschließlich der Punktdateien `.htaccess`.
3. `public_html/api/config.local.php` anlegen (Vorlage:
   `api/config.example.php`) und die Empfängeradresse eintragen.
4. Schreibrechte für `api/_storage` setzen (0700 genügt).
   Noch besser: `storageDir` in `config.local.php` auf ein Verzeichnis
   **oberhalb** von `public_html` zeigen lassen.
5. Testanfrage über `/angebot-anfragen/` senden und prüfen, ob die E-Mail
   ankommt und ob unter `_storage/anfragen/` eine JSON-Datei liegt.
6. `npm run indexnow` ausführen.

Wichtig: Die Datei `.htaccess` muss mit übertragen werden. Viele FTP-Programme
blenden Punktdateien standardmäßig aus. Ohne sie fehlen Weiterleitungen,
Sicherheitskopfzeilen und die Absicherung des Ablageverzeichnisses.

### Variante B: nginx

`public/.htaccess` wird von nginx nicht gelesen. Die entsprechenden Regeln
gehören in die Serverkonfiguration:

```nginx
server {
  server_name schnellhelfer24.de;
  root /var/www/schnellhelfer24/dist;
  index index.html;

  # www und http auf die kanonische Adresse
  # (eigener server-Block mit return 301 https://schnellhelfer24.de$request_uri;)

  # Einheitlicher Schrägstrich am Ende
  location / {
    try_files $uri $uri/index.html $uri/ =404;
  }

  error_page 404 /404.html;

  # Ablage niemals ausliefern
  location ^~ /api/_storage/ { deny all; return 404; }
  location ~ /api/config\..*\.php$ { deny all; return 404; }

  location ~ \.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
  }

  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; frame-ancestors 'self'; base-uri 'self'; object-src 'none'" always;

  location ~* \.(css|js)$ { add_header Cache-Control "public, max-age=31536000, immutable"; }
  location ~* \.(png|jpg|webp|avif|svg)$ { add_header Cache-Control "public, max-age=15552000"; }
  location ~* \.html$ { add_header Cache-Control "no-cache"; }
}
```

### Variante C: Statisches Hosting ohne PHP (Netlify, Cloudflare Pages …)

Möglich, aber dann braucht das Formular einen anderen Endpunkt: eine
Serverless-Funktion oder ein Formulardienst. In dem Fall
`site.formEndpoint` in `src/config/site.ts` anpassen. Beachten: Fotos aus
Wohnungen sind sensibel, ein externer Formulardienst wird damit zum
Auftragsverarbeiter und braucht einen Vertrag nach Art. 28 DSGVO.

---

## 7. Gestaltung und Schriften

Die visuelle Handschrift heißt intern **„Werkstatt & Signal"** und ist in
`src/styles/global.css` als Token-Satz definiert. Tragende Entscheidungen:

- Kühles Weiß und Betongrau als Flächen, kein cremefarbenes Papierweiß.
- Tiefschwarz trägt die Struktur: Balken, Regeln, Rahmen. Keine Haarlinien
  in warmem Grau.
- Ein gesättigtes Arbeitsorange (`#d24507`), ausschließlich für Handlungen
  und Markierungen. Nie flächig, nie dekorativ.
- Durchgehend Grotesk, keine Serifen. Überschriften in 800 mit enger
  Laufweite.
- Radius 0. Kartenkanten sind eckig, oben trägt jede Karte einen kräftigen
  Balken statt einer Schattenkante.
- Keine Schatten, keine Verläufe, keine schwebenden Elemente.

Der Akzent existiert in zwei Werten: `--accent` für Flächen und Rahmen,
`--accent-text` für Text. Der Unterschied ist kaum sichtbar, sorgt aber
dafür, dass kleiner Text auch auf Betongrau die 4,5:1 nach WCAG erreicht.

Alles Visuelle hängt an diesen Tokens. Ein Wechsel der Handschrift betrifft
`global.css` plus die Detailmotive in einigen Komponenten, aber weder
Struktur noch Inhalt noch SEO.

### Schriften

Ein konkreter Grotesk-Stack aus Systemschriften, bewusst **ohne**
`system-ui` an erster Stelle: Diese Kennung löst je nach Betriebssystem auf
unterschiedlich breit laufende Schriften auf und verschiebt dadurch
Zeilenumbrüche und die Breite der Kopfzeile. Der konkrete Stack liefert
überall eine vergleichbare Grotesk.

Für deutsche Komposita ist `hyphens: auto` gesetzt. Ohne Silbentrennung
schieben Wörter wie „Auftragsverarbeitungsvertrag" schmale Spalten seitlich
auf.

Warum keine Webfont:

- kein externer Aufruf, damit kein Datenschutzproblem und keine
  Einwilligungspflicht,
- keine zusätzliche Ladezeit und kein Schriftflackern beim Laden,
- keine Layoutverschiebung.

Wenn später eine eigene Hausschrift kommt: **selbst hosten**, als WOFF2, mit
`font-display: swap`, und die Schriftmetriken über
`size-adjust`/`ascent-override` an den bisherigen Stapel angleichen, damit
sich das Layout nicht verschiebt. Google Fonts über die CDN einzubinden ist
in Deutschland abgemahnt worden und kommt nicht in Frage.

---

## 8. Performance-Budget

Zielwerte für die Startseite auf einem mittleren Mobilgerät:

| Kennzahl | Budget |
|---|---|
| HTML einer Seite (unkomprimiert) | < 60 KB |
| CSS gesamt | < 25 KB |
| JavaScript gesamt | < 10 KB |
| Anfragen beim Erstaufruf | < 12 |
| Largest Contentful Paint | < 2,0 s |
| Cumulative Layout Shift | < 0,05 |
| Interaction to Next Paint | < 150 ms |

Diese Werte sind derzeit eingehalten, weil es keine externen Ressourcen,
keine Webfonts und kein Hero-Bild gibt. **Beim Ergänzen echter Fotos ist das
Budget der kritische Punkt.** Regeln dafür:

- Bilder als AVIF mit WebP-Rückfall, JPEG nur als letzte Stufe.
- `<img>` immer mit `width`, `height` und `loading="lazy"` unterhalb des
  sichtbaren Bereichs.
- Das Hero-Bild bekommt `fetchpriority="high"` und **kein** `loading="lazy"`.
- Kein Bild breiter als 1600 px ausliefern.
- Vor jedem Deployment `npm run audit:build` laufen lassen.

---

## 9. Was bewusst nicht eingebaut ist

- **Kein Cookie-Banner.** Es werden keine zustimmungspflichtigen Dienste
  geladen. Ein Banner ohne Anlass wäre nur eine Hürde. Sobald ein
  Analytics- oder Werbedienst dazukommt, wird er nötig, und der Haken dafür
  ist in `src/components/Analytics.astro` als `window.sh24.consent()`
  bereits vorhanden.
- **Keine Karte auf der Kontaktseite.** Eingebettete Karten laden Daten von
  Dritten und kosten Ladezeit. Wenn eine gewünscht ist, erst nach Klick
  laden.
- **Keine Bildergalerie und kein Slider.** Erst sinnvoll, wenn echte
  Einsatzfotos vorliegen.
- **Kein Chat-Widget.** Zusätzliches Drittanbieter-Skript, das die
  Ladezeit belastet und im Handwerksbetrieb selten besetzt ist. Telefon und
  WhatsApp erfüllen denselben Zweck.
