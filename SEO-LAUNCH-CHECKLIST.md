# SEO-Launch-Checkliste

Reihenfolge nicht ändern. Manches baut aufeinander auf.

Auffällig ist vielleicht, dass **Bing vor Google** steht. Das hat einen Grund:
ChatGPT Search und Microsoft Copilot stützen sich stark auf den Bing-Index.
Wer dort nicht sauber indexiert ist, kann in KI-Antworten nicht auftauchen.
Bing ist außerdem deutlich schneller beim Aufnehmen neuer Seiten, vor allem
über IndexNow. Für ein junges lokales Unternehmen ist das der schnellste
sichtbare Effekt.

**Was in KI-Antworten wirklich zählt** – in dieser Reihenfolge, damit keine
Zeit an der falschen Stelle verbraucht wird:

1. **Im Index sein.** Bing zuerst (ChatGPT, Copilot), dann Google (Gemini,
   AI Overviews). Ohne Index keine Nennung, alles andere ist nachrangig.
2. **Eindeutige Unternehmensidentität.** Gleiche Firmierung, Adresse und
   Telefonnummer auf Website, im Impressum, in den strukturierten Daten und
   in jedem externen Profil. Antwortsysteme verknüpfen Angaben über genau
   diese Übereinstimmung.
3. **Direkte Antworten.** Unter jeder H1 stehen 40 bis 100 Wörter, die die
   Frage der Seite tatsächlich beantworten. Genau solche Absätze werden
   zitiert – lange Einleitungen nicht.
4. **Belegbarkeit.** Erfundene Bewertungen, Zertifikate oder Preisbeispiele
   sind nicht nur rechtlich riskant, sie fallen bei einem Abgleich mit
   anderen Quellen auf und kosten Vertrauen an der Stelle, wo es zählt.
5. **Erreichbarkeit für die richtigen Bots.** Suchbots erlaubt,
   Trainingssammler gesperrt – siehe Abschnitt „Strukturierte Daten und
   KI-Auffindbarkeit" in Phase 0.

Keine dieser Maßnahmen garantiert eine Nennung in ChatGPT, Copilot,
Perplexity oder Google AI Overviews. Wer das zusichert, verkauft etwas, das
er nicht liefern kann. Was sie leisten: Sie machen eine Nennung überhaupt
erst möglich und sorgen dafür, dass die genannten Angaben stimmen.

---

## Phase 0: Vor dem Livegang

### Inhalte und Recht
- [ ] `CONTENT-TODO.md` Abschnitt A vollständig abgearbeitet
- [x] Kontaktdaten in `src/config/site.ts` eingetragen: Telefon und WhatsApp
      `+49 176 86066817`, E-Mail `hello@schnellhelfer24.de`, Anschrift
      Lindenstr. 16, 10969 Berlin, Firmierung „Schnellhelfer24 – Inhaber
      Ersin Kaya", Einzelunternehmen *(Stand 30.07.2026)*
- [ ] Postfach `hello@schnellhelfer24.de` empfängt tatsächlich – mit einer
      echten Testmail prüfen, nicht annehmen
- [ ] Impressum anwaltlich geprüft
- [ ] Datenschutzerklärung ergänzt und geprüft (offen: Logfile-Speicherdauer
      beim Hoster, E-Mail-Anbieter, Datenschutzbeauftragter nach § 38 BDSG)
- [ ] AV-Vertrag mit Hostinger nach Art. 28 DSGVO tatsächlich abgeschlossen –
      die Datenschutzerklärung behauptet ihn bereits
- [ ] `public/api/config.local.php` angelegt, Testanfrage kommt an
- [ ] **Testanfrage prüfen:** Kommen Umfang, Anlass, Größe und
      Zusatzleistungen in Mail und JSON-Ablage an? Die Felder wurden ergänzt,
      konnten lokal aber nicht gegen PHP getestet werden
- [ ] Keine sichtbaren Platzhalter außer den bewusst markierten in Impressum
      und Datenschutz

### Sicherheit und Datenschutz auf dem Server *(neu, 06.08.2026)*

