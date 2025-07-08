const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config here
  experimental: {
    // Add any experimental features you're using
  },
}

module.exports = withBundleAnalyzer(nextConfig)