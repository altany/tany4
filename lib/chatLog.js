// Imported lazily: the SDK pulls in ESM-only dependencies, and nothing here
// runs without a Blob store anyway
const blob = () => import("@vercel/blob");

// One JSON object per line, one file per month, in a private Blob store.
// Plain text on purpose: it can be read with `npm run questions`, downloaded
// from the Vercel dashboard, or fed into something else later.
const PREFIX = "chat";

const monthKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
const pathFor = (key) => `${PREFIX}/${key}.jsonl`;

// Which parts of the site the retrieval picked, e.g. "cv, work, post:marios-helper-v2"
function contextSources(context) {
  const sources = (context || "").match(/^\[([^\]]+)\]/gm) || [];
  return Array.from(new Set(sources.map((s) => s.slice(1, -1))));
}

async function readMonth(key) {
  try {
    const { get } = await blob();
    const result = await get(pathFor(key), { access: "private" });
    if (!result?.stream) return "";
    return await new Response(result.stream).text();
  } catch (e) {
    // A month with no questions in it has no file yet
    return "";
  }
}

function parseLines(text) {
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}

// Appends one question to this month's file. Never throws: a failure to write
// the log must not break the answer the visitor is waiting for.
export async function logChatTurn({ question, answer, context, refused, tokens, ms, country }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  const now = new Date();
  const entry = {
    at: now.toISOString(),
    question,
    answer,
    sources: contextSources(context),
    refused: Boolean(refused),
    tokens: tokens ?? null,
    ms: ms ?? null,
    country: country || null,
  };

  try {
    const { put } = await blob();
    const key = monthKey(now);
    const existing = await readMonth(key);
    await put(pathFor(key), `${existing}${JSON.stringify(entry)}\n`, {
      access: "private",
      contentType: "application/x-ndjson",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (e) {
    console.error("[chatLog] could not write the question:", e?.message || e);
  }
}

// Every logged question between `since` and `until` (ISO strings or Dates),
// oldest first. Reads the months the range touches.
export async function readChatTurns({ since, until }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];

  const from = new Date(since);
  const to = new Date(until);
  const keys = new Set([monthKey(from), monthKey(to)]);

  const months = await Promise.all(Array.from(keys).map(readMonth));
  return months
    .flatMap((text) => parseLines(text))
    .filter((entry) => {
      const at = new Date(entry.at);
      return at >= from && at <= to;
    })
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}
