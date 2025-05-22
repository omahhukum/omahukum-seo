import './globals.css'
import HeroHeader from './components/HeroHeader'
import JsonLd from './components/JsonLd'
import BottomNavBar from './components/BottomNavBar'
import { Metadata } from 'next'
import { generateMetadata } from './metadata'
import { viewport } from './viewport'

export { viewport }

export const metadata: Metadata = generateMetadata({})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <JsonLd />
      </head>
      <body>
        <HeroHeader />
        {children}
        <BottomNavBar />
      </body>
    </html>
  )
}