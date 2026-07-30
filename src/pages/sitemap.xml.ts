import type { APIRoute } from 'astro';
import { indexableUrls } from '../lib/publishGuard';
import { site } from '../config/site';

/**
 * XML-Sitemap.
 *
 * Enthält ausschließlich Seiten, die den Publish Guard bestehen. Entwürfe,
 * Musterberichte, die Bestätigungsseite und die 404-Seite stehen nicht
 * darin. Eine Sitemap voller noindex-Seiten ist ein Qualitätssignal in
 * die falsche Richtung.
 *
 * Die Liste stammt aus derselben Funktion, die auch IndexNow speist.
 * Damit können Sitemap und IndexNow nicht auseinanderlaufen.
 */
export const GET: APIRoute = () => {
  const urls = indexableUrls();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${site.url}${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
