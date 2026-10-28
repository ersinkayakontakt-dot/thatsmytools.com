# Wachstumsplan: mehr Anfragen über alle Leistungen, sichtbar auf allen Kanälen

Stand 28.10.2026 · ergänzt `docs/ENTITY-UND-RANKING.md` (Profil- und
Nennungsstufen, Juli 2026) und `docs/NACHFRAGE-SYSTEM.md` (Messung)

**Umsetzungsstand 28.10.2026 (GROW-2026-03):** Kanalmessung im Code;
Arbeitsunterlagen liegen bereit – `docs/EINTRAGS-KIT.md` (Profiltext,
Leistungen, Links mit Kennung), `docs/VERZEICHNIS-CHECKLISTE.md`,
`docs/GOOGLE-ADS-ENTWURF.md`, `docs/VORLAGEN-ANSPRACHE.md`. Alles Weitere
in § 3 braucht den Betreiber (Konten, Versand, Budget).

---

## 1. Kernbefund

**Die Website ist nicht mehr der Engpass.** 62 indexierbare Seiten, 18
Leistungen, 12 Bezirke, 15 Ratgeber und Kostenseiten, jede mit Inhaltsbild,
0 Fehler/0 Warnungen in allen SEO-Prüfungen, Ladezeit unter einer Sekunde.

**Der Engpass liegt außerhalb der Website:**

| Befund | Beleg |
|---|---|
| Die Marke ist im offenen Netz praktisch unsichtbar | Eine Websuche nach „schnellhelfer24 Berlin“ findet die Firma nicht (28.10.2026) |
| Bing Places und Apple Business Connect fehlen | `site.profiles` enthält dort nur Platzhalter. Stufe 1 aus ENTITY-UND-RANKING.md (Juli) ist nicht abgeschlossen |
| Mitbewerber stehen mit Bewertungen in vielen Verzeichnissen | golocal, werkenntdenbesten, kennstdueinen, Sellwerk/Gelbe Seiten, Cylex (Suche 28.10.2026) |
| Ein Verzeichnis nennt eine falsche Hausnummer | Cylex: Lindenstraße 14 statt 16 (LOCAL-2026-01, offen) |
| Anfragen landen im Spam | MAIL-2026-01, offen |
| Keine Messdaten | Kein Search-Console- oder Bing-Export, Ereignismessung aus, Nachfrageregister noch nicht eingerichtet |
| Vorhanden und stark: 27 Google-Bewertungen mit 5,0 | `site.ratings`, zuletzt abgeglichen laut site.ts |

Für lokale Dienstleister gewichten Branchenbefragungen das
Google-Unternehmensprofil (~32 %) und Bewertungen (~20 %) deutlich vor den
Signalen der eigenen Website (~15 %) (Whitespark 2026, zitiert nach
ranktracker/blckalpaca, Expertenbefragung, keine Google-Formel). Google
selbst nennt Relevanz, Entfernung und Bekanntheit. **Bekanntheit entsteht
außerhalb der eigenen Seite** – genau dort fehlt fast alles.

---

## 2. Welche Leistungen die Anfragen tragen sollen

Ohne Umsatzdaten ist das eine begründete Annahme. Das Nachfrageregister
(GROW-2026-01) prüft sie ab der ersten Anfrage.

| Stufe | Leistungen | Warum | Rolle in der Akquise |
|---|---|---|---|
| **A – Komplettaufträge** | Wohnungsauflösung, Haushaltsauflösung, Nachlass, Entrümpelung, Seniorenumzug, Messiwohnung | Hoher Auftragswert, eigene Ausführung, kein Handwerksrechtsrisiko, Anlass mit Termindruck (Übergabe, Erbfall, Heimeinzug) | **Hauptkategorie und Hauptbudget.** Alle Kanäle zeigen zuerst darauf |
| **B – wiederkehrend** | Hausverwaltungen/Immobilienpartner, Keller-Sammelräumungen, Büroauflösung | Mehrere Aufträge je Kontakt, planbar | Direktansprache, kein Werbebudget nötig |
| **C – Aufwerter** | Rückbau, Boden verlegen, Küchen- und Möbelmontage, Sperrmüll | Erhöhen den Auftragswert je Kontakt (Übergabe-Angebot) | Zusatzleistungen im Profil und in der Anfrage, nicht als eigene Werbekampagne |
| **D – vorsichtig** | Malerarbeiten, Tapezieren, Trockenbau, Innenausbau | Anlage-A-Gewerke laufen über Fachbetriebe (E-011, HANDWERKSRECHT.md) | Sichtbar auf der Website, aber **keine Profilkategorie „Maler“ und keine bezahlte Werbung**, solange es keine Eintragung gibt |

