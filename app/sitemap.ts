import { MetadataRoute } from 'next'
import { supabase } from '../utils/supabaseClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all articles
    const { data: articles, error } = await supabase
      .from('artikel')
      .select('id, judul, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return [] // Return empty sitemap if error
    }

    // Base URL
    const baseUrl = 'https://omahhukum-jatim.vercel.app'

    // Static routes
    const staticRoutes = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/artikel`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/konsultasi`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/mediasi`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ]

    // Article routes
    const articleRoutes = articles?.map((article) => ({
      url: `${baseUrl}/artikel/${article.id}`,
      lastModified: new Date(article.created_at).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

    return [...staticRoutes, ...articleRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [] // Return empty sitemap if error
  }
} 