const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// The date a post was written or last updated, so the sitemap doesn't claim
// every page changed at build time.
function postDates() {
  const dir = path.join(process.cwd(), 'posts');
  const dates = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    const when = data.updated || data.date;
    if (when) dates[`/blog/posts/${file.replace(/\.md$/, '')}`] = new Date(when).toISOString();
  }
  return dates;
}

const dates = postDates();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tany4.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: ['https://tany4.com/rss.xml'],
  },
  transform: async (config, url) => ({
    loc: url,
    changefreq: dates[url] ? 'monthly' : 'weekly',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: dates[url] || new Date().toISOString(),
  }),
};
