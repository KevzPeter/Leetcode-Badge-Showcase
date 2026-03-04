/** @type {import('next').NextConfig} */
const buildOutput = process.env.NEXT_BUILD_OUTPUT
const output = buildOutput === 'standalone' || buildOutput === 'export' ? buildOutput : undefined

const nextConfig = {
  images: {
    domains: ['leetcode.com'],
  },
  reactStrictMode: false,
  swcMinify: true,
  ...(output ? { output } : {}),
}

module.exports = nextConfig