- [ ] **Ablage prüfen – das Wichtigste.** Eine Testanfrage mit Foto senden,
      dann die abgelegte Datei direkt im Browser aufrufen:
      `https://schnellhelfer24.de/api/_storage/anfragen/<datei>`
      **Es muss 403 oder 404 kommen.** Kommt das Bild, sind alle
      hochgeladenen Wohnungsfotos öffentlich abrufbar – dann sofort
      `storageDir` in `config.local.php` auf einen Pfad **oberhalb** von
      `public_html` setzen. Der Schutz hängt allein an `.htaccess`; ob
      Hostinger `AllowOverride` erlaubt, ließ sich lokal nicht prüfen.
- [ ] `php -l` auf dem Server über `anfrage.php` und `events.php` laufen
      lassen, oder beide einmal aufrufen. Beide sind lokal gegen PHP 8.3
      geprüft, die Serverversion kann abweichen.
- [ ] Prüfen, ob `mbstring` aktiv ist (`<?php var_dump(function_exists('mb_strlen'));`).
      Beide Endpunkte brauchen es. Auf Shared Hosting fast immer vorhanden.

### Messsystem *(neu, 06.08.2026 – bleibt zunächst AUS)*

- [ ] Datenschutzerklärung um die Reichweitenmessung ergänzt
      (Zweck, Kategorien, Aufbewahrung, Rechtsgrundlage)
- [ ] Anwaltlich geprüft, ob die Messung ohne Einwilligung zulässig ist.
      Technische Datensparsamkeit allein genügt dafür **nicht**.
- [ ] Erst danach in `config.local.php`: `'eventsEnabled' => true`
- [ ] Danach je einen Klick auslösen (Telefon, WhatsApp, Formularstart)
      und in `_storage/events/JJJJ-MM-TT.jsonl` kontrollieren:
      **keine IP-Adresse, kein Name, keine Telefonnummer, keine
      Formularinhalte, kein User-Agent.** Erwartet wird nur:
      `ts, event, page, visitor, device, channel` und je nach Ereignis
      `location`, `step`, `count`, `leistung` oder ein Web-Vitals-Wert.
- [ ] `npm run seo:events` muss grün sein, bevor neue Ereignisse ergänzt
      werden – sonst verwirft der Endpunkt sie stillschweigend.

### HSTS *(vorbereitet, NICHT aktiv)*

Gemessen am 06.08.2026: HTTPS liefert 200, `www` und `http` leiten korrekt
um, HSTS ist nicht gesetzt. Keine weitere Subdomain antwortet auf HTTPS –
aber `autodiscover.schnellhelfer24.de` hat einen DNS-Eintrag.

- [ ] Stufe 1: `Header always set Strict-Transport-Security "max-age=300"`
      in `public/.htaccess` freischalten, eine Woche beobachten
- [ ] Stufe 2: auf `max-age=31536000` erhöhen
- [ ] Stufe 3 (`includeSubDomains`) **nur**, wenn zuvor bestätigt wurde,
      dass jede Subdomain dauerhaft gültiges HTTPS liefert und die
      Mail-Einrichtung nicht leidet
- [ ] Preload-Liste: nicht empfohlen. Die Aufnahme ist praktisch dauerhaft.

Die vollständige Begründung samt Rücknahmeweg steht in `public/.htaccess`.

### Technik
- [x] `npm run audit:content` ohne Fehler *(30.07.2026)*
- [x] `npm run build` ohne Fehler *(30.07.2026)*
- [x] `npm run audit:build` ohne Fehler *(30.07.2026; 50 indexierbare URLs)*
- [x] `site.url` in `src/config/site.ts` stimmt mit der tatsächlichen Domain
      überein, inklusive www-Entscheidung
- [ ] Die www-Regel in `public/.htaccess` passt zu `site.url`. Beides muss
      dieselbe Variante ergeben, sonst zeigen die Canonicals ins Leere
- [x] SSL-Zertifikat aktiv, `https://` erzwungen *(live geprüft 30.07.2026)*
- [x] `.htaccess` ist mit hochgeladen worden (viele FTP-Programme blenden
      Punktdateien aus)
- [x] `api/_storage` ist über den Browser **nicht** erreichbar. Testen:
      `https://schnellhelfer24.de/api/_storage/` muss 403 oder 404 liefern
- [x] `https://schnellhelfer24.de/api/config.local.php` liefert 403 oder 404

