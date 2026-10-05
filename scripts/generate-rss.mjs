#!/usr/bin/env node
// Writes public/rss.xml from the posts, so readers and aggregators can follow
// the blog without visiting it. Runs as part of the build, before next build,
// so the file is in place when the site is served.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://tany4.com";
const TITLE = "Tania Papazafeiropoulou";
const DESCRIPTION =
  "Posts on React, React Native, AI tooling, debugging, testing, performance and engineering practices.";

const escape = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const postsDir = path.join(process.cwd(), "posts");
const items = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const { data } = matter(fs.readFileSync(path.join(postsDir, file), "utf8"));
    return { id: file.replace(/\.md$/, ""), ...data };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const entry = (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE_URL}/blog/posts/${post.id}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/posts/${post.id}</guid>
      <pubDate>${new Date(post.updated || post.date).toUTCString()}</pubDate>
      <description>${escape(post.description || "")}</description>
${(post.categories || []).map((c) => `      <category>${escape(c)}</category>`).join("\n")}
    </item>`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date(items[0]?.updated || items[0]?.date || Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items.map(entry).join("\n")}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);
console.log(`Wrote public/rss.xml with ${items.length} posts`);
