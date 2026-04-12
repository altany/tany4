/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tany4.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
