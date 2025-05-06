import { supabase } from '../../../utils/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  const { data: artikel, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !artikel) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {artikel.gambar && (
            <div className="relative h-[400px]">
              <Image
                src={artikel.gambar}
                alt={artikel.judul}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              {artikel.judul}
            </h1>
            <div className="prose prose-lg max-w-none text-slate-600 text-justify">
              {artikel.isi.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link 
            href="/artikel" 
            className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </div>
    </div>
  );
} 