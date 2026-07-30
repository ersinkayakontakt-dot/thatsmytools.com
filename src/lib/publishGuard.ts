import type { District, Town, Service, Guide, CaseStudy } from '../data/types.ts';
import { districts } from '../data/districts.ts';
import { towns } from '../data/towns.ts';
import { services } from '../data/services.ts';
import { guides } from '../data/guides.ts';
import { cases } from '../data/cases.ts';

/**
 * PUBLISH GUARD
 * =============
 * Technische Absicherung gegen dünne Standortseiten und Doorway Pages.
 *
 * Eine Seite ist nur dann indexierbar, wenn
 *   a) `status === 'published'` gesetzt ist UND
 *   b) sie die inhaltlichen Mindestanforderungen erfüllt.
 *
 * Wer `status` auf 'published' setzt, ohne die Inhalte zu ergänzen, bekommt
 * beim Build eine Warnung und die Seite bleibt trotzdem noindex.
 * Damit lässt sich die Regel nicht versehentlich umgehen.
 */

export interface GuardResult {
  ok: boolean;
  /** Fehlende Anforderungen im Klartext. */
  missing: string[];
}

const MIN_INTRO_CHARS = 350;
const MIN_QUARTERS = 2;
const MIN_FAQ = 3;
const MIN_ACCESS_POINTS = 3;
const MIN_BUILDING_POINTS = 3;
const MIN_LOCATION_CHARS = 1800;

/** Prüft eine Bezirks- oder Ortsseite. */
export function checkLocation(loc: District | Town): GuardResult {
  const missing: string[] = [];
  const introChars = loc.intro.join(' ').length;
  const blockText = (loc.blocks ?? [])
    .flatMap((block) => [
      block.h,
      ...(block.p ?? []),
      ...(block.list ?? []),
      ...(block.steps ?? []).flatMap((step) => [step.title, step.text]),
      ...(block.table?.rows.flat() ?? []),
      block.note?.title ?? '',
      block.note?.text ?? '',
    ])
    .join(' ');
  const totalChars = [
    loc.answer,
    ...loc.intro,
    ...loc.buildings,
    ...loc.access,
    blockText,
    ...loc.faq.flatMap((item) => [item.q, item.a]),
  ].join(' ').length;

  if (loc.intro.length < 2) missing.push('eigene Einleitung mit mindestens 2 Absätzen');
  if (introChars < MIN_INTRO_CHARS) missing.push(`Einleitung zu kurz (${introChars} von ${MIN_INTRO_CHARS} Zeichen)`);
  if (loc.quarters.length < MIN_QUARTERS) missing.push(`mindestens ${MIN_QUARTERS} Ortsteile`);
  if (loc.buildings.length < MIN_BUILDING_POINTS) missing.push(`mindestens ${MIN_BUILDING_POINTS} Angaben zur Gebäudesituation`);
  if (loc.access.length < MIN_ACCESS_POINTS) missing.push(`mindestens ${MIN_ACCESS_POINTS} Angaben zu Zufahrt und Zugang`);
  if (loc.faq.length < MIN_FAQ) missing.push(`mindestens ${MIN_FAQ} eigene FAQ`);
  if (!loc.differentiator.trim()) missing.push('notierter Unterschied zu anderen Standortseiten');
  if (!loc.answer || loc.answer.length < 120) missing.push('direkte Antwort unter der H1 (mind. 120 Zeichen)');
  if (!loc.metaDescription || loc.metaDescription.length < 80) missing.push('eigene Meta Description (mind. 80 Zeichen)');
  if (loc.focusServices.length < 2) missing.push('mindestens 2 lokal passende Leistungen');
  if ((loc.blocks?.length ?? 0) < 2) missing.push('mindestens 2 eigenständige Inhaltsblöcke');
  if (totalChars < MIN_LOCATION_CHARS) {
    missing.push(`Gesamtinhalt zu kurz (${totalChars} von ${MIN_LOCATION_CHARS} Zeichen)`);
  }

  return { ok: missing.length === 0, missing };
}

/** Prüft eine Leistungsseite. */
export function checkService(svc: Service): GuardResult {
  const missing: string[] = [];
  if (!svc.answer || svc.answer.length < 150) missing.push('direkte Antwort unter der H1 (mind. 150 Zeichen)');
  if (svc.blocks.length < 3) missing.push('mindestens 3 Inhaltsblöcke');
  if (svc.faq.length < MIN_FAQ) missing.push(`mindestens ${MIN_FAQ} FAQ`);
  if (svc.priceFactors.length < 3) missing.push('mindestens 3 Preisfaktoren');
  if (svc.includes.length < 3) missing.push('mindestens 3 Leistungsbestandteile');
  if (!svc.metaDescription || svc.metaDescription.length < 80) missing.push('eigene Meta Description');
  return { ok: missing.length === 0, missing };
}

/** Prüft einen Ratgeber. */
export function checkGuide(g: Guide): GuardResult {
  const missing: string[] = [];
  if (!g.answer || g.answer.length < 150) missing.push('direkte Antwort unter der H1');
  if (g.blocks.length < 3) missing.push('mindestens 3 Inhaltsblöcke');
  if (g.faq.length < 2) missing.push('mindestens 2 FAQ');
  if (!g.metaDescription || g.metaDescription.length < 80) missing.push('eigene Meta Description');
  return { ok: missing.length === 0, missing };
}

