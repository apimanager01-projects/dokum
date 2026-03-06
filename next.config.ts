import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

  async headers() {
    // Supabase project URL — used to tighten connect-src to the specific project.
    // Falls back to the wildcard if the env var isn't present at build time.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

    const connectSrc = ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co']
    if (supabaseUrl) connectSrc.push(supabaseUrl)

    // Content-Security-Policy notes:
    //   • script-src 'unsafe-inline' — required by Next.js App Router (hydration scripts).
    //     Replace with nonces for a stricter policy in the future.
    //   • style-src 'unsafe-inline'  — required by Tailwind v4 and Next.js style injection.
    //   • font-src 'self'            — next/font/google self-hosts fonts at build time;
    //     no external font CDN request is made at runtime.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      `connect-src ${connectSrc.join(' ')}`,
      "font-src 'self'",
      "img-src 'self' data: blob:",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the app from being embedded in iframes (clickjacking defence)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from MIME-sniffing the Content-Type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Only send the origin as the referrer on cross-origin navigations
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features the app does not use
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Enforce HTTPS for 2 years (omit `preload` until the domain is registered
          // at hstspreload.org and you are ready to commit permanently to HTTPS-only)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
};

export default nextConfig;
