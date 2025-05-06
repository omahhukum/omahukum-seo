/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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