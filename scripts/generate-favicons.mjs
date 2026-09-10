// Generate the favicon set from public/favicon.svg
// Usage: node scripts/generate-favicons.mjs
// Rasterizes via sharp (already available as a Next.js dependency) and
// assembles a multi-size PNG-in-ICO container for legacy support.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const src = path.join(pub, "favicon.svg");

const raster = (size) =>
  // SVG natural size is 512px; lanczos downscale gives crisp small rasters.
  sharp(src).resize(size, size).png().toBuffer();

// ICO container: 6-byte header + 16-byte dir entry per image + raw PNG blobs.
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon resource
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const parts = [header];
  for (const { size, data } of entries) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
    dir.writeUInt8(0, 2); // no palette
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // color planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(data.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += data.length;
    parts.push(dir, data);
  }
  return Buffer.concat(parts);
}

const [ico16, ico32, ico48, png192, png512, apple] = await Promise.all([
  raster(16),
  raster(32),
  raster(48),
  raster(192),
  raster(512),
  raster(180),
]);

await writeFile(path.join(pub, "favicon.ico"), buildIco([
  { size: 16, data: ico16 },
  { size: 32, data: ico32 },
  { size: 48, data: ico48 },
]));
await writeFile(path.join(pub, "icon-192.png"), png192);
await writeFile(path.join(pub, "icon-512.png"), png512);
await writeFile(path.join(pub, "apple-touch-icon.png"), apple);

console.log("favicon set generated: favicon.ico (16/32/48), icon-192.png, icon-512.png, apple-touch-icon.png");
