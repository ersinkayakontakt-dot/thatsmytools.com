#!/usr/bin/env node
/**
 * KONTRASTPRÜFUNG (WCAG 2.2 AA)
 * =============================
 *
 * Prüft rechnerisch, ob Text auf seinem tatsächlichen Hintergrund lesbar
 * ist. Zwei Quellen:
 *
 *   1. AUTOMATISCH – jede CSS-Regel, die gleichzeitig `color` und
 *      `background`/`background-color` aus Design-Tokens setzt. Das erfasst
 *      auch die <style>-Blöcke der Astro-Komponenten, nicht nur global.css.
 *
 *   2. ERKLÄRT – Paare, die im Markup entstehen und in keiner einzelnen
 *      Regel zusammenstehen (Text erbt die Farbe, der Hintergrund kommt vom
 *      Container). Diese Fälle findet keine Automatik; sie stehen unten in
 *      PAIRS und sind einzeln begründet.
 *
 * Aufruf: npm run seo:contrast
 *
 * Grenze der Prüfung: Text auf Bildern, Verläufen oder halbtransparenten
 * Flächen wird NICHT erfasst. Die Website vermeidet solche Kombinationen
 * bewusst; neue Bildbereiche müssen im Browser geprüft werden.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { Report, finish } from './lib/report.mjs';
import { projectRoot } from './lib/pages.mjs';
import { readTokens, contrast } from './lib/color.mjs';

const AA_TEXT = 4.5;
const AA_LARGE = 3.0;
const AA_NON_TEXT = 3.0;

const css = readFileSync(join(projectRoot, 'src/styles/global.css'), 'utf8');
const tokens = readTokens(css);

const report = new Report('Kontrast (WCAG 2.2 AA)');
report.stat(`${tokens.size} Farb-Tokens in :root`);

/* ------------------------------------------------------------------ */
/* 1. Erklärte Paare                                                   */
/* ------------------------------------------------------------------ */

/**
 * Jedes Paar nennt, wo es im Markup entsteht, und welche Schwelle gilt.
 * `min` unterscheidet Fließtext (4,5) von großer Schrift und Umrissen (3,0).
 */
