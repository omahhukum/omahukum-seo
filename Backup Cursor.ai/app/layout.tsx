import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Omah Hukum',
  description: 'Konsultan Hukum di Mojokerto, Jawa Timur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-48">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <Image
                        src="/logo_omah_hukum.png"
                        alt="Omah Hukum"
                        width={2700}
                        height={2700}
                        className="h-48 w-auto transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-2xl rounded-lg shadow-lg"
                        priority
                      />
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Beranda
                      </Link>
                      <Link href="/artikel" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Artikel
                      </Link>
                      <Link href="/konsultasi" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Konsultasi
                      </Link>
                      <Link href="/buku-tamu" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Buku Tamu
                      </Link>
                      <Link href="/review" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Review
                      </Link>
                      <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Dashboard
                      </Link>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Image
                      src="/foto_chotim.png"
                      alt="Chotim"
                      width={2700}
                      height={2700}
                      className="h-48 w-auto transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-2xl rounded-lg shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-300">Omah Hukum — Menyalakan harapan lewat keadilan.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
