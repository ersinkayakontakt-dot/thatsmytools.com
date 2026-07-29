import type { Review } from './types.ts';

/**
 * BEWERTUNGEN
 * ===========
 *
 * NICHT VERHANDELBAR: Hier stehen ausschließlich echte Bewertungen, die
 * öffentlich überprüfbar sind. Die Liste ist leer, bis echte Bewertungen
 * mit Quelle eingetragen wurden.
 *
 * Solange sie leer ist:
 *   - erscheint auf der Website KEIN Bewertungsbereich
 *   - wird KEIN AggregateRating in die strukturierten Daten geschrieben
 *   - werden keine Sterne, Zahlen oder Zitate angezeigt
 *
 * SO WERDEN BEWERTUNGEN ERGÄNZT:
 *   1. Nur Bewertungen übernehmen, die auf einer öffentlichen Plattform
 *      (Google-Unternehmensprofil, Bing Places, ProvenExpert o. Ä.) stehen
 *      und dort nachlesbar sind.
 *   2. `sourceUrl` muss zur Bewertungsübersicht führen, damit sie prüfbar ist.
 *   3. Autorennamen so übernehmen, wie sie öffentlich stehen. Keine
 *      Vollnamen ergänzen, die dort nicht stehen.
 *   4. Text nicht kürzen, glätten oder umformulieren. Auszüge kennzeichnen.
 *   5. Zusätzlich in src/config/site.ts `ratings.verified: true` setzen und
 *      ratingValue/reviewCount aus der Quelle übernehmen. Erst dann wird
 *      AggregateRating ausgegeben.
 *
 * Google verlangt für Rich Results, dass ausgezeichnete Bewertungen auch
 * sichtbar auf der Seite stehen. Beides ist hier technisch aneinander
 * gekoppelt: keine sichtbare Bewertung, kein Schema.
 */

export const reviews: Review[] = [
  // Beispiel für die spätere Struktur (auskommentiert, damit nichts
  // versehentlich als echte Bewertung ausgespielt wird):
  //
  // {
  //   author: 'Vorname N.',           // exakt wie öffentlich sichtbar
  //   rating: 5,
  //   text: 'Originaltext der Bewertung, unverändert.',
  //   source: 'Google-Unternehmensprofil',
  //   sourceUrl: 'https://…',
  //   date: '2026-03-14',
  //   serviceSlug: 'entruempelung-berlin',
  // },
];

export const hasReviews = reviews.length > 0;

export function reviewsForService(slug: string): Review[] {
  return reviews.filter((r) => r.serviceSlug === slug);
}
