import './globals.css'
import HeroHeader from './components/HeroHeader'
import JsonLd from './components/JsonLd'
import BottomNavBar from './components/BottomNavBar'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Omah Hukum - Konsultan Hukum & Mediasi di Mojokerto',
  description: 'Konsultan hukum profesional di Mojokerto yang menyediakan layanan konsultasi hukum, mediasi non-litigasi, dan pembuatan dokumen hukum. Tim ahli kami siap membantu menyelesaikan permasalahan hukum Anda.',
  keywords: 'konsultan hukum mojokerto, pengacara mojokerto, mediasi hukum, konsultasi hukum, bantuan hukum, omah hukum, jasa hukum mojokerto',
  openGraph: {
    title: 'Omah Hukum - Konsultan Hukum & Mediasi di Mojokerto',
    description: 'Konsultan hukum profesional di Mojokerto yang menyediakan layanan konsultasi hukum, mediasi non-litigasi, dan pembuatan dokumen hukum.',
    url: 'https://omahhukum.com',
    siteName: 'Omah Hukum',
    images: [
      {
        url: '/logo_omah_hukum.png',
        width: 800,
        height: 600,
        alt: 'Omah Hukum Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omah Hukum - Konsultan Hukum & Mediasi di Mojokerto',
    description: 'Konsultan hukum profesional di Mojokerto yang menyediakan layanan konsultasi hukum, mediasi non-litigasi, dan pembuatan dokumen hukum.',
    images: ['/logo_omah_hukum.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Ganti dengan kode verifikasi Google Search Console Anda
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <JsonLd />
      </head>
      <body>
        <HeroHeader />
        {children}
        <BottomNavBar />
      </body>
    </html>
  )
}