---

## 3. Kanäle – wo „überall“ konkret ist

### 3.1 Google-Unternehmensprofil (größter Einzelhebel)

| Maßnahme | Wer | Aufwand |
|---|---|---|
| Hauptkategorie auf das Kerngeschäft (Entrümpelung/Wohnungsauflösung – die genaue Bezeichnung in der Oberfläche wählen), Zusatzkategorien nur für Leistungen, die selbst erbracht werden (z. B. Umzug) | Betreiber | 10 Min |
| Leistungen im Profil anlegen: alle Leistungen der Stufen A–C mit dem Kurztext aus `docs/EINTRAGS-KIT.md` | Betreiber, Texte liegen vor | 30 Min |
| Servicegebiet statt Ladenadresse, solange Kunden die Lindenstraße nicht aufsuchen (`hasVisitableAddress: false`) | Betreiber | 5 Min |
| Website-Link mit Kennung `?utm_source=google&utm_medium=profile&utm_campaign=gbp` – Anfragen erscheinen im Nachfrageregister als Kanal `profile` (fertige Links: `docs/EINTRAGS-KIT.md`) | Betreiber | 2 Min |
| Wöchentlich 2–3 echte Fotos von Einsätzen (ohne Personen, Adressen, Dokumente) | Betreiber | 5 Min/Woche |
| Jede Bewertung beantworten | Betreiber | laufend |
| Nach **jedem** abgeschlossenen Auftrag um eine Bewertung bitten – gleicher Text an alle, ohne Filter oder Prämie (`/bewerten/` existiert) | Betreiber | 1 Min/Auftrag |

Ziel: Laut Branchenbefragung zählt die **Aktualität** der Bewertungen
stark. Vier neue Bewertungen pro Monat sind wertvoller als 27 alte.

### 3.2 Bing Places und Apple Business Connect (fehlen)

- **Bing Places**: Import aus dem Google-Profil, etwa 10 Minuten. Bing ist
  die Websuche hinter Copilot und eine Quelle für ChatGPTs Websuche;
  der direkte Einfluss auf KI-Antworten ist nicht unabhängig belegt, die
  Kosten sind aber minimal.
- **Apple Business Connect**: Siri und Apple Karten, etwa 20 Minuten.
- Danach die Profil-URLs in `src/config/site.ts` → `profiles` eintragen
  (speist `sameAs` im Schema). **Das übernehme ich**, sobald die URLs da sind.

### 3.3 Verzeichnisse mit Bewertungen (dort stehen die Mitbewerber)

Reihenfolge nach Sichtbarkeit in der Suche: Gelbe Seiten/Sellwerk, Das
Örtliche, 11880, golocal, werkenntdenbesten, kennstdueinen, Cylex
(Hausnummer korrigieren), Yelp. **Immer exakt dieselben Angaben aus
`docs/EINTRAGS-KIT.md`** – abweichende Schreibweisen schwächen das Signal.
Kostenpflichtige Pakete nicht nötig, der kostenlose Eintrag reicht.

### 3.4 Anfrageportale (Test mit Budgetdeckel)

MyHammer listet für Berlin bereits Hunderte Entrümpelungsanbieter; Check24
Profis und blauarbeit sind ähnlich aufgebaut. Gebühren und Lead-Qualität
für Anbieter konnte ich nicht prüfen.

