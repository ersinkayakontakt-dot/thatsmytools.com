// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Deployment-Entscheidung siehe docs/ARCHITEKTUR.md
 *
 * output: 'static'  -> reines HTML/CSS, läuft auf jedem Hosting (auch Hostinger Shared)
 * trailingSlash     -> genau eine kanonische URL-Form, keine Duplikate
 * format: 'directory' -> /leistungen/entruempelung-berlin/index.html
 */
export default defineConfig({
  site: 'https://schnellhelfer24.de',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    // Bilder werden bewusst nicht über einen externen Dienst geladen.
    domains: [],
    remotePatterns: [],
  },
  devToolbar: { enabled: false },
});
