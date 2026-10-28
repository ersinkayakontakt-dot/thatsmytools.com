# Wachstumsphase · Nachfrageregister und Übergabe zum festen Termin

Stand 22.10.2026 · Tracker GROW-2026-01 und GROW-2026-02 · Entscheidung E-016

Dieses Dokument ist die gemeinsame Quelle für Betrieb, Auswertung und die
nächste Entscheidung. Es gilt zusätzlich zu `docs/SEO-AUSBAU-2026-10-22.md`
(Messung von Versuch, Empfang, Lead und Auftrag) und `docs/HANDWERKSRECHT.md`.

---

## 1. Bestandsprüfung (kurz)

| Bereich | Tatsächlicher Stand | Folge für diese Phase |
|---|---|---|
| Technische SEO, Struktur, Leistungs- und Ortsseiten, Ratgeber | 82 Seiten, 62 indexierbar, 0 Fehler/0 Warnungen, live (af6200a / 844ba7b) | Kein weiterer Audit. Nicht der Engpass. |
| Werkzeuge | Wandflächenrechner mit Planübernahme ins Formular (live) | Vorhanden, Nutzung unbekannt (Messung aus). |
| Anfrageformular | Adaptiv je Leistung; Umfang, Anlass, Zusatzleistungen, Termin, flexibler Zeitraum, Fotos, Freitext, Herkunft | Strukturierte Nachfrage wird **erfasst, aber nie gezählt**. |
| Ablage | Jede Anfrage als JSON auf dem Server (Kontaktdaten + Freitext) | Nicht auswertbar ohne Personendaten zu lesen; aus der Cloud nicht erreichbar. |
| Ergebnis einer Anfrage | Nirgends erfasst (Auftrag ja/nein, Absagegrund, Wert) | Kein Wissen über nicht bediente Nachfrage, Rückfragen, Auftragsquote. |
| Ereignismessung | `events.php` gebaut, `eventsEnabled = false` bis zur Rechtsprüfung | Formularabbrüche unbekannt. |
| Interne Suche | Keine vorhanden | Erfolglose Suchen existieren als Datenquelle nicht. |
| Such-/Logdaten | Kein GSC-, Bing- oder Server-Logexport | Suchnachfrage unbekannt (SEO-2026-04). |
| Termine/Kapazität | Keine Terminquelle, kein Kalender, keine Einsatzdaten | Keine Verfügbarkeitsanzeige möglich. |
| Kundenkonten, Projektakten | Nicht vorhanden; statisches Hosting mit PHP, keine Datenbank | Jede personenbezogene Akte wäre ein neues System. |
| Geschäftsmodell | Einzelunternehmen, direkter Dienstleister, Fachbetriebe für Anlage-A-Arbeiten | Wachstum = mehr passende, vollständig beschriebene Aufträge je Kontakt. |

**Kernbefund:** Die Plattform hat genau eine echte Datenquelle – die Anfragen.
Sie wird erfasst, aber weder gezählt noch mit dem Ergebnis verbunden. Jede
Wachstumsentscheidung (neues Angebot, Partner, Kapazität, Seite verbessern)
wird deshalb heute ohne Evidenz getroffen. Interne Suchen, Abbrüche,
Termin- und Projektdaten existieren nicht und werden hier **nicht** erfunden.

---

## 2. Drei Vorschläge und Bewertung

| Kriterium | A Nachfrageregister mit Ergebniserfassung | B Übergabe zum festen Termin | C Partner-Einbettung „Objekt melden" für Hausverwaltungen |
|---|---|---|---|
| Nachweisbares Kundenproblem | Betreiber: keine Antwort auf „was fragen Leute an, was lehnen wir ab, warum" | Feste Übergabetermine sind auf Leistungs-, Partner- und Ratgeberseiten der wiederkehrende Anlass; Anforderungen werden heute erst telefonisch erfragt | Plausibel (Verwaltungen melden Einheiten), aber kein bestehender Partner bekannt |
| Erwarteter Beitrag | Indirekt, aber Voraussetzung für jede weitere Entscheidung; verhindert Seiten/Angebote ohne Bedarf | Größere Aufträge je Kontakt (Räumung + Rückbau + Boden), weniger Klärungsschleifen, verlässlichere Planung | Neue Anfragequelle, nur wenn ein echter Partner einbindet |
| Daten/Kapazität | Sofort nutzbar; 20 Sekunden Betreiberzeit je Anfrage | Sofort nutzbar; nutzt vorhandene Leistungen und Fachbetriebsweg | Braucht Partnerfreigabe und Ansprache (nicht freigegeben) |
| Entwicklung / Betrieb | mittel / klein | klein / klein | mittel / mittel (Pflege, Support beim Partner) |
| Zeit bis Ergebnis | Mit der ersten Anfrage; Muster nach 4–8 Wochen | 10 Pilotfälle, je nach Anfragevolumen 4–12 Wochen | Unbestimmt (Partner zuerst gewinnen) |
| Verschiebungsrisiko | Keins (misst nur) | Mittel: bestehende Räumungsanfragen wechseln nur den Weg. Deshalb Vergleichsgruppe und Gesamtvolumen beobachten | Gering, aber Erfolg hängt an Dritten |
| **Entscheidung** | **Umgesetzt** | **Umgesetzt** | Zurückgestellt (Wiedervorlage § 7) |

