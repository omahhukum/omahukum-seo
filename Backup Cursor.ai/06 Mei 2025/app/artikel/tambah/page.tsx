'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import Link from 'next/link';

export default function TambahArtikel() {
  const router = useRouter();
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [sumber, setSumber] = useState('Omah Hukum');
  const [sumberLainnya, setSumberLainnya] = useState('');
  const [isi, setIsi] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const sumberOptions = ['Omah Hukum', 'Google', 'Lainnya'];

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          router.push('/artikel');
          return;
        }

        if (session?.user?.email === 'omahhukum.jatim@gmail.com') {
          setIsAdmin(true);
        } else {
          console.log('Not admin, redirecting to artikel page');
          router.push('/artikel');
        }
      } catch (err) {
        console.error('Error in checkSession:', err);
        router.push('/artikel');
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verifikasi session admin
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Gagal memverifikasi session. Silakan login ulang.');
      }

      if (!session || session.user.email !== 'omahhukum.jatim@gmail.com') {
        throw new Error('Anda tidak memiliki akses untuk menambah artikel');
      }

      let gambarUrl = '';
      if (gambar) {
        try {
          const fileExt = gambar.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          // Upload gambar langsung ke bucket yang sudah ada
          const { error: uploadError } = await supabase.storage
            .from('artikel')
            .upload(fileName, gambar);

          if (uploadError) {
            console.error('Error upload gambar:', uploadError);
            throw new Error('Gagal mengupload gambar. Silakan coba lagi.');
          }

          // Dapatkan URL publik
          const { data: { publicUrl } } = supabase.storage
            .from('artikel')
            .getPublicUrl(fileName);

          gambarUrl = publicUrl;
        } catch (uploadErr: any) {
          console.error('Error dalam proses upload:', uploadErr);
          throw new Error('Gagal dalam proses upload gambar: ' + uploadErr.message);
        }
      }

      const sumberArtikel = sumber === 'Lainnya' ? sumberLainnya : sumber;

      // Log data yang akan disimpan
      const artikelData = {
        judul,
        penulis,
        sumber: sumberArtikel,
        isi,
        gambar: gambarUrl,
        created_at: new Date().toISOString()
      };
      console.log('Data artikel yang akan disimpan:', artikelData);

      // Coba simpan artikel
      const { data, error: insertError } = await supabase
        .from('artikel')
        .insert([artikelData])
        .select();

      if (insertError) {
        console.error('Error insert artikel:', insertError);
        if (insertError.code === '23505') {
          throw new Error('Judul artikel sudah ada. Silakan gunakan judul yang berbeda.');
        } else if (insertError.code === '23502') {
          throw new Error('Semua field wajib diisi.');
        } else if (insertError.code === '42501') {
          throw new Error('Anda tidak memiliki izin untuk menambah artikel.');
        } else {
          throw new Error(`Gagal menyimpan artikel: ${insertError.message}`);
        }
      }

      console.log('Artikel berhasil disimpan:', data);
      router.push('/artikel');
    } catch (err: any) {
      console.error('Error detail:', err);
      setError(err.message || 'Terjadi kesalahan saat menambah artikel. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Memeriksa akses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Tambah Artikel Baru</h1>
            <Link
              href="/artikel"
              className="text-blue-900 hover:text-blue-700 font-medium"
            >
              Kembali
            </Link>
          </div>

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
                {sumberOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {sumber === 'Lainnya' && (
                <input
                  type="text"
                  value={sumberLainnya}
                  onChange={(e) => setSumberLainnya(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                  required
                  placeholder="Masukkan sumber artikel"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Isi Artikel
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gambar Artikel (Opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGambar(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-medium ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Artikel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 