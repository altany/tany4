// Makes the small WebP copies the site shows instead of the full-size images.
// Run `npm run images` after adding a post banner; a unit test fails if one is missing.
import { readdirSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import sharp from "sharp";
import { BANNER_HEIGHT, SMALL_IMAGES, smallBanner } from "../lib/images.js";

const banners = new Set(
  readdirSync("posts")
    .map((file) => readFileSync(`posts/${file}`, "utf8").match(/^banner:\s*"([^"]+)"/m)?.[1])
    .filter(Boolean)
    .filter((banner) => !banner.endsWith(".svg"))
);

const jobs = [
  ...[...banners].map((banner) => ({
    source: `public/blog/${banner}`,
    output: `public${smallBanner(banner)}`,
    resize: { height: BANNER_HEIGHT },
  })),
  ...SMALL_IMAGES.map(({ source, output, width }) => ({ source, output, resize: { width } })),
];

mkdirSync("public/blog/small", { recursive: true });
for (const { source, output, resize } of jobs) {
  if (!existsSync(source)) throw new Error(`${source} not found`);
  const info = await sharp(source)
    .resize({ ...resize, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`${output}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
}
