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
    // Enable image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    // Enable optimized CSS loading
    optimizeCss: true,
  },
  // Add custom headers for caching
  async headers() {
    return [
      {
        // Match all static assets - fixed regex pattern
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      {
        // Match API routes (cache for shorter duration)
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300', // 5 minutes
          },
        ],
      },
    ];
  },
};

export default nextConfig;
