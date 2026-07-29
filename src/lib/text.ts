/**
 * Sehr kleines Inline-Markup für Fließtexte aus den Datendateien.
 * Unterstützt **fett** und [Linktext](/pfad/).
 *
 * Bewusst kein Markdown-Paket: Der Funktionsumfang ist absichtlich
 * winzig, und die Eingaben stammen ausschließlich aus dem Repository,
 * nicht von Nutzereingaben. Trotzdem wird zuerst HTML-escaped, damit
 * auch bei künftigen Datenquellen nichts durchrutscht.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function inline(text: string): string {
  let out = escapeHtml(text);
  // [Text](/pfad/) – nur interne Pfade und https-Links zulassen
  out = out.replace(/\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g, (_m, label, href) => {
    const external = href.startsWith('http');
    const attrs = external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${attrs}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

/** Kürzt einen Text auf eine maximale Länge an einer Wortgrenze. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + ' …';
}

/** Zählt Wörter – für die Prüfung der 40–100-Wörter-Regel bei Antworten. */
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/** Datum im deutschen Format, z. B. "29. Juli 2026". */
export function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso + 'T12:00:00Z');
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}