### Analytics und Consent
- [ ] Entscheidung treffen, ob überhaupt ein Analytics-Dienst angebunden wird.
      Ohne Anbindung sammelt `src/components/Analytics.astro` die Ereignisse
      nur im Browser (`window.sh24.events`), setzt **kein Cookie** und sendet
      nichts nach außen – dafür braucht es auch kein Consent-Banner
- [ ] Bei einem cookiefreien, selbst gehosteten Dienst ohne personenbezogene
      Daten: Endpunkt eintragen, weiterhin kein Banner nötig
- [ ] Bei Google Analytics, Google Ads oder Meta Pixel: **Consent-Banner
      zwingend**, Laden erst nach `window.sh24.consent(true)`. Ablehnen muss
      genauso leicht sein wie Zustimmen, kein vorausgewähltes Häkchen
- [ ] Jeder eingebundene Dienst wird in der Datenschutzerklärung ergänzt:
      Anbieter, Zweck, Rechtsgrundlage, Speicherdauer, Empfänger,
      Drittlandtransfer, Widerruf
- [ ] Conversion-Ereignisse gegenprüfen: `phone_click`, `whatsapp_click`,
      `estimate_cta_click`, `lead_form_submitted`, `lead_confirmed` feuern
      auf allen wichtigen Seiten

### Strukturierte Daten und KI-Auffindbarkeit

Der Hebel für Antwortsysteme (ChatGPT Search, Copilot, Perplexity, Claude,
Gemini) ist nicht ein Trick, sondern: **eindeutige Unternehmensangaben,
eine direkte Antwort unter jeder H1, saubere Schema-Daten und ein Bing-Index,
der stimmt.** Diese Punkte prüfen:

- [ ] **Kontaktdaten überall identisch** (NAP). Telefon, Anschrift und
      Firmierung kommen aus `src/config/site.ts`, dürfen also nirgends
      abweichend von Hand stehen. Gegen Google-Unternehmensprofil und Bing
      Places abgleichen – schon eine abweichende Schreibweise
      („Lindenstraße" statt „Lindenstr.") schwächt die Zuordnung
- [ ] **Schema prüfen** mit dem Rich-Results-Test und dem Schema-Validator:
      `Organization`, `LocalBusiness`/`MovingCompany`, `Service`,
      `BreadcrumbList`, `WebPage`, `FAQPage`, `Article`. Keine Warnungen zu
      Pflichtfeldern
- [x] **Keine `aggregateRating`-Auszeichnung**, solange keine echten,
      öffentlich nachprüfbaren Bewertungen vorliegen. Technisch bereits
      doppelt abgesichert über verifizierte Summenwerte und sichtbare
      Einzelbewertungen. Der geprüfte Google-Summenwert wird sichtbar
      verlinkt, aber nicht als Rich-Result-Markup ausgegeben
- [ ] **`robots.txt` gegenlesen** (`/robots.txt`). Erlaubt sein müssen:
      `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`,
      `Claude-User`, `DuckAssistBot`, `Applebot-Extended`.
      Gesperrt bleiben die reinen Trainingssammler: `GPTBot`, `ClaudeBot`,
      `CCBot`, `Google-Extended`, `meta-externalagent`, `Bytespider`.
      Wer die Inhalte auch fürs Training freigeben will, entscheidet das
      bewusst – siehe `docs/KI-CRAWLER.md`
- [ ] **`/llms.txt` gegenlesen.** Enthält Positionierung, Firmierung,
      Anschrift, Telefon, typische Anlässe und die Aussage zu Kostenträgern.
      Kein Standard, aber die kompakteste maschinenlesbare Zusammenfassung
      des Angebots
- [x] **Direkte Antwort unter jeder H1** vorhanden und 40–100 Wörter lang.
      `npm run audit:content` meldet Abweichungen
- [x] **Kein Inhalt nur per JavaScript.** Die Seite ist statisch gebaut;
      wer neue Bausteine ergänzt, darf daran nichts ändern – Antwortsysteme
      rendern in der Regel kein JS nach

### Weiterleitungen
- [ ] Alle URLs der bisherigen Website gesammelt (Search Console, Bing
      Webmaster Tools, alte Sitemap, Serverlogs, Crawler). Öffentliche
      Websuche und Wayback-CDX lieferten am 30.07.2026 nur die Startseite
      beziehungsweise keine archivierten Unterseiten; GSC/Serverlogs bleiben
      deshalb die maßgebliche offene Quelle.
