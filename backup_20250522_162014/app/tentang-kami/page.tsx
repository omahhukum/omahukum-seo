import { generateMetadata as generatePageMetadata } from '../metadata'
import BreadcrumbJsonLd from '../components/BreadcrumbJsonLd'
import OptimizedImage from '../components/OptimizedImage'
import Footer from '../components/Footer'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Tentang Omah Hukum - Konsultan Hukum Terpercaya di Mojokerto',
    description: 'Omah Hukum adalah kantor hukum profesional di Mojokerto yang menyediakan layanan konsultasi hukum, pendampingan hukum, dan bantuan hukum dengan tim pengacara berpengalaman.',
    keywords: 'tentang Omah Hukum, sejarah Omah Hukum, tim pengacara Mojokerto, konsultan hukum Mojokerto, bantuan hukum Mojokerto'
  })
}

export default function TentangKamiPage() {
  const breadcrumbItems = [
    { name: 'Beranda', item: 'https://omahhukum.com' },
    { name: 'Tentang Kami', item: 'https://omahhukum.com/tentang-kami' }
  ]

  const tim = [
    {
      nama: 'Anton M',
      jabatan: 'Pendiri & Pengacara Utama',
      deskripsi: 'Pengacara berpengalaman dengan spesialisasi di bidang hukum perdata dan pidana',
      gambar: '/team/anton.jpg'
    },
    {
      nama: 'Tim Pengacara',
      jabatan: 'Tim Hukum',
      deskripsi: 'Tim pengacara profesional dengan berbagai spesialisasi hukum',
      gambar: '/team/lawyers.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tentang Omah Hukum
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Konsultan hukum profesional di Mojokerto yang siap membantu menyelesaikan permasalahan hukum Anda
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visi</h2>
            <p className="text-gray-600">
              Menjadi kantor hukum terpercaya yang memberikan layanan hukum profesional dan terjangkau bagi masyarakat Mojokerto
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Misi</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Memberikan layanan hukum yang profesional dan berkualitas</li>
              <li>• Menjaga kepercayaan dan kepuasan klien</li>
              <li>• Mengutamakan kejujuran dan integritas dalam setiap penanganan kasus</li>
              <li>• Berperan aktif dalam peningkatan kesadaran hukum masyarakat</li>
            </ul>
          </div>
        </div>

        {/* Tim Kami */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Tim Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tim.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <OptimizedImage
                    src={member.gambar}
                    alt={member.nama}
                    width={400}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.nama}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.jabatan}</p>
                  <p className="text-gray-600">{member.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Butuh Bantuan Hukum?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Tim pengacara profesional kami siap membantu menyelesaikan permasalahan hukum Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Konsultasi via WhatsApp
              </a>
              <a
                href="tel:+6281225425169"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 