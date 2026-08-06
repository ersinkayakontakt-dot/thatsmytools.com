/**
 * SEARCH-CONSOLE-API
 * ==================
 *
 * Zweiter Weg neben dem CSV-Import. Er liefert, was der CSV-Export nicht
 * kann: Suchanfrage UND Seite in derselben Zeile. Ohne diese Verbindung
 * lässt sich Kannibalisierung aus echten Daten nicht sauber erkennen –
 * man sieht dann nur, dass eine Anfrage Impressionen hat, aber nicht, auf
 * welche Seiten sie sich verteilen.
 *
 * ZUGANG EINRICHTEN
 *   1. In der Google Cloud Console ein Dienstkonto anlegen und die
 *      Search Console API aktivieren.
 *   2. Den JSON-Schlüssel AUSSERHALB dieses Repositories ablegen.
 *   3. In der Search Console das Dienstkonto (die E-Mail aus der
 *      JSON-Datei) als Nutzer mit Leserecht auf die Property setzen.
 *   4. In .env.local eintragen:
 *
 *        GOOGLE_APPLICATION_CREDENTIALS=C:\pfad\ausserhalb\repo\key.json
 *
 * Der Schlüssel gehört niemals ins Repository. `.env*` ist ausgeschlossen,
 * und der Pfad zeigt bewusst nach draußen.
 *
 * KEINE ZUSÄTZLICHE BIBLIOTHEK
 * Die Google-Client-Bibliothek zieht mehrere Dutzend Pakete nach. Gebraucht
 * werden hier zwei Dinge: ein signiertes JWT und ein POST. Beides kann Node
 * seit Version 16 selbst (`node:crypto`, `fetch`). Das Projekt hat aktuell
 * genau eine Laufzeitabhängigkeit – das soll so bleiben.
 *
 * QUOTEN
 * Google erlaubt je Property 1200 Abfragen pro Minute und 25 pro Sekunde,
 * die URL-Inspection nur 2000 pro Tag und 600 pro Minute. Dieses Modul
 * drosselt selbst und meldet, wie viel es verbraucht hat. Massenabfragen
 * über alle URLs sind ausgeschlossen: `inspectUrls()` nimmt eine Liste
 * entgegen, die der Aufrufer nach Priorität vorsortiert hat.
 */
import { createSign } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..', '..');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

/* --------------------------------------------------------- Zugangsdaten */

export function credentialsPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(
      /^\s*GOOGLE_APPLICATION_CREDENTIALS\s*=\s*(.+)\s*$/m,
    );
    if (m) {
      const value = m[1].trim().replace(/^["']|["']$/g, '');
      if (value) return value;
    }
  }
  return null;
}

export function hasCredentials() {
  const path = credentialsPath();
  return Boolean(path && existsSync(path));
}

function loadKey() {
  const path = credentialsPath();
  if (!path) {
    throw new Error(
      'Kein Zugang zur Search-Console-API.\n' +
        'GOOGLE_APPLICATION_CREDENTIALS in .env.local auf eine Dienstkonto-JSON\n' +
        'AUSSERHALB des Repositories setzen. Ohne Zugang bleibt der CSV-Import\n' +
        'der Weg – er funktioniert vollständig.',
    );
  }
  if (!existsSync(path)) {
    throw new Error(`Dienstkonto-Datei nicht gefunden: ${path}`);
  }
  const key = JSON.parse(readFileSync(path, 'utf8'));
  if (!key.client_email || !key.private_key) {
    throw new Error(`${path} sieht nicht wie ein Dienstkonto-Schlüssel aus.`);
  }
  return key;
}

/* ------------------------------------------------------------- Token */

const base64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let cachedToken = null;

