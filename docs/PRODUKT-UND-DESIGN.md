# Schnellhelfer24: Produkt und Gestaltung

Stand und Quellenabruf: 21.10.2026. Gemeinsame Arbeitsgrundlage für Codex und Claude. Entscheidung E-013; Tracker UX-2026-01 / FLOW-2026-01. Betreiberfreigabe am 21.10.2026 erhalten; erste Veröffentlichung 676e39e live geprüft. Konfigurationsabbruch inzwischen nach E-014 repariert, reguläre Live-Anfrage gespeichert und Mailübergabe bestätigt; Betreiber bestätigt tatsächlichen Empfang im Spamordner; verbleibende Zustellqualität unter MAIL-2026-01.

## Produkt und Menschen

Schnellhelfer24 ist ein direkter Dienstleister für Räumung, Umzug, Montage und abgestimmte Ausbauvorhaben in Berlin und Umland. Kein Anbieter-Marktplatz und kein vorhandenes Kundenkonto-, Zahlungs- oder Dispositionssystem. Maler- und Tapezierarbeiten werden mit qualifizierten Fachbetrieben abgestimmt (docs/HANDWERKSRECHT.md). Ein eigener Anbieterbereich löst derzeit kein bestehendes Produktproblem.

Private Auftraggeber möchten eine einzelne Aufgabe erledigen, ihr Zuhause verändern oder einen Haushalt auflösen. Angehörige benötigen oft Orientierung ohne Zeitdruck. Verwaltungen und Betriebe brauchen abgestimmte Leistungsumfänge. Hauptaufgabe: Vorhaben passend beschreiben, Kontaktweg wählen, Angaben prüfen und eine echte gespeicherte Anfrage erhalten. Eine Anfrage bucht keinen Termin und erzeugt keinen Auftrag.

## Benchmark: Beobachtungen und Grenzen

Alle Quellen unten am 21.10.2026 abgerufen. Öffentlich beobachtbare Funktionen sind Anbieterbehauptungen, keine nachgewiesene Servicequalität. Es wurden keine echten Aufträge erstellt oder Anbieter kontaktiert.

| Bereich | MyHammer: beobachtet | Taskrabbit: beobachtet | Folgerung für Schnellhelfer24 |
|---|---|---|---|
| Einstieg / Suche | Tätigkeitsbeschreibung und Leistungsgruppen auf der Startseite [M1] | Aufgaben/Kategorien und ausgewählte Leistungen [T1] | Aufgabe vor Unternehmensbeschreibung zeigen |
| Anfrage | Auftrag und Fotos beschreiben, Angebote erhalten [M2] | Verlinkter Buchungseinstieg mit erster Aufgabenbeschreibung [T2] | Relevante Folgefragen, Fotos optional |
| Auswahl / Vertrauen | Profile, Bewertungen und Preisvergleich [M2] | Tasker nach Fähigkeiten, Preis, Bewertungen; Identitäts- und Schutzversprechen [T1] | Kein Vergleichsportal erfinden; reale Unternehmenskontakte und gekennzeichnete Bilder |
| Preis | Umfang, Preis und Termine vor Ausführung vereinbaren [M2] | Projektpreise ab einem Betrag auf Startseite; Servicegebühr laut Hilfe im angezeigten Stundenpreis, separate Vertrauens-/Hilfsgebühr laut Rechnungs-Hilfe [T3/T4] | Kostenarten erklären; keine eigenen Fantasiepreise oder pauschalen Konkurrenzgebühren |
| Termin / Abwicklung | Absprache mit ausgewähltem Betrieb [M2] | Auswahl, Termin, Chat, Zahlung und Bewertung werden beschrieben [T1] | Nur Wunschzeit abfragen, tatsächliche Bestätigung ausdrücklich getrennt |
| Mobil | App-Verweise und kurze Einstiege öffentlich sichtbar [M1] | Aufgabenbasierte Einstiege und App-Verweise [T1] | Gleiche zentrale Anfrage auf Mobil und Desktop |

