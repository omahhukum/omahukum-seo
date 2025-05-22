import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ArticleJsonLd from '../../components/ArticleJsonLd';
import BreadcrumbJsonLd from '../../components/BreadcrumbJsonLd';
import OptimizedImage from '../../components/OptimizedImage';
import { generateMetadata as generatePageMetadata } from '../../metadata';
import type { Artikel } from '../../types/artikel';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const { data: article } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!article) {
    return generatePageMetadata({});
  }

  return generatePageMetadata({
    title: article.judul,
    description: article.isi.substring(0, 160),
    keywords: article.kategori,
    ogImage: article.gambar
  });
}

export default async function ArtikelDetail({ params }: Props) {
  try {
    const { data: article } = await supabase
      .from('artikel')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!article) {
      notFound();
    }

    const breadcrumbItems = [
      { name: 'Beranda', item: 'https://omahhukum.com' },
      { name: 'Artikel', item: 'https://omahhukum.com/artikel' },
      { name: article.judul, item: `https://omahhukum.com/artikel/${article.id}` }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <ArticleJsonLd article={article} />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.judul}
            </h1>
            
            {article.gambar && (
              <div className="mb-8">
                <OptimizedImage
                  src={article.gambar}
                  alt={article.judul}
                  width={800}
                  height={400}
                  className="rounded-xl"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.isi }} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span>Penulis: {article.penulis}</span>
                  {article.sumber && (
                    <span className="ml-4">Sumber: {article.sumber}</span>
                  )}
                </div>
                <div>
                  <time dateTime={article.created_at}>
                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ArtikelDetail:', error);
    notFound();
  }
}
