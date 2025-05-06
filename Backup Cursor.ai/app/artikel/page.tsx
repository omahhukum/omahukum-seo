'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Artikel Hukum</h1>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Temukan berbagai artikel hukum yang informatif dan bermanfaat untuk menambah wawasan hukum Anda
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="mt-4">
                      <Link 
                        href={`/artikel/${a.id}`}
                        className="inline-flex items-center text-blue-900 font-medium hover:text-blue-700 transition-colors"
                      >
                        Baca Selengkapnya
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Butuh Konsultasi Hukum?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
            Tim ahli kami siap membantu menyelesaikan permasalahan hukum Anda dengan solusi yang tepat
          </p>
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
              <p className="text-slate-400">Email: omahhukum.jatim@gmail.com</p>
              <p className="text-slate-400">Telepon: +62 812-3456-7890</p>
              <p className="text-slate-400">Alamat: Jl. Raya Mojokerto No. 123, Mojokerto</p>
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
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
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