Die öffentlichen Hauptseiten und Hilfen waren zugänglich. Die nachfolgenden interaktiven bzw. kontogebundenen Buchungs-, Zahlungs-, Anbieter- und Terminabläufe wurden nicht vollständig durchlaufen. Aus der Textansicht lässt sich keine belastbare Aussage über tatsächliche Touch-Bedienung oder Feldvalidierung der Wettbewerber ableiten. Aus nicht sichtbaren Funktionen wird keine Funktionslücke abgeleitet.

### Unabhängige Berichte: begrenzte Aussagekraft

In zwei verschiedenen Reddit-Diskussionen [U1/U2] berichten einzelne Anbieter wiederholt von Kontaktkosten ohne anschließende Auftragserteilung sowie Schwierigkeiten mit unklar beschriebenen Aufträgen. Das sind selbstselektierte, nicht unabhängig verifizierte Erfahrungsberichte; Häufigkeit, Aktualität jeder Einzelbeschwerde und Repräsentativität sind unbekannt. Die offizielle MyHammer-Regel zum bestätigten Kontakt [M3] belegt den Mechanismus, nicht die Beschwerdehäufigkeit. Schnellhelfer24 verkauft keine Anbieter-Leads: daraus folgt keine unmittelbar übertragbare Preislücke.

Die Trustpilot-Recherche zu Taskrabbit ergab gemischte Signale über Kommunikation und Termine. Es wurde keine ausreichend verifizierte Reihe unabhängiger Einzelberichte ausgewertet. Daher keine Behauptung eines wiederkehrenden Taskrabbit-Problems und keine Übernahme zusammengefasster Bewertungstexte als Fakten.

## Chancenbewertung

Nutzen/Aufwand sind interne Einschätzungen (hoch/mittel/klein), keine Messwerte. Die drei ersten Chancen sind umgesetzt.

| Priorität / Chance | Nutzerproblem und Evidenz | Wettbewerbsabdeckung | Nutzen / Aufwand / Machbarkeit |
|---|---|---|---|
| 1 Relevante Projektfragen | Vorher gleiche Räumungsfragen für Möbel und Maler; im eigenen Formular belegt. Wand-/Deckenfläche und Wohnfläche verwechselt man leicht (Hypothese zur Häufigkeit). | Beide Benchmarks kennen aufgabenbezogene Einstiege; Detailqualität nicht vollständig geprüft | Hoch / mittel / vorhandenes PHP nutzbar |
| 2 Leistungsumfang vor Preis | Auftraggeber brauchen Klarheit über Material, Anfahrt, Vorbereitung, Entsorgung und Zusatzarbeiten; Kostenlogiken bei M2/T3/T4 sichtbar | Leistungs-/Preisabsprachen sind abgedeckt, kein belegter exklusiver Vorteil | Hoch / klein / Texte und strukturierte Angaben möglich |
| 3 Ehrlicher Eingang und Entwurf | Alte Weiterleitung bestätigte auch nach gescheiterter Ablage; Entwurf wurde beim Senden gelöscht (Codebefund) | Wettbewerber beschreiben Abwicklung; Fehlerfälle nicht beobachtet | Hoch / mittel / Speicherung vor Versand, Wiederaufnahme bei Fehler |
| Später Leistungsbestätigung / Zusatzwünsche | Unklarer späterer Projektstand; Bedarf noch operativ zu validieren | Taskrabbit beschreibt Chat und Abwicklung | Hoch / groß / Datenmodell, Authentifizierung, Zuständigkeit fehlen |
| Später feste Montagebuchung | Weniger Schritte für kleine Aufgaben (Hypothese) | Taskrabbit bietet Buchungsablauf | Mittel / groß / echte Preise, Kapazitäten und verbindliche Disposition fehlen |
| Nicht priorisiert Anbieterportal | Kein Anbieter-Marktplatz vorhanden | Beide Wettbewerber unterstützen Anbieter | Kein aktueller Produktbedarf / groß / neues Geschäftsmodell wäre nötig |

Die gewählten Verbesserungen sind grundlegende Produktqualität. Keine exklusive Wettbewerbslücke ist durch diese Recherche belegt. Potenzial: mehrere Aufgaben bei Umzug oder Herrichtung persönlich abstimmen. Ein messbarer Vorteil setzt verlässliche betriebliche Umsetzung und Nutzertests voraus. Keine Behauptung höherer Conversion oder besserer Suchplatzierung.

## Gestaltungsregeln