- [ ] Jede alte URL auf die thematisch passende neue Seite weitergeleitet,
      **nicht** pauschal auf die Startseite. Pauschale Weiterleitungen auf `/`
      wertet Google wie einen 404
- [ ] Nach dem Umstellen mit einem Crawler prüfen: keine Weiterleitungsketten,
      keine Schleifen, keine 404 aus internen Links

---

## Phase 1: Am Tag des Livegangs

### Bing Webmaster Tools (zuerst)
1. [ ] Konto unter `bing.com/webmasters` anlegen
2. [ ] Domain hinzufügen und verifizieren (DNS-Eintrag oder Meta-Tag)
3. [ ] Sitemap einreichen: `https://schnellhelfer24.de/sitemap.xml`
4. [x] IndexNow prüfen: Ist die Schlüsseldatei
       `https://schnellhelfer24.de/<KEY>.txt` erreichbar und enthält sie
       genau den Schlüssel? Ohne das lehnt IndexNow mit HTTP 403 ab
5. [x] Vollständige Erstmeldung: 47 URLs, HTTP 202. Nach dem Ratgeber-Ausbau
       zusätzlich 21 neue oder geänderte URLs, HTTP 202. Nach der
       Lesbarkeitsoptimierung weitere 18 geänderte URLs, HTTP 200
       und nach dem Schrittlisten-Fix weitere 13 URLs, HTTP 200
       *(30.07.2026)*
6. [ ] URL-Prüfung für Startseite und die wichtigste Leistungsseite
7. [ ] Unter „Site Scan" den ersten Crawl anstoßen

### Google Search Console
1. [x] Domain-Property `schnellhelfer24.de` angelegt *(30.07.2026)*
2. [x] Per DNS-TXT-Eintrag verifiziert *(30.07.2026; Eintrag nicht löschen)*
3. [x] Sitemap `https://schnellhelfer24.de/sitemap.xml` erfolgreich erneut
       eingereicht; Google hat 50 Seiten erkannt *(30.07.2026)*
4. [x] URL-Prüfung durchgeführt: Startseite bereits indexiert; für
       Wohnungsauflösung, Entrümpelung und Nachlassauflösung wurde die
       Indexierung beantragt. Zusätzlich wurden Jobcenter-Umzugskosten,
       Sperrmüll/Möbel-Entsorgung und die PDF-Checkliste einzeln beantragt
       *(30.07.2026)*
5. [ ] Unter „Einstellungen → Crawling-Statistiken" nach dem ersten Crawl
       prüfen, ob Fehler auftreten

### Prüfungen von außen
- [x] `https://schnellhelfer24.de/robots.txt` erreichbar, Sitemap-Verweis
      enthalten, `OAI-SearchBot` **nicht** gesperrt
- [x] `https://schnellhelfer24.de/sitemap.xml` erreichbar, enthält nur
      indexierbare Seiten
- [x] `https://schnellhelfer24.de/llms.txt` erreichbar
- [ ] Rich-Results-Test von Google für Startseite, eine Leistungsseite, eine
      Bezirksseite und einen Ratgeber
- [x] Neuer Jobcenter-Ratgeber im offiziellen Google-Test: 4 gültige
      Elementtypen; Article-Warnungen zu Bild und Datumswerten behoben.
      Verbleibend ist nur der bewusst akzeptierte optionale
      `LocalBusiness.priceRange`-Hinweis *(30.07.2026)*
- [x] Alle zwölf Kosten- und Ratgeberseiten auf 375 Pixel Breite geprüft:
      zwei kurze Direktantwort-Absätze je Seite, kein horizontaler Überlauf
      *(30.07.2026)*
- [x] Nummerierte Schrittlisten nach einem Mobilgerät-Fund korrigiert:
      Überschrift und Absatz teilen sich nun die breite Inhaltsspalte; alle
      zehn betroffenen Ratgeberseiten erneut auf 375 Pixel geprüft
      *(30.07.2026)*
- [ ] Schema-Validator (`validator.schema.org`) für dieselben Seiten
- [ ] Prüfen: Es darf **kein** `aggregateRating` ausgegeben werden, solange
      keine echten Bewertungen sichtbar auf der Seite stehen
- [ ] PageSpeed Insights für Startseite, wichtigste Leistungsseite,
      Bezirksseite, Ratgeber und Formularseite
