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
  async headers() {
    return [
      {
        source: '/:path*.:ext(png|jpg|jpeg|gif|webp|svg|ico|pdf)',
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
      {
        source: '/_next/static/:path*',
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
    ];
  },
};

module.exports = nextConfig