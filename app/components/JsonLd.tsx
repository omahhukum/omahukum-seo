export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Omah Hukum",
    "image": "/logo_omah_hukum.png",
    "description": "Konsultan hukum profesional di Mojokerto yang menyediakan layanan konsultasi hukum, mediasi non-litigasi, dan pembuatan dokumen hukum.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jurangsari, Belahantengah",
      "addressLocality": "Mojosari",
      "addressRegion": "Jawa Timur",
      "postalCode": "61382",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-7.5200",
      "longitude": "112.5500"
    },
    "url": "https://omahhukum-jatim.vercel.app",
    "telephone": "+6281225425169",
    "email": "omahhukum.jatim@gmail.com",
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-17:00",
    "sameAs": [
      "https://www.instagram.com/omahhukum",
      "https://www.facebook.com/omahhukum"
    ],
    "areaServed": {
      "@type": "City",
      "name": "Mojokerto"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Layanan Hukum",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Konsultasi Hukum",
            "description": "Konsultasi hukum profesional untuk berbagai permasalahan hukum"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mediasi Non-litigasi",
            "description": "Fasilitasi penyelesaian sengketa secara damai"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pembuatan Dokumen Hukum",
            "description": "Pembuatan dan review dokumen hukum"
          }
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 