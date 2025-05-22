'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';
import type { Artikel } from '@/app/types/artikel';

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Artikel</h1>
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <a 
                href="mailto:omahhukum.jatim@gmail.com"
                className="text-slate-400 hover:text-white transition-colors block mb-2"
              >
                Email: omahhukum.jatim@gmail.com
              </a>
              <a 
                href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors block mb-2"
              >
                Telepon: +62 812-2542-5169
              </a>
              <a 
                href="https://www.google.com/maps/place/Kopi+Pallet/@-7.5257963,112.5381365,3a,90y,121.04h,78.57t/data=!3m7!1e1!3m5!1st8UYU_ren1EIDH3nZyFCkQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D11.43273643680304%26panoid%3Dt8UYU_ren1EIDH3nZyFCkQ%26yaw%3D121.04182631136442!7i16384!8i8192!4m6!3m5!1s0x2e780b1cfe756907:0xee650cef30b661d1!8m2!3d-7.5258774!4d112.5382168!16s%2Fg%2F11f62v7hhg?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors block"
              >
                Alamat: Jurangsari, Belahantengah, Kec. Mojosari, Kabupaten Mojokerto, Jawa Timur 61382
              </a>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2">
                <li><Link href="/konsultasi" className="text-slate-400 hover:text-white transition-colors">Konsultasi Hukum</Link></li>
                <li><Link href="/artikel" className="text-slate-400 hover:text-white transition-colors">Artikel Hukum</Link></li>
                <li><Link href="/buku-tamu" className="text-slate-400 hover:text-white transition-colors">Buku Tamu</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/chotim.nalinda" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://x.com/omah_hukum" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#000000] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/omahhukum_official/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#E4405F] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@omahhukum" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@omah_hukum" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#000000] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://linkbio.co/7051302BfIW6R" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#00A3FF] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zm.002 4.62c1.238 0 2.242 1.01 2.242 2.242s-1.01 2.242-2.242 2.242-2.242-1.01-2.242-2.242 1.004-2.242 2.242-2.242z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; Omah Hukum — Menyalakan harapan lewat keadilan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 