/** Prüft einen Einsatzbericht. Muster sind nie indexierbar. */
export function checkCase(c: CaseStudy): GuardResult {
  const missing: string[] = [];
  if (!c.real) missing.push('kein echter, freigegebener Einsatz (real: false)');
  const placeholder = /\[[^\]]+\]/;
  const allText = [
    ...Object.values(c.facts),
    ...c.situation,
    ...c.result,
    c.learning,
    c.date,
  ].join(' ');
  if (placeholder.test(allText)) missing.push('enthält noch Platzhalter in eckigen Klammern');
  return { ok: missing.length === 0, missing };
}

/* ------------------------------------------------------------------ */
/* Öffentliche Helfer für Seiten und Sitemap                           */
/* ------------------------------------------------------------------ */

export function locationIsIndexable(loc: District | Town): boolean {
  return loc.status === 'published' && checkLocation(loc).ok;
}

export function serviceIsIndexable(svc: Service): boolean {
  return svc.status === 'published' && checkService(svc).ok;
}

export function guideIsIndexable(g: Guide): boolean {
  return g.status === 'published' && checkGuide(g).ok;
}

export function caseIsIndexable(c: CaseStudy): boolean {
  return c.status === 'published' && checkCase(c).ok;
}

/**
 * Sammelt alle Verstöße. Wird beim Build ausgegeben und von
 * scripts/content-audit.mjs genutzt.
 */
export function auditContent(): { level: 'error' | 'warn'; where: string; message: string }[] {
  const out: { level: 'error' | 'warn'; where: string; message: string }[] = [];

  for (const s of services) {
    const r = checkService(s);
    if (s.status === 'published' && !r.ok) {
      out.push({ level: 'error', where: `Leistung /${s.slug}/`, message: `als veröffentlicht markiert, aber unvollständig: ${r.missing.join('; ')}` });
    }
    if (s.status === 'draft' && r.ok) {
      out.push({ level: 'warn', where: `Leistung /${s.slug}/`, message: 'erfüllt alle Anforderungen und könnte veröffentlicht werden' });
    }
  }

  for (const loc of [...districts, ...towns]) {
    const r = checkLocation(loc);
    if (loc.status === 'published' && !r.ok) {
      out.push({ level: 'error', where: `Standort ${loc.name}`, message: `als veröffentlicht markiert, aber unvollständig: ${r.missing.join('; ')}` });
    }
    if (loc.status === 'draft' && r.ok) {
      out.push({ level: 'warn', where: `Standort ${loc.name}`, message: 'erfüllt alle Anforderungen und könnte veröffentlicht werden' });
    }
  }

  for (const g of guides) {
    const r = checkGuide(g);
    if (g.status === 'published' && !r.ok) {
      out.push({ level: 'error', where: `Ratgeber /${g.slug}/`, message: `als veröffentlicht markiert, aber unvollständig: ${r.missing.join('; ')}` });
    }
  }

  for (const c of cases) {
    const r = checkCase(c);
    if (c.status === 'published' && !r.ok) {
      out.push({ level: 'error', where: `Einsatzbericht /${c.slug}/`, message: `darf nicht veröffentlicht werden: ${r.missing.join('; ')}` });
    }
  }

  return out;
}

/** Alle indexierbaren URLs – Grundlage für Sitemap und IndexNow. */
export function indexableUrls(): { url: string; lastmod: string }[] {
  const urls: { url: string; lastmod: string }[] = [];

  // Explizite Änderungsdaten statt eines künstlichen "heute" bei jedem Build.
  // lastmod wird nur angefasst, wenn sich der sichtbare Hauptinhalt ändert.
  urls.push(
    { url: '/', lastmod: '2026-07-30' },
    { url: '/leistungen/', lastmod: '2026-07-29' },
    { url: '/berlin/', lastmod: '2026-07-30' },
    { url: '/brandenburg/', lastmod: '2026-07-29' },
    { url: '/kosten/', lastmod: '2026-07-30' },
    { url: '/hausverwaltungen-immobilienpartner/', lastmod: '2026-07-30' },
    { url: '/ratgeber/', lastmod: '2026-07-30' },
    { url: '/einsatzberichte/', lastmod: '2026-07-29' },
    { url: '/fragen/', lastmod: '2026-07-29' },
    { url: '/ueber-uns/', lastmod: '2026-07-30' },
    { url: '/kontakt/', lastmod: '2026-07-30' },
    { url: '/angebot-anfragen/', lastmod: '2026-07-30' },
    { url: '/impressum/', lastmod: '2026-07-30' },
    { url: '/datenschutz/', lastmod: '2026-07-30' },
  );

  for (const s of services) {
    if (serviceIsIndexable(s)) urls.push({ url: `/leistungen/${s.slug}/`, lastmod: s.updated });
  }
  for (const d of districts) {
    if (locationIsIndexable(d)) urls.push({ url: `/berlin/${d.slug}/`, lastmod: d.updated });
  }
  for (const t of towns) {
    if (locationIsIndexable(t)) urls.push({ url: `/brandenburg/${t.slug}/`, lastmod: t.updated });
  }
  for (const g of guides) {
    if (guideIsIndexable(g)) urls.push({ url: `/${g.hub}/${g.slug}/`, lastmod: g.updated });
  }
  for (const c of cases) {
    if (caseIsIndexable(c)) urls.push({ url: `/einsatzberichte/${c.slug}/`, lastmod: c.updated });
  }

  return urls;
}
