import type { APIRoute } from 'astro';
import { site } from '../config/site';

/**
 * robots.txt
 *
 * Zu den KI-Crawlern (ausführlich in docs/KI-CRAWLER.md):
 *
 *  OAI-SearchBot  Sorgt dafür, dass die Website in ChatGPT Search
 *                 gefunden und als Quelle genannt werden kann.
 *                 -> ERLAUBT, weil genau das gewünscht ist.
 *
 *  ChatGPT-User   Ruft eine Seite ab, wenn eine Nutzerin oder ein Nutzer
 *                 im Gespräch danach fragt. Das ist ein Besuch im
 *                 Auftrag eines Menschen.
 *                 -> ERLAUBT.
 *
 *  GPTBot         Sammelt Daten für das Training von Modellen. Das ist
 *                 etwas völlig anderes als Auffindbarkeit und bringt
 *                 keinen unmittelbaren Nutzen für die Sichtbarkeit.
 *                 -> GESPERRT, bis der Betreiber ausdrücklich anders
 *                    entscheidet. Diese Entscheidung wird bewusst nicht
 *                    stillschweigend getroffen.
 *
 * Dieselbe Unterscheidung gilt sinngemäß für andere Anbieter:
 * Suchbots erlaubt, Trainingsbots gesperrt, solange nichts anderes
 * entschieden wurde.
 */
export const GET: APIRoute = () => {
  const body = `# robots.txt für ${site.domain}

# ------------------------------------------------------------------
# Klassische Suchmaschinen
# ------------------------------------------------------------------
User-agent: *
Allow: /

# Endpunkte und Laufzeitdaten gehören nicht in den Index
Disallow: /api/
Disallow: /anfrage-erhalten/

# Keine indexierbaren Such- oder Filterseiten, keine Parameter-URLs
Disallow: /*?fehler=
Disallow: /*?grund=

# ------------------------------------------------------------------
# KI-Suche und Antwortsysteme
# ------------------------------------------------------------------

# ChatGPT Search: soll die Seite finden und als Quelle nennen können
User-agent: OAI-SearchBot
Allow: /

# Abruf im Auftrag eines Menschen im Gespräch
User-agent: ChatGPT-User
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

# Claude: Suchindex und Abruf im Auftrag eines Menschen
User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# DuckDuckGo-Antworten
User-agent: DuckAssistBot
Allow: /

# Apple Intelligence / Siri
User-agent: Applebot-Extended
Allow: /

# ------------------------------------------------------------------
# Trainingsdaten-Sammler
# ------------------------------------------------------------------
# Bewusst gesperrt. Diese Bots verbessern die Auffindbarkeit nicht.
# Wenn die Inhalte für das Training freigegeben werden sollen, ist das
# eine eigene Entscheidung des Betreibers, siehe docs/KI-CRAWLER.md.

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: Bytespider
Disallow: /

# ------------------------------------------------------------------
# Sitemap
# ------------------------------------------------------------------
Sitemap: ${site.url}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
