/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['cdnjs.cloudflare.com'],
  },
  // Menambahkan trailingSlash untuk Netlify
  trailingSlash: true,
  // Konfigurasi untuk menangani masalah middleware
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
    // Menambahkan konfigurasi untuk menangani masalah loading
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js', 'react-leaflet', 'leaflet'],
  },
  reactStrictMode: true,
  // Menambahkan konfigurasi untuk menangani masalah cache
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Menambahkan konfigurasi untuk menangani masalah build
  webpack: (config, { dev, isServer }) => {
    // Menambahkan fallback untuk modul yang tidak tersedia di server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
