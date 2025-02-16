/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the webpack config since we're not using Edge Runtime
  experimental: {
    serverActions: {
      allowedOrigins: '*'
    }
  }
}

module.exports = nextConfig 