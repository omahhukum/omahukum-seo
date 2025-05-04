import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <Image
            alt="Foto Khotim"
            src="/foto_chotim.jpg"
            width={120}
            height={120}
            className="rounded-full border-2 border-blue-700 shadow-md object-cover"
            style={{ background: '#fff', padding: 2 }}
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">Omah Hukum</h1>
            <p className="text-lg font-semibold text-blue-700 mb-1">Khotim, SH, c.me</p>
            <p className="text-sm text-gray-600">Advokat & Konsultan Hukum di Mojokerto, Jawa Timur</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Profil</h2>
          <ul className="mb-2">
            <li><b>Nama:</b> Khotim, SH, c.me</li>
            <li><b>Alamat:</b> FGGQ+7G Belahantengah, Mojokerto Regency, East Java</li>
            <li><b>Email:</b> <a href="mailto:omahhukum.jatim@gmail.com" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition">📧 omahhukum.jatim@gmail.com</a></li>
          </ul>
          <p className="mb-2">Anggota <a href="https://peradi.or.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition">Perhimpunan Advokat Indonesia (PERADI)</a>.</p>
          <p className="mb-2">Kantor kami didukung oleh professional muda penuh talenta dan ahli di bidangnya yang siap menjadi mitra pendukung Anda maupun untuk Perusahaan. Dengan tim advokat yang handal, profesional, dan berintegritas, kami telah berpengalaman dalam menyelesaikan berbagai perkara hukum di Indonesia, seperti <a href="https://peraturan.bpk.go.id/Details/25029/uu-no-1-tahun-1946" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">hukum pidana</a>, <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">hukum perdata</a>, <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">hukum waris</a>, <a className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" href="/artikel/1">perceraian</a>, <a className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" href="/artikel/1">gono gini</a>, <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">hukum agraria</a>. Kami berkomitmen untuk selalu menyelesaikan permasalahan dengan cepat, damai, dan tepat sasaran.</p>
          <p className="mb-2">Omah Hukum merupakan solusi untuk Anda yang sedang mencari layanan jasa hukum terbaik dan terpercaya. Kami selalu siap untuk memberikan bantuan hukum atas berbagai sengketa hukum yang menimpa Anda. Selesaikan permasalahan hukum Anda bersama kami.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Layanan</h2>
          <ul className="list-disc ml-6">
            <li>Konsultasi <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">hukum perdata</a> & <a href="https://peraturan.bpk.go.id/Details/25029/uu-no-1-tahun-1946" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">pidana</a></li>
            <li>Permasalahan <a className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" href="/artikel/1">harta bersama (gono-gini)</a></li>
            <li>Proses <a className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" href="/artikel/1">perceraian</a></li>
            <li>Sengketa <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">lahan & tanah</a></li>
            <li>Permasalahan <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">outsourcing perusahaan</a></li>
            <li>Isu <a href="https://peradi.or.id" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition" target="_blank">ketenagakerjaan, HRD, dan SDM perusahaan</a></li>
            <li>Permasalahan hukum lainnya</li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Kontak</h2>
          <ul>
            <li><Image alt="Email" src="/gmail.png" width={18} height={18} className="inline align-text-bottom mr-1" /> Email: <a href="mailto:omahhukum.jatim@gmail.com" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition">omahhukum.jatim@gmail.com</a></li>
            <li>☎️ Telepon/Fax: <a href="tel:+6281225425169" className="text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition">+62 812-2542-5169</a></li>
            <li><Image alt="Whatsapp" src="/wa.png" width={18} height={18} className="inline align-text-bottom mr-1" /> Whatsapp: <a href="https://wa.me/6281225425169" target="_blank" rel="noopener noreferrer" className="text-green-600 underline hover:text-green-800 hover:drop-shadow-md transition">+62 812-2542-5169</a></li>
            <li>Alamat: FGGQ+7G Belahantengah, Mojokerto Regency, East Java</li>
          </ul>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/artikel" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Blog/Artikel</Link>
          <Link href="/konsultasi" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Konsultasi Hukum</Link>
          <Link href="/buku-tamu" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Buku Tamu</Link>
          <Link href="/review" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Review</Link>
        </div>
      </div>
    </main>
  )
}
