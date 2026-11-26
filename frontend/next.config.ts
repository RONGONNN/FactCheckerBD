import type { NextConfig } from 'next';
import { parsePublicEnv } from './src/lib/env';

// Fails the dev server and the build early when the environment is invalid.
parsePublicEnv({ NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers: async () => [{ source: '/:path*', headers: securityHeaders }],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