- [x] 404-Seite testen: eine erfundene URL aufrufen, muss Statuscode 404 und
      die gestaltete Seite liefern
- [ ] Social-Vorschau prüfen: Link in WhatsApp und LinkedIn einfügen, muss
      `og-default.png` zeigen

---

## Phase 2: Unternehmensprofile (erste Woche)

Für ein lokales Dienstleistungsunternehmen ist das der wirksamste Hebel
überhaupt, wirksamer als jede On-Page-Optimierung.

### Google-Unternehmensprofil
- [ ] Profil anlegen oder beanspruchen
- [ ] Als **Dienstleistungsgebiet-Unternehmen** einrichten, wenn keine
      Kundschaft die Adresse aufsucht. Dann wird die Adresse nicht öffentlich
      angezeigt, das Einsatzgebiet aber schon
- [ ] Hauptkategorie: „Entrümpelungsdienst". Weitere Kategorien: „Umzugsdienst",
      „Entsorgungsunternehmen"
- [ ] Einsatzgebiet eintragen: Berliner Bezirke und die Orte im Umland, die
      wirklich bedient werden
- [ ] Leistungen einzeln anlegen, mit denselben Bezeichnungen wie auf der
      Website
- [ ] Öffnungszeiten identisch mit der Kontaktseite
- [ ] Echte Fotos hochladen, sobald vorhanden. Profile mit Fotos werden
      deutlich häufiger angeklickt
- [ ] Verifizierung abschließen (Postkarte oder Video)

### Bing Places
- [ ] Profil anlegen. Der Import aus dem Google-Profil funktioniert und spart
      Zeit
- [ ] Angaben gegenprüfen, der Import ist nicht immer vollständig

### NAP-Konsistenz
Name, Adresse und Telefonnummer müssen **überall zeichengenau identisch**
sein. Unterschiedliche Schreibweisen sind der häufigste Grund, warum ein
lokales Unternehmen nicht eindeutig zugeordnet wird.

**Der verbindliche Stand, gegen den überall abgeglichen wird:**

```
Schnellhelfer24 – Inhaber Ersin Kaya
Lindenstr. 16
10969 Berlin
Telefon: +49 176 86066817   (Anzeigeform: 0176 86066817)
E-Mail:  hello@schnellhelfer24.de
Web:     https://schnellhelfer24.de
```

Diese Angaben stehen an genau einer Stelle im Code (`src/config/site.ts`) und
werden von Kopf- und Fußbereich, Impressum, Kontaktseite, allen Telefon-,
WhatsApp- und Mail-Links, `llms.txt` und sämtlichen strukturierten Daten
gelesen. Wer sie ändert, ändert sie dort – und trägt die Änderung danach in
jedem externen Profil nach.

Ein offener Punkt: `hasVisitableAddress` steht auf `false` (Dienstleister
ohne Kundenverkehr vor Ort). Falls Kundschaft die Lindenstraße aufsuchen
kann, muss der Wert auf `true` – sonst wird die Adresse in Google und Bing
versteckt geführt.

Prüfen auf:
- [ ] Website (kommt aus `src/config/site.ts`, also automatisch konsistent)
- [ ] Impressum
- [ ] strukturierte Daten
- [ ] Google-Unternehmensprofil
- [ ] Bing Places
- [ ] Gelbe Seiten, 11880, Das Örtliche, wlw
- [ ] Social-Media-Profile
- [ ] alle Branchenverzeichnisse, in denen das Unternehmen bereits steht

Die Profil-URLs anschließend in `src/config/site.ts` unter `profiles`
eintragen. Sie werden dann als `sameAs` ausgezeichnet.

---

## Phase 3: Bewertungen (fortlaufend ab Woche 1)

Ohne Bewertungen bleibt das Google-Profil in der lokalen Suche zurück, egal
wie gut die Website ist.

- [ ] Kurzlink zum Bewertungsformular anlegen und im Handy speichern
- [ ] Nach jedem abgeschlossenen Einsatz fragen, solange die Erleichterung
      frisch ist. Per WhatsApp direkt nach der Übergabe
- [ ] Bei Nachlassaufträgen zurückhaltend sein, erst nach einigen Tagen fragen
- [ ] Auf **jede** Bewertung antworten, auch auf kritische. Sachlich, ohne
      Rechtfertigung, mit einem konkreten Angebot zur Klärung
