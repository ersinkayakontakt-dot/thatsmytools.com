#!/usr/bin/env node
/**
 * EINTRAGS-KIT
 * ============
 * Erzeugt `docs/EINTRAGS-KIT.md`: die Unternehmensangaben in genau der
 * Form, in der sie in Google, Bing, Apple und die Branchenverzeichnisse
 * eingetragen werden.
 *
 *   npm run kit
 *
 * WOZU DAS GUT IST:
 * Der größte Hebel für die lokale Auffindbarkeit sind übereinstimmende
 * Nennungen (Citations). Der häufigste Grund, warum sie nicht wirken, ist
 * banal: Beim Abtippen entsteht auf Portal 3 eine andere Schreibweise als
 * auf Portal 1. „Schnellhelfer 24" statt „Schnellhelfer24", eine alte
 * Hausnummer, eine zweite Telefonnummer. Damit ist die Zuordnung kaputt,
 * und niemand merkt es.
 *
 * Deshalb wird nichts abgetippt. Alles in dieser Datei stammt aus
 * `src/config/site.ts` und wird kopiert.
 *
 * WAS DIE DATEI NICHT TUT:
 * Sie füllt keine Lücken. Steht in der Konfiguration ein Platzhalter,
 * erscheint hier eine sichtbare Fehlstelle statt eines erfundenen Werts.
 * Ein Portal mit erfundenen Öffnungszeiten zu füllen wäre schlimmer, als
 * das Feld leer zu lassen.
 *
 * Hintergrund und Reihenfolge: docs/ENTITY-UND-RANKING.md
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// Siehe scripts/content-audit.mjs: ein roher Windows-Pfad ist in einem
// Importstring keine gültige Zeichenkette.
const mod = (rel) => pathToFileURL(join(root, rel)).href;

const tmpDir = join(root, '.astro');
mkdirSync(tmpDir, { recursive: true });
const tmpFile = join(tmpDir, 'eintrags-kit.mts');

writeFileSync(
  tmpFile,
  `
import { writeFileSync } from 'node:fs';
import { site, realValue, isPlaceholder, addressLine } from '${mod('src/config/site.ts')}';
import { publishedServices } from '${mod('src/data/services.ts')}';
import { publishedDistricts } from '${mod('src/data/districts.ts')}';
import { publishedTowns } from '${mod('src/data/towns.ts')}';

const fehlend: string[] = [];

/** Gibt den echten Wert zurück oder markiert die Fehlstelle sichtbar. */
function v(wert: string | undefined | null, name: string): string {
  const echt = realValue(wert);
  if (echt) return echt;
  fehlend.push(name);
  return '**FEHLT — ' + name + ' in src/config/site.ts eintragen**';
}

const zeiten = site.openingHours
  .map((h) => {
    const tage: Record<string, string> = {
      Monday: 'Mo', Tuesday: 'Di', Wednesday: 'Mi', Thursday: 'Do',
      Friday: 'Fr', Saturday: 'Sa', Sunday: 'So',
    };
    const spanne = h.days.length > 1
      ? tage[h.days[0]] + '–' + tage[h.days[h.days.length - 1]]
      : tage[h.days[0]];
    const auf = realValue(h.opens);
    const zu = realValue(h.closes);
    if (!auf || !zu) return spanne + ': **FEHLT**';
    return spanne + ': ' + auf + '–' + zu + ' Uhr';
  })
  .join('  \\n');

const zeitenEcht = site.openingHours.every(
  (h) => !isPlaceholder(h.opens) && !isPlaceholder(h.closes),
);
if (!zeitenEcht) fehlend.push('openingHours (Erreichbarkeitszeiten)');

const gebiet = [
  ...publishedDistricts.map((d) => d.name),
  ...publishedTowns.map((t) => t.name),
].join(', ');

const leistungen = publishedServices
  .map((s) => '| ' + s.h1 + ' | ' + s.teaser + ' |')
  .join('\\n');

const profileEcht = Object.entries(site.profiles)
  .filter(([, url]) => !isPlaceholder(url))
  .map(([k, url]) => '- ' + k + ': ' + url);

