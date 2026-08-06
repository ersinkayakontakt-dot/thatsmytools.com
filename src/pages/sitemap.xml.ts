import type { APIRoute } from 'astro';
import { indexableUrls, seoPageByUrl } from '../data/seo-pages';
import { imagesForPage } from '../data/images';
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
/** Entwertet XML-Sonderzeichen in Alt-Texten und Bildunterschriften. */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = () => {
  const urls = indexableUrls();

  /**
   * Bild-Erweiterung nach dem Google-Bildsitemap-Schema.
   *
   * Aufgenommen werden nur inhaltstragende Bilder aus der Registry –
   * keine Icons, kein Logo, keine Vorschaubilder. Ein Logo in der
   * Bildsitemap hilft niemandem und verwässert das Signal.
   *
   * Solange die Registry leer ist, entsteht schlicht keine zusätzliche
   * Auszeichnung und die Sitemap bleibt unverändert gültig.
   */
  const imageBlock = (path: string): string => {
    const page = seoPageByUrl(path);
    if (!page) return '';
    return imagesForPage(page.id)
      .map(
        (img) => `
    <image:image>
      <image:loc>${site.url}${img.src.src}</image:loc>${
        img.alt ? `\n      <image:title>${xml(img.alt)}</image:title>` : ''
      }${img.caption ? `\n      <image:caption>${xml(img.caption)}</image:caption>` : ''}
    </image:image>`,
      )
      .join('');
  };

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${site.url}${u.url}</loc>
    <lastmod>${u.lastmod}</lastmod>${imageBlock(u.url)}
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