const PAIRS = [
  { fg: '--ink', bg: '--paper', min: AA_TEXT, where: 'body – Fließtext auf Grundfläche' },
  { fg: '--ink', bg: '--paper-2', min: AA_TEXT, where: 'Karten, Breadcrumb-Leiste' },
  { fg: '--ink', bg: '--paper-3', min: AA_TEXT, where: 'hervorgehobene Flächen' },
  { fg: '--ink', bg: '--white', min: AA_TEXT, where: 'Formularfelder, Tabellen' },
  { fg: '--ink-2', bg: '--paper', min: AA_TEXT, where: 'Absätze zweiter Ordnung' },
  { fg: '--ink-2', bg: '--paper-2', min: AA_TEXT, where: 'Kartentext' },
  { fg: '--ink-2', bg: '--white', min: AA_TEXT, where: 'Text in Eingabefeldern' },
  { fg: '--ink-3', bg: '--paper', min: AA_TEXT, where: 'Bildunterschriften, Meta-Zeilen' },
  { fg: '--ink-3', bg: '--paper-2', min: AA_TEXT, where: 'Meta-Zeilen auf Karten' },
  { fg: '--ink-3', bg: '--white', min: AA_TEXT, where: 'Platzhaltertext in Feldern' },
  { fg: '--ink-4', bg: '--paper', min: AA_TEXT, where: 'schwächste Textstufe' },
  { fg: '--ink-4', bg: '--paper-2', min: AA_TEXT, where: 'Meta-Zeilen auf Karten' },

  { fg: '--accent-text', bg: '--paper', min: AA_TEXT, where: 'Textlinks in Handlungsfarbe' },
  { fg: '--accent-text', bg: '--paper-2', min: AA_TEXT, where: 'Links auf Karten' },
  { fg: '--accent-text', bg: '--white', min: AA_TEXT, where: 'Links in hellen Kästen' },
  { fg: '--accent-text', bg: '--accent-tint', min: AA_TEXT, where: 'Hinweiskasten in Handlungsfarbe' },
  { fg: '--white', bg: '--accent', min: AA_TEXT, where: 'primärer Button' },
  { fg: '--white', bg: '--accent-2', min: AA_TEXT, where: 'primärer Button, gedrückt' },
  { fg: '--white', bg: '--brand', min: AA_TEXT, where: 'Text auf schwarzer Fläche' },
  { fg: '--white', bg: '--brand-2', min: AA_TEXT, where: 'Text auf dunkler Fläche' },
  { fg: '--white', bg: '--brand-3', min: AA_TEXT, where: 'Text auf Tiefschwarz' },

  { fg: '--on-dark', bg: '--brand', min: AA_TEXT, where: 'Fußbereich, Hero-Balken' },
  { fg: '--on-dark', bg: '--brand-3', min: AA_TEXT, where: 'Fußbereich unten' },
  { fg: '--on-dark-mute', bg: '--brand', min: AA_TEXT, where: 'Nebentext im Fußbereich' },
  { fg: '--on-dark-accent', bg: '--brand', min: AA_TEXT, where: 'Links im Fußbereich' },
  { fg: '--on-dark-accent', bg: '--brand-3', min: AA_TEXT, where: 'Links im dunklen Bereich' },

  { fg: '--ok', bg: '--ok-tint', min: AA_TEXT, where: 'Bestätigungskasten' },
  { fg: '--ok', bg: '--paper', min: AA_TEXT, where: 'Häkchen-Listen' },
  { fg: '--warn', bg: '--warn-tint', min: AA_TEXT, where: 'Achtungskasten' },
  { fg: '--warn', bg: '--paper', min: AA_TEXT, where: 'Achtungshinweis im Fließtext' },
  { fg: '--ink', bg: '--note-yellow', min: AA_TEXT, where: 'gelber Merkkasten' },
  { fg: '--ink', bg: '--brand-tint', min: AA_TEXT, where: 'getönte Fläche' },

  // Nicht-Text: Umrisse und Trennlinien müssen 3:1 gegen ihre Fläche
  // erreichen, sonst sind Eingabefelder für sehschwache Personen nicht
  // als Bedienelement erkennbar (WCAG 1.4.11).
  { fg: '--line-contrast', bg: '--paper', min: AA_NON_TEXT, where: 'Feldumrisse auf Grundfläche', nonText: true },
  { fg: '--line-contrast', bg: '--paper-2', min: AA_NON_TEXT, where: 'Upload-Fläche', nonText: true },
  { fg: '--line-contrast', bg: '--white', min: AA_NON_TEXT, where: 'Feldumrisse in Formularen', nonText: true },
  { fg: '--accent', bg: '--paper', min: AA_NON_TEXT, where: 'Fokusring auf Grundfläche', nonText: true },
  { fg: '--accent', bg: '--white', min: AA_NON_TEXT, where: 'Fokusring in Formularen', nonText: true },
];

/* ------------------------------------------------------------------ */
/* 2. Automatisch gefundene Paare                                      */
/* ------------------------------------------------------------------ */

/**
 * Sammelt Regeln als { selector, body }, auch innerhalb von @media.
 * Kein CSS-Parser als Abhängigkeit: Die Quellen stammen aus dem eigenen
 * Projekt und sind valide; Klammerzählen reicht dafür aus.
 */
