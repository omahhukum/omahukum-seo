import { MetadataRoute } from 'next'
import { supabase } from '../utils/supabaseClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all articles
  const { data: articles } = await supabase
    .from('artikel')
    .select('id, judul, created_at')
    .order('created_at', { ascending: false })

  // Base URL
  const baseUrl = 'https://omahhukum-jatim.vercel.app'

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/konsultasi`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mediasi`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Article routes
  const articleRoutes = articles?.map((article) => ({
    url: `${baseUrl}/artikel/${article.id}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [...staticRoutes, ...articleRoutes]
} 