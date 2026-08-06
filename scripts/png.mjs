/**
 * MINIMALE PNG-WERKZEUGE
 * ======================
 *
 * Lesen, Schreiben und Zuschneiden von PNG-Dateien ohne zusätzliche
 * Abhängigkeit. Gebraucht wird nur eines: Headless-Chromium rechnet die
 * Fensterhöhe aus `--window-size` inklusive Browserleisten, der gezeichnete
 * Bereich ist deshalb je nach Build einige Dutzend Pixel niedriger als
 * angefordert. Also wird mit Reserve gerendert und anschließend exakt auf
 * die Zielgröße beschnitten.
 *
 * Stand vorher doppelt in make-images.mjs und wäre mit make-og-images.mjs
 * ein drittes Mal entstanden.
 *
 * Unterstützt Farbtyp 2 (RGB) und 6 (RGBA) mit 8 Bit – mehr erzeugt
 * Chromium hier nicht.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync, crc32 } from 'node:zlib';

/** Liest ein PNG (Farbtyp 2 oder 6, 8 Bit) in rohe Pixelzeilen. */
export function decodePng(buf) {
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

export function encodePng({ width, height, channels, pixels }) {
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
export function cropTo(file, width, height) {
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
