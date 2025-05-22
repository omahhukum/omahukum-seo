'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <img src="/logo_omah_hukum.png" alt="Omah Hukum" width={40} height={40} className="mr-2" />
                <span className="font-bold text-xl text-blue-900">Omah Hukum</span>
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="text-blue-900 hover:text-blue-600 font-medium">Beranda</Link>
            <Link href="/artikel" className="text-blue-900 hover:text-blue-600 font-medium">Artikel</Link>
            <Link href="/konsultasi" className="text-blue-900 hover:text-blue-600 font-medium">Konsultasi</Link>
            <Link href="/buku-tamu" className="text-blue-900 hover:text-blue-600 font-medium">Buku Tamu</Link>
            <Link href="/review" className="text-blue-900 hover:text-blue-600 font-medium">Review</Link>
            <Link href="/dashboard" className="text-blue-900 hover:text-blue-600 font-medium">Dashboard</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}