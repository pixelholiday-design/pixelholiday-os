import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Image Optimization ──
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // ── Experimental Features ──
  experimental: {
    // Enable App Router if not already
    appDir: true,
    optimizePackageImports: ['@radix-ui'],
  },

  // ── Headers & Redirects ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // ── Redirects ──
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