Geprüft und bewusst nicht gebaut: Projektakte mit Freigabelink (es gibt noch
keine abgeschlossenen, freigegebenen Projekte und kein Kundenkonto; eine Akte
mit Fotos wäre ein neues personenbezogenes System ohne belegten Bedarf),
Geschäftskunden-Arbeitsbereich (kein belegter wiederkehrender Kunde),
Verfügbarkeitsanzeige (keine Terminquelle – der flexible Zeitraum existiert
bereits im Formular und wird jetzt im Register gezählt), veröffentlichte
Auswertungen (Datengrundlage fehlt; das Register ist deren Erfassung).

---

## 3. Vorhaben A · Nachfrageregister (GROW-2026-01)

### Hypothese

> Wir erwarten, dass ein personenfreies Nachfrageregister mit
> Ergebniserfassung beim Betreiber innerhalb von acht Wochen mindestens zwei
> konkrete Entscheidungen (Seite verbessern, Ablauf ändern, Angebot oder
> Kapazität) auslöst, die jeweils auf mindestens fünf dokumentierten
> Anfragen beruhen, weil heute Kombinationen, Absagegründe, Lücken und
> Unsicherheiten nur im Postfach liegen und nirgends gezählt werden.

**Wirtschaftlicher Nutzen:** Kein Euro auf Seiten oder Angebote ohne
Nachfrage; nicht bediente, aber häufige Wünsche werden als Kapazitäts- oder
Partnerfrage sichtbar, bevor sie verloren gehen; Rückfragen, die Zeit kosten,
werden je Leistung benannt.

### Umsetzung

- `public/api/anfrage.php` schreibt nach dem Speichern jeder Anfrage einen
  Eintrag in `_storage/nachfrage/register-JJJJ-MM.jsonl`. Der Eintrag wird aus
  einer Allowlist **neu aufgebaut** (`lib/nachfrage.php`, `sh24_ledger_entry`):
  Leistung, Umfang, Anlass, Objektart, Zeitraum, Vorlauf als Spanne (nicht das
  Datum), Einsatzgebiet, PLZ-Bereich (3 Ziffern), Kanal, Übergabe-Einstieg,
  Zusatzleistungen, Anzahl Nebenräume/Fotos, ob eine Fläche genannt wurde,
  Textlänge als Klasse, Anforderungen und offene Fragen. **Kein** Name,
  Telefon, E-Mail, Ort, Freitext, Datum, keine vollständige PLZ.
- **Kanal** (seit GROW-2026-03): `detectSource()` in
  `src/components/Analytics.astro` schreibt `kanal | quelle` ins verborgene
  Feld `quelle`; das Register übernimmt nur den Kanal. Werte: `organic`,
  `paid` (cpc/gclid/msclkid), `ai`, `referral`, `direct`, `profile`
  (`utm_medium=profile` – Google-, Bing-, Apple-Profil), `directory`
  (`utm_medium=directory` oder Verweis von Gelbe Seiten, Das Örtliche, 11880,
  Cylex, Yelp …), `portal` (`utm_medium=portal` oder Verweis von MyHammer,
  Check24 …), `partner` (`utm_medium=partner`). Dieselbe Liste steht in
  `ALLOWED_CHANNELS` in `public/api/events.php`. Die genaue Quelle (z. B.
  `bing`) steht nur in der Anfrage selbst, nicht im Register.
- Neue freiwillige Formularfrage „Ist vor Ihrer Entscheidung noch etwas
  offen?" (feste Liste). Doppelter Nutzen: Die erste Antwort beginnt damit,
  und das Register zählt die Unsicherheit vor der Kontaktaufnahme.
- `public/api/betrieb.php`: passwortgeschützter Betriebsbereich. Liste der
  Anfragen (nur Referenz und Signale), Ergebnis je Referenz in einer Zeile
  (Status, Absagegrund, Wertklasse, nötige Rückfragen, Stichwort zur Lücke),
  Nachfrageverzeichnis, CSV ohne Referenzen.
