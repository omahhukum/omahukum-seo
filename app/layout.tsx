   import './globals.css'
   import HeroHeader from './components/HeroHeader'

   export const metadata = {
     title: 'Omah Hukum',
     description: 'Konsultasi Hukum Profesional & Terpercaya',
   }

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="id">
         <body>
           <HeroHeader />
           {children}
         </body>
       </html>
     )
   }