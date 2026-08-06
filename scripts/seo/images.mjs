#!/usr/bin/env node
/**
 * BILD-GUARD
 * ==========
 *
 * Prüft die ausgelieferten Bilder auf die Fehler, die Ladezeit, Layout und
 * Barrierefreiheit tatsächlich kaputt machen – und auf die rechtliche
 * Nachweispflicht bei Stockfotos.
 *
 * Aufruf: npm run seo:images
 *
 * BLOCKIEREND
 *   - Bild von einer fremden Domain eingebunden (Hotlink)
 *   - Bild ohne alt-Attribut
 *   - Bilddatei wird nicht ausgeliefert
 *   - Inhaltsbild ohne width/height (verursacht Layoutsprünge)
 *   - mehr als ein Bild mit fetchpriority="high" auf einer Seite
 *   - Stockfoto ohne Eintrag in IMAGE-SOURCES.md
 *
 * WARNUNG
 *   - Inhaltsbild ohne srcset
 *   - Inhaltsbild ohne AVIF- und WebP-Quelle im <picture>
 *   - Bild oberhalb des Falzes mit loading="lazy"
 *   - Bild weit unten ohne loading="lazy"
 *   - Alt-Text wiederholt den Seitentitel, reiht Orte auf oder stapelt
 *     Suchbegriffe
 *   - Seite mit Priorität 4 oder 5 und hinterlegtem Bildmotiv, aber ohne Bild
 *
 * WAS BEWUSST NICHT GEPRÜFT WIRD
 * Ob ein Motiv passt, ob eine abgebildete Person würdevoll dargestellt ist
 * und ob die Lizenz wirklich gilt – das kann kein Skript entscheiden. Dafür
 * gibt es IMAGE-SOURCES.md und die Freigabe durch den Betreiber.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { loadPages, distFiles, projectRoot, SITE } from './lib/pages.mjs';
import { loadSeoMap } from './lib/seoMap.mjs';
import { tokenize } from './lib/similarity.mjs';

const report = new Report('Bilder');
const map = await loadSeoMap();
const pages = loadPages();
const files = distFiles();

/* Bildquellen-Nachweis einlesen, falls vorhanden. */
const sourcesFile = join(projectRoot, 'IMAGE-SOURCES.md');
const documented = new Set();
if (existsSync(sourcesFile)) {
  const md = readFileSync(sourcesFile, 'utf8');
  // Dateinamen, wie sie in der Tabelle stehen: `name.jpg` in Backticks
  // oder als schlichter Dateiname mit Bildendung.
  for (const m of md.matchAll(/([\w-]+\.(?:jpe?g|png|webp|avif))/gi)) documented.add(m[1].toLowerCase());
}

/** Dekorative Bilder tragen bewusst einen leeren Alt-Text. */
const isDecorative = (img) => img.alt === '';

/** Icons und Logos brauchen kein srcset. */
const isSmallAsset = (img) =>
  /\.svg$/i.test(img.src) ||
  /favicon|apple-touch-icon|logo/i.test(img.src) ||
  (Number(img.width) > 0 && Number(img.width) <= 64);

let contentImages = 0;
let hotlinks = 0;

