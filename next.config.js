/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.codewars.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www\\.(?<host>.+)' }],
        destination: 'https://:host/:path*',
        permanent: true,
      },
      // Hosts that terminate TLS in front of the app send the original protocol here
      {
        source: '/:path*',
        has: [
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
          { type: 'host', value: '(?<host>.+)' },
        ],
        destination: 'https://:host/:path*',
        permanent: true,
      },
      // The posts used to live one level up, and search engines and old links still
      // ask for them there
      {
        source: '/posts/:id',
        destination: '/blog/posts/:id',
        permanent: true,
      },
      // There was a page of GitHub statistics; the work page is what replaced it
      {
        source: '/github',
        destination: '/work',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/:path*.:ext(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Expires',
            value: 'Thu, 31 Dec 2099 23:59:59 GMT',
          },
        ],
      },
      // The CV keeps one address and changes with every build, so browsers check it is
      // current each time instead of keeping it for a year. Older links with a version in
      // the query string still reach the same file, and the canonical names this address.
      {
        source: '/TaniaPapazafeiropoulou-CV.pdf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Link',
            value: '<https://tany4.com/TaniaPapazafeiropoulou-CV.pdf>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig
