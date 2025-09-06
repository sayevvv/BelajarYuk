import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        // Basic security headers
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-DNS-Prefetch-Control', value: 'off' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        // A conservative CSP; tweak as needed if you add inline scripts/fonts
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'", 
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com", // allow Next dev and GA if used
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https: http: ws: wss:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
  // Force browsers that request /favicon.ico directly to use the mascot PNG
  redirects: async () => [
    {
      source: '/favicon.ico',
      destination: '/assets/mascot.png?v=3',
      permanent: false, // temporary to avoid sticky caches; switch to true later
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Izinkan semua path dari hostname ini
      },
      {
        protocol: 'https',
  hostname: 'images.unsplash.com',
  pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
  hostname: 'picsum.photos',
  pathname: '/**',
      },
    ],
  },
};

export default nextConfig;