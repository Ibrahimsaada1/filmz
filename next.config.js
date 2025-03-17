/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    domains: ['image.tmdb.org'],
  },
  experimental: {
    serverActions: true,
  },
  // Enable static optimization where possible
  staticPageGenerationTimeout: 120,
}

module.exports = nextConfig 