'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../utils/supabaseClient';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type { Artikel } from '@/app/types/artikel';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditArtikelClient({ id }: { id: string }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Artikel | null>(null);
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [sumber, setSumber] = useState('');
  const [sumberLainnya, setSumberLainnya] = useState('');
  const [isi, setIsi] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarPreview, setGambarPreview] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        if (session.user.email === 'omahhukum.jatim@gmail.com') {
          setIsAdmin(true);
        } else {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      }
    };

    const fetchArtikel = async () => {
      try {
        const { data, error } = await supabase
          .from('artikel')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setArticle(data);
        setJudul(data.judul);
        setPenulis(data.penulis);
        setSumber(data.sumber);
        setIsi(data.isi);
        setGambarPreview(data.gambar || '');
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchArtikel();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin || !article) {
    return null;
  }

  const handleContentChange = (content: string) => {
    if (!content || content === '<p><br></p>') {
      setIsi('');
      return;
    }
    setIsi(content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let gambarUrl = gambarPreview;

      if (gambar) {
        const fileExt = gambar.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('artikel')
          .upload(filePath, gambar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = await supabase.storage
          .from('artikel')
          .getPublicUrl(filePath);

        gambarUrl = publicUrl;
      }

      const cleanContent = isi.replace(/<p><br><\/p>/g, '').trim();
      
      const { error: updateError } = await supabase
        .from('artikel')
        .update({
          judul: judul.trim(),
          penulis: penulis.trim(),
          sumber: sumber === 'Lainnya' ? sumberLainnya.trim() : sumber,
          isi: cleanContent,
          gambar: gambarUrl
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push(`/artikel/${id}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal menyimpan artikel: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Artikel</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Judul Artikel
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Masukkan judul artikel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Penulis
              </label>
              <input
                type="text"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Masukkan nama penulis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sumber
              </label>
              <select
                value={sumber}
                onChange={(e) => setSumber(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih sumber</option>
                <option value="Omah Hukum">Omah Hukum</option>
                <option value="Google">Google</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {sumber === 'Lainnya' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sumber Lainnya
                </label>
                <input
                  type="text"
                  value={sumberLainnya}
                  onChange={(e) => setSumberLainnya(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Masukkan sumber lainnya"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Isi Artikel
              </label>
              <div className="prose max-w-none">
                <ReactQuill
                  value={isi}
                  onChange={handleContentChange}
                  className="h-64 mb-12"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gambar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setGambar(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setGambarPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {gambarPreview && (
                <div className="mt-4">
                  <img
                    src={gambarPreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 