'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Footer from './components/Footer'

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
})

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-slate-500">Memuat peta...</p>
    </div>
  )
})

const TestimonialSlider = dynamic(() => import('./components/TestimonialSlider'), {
  ssr: false
})

const ArticleSlider = dynamic(() => import('./components/ArticleSlider'), {
  ssr: false
})

const KonsultasiSlider = dynamic(() => import('./components/KonsultasiSlider'), {
  ssr: false
})

export default function Home() {
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    
    // Hentikan confetti setelah 14 detik
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 14000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={300}
            gravity={0.2}
            initialVelocityY={10}
            tweenDuration={10000}
            colors={[
              '#1e40af', // Biru tua
              '#1d4ed8', // Biru
              '#2563eb', // Biru cerah
              '#3b82f6', // Biru muda
              '#60a5fa', // Biru sangat muda
              '#ef4444', // Merah
              '#f97316', // Oranye
              '#f59e0b', // Kuning
              '#84cc16', // Hijau muda
              '#10b981', // Hijau
              '#14b8a6', // Tosca
              '#06b6d4', // Biru tosca
              '#8b5cf6', // Ungu
              '#d946ef', // Pink
              '#ec4899', // Pink tua
              '#f43f5e', // Merah muda
              '#22c55e', // Hijau tua
              '#eab308', // Kuning tua
              '#fbbf24', // Kuning oranye
              '#fde047'  // Kuning cerah
            ]}
            opacity={0.8}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Konsultan Hukum Profesional & Mediasi di Mojokerto
            </h1>
            <div className="prose prose-lg mx-auto text-gray-600 space-y-8">
              <div className="bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-100">
                <p className="text-2xl font-semibold text-blue-900 mb-4">Selamat Datang di Omah Hukum</p>
                <p className="text-xl font-medium text-gray-800 mb-6">Ruang Aman, Solusi Bijak untuk Setiap Masalah Hukum Anda</p>
                <div className="h-1 w-24 bg-blue-900 mx-auto mb-6 rounded-full"></div>
                <p className="text-lg leading-relaxed">
                  Di Omah Hukum, kami percaya bahwa keadilan adalah hak setiap orang—tanpa memandang latar belakang, profesi, atau kemampuan. 
                  Kami hadir sebagai sahabat hukum Anda, siap mendengar, mendampingi, dan memperjuangkan hak Anda dengan sepenuh hati.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-200">
                <p className="text-lg leading-relaxed mb-6">
                  Dengan tim profesional yang berpengalaman, kami memberikan layanan hukum yang mudah diakses, transparan, dan penuh empati. 
                  Bagi kami, setiap kasus bukan sekadar perkara hukum, tapi cerita hidup yang layak diperjuangkan dengan sepenuh hati.
                </p>
                <p className="text-xl font-medium text-blue-900 italic neon-heartbeat mb-6">
                  "Percayakan kasus Anda kepada kami, karena di Omah Hukum, Anda tidak sendiri."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Konsultan Hukum Profesional di Mojokerto
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Kami menyediakan layanan konsultasi hukum yang komprehensif dengan tim ahli yang berpengalaman.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/konsultasi" className="bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 neon-button">
                  Konsultasi Sekarang
                </Link>
                <Link 
                  href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg neon-button-green"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Konsultasi via WhatsApp
                </Link>
                <Link href="/artikel" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 neon-button-blue">
                  Baca Artikel
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-800 to-blue-900">
              <Image
                src="/logo_omah_hukum.png"
                alt="Omah Hukum"
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layanan Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Layanan Hukum Kami</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Kami menyediakan berbagai layanan hukum<br />
              untuk membantu menyelesaikan permasalahan hukum Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <Link href="/konsultasi" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 neon-button">
                Konsultasi Hukum
              </Link>
              <p className="mt-2 text-gray-600">
                Konsultasi hukum profesional untuk berbagai permasalahan hukum Anda dengan tim ahli kami.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <Link href="/mediasi" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Mediasi Non-litigasi
              </Link>
              <p className="mt-2 text-gray-600">
                Fasilitasi penyelesaian sengketa secara damai antara pihak-pihak yang berselisih dengan didampingi mediator profesional dari tim hukum kami
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <Link href="/artikel" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Artikel Hukum
              </Link>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Temukan berbagai artikel hukum yang informatif dan bermanfaat<br />
                untuk menambah wawasan hukum Anda
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <Link href="/dokumen" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Pembuatan Dokumen
              </Link>
              <p className="mt-2 text-gray-600">
                Pembuatan dan review dokumen hukum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Garis Pembatas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-1 bg-gradient-to-r from-transparent via-blue-900 to-transparent rounded-full my-16"></div>
      </div>

      {/* Testimonial Section */}
      <TestimonialSlider />

      {/* Konsultasi Section */}
      <KonsultasiSlider />

      {/* Article Section */}
      <ArticleSlider />

      {/* Garis Pembatas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-1 bg-gradient-to-r from-transparent via-blue-900 to-transparent rounded-full my-16"></div>
      </div>

      {/* Lokasi Section */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Lokasi Kantor Hukum Kami</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Kunjungi kantor kami di Mojokerto untuk konsultasi langsung
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Alamat</h3>
              <p className="text-slate-600 mb-6">
                Jurangsari, Belahantengah, Kec. Mojosari, Kabupaten Mojokerto, Jawa Timur 61382
              </p>
              <div className="space-y-4">
                <a 
                  href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +62 812-2542-5169
                </a>
                <a 
                  href="mailto:omahhukum.jatim@gmail.com"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  omahhukum.jatim@gmail.com
                </a>
              </div>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Map />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Butuh Bantuan Hukum?</h2>
          <p className="text-lg text-blue-100 mb-8 whitespace-nowrap">Tim ahli kami siap membantu menyelesaikan permasalahan hukum Anda dengan solusi yang tepat</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/konsultasi" className="bg-white text-blue-900 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 inline-block">
              Konsultasi Sekarang
            </Link>
            <Link 
              href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Konsultasi via WhatsApp
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}