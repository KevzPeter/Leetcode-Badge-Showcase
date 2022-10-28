/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['leetcode.com'],
  },
  reactStrictMode: false,
  swcMinify: true,
  // uncomment the line below before building docker image
  // output: "standalone",
}

module.exports = nextConfig
