import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from 'remark';
import html from 'remark-html';
import highlightCode from './highlightCode';

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => {
    // ignore files starting with "_" (drafts)
    return "_" !== fileName.charAt(0);
  });
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(highlightCode)
    .process(matterResult.content);
  const { html: contentHtml, headings } = addHeadingIds(processedContent.toString());

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    headings,
    ...matterResult.data,
  };
}

// Give each <h2> an id so the post's outline can link to it
export function addHeadingIds(html) {
  const headings = [];
  const used = new Set();
  const withIds = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (match, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim();
    let slug = text.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
    for (let n = 2; used.has(slug); n++) slug = `${slug.replace(/-\d+$/, "")}-${n}`;
    used.add(slug);
    headings.push({ id: slug, text });
    return `<h2 id="${slug}">${inner}</h2>`;
  });
  return { html: withIds, headings };
}
