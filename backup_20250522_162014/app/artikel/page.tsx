'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';
import type { Artikel } from '@/app/types/artikel';
import Footer from '../components/Footer'

export default function Artikel() {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingArticle, setEditingArticle] = useState<Artikel | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Ambil daftar penulis & kategori unik untuk filter
  const penulisList = Array.from(new Set(articles.map(a => a.penulis).filter(Boolean)));
  const kategoriList = Array.from(new Set(articles.map(a => a.kategori).filter(Boolean)));

  useEffect(() => {
    async function checkSession() {
      try {
        setCheckingAuth(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email === 'omahhukum.jatim@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  // Tambahkan listener untuk perubahan status auth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email === 'omahhukum.jatim@gmail.com') {
        setIsAdmin(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Gagal mengambil data artikel: ' + error.message);
      }

      if (!data) {
        console.error('No data returned from fetch');
        throw new Error('Gagal mengambil data artikel: Tidak ada data yang ditemukan');
      }

      console.log('Fetched articles:', data);
      setArticles(data);
    } catch (err: any) {
      console.error('Error in fetchArticles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
      window.location.reload();
    } catch (err) {
      console.error('Error during logout:', err);
    }
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
      matchDate = Boolean(matchDate && a.created_at && new Date(a.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
      matchDate = Boolean(matchDate && a.created_at && new Date(a.created_at) <= new Date(dateTo + 'T23:59:59'));
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

  async function handleEdit(article: Artikel) {
    setEditingArticle(article);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;

    setEditLoading(true);
    setError('');

    try {
      // Verifikasi session admin terlebih dahulu
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Gagal memverifikasi session: ' + sessionError.message);
      }

      if (!session || session.user.email !== 'omahhukum.jatim@gmail.com') {
        throw new Error('Anda tidak memiliki akses untuk mengedit artikel');
      }

      console.log('Saving article:', editingArticle);
      
      // Pastikan semua field yang diperlukan ada
      const updateData = {
        judul: editingArticle.judul,
        penulis: editingArticle.penulis,
        sumber: editingArticle.sumber,
        isi: editingArticle.isi,
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      // Coba update artikel
      const { data, error } = await supabase
        .from('artikel')
        .update(updateData)
        .eq('id', editingArticle.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating article:', error);
        throw new Error('Gagal menyimpan perubahan: ' + error.message);
      }

      if (!data) {
        console.error('No data returned from update');
        throw new Error('Gagal menyimpan perubahan: Tidak ada data yang diupdate');
      }

      console.log('Update successful:', data);

      // Refresh data artikel
      await fetchArticles();
      setEditingArticle(null);
    } catch (err: any) {
      console.error('Error in handleSaveEdit:', err);
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="mb-4 text-center">
        <span className={`px-4 py-2 rounded-lg font-semibold ${isAdmin ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Anda sedang dalam mode : {isAdmin ? 'Admin' : 'User'}
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 items-center mb-8">
          <div></div>
          <h1 className="text-3xl font-bold text-slate-900 text-center">Artikel</h1>
          <div className="flex justify-end">
            {!checkingAuth && isAdmin && (
              <Link
                href="/artikel/tambah"
                className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Artikel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Artikel Hukum</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Temukan berbagai artikel hukum yang informatif dan bermanfaat<br />
              untuk menambah wawasan hukum Anda
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Artikel</h2>
              <button
                onClick={() => setEditingArticle(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  value={editingArticle.judul}
                  onChange={(e) => setEditingArticle({...editingArticle, judul: e.target.value})}
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
                  value={editingArticle.penulis}
                  onChange={(e) => setEditingArticle({...editingArticle, penulis: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sumber
                </label>
                <input
                  type="text"
                  value={editingArticle.sumber}
                  onChange={(e) => setEditingArticle({...editingArticle, sumber: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Isi Artikel
                </label>
                <textarea
                  value={editingArticle.isi}
                  onChange={(e) => setEditingArticle({...editingArticle, isi: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={10}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors ${
                    editLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <select
              value={filterPenulis}
              onChange={(e) => setFilterPenulis(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">Semua Penulis</option>
              {penulisList.map((penulis) => (
                <option key={penulis} value={penulis}>
                  {penulis}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-4 text-slate-600">Memuat artikel...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {a.gambar && (
                    <div className="relative h-48">
                      <Image
                        src={a.gambar}
                        alt={a.judul}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        quality={75}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(a.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                      {a.judul}
                    </h2>
                    <div className="flex items-center text-sm text-slate-600 mb-4">
                      <div className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{a.penulis}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>{
                          a.sumber.startsWith('http') ? (
                            <a 
                              href={a.sumber} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {new URL(a.sumber).hostname.replace('www.', '')}
                            </a>
                          ) : a.sumber
                        }</span>
                      </div>
                    </div>
                    <div className="text-slate-600 text-justify h-24 overflow-hidden">
                      {a.isi.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-2 line-clamp-2">
                          {paragraph}
                        </p>
                      )).slice(0, 2)}
                      {a.isi.split('\n').length > 2 && (
                        <p className="text-blue-900 font-medium">...</p>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link 
                        href={`/artikel/${a.id}`}
                        className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700 transition-colors"
                      >
                        Baca Selengkapnya
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {!checkingAuth && isAdmin && (
                        <button
                          onClick={() => handleEdit(a)}
                          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Butuh Konsultasi Hukum?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">Tim ahli kami siap membantu menyelesaikan permasalahan hukum Anda dengan solusi yang tepat</p>
          <Link 
            href="/konsultasi" 
            className="bg-white text-blue-900 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 inline-block"
          >
            Konsultasi Sekarang
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
} 