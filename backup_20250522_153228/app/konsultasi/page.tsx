import { generateMetadata as generatePageMetadata } from '../metadata'
import BreadcrumbJsonLd from '../components/BreadcrumbJsonLd'
import KonsultasiClient from './KonsultasiClient'
import Footer from '../components/Footer'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Konsultasi Hukum Profesional di Mojokerto',
    description: 'Layanan konsultasi hukum profesional di Mojokerto dengan tim pengacara berpengalaman. Konsultasi hukum perdata, pidana, keluarga, dan bisnis dengan harga terjangkau.',
    keywords: 'konsultasi hukum Mojokerto, pengacara Mojokerto, bantuan hukum Mojokerto, konsultan hukum murah Mojokerto'
  })
}

export default function KonsultasiPage() {
  const breadcrumbItems = [
    { name: 'Beranda', item: 'https://omahhukum.com' },
    { name: 'Konsultasi Hukum', item: 'https://omahhukum.com/konsultasi' }
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <KonsultasiClient />
      <Footer />
    </div>
  )
}
