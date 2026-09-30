import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NAME, JOB_TITLE, SITE_DESCRIPTION } from "../constants";
import { cv } from "../../src/cv/cv";

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
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativeFilePath);
    if (!fs.existsSync(fullPath)) return "";
    const contents = fs.readFileSync(fullPath, "utf8");
    return extractVisibleTextFromNextPage(contents);
  } catch (e) {
    return "";
  }
}

function loadSourceText(relativeFilePath) {
  try {
    const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativeFilePath);
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
    .filter((t) => t.length >= 2 && !stop.has(t))
    .slice(0, 16);
}

async function loadCvText() {
  const cvPageText = loadNextPageText(path.join("pages", "cv.tsx"));
  const cvDataText = loadSourceText(path.join("src", "cv", "cv.ts"));
  return normalizeText([cvPageText, cvDataText].filter(Boolean).join("\n\n"));
}

// Always sent with every answer. The title at the top of the CV covers the whole
// career, so the current role is spelled out here: without it "what do you do now"
// gets answered with the career-wide title.
function buildProfileText() {
  const lastName = (NAME || "").trim().split(/\s+/).slice(-1)[0] || "";
  const current = cv.experience?.[0];
  const currentRole = current
    ? `Current role: ${current.title} at ${current.company}, ${current.start} to ${current.end}.`
    : "";

  // Counted from the first job in the CV, so it can't go stale. Without it,
  // "how many years of experience" gets answered with one employer's tenure.
  const firstRole = cv.experience?.[cv.experience.length - 1];
  const startedYear = Number(String(firstRole?.start || "").split("/").pop());
  const years = startedYear ? new Date().getUTCFullYear() - startedYear : null;
  const experience = years
    ? `Total experience: ${years} years as a developer, since ${startedYear}.`
    : "";

  return normalizeText(
    `Name: ${NAME}\nLast name: ${lastName}\nTitle: ${JOB_TITLE}\n${currentRole}\n${experience}\nBio: ${SITE_DESCRIPTION}`
  );
}

