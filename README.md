# schnellhelfer24.de

Website für Schnellhelfer24: Entrümpelung, Auflösung und Umzug in Berlin und
im Berliner Umland.

Astro 5, TypeScript, statisch ausgeliefert. Eine einzige Abhängigkeit. Kein
Framework im Browser, keine externen Schriften, keine Drittanbieter-Skripte.

---

## Schnellstart

```bash
npm install
npm run dev        # http://localhost:4321
```

Im Entwicklungsmodus sind rot umrandete Redaktionshinweise sichtbar. Sie
zeigen, welche echten Daten an der jeweiligen Stelle noch fehlen. In der
Produktionsausgabe erscheinen sie nicht.

---

## Wichtigste Dateien

| Datei | Wofür |
|---|---|
| `src/config/site.ts` | **Zentrale Unternehmensdaten.** Telefon, Adresse, E-Mail, Öffnungszeiten, Profile, Nachweise. Alles andere zieht sich die Werte von hier. |
| `src/data/services.ts` | Leistungen samt Texten, FAQ und Preisfaktoren |
| `src/data/districts.ts` | Berliner Bezirke |
| `src/data/towns.ts` | Orte im Umland |
| `src/data/guides.ts` | Ratgeber und Kostenseiten |
| `src/data/cases.ts` | Einsatzberichte |
| `src/data/reviews.ts` | Bewertungen (leer, bis echte vorliegen) |
| `src/data/costs.ts` | Preisdaten (inaktiv, bis echte vorliegen) |
| `src/lib/publishGuard.ts` | Entscheidet, welche Seite indexiert werden darf |
| `public/api/anfrage.php` | Endpunkt für das Anfrageformular |

---

## Befehle

```bash
npm run dev            # Entwicklungsserver
npm run build          # baut nach dist/
npm run preview        # gebaute Website ansehen
npm run check          # TypeScript- und Astro-Prüfung

npm run audit:content  # prüft die Inhalte vor dem Build
npm run audit:build    # prüft die gebaute Website
npm run indexnow       # meldet geänderte URLs an IndexNow

node scripts/make-images.mjs   # erzeugt og-default.png und apple-touch-icon.png
```

---

## Drei Regeln, die dieses Projekt trägt

### 1. Nichts wird erfunden

Keine Bewertungen, keine Preise, keine Referenzfälle, keine Zertifikate, keine
Reaktionszeiten. Was nicht belegt ist, steht nicht auf der Website.

Das ist nicht nur eine Haltung, es ist technisch abgesichert:

- Der Bewertungsbereich erscheint nur, wenn `src/data/reviews.ts` echte
  Einträge enthält. `AggregateRating` wird nur ausgegeben, wenn zusätzlich
  `ratings.verified` gesetzt ist. Beides ist aneinander gekoppelt.
- Preise erscheinen nur, wenn `priceDataAvailable` in `src/data/costs.ts` auf
  `true` steht, und dann immer mit Fallzahl, Zeitraum und den Grenzen der
  Aussage.
- Einsatzberichte mit `real: false` oder mit Platzhaltern im Text lassen sich
  nicht veröffentlichen.
- `npm run audit:build` schlägt fehl, wenn ein Platzhalter in die
  strukturierten Daten gerät.

### 2. Der Publish Guard

Eine Standortseite geht erst online, wenn sie eigenständigen Inhalt hat:
eigene Einleitung, mindestens vier Ortsteile, eigene Angaben zu Bebauung und
Zufahrt, mindestens drei eigene FAQ, ein notierter Unterschied zu den anderen
Standortseiten.

Wer `status: 'published'` setzt, ohne die Inhalte zu ergänzen, bekommt beim
Build eine Fehlermeldung, und die Seite bleibt trotzdem `noindex` und aus der
Sitemap heraus. Die Regel lässt sich nicht versehentlich umgehen.

So entstehen keine zwölf fast identischen Bezirksseiten.

Aktuell veröffentlicht: 3 von 12 Bezirken, 2 von 12 Orten im Umland. Die
übrigen existieren als Entwurf und warten auf echte Inhalte.

### 3. Eine Quelle für Unternehmensdaten

Telefonnummer, Adresse, Öffnungszeiten und Profile stehen ausschließlich in
`src/config/site.ts`. Von dort speisen sich Kopfbereich, Fußbereich,
Kontaktseite, Impressum, alle Telefon- und WhatsApp-Links und sämtliche
strukturierten Daten.

Solange dort ein Platzhalter steht, wird der betreffende Kontaktweg überall
ausgeblendet, statt einen toten Link zu erzeugen. Widersprüchliche Angaben
zwischen Seiten sind dadurch ausgeschlossen.

---

## Weiterführende Dokumentation

| Datei | Inhalt |
|---|---|
| `CONTENT-TODO.md` | Alle noch fehlenden echten Angaben, nach Dringlichkeit sortiert |
| `SEO-LAUNCH-CHECKLIST.md` | Schritt für Schritt zum Livegang, plus Contentplan für 90 Tage |
| `docs/ARCHITEKTUR.md` | Warum Astro, warum PHP fürs Formular, Deployment, Performance-Budget |
| `docs/KI-CRAWLER.md` | Welche KI-Bots erlaubt sind und warum |

---

## Stand

37 indexierbare Seiten, 29 weitere als Entwurf.

Was fehlt, sind keine Funktionen, sondern echte Unternehmensdaten. Die Liste
steht in `CONTENT-TODO.md`, Abschnitt A.
