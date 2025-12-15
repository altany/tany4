import fs from "fs";
import path from "path";
import matter from "gray-matter";

let cachedCorpus = null;
let cachedAt = 0;
const CORPUS_TTL_MS = 10 * 60 * 1000;

function extractVisibleTextFromNextPage(fileContents) {
  const src = normalizeText(fileContents);

  const fragments = [];

  const jsxTextNode = />\s*([^<>{}][^<>]{2,}?)\s*</g;
  for (const m of src.matchAll(jsxTextNode)) {
    const text = normalizeText(m[1]);
    if (text) fragments.push(text);
  }

  const stringLiteral = /["'`]([^"'`]{3,}?)["'`]/g;
  for (const m of src.matchAll(stringLiteral)) {
    const text = normalizeText(m[1]);
    if (!text) continue;
    if (text.includes("http")) continue;
    if (text.startsWith("/") || text.includes(".js") || text.includes(".scss")) continue;
    if (text.includes("next/") || text.includes("components/") || text.includes("../")) continue;
    fragments.push(text);
  }

  const unique = Array.from(new Set(fragments));
  return normalizeText(unique.join("\n"));
}

function loadNextPageText(relativeFilePath) {
  try {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    if (!fs.existsSync(fullPath)) return "";
    const contents = fs.readFileSync(fullPath, "utf8");
    return extractVisibleTextFromNextPage(contents);
  } catch (e) {
    return "";
  }
}

function normalizeText(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, "")
    .trim();
}

function splitIntoChunks(text) {
  const raw = normalizeText(text)
    .split(/\n\s*\n/g)
    .map((t) => normalizeText(t))
    .filter(Boolean);

  const chunks = [];
  for (const block of raw) {
    if (block.length <= 800) {
      chunks.push(block);
      continue;
    }
    for (let i = 0; i < block.length; i += 700) {
      chunks.push(block.slice(i, i + 800));
    }
  }
  return chunks;
}

function tokenize(query) {
  const cleaned = (query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const stop = new Set([
    "the",
    "and",
    "or",
    "to",
    "of",
    "in",
    "a",
    "an",
    "for",
    "on",
    "with",
    "is",
    "are",
    "was",
    "were",
    "i",
    "you",
    "my",
    "me",
    "it",
    "as",
    "at",
    "by",
    "from",
    "this",
    "that",
    "these",
    "those",
  ]);

  return cleaned
    .split(" ")
    .filter((t) => t.length >= 3 && !stop.has(t))
    .slice(0, 12);
}

async function loadCvText() {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const pdfPath = path.join(process.cwd(), "public", "TaniaPapazafeiropoulou-CV.pdf");
    const data = fs.readFileSync(pdfPath);
    const parsed = await pdfParse(data);
    return normalizeText(parsed?.text || "");
  } catch (e) {
    return "";
  }
}

async function buildCorpus() {
  const docs = [];

  const homeText = loadNextPageText(path.join("pages", "index.js"));
  if (homeText) {
    docs.push({
      source: "home",
      title: "Home",
      text: homeText,
    });
  }

  const workText = loadNextPageText(path.join("pages", "work", "index.js"));
  if (workText) {
    docs.push({
      source: "work",
      title: "Work",
      text: workText,
    });
  }

  const postsDir = path.join(process.cwd(), "posts");
  if (fs.existsSync(postsDir)) {
    const postsIndex = [];
    const fileNames = fs
      .readdirSync(postsDir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    for (const fileName of fileNames) {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(fileContents);
      const title = parsed?.data?.title || id;
      const description = parsed?.data?.description || "";
      const body = parsed?.content || "";

      postsIndex.push({ id, title, description });

      docs.push({
        source: `blog/${id}`,
        title,
        text: normalizeText(`${title}\n${description}\n\n${body}`),
      });
    }

    if (postsIndex.length > 0) {
      const indexText = postsIndex
        .map((p) => {
          const desc = normalizeText(p.description);
          return desc ? `- ${p.title}: ${desc}` : `- ${p.title}`;
        })
        .join("\n");

      docs.push({
        source: "blog_index",
        title: "Blog posts",
        text: normalizeText(
          `Blog post list\n\n${indexText}\n\nIf asked about a specific post, use the title above to choose the most relevant one.`
        ),
      });
    }
  }

  const cvText = await loadCvText();
  if (cvText) {
    docs.push({
      source: "cv",
      title: "CV",
      text: cvText,
    });
  }

  const chunks = [];
  for (const doc of docs) {
    const parts = splitIntoChunks(doc.text);
    for (const part of parts) {
      chunks.push({
        source: doc.source,
        title: doc.title,
        text: part,
      });
    }
  }

  return chunks;
}

async function getCorpus() {
  const now = Date.now();
  if (cachedCorpus && now - cachedAt < CORPUS_TTL_MS) return cachedCorpus;
  cachedCorpus = await buildCorpus();
  cachedAt = now;
  return cachedCorpus;
}

function scoreChunk(chunkText, terms) {
  const hay = chunkText.toLowerCase();
  let score = 0;
  for (const term of terms) {
    let idx = hay.indexOf(term);
    while (idx !== -1) {
      score += 1;
      idx = hay.indexOf(term, idx + term.length);
    }
  }
  return score;
}

function expandQueryTerms(terms) {
  const expanded = new Set(terms);
  const hasAny = (arr) => arr.some((t) => expanded.has(t));

  if (hasAny(["role", "title", "job", "position"])) {
    [
      "tech",
      "lead",
      "frontend",
      "engineer",
      "developer",
      "react",
      "javascript",
      "team",
      "leadership",
    ].forEach((t) => expanded.add(t));
  }

  if (hasAny(["stack", "tech", "technologies", "technology"])) {
    ["react", "javascript", "node", "typescript", "frontend"].forEach((t) =>
      expanded.add(t)
    );
  }

  if (hasAny(["blog", "blogs", "post", "posts", "article", "articles", "written", "write", "wrote"])) {
    ["blog", "post", "posts", "article", "articles", "wrote", "written"].forEach((t) =>
      expanded.add(t)
    );
  }

  return Array.from(expanded).slice(0, 20);
}

function isBlogQuery(query) {
  const q = (query || "").toLowerCase();
  return (
    q.includes("blog") ||
    q.includes("post") ||
    q.includes("posts") ||
    q.includes("article") ||
    q.includes("articles") ||
    q.includes("written") ||
    q.includes("wrote")
  );
}

function pickDefaultContext(corpus, limit = 4, query = "") {
  const priority = isBlogQuery(query)
    ? ["blog_index", "blog/", "work", "home", "cv"]
    : ["work", "home", "cv"];
  const picked = [];

  for (const source of priority) {
    for (const c of corpus) {
      if (picked.length >= limit) break;
      if (source.endsWith("/") ? !c.source.startsWith(source) : c.source !== source) continue;
      picked.push(c);
    }
  }

  if (picked.length < limit) {
    for (const c of corpus) {
      if (picked.length >= limit) break;
      if (picked.includes(c)) continue;
      picked.push(c);
    }
  }

  return picked;
}

export async function getKeywordContext(query) {
  const terms = expandQueryTerms(tokenize(query));
  const corpus = await getCorpus();

  if (terms.length === 0) {
    const top = pickDefaultContext(corpus, 4, query);
    return top.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
  }

  const scored = corpus
    .map((c) => ({ c, score: scoreChunk(c.text, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.c);

  if (scored.length === 0) {
    const top = pickDefaultContext(corpus, 4, query);
    return top.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
  }

  return scored.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
}
