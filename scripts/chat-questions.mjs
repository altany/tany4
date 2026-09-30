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
import fs from "node:fs";
import path from "node:path";

const run = promisify(execFile);

// The CLI needs the store's token passed in: it also reads .env.local, where
// `vercel blob create-store` left VERCEL_OIDC_TOKEN, and refuses to guess
// between the two. Run `vercel env pull` if .env.local is missing.
function blobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  const envFile = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envFile)) {
    const line = fs
      .readFileSync(envFile, "utf8")
      .split("\n")
      .find((l) => l.startsWith("BLOB_READ_WRITE_TOKEN="));
    if (line) return line.slice("BLOB_READ_WRITE_TOKEN=".length).trim().replace(/^"|"$/g, "");
  }
  console.error("No BLOB_READ_WRITE_TOKEN. Run `vercel env pull` in this folder first.");
  process.exit(1);
}

const token = blobToken();

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
    const { stdout } = await run(
      "vercel",
      ["blob", "get", `chat/${key}.jsonl`, "--access", "private", "--rw-token", token],
      { maxBuffer: 20 * 1024 * 1024 }
    );
    return stdout;
  } catch (e) {
    const message = `${e.stderr || e.message || ""}`;
    // A month nobody asked anything in simply has no file
    if (/not found|does not exist|404/i.test(message)) return "";
    console.error(`Could not read chat/${key}.jsonl:\n${message.trim()}`);
    process.exit(1);
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