async function buildCorpus() {
  const docs = [];

  const profileText = buildProfileText();
  if (profileText) {
    docs.push({
      source: "profile",
      title: "Profile",
      text: profileText,
    });
  }

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

  const aboutText = loadNextPageText(path.join("pages", "about.js"));
  if (aboutText) {
    docs.push({
      source: "about",
      title: "About",
      text: aboutText,
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

  const cvDataOnly = loadSourceText(path.join("src", "cv", "cv.ts"));
  if (cvDataOnly) {
    docs.push({
      source: "cv_data",
      title: "CV data",
      text: cvDataOnly,
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

const escapeForRegExp = (term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Matches whole words, and treats a plural and its singular as the same word, so
// "collections" finds "collection" and "Tomorrow's" is found by "tomorrows"
function countTerm(hay, term) {
  const stem = term.length > 3 && term.endsWith("s") ? term.slice(0, -1) : term;
  const pattern = new RegExp(`\\b${escapeForRegExp(stem)}(?:'?s)?\\b`, "g");
  return (hay.match(pattern) || []).length;
}

// How much each term of the question is worth. A word that appears on nearly
// every page ("what", "built") says little about what was asked; a word that
// appears on one page ("collections", "mixpanel") says almost everything. Without
// this, long blog posts outrank the one page that actually answers the question.
function termWeights(corpus, terms) {
  const total = corpus.length || 1;
  const weights = new Map();
  for (const term of terms) {
    const inChunks = corpus.reduce((count, chunk) => count + (countTerm(chunk.text.toLowerCase(), term) ? 1 : 0), 0);
    weights.set(term, Math.log((total + 1) / (inChunks + 1)) + 0.1);
  }
  return weights;
}

function scoreChunk(chunkText, terms, weights) {
  const hay = chunkText.toLowerCase();
  let score = 0;
  for (const term of terms) {
    // Saying a word twice says a chunk is about it; saying it ten times doesn't
    // make it more so, and lets long pages bury the one that answers
    const hits = Math.min(countTerm(hay, term), 2);
    score += hits * (weights?.get(term) ?? 1);
  }
  return score;
}

function expandQueryTerms(terms) {
  const expanded = new Set(terms);
  const hasAny = (arr) => arr.some((t) => expanded.has(t));

  if (
    hasAny([
      "who",
      "about",
      "yourself",
      "bio",
      "background",
      "experience",
      "summary",
      "introduce",
    ])
  ) {
    [
      "tech",
      "lead",
      "frontend",
      "engineer",
      "developer",
      "react",
      "javascript",
      "typescript",
      "projects",
      "work",
      "leadership",
      "olio",
    ].forEach((t) => expanded.add(t));
  }

  if (hasAny(["project", "projects", "portfolio", "work", "built", "building"])) {
    ["work", "projects", "react", "frontend", "leadership", "olio"].forEach((t) =>
      expanded.add(t)
    );
  }

  // A recruiter asks for the hardest thing you've built, not for a project by name
  if (hasAny(["complex", "complicated", "hardest", "toughest", "challenging", "biggest", "proud", "proudest", "difficult"])) {
    ["rebuild", "architecture", "migration", "scheduling", "platform", "flags", "rollback", "app", "work"].forEach((t) =>
      expanded.add(t)
    );
  }

  // Backend questions land on the front-end pages unless the tools are named
  if (hasAny(["backend", "back-end", "server", "api", "apis", "database", "fullstack", "full-stack"])) {
    ["node", "rails", "express", "mongodb", "api", "backend", "ruby"].forEach((t) => expanded.add(t));
  }

  // Nobody asks "have you used Datadog"; they ask about monitoring or analytics
  if (hasAny(["monitoring", "monitor", "observability", "alerting", "logging", "logs", "analytics", "tracking", "errors"])) {
    ["sentry", "datadog", "cloudwatch", "mixpanel", "monitoring", "analytics", "tracking"].forEach((t) =>
      expanded.add(t)
    );
  }

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

  if (
    hasAny([
      "talk",
      "talks",
      "talked",
      "conference",
      "conferences",
      "spoke",
      "spoken",
      "speak",
      "speaks",
      "speaking",
      "speaker",
      "present",
      "presented",
      "presenting",
      "presentation",
      "presentations",
      "event",
      "events",
      "meetup",
      "meetups",
    ])
  ) {
    ["talk", "conf", "vidcon", "speaking", "presented"].forEach((t) => expanded.add(t));
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

function isTechStackQuery(query) {
  const q = (query || "").toLowerCase();
  return q.includes("tech stack") || q.includes("stack") || q.includes("technologies");
}

function looksTechHeavy(text) {
  const t = (text || "").toLowerCase();
  return (
    t.includes("react native") ||
    t.includes("react") ||
    t.includes("typescript") ||
    t.includes("javascript") ||
    t.includes("node") ||
    t.includes("jest") ||
    t.includes("cypress") ||
    t.includes("graphql")
  );
}

function pickDefaultContext(corpus, limit = 4, query = "") {
  const priority = isBlogQuery(query)
    ? ["blog_index", "blog/", "profile", "work", "home", "about", "cv", "cv_data"]
    : ["profile", "work", "home", "about", "cv", "cv_data"];
  const picked = [];

  if (isTechStackQuery(query)) {
    const techFirst = corpus
      .filter((c) =>
        c.source === "work" || c.source === "cv" || c.source.startsWith("blog/")
      )
      .filter((c) => looksTechHeavy(c.text));

    for (const c of techFirst) {
      if (picked.length >= limit) break;
      picked.push(c);
    }
  }

  for (const source of priority) {
    for (const c of corpus) {
      if (picked.length >= limit) break;
      if (source.endsWith("/") ? !c.source.startsWith(source) : c.source !== source) continue;
      if (picked.includes(c)) continue;
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
  const profileBlock = buildProfileText();
  const profileContext = profileBlock ? `[profile] ${profileBlock}` : "";

  const terms = expandQueryTerms(tokenize(query));
  const corpus = await getCorpus();

  if (terms.length === 0) {
    const top = pickDefaultContext(corpus, 6, query);
    const sources = new Set(top.map((c) => c.source));
    const merged = [
      profileContext,
      ...top
        .filter((c) => !sources.has("profile") || c.source !== "profile")
        .map((c) => `[${c.source}] ${c.text}`),
    ]
      .filter(Boolean)
      .join("\n\n");

    if (process.env.NODE_ENV !== "production") {
      console.log("[retrieval] sources:", Array.from(new Set(["profile", ...top.map((c) => c.source)])).join(", "));
    }

    return merged;
  }

  const weights = termWeights(corpus, terms);
  const scored = corpus
    .map((c) => ({ c, score: scoreChunk(c.text, terms, weights) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    // Ten rather than eight: a question like "do you have backend experience"
    // is answered by one line on a page, and it was falling just outside
    .slice(0, 10)
    .map((x) => x.c);

  if (scored.length === 0) {
    const top = pickDefaultContext(corpus, 6, query);
    const sources = new Set(top.map((c) => c.source));
    const merged = [
      profileContext,
      ...top
        .filter((c) => !sources.has("profile") || c.source !== "profile")
        .map((c) => `[${c.source}] ${c.text}`),
    ]
      .filter(Boolean)
      .join("\n\n");

    if (process.env.NODE_ENV !== "production") {
      console.log("[retrieval] sources:", Array.from(new Set(["profile", ...top.map((c) => c.source)])).join(", "));
    }

    return merged;
  }

  const merged = [profileContext, ...scored.map((c) => `[${c.source}] ${c.text}`)]
    .filter(Boolean)
    .join("\n\n");

  if (process.env.NODE_ENV !== "production") {
    console.log("[retrieval] sources:", Array.from(new Set(["profile", ...scored.map((c) => c.source)])).join(", "));
  }

  return merged;
}