- [ ] Bewertungen niemals kaufen oder selbst schreiben. Das ist wettbewerbs-
      widrig, Google erkennt es zunehmend, und es fliegt regelmäßig auf
- [ ] Sobald echte Bewertungen vorliegen: in `src/data/reviews.ts` eintragen
      und in `src/config/site.ts` `ratings.verified` auf `true` setzen

---

## Phase 4: Nach dem Livegang laufend

### Wöchentlich
- [ ] Search Console: Abdeckungsfehler prüfen
- [ ] Bing Webmaster Tools: Crawl-Fehler prüfen
- [ ] Neue Bewertungen beantworten

### Nach jedem Deployment
```bash
npm run audit:content
npm run build
npm run audit:build
# hochladen
npm run indexnow
```

`.indexnow-state.json` gehört ins Repository, damit der nächste Lauf weiß,
was sich geändert hat.

### Monatlich
- [ ] Search Console: Welche Suchanfragen bringen Klicks? Gibt es Fragen, für
      die noch keine Seite existiert?
- [ ] Bing Webmaster Tools: dieselbe Auswertung
- [ ] Analytics: Verhältnis von Anrufen, WhatsApp-Klicks und Formularanfragen
- [ ] Referrer prüfen: Kommen Besuche aus `chatgpt.com`, `perplexity.ai` oder
      `copilot.microsoft.com`? Der Kanal `ai` ist dafür in
      `src/components/Analytics.astro` vorbereitet
- [ ] Formularabbrüche prüfen (`estimate_abandoned` mit `lastStep`): Bei
      welchem Schritt springen Leute ab?

### Quartalsweise
- [ ] Auftragsdaten auswerten und `src/data/costs.ts` aktualisieren
- [ ] Neue Einsatzberichte veröffentlichen
- [ ] `npm run audit:content` meldet Entwürfe, die inzwischen vollständig sind
- [ ] Aktualisierungsdaten der wichtigsten Seiten pflegen (nur wenn wirklich
      etwas geändert wurde, sonst ist es Etikettenschwindel)

---

## Contentplan für die ersten 90 Tage

Grundsatz: **wenige Seiten, dafür jede besser als alles, was zu diesem Thema
in Berlin online steht.** Nicht: 50 dünne Seiten.

### Tage 1 bis 30: Grundlage sichern

| Was | Warum |
|---|---|
| Kontaktdaten, Impressum, Datenschutz vervollständigen | Ohne das ist alles andere wirkungslos |
| Google-Unternehmensprofil und Bing Places | Größter Hebel in der lokalen Suche |
| Erste fünf Bewertungen einsammeln | Ab etwa fünf Bewertungen wird das Profil sichtbar besser platziert |
| Echte Fotos von Team und Fahrzeug | Ersetzen die stärkste Leerstelle der Website |
| Bei jedem Einsatz Daten erfassen | Grundlage für Preisdaten und Einsatzatlas |
| Weiterleitungen der alten URLs | Bewahrt vorhandene Rankings |

Keine neuen Seiten in diesem Zeitraum. Die vorhandenen 37 Seiten reichen
völlig aus, um erste Anfragen zu erzeugen.

### Tage 31 bis 60: Beweise nachliefern

| Was | Warum |
|---|---|
| Erste drei echte Einsatzberichte | Der Inhalt, den kein Wettbewerber kopieren kann |
| Vierte Bezirksseite, dort wo am meisten gearbeitet wird | Aus eigener Erfahrung, nicht aus Recherche |
| Kostendaten sammeln, noch nicht veröffentlichen | Für 20 Fälle je Kategorie braucht es Zeit |
| Bewertungen auf zehn bis fünfzehn ausbauen | |
| Seite „Umzug mit Kostenübernahme in Berlin" | Falls die Voraussetzungen bestätigt sind (siehe `CONTENT-TODO.md`, Abschnitt B). Sehr gesuchtes Thema mit wenig gutem Angebot |

### Tage 61 bis 90: Autorität aufbauen

