/**
 * Selbsttest Nachfrageregister, Übergabe-Einstieg und Betriebsbereich (GROW-2026-01/02).
 *
 *   npm run audit:demand:selftest
 *
 * 1. Listenabgleich: src/data/requestSignals.ts gegen public/api/lib/nachfrage.php
 * 2. Einheitsfälle in PHP (scripts/demand-selftest.php)
 * 3. Integration mit lokalem PHP-Server, temporärer Ablage und Loopback-SMTP:
 *    Anfrage absenden, Registereintrag ohne Kontaktdaten, Betriebsbereich mit
 *    Anmeldung, Sperre, CSRF, Ergebnis, Verzeichnis und CSV.
 *
 * ALLE DATEN SIND ERFUNDEN. Es wird keine Mail nach außen gesendet.
 */
import { createServer } from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { handoverItems, openQuestions } from '../src/data/requestSignals.ts';

const phpCandidate = ['php', join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe/php.exe')].find((p) => spawnSync(p, ['-r', 'echo 1;']).status === 0);
assert.ok(phpCandidate, 'PHP 8 required');
const php = spawnSync(phpCandidate, ['-r', 'echo PHP_BINARY;'], { encoding: 'utf8' }).stdout.trim();
// Die Erweiterungsschalter gelten für die Windows-PHP-Installation (winget). Unter Linux sind
// mbstring und fileinfo üblicherweise eingebaut; dort würden die Schalter PHP abbrechen lassen.
const phpArgs = process.platform === 'win32' ? ['-d', 'extension_dir=' + join(dirname(php), 'ext'), '-d', 'extension=mbstring', '-d', 'extension=fileinfo'] : [];
const root = resolve(import.meta.dirname, '..');
let passed = 0;

/* 1. Listenabgleich ------------------------------------------------------ */
const dump = spawnSync(php, [...phpArgs, '-r', `require ${JSON.stringify(join(root, 'public/api/lib/nachfrage.php'))}; echo json_encode(['a'=>SH24_ANFORDERUNGEN,'o'=>SH24_OFFEN], JSON_UNESCAPED_UNICODE);`], { encoding: 'utf8' });
assert.equal(dump.status, 0, dump.stderr);
const lists = JSON.parse(dump.stdout);
assert.deepEqual(Object.keys(lists.a), handoverItems.map((i) => i.key), 'Anforderungs-Schlüssel TS/PHP');
for (const item of handoverItems) {
  assert.deepEqual(lists.a[item.key], [item.label, item.responsibility], 'Anforderung ' + item.key);
}
assert.deepEqual(lists.o, Object.fromEntries(openQuestions.map((q) => [q.key, q.label])), 'Offene Fragen TS/PHP');
passed++;

/* 2. Einheitsfälle ------------------------------------------------------- */
const unit = spawnSync(php, [...phpArgs, join(root, 'scripts/demand-selftest.php')], { encoding: 'utf8' });
assert.equal(unit.status, 0, unit.stderr + unit.stdout);
process.stdout.write(unit.stdout);
passed++;

/* 3. Integration --------------------------------------------------------- */
const dir = mkdtempSync(join(tmpdir(), 'sh24-demand-int-'));
const web = join(dir, 'site');
mkdirSync(web);
cpSync(join(root, 'public/api'), join(web, 'api'), { recursive: true, filter: (p) => !p.includes('_storage') && !p.endsWith('config.local.php') });
const storage = join(dir, 'private');
let mailCount = 0;
let lastMail = '';
const smtp = createServer((socket) => {
  socket.on('error', () => {});
  socket.setEncoding('utf8');
  socket.write('220 local-test\r\n');
  let buffer = '', data = false, auth = 0, body = '';
  socket.on('data', (chunk) => {
    buffer += chunk;
    let n;
    while ((n = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, n);
      buffer = buffer.slice(n + 2);
      if (data) { if (line === '.') { data = false; mailCount++; const parts = body.split('\n\n'); const head = parts.shift(); lastMail = /base64/i.test(head) ? Buffer.from(parts.join('').replace(/\s+/g, ''), 'base64').toString('utf8').replace(/\r\n/g, '\n') : body; body = ''; socket.write('250 saved\r\n'); } else body += line + '\n'; continue; }
      if (auth) { socket.write(auth++ === 1 ? '334 password\r\n' : '235 ok\r\n'); if (auth === 3) auth = 0; continue; }
      if (line.startsWith('EHLO')) socket.write('250-local\r\n250 AUTH LOGIN\r\n');
      else if (line === 'AUTH LOGIN') { auth = 1; socket.write('334 username\r\n'); }
      else if (line === 'DATA') { data = true; socket.write('354 send\r\n'); }
      else if (line === 'QUIT') socket.end('221 bye\r\n');
      else socket.write('250 ok\r\n');
    }
  });
});
await new Promise((r) => smtp.listen(0, '127.0.0.1', r));
const probe = createServer();
await new Promise((r) => probe.listen(0, '127.0.0.1', r));
const port = probe.address().port;
await new Promise((r) => probe.close(r));

const password = 'erfundenes-test-passwort';
const hash = spawnSync(php, ['-r', `echo password_hash(${JSON.stringify(password)}, PASSWORD_DEFAULT);`], { encoding: 'utf8' }).stdout.trim();
const config = {
  recipient: 'recipient@example.test', from: 'sender@example.test', smtpUser: 'sender@example.test', smtpPass: 'synthetic-test-only',
  smtpHost: '127.0.0.1', smtpPort: smtp.address().port, smtpSecure: 'none', smtpTimeout: 2, storageDir: storage,
  siteUrl: 'http://127.0.0.1:' + port, rateMax: 100, minFillMs: 0,
  betriebPasswortHash: hash, betriebGeheimnis: 'e'.repeat(64), betriebCookieSecure: false,
};
const writeConfig = () => writeFileSync(join(web, 'api/config.local.php'), "<?php return json_decode(base64_decode('" + Buffer.from(JSON.stringify(config)).toString('base64') + "'),true);");
writeConfig();
const server = spawn(php, [...phpArgs, '-S', '127.0.0.1:' + port, '-t', web], { stdio: 'ignore' });
const base = config.siteUrl + '/api/';

try {
  for (let i = 0; i < 50; i++) { try { await fetch(base + 'anfrage.php'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }

  const send = async (overrides = {}, arrays = {}) => {
    const form = new FormData();
    const values = { leistung: 'Wohnungsauflösung', plz: '10969', ort: 'ERFUNDEN-Ort', objektart: '3-Zimmer-Wohnung', umfang: 'Vollständige Wohnung', anlass: 'Neuvermietung', etage: '2. Stock', aufzug: 'Nein', zeitraum: 'Im nächsten Monat', stichtag: '2030-01-15', name: 'ERFUNDEN Testperson', telefon: '0309999999', mail: 'erfunden@example.test', kontaktart: 'Telefon', datenschutz: 'ja', beschreibung: 'ERFUNDEN Freitext mit Adresse Teststraße 9', gestartet: String(Date.now() - 10000), ...overrides };
    for (const [k, v] of Object.entries(values)) form.set(k, v);
    for (const [k, list] of Object.entries(arrays)) for (const v of list) form.append(k, v);
    return fetch(base + 'anfrage.php', { method: 'POST', body: form, redirect: 'manual' });
  };
  const ledger = () => readdirSync(join(storage, 'nachfrage')).filter((f) => f.startsWith('register-')).flatMap((f) => readFileSync(join(storage, 'nachfrage', f), 'utf8').trim().split('\n').map((l) => JSON.parse(l)));
  const refOf = (r) => new URL(r.headers.get('location')).searchParams.get('ref');

  // Übergabe-Anfrage
  let r = await send({ vorhaben: 'uebergabe' }, { 'anforderungen[]': ['streichen', 'geraeumt', 'erfunden-boese'], 'offen[]': ['kosten', 'boese'], 'zusatzleistungen[]': ['Reinigung'] });
  assert.equal(r.status, 303, await r.text());
  const ref1 = refOf(r);
  assert.match(ref1, /^SH-\d{6}-[A-F0-9]{5}$/);
  let rows = ledger();
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].anforderungen, ['geraeumt', 'streichen'], 'Unbekannte Anforderung verworfen');
  assert.deepEqual(rows[0].offen, ['kosten']);
  assert.equal(rows[0].vorhaben, 'uebergabe');
  const ledgerText = readFileSync(join(storage, 'nachfrage', readdirSync(join(storage, 'nachfrage')).find((f) => f.startsWith('register-'))), 'utf8');
  for (const pii of ['ERFUNDEN', '0309999999', 'example.test', 'Teststraße', '10969', '2030-01-15']) assert.ok(!ledgerText.includes(pii), 'Register enthält ' + pii);
  assert.match(lastMail, /Übergabe zum festen Termin/);
  assert.match(lastMail, /Mit Fachbetrieb abstimmen:\n {2}- Wände oder Decken streichen/);
  assert.match(lastMail, /Vor der Entscheidung offen/);
  const stored = JSON.parse(readFileSync(join(storage, 'anfragen', readdirSync(join(storage, 'anfragen')).find((f) => f.includes(ref1))), 'utf8'));
  assert.deepEqual(stored.anforderungen, ['geraeumt', 'streichen']);
  passed++;

  // Ohne Übergabe-Häkchen werden Anforderungen verworfen.
  r = await send({}, { 'anforderungen[]': ['streichen'] });
  assert.equal(r.status, 303);
  const ref2 = refOf(r);
  rows = ledger();
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[1].anforderungen, []);
  assert.equal(rows[1].vorhaben, '');
  passed++;

  // Betriebsbereich: ohne Anmeldung keine Daten, noindex.
  r = await fetch(base + 'betrieb.php');
  let html = await r.text();
  assert.equal(r.status, 200);
  assert.match(r.headers.get('x-robots-tag') || '', /noindex/);
  assert.ok(html.includes('Passwort') && !html.includes(ref1), 'Ohne Anmeldung keine Referenzen');
  r = await fetch(base + 'betrieb.php?v=export');
  assert.ok(!(await r.text()).includes('Häufigkeit'), 'Export ohne Anmeldung gesperrt');
  r = await fetch(base + 'betrieb.php', { method: 'POST', body: new URLSearchParams({ aktion: 'ergebnis', ref: ref1, status: 'auftrag' }), redirect: 'manual' });
  assert.equal(r.status, 403, 'Schreiben ohne Anmeldung');
  passed++;

  // Falsches Passwort, dann richtiges.
  r = await fetch(base + 'betrieb.php', { method: 'POST', body: new URLSearchParams({ aktion: 'login', passwort: 'falsch' }), redirect: 'manual' });
  assert.equal(r.status, 403);
  r = await fetch(base + 'betrieb.php', { method: 'POST', body: new URLSearchParams({ aktion: 'login', passwort: password }), redirect: 'manual' });
  assert.equal(r.status, 303);
  const setCookie = r.headers.get('set-cookie') || '';
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Strict/i);
  const cookie = setCookie.split(';')[0];
  r = await fetch(base + 'betrieb.php', { headers: { cookie } });
  html = await r.text();
  assert.ok(html.includes(ref1) && html.includes(ref2), 'Liste zeigt Referenzen');
  assert.ok(!html.includes('ERFUNDEN') && !html.includes('0309999999'), 'Liste zeigt keine Kontaktdaten');
  const csrf = html.match(/name="csrf" value="([a-f0-9]{64})"/)[1];
  passed++;

  // Manipuliertes Cookie und fehlendes CSRF.
  r = await fetch(base + 'betrieb.php', { headers: { cookie: cookie.replace(/.$/, (c) => (c === '0' ? '1' : '0')) } });
  assert.ok(!(await r.text()).includes(ref1), 'Manipuliertes Cookie abgewiesen');
  r = await fetch(base + 'betrieb.php', { method: 'POST', headers: { cookie }, body: new URLSearchParams({ aktion: 'ergebnis', ref: ref1, status: 'auftrag' }), redirect: 'manual' });
  assert.equal(r.status, 403, 'Ohne CSRF-Token abgewiesen');
  passed++;

  // Ergebnis speichern, Verzeichnis und CSV.
  const body = new URLSearchParams({ aktion: 'ergebnis', csrf, ref: ref1, status: 'auftrag', wert: '1500-5000', grund: '' });
  body.append('rueckfrage[]', 'termin');
  r = await fetch(base + 'betrieb.php', { method: 'POST', headers: { cookie }, body, redirect: 'manual' });
  assert.equal(r.status, 303);
  r = await fetch(base + 'betrieb.php', { method: 'POST', headers: { cookie }, body: new URLSearchParams({ aktion: 'ergebnis', csrf, ref: ref2, status: 'abgesagt-wir', grund: 'nicht-im-angebot', luecke: 'Fliesen' }), redirect: 'manual' });
  assert.equal(r.status, 303);
  r = await fetch(base + 'betrieb.php', { method: 'POST', headers: { cookie }, body: new URLSearchParams({ aktion: 'ergebnis', csrf, ref: 'SH-999999-ZZZZZ', status: 'auftrag' }), redirect: 'manual' });
  assert.equal(r.status, 422, 'Ungültige Referenz');
  r = await fetch(base + 'betrieb.php?v=verzeichnis', { headers: { cookie } });
  html = await r.text();
  assert.ok(html.includes('Nachfrageverzeichnis') && html.includes('fliesen') && html.includes('Übergabe-Einstieg'), 'Verzeichnis zeigt Lücke und Vergleich');
  assert.ok(html.includes('Kleine Datenbasis'), 'Hinweis auf kleine Datenbasis');
  r = await fetch(base + 'betrieb.php?v=export', { headers: { cookie } });
  const csv = await r.text();
  assert.match(r.headers.get('content-type') || '', /text\/csv/);
  assert.ok(csv.includes('Häufigkeit') && csv.includes('Wände oder Decken streichen') && !csv.includes('SH-'), 'CSV ohne Referenzen');
  passed++;

  // Nicht eingerichtet: ohne Geheimnis kein Zugang.
  config.betriebGeheimnis = '';
  writeConfig();
  r = await fetch(base + 'betrieb.php', { headers: { cookie } });
  assert.equal(r.status, 503);
  passed++;

  // Anmeldesperre nach fünf Fehlversuchen.
  config.betriebGeheimnis = 'e'.repeat(64);
  writeConfig();
  for (let i = 0; i < 4; i++) await fetch(base + 'betrieb.php', { method: 'POST', body: new URLSearchParams({ aktion: 'login', passwort: 'falsch' + i }), redirect: 'manual' });
  r = await fetch(base + 'betrieb.php', { method: 'POST', body: new URLSearchParams({ aktion: 'login', passwort: password }), redirect: 'manual' });
  assert.equal(r.status, 429, 'Sperre greift auch beim richtigen Passwort');
  passed++;

  console.log(passed + ' Prüfgruppen bestanden (Listen, Einheit, Integration); keine externe Mail; erfundene Daten: ' + dir);
} finally {
  const stopped = new Promise((r) => server.once('exit', r));
  server.kill();
  await stopped;
  await new Promise((r) => smtp.close(r));
}
