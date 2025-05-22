import { Artikel } from '../types/artikel'

interface ArticleJsonLdProps {
  article: Artikel
}

export default function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.judul,
    description: article.isi.substring(0, 200), // Ambil 200 karakter pertama sebagai deskripsi
    image: article.gambar || 'https://omahhukum.com/logo_omah_hukum.png',
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: article.penulis || 'Omah Hukum',
      url: 'https://omahhukum.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Omah Hukum',
      logo: {
        '@type': 'ImageObject',
        url: 'https://omahhukum.com/logo_omah_hukum.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://omahhukum.com/artikel/${article.id}`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  )
} 