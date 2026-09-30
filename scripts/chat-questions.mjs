#!/usr/bin/env node
// Prints what visitors asked the site's chat, from the private Blob store.
//
//   npm run questions              → the last 7 days
//   npm run questions -- --days 30 → the last 30 days
//   npm run questions -- --full    → full answers instead of the first lines
//
// It reads the log through the Vercel CLI (`vercel blob get`), so it uses your
// own Vercel login and needs no token on disk.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};

const days = Number(arg("days") || 7);
const full = process.argv.includes("--full");
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
const months = Array.from(new Set([monthKey(since), monthKey(new Date())]));

async function readMonth(key) {
  try {
    const { stdout } = await run("vercel", ["blob", "get", `chat/${key}.jsonl`], { maxBuffer: 20 * 1024 * 1024 });
    return stdout;
  } catch (e) {
    // No questions that month, or the store isn't reachable
    return "";
  }
}

const entries = (await Promise.all(months.map(readMonth)))
  .flatMap((text) =>
    text
      .split("\n")
      .filter((line) => line.trim().startsWith("{"))
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean)
  )
  .filter((e) => new Date(e.at) >= since)
  .sort((a, b) => new Date(a.at) - new Date(b.at));

if (entries.length === 0) {
  console.log(`No questions in the last ${days} days.`);
  process.exit(0);
}

const short = (text) => {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean.length > 200 ? `${clean.slice(0, 200)}…` : clean;
};

for (const e of entries) {
  const when = new Date(e.at).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" });
  console.log(`\n${when} UTC${e.country ? ` · ${e.country}` : ""}${e.refused ? " · not covered" : ""}`);
  console.log(`Q: ${e.question}`);
  console.log(`A: ${full ? (e.answer || "").trim() : short(e.answer)}`);
  if (e.sources?.length) console.log(`   found: ${e.sources.join(", ")}`);
  if (e.tokens || e.ms) console.log(`   ${e.tokens ?? "?"} tokens · ${e.ms ?? "?"} ms`);
}

console.log(`\n${entries.length} question(s) in the last ${days} days.`);
