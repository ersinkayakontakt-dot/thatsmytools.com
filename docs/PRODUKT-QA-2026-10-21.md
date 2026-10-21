# Produktprüfung · 21.10.2026

Lokaler Entwurf gemäß E-013. Inzwischen mit Betreiberfreigabe veröffentlicht: Quelle ee14bf7 / Build 676e39e. Nachfolgende lokale Prüfungen wurden vor Freigabe ausgeführt; anschließend regulärer Live-Test, siehe unten.

## Ergebnis

- Produktionsbuild, Astro-Check (0 Fehler/Warnungen/Hinweise), Inhaltsaudit und Buildaudit bestanden. 78 HTML-Seiten, 58 indexierbar; URLs erhalten.
- SEO: Metadaten, Kannibalisierung, Schema, Bilder und deklarierte Farbkontraste ohne Fehler oder Warnungen. Elf Linkgraph-Hinweise bleiben redaktionell unter SEO-2026-04 offen; keine Prüfgrenzen geändert.
- Ereignisprüfung: 23 registrierte Ereignisse konsistent. Ungültiges Absenden markiert nicht mehr vorzeitig einen erfolgreichen Versandversuch.
- PHP-Syntax von Anfrage, SMTP, Konfigurationsbibliothek und Konfigurationsvorlage geprüft.
- audit:mail:selftest: 14/14 SMTP-Fälle bestanden (einschließlich Ablehnung, Nichterreichbarkeit, Header- und Passwortschutz).
- audit:request:selftest: 6/6 echte lokale HTTP-/PHP-Szenarien bestanden: Speicherung/SMTP/Referenz, fehlende E-Mail bei Antwortwunsch, ungültige PLZ, SMTP-Ausfall bei erhaltener Anfrage, blockierte Request-Ablage ohne Versand, unechtes JPEG wird nicht als Foto gespeichert und erzeugt einen ehrlichen Hinweis.
- 17 Browser-Szenarien bestanden: vier adaptive Zweige (Montage, Maler, Räumung, offene Beratung), Pflichtfeldfehler, Datenübertragung gegen abgefangenen lokalen Test-Endpunkt, Wiederaufnahme nach simuliertem Fehler, neutrale Direktaufrufe der Empfangsseite, responsive Ansichten bei 320/375/768/1280/1440/1920 px ohne horizontalen Überlauf.
- Zusätzlich geprüft: sichtbare Fortschrittszahlen, Tastatur-Sprunglink und Menü, Rücknavigation, Wechsel von Möbelmontage zu Tapezieren ohne PLZ-Verlust, Küchenmontage im Ausbaufilter, ohne JavaScript alle sechs Feldgruppen und Absenden erreichbar.
- Bilder vor Screenshot vollständig geladen und dekodiert; keine defekten Bilder. Vorher/Nachher von Startseite und Formular visuell verglichen. Dabei sichtbare versteckte Fortschrittspunkte korrigiert. Kein vollständiger externer WCAG- oder Nutzertest und keine gemessene Conversionverbesserung.
- Empfangsseite zeigt fehlende Fotos auch ohne vorhandene Browser-Zusammenfassung. Fehler-/Empfangs-Screenshots ergänzend gespeichert.

## Prüfen und ansehen

Vorschau: http://127.0.0.1:4322/

Screenshots befinden sich in C:/Users/enter/.codex/visualizations/2026/09/11/01a08ef3-ddc1-7552-8bac-ee415d18eb9e/:

- ux-vorher-start-375.png / ux-vorher-start-1440.png
- ux-vorher-anfrage-375.png / ux-vorher-anfrage-1440.png
- ux-nachher-start-375.png / ux-nachher-start-768.png / ux-nachher-start-1440.png
- ux-nachher-anfrage-375.png / ux-nachher-anfrage-768.png / ux-nachher-anfrage-1440.png
- ux-erste-ansicht-375.png / ux-erste-ansicht-768.png / ux-erste-ansicht-1440.png
- ux-fehlerzustand-1440.png / ux-empfang-fotohinweis-1440.png

## Live-Abgleich nach Freigabe

58 indexierbare URLs HTTP 200; Startseite, neutrale Empfangsseite und neue CSS-Dateien bestätigt. Drei Formularzweige (Montage/Maler/Räumung) bei 375/768/1440 px, alle Bilder geladen, kein Überlauf oder JavaScript-Fehler. Private Ablage liefert 403. Regulärer vollständiger POST ohne Honeypot mit eindeutiger Testkennzeichnung wurde auf nicht-konfiguriert umgeleitet. Keine erfolgreiche Speicherung oder Zustellung behauptet; OPS-2026-02 erfasst die Abhängigkeit. Die frühere Honeypot-Probe wurde nicht als Funktionsbeweis verwendet.

Vier-Hut-Releaseprüfung: Staff – gültigen Build übertragen; Architektur – Astro/PHP und bestehende URLs erhalten; Daten – keine serverseitigen Laufzeitdaten oder Zugangsdaten versioniert; QA – Live-Frontend geprüft, echtes Backend-Defizit separat ausgewiesen. Sicherheitscheck: geschützte Ablage, keine persönlichen Daten in Testausgaben, keine Authentifizierungs-/Konfigurationsänderung.

Die Fehlerrückmeldung wurde anschließend über 4e8105b veröffentlicht und per Live-HTML bestätigt. Lokaler Browsercheck: sichtbarer Hinweis bei fehler=1, Kontaktlink, kein Überlauf und kein JavaScript-Fehler.

## Reparaturprüfung E-014

Live 2a8a55f / Quelle 5051448. Sieben lokale HTTP-/PHP-Fälle bestanden, einschließlich Standardkontaktwerte ohne private Empfänger-/Absenderangaben; beide PHP-Adressen werden gegen zentrale site.email geprüft. SMTP-Selbsttest 14/14, Konfigurations-Selbsttest 6/6, PHP-Syntax, Build, Astro-Check, Inhalts-/Build-/SEO-Audits bestanden. Darstellung eines echten Mailfehlers auf Empfangsseite bei 375 px ohne Überlauf oder JavaScript-Fehler geprüft.

Ein schneller erster Browsertest endete ohne Referenz und zählt nicht als Erfolg. Weitere Live-Testanfrage wurde zunächst durch automatische Freigabeprüfung blockiert; Betreiber hat sie anschließend ausdrücklich erlaubt. Danach komplette Formularbedienung im Browser: leerer Honeypot, über zehn Sekunden Ausfüllzeit, Empfangsreferenz SH-261021-DAF10, versand=ok und korrekte Empfangsüberschrift ohne Mailwarnung. Belegt Speicherung vor Mailversand und erfolgreiche Mailübergabe; tatsächlicher Posteingang wird separat beim Betreiber erfragt. Screenshot reparatur-live-empfang.png liegt im gleichen Screenshotverzeichnis.

## Noch offen

Tatsächlichen Eingang der freigegebenen Testmail im Betreiberpostfach bestätigen. Bei ausbleibender Zustellung private SMTP-Konfiguration beim Hoster prüfen. Fotoannahme war nicht Bestandteil dieses letzten Tests. Lokale Protokolltests beweisen keine Zustellung ins echte Postfach. Bei Mailausfall muss die gespeicherte Anfrage betrieblich bearbeitet werden. Keine vorhandene automatische Disposition, authentifizierte Projektverfolgung oder Sofortbuchung; deshalb keine solche Zusage in der Oberfläche. Ziele und Benchmarkgrenzen: docs/PRODUKT-UND-DESIGN.md.
