/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Commented out for Vercel deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