**Vorgehen:** Ein Portal, 8 Wochen, fester Monatsdeckel. Jede Portalanfrage
im Nachfrageregister mit Kanal erfassen. **Weiterführen nur, wenn die Kosten
je gewonnenem Auftrag unter dem Deckungsbeitrag eines kleinen Auftrags
liegen.** Portale nicht als Dauerlösung: Dort entscheidet der Preis.

### 3.5 Google Ads (gezielt, klein)

- Lokale Dienstleistungsanzeigen (Local Services Ads) sind laut
  Drittquellen in Deutschland verfügbar; **ob Entrümpelung oder Umzug als
  Kategorie buchbar ist, ist unbelegt** – im Google-Ads-Konto prüfen.
- Sonst Suchanzeigen nur auf Stufe-A-Begriffe mit Kaufabsicht
  („wohnungsauflösung berlin“, „haushaltsauflösung berlin“, „nachlass
  wohnung räumen berlin“), mit Anruferweiterung, auf die passende
  Leistungsseite. Ausschließen: „kostenlos“, „selber“, „bsr“, „job“.
- Start erst **nach** MAIL-2026-01: Bezahlte Klicks auf eine Anfrage, die im
  Spam landet, sind verbranntes Geld.

### 3.6 Direkte Partnerschaften (Stufe B, oft der schnellste Umsatz)

Zielgruppen mit wiederkehrendem Bedarf: Hausverwaltungen,
Nachlasspfleger und rechtliche Betreuer, Pflegeheime und Sozialdienste der
Krankenhäuser, Bestatter, Makler. Angebot: der Übergabe-Einstieg mit festem
Ansprechpartner (`/hausverwaltungen-immobilienpartner/`). Persönliche
Ansprache durch den Betreiber; Textentwürfe kann ich liefern, **versendet
wird nichts ohne deine Freigabe**.

### 3.7 KI-Suche (ChatGPT, Copilot, Gemini, Perplexity)

Technisch erledigt: Suchbots zugelassen, `llms.txt`, gleichlautende
Unternehmensdaten und Schema auf allen Seiten. Was KI-Antworten darüber
hinaus beeinflusst, ist dasselbe wie oben: Profile (Bing!), Bewertungen,
Nennungen in Verzeichnissen und lokalen Medien. Keine Sondermaßnahmen,
keine „KI-Tricks“.

---

## 4. Konversion – damit aus Sichtbarkeit Anfragen werden

| Hebel | Status | Wer |
|---|---|---|
| Mail aus dem Spamordner (SMTP mit Postfach-Anmeldung) | **offen, wichtigster Einzelpunkt** | Betreiber (Zugangsdaten in sh24-config.php) |
| Telefon erreichbar, Rückruf am selben Tag | betrieblich | Betreiber |
| WhatsApp-Fotos als schnellster Weg | live | – |
| Übergabe zum festen Termin | live (GROW-2026-02) | – |
| Ergebnis je Anfrage erfassen | gebaut, Zugang fehlt | Betreiber (php scripts/betrieb-passwort.php) |
| Öffnungszeiten angeben | offen (A3), Kontaktseite zeigt Hinweis | Betreiber |

---

## 5. 30 / 60 / 90 Tage

