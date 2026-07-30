#!/usr/bin/env node
/**
 * Erzeugt die statischen Bilddateien aus HTML-Vorlagen mit einem
 * headless Chromium. Damit bleiben Vorschaubild und Icon im Repository
 * reproduzierbar und müssen nicht in einem Grafikprogramm gepflegt werden.
 *
 *   node scripts/make-images.mjs
 *
 * Warum zugeschnitten wird: Headless-Chromium rechnet die Fensterhöhe aus
 * `--window-size` inklusive Browserleisten. Der tatsächlich gezeichnete
 * Bereich ist dadurch je nach Build einige Dutzend Pixel niedriger als
 * angefordert. Deshalb wird mit Reserve gerendert und das Ergebnis
 * anschließend exakt auf die Zielgröße beschnitten.
 *
 * Chromium wird in dieser Reihenfolge gesucht:
 *   $CHROME_PATH, PLAYWRIGHT_BROWSERS_PATH, übliche Systempfade.
 * Ist keins vorhanden, bricht das Skript ab – der Website-Build läuft
 * davon unabhängig weiter.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const outDir = join(root, 'public');
const tmpDir = join(root, '.astro', 'shot');

/** Reserve für die Browserleisten in `--window-size`. */
const CHROME_HEIGHT_PADDING = 120;

const candidates = [
  process.env.CHROME_PATH,
  process.env.PLAYWRIGHT_BROWSERS_PATH ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium') : null,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('Kein Chromium gefunden. Setzen Sie CHROME_PATH auf eine Chrome-/Chromium-Binary.');
  process.exit(1);
}

/* ------------------------------------------------------------------ PNG */

/** Liest ein PNG (Farbtyp 2 oder 6, 8 Bit) in rohe Pixelzeilen. */
function decodePng(buf) {
  let pos = 8;
  let width = 0;
  let height = 0;
  let colorType = 2;
  const idat = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8) throw new Error('Nur 8 Bit Farbtiefe unterstützt');
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(data));
    }
    pos += 12 + len;
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(height * stride);
  let prev = Buffer.alloc(stride);
  let i = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[i++];
    const line = Buffer.from(raw.subarray(i, i + stride));
    i += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? line[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      switch (filter) {
        case 1:
          line[x] = (line[x] + a) & 255;
          break;
        case 2:
          line[x] = (line[x] + b) & 255;
          break;
        case 3:
          line[x] = (line[x] + ((a + b) >> 1)) & 255;
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          line[x] = (line[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
          break;
        }
        default:
          break;
      }
    }
    line.copy(out, y * stride);
    prev = line;
  }

  return { width, height, channels, pixels: out };
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng({ width, height, channels, pixels }) {
  const stride = width * channels;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // Filter "None"
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = channels === 4 ? 6 : 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Schneidet ein PNG oben links auf die Zielgröße zu. */
function cropTo(file, width, height) {
  const img = decodePng(readFileSync(file));
  if (img.width === width && img.height === height) return;
  if (img.width < width || img.height < height) {
    throw new Error(`Screenshot ist mit ${img.width}×${img.height} kleiner als ${width}×${height}`);
  }
  const stride = img.width * img.channels;
  const outStride = width * img.channels;
  const pixels = Buffer.alloc(height * outStride);
  for (let y = 0; y < height; y++) {
    img.pixels.copy(pixels, y * outStride, y * stride, y * stride + outStride);
  }
  writeFileSync(file, encodePng({ width, height, channels: img.channels, pixels }));
}

/* ----------------------------------------------------------------- Lauf */

const jobs = [
  { tpl: 'og-template.html', out: 'og-default.png', w: 1200, h: 630 },
  { tpl: 'icon-template.html', out: 'apple-touch-icon.png', w: 180, h: 180 },
  // Wird in den strukturierten Daten als `logo` der Organisation
  // referenziert. Größe und Pfad stehen so auch in src/lib/schema.ts –
  // beides muss zusammenpassen.
  { tpl: 'logo-template.html', out: 'logo.png', w: 512, h: 512 },
];

mkdirSync(tmpDir, { recursive: true });

for (const job of jobs) {
  const src = join(here, job.tpl);
  const tmp = join(tmpDir, job.out);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${job.w},${job.h + CHROME_HEIGHT_PADDING}`,
      `--screenshot=${tmp}`,
      `file://${src}`,
    ],
    { stdio: 'pipe' },
  );
  cropTo(tmp, job.w, job.h);
  writeFileSync(join(outDir, job.out), readFileSync(tmp));
  console.log(`erzeugt: public/${job.out} (${job.w}×${job.h})`);
}

rmSync(tmpDir, { recursive: true, force: true });