| Was | Warum |
|---|---|
| Preisdaten veröffentlichen, sobald belastbar | Der stärkste zitierfähige Inhalt der Website |
| Drei weitere Einsatzberichte, andere Bezirke | |
| Fünfte und sechste Bezirksseite | |
| Erste Auswertung je Bezirk (Anzahl Einsätze, typische Volumen, Dauer) | Genau die Art Daten, die Antwortsysteme zitieren |
| Ratgeber „Entrümpelung im Altbau ohne Aufzug" | Die häufigste Berliner Sondersituation, aus eigenen Einsätzen belegbar |

### Die zehn Seiten, die als Nächstes entstehen sollten

Nach Erwartungswert sortiert:

1. `/leistungen/umzug-mit-kostenuebernahme-berlin/` — Jobcenter, Sozialamt,
   Pflegekasse. Anschlussfähig an das bisherige Angebot, hohe Nachfrage,
   wenig gute Konkurrenz. Nur mit bestätigten Voraussetzungen.
2. `/berlin/neukoelln/` — hohe Umzugs- und Räumungsdichte
3. `/berlin/mitte/` — inklusive Wedding und Moabit
4. `/berlin/friedrichshain-kreuzberg/` — junge, mobile Bevölkerung
5. `/einsatzberichte/<erster echter Bericht>/`
6. `/kosten/entruempelung-nach-wohnungsgroesse/` — sobald Preisdaten vorliegen
7. `/leistungen/kleintransport-moebeltransport-berlin/` — Entwurf ist
   vorhanden, braucht Mindestpauschale und Radius
8. `/ratgeber/entruempelung-altbau-ohne-aufzug/`
9. `/berlin/lichtenberg/` — inklusive Hohenschönhausen
10. `/leistungen/dachbodenentruempelung-berlin/` — Entwurf vorhanden

### Was ausdrücklich nicht gemacht wird

- Keine automatisch erzeugten Kombinationen aus Leistung und Ort
  („Entrümpelung Wedding", „Entrümpelung Moabit", …). Das sind Doorway Pages.
- Keine Blogartikel ohne konkreten Anlass.
- Kein Linkkauf und keine Verzeichniseinträge, die nur der Verlinkung dienen.
- Keine Seiten für Leistungen, die nicht wirklich angeboten werden.

---

## Erste sinnvolle A/B-Tests

Erst testen, wenn genug Traffic da ist, damit ein Unterschied überhaupt
messbar wird. Als grober Richtwert: mindestens 100 Zielereignisse je Variante.
Vorher sind Unterschiede reines Rauschen.

Nach erwartetem Effekt sortiert:

1. **Primärer Handlungsaufruf im Hero.**
   „Fotos senden & Einschätzung erhalten" gegen „Kostenlose Besichtigung
   vereinbaren". Die erste Variante ist niedrigschwelliger, die zweite
   qualifizierter. Messgröße: abgeschlossene Anfragen, nicht Klicks.

2. **Telefonnummer im Hero.**
   Sichtbare Nummer als zweiter Handlungsaufruf gegen nur Formular. In dieser
   Branche rufen viele lieber an, besonders bei Zeitdruck. Messgröße:
   `phone_click` plus `lead_form_submitted` zusammen.

3. **Formular: Fotos früher oder später abfragen.**
   Derzeit sind Fotos Schritt 5. Test: Fotos direkt als Schritt 2. Früher
   könnte die Qualität der Anfragen erhöhen, aber auch mehr Abbrüche
   verursachen. Messgröße: Anfragen **mit** Fotos, nicht Anfragen insgesamt.

4. **Anzahl der Schritte.**
   Sechs Schritte gegen vier (Ort und Umfang zusammenlegen, Zeitraum zu
   Kontakt). Messgröße: Abschlussquote, gegengeprüft an der Vollständigkeit
   der Angaben.

5. **Einstieg nach Situation gegen Leistungsliste.**
   Derzeit stehen die Situationen zuerst. Test: Leistungen zuerst.
   Messgröße: Klickrate in die Tiefe und Anfragen je Sitzung.

6. **Sticky-Leiste auf Mobilgeräten.**
   Mit gegen ohne. Sie hilft messbar, kann aber auf kleinen Geräten stören.
   Messgröße: Anfragen je Sitzung auf Mobilgeräten.

Für alle Tests gilt: **Zielgröße ist die qualifizierte Anfrage, nicht der
Klick.** Eine Variante, die mehr Klicks und weniger Aufträge bringt, ist die
schlechtere.
