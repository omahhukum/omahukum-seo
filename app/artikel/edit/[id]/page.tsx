import { createClient } from '@supabase/supabase-js';
import EditArtikelClient from './EditArtikelClient';

interface Artikel {
  id: number;
  judul: string;
  penulis: string;
  sumber: string;
  isi: string;
  gambar: string;
  created_at: string;
}

// Fungsi ini akan dijalankan saat build time
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

// Komponen ini akan dijalankan saat runtime
export default function EditArtikelPage({ params }: { params: { id: string } }) {
  return <EditArtikelClient id={params.id} />;
} 