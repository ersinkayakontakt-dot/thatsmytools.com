/**
 * SICHTBARKEIT INTERNER HINWEISE
 * ==============================
 *
 * Redaktions- und Betreiberhinweise ("Vor dem Livegang zu prüfen …")
 * richten sich an das Team, nicht an Besucherinnen und Besucher. Auf
 * Impressum und Datenschutz wäre so ein Kasten sogar schädlich: Er teilt
 * dem Publikum mit, dass die Pflichtangaben unfertig sind.
 *
 * Sichtbar sind sie deshalb nur
 *   - im Entwicklungsmodus (npm run dev) oder
 *   - wenn beim Build PUBLIC_SHOW_TODOS=1 gesetzt ist.
 *
 * Einzige Quelle für diese Bedingung. Wird von Todo.astro und von den
 * `legal-check`-Kästen in impressum.astro und datenschutz.astro genutzt –
 * damit die Regel nicht an vier Stellen auseinanderläuft.
 */
export const showInternalNotes =
  import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === '1';
