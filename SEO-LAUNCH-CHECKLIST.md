# SEO-Launch-Checkliste

Reihenfolge nicht ändern. Manches baut aufeinander auf.

Auffällig ist vielleicht, dass **Bing vor Google** steht. Das hat einen Grund:
ChatGPT Search und Microsoft Copilot stützen sich stark auf den Bing-Index.
Wer dort nicht sauber indexiert ist, kann in KI-Antworten nicht auftauchen.
Bing ist außerdem deutlich schneller beim Aufnehmen neuer Seiten, vor allem
über IndexNow. Für ein junges lokales Unternehmen ist das der schnellste
sichtbare Effekt.

---

## Phase 0: Vor dem Livegang

### Inhalte und Recht
- [ ] `CONTENT-TODO.md` Abschnitt A vollständig abgearbeitet
- [ ] Impressum anwaltlich geprüft
- [ ] Datenschutzerklärung ergänzt und geprüft
- [ ] `public/api/config.local.php` angelegt, Testanfrage kommt an
- [ ] Keine sichtbaren Platzhalter außer den bewusst markierten in Impressum
      und Datenschutz

### Technik
- [ ] `npm run audit:content` ohne Fehler
- [ ] `npm run build` ohne Fehler
- [ ] `npm run audit:build` ohne Fehler
- [ ] `site.url` in `src/config/site.ts` stimmt mit der tatsächlichen Domain
      überein, inklusive www-Entscheidung
- [ ] Die www-Regel in `public/.htaccess` passt zu `site.url`. Beides muss
      dieselbe Variante ergeben, sonst zeigen die Canonicals ins Leere
- [ ] SSL-Zertifikat aktiv, `https://` erzwungen
- [ ] `.htaccess` ist mit hochgeladen worden (viele FTP-Programme blenden
      Punktdateien aus)
- [ ] `api/_storage` ist über den Browser **nicht** erreichbar. Testen:
      `https://schnellhelfer24.de/api/_storage/` muss 403 oder 404 liefern
- [ ] `https://schnellhelfer24.de/api/config.local.php` liefert 403 oder 404

### Weiterleitungen
- [ ] Alle URLs der bisherigen Website gesammelt (Search Console, Bing
      Webmaster Tools, alte Sitemap, Serverlogs, Crawler)
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
4. [ ] IndexNow prüfen: Ist die Schlüsseldatei
       `https://schnellhelfer24.de/<KEY>.txt` erreichbar und enthält sie
       genau den Schlüssel? Ohne das lehnt IndexNow mit HTTP 403 ab
5. [ ] `npm run indexnow -- --all` ausführen und HTTP 200 oder 202 prüfen
6. [ ] URL-Prüfung für Startseite und die wichtigste Leistungsseite
7. [ ] Unter „Site Scan" den ersten Crawl anstoßen

### Google Search Console
1. [ ] Property anlegen, am besten als Domain-Property
2. [ ] Verifizieren (DNS-Eintrag)
3. [ ] Sitemap einreichen: `sitemap.xml`
4. [ ] URL-Prüfung für Startseite und die wichtigsten Leistungsseiten,
       jeweils Indexierung beantragen
5. [ ] Unter „Einstellungen → Crawling-Statistiken" nach dem ersten Crawl
       prüfen, ob Fehler auftreten

### Prüfungen von außen
- [ ] `https://schnellhelfer24.de/robots.txt` erreichbar, Sitemap-Verweis
      enthalten, `OAI-SearchBot` **nicht** gesperrt
- [ ] `https://schnellhelfer24.de/sitemap.xml` erreichbar, enthält nur
      indexierbare Seiten
- [ ] `https://schnellhelfer24.de/llms.txt` erreichbar
- [ ] Rich-Results-Test von Google für Startseite, eine Leistungsseite, eine
      Bezirksseite und einen Ratgeber
- [ ] Schema-Validator (`validator.schema.org`) für dieselben Seiten
- [ ] Prüfen: Es darf **kein** `aggregateRating` ausgegeben werden, solange
      keine echten Bewertungen sichtbar auf der Seite stehen
- [ ] PageSpeed Insights für Startseite, wichtigste Leistungsseite,
      Bezirksseite, Ratgeber und Formularseite
- [ ] 404-Seite testen: eine erfundene URL aufrufen, muss Statuscode 404 und
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
