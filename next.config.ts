import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        // Validating Unsplash domain for external images
      },
    ],
  },
};

export default nextConfig;