for (const page of pages) {
  const entry = map.byUrl.get(page.url === '/404' ? '/404/' : page.url);
  const highPriority = page.images.filter((i) => i.fetchpriority === 'high');

  if (highPriority.length > 1) {
    report.error(
      page.url,
      `${highPriority.length} Bilder mit fetchpriority="high"`,
      'Genau ein Bild darf Vorrang bekommen – das LCP-Bild. Mehrere Prioritäten heben sich gegenseitig auf.',
    );
  }

  for (const [index, img] of page.images.entries()) {
    /* Hotlink */
    if (/^https?:\/\//i.test(img.src) && !img.src.startsWith(SITE)) {
      hotlinks += 1;
      report.error(
        page.url,
        `Bild von einer fremden Domain eingebunden: ${img.src}`,
        'Bild herunterladen, lokal ablegen und über astro:assets ausliefern. Hotlinks brechen jederzeit und sind lizenzrechtlich heikel.',
      );
      continue;
    }

    /* Alt-Attribut */
    if (img.alt === undefined) {
      report.error(
        page.url,
        `Bild ohne alt-Attribut: ${img.src}`,
        'Beschreibenden Alt-Text ergänzen. Rein dekorative Bilder bekommen alt="" – aber das Attribut muss da sein.',
      );
      continue;
    }

    /* Datei vorhanden? */
    const local = img.src.replace(SITE, '').split('?')[0];
    if (local.startsWith('/') && !files.has(local)) {
      report.error(
        page.url,
        `Bilddatei wird nicht ausgeliefert: ${local}`,
        'Datei nach public/ legen oder den Verweis korrigieren',
      );
    }

    if (isDecorative(img) || isSmallAsset(img)) continue;
    contentImages += 1;

    /* Maße gegen Layoutsprünge */
    if (!img.width || !img.height) {
      report.error(
        page.url,
        `Inhaltsbild ohne width/height: ${img.src}`,
        'Feste Maße setzen. Ohne sie springt das Layout beim Nachladen (Cumulative Layout Shift).',
      );
    }

    /* Responsive Auslieferung */
    if (!img.srcset) {
      report.warn(
        page.url,
        `Inhaltsbild ohne srcset: ${img.src}`,
        'Über die Figure-Komponente ausliefern, damit kleine Bildschirme keine Desktop-Datei laden',
      );
    }
    if (img.pictureTypes) {
      const missing = ['image/avif', 'image/webp'].filter((t) => !img.pictureTypes.includes(t));
      if (missing.length) {
        report.warn(
          page.url,
          `<picture> ohne ${missing.join(' und ')}: ${img.src}`,
          'AVIF und WebP anbieten, der ursprüngliche Typ bleibt als Rückfallebene',
        );
      }
    } else {
      report.warn(
        page.url,
        `Inhaltsbild ohne <picture>-Auszeichnung: ${img.src}`,
        'Ohne <picture> gibt es keine AVIF-/WebP-Alternative',
      );
    }

    /* Ladeverhalten: das erste Bild ist in der Regel das LCP-Bild. */
    if (index === 0 && img.loading === 'lazy' && img.zone !== 'nav' && img.zone !== 'footer') {
      report.warn(
        page.url,
        `erstes Inhaltsbild ist lazy: ${img.src}`,
        'Das sichtbare Bild oben nicht lazy laden – das verzögert den größten Inhaltsaufbau messbar',
      );
    }
    if (index > 1 && img.loading !== 'lazy') {
      report.warn(
        page.url,
        `Bild weiter unten ohne loading="lazy": ${img.src}`,
        'Alles unterhalb des sichtbaren Bereichs lazy laden',
      );
    }

    /* Alt-Text-Qualität */
    const alt = img.alt;
    const altTokens = tokenize(alt);
    if (entry && alt) {
      if (alt.trim().toLowerCase() === entry.title.trim().toLowerCase()) {
        report.warn(
          page.url,
          `Alt-Text wiederholt den Seitentitel: "${alt}"`,
          'Alt-Text beschreibt, was auf dem Bild zu sehen ist – nicht, worum es auf der Seite geht',
        );
      }
      const cityCount = altTokens.filter((t) =>
        ['berlin', 'potsdam', 'spandau', 'pankow', 'neukölln', 'mitte', 'brandenburg', 'falkensee'].includes(t),
      ).length;
      if (cityCount >= 2) {
        report.warn(
          page.url,
          `Alt-Text reiht Ortsnamen auf: "${alt}"`,
          'Ortsnamen gehören in den Text, nicht in den Alt-Text',
        );
      }
      if (altTokens.length > 20) {
        report.warn(
          page.url,
          `Alt-Text ist mit ${altTokens.length} Wörtern zu lang`,
          'Ein Satz genügt. Screenreader lesen alles vor.',
        );
      }
      const stuffing = ['günstig', 'schnell', 'professionell', 'billig', 'preiswert'].filter((w) =>
        altTokens.includes(w),
      );
      if (stuffing.length >= 2) {
        report.warn(
          page.url,
          `Alt-Text enthält Werbewörter statt einer Beschreibung: ${stuffing.join(', ')}`,
          'Beschreiben, was zu sehen ist',
        );
      }
    }

    /* Nachweispflicht für Stockfotos */
    const fileName = local.split('/').pop()?.toLowerCase();
    if (fileName && /\.(jpe?g|png|webp|avif)$/.test(fileName) && !isSmallAsset(img)) {
      // Astro hängt beim Optimieren einen oder zwei Hash-Abschnitte an:
      //   name.Btyvz__B.jpg        (nur Inhalts-Hash)
      //   name.Btyvz__B_z21ueuj.jpg (Inhalts- plus Varianten-Hash)
      // Die Länge ist nicht vorhersagbar, deshalb wird alles zwischen dem
      // ersten Punkt und der Endung entfernt – die eigenen Dateinamen
      // enthalten sonst keine Punkte.
      const base = fileName.replace(/\.[^.]+\.(jpe?g|png|webp|avif)$/, '.$1');
      if (documented.size && !documented.has(base) && !documented.has(fileName)) {
        report.error(
          page.url,
          `Bild ohne Nachweis in IMAGE-SOURCES.md: ${base}`,
          'Quelle, Fotograf, Originalseite, Abrufdatum und Lizenzstatus dokumentieren. Ohne Nachweis darf das Bild nicht live gehen.',
        );
      }
    }
  }

  /* Prioritätsseiten mit hinterlegtem Motiv, aber ohne Bild */
  if (entry?.indexable && entry.businessPriority >= 4 && entry.imageTheme) {
    const hasContentImage = page.images.some((i) => !isDecorative(i) && !isSmallAsset(i));
    if (!hasContentImage) {
      report.warn(
        page.url,
        `Priorität ${entry.businessPriority} mit hinterlegtem Bildmotiv ("${entry.imageTheme}"), aber ohne Inhaltsbild`,
        'Passendes Bild ergänzen – siehe imageTheme in src/data/seo-pages.ts und IMAGE-SOURCES.md',
      );
    }
  }
}

report.stat(`${contentImages} Inhaltsbilder, ${hotlinks} Hotlinks`);
report.stat(
  documented.size
    ? `${documented.size} Bilddateien in IMAGE-SOURCES.md nachgewiesen`
    : 'IMAGE-SOURCES.md fehlt oder ist leer – der Nachweisabgleich läuft noch nicht',
);

finish(report);
