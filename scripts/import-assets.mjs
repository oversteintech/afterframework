// Imports real product imagery from sibling repos into public/ as optimized WebP.
// Run from the repo root with the sibling checkouts present:
//   node scripts/import-assets.mjs
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const root = path.resolve(import.meta.dirname, "..");
const siblings = path.resolve(root, "..");
const iconSrc = path.join(siblings, "supercore/packages/after_design_system/assets/product_icons");
const shotSrc = path.join(siblings, "supergarage/store/screenshots/phone");

const icons = [
  "garage", "hospital", "health", "finance", "home", "travel", "pet",
  "news", "sports", "farm", "airport", "maritime", "factory", "hub",
];
const screenshots = [
  "08_garage_bmw_health",
  "01_ai_vehicle_advisor",
  "14_live_obd_engine",
  "16_vehicle_spending",
];

async function run() {
  const iconOut = path.join(root, "public/products/icons");
  const shotOut = path.join(root, "public/products/supergarage");
  await mkdir(iconOut, { recursive: true });
  await mkdir(shotOut, { recursive: true });

  for (const name of icons) {
    const src = path.join(iconSrc, `${name}.png`);
    if (!existsSync(src)) {
      console.warn(`skip icon ${name}: not found`);
      continue;
    }
    await sharp(src)
      .resize(160, 160)
      .webp({ quality: 82 })
      .toFile(path.join(iconOut, `${name}.webp`));
  }

  for (const name of screenshots) {
    const src = path.join(shotSrc, `${name}.png`);
    if (!existsSync(src)) {
      console.warn(`skip screenshot ${name}: not found`);
      continue;
    }
    await sharp(src).webp({ quality: 84 }).toFile(path.join(shotOut, `${name}.webp`));
  }
  console.log("assets imported");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
