'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Artikel {
  id: number;
  judul: string;
  penulis: string;
  sumber: string;
  isi: string;
  gambar: string;
  created_at: string;
}

export default function EditArtikelClient({ artikel }: { artikel: Artikel }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [judul, setJudul] = useState(artikel.judul);
  const [penulis, setPenulis] = useState(artikel.penulis);
  const [sumber, setSumber] = useState(artikel.sumber);
  const [sumberLainnya, setSumberLainnya] = useState('');
  const [isi, setIsi] = useState(artikel.isi);
  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarPreview, setGambarPreview] = useState<string>(artikel.gambar || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('EditArtikelClient - Session:', session);
        
        if (!session) {
          console.log('EditArtikelClient - No session found, redirecting to login');
          router.push('/login');
          return;
        }

        if (session.user.email === 'omahhukum.jatim@gmail.com') {
          console.log('EditArtikelClient - Admin email detected');
          setIsAdmin(true);
        } else {
          console.log('EditArtikelClient - Not admin email, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('EditArtikelClient - Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
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
    setError(null);

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
        .eq('id', artikel.id);

      if (updateError) {
        console.error('Error update:', updateError);
        throw updateError;
      }

      router.push(`/artikel/${artikel.id}`);
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
                  placeholder="Masukkan sumber artikel"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Isi Artikel
              </label>
              <div className="prose-editor">
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
                    clipboard: {
                      matchVisual: false
                    }
                  }}
                  theme="snow"
                  placeholder="Tulis isi artikel di sini..."
                  preserveWhitespace={true}
                  bounds=".prose-editor"
                  scrollingContainer="html"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gambar Artikel (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setGambar(file);
                    setGambarPreview(URL.createObjectURL(file));
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
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 