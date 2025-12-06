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
    //  allowedDevOrigins: [
    //   "localhost:3000", 
    //   "stevie-nondiscerning-unresolutely.ngrok-free.dev",
    //   "http://192.168.2.105:3001/"
    // ],
  },

  // Turbopack config is empty by default; no Webpack needed
  turbopack: {},
};

export default nextConfig;
