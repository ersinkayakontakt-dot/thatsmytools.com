# KI-Crawler: wer darf was

Diese Datei erklärt die Entscheidungen in `src/pages/robots.txt.ts`.

Der wichtigste Punkt vorweg: **Auffindbarkeit und Training sind zwei
verschiedene Dinge und werden von unterschiedlichen Bots erledigt.** Wer alle
KI-Bots pauschal sperrt, verhindert nicht nur die Trainingsnutzung, sondern
auch, dass die eigene Website in ChatGPT Search oder Copilot überhaupt als
Quelle auftauchen kann. Wer alle pauschal erlaubt, gibt die Inhalte
stillschweigend fürs Training frei. Beides sollte eine bewusste Entscheidung
sein.

---

## Die drei Bots von OpenAI

| Bot | Wofür | Entscheidung hier |
|---|---|---|
| `OAI-SearchBot` | Indexiert Seiten für ChatGPT Search. Wenn er gesperrt ist, kann die Seite dort nicht als Quelle erscheinen. | **Erlaubt** |
| `ChatGPT-User` | Ruft eine Seite ab, weil eine Nutzerin oder ein Nutzer im Gespräch danach gefragt hat. Ein Besuch im Auftrag eines Menschen. | **Erlaubt** |
| `GPTBot` | Sammelt Inhalte für das Training künftiger Modelle. Bringt keine Sichtbarkeit. | **Gesperrt** |

Die Trennung ist der Kern: `OAI-SearchBot` zu erlauben ist die Voraussetzung
dafür, dass Schnellhelfer24 in einer KI-Antwort auf „Wer entrümpelt in
Berlin-Pankow?" überhaupt genannt werden kann. `GPTBot` zu erlauben hat
darauf keinen Einfluss.

---

## Weitere Anbieter

| Bot | Zweck | Entscheidung |
|---|---|---|
| `PerplexityBot` | Suche und Zitation in Perplexity | Erlaubt |
| `Applebot` | Apple-Suche und Siri | Erlaubt |
| `Applebot-Extended` | Nutzung für das Training von Apple-Modellen, kein eigener Suchcrawler | Gesperrt |
| `Google-Extended` | Training und bestimmte Grounding-Nutzungen in Gemini Apps/Vertex AI, **nicht** die Google-Suche | Gesperrt |
| `CCBot` | Common Crawl, allgemeiner Datensatz für Modelltraining | Gesperrt |
| `meta-externalagent` | Training für Meta-Modelle | Gesperrt |
| `Bytespider` | ByteDance, Training | Gesperrt |

Wichtig zu `Google-Extended`: Diese Kennung steuert Training und bestimmte Grounding-Nutzungen
in Gemini Apps und Vertex AI. Die normale Google-Suche nutzt den `Googlebot` und ist
davon nicht betroffen. Ein Ranking-Nachteil entsteht durch die Sperre nicht.

---

## Verifikation am 21.10.2026

