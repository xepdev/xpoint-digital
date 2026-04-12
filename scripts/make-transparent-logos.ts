// Use CommonJS-style imports so ts-node works without needing "type":"module".
// This script is only for local/dev asset processing (safe to keep simple).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs/promises') as typeof import('node:fs/promises');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path') as typeof import('node:path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp') as typeof import('sharp');

const INPUT_DIR = path.join(process.cwd(), 'public', 'references');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'references', 'transparent');

// Safe mode: only pure/near-black pixels become fully transparent.
// This avoids breaking edges for logos that already have anti-aliased dark pixels.
const SAFE_NEAR_BLACK_THRESHOLD = 25;

function isNearBlack(r: number, g: number, b: number) {
  return r <= SAFE_NEAR_BLACK_THRESHOLD && g <= SAFE_NEAR_BLACK_THRESHOLD && b <= SAFE_NEAR_BLACK_THRESHOLD;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const files = await fs.readdir(INPUT_DIR);
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log('[make-transparent-logos] No PNG files found in', INPUT_DIR);
    return;
  }

  console.log(`[make-transparent-logos] Processing ${pngFiles.length} files...`);

  for (const file of pngFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    const img = sharp(inputPath).ensureAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

    // With ensureAlpha(), we expect RGBA.
    if (info.channels !== 4) {
      throw new Error(`Expected 4 channels (RGBA), got ${info.channels} for ${file}`);
    }

    const buffer = Buffer.from(data);
    for (let i = 0; i < buffer.length; i += 4) {
      const r = buffer[i];
      const g = buffer[i + 1];
      const b = buffer[i + 2];
      const a = buffer[i + 3];

      // Preserve existing transparency, and only remove near-black fully opaque pixels.
      if (a !== 0 && isNearBlack(r, g, b)) {
        buffer[i + 3] = 0;
      }
    }

    await sharp(buffer, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toFile(outputPath);

    console.log('[make-transparent-logos] Wrote', path.relative(process.cwd(), outputPath));
  }

  console.log('[make-transparent-logos] Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

