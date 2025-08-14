import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds - warnings/errors should be fixed separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds for faster deployment
    ignoreBuildErrors: true,
  },
  images: {
    // Allow images from external domains if needed
    domains: [
      "www.backend.overseas.ai", 
      "backend.overseas.ai",
      "overseasdata.s3.ap-south-1.amazonaws.com",
      "images.unsplash.com",
      "ui-avatars.com",
      "cdn-icons-png.flaticon.com"
    ],
    // Optimize images
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
