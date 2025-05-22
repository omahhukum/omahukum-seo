import './globals.css'
import HeroHeader from './components/HeroHeader'

export const metadata = {
  title: 'Omah Hukum - Konsultasi Hukum Profesional & Terpercaya',
  description: 'Layanan konsultasi hukum profesional, mediasi, dan bantuan hukum terpercaya di Indonesia. Tim pengacara berpengalaman siap membantu masalah hukum Anda.',
  keywords: 'konsultasi hukum, pengacara, bantuan hukum, mediasi, hukum indonesia, omah hukum',
  openGraph: {
    title: 'Omah Hukum - Konsultasi Hukum Profesional & Terpercaya',
    description: 'Layanan konsultasi hukum profesional, mediasi, dan bantuan hukum terpercaya di Indonesia.',
    type: 'website',
    locale: 'id_ID',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <HeroHeader />
        {children}
      </body>
    </html>
  )
}