Primärquellen: [OpenAI-Crawler](https://developers.openai.com/api/docs/bots), [Google-KI-Suche](https://developers.google.com/search/docs/appearance/ai-features), [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Applebot](https://support.apple.com/en-us/119829), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

Korrektur: Applebot-Extended ist eine Steuerung für Modelltraining, keine Voraussetzung für Apple-Suchergebnisse. Applebot bleibt erlaubt. Google-Extended steuert neben Training auch bestimmte Grounding-Nutzungen außerhalb der Google-Suche; die bestehende Sperre bleibt erhalten. ChatGPT-User bestimmt nicht die Aufnahme in ChatGPT Search; maßgeblich ist OAI-SearchBot.

Alle erlaubten spezifischen Botgruppen erhalten die Ausschlüsse für API, Anfragebestätigung und Fehlerparameter ausdrücklich. Spezifische Gruppen erben die Regeln der Stern-Gruppe nicht. robots.txt ersetzt dabei keine serverseitige Zugriffssperre.

## Wie diese Entscheidung geändert wird

Alles steht an einer Stelle: `src/pages/robots.txt.ts`. Nach jeder Änderung
`npm run build` und die Ausgabe unter `/robots.txt` prüfen.

`npm run audit:build` schlägt Alarm, wenn `OAI-SearchBot` versehentlich
gesperrt wird.

**Wenn die Inhalte fürs Training freigegeben werden sollen** (etwa weil man
darauf setzt, dass die Marke dadurch in Modellen bekannter wird): den
`Disallow` für `GPTBot` und `Google-Extended` auf `Allow` ändern. Das ist eine
unternehmerische Entscheidung, kein technisches Detail, deshalb wird sie hier
nicht stillschweigend getroffen.

---

## Was robots.txt nicht leistet

- Sie ist **keine Zugriffssperre**. Ein Bot, der sie ignoriert, wird nicht
  aufgehalten. Wer bestimmte Bots wirklich blockieren will, braucht Regeln auf
  Server- oder CDN-Ebene.
- Sie wirkt **nicht rückwirkend**. Was bereits in einem Trainingsdatensatz
  gelandet ist, verschwindet dadurch nicht.
- Sie garantiert **nichts** in die andere Richtung. Ein erlaubter Suchbot
  bedeutet nicht, dass die Seite in Antworten auftaucht.

---

## Was tatsächlich hilft, in KI-Antworten aufzutauchen

Die robots.txt ist die Eintrittskarte, nicht der Grund für eine Nennung. Was
inhaltlich wirkt und auf dieser Website umgesetzt ist:

1. **Bing-Indexierung.** ChatGPT Search und Copilot stützen sich stark auf den
   Bing-Index. Wer bei Bing nicht sauber indexiert ist, taucht dort nicht auf.
   Deshalb sind Bing Webmaster Tools und IndexNow in der
   `SEO-LAUNCH-CHECKLIST.md` vor Google einsortiert.
2. **Eine direkte Antwort direkt unter jeder H1.** Jede wichtige Seite
   beantwortet ihre Hauptfrage in 40 bis 100 Wörtern, ohne Rückbezug auf
   vorherige Absätze. Genau solche Absätze lassen sich zitieren.
   Geprüft wird das automatisch von `npm run audit:content`.
3. **Eindeutige Unternehmensangaben.** Name, Adresse, Telefon und
   Einsatzgebiet kommen aus einer einzigen Datei (`src/config/site.ts`) und
   sind auf jeder Seite als JSON-LD hinterlegt. Widersprüchliche Angaben
   zwischen Website, Google-Profil und Verzeichnissen sind der häufigste
   Grund, warum ein lokales Unternehmen nicht eindeutig zugeordnet wird.
4. **Extrahierbare Fakten.** Preisfaktoren als Tabelle, Abläufe als
   nummerierte Schritte, FAQ mit kurzen eigenständigen Antworten.
5. **Eigene Daten, die es sonst nirgends gibt.** Der geplante Einsatzatlas
   mit anonymisierten echten Auftragsdaten je Bezirk ist der einzige Inhalt
   auf dieser Website, den kein Wettbewerber abschreiben kann. Genau so etwas
   wird zitiert.
6. **Sichtbares Aktualisierungsdatum** auf jeder inhaltlichen Seite.

---

## llms.txt

Unter `/llms.txt` liegt eine maschinenlesbare Übersicht der Website.

**Einordnung, damit keine falschen Erwartungen entstehen:** llms.txt ist ein
Vorschlag aus der Community, kein Standard, und wird von keinem großen
Anbieter verbindlich ausgewertet. Die Datei garantiert weder eine Erwähnung
in ChatGPT oder Copilot noch irgendeine Verbesserung im Ranking.

Sie existiert trotzdem, weil sie nichts kostet, eine saubere Übersicht
darstellt und vorhanden ist, falls sie künftig genutzt wird. Interessant ist
vor allem der Abschnitt „Was auf dieser Website bewusst NICHT steht": Er
benennt ausdrücklich, dass es keine Pauschalpreise, keine unbelegten
Bewertungen und keine erfundenen Referenzen gibt. Das ist die ehrlichste
Angabe, die man einem Antwortsystem über eine noch junge Website machen kann.

---

## Auswertung von KI-Traffic

`src/components/Analytics.astro` erkennt Besuche aus Antwortsystemen. Es
werden zwei Wege ausgewertet:

- `utm_source=chatgpt.com` und vergleichbare Parameter,
- der Referrer, wenn kein Parameter vorhanden ist. Erkannt werden
  `chatgpt.com`, `chat.openai.com`, `copilot.microsoft.com`, `perplexity.ai`
  und `gemini.google.com`.

Solche Besuche werden dem Kanal `ai` zugeordnet und für die Sitzung im
`sessionStorage` gehalten, sodass eine spätere Anfrage über das Formular
derselben Quelle zugerechnet werden kann. Das Feld `quelle` im Formular
überträgt diese Zuordnung mit der Anfrage.

Damit lässt sich nach einigen Monaten die einzig belastbare Frage
beantworten: Kommen aus KI-Systemen tatsächlich Anfragen, oder nur Klicks?
