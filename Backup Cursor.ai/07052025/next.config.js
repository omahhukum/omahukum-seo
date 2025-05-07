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
  },
  // Menambahkan konfigurasi untuk menangani masalah middleware
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
  },
  // Menambahkan trailingSlash untuk Netlify
  trailingSlash: true,
}

module.exports = nextConfig