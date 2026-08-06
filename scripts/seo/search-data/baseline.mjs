/**
 * EIGENE CTR-GRUNDLINIE
 * =====================
 *
 * Beantwortet die Frage: Wie oft wird auf DIESER Website geklickt, wenn
 * sie auf Position 7 steht?
 *
 * WARUM NICHT DIE BEKANNTEN BRANCHENWERTE
 * Die kursierenden CTR-Tabellen („Position 1 bekommt 31 %") stammen aus
 * anderen Branchen, anderen Ländern und aus Zeiten ohne KI-Antworten über
 * den Ergebnissen. Für eine lokale Dienstleistung in Berlin sagen sie
 * nichts aus. Gegen einen fremden Durchschnitt zu optimieren heißt, ein
 * Ziel zu verfolgen, das es hier nie gab.
 *
 * Die Grundlinie hier entsteht ausschließlich aus den eigenen Daten.
 *
 * GETRENNT NACH
 *   Positionsgruppe   1–3, 4–6, 7–10, 11–20, 21+
 *   Gerät             Telefon und Rechner klicken unterschiedlich
 *   Marke             Markensuchen klicken fast immer und würden die
 *                     Grundlinie sonst nach oben verzerren
 *
 * ZU WENIG DATEN
 * Eine Gruppe mit sehr wenigen Impressionen liefert keine belastbare
 * Grundlinie. Solche Gruppen werden als `confidence: 'niedrig'` markiert
 * und im Opportunity-Score abgewertet, statt sie stillschweigend
 * mitzurechnen.
 */
import { isBrandQuery } from './parse.mjs';

/** Positionsgruppen. Feiner zu unterteilen bringt bei dieser Datenmenge nichts. */
export const POSITION_BUCKETS = [
  { id: '1-3', min: 1, max: 3.5 },
  { id: '4-6', min: 3.5, max: 6.5 },
  { id: '7-10', min: 6.5, max: 10.5 },
  { id: '11-20', min: 10.5, max: 20.5 },
  { id: '21+', min: 20.5, max: Infinity },
];

export function bucketFor(position) {
  return POSITION_BUCKETS.find((b) => position >= b.min && position < b.max)?.id ?? '21+';
}

/** Ab so vielen Impressionen gilt eine Gruppe als belastbar. */
const MIN_IMPRESSIONS_HIGH = 1000;
const MIN_IMPRESSIONS_MEDIUM = 200;

function confidenceFor(impressions) {
  if (impressions >= MIN_IMPRESSIONS_HIGH) return 'hoch';
  if (impressions >= MIN_IMPRESSIONS_MEDIUM) return 'mittel';
  return 'niedrig';
}

/**
 * Baut die Grundlinie aus Zeilen mit Position, Impressionen und Klicks.
 *
 * @param {{query?: string, device?: string, position: number, clicks: number, impressions: number}[]} rows
 */
export function buildBaseline(rows) {
  /** @type {Map<string, {clicks: number, impressions: number}>} */
  const groups = new Map();

  const keyOf = (bucket, device, brand) => `${bucket}|${device}|${brand ? 'marke' : 'nicht-marke'}`;

  for (const row of rows) {
    if (!row.impressions) continue;
    const bucket = bucketFor(row.position ?? 99);
    const device = (row.device || 'alle').toLowerCase();
    const brand = isBrandQuery(row.query);

    // Jede Zeile fließt in die feine Gruppe UND in eine Gruppe ohne
    // Gerätetrennung. Letztere trägt, wenn der Export keine Geräte enthält.
    for (const dev of new Set([device, 'alle'])) {
      const key = keyOf(bucket, dev, brand);
      const g = groups.get(key) ?? { clicks: 0, impressions: 0 };
      g.clicks += row.clicks ?? 0;
      g.impressions += row.impressions;
      groups.set(key, g);
    }
  }

  const table = new Map();
  for (const [key, g] of groups) {
    table.set(key, {
      ctr: g.impressions ? g.clicks / g.impressions : 0,
      impressions: g.impressions,
      clicks: g.clicks,
      confidence: confidenceFor(g.impressions),
    });
  }

  return {
    table,

    /**
     * Erwartete CTR für eine Zeile.
     * Fällt schrittweise auf gröbere Gruppen zurück, wenn die feine Gruppe
     * fehlt – und meldet dabei, wie belastbar der Wert ist.
     */
    expected(row) {
      const bucket = bucketFor(row.position ?? 99);
      const device = (row.device || 'alle').toLowerCase();
      const brand = isBrandQuery(row.query);

      const candidates = [keyOf(bucket, device, brand), keyOf(bucket, 'alle', brand)];

      for (const key of candidates) {
        const hit = table.get(key);
        if (hit && hit.impressions >= MIN_IMPRESSIONS_MEDIUM) return hit;
      }
      // Nichts Belastbares gefunden: den groben Wert zurückgeben, aber
      // ausdrücklich als unsicher gekennzeichnet.
      const fallback = table.get(keyOf(bucket, 'alle', brand));
      return fallback ?? { ctr: 0, impressions: 0, clicks: 0, confidence: 'niedrig' };
    },

    /** Lesbare Fassung für den Bericht. */
    describe() {
      return [...table.entries()]
        .filter(([key]) => key.includes('|alle|'))
        .sort((a, b) => b[1].impressions - a[1].impressions)
        .map(([key, v]) => {
          const [bucket, , brand] = key.split('|');
          return {
            positionsgruppe: bucket,
            art: brand,
            ctr: Math.round(v.ctr * 10000) / 100,
            impressionen: v.impressions,
            klicks: v.clicks,
            datenvertrauen: v.confidence,
          };
        });
    },
  };
}
