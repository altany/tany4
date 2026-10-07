#!/usr/bin/env node
// Writes public/llms.txt, the plain-text summary AI assistants ask for when they land
// on the site. Built from the CV and the posts, like the feed, so it can't fall behind
// what the pages say. Runs as part of the build, before next build.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_URL = "https://tany4.com";

// The CV is TypeScript, so read the few fields needed rather than importing it
const cvSource = fs.readFileSync(path.join(process.cwd(), "src/cv/cv.ts"), "utf8");
const field = (name) => {
  const match = cvSource.match(new RegExp(`${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return match ? match[1].replace(/\\"/g, '"') : "";
};

const title = field("title");
const summary = field("summary");

const posts = fs
  .readdirSync(path.join(process.cwd(), "posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const { data } = matter(fs.readFileSync(path.join(process.cwd(), "posts", file), "utf8"));
    return { id: file.replace(/\.md$/, ""), ...data };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const line = (post) =>
  `- [${post.title}](${SITE_URL}/blog/posts/${post.id}): ${post.description || ""}`;

const llms = `# Tania Papazafeiropoulou

> ${title}. ${summary}

This is her personal site: what she has built, how she works, and what she writes about.
Everything here is written by her. The CV is the authoritative record of where she has
worked and when.

## Pages

- [Home](${SITE_URL}/): who she is, in short.
- [Work](${SITE_URL}/work): the projects, what she built on each and what changed as a result.
- [CV](${SITE_URL}/cv): roles, dates, employers and skills. Also available as a [PDF](${SITE_URL}/TaniaPapazafeiropoulou-CV.pdf).
- [Blog](${SITE_URL}/blog): ${posts.length} posts, newest first.
- [About](${SITE_URL}/about): the non-work part.

## Writing

${posts.map(line).join("\n")}

## Contact

hello@tany4.com. She is open to being contacted about work.
`;

fs.writeFileSync(path.join(process.cwd(), "public", "llms.txt"), llms);
console.log(`Wrote public/llms.txt with ${posts.length} posts`);
