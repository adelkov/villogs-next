/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bcrypt": require.resolve("bcrypt"),
    }
    return config
  },
}

module.exports = nextConfig 