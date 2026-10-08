import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Cache Components stays off: this app renders from an in-memory mock data
   * layer (no fetch/DB), so classic static prerendering gives us the same
   * output without forcing every dynamic segment into Suspense boundaries.
   * Admin/account routes opt into request-time rendering via `connection()`.
   */
  images: {
    qualities: [60, 75, 100],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
