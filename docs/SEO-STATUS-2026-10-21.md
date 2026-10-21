# SEO- und KI-Suchstatus · 21.10.2026

## Umgesetzt und geprüft

- Möbelmontage: eigene vollständige Leistungsseite, Bild, Startseitenkarte, Formularauswahl, Sitemap.
- Kontextlinks aus passenden Umzugs-, Räumungs-, Montage- und Ratgeberinhalten; Linkgraph-Hinweise von 26 auf 13 gesenkt, keine Prioritätsänderung.
- Suchbegriffe der Bauseiten nach tatsächlicher Suchabsicht statt vollständigen Gesprächssätzen; keine zusätzlichen Ortstausch-Seiten.
- Sichtbares primäres Foto im WebPage-Schema. Bestehende Service-, FAQ- und Breadcrumb-Daten bleiben mit dem sichtbaren Inhalt konsistent.
- llms.txt beschreibt Ausbauleistungen und deren Grenzen korrekt. Die Datei ist eine ergänzende Übersicht, kein garantierter Rankinghebel.
- Suchbots haben Zugang zu öffentlichen Seiten; interne Pfade sind auch in spezifischen Gruppen ausgeschlossen. Apple-Suche und Apple-Training korrekt getrennt.

78 HTML-Seiten, 58 indexierbar. Build, Typecheck, Inhaltsaudit, Buildaudit und SEO erfolgreich; 16/16 absichtlich eingebaute SEO-Verletzungen erkannt. 83 semantische Crawlerprüfungen bestanden. Layout-/Bildprüfung bei 320, 375, 768, 1280, 1664 und 1920 px ohne Fehler.

## Noch offen

1. Hostinger muss den bereitgestellten Branch hostinger-live übernehmen. Die Domain lieferte am 21.10.2026 weiterhin den Stand vom 19.10.; Malerarbeiten waren noch 404. Das ist derzeit der wichtigste Sichtbarkeitsblocker.
2. Danach Live-Seiten, Fotos, robots.txt, Sitemap und IndexNow-Schlüsseldatei kontrollieren und erst dann IndexNow ausführen. Der vorbereitete Probelauf sendet nichts.
3. Reale Daten aus Google Search Console und Bing Webmaster Tools fehlen. Ohne sie sind Ranking, Sichtbarkeit und Entwicklung einzelner Suchanfragen unbekannt.
4. 13 Linkgewichtungs-Hinweise verbleiben, vor allem zwischen neuen Ausbauleistungen und Rückbau sowie zwischen Innenausbau und etablierten Räumungsangeboten. Inhalte nur dort weiter verknüpfen, wo dies Nutzerfragen beantwortet; Prüfregeln nicht absenken.
5. Bing-/Apple-Unternehmensprofile und eigene freigegebene Referenzfotos bleiben anhand echter Betreiberangaben zu vervollständigen. Keine Einträge wurden angelegt oder fremde Referenzen behauptet.

## Überprüfte Primärquellen

- [Google: KI-Funktionen und Websites](https://developers.google.com/search/docs/appearance/ai-features): grundlegende SEO-Anforderungen gelten auch für KI-Funktionen; keine spezielle KI-Datei erforderlich, keine Indexierungszusage.
- [OpenAI: Crawler](https://developers.openai.com/api/docs/bots): OAI-SearchBot ist die relevante Suchkennung; GPTBot ist eine eigenständige Trainingsentscheidung. ChatGPT-User bestimmt die Suchaufnahme nicht.
- [Perplexity: Crawler](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot für die Suche zulassen.
- [Apple: Applebot](https://support.apple.com/en-us/119829): Applebot-Extended steuert Trainingsnutzung und ist kein eigener Suchcrawler.
- [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers): betrifft Training und bestimmte Grounding-Nutzungen in Gemini Apps/Vertex AI, nicht das Ranking in Google Search.
- [IndexNow](https://www.indexnow.org/documentation): Schlüsseldatei und erreichbare URLs werden für die Meldung benötigt; Annahme einer Meldung ist kein Rankingnachweis.
