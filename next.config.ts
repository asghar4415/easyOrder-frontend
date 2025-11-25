import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
      {protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // You can add other standard Next.js options here
  reactStrictMode: true,

  // Turbopack handles SVGs automatically as static assets.
  // If you want SVGs as React components, import them like:
  // import MyIcon from './icon.svg?component'
  experimental: {
    // Optional: enable future Next.js features
    appDir: true,
  },

  // Turbopack config is empty by default; no Webpack needed
  turbopack: {},
};

export default nextConfig;
