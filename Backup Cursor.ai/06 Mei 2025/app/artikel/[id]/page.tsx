import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ArtikelDetailClient from './ArtikelDetailClient';

// Hapus dynamic = "force-dynamic" karena tidak kompatibel dengan static export
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fungsi untuk mendapatkan semua ID artikel
export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('artikel')
    .select('id');

  return articles?.map((article) => ({
    id: article.id.toString(),
  })) || [];
}

export default async function ArtikelDetail({ params }: { params: { id: string } }) {
  // Ambil data artikel
  const { data: article, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    notFound();
  }

  if (!article) {
    notFound();
  }

  return <ArtikelDetailClient article={article} />;
} 