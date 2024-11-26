/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tvsmart.vip',
      },
      {
        protocol: 'http',
        hostname: 'fanc.tmsimg.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      }
    ],
  },
}

module.exports = nextConfig