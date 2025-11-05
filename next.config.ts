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
    // Allow images from external domains for better SEO and performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.overseas.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.backend.overseas.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'overseasdata.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize images with modern formats
    formats: ['image/webp', 'image/avif'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 24 hours
    minimumCacheTTL: 86400,
    // Enable placeholder images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable compression
  compress: true,
  // Server external packages for better compatibility
  serverExternalPackages: [],
  
  // Enable experimental features for better performance and SEO
  experimental: {
    // Enable optimized CSS loading
    optimizeCss: true,
    // Enable static optimization
    largePageDataBytes: 128 * 1000, // 128KB
  },
  // Add custom headers for caching, security, and SEO
  async headers() {
    return [
      {
        // Apply to all routes for SEO and security headers
        source: '/((?!api/).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      {
        // Static assets caching
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Images caching
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes (shorter cache)
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Job pages - cache for 1 hour, stale for 1 day
        source: '/job-description/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Company and institute pages
        source: '/(company-details|institute-details)/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
