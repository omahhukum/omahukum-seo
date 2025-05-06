/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Menambahkan konfigurasi untuk menangani masalah middleware
  experimental: {
    serverComponentsExternalPackages: ['@supabase/auth-helpers-nextjs'],
  },
  // Menambahkan konfigurasi untuk menangani masalah routing
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Menambahkan konfigurasi untuk menangani halaman dinamis
  async rewrites() {
    return [
      {
        source: '/artikel/:path*',
        destination: '/artikel/:path*',
      },
      {
        source: '/konsultasi/:path*',
        destination: '/konsultasi/:path*',
      },
      {
        source: '/review/:path*',
        destination: '/review/:path*',
      },
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
    ]
  },
}

module.exports = nextConfig
