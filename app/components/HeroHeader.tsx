'use client'

import Link from 'next/link'

export default function HeroHeader() {
  return (
    <div className="bg-[#232d36] w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-56 px-8">
        {/* Logo besar di kiri */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ width: 320 }}>
          <img
            src="/logo_omah_hukum.png"
            alt="Omah Hukum"
            width={220}
            height={220}
            className="object-contain"
            style={{ margin: '0 auto' }}
          />
        </div>
        {/* Menu navigasi rata tengah */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-10">
            <Link href="/" className="text-white hover:text-yellow-300 font-semibold text-lg">Beranda</Link>
            <Link href="/artikel" className="text-white hover:text-yellow-300 font-semibold text-lg">Artikel</Link>
            <Link href="/konsultasi" className="text-white hover:text-yellow-300 font-semibold text-lg">Konsultasi</Link>
            <Link href="/buku-tamu" className="text-white hover:text-yellow-300 font-semibold text-lg">Buku Tamu</Link>
            <Link href="/review" className="text-white hover:text-yellow-300 font-semibold text-lg">Review</Link>
            <Link href="/dashboard" className="text-white hover:text-yellow-300 font-semibold text-lg">Dashboard</Link>
          </div>
        </div>
        {/* Foto Chotim di kanan */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 180 }}>
          <img
            src="/foto_chotim.png"
            alt="Khotim, SH, c.me"
            width={120}
            height={180}
            className="object-contain rounded-lg shadow-lg"
            style={{ background: 'rgba(255,255,255,0.0)' }}
          />
        </div>
      </div>
    </div>
  )
}