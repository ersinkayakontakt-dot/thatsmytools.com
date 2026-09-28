# Entscheidungsprotokoll

Architektur- und Produktentscheidungen mit ihrer Begründung. Zweck: dieselbe
Frage nicht zweimal verhandeln.

Eine Entscheidung gehört hierher, wenn sie **später jemanden überraschen
würde**. Reine Umsetzungsdetails nicht — die stehen im Code.

Format je Eintrag: Entscheidung / Grund / Beleg / Abwägung / Datum.
Neueste zuerst.

---

## E-009 · Zweite und dritte Herrichten-Leistung: Boden und Küche, nicht Trockenbau und Möbelmontage

**Entscheidung:** `bodenbelag-verlegen-berlin` und `kuechenmontage-berlin`
werden veröffentlicht, beide P2. Trockenbau und allgemeine Möbelmontage
werden **nicht** angelegt.

**Grund:** Beide Leistungen setzen die Kette nach der Räumung direkt fort
(E-005): räumen → zurückbauen → Boden → Küche → übergeben. Der
Familienteaser versprach „Böden … in den Zustand bringen", ohne dass es
dafür eine Leistung gab. Trockenbau bedient die SERP der
Objekt-Spezialisten (dasselbe Argument wie gegen „Innenausbau", E-006).
Allgemeine Möbelmontage hätte mit `/leistungen/umzug-berlin/`
konkurriert, dessen Meta Description „Möbelmontage" bereits nennt.

**Leistungsgrenzen:** Beide Seiten bleiben innerhalb der Liste A in
`docs/HANDWERKSRECHT.md` (A2 Bodenlegen ohne Parkett/Estrich, A3 Montage
genormter Fertigteile ohne Änderung daran). Das steht als `notIncluded`
im Datensatz, nicht als rechtlicher Vorbehalt im Text – im Einklang mit
E-007. Der Herdanschluss ist aus Sicherheitsgründen ausgenommen, nicht
aus handwerksrechtlichen.

**Linkstrategie – und warum zwei Links wieder entfernt wurden:** Der
erste Entwurf verlinkte aus beiden neuen Seiten im Fließtext auf den
Rückbau. Das hob den Rückbau (P2) auf 5,0 Punkte, über drei P4-Seiten
und eine P3-Seite: 12 → 16 Warnungen. Die Verweise auf den Rückbau stehen
jetzt nur noch in `related` (navigational, zählt nicht). Stattdessen
verweist die Bodenseite im Fließtext auf `messiwohnung-raeumen`,
`bueroaufloesung-berlin` und `/hausverwaltungen-immobilienpartner/` –
jeweils dort, wo der Zusammenhang sachlich trägt. Ergebnis: 12 Warnungen
wie vorher, P4-Durchschnitt 5,2 → 5,4.

**Lehre für die nächste Leistung:** Eine neue P2-Seite darf ihre
Geschwister nicht im Fließtext verlinken, sonst überholt die Familie die
P4-Ebene. Fließtextverweise aus neuen Seiten gehören an P4-Seiten.

**Datum:** 28.09.2026

---

## E-008 · P4-Ebene wird durch Fließtext gestärkt, nicht durch Umpriorisierung

**Entscheidung:** Die vier P4-Seiten (`messiwohnung`, `bueroaufloesung`,
`seniorenumzug`, `hausverwaltungen`) bekommen kontextuelle Verweise aus dem
Fließtext starker Seiten. Prioritäten bleiben unverändert.

**Grund:** Der Linkgraph erwartet fallende Autorität von P5 über P4 zu P3.
Tatsächlich lag P4 bei 3,8 und P3 bei 5,8 — die vier Seiten, die das
Unternehmen selbst als wertvoll einstuft, waren intern schwächer angebunden
als Nebenleistungen. `hausverwaltungen` hatte genau **einen** kontextuellen
Eingang.

**Beleg:** Vier Verweise, alle inhaltlich begründet — Nachlass → B2B-Einstieg,
Wohnungsauflösung → B2B als Hinweiskasten, Haushaltsauflösung → Seniorenumzug
als Abgrenzung, Rückbau → Büroauflösung bei Gewerbeflächen. Ergebnis:
Warnungen 16 → 12, P4-Durchschnitt 3,8 → 5,2.

**Wichtig für die Wiederholung:** Nur **Fließtextverweise** zählen.
`related`-Einträge und Seitenleisten wertet der Linkgraph als navigational;
sie bewegen den Score nicht. Das wurde erst nach mehreren wirkungslosen
Versuchen klar.

**Abwägung — warum hier Schluss ist:** Die verbleibenden sieben Umkehrungen
richten sich überwiegend gegen `kellerentruempelung` mit 7,7 Punkten. Die
Seite ist so stark, weil alle zwölf Bezirksseiten den Keller erwähnen. Das
aufzuholen bräuchte so viele weitere Verweise, dass es in Linkstopfen
umschlüge. Ihre Priorität zu senken wäre schlechter: Als P2 mit 7,7 stünde
sie gegen jede P3-Seite.

**Datum:** 27.09.2026

---

## E-007 · Rechtliche Absicherung liegt beim Betreiber

**Entscheidung:** Der Betreiber hat am 26.09.2026 erklärt, die Rechtslage sei
geprüft und der Betrieb abgesichert, und angewiesen, keine weiteren
handwerksrechtlichen Vorbehalte in die Arbeit einzubauen.

**Grund:** Der Betreiber verfügt über Informationen zum eigenen Betrieb, die
aus dem Code nicht hervorgehen. Die Recherche in `docs/HANDWERKSRECHT.md`
bleibt als Sachstand erhalten, steuert die Umsetzung aber nicht mehr.

**Zutreffend an der Einordnung des Betreibers:** „Mietwohnung neu vermietbar"
benennt ein Ergebnis, kein Gewerk. Die Recherche kam zum selben Schluss — die
Anlass-Sprache ist handwerksrechtlich die unbedenklichere.

**Abwägung:** Die Empfehlungen aus der Recherche werden weiterhin befolgt,
wo sie aus SEO- oder Produktgründen tragen — etwa `hub: false` für die neue
Familie. Diese Entscheidungen stehen auf eigenen Füßen und nicht auf dem
Rechtsargument.

**Datum:** 26.09.2026

---

## E-006 · Vierte Familie heißt `herrichten`, nicht `innenausbau`

**Entscheidung:** Die Familie heißt `herrichten` („Herrichten und instand
setzen"), `hub: false`, erste Leistung `demontage-rueckbau`.

**Grund:** Drei Befunde aus der Marktrecherche vom 26.09.2026.
Erstens gehört die SERP zu „innenausbau berlin" Spezialisten im
Objektgeschäft und bedient eine andere Zielgruppe. Zweitens passt ein Verb
zur Systematik der drei bestehenden Familien. Drittens behauptet
„Herrichten" kein Gewerk.

Keine Hub-Seite, weil die Suchintention fehlt — der Einstieg läuft über
Gewerk+Stadt oder über Ratgeber zum Anlass. Ihre Aufgabe ist zudem doppelt
vergeben: B2B über `/hausverwaltungen-immobilienpartner/`, B2C über die
Leistungsseiten.

**Beleg:** SERP-Zusammensetzung, dokumentiert in der Recherche. **Keine
Suchvolumina** — nicht erhoben, deshalb nicht behauptet.

**Abwägung:** „Herrichten" ist als Suchbegriff schwächer als „Renovierung".
Die Familie trägt aber nicht den Einstieg — das tun die Leistungsseiten.
**Wiedervorlage für die Hub-Seite:** drei veröffentlichte Leistungen plus
Nachfragebeleg aus dem GSC-Export.

**Datum:** 26.09.2026

---

## E-005 · Innenausbau ist die Fortsetzung des Bestandsgeschäfts, nicht eine zweite Sparte

**Entscheidung (vorläufig, Recherche läuft):** Die Erweiterung zielt auf den
**Anlass** („Wohnung übergabefertig machen"), nicht auf das **Gewerk**
(„Malerarbeiten Berlin"). Die Gewerke werden Leistungen *unter* der Familie
für gezielte Suchen, tragen aber nicht den Einstieg.

**Grund:** Die bestehende Leistungskette endet bei
`/leistungen/besenreine-wohnungsuebergabe/` — leer und besenrein. Genau dort
beginnt der Bedarf von Erben, Hausverwaltungen und Eigentümern: verkaufsfertig,
vermietbar, bezugsfertig. Die Erweiterung schließt eine Lücke im eigenen
Ablauf, statt eine neue Front gegen Handwerkerplattformen zu eröffnen.

**Beleg — Recherche vom 26.09.2026, TEILWEISE WIDERLEGT:**
Die Kombination als Thema ist **bestätigt**: „entrümpelung und renovierung aus
einer hand" ist 9/9 kommerziell, ausschließlich Räumungsfirmen mit eigener
Renovierungsseite.
Der Anlass als **Leistungsseite** ist **widerlegt**: „besenrein übergeben +
Renovierung" 9/9 juristisch, „Mietwohnung vor Neuvermietung" 9/9
Mietrechtsratgeber, „Nachlassimmobilie verkaufsfertig" gehört Home Stagern.
**Folge:** Der Anlass trägt als Ratgeber und als Formularlogik, nicht als
Angebotsseite. Siehe E-006.

**Abwägung:** Anlass-Einstieg bedient die Suchanfrage „laminat verlegen lassen
berlin" schlechter als eine reine Gewerkeseite. Deshalb beides — Familie
verkauft das Bündel, Leistungen bedienen die Einzelsuche. Falls die Recherche
zeigt, dass die Kombination nicht gesucht wird, wird der Anlass zum
Verkaufsargument auf bestehenden Seiten degradiert und nicht zum Seitenthema.

**Datum:** 26.09.2026

---

## E-004 · Eigenausführung, keine Vermittlung

**Entscheidung:** Schnellhelfer24 führt alle Leistungen selbst aus. Kein
Marktplatz, keine Anbietervermittlung, keine Nachunternehmer-Konstruktion.

**Grund:** Betreiberentscheidung vom 26.09.2026. Produktseitig ist das der
strukturelle Vorteil gegenüber MyHammer und CHECK24: ein Ansprechpartner, ein
Qualitätsmaßstab, eine Rechnung. Diesen Vorteil kann eine Vermittlungsplattform
nicht nachbauen.

**Beleg:** Aussage des Betreibers. Die Website bildet das bereits ab — eine
`LocalBusiness`-`@id`, ein Postfach, kein Anbieter- oder Nutzermodell.

**Abwägung:** Begrenzt das Leistungsspektrum auf das, was das Unternehmen
handwerksrechtlich selbst erbringen darf. Damit wird die Frage nach der
Handwerksrolle zur harten Grenze der Produktplanung, nicht zur Randnotiz.
Siehe offener Punkt in `CONTENT-TODO.md` § 0b.

**Nicht abgeleitet:** Eine Betriebshaftpflicht wurde vom Betreiber erwähnt.
Sie darf auf der Website **erst genannt werden**, wenn die Police vorliegt —
so steht es seit jeher in `HANDOFF.md` unter den offenen Punkten, und daran
ändert eine mündliche Zusage nichts.

**Datum:** 26.09.2026

---

## E-003 · Kategorie-Ebene als Daten, mit zwei Arten von Kategorie

**Entscheidung:** Leistungsfamilien stehen in `src/data/categories.ts`.
`hub: false` ist reine Gruppierung auf `/leistungen/` ohne eigene Seite,
`hub: true` bekommt eine eigene Seite und muss dann dieselbe inhaltliche Tiefe
liefern wie eine Standortseite.

**Grund:** Die Gruppierung existierte bereits, aber als fest verdrahtete
Konstante in `src/pages/leistungen/index.astro`. Damit war sie für jede Prüfung
unsichtbar und nicht erweiterbar. Die zwei Arten verhindern das Naheliegende
und Falsche: dass jede Gruppe automatisch eine Seite bekommt.

**Beleg:** `validateCategories()` in `categories.ts`; `/leistungen/index.html`
rendert nach der Umstellung byte-identisch.

**Abwägung:** Eine Familie ohne eigenständige Suchintention bekommt keine
Seite. „Räumen und auflösen" bleibt deshalb ohne — wer das sucht, sucht
„Entrümpelung", und dafür gibt es bereits eine starke Leistungsseite. Eine
Hub-Seite dazwischen würde mit ihr konkurrieren; `npm run seo:cannibalization`
würde es melden.

**Datum:** 26.09.2026

---

## E-002 · Leistungs-URLs bleiben flach, Hub-Seiten liegen auf oberster Ebene

**Entscheidung:** Leistungen behalten `/leistungen/<slug>/`. Kategorie-Hubs
bekommen `/<slug>/` auf oberster Ebene, **nicht** `/innenausbau/trockenbau/`.
Die Hierarchie trägt der Breadcrumb, nicht der Pfad.

**Grund:** Eine Verschachtelung würde die URLs der zehn veröffentlichten
Leistungsseiten ändern. Das kostet Weiterleitungen, Rankinggeschichte und
Risiko — gegen einen Pfadbestandteil, der als Rankingfaktor schwach ist.

**Beleg:** 50 indexierbare URLs sind live und in der Search Console erfasst.
`BreadcrumbList` im Schema kann eine Hierarchie abbilden, die vom Pfad
abweicht; `Breadcrumbs.astro` ist vorhanden.

**Abwägung:** Pfad und Hierarchie laufen auseinander — für Menschen an der URL
nicht mehr ablesbar. Dafür null Migrationsrisiko. Revidierbar, falls später ein
Relaunch ohnehin URLs anfasst.

**Datum:** 26.09.2026

---

## E-001 · `leistungen/[slug].astro` wird nicht in eine Artikelkomponente zerlegt

**Entscheidung:** Die 287-Zeilen-Datei bleibt, obwohl Standort- und
Ratgeberseiten mit 63 bzw. 71 Zeilen auskommen, weil sie `LocationArticle`
und `GuideArticle` nutzen. Ein `ServiceArticle` wird **nicht** angelegt.

**Grund:** Die Kategorie-Ebene erzwingt dort genau drei Zeilen Breadcrumb.
Eine funktionierende Datei ohne Anlass umzubauen ist ein Rewrite ohne Evidenz.

**Abwägung:** Der Aufwand für Änderungen am Leistungs-Seitentyp bleibt höher
als bei den anderen beiden. **Auslöser zum Nachholen:** sobald die
Innenausbau-Leistungen echte Darstellungsvarianz in dieser Datei erzwingen —
dann mit Grund und in einem eigenen Schritt.

**Datum:** 26.09.2026
