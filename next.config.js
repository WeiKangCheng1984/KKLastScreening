const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 避免與上層目錄（例如使用者家目錄）的 package-lock.json 混淆，消除 build 時的 lockfile 警告
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async redirects() {
    return [{ source: '/favicon.ico', destination: '/icon', permanent: false }];
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

