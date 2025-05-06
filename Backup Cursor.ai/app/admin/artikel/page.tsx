'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminArtikel() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [penulis, setPenulis] = useState('');
  const [kategori, setKategori] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [gambarUrl, setGambarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkAccess() {
      // Hanya jalan di browser, bukan saat build
      if (typeof window !== 'undefined') {
        const isAdmin = localStorage.getItem('isAdmin');
        const { data } = await supabase.auth.getSession();
        if (!data.session || isAdmin !== '1') {
          router.replace('/admin/login');
        } else {
          setChecking(false);
        }
      }
    }

    checkAccess();
  }, [router]);

  function handleGambarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setGambar(file);
    if (file) {
      setGambarUrl(URL.createObjectURL(file));
    } else {
      setGambarUrl('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    let gambarPath = '';

    if (gambar) {
      const fileExt = gambar.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('artikel')
        .upload(fileName, gambar);
      if (uploadError) {
        setError('Gagal upload gambar.');
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('artikel').getPublicUrl(fileName);
      gambarPath = urlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('artikel').insert({
      judul: title,
      isi: content,
      penulis,
      kategori,
      gambar: gambarPath,
    });

    setLoading(false);
    if (insertError) {
      setError('Gagal menyimpan artikel.');
    } else {
      setSuccess('Artikel berhasil disimpan!');
      setTitle('');
      setContent('');
      setPenulis('');
      setKategori('');
      setGambar(null);
      setGambarUrl('');
    }
  }

  if (checking) {
    return <div className="text-center py-12">Memeriksa akses admin...</div>;
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Tambah Artikel (Admin)</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Judul Artikel</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Penulis</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Gambar Artikel</label>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Pilih Gambar
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleGambarChange}
          />
          <span className="text-gray-500 text-sm block">
            {gambar ? gambar.name : 'Belum ada gambar dipilih'}
          </span>
          {gambarUrl && <img src={gambarUrl} alt="Preview" className="mt-2 max-h-40 rounded" />}
        </div>
        <div>
          <label className="block mb-1 font-medium">Isi Artikel</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Artikel'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </main>
  );
}
