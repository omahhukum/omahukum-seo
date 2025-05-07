import Image from 'next/image'
import { FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaBalanceScale, FaHandshake, FaLandmark, FaBuilding, FaUsers, FaBriefcase } from 'react-icons/fa'

export default function ProfilSection() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profil Section */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Profil</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-56 h-56 relative rounded-full">
                  <Image
                    src="/foto_chotim.jpg"
                    alt="Khotim, SH, c.me"
                    fill
                    className="rounded-full object-cover p-4 mix-blend-multiply opacity-90"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Khotim, SH, c.me</h3>
                  <p className="text-gray-600">Anggota Perhimpunan Advokat Indonesia (PERADI)</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  <p className="text-gray-700">FGGQ+7G Belahantengah, Mojokerto Regency, East Java</p>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-600 text-xl" />
                  <p className="text-gray-700">omahhukum.jatim@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layanan Section */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Layanan</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaBalanceScale className="text-blue-600 text-xl" />
                <p className="text-gray-700">Konsultasi hukum perdata & pidana</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaHandshake className="text-blue-600 text-xl" />
                <p className="text-gray-700">Permasalahan harta bersama (gono-gini)</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaUsers className="text-blue-600 text-xl" />
                <p className="text-gray-700">Proses perceraian</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaLandmark className="text-blue-600 text-xl" />
                <p className="text-gray-700">Sengketa lahan & tanah</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaBuilding className="text-blue-600 text-xl" />
                <p className="text-gray-700">Permasalahan outsourcing perusahaan</p>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FaBriefcase className="text-blue-600 text-xl" />
                <p className="text-gray-700">Isu ketenagakerjaan, HRD, dan SDM perusahaan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi Section */}
        <div className="mt-12 bg-gray-50 p-8 rounded-xl shadow-lg">
          <p className="text-gray-700 leading-relaxed mb-6">
            Kantor kami didukung oleh professional muda penuh talenta dan ahli di bidangnya yang siap menjadi mitra pendukung Anda maupun untuk Perusahaan. Dengan tim advokat yang handal, profesional, dan berintegritas, kami telah berpengalaman dalam menyelesaikan berbagai perkara hukum di Indonesia, seperti hukum pidana, hukum perdata, hukum waris, perceraian, gono gini, hukum agraria. Kami berkomitmen untuk selalu menyelesaikan permasalahan dengan cepat, damai, dan tepat sasaran.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Omah Hukum merupakan solusi untuk Anda yang sedang mencari layanan jasa hukum terbaik dan terpercaya. Kami selalu siap untuk memberikan bantuan hukum atas berbagai sengketa hukum yang menimpa Anda. Selesaikan permasalahan hukum Anda bersama kami.
          </p>
        </div>

        {/* Kontak Section */}
        <div className="mt-12 bg-gray-50 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <FaEnvelope className="text-blue-600 text-xl" />
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-gray-800">omahhukum.jatim@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <FaPhone className="text-blue-600 text-xl" />
              <div>
                <p className="text-gray-600">Telepon/Fax</p>
                <p className="text-gray-800">+62 812-2542-5169</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <FaWhatsapp className="text-blue-600 text-xl" />
              <div>
                <p className="text-gray-600">Whatsapp</p>
                <p className="text-gray-800">+62 812-2542-5169</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 