Warme Papierflächen, dunkles Waldgrün für Struktur, Terrakotta für Handlungen. Farbrollen und Rundungen stehen zentral in src/styles/global.css; keine externen Webfonts. System-Grotesk für Lesetext, sparsame Georgia-Kursivakzente für menschliche Überschriften. Große Abstände schaffen Hierarchie; Bilder erläutern Leistungen. Beispielbilder bleiben sichtbar als solche gekennzeichnet und sind keine eigenen Referenzen. Bildrechte ausschließlich aus IMAGE-SOURCES.md.

Eine dominante Handlung je Abschnitt. Startseite beantwortet Aufgabe, Region und nächsten Schritt in der ersten Ansicht. Drei unterschiedlich begründete Leistungsgruppen statt endloser gleichförmiger Karten. Alle vorhandenen Leistungs-URLs bleiben erreichbar, Details können aufgeklappt werden. Kurze konkrete deutsche Sätze, keine Leistungsversprechen ohne Beleg. Bewegung nur zur Orientierung und mit reduced-motion-Rücksicht. Fokus ist sichtbar, Bedienung darf nicht nur von Farbe oder Hover abhängen.

## Anfragevertrag

Montage und offene Beratung: vier Schritte; Ausbau und Oberflächen: fünf; Räumung: sechs. Füllgrad, Anlass und Räumungsumfang sind für Bau/Montage deaktiviert und werden nicht übertragen. Zugang bleibt relevant. Wand-/Deckenfläche ist bei Maler/Tapezieren ausdrücklich von Wohnfläche getrennt. Unbekannte Maße dürfen noch zu klären sein. Textentwurf bleibt lokal erhalten; Entwürfe älter als sieben Tage werden beim nächsten Formularaufruf verworfen (bestehende Ablaufregel); Fotos müssen nach Neuladen neu ausgewählt werden. E-Mail wird Pflicht, wenn E-Mail als Antwortweg gewählt wird. Kein Registrierungszwang.

PHP prüft weiterhin unabhängig vom Browser. Anfrage muss vor dem Mailversand gespeichert sein; fehlende Ablage führt zum Fehlerweg. Versandfehler lassen die gespeicherte Anfrage bestehen. Statusaktualisierung erfolgt über eine temporäre Datei mit Umbenennung, damit ein fehlgeschlagener Statusschreibvorgang die ursprüngliche Anfrage erhält. Referenz und serverseitig angenommene Fotozahl werden zurückgegeben; fehlende Fotos werden benannt. Kein PII in der Weiterleitungs-URL.

Die statische Empfangsseite ist ohne Referenz neutral. Eine Referenz ist kein authentifizierter Statusabruf und kein Zugang zu Kundendaten. Die Zusammenfassung stammt aus dem eigenen Browser. Es gibt keinen Projektstatus, Zahlungs- oder Buchungsstatus. Ohne JavaScript ist das vollständige Formular erreichbar; die verkürzte adaptive Führung und lokale Wiederaufnahme benötigen JavaScript.

## Qualitätsprüfung und vier Hüte

- Staff: vorhandene Astro-/PHP-Struktur und URLs erhalten, Profile zentral statt neue Endpunkte. Fehler an der Speicherstelle behandelt.
- Architektur: Anfrage, Benachrichtigung und Terminbestätigung bleiben unterschiedliche Zustände. Kein unechtes Kundenkonto oder Marktplatz.
- Daten: keine neue Datenbank, keine Migration, keine neuen Kontaktfelder. Request-Ablage vor Nachricht; Mailstatus separat aktualisiert. Keine öffentlichen Statusabfragen.
- QA: vier Formularzweige, Rücknavigation, Pflicht-/Fehlerfälle, Entwurf, Empfangsseite, kleine/große Ansichten und lokaler PHP-/SMTP-Ablauf prüfen.
- Sicherheit / Datenschutz: gleiche Empfänger und Speicherfristen, keine echten Testanfragen, Dateien nach Inhalt geprüft, Zusammenfassung per textContent, Slug-Auswahl per Allowlist, keine Zugangsdaten im Frontend. Kontakt-E-Mail ist bei gewünschter E-Mail-Antwort erforderlich; Datenschutzhinweis angepasst. Handwerksrechtliche Leistungsgrenzen bleiben bestehen. Kein neuer öffentlicher API-Endpunkt.