function rules(source) {
  const out = [];
  let depth = 0;
  let start = -1;
  let selStart = 0;
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    if (c === '{') {
      depth += 1;
      if (depth <= 2) {
        start = i + 1;
        // Selektor ist alles zwischen dem letzten Blockende und dieser Klammer
        out.push({ selector: source.slice(selStart, i).trim().split('\n').pop().trim(), body: null, _start: start });
      }
    } else if (c === '}') {
      if (depth >= 1 && start !== -1) {
        const open = out[out.length - 1];
        if (open && open.body === null) open.body = source.slice(open._start, i);
      }
      depth -= 1;
      start = -1;
      selStart = i + 1;
    }
  }
  return out.filter((r) => r.body !== null && !r.selector.startsWith('@'));
}

/** Rückwärtskompatibler Zugriff nur auf die Rumpfteile. */
const declarationBlocks = (source) => rules(source).map((r) => r.body);

function varName(value) {
  const m = String(value).match(/var\(\s*(--[\w-]+)/);
  return m ? m[1] : null;
}

function collectCssSources() {
  const sources = [{ label: 'src/styles/global.css', code: css }];
  const dir = join(projectRoot, 'src');
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.astro')) {
        const src = readFileSync(full, 'utf8');
        for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
          sources.push({
            label: relative(projectRoot, full).split('\\').join('/'),
            code: m[1],
          });
        }
      }
    }
  };
  walk(dir);
  return sources;
}

