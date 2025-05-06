import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditArtikelClient from './EditArtikelClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Artikel {
  id: number;
  judul: string;
  penulis: string;
  sumber: string;
  isi: string;
  gambar: string;
  created_at: string;
}

export async function generateStaticParams() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: articles } = await supabase
    .from('artikel')
    .select('id');

  return articles?.map((article: { id: number }) => ({
    id: article.id.toString(),
  })) || [];
}

export default async function EditArtikelPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  // Cek session
  const { data: { session } } = await supabase.auth.getSession();
  console.log('EditArtikelPage - Session:', session);

  if (!session) {
    console.log('EditArtikelPage - No session found, redirecting to login');
    redirect('/login');
  }

  // Cek email admin
  if (session.user.email !== 'omahhukum.jatim@gmail.com') {
    console.log('EditArtikelPage - Not admin email, redirecting to dashboard');
    redirect('/dashboard');
  }

  // Fetch artikel data
  const { data: artikel, error } = await supabase
    .from('artikel')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !artikel) {
    console.error('EditArtikelPage - Error fetching article:', error);
    redirect('/artikel');
  }

  return <EditArtikelClient artikel={artikel} />;
} 