/**
 * EXPORTDATEIEN AUS SEARCH CONSOLE UND BING EINLESEN
 * ==================================================
 *
 * Beide Werkzeuge exportieren CSV, aber nicht dasselbe CSV. Diese Datei
 * bringt beides auf eine gemeinsame Form, damit die Auswertung nur noch
 * eine Datenstruktur kennen muss.
 *
 * WAS HIER BERÜCKSICHTIGT WERDEN MUSS – und was ohne diese Behandlung
 * still falsche Zahlen ergäbe:
 *
 *   Sprache der Kopfzeile   Search Console exportiert in der Sprache der
 *                           Oberfläche. „Häufigste Suchanfragen" oder
 *                           „Top queries", je nach Konto.
 *   Dezimaltrennzeichen     Deutsche Exporte schreiben „3,4" für 3,4 –
 *                           `parseFloat('3,4')` ergibt 3. Ein Viertel des
 *                           Werts, ohne Fehlermeldung.
 *   Tausenderpunkt          „1.234" sind 1234, nicht 1,234.
 *   Prozentwerte            CTR steht als „4,2 %", nicht als 0,042.
 *   Trennzeichen            Komma oder Semikolon, je nach Gebietsschema.
 *   BOM                     Excel-freundliche Exporte beginnen mit ﻿,
 *                           was die erste Spaltenüberschrift unbrauchbar
 *                           macht.
 *   Anführungszeichen       Suchanfragen können Kommas enthalten.
 *
 * Eine unbekannte Kopfzeile führt bewusst zu einem Abbruch mit Klartext –
 * nicht zu stillen Nullwerten. Eine Auswertung auf halb erkannten Daten
 * ist schlimmer als keine Auswertung.
 */

/** Spaltenüberschriften, wie sie in echten Exporten vorkommen. */
const COLUMNS = {
  query: ['query', 'queries', 'top queries', 'suchanfrage', 'suchanfragen', 'häufigste suchanfragen', 'search query'],
  page: ['page', 'pages', 'top pages', 'seite', 'seiten', 'häufigste seiten', 'url'],
  country: ['country', 'countries', 'land', 'länder'],
  device: ['device', 'devices', 'gerät', 'geräte'],
  date: ['date', 'datum'],
  clicks: ['clicks', 'klicks'],
  impressions: ['impressions', 'impressionen'],
  ctr: ['ctr', 'click-through-rate', 'klickrate'],
  position: ['position', 'average position', 'durchschnittliche position', 'avg position', 'avg. position'],
};