- Nach 180 Tagen wird die Referenz entfernt und das Ergebnis in den Eintrag
  übernommen (`sh24_compact`). Danach ist das Register anonym.

### Das Nachfrageverzeichnis

Je Erkenntnis: Art, Thema, Häufigkeit, Evidenz, möglicher Auftragswert
(häufigste Wertklasse unter gewonnenen Aufträgen), Bedienbarkeit, nächster
Schritt. Regeln (vorschlagend, der Betreiber entscheidet):

| Art | Quelle | Nächster Schritt |
|---|---|---|
| Versorgungslücke | Absage „Leistung nicht im Angebot/Fachbetrieb fehlt" mit Stichwort; Anforderung „Reparaturen" | ab 3 Fällen: Kapazität oder Partner prüfen. **Keine öffentliche Angebotsseite, solange niemand ausführt.** |
| Fachbetrieb nötig | Anforderungen Streichen/Tapeten | ab 3 Fällen: festen Fachbetrieb für Übergaben vereinbaren (Ablauf) |
| Unsicherheit vor Kontakt | offene Fragen | ab 5 Fällen und 25 % Anteil: bestehende Seite verbessern, wo die Anfrage startet |
| Kombination | Leistung + Zusatzleistung | ab 5 Fällen: als gebündelten Termin anbieten und messen |
| Nicht bedient | Absagegründe Kapazität, Gebiet, zu klein | ab 3 Fällen: Kapazität gewinnen, Gebiet ehrlich ausweisen, kleine Aufgaben zu flexiblen Sammelterminen bündeln |
| Rückfrage nötig | Rückfragen je Leistung | ab 3 Fällen: Angabe im Anfrageweg dieser Leistung erfragen |

Evidenzstufen: unter 5 „Einzelfälle – nur Hinweis", 5–19 „Pilotbasis", ab 20
„wiederholt beobachtet (keine Statistik)". Es wird keine Signifikanz behauptet.

### Erfolgskriterien und Entscheidung

| Messgröße | Ziel | Quelle |
|---|---|---|
| Ergebnisquote: Anfragen mit erfasstem Ergebnis binnen 14 Tagen | ≥ 80 % | Betriebsbereich (Warnhinweis unter 80 %) |
| Entscheidungen auf Basis ≥ 5 Anfragen | ≥ 2 in 8 Wochen | Entscheidungsprotokoll (E-Nummer mit Verweis aufs Verzeichnis) |
| Personendaten im Register | 0 | `audit:demand:selftest`, Stichprobe auf dem Server |

- **Ausbauen**, wenn nach 8 Wochen ≥ 80 % erfasst und ≥ 2 Entscheidungen
  gefallen sind: Ereignismessung (Abbrüche) nach Rechtsprüfung anschließen,
  Verzeichnis monatlich als Grundlage für Vorhaben C/D nutzen.
- **Verändern**, wenn die Erfassungsquote unter 50 % liegt: Ergebnis auf
  Status + Grund reduzieren, Wertklasse und Rückfragen optional.
- **Einstellen**, wenn nach 12 Wochen keine Entscheidung daraus folgte und der
  Betreiber die Erfassung als Last empfindet. Die Registerdateien werden dann
  gelöscht, der Formularteil „offen" bleibt als Gesprächshilfe.

---

## 4. Vorhaben B · Übergabe zum festen Termin (GROW-2026-02)

### Angebot

„Wohnung zum festen Termin übergeben": Termin und Anforderungen aus Vertrag
oder Protokoll kommen mit der ersten Anfrage; es wird rückwärts vom Termin
geplant; eine Ansprechperson für Räumung, Rückbau, Wände und Boden.

| Übernehmen wir selbst | Mit Fachbetrieb abgestimmt | Bieten wir nicht an |
|---|---|---|
| Räumung inkl. Nebenräume, Rückbau von Einbauten/Küche/Boden, Dübellöcher, neuer Bodenbelag, Endreinigung, besenreine Übergabe, Schlüsselübergabe | Streichen, Tapezieren (Anlage A, E-011) | Reparaturen an Fenstern, Türen, Sanitär, Elektrik |

