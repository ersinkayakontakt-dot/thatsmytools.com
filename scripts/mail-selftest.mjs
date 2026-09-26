#!/usr/bin/env node
/**
 * SELBSTPRÜFUNG DES MAILVERSANDS
 * ==============================
 *
 * Beweist, dass `sendViaSmtp()` aus public/api/lib/smtp.php das
 * SMTP-Gespräch korrekt führt.
 *
 * Aufruf: npm run audit:mail:selftest
 *
 * Dieselbe Begründung wie bei den anderen beiden Selbstprüfungen: Code,
 * der nie gelaufen ist, ist keine Zusage. Hier wiegt das schwerer als
 * sonst – es ist ein handgeschriebener Protokoll-Client, und sein
 * Fehlverhalten würde sich als „die Mail kommt nicht an" äußern, also als
 * genau das Symptom, das er beheben soll.
 *
 * VORGEHEN
 * Node öffnet mit dem eingebauten net-Modul einen falschen SMTP-Server auf
 * 127.0.0.1 (keine neue Abhängigkeit). PHP bekommt ein kurzes
 * Treiberskript, das smtp.php einbindet und sendViaSmtp() dagegen laufen
 * lässt. Geprüft wird beides: was der Server zu hören bekam und was die
 * Funktion zurückgab.
 *
 * Der Testserver spricht Klartext. `smtpSecure: 'none'` ist dafür
 * vorgesehen und in smtp.php hart auf die Loopback-Adresse begrenzt.
 */
import { createServer } from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const smtpLib = join(root, 'public', 'api', 'lib', 'smtp.php');
const tmpDir = join(root, 'tmp', 'mail-selftest');

/* ------------------------------------------------------------------ */
/* PHP finden                                                          */
/* ------------------------------------------------------------------ */

/**
 * winget legt php.exe nicht zwingend in den PATH der laufenden Sitzung.
 * Deshalb erst PATH probieren, dann den winget-Pfad.
 */
function findPhp() {
  const candidates = [
    'php',
    join(
      process.env.LOCALAPPDATA ?? '',
      'Microsoft/WinGet/Packages/PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe/php.exe',
    ),
  ];
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['-r', 'echo 1;'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  return null;
}

const php = findPhp();
if (!php) {
  console.error('PHP wurde nicht gefunden. Installieren mit:');
  console.error('  winget install --id PHP.PHP.8.3');
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Falscher SMTP-Server                                                */
/* ------------------------------------------------------------------ */

const PASSWORT = 'gEhEim-Test-Passwort-123';

/**
 * Startet einen Server, der auf die Befehle des Clients antwortet.
 *
 * `overrides` bildet einen Befehlsanfang auf eine abweichende Antwort ab
 * ('.' steht für die Antwort nach dem Schlusspunkt), `auth` für das
 * Ergebnis der Anmeldung. Alles Eingehende wird mitgeschrieben – daran
 * prüfen die Fälle Reihenfolge und Inhalt der Nachricht.
 *
 * Die Anmeldung ist ein eigener Zustand, kein Eintrag in der Tabelle:
 * Nach "AUTH LOGIN" schickt der Client zwei base64-Zeilen (Benutzer,
 * Passwort), die sich nicht an einem Befehlswort erkennen lassen.
 */
function startServer({ auth = '235 angemeldet', overrides = {} } = {}) {
  const transcript = [];
  const replies = {
    EHLO: '250-testserver\r\n250-AUTH LOGIN\r\n250 OK',
    'MAIL FROM': '250 ok',
    'RCPT TO': '250 ok',
    DATA: '354 los',
    QUIT: '221 tschuess',
    ...overrides,
  };

  const server = createServer((socket) => {
    let inData = false;
    let authStep = 0; // 1 = Benutzer erwartet, 2 = Passwort erwartet

    socket.setEncoding('utf8');
    socket.write('220 testserver bereit\r\n');

    let buffer = '';
    socket.on('data', (chunk) => {
      buffer += chunk;
      let index;
      while ((index = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        transcript.push(line);

        if (inData) {
          /* Im Datenteil antwortet der Server erst auf den Schlusspunkt. */
          if (line === '.') {
            inData = false;
            socket.write((overrides['.'] ?? '250 angenommen') + '\r\n');
          }
          continue;
        }

        if (authStep === 1) {
          authStep = 2;
          socket.write('334 UGFzc3dvcmQ6\r\n');
          continue;
        }
        if (authStep === 2) {
          authStep = 0;
          socket.write(auth + '\r\n');
          continue;
        }
        if (line.toUpperCase().startsWith('AUTH LOGIN')) {
          authStep = 1;
          socket.write('334 VXNlcm5hbWU6\r\n');
          continue;
        }

        const key = Object.keys(replies).find(
          (k) => k !== '.' && line.toUpperCase().startsWith(k.toUpperCase()),
        );
        const reply = key ? replies[key] : '250 ok';
        if (line.toUpperCase().startsWith('DATA') && reply.startsWith('354')) {
          inData = true;
        }
        socket.write(reply + '\r\n');
        if (line.toUpperCase().startsWith('QUIT')) socket.end();
      }
    });
    socket.on('error', () => {
      /* Abbruch durch den Client ist in mehreren Fällen erwartet. */
    });
  });

  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      resolveServer({ server, port: server.address().port, transcript });
    });
  });
}

/* ------------------------------------------------------------------ */
/* PHP-Treiber                                                         */
/* ------------------------------------------------------------------ */

/**
 * Ruft sendViaSmtp() in einem eigenen PHP-Prozess auf und gibt das
 * Ergebnis als Objekt zurück.
 *
 * ASYNCHRON, und das ist kein Stilfrage: `spawnSync` würde Nodes
 * Ereignisschleife blockieren. Der Testserver läuft im selben Prozess und
 * käme dann nie dazu, die Begrüßung zu schicken – jeder Fall scheiterte
 * mit einer leeren Antwort. Genau so ist dieser Test beim ersten Lauf
 * fehlgeschlagen.
 */
async function callSendViaSmtp(config, mail) {
  const driver = join(tmpDir, 'driver.php');
  const payload = join(tmpDir, 'payload.json');

  writeFileSync(payload, JSON.stringify({ config, mail }), 'utf8');
  writeFileSync(
    driver,
    `<?php
declare(strict_types=1);
require_once ${JSON.stringify(smtpLib)};
$input = json_decode(file_get_contents(${JSON.stringify(payload)}), true);
$m = $input['mail'];
$result = sendViaSmtp(
    $input['config'],
    $m['to'], $m['subject'], $m['body'],
    $m['from'], $m['fromName'], $m['replyTo'], $m['ref']
);
echo json_encode($result);
`,
    'utf8',
  );

  const { out, err } = await new Promise((resolveRun) => {
    const child = spawn(php, [driver], { encoding: 'utf8' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('close', () => resolveRun({ out: stdout.trim(), err: stderr.trim() }));
  });

  try {
    return JSON.parse(out);
  } catch {
    return { ok: false, error: 'TREIBER: ' + out + ' ' + err };
  }
}

/** Baut eine Standardnachricht, einzelne Felder überschreibbar. */
const nachricht = (overrides = {}) => ({
  to: 'buero@schnellhelfer24.de',
  subject: 'Neue Anfrage',
  body: 'Eine Zeile.',
  from: 'website@schnellhelfer24.de',
  fromName: 'Schnellhelfer24 Website',
  replyTo: '',
  ref: 'REF123',
  ...overrides,
});

const konfig = (port, overrides = {}) => ({
  smtpHost: '127.0.0.1',
  smtpPort: port,
  smtpUser: 'website@schnellhelfer24.de',
  smtpPass: PASSWORT,
  smtpSecure: 'none',
  smtpTimeout: 5,
  siteUrl: 'https://schnellhelfer24.de',
  ...overrides,
});

/** Datenteil des Gesprächs: alles zwischen DATA und dem Schlusspunkt. */
function datenteil(transcript) {
  const start = transcript.findIndex((l) => l.toUpperCase().startsWith('DATA'));
  const end = transcript.indexOf('.', start + 1);
  if (start < 0 || end < 0) return [];
  return transcript.slice(start + 1, end);
}

function kopfzeile(transcript, name) {
  return datenteil(transcript).find((l) => l.toLowerCase().startsWith(name.toLowerCase() + ':')) ?? '';
}

function bodyText(transcript) {
  const teil = datenteil(transcript);
  const leer = teil.indexOf('');
  if (leer < 0) return '';
  return Buffer.from(teil.slice(leer + 1).join(''), 'base64').toString('utf8');
}

/* ------------------------------------------------------------------ */
/* Die Fälle                                                           */
/* ------------------------------------------------------------------ */

const CASES = [
  {
    name: 'vollständiger Ablauf in der richtigen Reihenfolge',
    server: {},
    mail: () => nachricht(),
    check: (result, transcript) => {
      if (!result.ok) return 'ok war false, Fehler: ' + result.error;
      const befehle = transcript.filter((l) =>
        /^(EHLO|AUTH LOGIN|MAIL FROM|RCPT TO|DATA|QUIT)/i.test(l),
      ).map((l) => l.split(' ')[0].toUpperCase());
      const erwartet = ['EHLO', 'AUTH', 'MAIL', 'RCPT', 'DATA', 'QUIT'];
      const ist = befehle.map((b) => (b === 'AUTH' ? 'AUTH' : b));
      for (const schritt of erwartet) {
        if (!ist.includes(schritt)) return 'Schritt fehlt: ' + schritt;
      }
      if (ist.indexOf('MAIL') > ist.indexOf('RCPT')) return 'MAIL FROM kam nach RCPT TO';
      if (ist.indexOf('RCPT') > ist.indexOf('DATA')) return 'RCPT TO kam nach DATA';
      return '';
    },
  },
  {
    name: 'Umlaute im Betreff werden RFC-2047-kodiert',
    server: {},
    mail: () => nachricht({ subject: 'Anfrage aus Köpenick – Größe 3 Zimmer' }),
    check: (_result, transcript) => {
      const zeile = kopfzeile(transcript, 'Subject');
      if (!zeile.includes('=?UTF-8?B?')) return 'Betreff nicht kodiert: ' + zeile;
      const roh = zeile.match(/=\?UTF-8\?B\?(.*?)\?=/);
      const zurueck = Buffer.from(roh[1], 'base64').toString('utf8');
      return zurueck === 'Anfrage aus Köpenick – Größe 3 Zimmer'
        ? ''
        : 'dekodiert falsch: ' + zurueck;
    },
  },
  {
    name: 'reiner ASCII-Betreff bleibt unkodiert lesbar',
    server: {},
    mail: () => nachricht({ subject: 'Neue Anfrage 10115 Berlin' }),
    check: (_result, transcript) => {
      const zeile = kopfzeile(transcript, 'Subject');
      return zeile === 'Subject: Neue Anfrage 10115 Berlin' ? '' : 'unerwartet: ' + zeile;
    },
  },
  {
    name: 'Umlaute im Text kommen zeichengleich an',
    server: {},
    mail: () => nachricht({ body: 'Größe: 3 Zimmer\nEtage: 4. Stock ohne Aufzug\nStraße: Köpenicker Chaussee' }),
    check: (_result, transcript) => {
      const text = bodyText(transcript);
      return text === 'Größe: 3 Zimmer\nEtage: 4. Stock ohne Aufzug\nStraße: Köpenicker Chaussee'
        ? ''
        : 'Text weicht ab: ' + JSON.stringify(text.slice(0, 80));
    },
  },
  {
    name: 'lange Beschreibung sprengt keine Zeilenlänge',
    server: {},
    mail: () => nachricht({ body: 'Ü'.repeat(2000) }),
    check: (_result, transcript) => {
      const zuLang = datenteil(transcript).find((l) => l.length > 998);
      if (zuLang) return 'Zeile mit ' + zuLang.length + ' Zeichen';
      const text = bodyText(transcript);
      return text === 'Ü'.repeat(2000) ? '' : 'Text wurde beim Umbruch beschädigt';
    },
  },
  {
    name: 'Antwort-Adresse wird gesetzt, wenn vorhanden',
    server: {},
    mail: () => nachricht({ replyTo: 'kundin@example.com' }),
    check: (_result, transcript) =>
      kopfzeile(transcript, 'Reply-To').includes('kundin@example.com')
        ? ''
        : 'Reply-To fehlt',
  },
  {
    name: 'ohne Antwort-Adresse fehlt die Kopfzeile',
    server: {},
    mail: () => nachricht({ replyTo: '' }),
    check: (_result, transcript) =>
      kopfzeile(transcript, 'Reply-To') === '' ? '' : 'Reply-To steht da, obwohl leer',
  },
  {
    name: 'Date und Message-ID sind gesetzt (Zustellbarkeit)',
    server: {},
    mail: () => nachricht(),
    check: (_result, transcript) => {
      if (!kopfzeile(transcript, 'Date')) return 'Date fehlt';
      if (!kopfzeile(transcript, 'Message-ID').includes('schnellhelfer24.de')) {
        return 'Message-ID fehlt oder ohne Domain';
      }
      return '';
    },
  },
  {
    name: 'abgelehnte Anmeldung wird als Fehler gemeldet',
    server: { auth: '535 Anmeldung fehlgeschlagen' },
    mail: () => nachricht(),
    check: (result) => {
      if (result.ok) return 'ok war true, obwohl die Anmeldung scheiterte';
      return result.error.includes('Anmeldung') ? '' : 'Schritt nicht benannt: ' + result.error;
    },
  },
  {
    name: 'abgelehnter Empfänger wird als Fehler gemeldet',
    server: { overrides: { 'RCPT TO': '550 Postfach unbekannt' } },
    mail: () => nachricht(),
    check: (result) => {
      if (result.ok) return 'ok war true, obwohl der Empfänger abgelehnt wurde';
      return result.error.includes('RCPT TO') ? '' : 'Schritt nicht benannt: ' + result.error;
    },
  },
  {
    name: 'abgelehnte Annahme nach dem Schlusspunkt wird gemeldet',
    server: { overrides: { '.': '451 spaeter nochmal' } },
    mail: () => nachricht(),
    check: (result) => {
      if (result.ok) return 'ok war true, obwohl der Server die Nachricht ablehnte';
      return result.error.includes('Annahme') ? '' : 'Schritt nicht benannt: ' + result.error;
    },
  },
  {
    name: 'PASSWORT-LECK: Zugangsdaten stehen nie im Fehlertext',
    server: { auth: '535 Anmeldung fehlgeschlagen' },
    mail: () => nachricht(),
    check: (result) => {
      const text = JSON.stringify(result);
      if (text.includes(PASSWORT)) return 'Passwort steht im Klartext im Ergebnis';
      if (text.includes(Buffer.from(PASSWORT).toString('base64'))) {
        return 'Passwort steht base64-kodiert im Ergebnis';
      }
      return '';
    },
  },
];

/* Diese beiden brauchen keinen Server. */
const CASES_OHNE_SERVER = [
  {
    name: 'Klartext gegen fremden Host wird verweigert',
    run: () =>
      callSendViaSmtp(
        konfig(25, { smtpHost: 'smtp.fremder-anbieter.example' }),
        nachricht(),
      ),
    check: (result) => {
      if (result.ok) return 'ok war true, obwohl unverschluesselt nach draussen gesendet wurde';
      return result.error.includes('Loopback') ? '' : 'falscher Grund: ' + result.error;
    },
  },
  {
    name: 'nicht erreichbarer Server stürzt nicht ab',
    run: () => callSendViaSmtp(konfig(1), nachricht()),
    check: (result) => {
      if (result.ok) return 'ok war true, obwohl kein Server lauschte';
      return result.error.includes('Verbindung') ? '' : 'Schritt nicht benannt: ' + result.error;
    },
  },
];

/* ------------------------------------------------------------------ */
/* Ausführung                                                          */
/* ------------------------------------------------------------------ */

rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

if (!existsSync(smtpLib)) {
  console.error('public/api/lib/smtp.php fehlt.');
  process.exit(1);
}

let passed = 0;
let failed = 0;

console.log('Selbstprüfung des Mailversands');
console.log('='.repeat(66));
console.log('PHP: ' + php);
console.log('Jeder Fall fährt ein echtes SMTP-Gespräch gegen einen Testserver.\n');

for (const testCase of CASES) {
  const { server, port, transcript } = await startServer(testCase.server);
  let problem;
  try {
    const result = await callSendViaSmtp(konfig(port), testCase.mail());
    problem = testCase.check(result, transcript);
  } catch (err) {
    problem = 'Ausnahme: ' + err.message;
  }
  server.close();

  if (!problem) {
    console.log('  bestanden       ' + testCase.name);
    passed += 1;
  } else {
    console.log('  FEHLGESCHLAGEN  ' + testCase.name);
    console.log('                  ' + problem);
    failed += 1;
  }
}

for (const testCase of CASES_OHNE_SERVER) {
  let problem;
  try {
    problem = testCase.check(await testCase.run());
  } catch (err) {
    problem = 'Ausnahme: ' + err.message;
  }
  if (!problem) {
    console.log('  bestanden       ' + testCase.name);
    passed += 1;
  } else {
    console.log('  FEHLGESCHLAGEN  ' + testCase.name);
    console.log('                  ' + problem);
    failed += 1;
  }
}

rmSync(tmpDir, { recursive: true, force: true });

const gesamt = CASES.length + CASES_OHNE_SERVER.length;
console.log('');
console.log('='.repeat(66));
console.log(`  ${passed} von ${gesamt} Fällen bestanden.`);
if (failed) {
  console.log(`  ${failed} Zusagen des SMTP-Clients halten nicht.`);
}
console.log('');

process.exit(failed ? 1 : 0);