| Zeitraum | Betreiber | Ich (Code/Texte) | Woran Erfolg erkennbar ist |
|---|---|---|---|
| **Woche 1** | Mail-SMTP einrichten · Betriebszugang · Google-Profil: Kategorie, Leistungen, Servicegebiet · Bing Places · Apple Business Connect · Search Console + Bing Webmaster bestätigen | Profil-URLs eintragen (`sameAs`) · Leistungsliste fürs Profil aus dem Eintrags-Kit aktualisieren · Google-Ads-Entwurf (Begriffe, Ausschlüsse, Anzeigentexte ohne erfundene Versprechen) | Testanfrage landet im Posteingang · Profile live · Search Console zeigt erste Daten |
| **Woche 2–4** | 6–8 Verzeichnisse mit Eintrags-Kit · Cylex korrigieren · Bewertungsbitte nach jedem Auftrag · erste 5 Partner persönlich ansprechen | Partner-Anschreiben (Entwürfe) · Auswertung Search-Console-Export, sobald vorhanden | ≥ 4 neue Google-Bewertungen · Marke in einer Websuche auffindbar · erste Partnerrückmeldung |
| **Monat 2** | Ein Portal 8 Wochen mit Deckel testen **oder** Google Ads mit kleinem Budget (nicht beides gleichzeitig, sonst keine klare Zuordnung) | Seiten mit Impressionen, aber wenig Klicks gezielt verbessern (Titel, Antwort) · Register-Auswertung | Anfragen je Kanal im Register · Kosten je Auftrag |
| **Monat 3** | Entscheidung je Kanal: ausbauen, ändern, einstellen | Nachfrageverzeichnis: erste Entscheidungen (E-Nummern) · Umlandorte freischalten, wenn das Einsatzgebiet bestätigt ist | Anfragen/Monat gegenüber Monat 1 · Anteil Komplettaufträge · Kosten je Auftrag je Kanal |

**Kennzahlen, wöchentlich 10 Minuten:** Anfragen (Register), davon
Komplettaufträge, gewonnene Aufträge, neue Bewertungen, Anrufe und
Website-Klicks aus dem Google-Profil (Profilstatistik), Klicks aus der
Search Console. Keine Zielzahl vor der ersten Messbasis – nach 4 Wochen
festlegen.

---

## 6. Was ausdrücklich nicht getan wird

- Keine gekauften Bewertungen, kein Bewertungsfilter, keine Prämien.
- Keine Keyword-Zusätze im Firmennamen des Profils (Google-Richtlinie,
  Sperrrisiko).
- Keine Ortstausch-Seiten je Bezirk × Leistung (Doorway, E-Entscheidungen).
- Keine Maler-Kategorie oder Malerwerbung ohne Eintragung.
- Keine Werbung, bevor Anfragen zuverlässig ankommen.

---

## Quellen (abgerufen 28.10.2026)

- Lokale Rankingfaktoren 2026 (Whitespark-Befragung, Sekundärquellen):
  https://www.ranktracker.com/de/blog/local-seo-ranking-factors-2026/ ·
  https://blckalpaca.at/de/wissen/seo-geo/lokales-seo/lokale-ranking-faktoren-2026-der-vollstaendige-ueberblick
- Wettbewerb in Verzeichnissen: https://www.golocal.de/berlin/entruempelungen/entruempelung-berlin-jade-11XhOx/ ·
  https://sellwerk.de/firmenprofil/raeumungsmeister-berlin ·
  https://www.werkenntdenbesten.de/e/100118672/haushaltsaufloesung/berlin/prompt-wohnungsaufloesungen-entruempelungen-bewertungen.html ·
  https://www.kennstdueinen.de/entruempelung-berlin-starke-power-entruempelung-d2343090.html ·
  https://web2.cylex.de/suche/entr%C3%BCmplung/Berlin
- Portal: https://www.my-hammer.de/abriss-entsorgung/entruempelungsunternehmen-berufe/berlin
- Lokale Dienstleistungsanzeigen, Länderverfügbarkeit (Sekundärquelle):
  https://www.ranktracker.com/blog/are-google-local-service-ads-available-in-your-area-find-out-here
- ChatGPT-Websuche: https://help.openai.com/de-de/articles/9237897-searching-the-web-with-chatgpt ·
  Bing-Bezug (Sekundärquelle, umstritten): https://www.nearmedia.co/bing-places-aio-love-no-google-killer-wheres-the-decision/
- Begriffswahl „Wohnungsauflösung“ statt „Entrümpelung“ im Trauerfall:
  https://www.tagesspiegel.de/wirtschaft/immobilien/verschenken-verkaufen-oder-professionell-entsorgen-was-sie-bei-einer-wohnungsauflosung-beachten-mussen-10675993.html

Nicht prüfbar, weil aus der Umgebung gesperrt: Googles eigene Hilfeseite
zum lokalen Ranking, die Kategorienliste der lokalen Dienstleistungsanzeigen
für Deutschland, Gebühren der Anfrageportale.
