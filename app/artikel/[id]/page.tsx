import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ArtikelDetailClient from './ArtikelDetailClient';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Params {
  id: string;
}

export default async function ArtikelDetail({ params }: { params: Params }) {
  try {
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
