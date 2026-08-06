/**
 * ZUGRIFF AUF DIE SEO-SEITENKARTE AUS DEN PRÜFSKRIPTEN
 * ====================================================
 *
 * `src/data/seo-pages.ts` ist TypeScript, die Guards sind .mjs. Node führt
 * TypeScript seit 22.18 ohne Buildschritt aus (Type Stripping), deshalb
 * genügt ein direkter Import – kein zweiter Build, keine Kopie der Daten,
 * keine Gefahr, dass Prüfung und Website verschiedene Karten sehen.
 *
 * Warum das wichtig ist: Ein Guard, der gegen eine nachgebaute Kopie der
 * Daten prüft, prüft irgendwann etwas anderes als das, was ausgeliefert
 * wird. Genau dann meldet er "in Ordnung", während die Website kaputt ist.
 */
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { projectRoot } from './pages.mjs';

const mapUrl = pathToFileURL(join(projectRoot, 'src/data/seo-pages.ts')).href;

let cached = null;

export async function loadSeoMap() {
  if (cached) return cached;

  let mod;
  try {
    mod = await import(mapUrl);
  } catch (err) {
    console.error(
      'Die SEO-Seitenkarte konnte nicht geladen werden.\n' +
        'Node ab 22.18 wird benötigt (führt TypeScript direkt aus).\n' +
        `Aktuell: ${process.version}\n\n` +
        err.message,
    );
    process.exit(1);
  }

  const pages = mod.seoPages;
  cached = {
    pages,
    byId: new Map(pages.map((p) => [p.id, p])),
    byUrl: new Map(pages.map((p) => [p.url, p])),
    indexable: mod.indexableSeoPages,
    inSitemap: mod.sitemapSeoPages,
    moneyPages: [...mod.moneyPages],
    smallJobPages: [...mod.smallJobPages],
    mustOutrankSmallJobs: [...mod.mustOutrankSmallJobs],
    urlOf(id) {
      const page = this.byId.get(id);
      if (!page) throw new Error(`Unbekannte SEO-Seiten-ID in einer Prüfregel: "${id}"`);
      return page.url;
    },
  };
  return cached;
}