Vor Übergabe: Pflicht-Gate aus CLAUDE.md, Ereignisprüfung, PHP-Syntax, Mail- und Anfrage-Selbsttest. Browseransichten bei 320/375/768/1280/1440/1920 px, Tastatur und Fehlerzustände prüfen; Screenshots vor/nachher. Die automatische Token-Kontrastprüfung ersetzt keinen vollständigen WCAG-Audit. Elf verbleibende Linkgraph-Hinweise werden unter SEO-2026-04 redaktionell bearbeitet, ohne Prüfgrenzen abzusenken.

Prüfergebnis und Screenshot-Inventar: docs/PRODUKT-QA-2026-10-21.md.

## Messung und offene Abhängigkeiten

Vorschlag: zunächst zwei Wochen belastbare Ausgangsdaten, dann vier Wochen Entwurf vergleichen. Ziele sind Hypothesen: relative Anfrageabschlussquote +15 %, Abbruch vor Kontakt -15 %, Rückfragen zu fehlendem Umfang -20 %. Erst reale Stichprobe und saisonale/Traffic-Unterschiede prüfen; keine erreichte Steigerung behaupten. Bestehende estimate-/lead-Ereignisse verwenden; keine personenbezogenen Freitexte in Analysen. Fehlgeschlagene Übertragung darf nicht als eingegangene Anfrage zählen.

Betreiberfreigabe liegt vor. Die erste reguläre Live-Testanfrage wurde mit nicht-konfiguriert abgewiesen. E-014 ergänzt deployfeste öffentliche Kontaktwerte, ohne private SMTP-Einstellungen zu überschreiben. Nach Reparatur: Browser-Test SH-261021-DAF10 gespeichert und Mailübergabe vom Server angenommen. Tatsächlichen Posteingang noch bestätigen (OPS-2026-02); bei ausbleibender Zustellung SMTP-Konfiguration über privaten Serverzugang prüfen. Echtes SMTP-Postfach und Zustellbarkeit können lokale Tests nicht beweisen. Für weitere Vorteile fehlen belastbare Preise/Kapazitäten, echte Einsatzfotos und reale GSC/Bing-/Conversiondaten; diese Punkte stehen im Tracker. Kein Kontozugang wird in Dokumentation abgelegt.

## Quellen

- M1: https://www.my-hammer.de/
- M2: https://www.my-hammer.de/auftraggeber-info/so-funktionierts
- M3: https://www.my-hammer.de/allgemeine-geschaefts-bedingungen
- T1: https://www.taskrabbit.de/
- T2: https://www.taskrabbit.de/book/4751/details (erste Aufgabenbeschreibung zugänglich; Folgeablauf nicht vollständig geprüft)
- T3: https://support.taskrabbit.com/hc/de/articles/46260411872155-Was-ist-die-Taskrabbit-Servicegeb%C3%BChr
- T4: https://support.taskrabbit.com/hc/de/articles/46260504648731-Was-ist-die-Vertrauens-und-Hilfsgeb%C3%BChr-von-Taskrabbit
- U1: https://www.reddit.com/r/Handwerker/comments/1i0f7b7/myhammer_ist_nicht_zu_empfehlen_hohe_kosten_kaum/
- U2: https://www.reddit.com/r/Handwerker/comments/199vn9l/was_sind_eure_erfahrungen_mit_myhammer/
- Explorativ, nicht als Beleg wiederholter Probleme gewertet: https://de.trustpilot.com/review/taskrabbit.de

## Ergänzung E-015 · 22.10.2026

Die lokale SEO-Stufe integriert Rechner und Angebotsvergleich in die bestehende warme Gestaltung. Kein Preisrechner ohne Preisdaten, kein Registrierungszwang, keine automatische Übernahme ohne Bestätigung. Nutzer erhalten Ergebnis und Formel vor der Anfrage. Vorhandene Texte und Kontaktwege bleiben erhalten. Strategie und Quellen: SEO-AUSBAU-2026-10-22.md. Erfolg wird erst mit echten Such-/Empfangs-/Auftragsdaten bewertet; Veröffentlichung benötigt neue konkrete Freigabe.
