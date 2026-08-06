/**
 * KONTRASTBERECHNUNG NACH WCAG 2.2
 * ================================
 *
 * Umsetzung von WCAG 2.2, Erfolgskriterium 1.4.3 (Kontrast, Minimum) und
 * 1.4.11 (Kontrast von Nicht-Text-Inhalten).
 *
 *   Fließtext              mindestens 4,5:1
 *   Große Schrift          mindestens 3,0:1
 *   (ab 24 px, oder ab 18,66 px bei fettem Schnitt)
 *   Bedienelemente,
 *   Umrisse, Fokusringe    mindestens 3,0:1
 *
 * Die Formel stammt unverändert aus der Spezifikation. Sie hier selbst zu
 * rechnen statt Lighthouse zu starten hat zwei Vorteile: Es braucht keinen
 * Browser-Download in der CI, und es prüft die Token-Paare direkt an der
 * Quelle statt nur die zufällig gerenderten Kombinationen einer Stichprobe.
 *
 * Was diese Prüfung NICHT ersetzt: Text auf Bildern, Verläufen oder
 * halbtransparenten Flächen. Diese Fälle müssen im Browser angesehen
 * werden – die Website vermeidet sie bewusst (siehe global.css).
 */

/** #rgb, #rrggbb oder rgb()/rgba() → [r, g, b] mit 0–255. */
export function parseColor(input) {
  const s = String(input).trim().toLowerCase();

  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    const h = hex[1];
    const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  }

  const rgb = s.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) return parts;
  }

  // Absicht: laut scheitern. Ein still zurückgegebenes Schwarz würde jedes
  // Kontrastproblem als "bestanden" durchwinken – genau der falsche Ausgang.
  throw new Error(`Farbwert nicht lesbar: ${input}`);
}

/** Relative Leuchtdichte nach WCAG 2.2. */
export function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier Farben, 1,0 bis 21,0. */
export function contrast(a, b) {
  const la = luminance(parseColor(a));
  const lb = luminance(parseColor(b));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const ratio = (a, b) => Math.round(contrast(a, b) * 100) / 100;

/**
 * Liest die :root-Tokens aus einer CSS-Datei.
 * Nur Farbwerte, alles andere wird übergangen.
 */
export function readTokens(css) {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!root) throw new Error('Kein :root-Block in der CSS-Datei gefunden.');
  const tokens = new Map();
  for (const m of root[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    const value = m[2].trim();
    if (/^(#[0-9a-fA-F]{3,6}|rgba?\()/.test(value)) tokens.set(`--${m[1]}`, value);
  }
  return tokens;
}