Keine eigene URL (E-015). Baustein `HandoverOffer.astro` auf Wohnungs-,
Nachlass- und Haushaltsauflösung sowie der Partnerseite. Er führt zu
`/angebot-anfragen/?leistung=…&vorhaben=uebergabe`. Im Formular gibt es den
Schalter zusätzlich bei jeder Räumungsleistung (Schritt 4), damit das Angebot
nicht nur über die Bausteine erreichbar ist. Bei aktivem Schalter ist der
Übergabetermin Pflicht, und die Anforderungsliste erscheint. Mail und Betreff
nennen „Übergabe" und gruppieren nach Zuständigkeit. Die Bestätigungsseite
zeigt den Ablauf in der üblichen Reihenfolge, ohne Termin- oder Preiszusage,
und nennt ausdrücklich, was wir nicht übernehmen.

Operativer Nutzen: weniger Klärung (Termin, Zielzustand und Zuständigkeiten
kommen mit der Anfrage), vollständigere Planung (Reihenfolge Wände vor Boden,
Puffer), ein Ansprechpartner, Fachbetriebsbedarf ist vor dem Erstgespräch
bekannt.

### Hypothese

> Wir erwarten, dass der Übergabe-Einstieg bei Mietern, Erben und
> Verwaltungen mit festem Übergabetermin zu vollständigeren Anfragen (Termin
> und Anforderungen angegeben), seltener nötigen Rückfragen und mehr
> Aufträgen mit Rückbau-, Boden- oder Wandarbeiten führt, weil der Zielzustand
> den Umfang bestimmt und heute erst im Telefonat erfragt wird.

**Wirtschaftlicher Nutzen:** Aufträge mit mehreren Positionen statt reiner
Räumung; weniger Telefonzeit je Anfrage; bessere Terminplanung.

### Messung

Im Verzeichnis unter „Übergabe-Einstieg im Vergleich", gegen alle übrigen
Anfragen im selben Zeitraum: Anteil vollständig (Termin + Anforderungen +
Fläche oder Fotos), Anteil mit Rückfrage, Auftragsquote, Ø Zusatz-/
Ausbaupositionen. Keine Zufallszuteilung: Unterschiede können an der Art der
Anfragen liegen. Deshalb zusätzlich: Gesamtzahl Räumungsanfragen je Woche vor
und nach Start (Verschiebungsrisiko) und Notizen zu den ersten zehn
Pilotfällen (Betreiber: Was war anders im Erstgespräch?).

### Entscheidung nach 10 Pilotfällen oder 12 Wochen

- **Ausbauen** (fester Fachbetrieb für Übergaben, Baustein auf weitere Seiten),
  wenn die Übergabe-Gruppe sichtbar seltener Rückfragen und mehr
  Mehrpositionsaufträge hat **und** der Betreiber den Ablauf als Entlastung
  bestätigt.
- **Verändern** (z. B. Anforderungsliste kürzen), wenn die Vollständigkeit
  hoch ist, Rückfragen aber nicht sinken.
- **Einstellen** (Baustein entfernen, Schalter behalten), wenn weniger als
  drei Anfragen in 12 Wochen kommen oder die Gesamtzahl der Räumungsanfragen
  nicht steigt und keine Qualitätsverbesserung sichtbar ist.

---

## 5. Methodik für spätere eigene Auswertungen (Punkt 7)

| | Festlegung |
|---|---|
| Datenquelle | Nachfrageregister + Ergebnisse, nur Allowlist-Felder |
| Zeitraum | rollierend 30/90/365 Tage; Veröffentlichung nur für abgeschlossene Quartale |
| Stichprobe | Veröffentlichung einer Aussage erst ab 30 Anfragen in der betroffenen Gruppe; jede Zelle unter 5 wird nicht ausgewiesen |
| Ausschlüsse | Testanfragen (Betreiber markiert sie als „Keine Reaktion" mit Grund „Sonstiges" und Stichwort `test`), Anfragen ohne Ergebnis bei Quoten |
| Grenzen | Nur wer absendet, wird erfasst (Abbrecher fehlen); Kanal ist grob; Wertklassen sind Selbsteinschätzungen des Betreibers |
| Anonymisierung | Keine Referenzen, keine Kombinationen, die mit PLZ-Bereich und Datum eine Person erkennbar machen; nur Summen |

Erste geeignete Auswertung, sobald 30 Fälle vorliegen: „Welche Angaben
Rückfragen vermeiden" (Rückfragen je Leistung gegen Fotos/Fläche/Termin
angegeben).

---

## 6. Betrieb – wer was wann tut

**Einmalig (Betreiber, etwa 10 Minuten):**
1. `php scripts/betrieb-passwort.php` auf dem eigenen Rechner ausführen und
   die zwei ausgegebenen Zeilen in `domains/schnellhelfer24.de/sh24-config.php`
   (oberhalb von `public_html`) eintragen.
