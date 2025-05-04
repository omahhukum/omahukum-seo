'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Artikel() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editIsi, setEditIsi] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Ambil daftar penulis & kategori unik untuk filter
  const penulisList = Array.from(new Set(articles.map(a => a.penulis).filter(Boolean)));
  const kategoriList = Array.from(new Set(articles.map(a => a.kategori).filter(Boolean)));

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setIsAdmin(!!data.session);
    }
    checkSession();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('artikel')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setArticles(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    setDeleting(id.toString());
    setError('');
    const { error } = await supabase.from('artikel').delete().eq('id', id);
    setDeleting(null);
    if (error) {
      setError('Gagal menghapus artikel.');
    } else {
      setArticles(articles.filter(a => a.id !== id));
    }
  }

  function openEditModal(a: any) {
    setEditId(a.id);
    setEditJudul(a.judul);
    setEditIsi(a.isi);
  }

  function closeEditModal() {
    setEditId(null);
    setEditJudul('');
    setEditIsi('');
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setEditLoading(true);
    const { error } = await supabase.from('artikel').update({ judul: editJudul, isi: editIsi }).eq('id', editId);
    setEditLoading(false);
    if (error) {
      setError('Gagal mengupdate artikel.');
    } else {
      setArticles(articles.map(a => a.id === editId ? { ...a, judul: editJudul, isi: editIsi } : a));
      closeEditModal();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    window.location.reload();
  }

  // State untuk filter penulis & kategori
  const [filterPenulis, setFilterPenulis] = useState('');
  const [filterKategori, setFilterKategori] = useState('');

  // Filter dan pencarian
  const filteredArticles = articles.filter(a => {
    const keyword = search.toLowerCase();
    const matchKeyword = a.judul.toLowerCase().includes(keyword) || a.isi.toLowerCase().includes(keyword);
    let matchDate = true;
    if (dateFrom) {
      matchDate = matchDate && a.created_at && new Date(a.created_at) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchDate = matchDate && a.created_at && new Date(a.created_at) <= new Date(dateTo + 'T23:59:59');
    }
    let matchPenulis = true;
    if (filterPenulis) {
      matchPenulis = a.penulis === filterPenulis;
    }
    let matchKategori = true;
    if (filterKategori) {
      matchKategori = a.kategori === filterKategori;
    }
    return matchKeyword && matchDate && matchPenulis && matchKategori;
  });

  // State untuk pagination
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(filteredArticles.length / perPage);
  const paginatedArticles = filteredArticles.slice((page - 1) * perPage, page * perPage);

  // Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, dateFrom, dateTo, filterPenulis, filterKategori]);

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Artikel & Blog</h1>
      {/* Pencarian & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center flex-wrap">
        <input
          type="text"
          placeholder="Cari judul/isi artikel..."
          className="border px-3 py-2 rounded w-full sm:w-1/2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
        />
        <span className="text-gray-500">s/d</span>
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={filterPenulis}
          onChange={e => setFilterPenulis(e.target.value)}
        >
          <option value="">Semua Penulis</option>
          {penulisList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded"
          value={filterKategori}
          onChange={e => setFilterKategori(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {kategoriList.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/artikel" className="text-sm text-blue-600 underline hover:text-blue-900 hover:drop-shadow-md transition">+ Tambah Artikel (Admin)</Link>
          <button onClick={handleLogout} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Logout</button>
        </div>
      )}
      {loading ? (
        <div className="text-gray-500">Memuat artikel...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-gray-500">Tidak ditemukan.</div>
      ) : (
        <>
        <div className="space-y-6">
          {paginatedArticles.map((a) => (
            <div key={a.id} className="border rounded p-4 bg-white shadow text-left">
              {a.gambar && (
                <img src={a.gambar} alt="Gambar Artikel" className="mb-3 max-h-56 w-full object-contain rounded" />
              )}
              <details>
                <summary className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer mb-1">{a.judul}</summary>
                <div className="prose max-w-none text-gray-700 mt-1 whitespace-pre-line text-justify">{a.isi}</div>
                <div className="text-xs text-gray-400 mt-2 flex flex-wrap gap-4">
                  <span>Penulis: <span className="text-gray-700 font-semibold">{a.penulis || '-'}</span></span>
                  <span>Kategori: <span className="text-gray-700 font-semibold">{a.kategori || '-'}</span></span>
                  <span>{a.created_at && new Date(a.created_at).toLocaleString('id-ID')}</span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEditModal(a)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                      disabled={deleting === a.id.toString()}
                    >
                      {deleting === a.id.toString() ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </div>
                )}
              </details>
            </div>
          ))}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Berikutnya
            </button>
          </div>
        )}
        </>
      )}
      {/* Modal Edit Artikel */}
      {isAdmin && editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Artikel</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Judul Artikel</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={editJudul} onChange={e => setEditJudul(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Isi Artikel</label>
                <textarea className="w-full border rounded px-3 py-2" rows={8} value={editIsi} onChange={e => setEditIsi(e.target.value)} required></textarea>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={editLoading}>{editLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 