const autoPairs = new Map();
for (const { label, code } of collectCssSources()) {
  for (const block of declarationBlocks(code)) {
    const fg = varName((block.match(/(?:^|[;{\s])color\s*:\s*([^;]+)/) ?? [])[1] ?? '');
    const bgRaw =
      (block.match(/(?:^|[;{\s])background-color\s*:\s*([^;]+)/) ?? [])[1] ??
      (block.match(/(?:^|[;{\s])background\s*:\s*([^;]+)/) ?? [])[1] ??
      '';
    const bg = varName(bgRaw);
    if (!fg || !bg || fg === bg) continue;
    if (!tokens.has(fg) || !tokens.has(bg)) continue;
    const key = `${fg}|${bg}`;
    if (!autoPairs.has(key)) autoPairs.set(key, { fg, bg, where: `automatisch: ${label}` });
  }
}

/* ------------------------------------------------------------------ */
/* Prüfen                                                              */
/* ------------------------------------------------------------------ */

const declared = new Set(PAIRS.map((p) => `${p.fg}|${p.bg}`));
const all = [
  ...PAIRS,
  ...[...autoPairs.values()].filter((p) => !declared.has(`${p.fg}|${p.bg}`)).map((p) => ({ ...p, min: AA_TEXT })),
];

report.stat(`${PAIRS.length} erklärte Paare, ${autoPairs.size} automatisch gefunden`);

let worst = { ratio: 99, label: '' };

for (const pair of all) {
  const fgValue = tokens.get(pair.fg);
  const bgValue = tokens.get(pair.bg);
  if (!fgValue || !bgValue) {
    report.error(
      `${pair.fg} auf ${pair.bg}`,
      'Token existiert nicht mehr in :root',
      'Paar aus PAIRS in scripts/seo/contrast.mjs entfernen oder Token wieder anlegen',
    );
    continue;
  }

  const value = Math.round(contrast(fgValue, bgValue) * 100) / 100;
  const label = `${pair.fg} (${fgValue}) auf ${pair.bg} (${bgValue})`;

  if (value < worst.ratio) worst = { ratio: value, label };

  if (value < pair.min) {
    report.error(
      `${label} – ${pair.where}`,
      `Kontrast ${value}:1, verlangt sind ${pair.min}:1`,
      pair.nonText
        ? 'Umriss- oder Linienfarbe dunkler wählen; die Markenfarbe selbst nicht ändern'
        : 'Textfarbe innerhalb derselben Farbfamilie abdunkeln (siehe --accent vs. --accent-text als Vorbild)',
    );
  } else if (value < pair.min + 0.3) {
    report.warn(
      `${label} – ${pair.where}`,
      `Kontrast ${value}:1 liegt nur knapp über der Grenze von ${pair.min}:1`,
      'Bei der nächsten Farbanpassung Reserve einplanen, damit AA nicht versehentlich gerissen wird',
    );
  }
}

report.stat(`schwächstes geprüftes Paar: ${worst.ratio}:1 – ${worst.label}`);

/* ------------------------------------------------------------------ */
/* 3. Regeln, die NUR die Textfarbe setzen                             */
/* ------------------------------------------------------------------ */
/**
 * Der häufigste unentdeckte Fehler: Eine Regel setzt `color`, der
 * Hintergrund kommt vom Container. Die Paarprüfung oben sieht solche
 * Fälle nicht.
 *
 * Angenommen wird die Grundfläche `--paper`, weil sie auf jeder Seite der
 * Hintergrund des Fließtexts ist. Selektoren in dunklen Bereichen werden
 * übersprungen, dort gelten andere Tokens (`--on-dark*`).
 *
 * Ergebnis ist bewusst eine WARNUNG, kein Fehler: Ob der Container
 * tatsächlich `--paper` trägt, kann diese Prüfung nicht wissen. Sie zeigt
 * die Stelle, entschieden wird redaktionell.
 */
const DARK_CONTEXT = /(section--brand|site-footer|stickybar|hero__label|\.on-dark|--brand\)|\bdark\b)/;

/** Große Schrift nach WCAG: ab 24 px, oder ab 18,66 px bei Fettschnitt. */
function isLargeText(body, selector) {
  const size = body.match(/font-size\s*:\s*([\d.]+)rem/);
  const bold = /font-weight\s*:\s*(bold|[6-9]\d\d)/.test(body);
  if (/(^|[\s,>])h1\b/.test(selector)) return true;
  if (!size) return /(^|[\s,>])h[12]\b/.test(selector);
  const px = Number(size[1]) * 16;
  return px >= 24 || (bold && px >= 18.66);
}

/**
 * Symbole und Marken tragen keinen Text. Für sie gilt 3:1 (WCAG 1.4.11),
 * nicht 4,5:1. Die Liste ist bewusst eng gehalten – im Zweifel wird die
 * strengere Schwelle angesetzt.
 */
const NON_TEXT_SELECTOR = /(::marker|::before|::after|__arrow|__icon|\bsvg\b|__bar|__mark|icon-mark|\bicon\b)/;

const seenColorOnly = new Set();
for (const { label, code } of collectCssSources()) {
  for (const rule of rules(code)) {
    if (DARK_CONTEXT.test(rule.selector) || DARK_CONTEXT.test(rule.body)) continue;
    if (/background(-color)?\s*:/.test(rule.body)) continue; // oben schon geprüft

    const fg = varName((rule.body.match(/(?:^|[;{\s])color\s*:\s*([^;]+)/) ?? [])[1] ?? '');
    if (!fg || !tokens.has(fg)) continue;
    if (fg.startsWith('--on-dark') || fg === '--white') continue; // gehören auf dunkle Flächen

    const nonText = NON_TEXT_SELECTOR.test(rule.selector);
    const min = nonText || isLargeText(rule.body, rule.selector) ? AA_LARGE : AA_TEXT;
    const value = Math.round(contrast(tokens.get(fg), tokens.get('--paper')) * 100) / 100;
    if (value >= min) continue;

    const key = `${label}|${rule.selector}|${fg}`;
    if (seenColorOnly.has(key)) continue;
    seenColorOnly.add(key);

    report.warn(
      `${label} – ${rule.selector}`,
      `${fg} ergibt auf --paper nur ${value}:1, für ${nonText ? 'Symbole' : min === AA_LARGE ? 'große Schrift' : 'Fließtext'} sind ${min}:1 nötig`,
      fg === '--accent'
        ? 'Für Text --accent-text verwenden. --accent ist die Flächenfarbe und für kleinen Text zu hell.'
        : 'Dunkleres Token wählen oder bestätigen, dass der Container eine hellere Fläche trägt',
    );
  }
}

finish(report);
