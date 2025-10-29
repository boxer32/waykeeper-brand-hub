/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    // Disable build traces to avoid stack overflow
    buildTrace: false
  }
}

module.exports = nextConfig