async function accessToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;

  const key = loadKey();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(key.private_key));
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Token-Abruf fehlgeschlagen (HTTP ${res.status}).\n` +
        'Häufigste Ursache: Das Dienstkonto ist in der Search Console nicht als\n' +
        'Nutzer eingetragen, oder die Search Console API ist im Projekt nicht aktiviert.\n' +
        text.slice(0, 300),
    );
  }

  const data = await res.json();
  cachedToken = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

/* ------------------------------------------------------------ Drosselung */

let used = 0;
let windowStart = Date.now();

/** Hält 20 Abfragen pro Sekunde ein – unter dem Limit von 25. */
async function throttle() {
  used += 1;
  const elapsed = Date.now() - windowStart;
  if (used % 20 === 0 && elapsed < 1000) {
    await new Promise((r) => setTimeout(r, 1000 - elapsed));
    windowStart = Date.now();
  }
}

export const quotaUsed = () => used;

/* ------------------------------------------------------------ Abfragen */

/**
 * Leistungsdaten abrufen.
 *
 * @param {object} opts
 * @param {string} opts.siteUrl     z. B. "https://schnellhelfer24.de/" oder "sc-domain:schnellhelfer24.de"
 * @param {string} opts.startDate   JJJJ-MM-TT
 * @param {string} opts.endDate     JJJJ-MM-TT
 * @param {string[]} opts.dimensions z. B. ['query', 'page']
 * @param {number} [opts.rowLimit]
 */
export async function fetchPerformance({
  siteUrl,
  startDate,
  endDate,
  dimensions,
  rowLimit = 25000,
}) {
  const token = await accessToken();
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

  /** Seitenweise holen – ein Aufruf liefert höchstens 25 000 Zeilen. */
  const all = [];
  let startRow = 0;

  for (;;) {
    await throttle();
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit: Math.min(rowLimit, 25000),
        startRow,
        dataState: 'final',
      }),
    });

    if (res.status === 429) {
      throw new Error('Search Console meldet Kontingentüberschreitung (HTTP 429). Später erneut.');
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Search Console antwortet mit HTTP ${res.status}. ${text.slice(0, 300)}`);
    }

    const data = await res.json();
    const rows = data.rows ?? [];
    for (const r of rows) {
      const row = { clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position };
      dimensions.forEach((dim, i) => {
        row[dim] = r.keys[i];
      });
      all.push(row);
    }

    if (rows.length < 25000) break;
    startRow += rows.length;
  }

  return all;
}

/**
 * URL-Inspection – bewusst nur für eine übergebene, vorsortierte Liste.
 *
 * Das Tageskontingent liegt bei 2000 Abfragen. Alle Seiten blind zu prüfen
 * verbrennt es an Seiten, über die man ohnehin nichts erfahren muss.
 * Welche URLs wirklich wichtig sind, entscheidet der Aufrufer anhand der
 * wirtschaftlichen Priorität und der Auffälligkeiten in den Daten.
 *
 * @param {string[]} urls  höchstens `limit` Stück, nach Wichtigkeit sortiert
 */
export async function inspectUrls(siteUrl, urls, limit = 50) {
  const token = await accessToken();
  const endpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
  const out = [];

  for (const url of urls.slice(0, limit)) {
    await throttle();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl, languageCode: 'de' }),
    });

    if (res.status === 429) {
      out.push({ url, error: 'Tageskontingent erschöpft – Rest übersprungen' });
      break;
    }
    if (!res.ok) {
      out.push({ url, error: `HTTP ${res.status}` });
      continue;
    }

    const data = await res.json();
    const result = data.inspectionResult?.indexStatusResult ?? {};
    out.push({
      url,
      verdict: result.verdict,
      coverageState: result.coverageState,
      googleCanonical: result.googleCanonical,
      userCanonical: result.userCanonical,
      lastCrawlTime: result.lastCrawlTime,
      robotsTxtState: result.robotsTxtState,
      indexingState: result.indexingState,
      /** Weicht Googles Canonical von unserem ab? Dann stimmt etwas nicht. */
      canonicalMismatch:
        Boolean(result.googleCanonical && result.userCanonical) &&
        result.googleCanonical !== result.userCanonical,
    });
  }

  return out;
}
