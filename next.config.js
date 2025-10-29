/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export to avoid build issues
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
