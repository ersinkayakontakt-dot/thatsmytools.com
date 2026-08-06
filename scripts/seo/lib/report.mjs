/**
 * GEMEINSAME BERICHTSAUSGABE FÜR ALLE SEO-GUARDS
 * ==============================================
 *
 * Alle Prüfungen unter scripts/seo/ schreiben in dieselbe Struktur, damit
 * `npm run seo:all` sie zusammenfassen kann und die Ausgabe überall gleich
 * aussieht.
 *
 * Drei Stufen, bewusst nur drei:
 *
 *   error  Blockiert den Produktions-Build. Etwas ist nachweislich kaputt
 *          oder verstößt gegen eine harte Regel aus dem SEO-System.
 *   warn   Erzeugt einen Bericht, blockiert nicht. Etwas ist auffällig,
 *          braucht aber eine redaktionelle Entscheidung. Eine Warnung darf
 *          NIEMALS zu einer automatischen Textänderung führen.
 *   info   Reine Beobachtung, keine Handlung nötig.
 *
 * Jeder Befund trägt einen konkreten Lösungsvorschlag (`fix`). Ein Befund
 * ohne Vorschlag ist für die Person, die ihn beheben soll, wertlos.
 */

const LEVELS = ['error', 'warn', 'info'];

export class Report {
  /** @param {string} name Anzeigename der Prüfung, z. B. "Linkgraph" */
  constructor(name) {
    this.name = name;
    /** @type {{level: string, where: string, message: string, fix?: string}[]} */
    this.findings = [];
    /** @type {string[]} Kennzahlen, die immer ausgegeben werden */
    this.stats = [];
  }

  add(level, where, message, fix) {
    if (!LEVELS.includes(level)) throw new Error(`Unbekannte Stufe: ${level}`);
    this.findings.push({ level, where, message, fix });
    return this;
  }

  error(where, message, fix) {
    return this.add('error', where, message, fix);
  }

  warn(where, message, fix) {
    return this.add('warn', where, message, fix);
  }

  info(where, message, fix) {
    return this.add('info', where, message, fix);
  }

  stat(line) {
    this.stats.push(line);
    return this;
  }

  count(level) {
    return this.findings.filter((f) => f.level === level).length;
  }

  get ok() {
    return this.count('error') === 0;
  }

  /** Menschenlesbare Ausgabe auf stdout. */
  print({ quiet = false } = {}) {
    const line = '='.repeat(66);
    console.log(`\n${line}\n${this.name}\n${line}`);
    for (const s of this.stats) console.log(`  ${s}`);
    if (this.stats.length) console.log('');

    for (const level of LEVELS) {
      const items = this.findings.filter((f) => f.level === level);
      if (!items.length) continue;
      if (quiet && level === 'info') continue;

      const label = { error: 'FEHLER', warn: 'WARNUNGEN', info: 'HINWEISE' }[level];
      console.log(`${label} (${items.length})`);
      for (const f of items) {
        console.log(`  • ${f.where}`);
        console.log(`      ${f.message}`);
        if (f.fix) console.log(`      → ${f.fix}`);
      }
      console.log('');
    }

    if (!this.findings.length) console.log('  Keine Auffälligkeiten.\n');
  }

  /** Maschinenlesbare Form – Grundlage für SEO-AUDIT-REPORT.md. */
  toJSON() {
    return {
      name: this.name,
      stats: this.stats,
      errors: this.count('error'),
      warnings: this.count('warn'),
      infos: this.count('info'),
      findings: this.findings,
    };
  }

  /** Markdown-Abschnitt für den Auditbericht. */
  toMarkdown() {
    const out = [`## ${this.name}`, ''];
    if (this.stats.length) {
      for (const s of this.stats) out.push(`- ${s}`);
      out.push('');
    }
    for (const level of LEVELS) {
      const items = this.findings.filter((f) => f.level === level);
      if (!items.length) continue;
      const label = { error: 'Fehler', warn: 'Warnungen', info: 'Hinweise' }[level];
      out.push(`### ${label} (${items.length})`, '');
      out.push('| Wo | Befund | Vorschlag |', '|---|---|---|');
      for (const f of items) {
        const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
        out.push(`| ${cell(f.where)} | ${cell(f.message)} | ${cell(f.fix) || '—'} |`);
      }
      out.push('');
    }
    if (!this.findings.length) out.push('Keine Auffälligkeiten.', '');
    return out.join('\n');
  }
}

/**
 * Beendet einen einzeln aufgerufenen Guard mit dem passenden Exitcode.
 * `seo:all` nutzt das nicht, sondern sammelt die Berichte selbst ein.
 */
export function finish(report) {
  report.print();
  process.exit(report.ok ? 0 : 1);
}