2. Nach dem Deployment `https://schnellhelfer24.de/api/betrieb.php` öffnen und
   anmelden.
3. Eine echte Testanfrage stellen, im Betriebsbereich als „Keine Reaktion",
   Grund „Sonstiges", Lücke `test` markieren.

**Je Anfrage (≈ 20 Sekunden):** Nach dem Erstgespräch Status setzen, bei
Absage den Grund wählen, bei Rückfrage die Art anhaken, bei nicht angebotener
Leistung ein Stichwort eintragen (keine Namen oder Adressen). Bei Auftrag
oder Angebot die Wertklasse setzen.

**Wöchentlich (≈ 10 Minuten, z. B. montags):** Anfragen ohne Ergebnis
nachtragen. Das Verzeichnis ansehen.

**Monatlich (≈ 20 Minuten):** CSV ziehen, die Zeilen mit „Kapazität gewinnen",
„Ablauf verändern" oder „Seite verbessern" entscheiden und als E-Nummer in
`docs/ENTSCHEIDUNGEN.md` festhalten.

Ohne diese Routine erzeugt die Funktion nur Dateien. Der Warnhinweis unter
80 % Erfassung macht das sichtbar.

---

## 7. Zurückgestellt, mit Eintrittsbedingung

| Vorhaben | Startet, wenn |
|---|---|
| C Partner-Einbettung für Hausverwaltungen | ein bestehender Verwaltungskunde dem Einbinden zustimmt; Grundlage: dieselbe Übergabe-Anfrage, verlinkt mit `utm_medium=partner&utm_source=<kürzel>` (Register: Kanal `partner`, Kürzel in der Anfrage) |
| Projektakte mit Freigabelink | ≥ 5 abgeschlossene Aufträge mit Fotofreigabe und ≥ 2 Kunden, die ausdrücklich nach Unterlagen für Vermieter fragten (Register: offene Frage „vermieter") |
| Arbeitsbereich für Geschäftskunden | ≥ 3 Verwaltungen mit ≥ 2 Anfragen je Quartal im Register |
| Flexible Sammeltermine | Absagegrund „zu klein" ≥ 3 im Quartal **und** eine reale Terminquelle |
| Veröffentlichte Erkenntnisse | ≥ 30 Fälle je Aussage nach § 5 |

---

## 8. Prüfnachweise (22.10.2026)

- `npm run audit:demand:selftest`: Listenabgleich TS/PHP, 53 Einheitsfälle,
  Integration mit lokalem PHP-Server: Übergabe-Anfrage, verworfene unbekannte
  Schlüssel, Register ohne Kontaktdaten, Anmeldung, falsches Passwort, Sperre
  nach fünf Versuchen, manipuliertes Cookie, fehlendes CSRF, Ergebnis,
  Verzeichnis, CSV ohne Referenzen, „nicht eingerichtet" → 503.
  Gegenprobe: absichtlich eingebautes Ortsfeld und abgeschaltete CSRF-Prüfung
  werden erkannt.
- Browser gegen den echten Build mit PHP-Server, 375 und 1280 px, dreimal
  stabil 33/33: Baustein, Vorauswahl, Pflicht-Übergabetermin,
  Zusammenfassung, Absenden, Ablauf auf der Bestätigungsseite, Gegenprobe
  Montage ohne Schalter, kein Überlauf, keine JavaScript-Fehler, Register
  ohne Kontaktdaten.
- Nebenbefund behoben: Auf der Bestätigungsseite fiel der Text von „Wie es
  weitergeht" in die 44 px schmale Ziffernspalte (ein Wort je Zeile; Abschnitt
  3.694 px hoch, jetzt 853 px). Betraf auch die unveröffentlichten
  Einsatzberichte.
- Gate: 82 Seiten / 62 indexierbar, 0 Fehler, 0 Warnungen; alle Selbsttests
  der Projektliste grün.

## 9. Offene Abhängigkeiten

1. Betreiberfreigabe für Veröffentlichung und Datenschutztext (neuer Abschnitt
   „Auswertung ohne Kontaktdaten", Art. 6 Abs. 1 lit. f) – anwaltlich prüfen
   lassen wie die übrigen Texte (CONTENT-TODO A5).
2. Einrichtung des Betriebszugangs (§ 6) – ohne ihn sammelt das Register, aber
   niemand erfasst Ergebnisse.
3. Fachbetrieb für Übergaben benennen, bevor Streich-/Tapezieranforderungen
   häufiger werden (Register zeigt es).
4. MAIL-2026-01 (Spamordner) bleibt der größte Hebel für jede Anfrage.
