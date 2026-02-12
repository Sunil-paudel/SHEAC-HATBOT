// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export
  distDir: 'dist-widget',
  assetPrefix: '.',
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig