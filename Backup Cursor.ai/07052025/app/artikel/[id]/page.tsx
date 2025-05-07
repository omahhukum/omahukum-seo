import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ArtikelDetailClient from './ArtikelDetailClient';

// Konfigurasi untuk static generation
export const dynamic = 'force-static';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fungsi untuk mendapatkan semua ID artikel
export async function generateStaticParams() {
  try {
    const { data: articles, error } = await supabase
      .from('artikel')
      .select('id');

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return articles?.map((article) => ({
      id: article.id.toString(),
    })) || [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function ArtikelDetail({ params }: { params: { id: string } }) {
  try {
    // Ambil data artikel
    const { data: article, error } = await supabase
      .from('artikel')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !article) {
      console.error('Error fetching article:', error);
      notFound();
    }

    return <ArtikelDetailClient article={article} />;
  } catch (error) {
    console.error('Error in ArtikelDetail:', error);
    notFound();
  }
} 