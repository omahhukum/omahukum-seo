'use client'

import Link from 'next/link'

export default function DokumenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              📝 Pembuatan & Review Dokumen Hukum
            </h1>
            <p className="text-2xl text-blue-900 font-medium">
              Layanan Penyusunan Dokumen Hukum<br />
              yang Profesional & Terpercaya
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Deskripsi Layanan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Kami menyediakan layanan pembuatan dan peninjauan dokumen hukum secara menyeluruh untuk memastikan setiap dokumen yang Anda miliki sah secara hukum, melindungi kepentingan Anda, dan sesuai dengan ketentuan yang berlaku.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Jenis Dokumen yang Kami Tangani:
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Surat Kuasa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Perjanjian/Kontrak (Kerjasama, Sewa, Jual-Beli, Kerja, dll.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Surat Gugatan & Jawaban</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Surat Somasi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Akta Perjanjian</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Legal Opinion (Pendapat Hukum)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Surat Pernyataan dan dokumen hukum lainnya</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Keunggulan Layanan Kami:
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Ditangani oleh tim hukum berpengalaman</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Disesuaikan dengan kebutuhan dan situasi hukum Anda</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Mencegah risiko hukum di kemudian hari</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Proses cepat, akurat, dan transparan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  <span>Seluruh data dan dokumen Anda dijamin kerahasiaannya</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Proses Layanan:
              </h2>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li>Konsultasi kebutuhan dokumen</li>
                <li>Penyusunan/review oleh tim hukum profesional</li>
                <li>Revisi jika diperlukan</li>
                <li>Finalisasi dan serah dokumen</li>
              </ol>
            </section>

            <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
              <p className="text-lg text-gray-700 mb-6">
                🔒 Setiap informasi dan dokumen yang Anda sampaikan akan dijaga kerahasiaannya sesuai kode etik profesi hukum.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+pembuatan+dokumen+dengan+Omah+Hukum+terkait+%5BJenis+Dokumen%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  📩 Kirim Dokumen
                </Link>
                <Link 
                  href="/konsultasi"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg"
                >
                  📅 Jadwalkan Konsultasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 