const profileOffen = Object.entries(site.profiles)
  .filter(([, url]) => isPlaceholder(url))
  .map(([k]) => '- [ ] ' + k);

const adresse = addressLine() ?? '**FEHLT — Anschrift in src/config/site.ts**';

const md = \`# Eintrags-Kit: dieselben Angaben für alle Portale

> **Diese Datei wird erzeugt.** Sie nicht von Hand ändern —
> \\\`npm run kit\\\` überschreibt sie. Quelle ist \\\`src/config/site.ts\\\`.
>
> Erzeugt am \${new Date().toLocaleDateString('de-DE')}.

Beim Anlegen eines Profils **nichts abtippen, sondern von hier kopieren.**
Eine einzige abweichende Schreibweise macht die Nennung wertlos: Sie wird
dann nicht als Bestätigung gelesen, sondern als Hinweis auf ein anderes
Unternehmen.

Warum das der zweitgrößte Hebel überhaupt ist, steht in
\\\`docs/ENTITY-UND-RANKING.md\\\`.

---

## Der Datenblock

| Feld | Wert zum Kopieren |
|---|---|
| Name (überall identisch) | \${site.name} |
| Vollständige Firmierung | \${v(site.legalName, 'legalName')} |
| Rechtsform | \${v(site.legalForm, 'legalForm')} |
| Inhaber | \${v(site.owner, 'owner')} |
| Telefon (international) | \${v(site.phone, 'phone')} |
| Telefon (Anzeigeform) | \${v(site.phoneDisplay, 'phoneDisplay')} |
| WhatsApp | \${v(site.whatsapp, 'whatsapp')} |
| E-Mail | \${v(site.email, 'email')} |
| Anschrift | \${adresse} |
| Website | \${site.url} |
| Gründungsjahr | \${v(site.foundingYear, 'foundingYear')} |

**Zur Anschrift:** \\\`hasVisitableAddress\\\` steht auf \\\`\${site.hasVisitableAddress}\\\`.
\${site.hasVisitableAddress
  ? 'Die Adresse darf öffentlich angezeigt werden.'
  : 'Der Betrieb ist ein Dienstleistungsgebiet-Unternehmen. Die Adresse wird in Google und Bing **hinterlegt, aber nicht öffentlich angezeigt**. Stattdessen wird das Einsatzgebiet gepflegt. Beide Portale müssen dieselbe Aussage ergeben wie die Website.'}

### Erreichbarkeit

\${zeiten}

\${zeitenEcht ? '' : '> Solange hier **FEHLT** steht, in keinem Portal Zeiten eintragen. Erfundene Öffnungszeiten sind die Angabe, an der Kundschaft eine Firma am schnellsten als unseriös einstuft, weil sie sich sofort überprüfen lässt.'}

### Kurzbeschreibung (bis ca. 200 Zeichen)

> \${site.shortDescription}

### Namensvarianten

\${site.alternateNames.map((n) => '- ' + n).join('\\n')}

Diese Schreibweisen **nicht** als Profilnamen verwenden. Der Profilname ist
überall \\\`\${site.name}\\\`, ohne Zusatz und ohne Suchbegriffe. Keywords im
Namen verstoßen gegen die Richtlinien von Google und kosten im Zweifel das
Profil.

### Abgrenzung zu ähnlichen Namen

Für Profilfelder, die einen längeren Text erlauben:

> \${site.disambiguation}

---

## Einsatzgebiet

\${gebiet}

Nur Gebiete eintragen, die tatsächlich bedient werden.
\${realValue(site.areaServed.note) ? '' : '**Offen:** Das tatsächliche Einsatzgebiet ist in \\\`areaServed.note\\\` noch nicht bestätigt.'}

## Leistungen

Mit **denselben Bezeichnungen** wie auf der Website eintragen, einzeln, nicht
als Fließtext.

| Leistung | Kurztext |
|---|---|
\${leistungen}

## Bilder

| Zweck | Datei |
|---|---|
| Logo (quadratisch, 512 × 512) | \${site.url}/logo.png |
| Vorschaubild | \${site.url}/og-default.png |

Echte Fotos von Fahrzeugen und Team haben Vorrang, sobald es welche gibt.
Profile mit echten Fotos werden deutlich häufiger angeklickt. Keine
Stockfotos, keine KI-Bilder.

---

## Bewertungen einsammeln

Der kurze Weg für Rechnung, Visitenkarte und QR-Code:

**\${site.url}/bewerten/**

Die Seite ist \\\`noindex\\\` und leitet auf das Google-Bewertungsformular
weiter. Ändert sich der Google-Link, ändert sich nur
\\\`site.reviewLink\\\` — nicht das bereits gedruckte Material.

\${realValue(site.reviewLink)
  ? 'Direktlink hinterlegt: ' + realValue(site.reviewLink)
  : '**Noch nicht hinterlegt.** Im Google-Unternehmensprofil unter „Rezensionen" auf „Mehr Rezensionen erhalten" gehen. Google erzeugt dort einen Link der Form https://g.page/r/…/review, der mit einem Klick direkt ins Bewertungsfenster führt. Diesen in \\\`site.reviewLink\\\` eintragen. Bis dahin öffnet /bewerten/ nur den Karteneintrag — das kostet zwei Klicks, und jeder Klick kostet Bewertungen.'}

Keine Gutscheine, keine Rabatte, keine Gewinnspiele als Gegenleistung. Das
ist nach UWG abmahnfähig, und Google löscht solche Bewertungen.

---

## Reihenfolge der Portale

Nach Wirkung sortiert. Nach jedem angelegten Profil die URL in
\\\`src/config/site.ts\\\` unter \\\`profiles\\\` eintragen — sie wird dann
automatisch als \\\`sameAs\\\` ausgezeichnet, und der Kreis schließt sich:
Die Website nennt die Profile, die Profile nennen die Website.

### Stufe 1 — Karten und Suche

- [ ] **Google-Unternehmensprofil** — Kategorien: *Entrümpelungsdienst*
      (primär), *Umzugsunternehmen*, *Entsorgungsunternehmen*. Die genauen
      Bezeichnungen aus der Auswahlliste des Portals übernehmen.
- [ ] **Bing Webmaster Tools** — Sitemap \${site.url}/sitemap.xml einreichen
- [ ] **Bing Places** — Import aus dem Google-Profil möglich, Angaben danach
      trotzdem gegen diese Datei prüfen
- [ ] **Apple Business Connect** — kostenlos, speist Apple Karten und Siri

### Stufe 2 — Branchenverzeichnisse

- [ ] Gelbe Seiten
- [ ] Das Örtliche
- [ ] 11880
- [ ] Cylex
- [ ] GoLocal
- [ ] OpenStreetMap
- [ ] wlw (nur B2B sinnvoll)

### Stufe 3 — Eigene Kanäle

- [ ] LinkedIn-Unternehmensseite
- [ ] Facebook-Seite
- [ ] Instagram-Profil

---

## Stand der Profile

Bereits eingetragen und als \\\`sameAs\\\` ausgezeichnet:

\${profileEcht.length ? profileEcht.join('\\n') : '- noch keines'}

Noch offen in \\\`site.profiles\\\`:

\${profileOffen.length ? profileOffen.join('\\n') : '- keines'}
\`;

writeFileSync('${mod('docs/EINTRAGS-KIT.md').replace('file://', '')}', md, 'utf8');

console.log('erzeugt: docs/EINTRAGS-KIT.md');
if (fehlend.length) {
  console.log('');
  console.log('Fehlstellen, die im Kit sichtbar markiert sind (' + fehlend.length + '):');
  for (const f of [...new Set(fehlend)]) console.log('  ' + f);
  console.log('');
  console.log('Diese Felder in keinem Portal raten. Siehe CONTENT-TODO.md.');
}
`,
  'utf8',
);

const result = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', tmpFile], {
  stdio: 'inherit',
  cwd: root,
});

rmSync(tmpFile, { force: true });
process.exit(result.status ?? 1);