/** Ordnet eine Kopfzeilenzelle einem bekannten Feld zu. */
function fieldFor(header) {
  const norm = header
    .replace(/^﻿/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  for (const [field, names] of Object.entries(COLUMNS)) {
    if (names.includes(norm)) return field;
  }
  return null;
}

/** Erkennt das Trennzeichen an der Kopfzeile. */
function detectDelimiter(line) {
  const counts = { ',': 0, ';': 0, '\t': 0 };
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch in counts) counts[ch] += 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

/** Zerlegt eine CSV-Zeile unter Beachtung von Anführungszeichen. */
function splitLine(line, delimiter) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      // Verdoppeltes Anführungszeichen innerhalb eines Feldes
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

/**
 * Wandelt einen Zahlwert aus dem Export in eine Zahl.
 *
 * Der schwierige Teil ist die Unterscheidung zwischen deutschem und
 * englischem Format: „1.234" sind im deutschen Export 1234, im englischen
 * 1,234. Entschieden wird an der Stellenzahl nach dem letzten Trennzeichen –
 * genau drei Stellen sprechen für einen Tausendertrenner.
 */
export function toNumber(raw) {
  if (raw === undefined || raw === null) return 0;
  let s = String(raw).trim().replace(/%/g, '').replace(/\s/g, '');
  if (!s) return 0;

  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');

  /**
   * Ein einzelner Trenner mit genau drei Stellen dahinter ist mehrdeutig:
   * „1,234" sind englisch 1234, deutsch 1,234.
   *
   * Entschieden wird an der Stelle DAVOR. Ein Tausendertrennzeichen steht
   * nie hinter einer führenden Null – „0,042" ist immer ein Dezimalwert,
   * „1.234" dagegen sind Tausend­zweihundertvierunddreißig.
   *
   * Ohne diese Zusatzbedingung wurde eine CTR von 0,042 als 42 gelesen –
   * das Tausendfache. Der Fehler fiel nur auf, weil die Selbstprüfung
   * genau diesen Fall enthält.
   */
  const looksLikeThousands = (sep) => {
    const before = s.slice(0, s.lastIndexOf(sep));
    const after = s.slice(s.lastIndexOf(sep) + 1);
    return after.length === 3 && /^\d{1,3}$/.test(before) && !before.startsWith('0');
  };

  if (lastComma > -1 && lastDot > -1) {
    // Beide vorhanden: das hintere ist das Dezimaltrennzeichen.
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (lastComma > -1) {
    s = looksLikeThousands(',') ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (lastDot > -1) {
    if (looksLikeThousands('.')) s = s.replace(/\./g, '');
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** CTR als Anteil (0 bis 1), egal ob im Export „4,2 %" oder „0,042" stand. */
export function toRate(raw) {
  const hadPercent = String(raw ?? '').includes('%');
  const n = toNumber(raw);
  if (hadPercent) return n / 100;
  // Ohne Prozentzeichen: Werte über 1 sind mit Sicherheit Prozentangaben.
  return n > 1 ? n / 100 : n;
}

/**
 * Liest eine Exportdatei.
 *
 * @param {string} text  Dateiinhalt
 * @param {string} label Dateiname, nur für Fehlermeldungen
 * @returns {{dimension: string, rows: object[]}}
 */
export function parseExport(text, label) {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new Error(`${label}: Datei enthält keine Datenzeilen.`);
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitLine(lines[0], delimiter);
  const mapped = headers.map(fieldFor);

  const known = mapped.filter(Boolean);
  if (!known.includes('impressions') && !known.includes('clicks')) {
    throw new Error(
      `${label}: Kopfzeile nicht erkannt.\n` +
        `  gefunden: ${headers.join(' | ')}\n` +
        '  erwartet werden Spalten für Klicks und Impressionen.\n' +
        '  Falls der Export anders heißt: COLUMNS in scripts/seo/search-data/parse.mjs ergänzen.',
    );
  }

  /**
   * Die Hauptdimension ist die erste erkannte Spalte, die kein Messwert
   * ist. Search Console exportiert je Dimension eine eigene Datei –
   * „Suchanfragen.csv", „Seiten.csv" und so weiter.
   */
  const metrics = new Set(['clicks', 'impressions', 'ctr', 'position']);
  const dimension = mapped.find((m) => m && !metrics.has(m)) ?? 'unbekannt';

  const rows = [];
  for (const line of lines.slice(1)) {
    const cells = splitLine(line, delimiter);
    const row = {};
    mapped.forEach((field, i) => {
      if (!field) return;
      const raw = cells[i];
      if (field === 'ctr') row.ctr = toRate(raw);
      else if (metrics.has(field)) row[field] = toNumber(raw);
      else row[field] = String(raw ?? '').trim();
    });

    if (!row[dimension]) continue;

    // CTR nachrechnen, wenn sie fehlt. Der Export lässt sie manchmal weg.
    if (row.ctr === undefined && row.impressions) row.ctr = row.clicks / row.impressions;

    rows.push(row);
  }

  return { dimension, rows };
}

/** Normalisiert eine Seiten-URL auf den Pfad, wie ihn die Seitenkarte kennt. */
export function toPath(url) {
  if (!url) return '';
  const path = String(url).replace(/^https?:\/\/[^/]+/, '');
  const clean = path.split('#')[0].split('?')[0];
  if (!clean) return '/';
  return clean.endsWith('/') || clean.includes('.') ? clean : `${clean}/`;
}

/**
 * Marken-Suchanfragen erkennen.
 *
 * Wichtig für die CTR-Grundlinie: Wer nach dem Firmennamen sucht, klickt
 * fast immer. Marken- und Nicht-Marken-Anfragen in einen Topf zu werfen
 * verschiebt die Grundlinie so weit nach oben, dass jede normale Seite
 * unterdurchschnittlich aussieht.
 */
const BRAND_PATTERN = /schnellhelfer|schnell\s*helfer\s*24/i;
export const isBrandQuery = (query) => BRAND_PATTERN.test(String(query ?? ''));
