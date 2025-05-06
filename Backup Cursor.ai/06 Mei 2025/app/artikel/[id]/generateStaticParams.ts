import { supabase } from '../../../utils/supabaseClient';

export async function generateStaticParams() {
  const { data: articles } = await supabase
    .from('artikel')
    .select('id');

  return articles?.map((article) => ({
    id: article.id.toString(),
  })) || [];
} 