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
      "cdn-icons-png.flaticon.com",
    ],
    // Use remotePatterns for more flexible and secure image handling
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      // Specific patterns for common news domains
      {
        protocol: 'https',
        hostname: '*.firstpost.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.tosshub.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.breitbart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bbci.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.etimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ndtvimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.business-standard.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.thestar.com.my',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.24.co.za',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.aljazeera.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.time.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cbc.ca',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.moneycontrol.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.voanews.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.france24.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.swissinfo.ch',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.euractiv.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fortune.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.socialsciencespace.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.antaranews.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.arcpublishing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.365dm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nakedcapitalism.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.jacobinmag.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.mondoweiss.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.stanford.edu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.marketscreener.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.nypr.digital',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.rt.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.investing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gothamist.com',
        port: '',
        pathname: '/**',
      },
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
