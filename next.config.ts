import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Skip TypeScript errors during build (memory constraint on VPS)
  typescript: { ignoreBuildErrors: true },

  // Speed + security
  poweredByHeader: false,
  compress: true,
  logging: { fetches: { fullUrl: false } },

  // Allow dev server access from VPS IP (update for your server)
  allowedDevOrigins: ["165.99.16.130"],

  // Image optimization - add your CDN/external domains here
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Add external image domains as needed
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // CORS headers for API routes
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
