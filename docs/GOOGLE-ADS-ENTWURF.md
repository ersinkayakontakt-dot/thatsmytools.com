# Entwurf: Google-Suchanzeigen für Stufe-A-Leistungen

Stand 28.10.2026 · Entwurf, **nicht geschaltet** · gehört zu
`docs/WACHSTUMSPLAN-ANFRAGEN.md` § 3.5

> **Startbedingung:** Erst schalten, wenn MAIL-2026-01 (Anfragemails im
> Spam) behoben und mit einer echten Testanfrage bestätigt ist. Bezahlte
> Klicks auf ein Formular, dessen Mail niemand sieht, sind verlorenes Geld.

Die Längen der Anzeigentexte prüft `npm run ads:laengen`
(Überschrift ≤ 30, Beschreibung ≤ 90, Pfad ≤ 15 Zeichen; Grenzwerte laut
Google-Hilfe „Responsive Suchanzeigen“, abgerufen 28.10.2026).

---

## 1. Grundsätze

- **Nur Stufe A** (Wohnungs-, Haushalts-, Nachlassauflösung, Entrümpelung).
  Keine Anzeigen für Malerarbeiten, Tapezieren, Trockenbau, Innenausbau
  (Stufe D, docs/HANDWERKSRECHT.md) und keine für Kleinaufträge.
- **Nichts versprechen, was nicht auf der Website steht.** Keine Preise,
  kein „Festpreis“, keine Reaktionszeit („in 24 h“), kein „günstigster“,
  keine Sterne im Anzeigentext. Erlaubt ist, was die Leistungsseiten sagen:
  Einschätzung nach Fotos oder Besichtigung, feste Absprache vor Beginn,
  besenreine Übergabe, Unterlagen werden gesichert, Planung auf einen
  Übergabetermin.
- **Jede Anzeige führt auf die passende Leistungsseite**, nicht auf die
  Startseite. Jede Zielseite trägt `utm_medium=cpc`; Google hängt zusätzlich
  `gclid` an. Beides ergibt im Nachfrageregister den Kanal `paid`.
- **Kleines Budget, harte Grenze.** Tagesbudget fest, keine automatische
  Erweiterung auf Displaynetzwerk oder Suchnetzwerk-Partner.

## 2. Kampagnen-Einstellungen

| Einstellung | Wert | Warum |
|---|---|---|
| Kampagnentyp | Suche | Nur Nutzer mit konkreter Suchanfrage |
| Netzwerke | **nur Google-Suche**; Suchnetzwerk-Partner und Displaynetzwerk **aus** | Displayklicks bringen hier keine Anfragen |
| Standort | Berlin + belieferte Orte aus `docs/EINTRAGS-KIT.md` § Einsatzgebiet; Option „Präsenz: Personen an diesem Ort oder die regelmäßig dort sind“ | „Interesse an Berlin“ bringt Klicks aus ganz Deutschland |
| Sprache | Deutsch | |
| Gebotsstrategie | Anfangs „Klicks maximieren“ mit CPC-Obergrenze, nach ≥ 15 erfassten Anfragen auf „Conversions maximieren“ | Ohne Conversiondaten lernt die Automatik nichts |
| Werbezeiten | nur während der Erreichbarkeit (sobald `openingHours` gepflegt ist) | Anrufe außerhalb gehen verloren |
| Anruf-Asset | Telefonnummer aus `docs/EINTRAGS-KIT.md` | |
| Standort-Asset | mit dem Google-Unternehmensprofil verknüpfen | zeigt Bewertungen automatisch, ohne sie in den Text zu schreiben |

## 3. Anzeigengruppen und Keywords

Passende Keyword-Option: **Wortgruppe** (`"…"`) und **genau passend**
(`[…]`). Keine weitgehend passenden Keywords am Anfang.

| Anzeigengruppe | Keywords | Zielseite |
|---|---|---|
| Wohnungsauflösung | "wohnungsauflösung berlin", [wohnungsauflösung berlin], "wohnung auflösen berlin", "wohnung räumen lassen berlin", "wohnung entrümpeln berlin" | `/leistungen/wohnungsaufloesung-berlin/?utm_source=google&utm_medium=cpc&utm_campaign=wohnung` |
| Haushaltsauflösung | "haushaltsauflösung berlin", [haushaltsauflösung berlin], "haushalt auflösen berlin" | `/leistungen/haushaltsaufloesung-berlin/?utm_source=google&utm_medium=cpc&utm_campaign=haushalt` |
| Nachlass | "nachlassauflösung berlin", "wohnung nach todesfall räumen", "wohnung verstorbener räumen berlin", "nachlass wohnung räumen" | `/leistungen/nachlassaufloesung-berlin/?utm_source=google&utm_medium=cpc&utm_campaign=nachlass` |
| Entrümpelung | "entrümpelung berlin", [entrümpelung berlin], "entrümpelungsfirma berlin", "entrümpler berlin" | `/leistungen/entruempelung-berlin/?utm_source=google&utm_medium=cpc&utm_campaign=entruempelung` |

