/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['img2.baidu.com']
  }
}

const removeImports = require('next-remove-imports')();

module.exports = removeImports(nextConfig)
