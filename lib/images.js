// Small copies of large images, made by `npm run images` (scripts/optimize-images.mjs).
// The originals stay in public/ for social previews and as the source for these.

// Post banners are shown at most 150px tall, so a 300px-tall WebP covers 2x screens
export const BANNER_HEIGHT = 300;

// "marios-helper.png" → "/blog/small/marios-helper.webp"; SVGs are already small
export function smallBanner(banner) {
  if (banner.endsWith(".svg")) return `/blog/${banner}`;
  return `/blog/small/${banner.replace(/\.[^.]+$/, "")}.webp`;
}

// Other images, resized to twice the width they are shown at
export const SMALL_IMAGES = [
  { source: "public/ai-logo.png", output: "public/ai-logo-64.webp", width: 64 },
  { source: "public/Mario.png", output: "public/Mario-720.webp", width: 720 },
];