Bezirksnamen (z. B. „entrümpelung pankow“) erst ergänzen, wenn der
Suchbegriffbericht zeigt, dass sie vorkommen.

## 4. Auszuschließende Keywords (Kontoebene)

```
kostenlos
gratis
umsonst
selber
selbst
anleitung
bsr
recyclinghof
sperrmüll termin
job
jobs
stellenangebot
gehalt
ausbildung
minijob
mitarbeiter gesucht
gebraucht kaufen
ebay
kleinanzeigen
flohmarkt
vorlage
muster
checkliste pdf
```

„Sperrmüll“ allein **nicht** ausschließen – die Sperrmüllabholung gehört zum
Angebot. Wöchentlich den Suchbegriffbericht lesen und nachschärfen.

## 5. Anzeigentexte (responsive Suchanzeige)

Je Anzeigengruppe eine Anzeige. Die Überschriften 1–3 sind gruppenspezifisch,
die übrigen gemeinsam. Nichts anpinnen außer Überschrift 1.

### Wohnungsauflösung

Pfad: `schnellhelfer24.de/Wohnung/Berlin`

| Nr. | Überschrift |
|---|---|
| 1 | Wohnungsauflösung Berlin |
| 2 | Wohnung zum Termin geräumt |
| 3 | Einbauten und Küche inklusive |

### Haushaltsauflösung

Pfad: `schnellhelfer24.de/Haushalt/Berlin`

| Nr. | Überschrift |
|---|---|
| 1 | Haushaltsauflösung Berlin |
| 2 | Kompletter Hausrat geräumt |
| 3 | Verwertbares wird angerechnet |

### Nachlass

Pfad: `schnellhelfer24.de/Nachlass/Berlin`

| Nr. | Überschrift |
|---|---|
| 1 | Nachlassauflösung Berlin |
| 2 | Unterlagen werden gesichert |
| 3 | Termin nach Ihren Wünschen |

### Entrümpelung

Pfad: `schnellhelfer24.de/Entruempelung/Berlin`

| Nr. | Überschrift |
|---|---|
| 1 | Entrümpelung in Berlin |
| 2 | Keller, Wohnung, Gewerbe |
| 3 | Getrennt entsorgt |

### Gemeinsame Überschriften

| Nr. | Überschrift |
|---|---|
| 4 | Einschätzung nach Fotos |
| 5 | Feste Absprache vor Beginn |
| 6 | Besenreine Übergabe möglich |
| 7 | Berlin und Umland |
| 8 | Fotos per WhatsApp senden |
| 9 | Jetzt Angebot anfragen |
| 10 | Eine Ansprechperson für alles |

### Beschreibungen (gemeinsam)

| Nr. | Beschreibung |
|---|---|
| 1 | Fotos schicken oder Besichtigung vereinbaren. Der Umfang wird vorher fest abgesprochen. |
| 2 | Räumung, Rückbau von Einbauten und besenreine Übergabe – geplant auf Ihren Übergabetermin. |
| 3 | Berliner Betrieb für Entrümpelung und Auflösungen, auch im angrenzenden Brandenburg. |
| 4 | Anfrage in wenigen Minuten über das Formular, per Telefon oder per WhatsApp mit Fotos. |

**Vor dem Schalten:** Jede Aussage gegen die Zielseite lesen. Steht sie dort
nicht (mehr), fliegt sie aus der Anzeige.

## 6. Messung

| Was | Wie |
|---|---|
| Anfragen aus Anzeigen | Nachfrageregister, Kanal `paid` (über `utm_medium=cpc`/`gclid`) |
| Anrufe | Anruf-Asset-Bericht in Google Ads (nur Anrufe über die Anzeige) |
| Aufträge | Ergebnis je Anfrage in `/api/betrieb.php` |
| Conversion-Tracking in Google Ads | **nicht eingerichtet.** Ein Google-Tag braucht Einwilligung (Cookie-Banner) und eine Ergänzung der Datenschutzerklärung. Bis dahin Auswertung nur über das Register. |

**Abbruchkriterium nach 8 Wochen:** Kosten je gewonnenem Auftrag (Register)
über dem Deckungsbeitrag eines kleinen Auftrags → pausieren, nicht
nachbessern durch mehr Budget.

## 7. Local Services Ads

Ob Entrümpelung oder Umzug in Deutschland als Kategorie buchbar ist, ist
**unbelegt**. Im Google-Ads-Konto unter „Lokale Dienstleistungen“ prüfen.
Falls ja, hat diese Form Vorrang: Abrechnung je Anfrage statt je Klick.
