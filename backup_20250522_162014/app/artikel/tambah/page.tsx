'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Fungsi untuk menghapus semua tag HTML dan menjaga baris baru/paragraf
function htmlToPlainText(html: string): string {
  // Ganti <br> dan </p> dengan newline
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '');
  // Hapus semua tag HTML lain
  text = text.replace(/<[^>]+>/g, '');
  // Decode karakter HTML
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  // Rapikan whitespace
  return text.replace(/\n{2,}/g, '\n\n').trim();
}

export default function TambahArtikel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    judul: '',
    penulis: '',
    sumber: '',
    isi: '',
    gambar: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let gambarUrl = '';

      // Upload gambar jika ada
      if (formData.gambar) {
        const fileExt = formData.gambar.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('artikel')
          .upload(fileName, formData.gambar);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('artikel')
          .getPublicUrl(fileName);

        gambarUrl = publicUrl;
      }

      // Bersihkan semua tag HTML sebelum simpan
      const plainIsi = htmlToPlainText(formData.isi);

      // Simpan artikel
      const { error: insertError } = await supabase
        .from('artikel')
        .insert([
          {
            judul: formData.judul,
            penulis: formData.penulis,
            sumber: formData.sumber,
            isi: plainIsi,
            gambar: gambarUrl,
          },
        ]);

      if (insertError) throw insertError;

      router.push('/artikel');
      router.refresh();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">Tambah Artikel Baru</h1>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="judul" className="block text-sm font-medium text-slate-700 mb-2">
                Judul Artikel
              </label>
              <input
                type="text"
                id="judul"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label htmlFor="penulis" className="block text-sm font-medium text-slate-700 mb-2">
                Penulis
              </label>
              <input
                type="text"
                id="penulis"
                value={formData.penulis}
                onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label htmlFor="sumber" className="block text-sm font-medium text-slate-700 mb-2">
                Sumber
              </label>
              <input
                type="text"
                id="sumber"
                value={formData.sumber}
                onChange={(e) => setFormData({ ...formData, sumber: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label htmlFor="gambar" className="block text-sm font-medium text-slate-700 mb-2">
                Gambar
              </label>
              <input
                type="file"
                id="gambar"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, gambar: file });
                  }
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label htmlFor="isi" className="block text-sm font-medium text-slate-700 mb-2">
                Isi Artikel
              </label>
              <div className="h-96">
                <ReactQuill
                  value={formData.isi}
                  onChange={(content) => setFormData({ ...formData, isi: content })}
                  className="h-80"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 