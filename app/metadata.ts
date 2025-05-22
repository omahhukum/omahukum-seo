import { Metadata } from 'next'
import { seoKeywords } from './config/seo-keywords'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omahhukum.com'

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
}: {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}): Metadata {
  const defaultTitle = 'Omah Hukum - Konsultasi Hukum Profesional & Terpercaya di Mojokerto'
  const defaultDescription = 'Layanan konsultasi hukum profesional, mediasi, dan bantuan hukum terpercaya di Mojokerto. Tim pengacara berpengalaman siap membantu masalah hukum Anda dengan harga terjangkau.'
  const defaultKeywords = [
    ...seoKeywords.general,
    ...seoKeywords.services,
    ...seoKeywords.affordable,
    ...seoKeywords.locations
  ].join(', ')
  const defaultOgImage = '/logo_omah_hukum.png'

  return {
    metadataBase: new URL(BASE_URL),
    title: title ? `${title} | Omah Hukum Mojokerto` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    openGraph: {
      title: title ? `${title} | Omah Hukum Mojokerto` : defaultTitle,
      description: description || defaultDescription,
      type: 'website',
      locale: 'id_ID',
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: 'Omah Hukum - Konsultasi Hukum di Mojokerto',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | Omah Hukum Mojokerto` : defaultTitle,
      description: description || defaultDescription,
      images: [ogImage || defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'cXODJnu2xYwOxIngkVFceEOLR_vj_CzTDOnp3UhRTVc',
    },
    alternates: {
      canonical: 'https://omahhukum.com',
    },
  }
} 