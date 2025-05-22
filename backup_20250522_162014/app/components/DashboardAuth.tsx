'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'

interface Konsultasi {
  id: string
  nama: string
  email: string
  topik: string
  pesan: string
  balasan: string | null
  created_at: string
}

interface BukuTamu {
  id: string
  nama: string
  email: string
  pesan: string
  created_at: string
}

interface Review {
  id: string
  nama: string
  rating: number
  komentar: string
  created_at: string
}

// Tambahkan array kata-kata kotor di bagian atas file, setelah import
const kataKotor = [
  'anjing', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'pantek', 'pantat',
  'pepek', 'puki', 'setan', 'sialan', 'sial', 'tolol', 'bego', 'goblok', 'babi',
  'asu', 'bajing', 'jancok', 'jancuk',
  'brengsek', 'kampret', 'tai', 'taik', 'peler', 'titit', 'kentot', 'kemem',
  'ewe', 'ewek', 'kimak', 'lancap', 'bokep', 'bencong', 'banci', 'pelacur',
  'lonte', 'cabul', 'bejat', 'ngesex', 'ngewe', 'sange', 'sangean', 'mesum',
  'maho', 'homo', 'gay', 'lesbi', 'lesbian', 'porno', 'seks', 'seksual',
  'zakar', 'penis', 'kelamin', 'kubul', 'coli', 'masturbasi',
  'fuck', 'fucking', 'fucked', 'shit', 'bullshit', 'dick', 'pussy', 'cock',
  'asshole', 'bastard', 'slut', 'whore', 'sundal', 'laknat', 'bangke',
  'keparat', 'jebleh', 'ngaceng', 'tititmu', 'kontolmu', 'memekmu', 'pepekmu',
  'bodoh', 'kamvret', 'pukimak', 'kntl', 'anjg', 'bgst', 'tae', 'taekk',
  'kintil', 'memekk', 'jembot', 'jembut', 'mek sempit', 'meki', 'selakangan',
  'selet', 'dubur', 'dobol', 'diamput', 'hancik dancik', 'mbokne hancuk',
  'dancok', 'etel', 'itil', 'kimpet', 'kimvet', 'onani', 'ngocot', 'picek',
  'matamu', 'mbokne han', 'bedes', 'garangan', 'sontoloyo', 'pejuh', 'peju',
  'kancot', 'kutang', 'suwal', 'pentil', 'toket', 'tempek', 'ondolan',
  'senok', 'germo', 'halet', 'nyen onyen', 'pokeh', 'palak', 'teles', 'cok',
  'peli', 'kunam', 'bidak', 'iq jongkok', 'vagina', 'torok'
];

// Perbaiki fungsi sensor
const sensorKataKotor = (text: string) => {
  if (!text) return text;
  let result = text;
  
  // Fungsi untuk memeriksa apakah karakter adalah huruf
  const isLetter = (char: string) => /[a-zA-Z]/.test(char);
  
  kataKotor.forEach(kata => {
    // Buat regex yang lebih fleksibel untuk mencari kata kotor
    const regex = new RegExp(`[a-zA-Z]*${kata}[a-zA-Z]*`, 'gi');
    
    result = result.replace(regex, match => {
      // Temukan posisi kata kotor dalam match
      const kataIndex = match.toLowerCase().indexOf(kata.toLowerCase());
      if (kataIndex === -1) return match;
      
      // Ganti hanya bagian kata kotor dengan bintang
      const beforeKata = match.slice(0, kataIndex);
      const afterKata = match.slice(kataIndex + kata.length);
      const stars = '*'.repeat(kata.length);
      
      return beforeKata + stars + afterKata;
    });
  });
  
  return result;
};

// Tambahkan fungsi sensorEmail setelah fungsi sensorKataKotor
const sensorEmail = (email: string) => {
  if (!email) return email;
  
  const [username, domain] = email.split('@');
  const [domainName, tld] = domain.split('.');
  
  // Sensor username
  const sensorUsername = username.charAt(0) + 
    '*'.repeat(Math.max(0, username.length - 2)) + 
    username.charAt(username.length - 1);
  
  // Sensor domain
  const sensorDomain = domainName.charAt(0) + 
    '*'.repeat(Math.max(0, domainName.length - 2)) + 
    domainName.charAt(domainName.length - 1);
  
  return `${sensorUsername}@${sensorDomain}.${tld}`;
};

export default function DashboardAuth() {
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [konsultasi, setKonsultasi] = useState<Konsultasi[]>([])
  const [bukuTamu, setBukuTamu] = useState<BukuTamu[]>([])
  const [review, setReview] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState<'konsultasi' | 'bukuTamu' | 'review'>('konsultasi')
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [editedKomentar, setEditedKomentar] = useState('')
  const [editingBalasan, setEditingBalasan] = useState<string | null>(null)
  const [editedBalasan, setEditedBalasan] = useState('')

  // Cek status admin dan muat data saat komponen dimuat
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin')
    if (adminStatus === 'true') {
      setIsAdminMode(true)
    }
    fetchData()
  }, [])

  // Muat ulang data setiap kali isAdminMode berubah
  useEffect(() => {
    if (isAdminMode) {
      fetchData()
    }
  }, [isAdminMode])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log('Memuat data dari Supabase...')
      
      const [konsultasiRes, bukuTamuRes, reviewRes] = await Promise.all([
        supabase.from('konsultasi').select('*').order('created_at', { ascending: false }),
        supabase.from('buku_tamu').select('*').order('created_at', { ascending: false }),
        supabase.from('review').select('*').order('created_at', { ascending: false })
      ])

      if (konsultasiRes.error) {
        console.error('Error konsultasi:', konsultasiRes.error)
        throw konsultasiRes.error
      }
      if (bukuTamuRes.error) {
        console.error('Error buku tamu:', bukuTamuRes.error)
        throw bukuTamuRes.error
      }
      if (reviewRes.error) {
        console.error('Error review:', reviewRes.error)
        throw reviewRes.error
      }

      console.log('Data berhasil dimuat:', {
        konsultasi: konsultasiRes.data?.length,
        bukuTamu: bukuTamuRes.data?.length,
        review: reviewRes.data?.length
      })

      setKonsultasi(konsultasiRes.data || [])
      setBukuTamu(bukuTamuRes.data || [])
      setReview(reviewRes.data || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Terjadi kesalahan saat mengambil data.')
    } finally {
      setLoading(false)
    }
  }

  // Debug state
  useEffect(() => {
    console.log('Current state:', {
      isAdminMode,
      showLoginForm,
      email,
      password,
      error,
      loading,
      konsultasi: konsultasi.length,
      bukuTamu: bukuTamu.length,
      review: review.length
    })
  }, [isAdminMode, showLoginForm, email, password, error, loading, konsultasi, bukuTamu, review])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    console.log('Login attempt:', { email, password })

    if (email !== 'omahhukum.jatim@gmail.com') {
      console.log('Invalid email')
      setError('Email tidak valid')
      return
    }

    if (password !== 'k0n5um3n7KHOTIMLAWYER') {
      console.log('Invalid password')
      setError('Password tidak valid')
      return
    }

    console.log('Login successful')
    setIsAdminMode(true)
    setShowLoginForm(false)
    localStorage.setItem('isAdmin', 'true')
    fetchData() // Muat ulang data setelah login
  }

  const handleLogout = () => {
    setIsAdminMode(false)
    localStorage.removeItem('isAdmin')
    setEmail('')
    setPassword('')
    fetchData() // Muat ulang data setelah logout
  }

  const handleEditReview = (review: Review) => {
    console.log('Editing review:', review);
    setEditingReview(review);
    setEditedKomentar(review.komentar || '');
  };

  const handleSaveEdit = async (reviewId: string) => {
    try {
      console.log('Menyimpan review:', { id: reviewId, komentar: editedKomentar });
      
      if (!editedKomentar.trim()) {
        setError('Komentar tidak boleh kosong');
        return;
      }

      const { data, error } = await supabase
        .from('review')
        .update({ 
          komentar: editedKomentar,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select();

      if (error) {
        console.error('Error saat menyimpan review:', error);
        throw error;
      }

      console.log('Response dari Supabase:', data);

      // Update state lokal
      setReview(prevReview => 
        prevReview.map(item => 
          item.id === reviewId ? { ...item, komentar: editedKomentar } : item
        )
      );

      setEditingReview(null);
      setEditedKomentar('');
      console.log('Review berhasil disimpan');
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Gagal menyimpan perubahan. Silakan coba lagi.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) return

    try {
      // Cek autentikasi Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('Tidak ada sesi autentikasi')
        setError('Anda harus login terlebih dahulu')
        return
      }

      const { error } = await supabase
        .from('review')
        .delete()
        .eq('id', reviewId)

      if (error) throw error

      // Muat ulang data setelah berhasil menghapus
      await fetchData()
    } catch (err) {
      console.error('Error deleting review:', err)
      setError('Gagal menghapus review')
    }
  }

  const handleEditBalasan = (id: string) => {
    const konsultasiItem = konsultasi.find(item => item.id === id)
    if (konsultasiItem) {
      setEditingBalasan(id)
      setEditedBalasan(konsultasiItem.balasan || '')
    }
  }

  const handleSaveBalasan = async (id: string) => {
    try {
      console.log('Menyimpan balasan:', { id, balasan: editedBalasan })
      
      if (!editedBalasan.trim()) {
        setError('Balasan tidak boleh kosong')
        return
      }

      const { data, error } = await supabase
        .from('konsultasi')
        .update({ 
          balasan: editedBalasan,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error saat menyimpan balasan:', error)
        throw error
      }

      // Update state lokal
      setKonsultasi(prevKonsultasi => 
        prevKonsultasi.map(item => 
          item.id === id ? { ...item, balasan: editedBalasan } : item
        )
      )

      setEditingBalasan(null)
      setEditedBalasan('')
      console.log('Balasan berhasil disimpan')
    } catch (err) {
      console.error('Error updating balasan:', err)
      setError('Gagal menyimpan balasan. Silakan coba lagi.')
    }
  }

  const handleDelete = async (table: 'konsultasi' | 'buku_tamu' | 'review', id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    try {
      console.log('Menghapus data:', { table, id })
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error saat menghapus data:', error)
        throw error
      }

      console.log('Data berhasil dihapus')
      await fetchData() // Muat ulang data setelah menghapus
    } catch (err) {
      console.error('Error deleting data:', err)
      setError('Gagal menghapus data')
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
                <p className="text-blue-100 text-sm mt-1">Kelola data konsultasi, buku tamu, dan review</p>
              </div>
              {!isAdminMode && !showLoginForm && (
                <button
                  onClick={() => {
                    console.log('Admin mode button clicked')
                    setShowLoginForm(true)
                  }}
                  className="bg-white text-blue-900 px-6 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg font-medium"
                >
                  Aktifkan Mode Admin
                </button>
              )}
              {isAdminMode && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-lg font-medium"
                >
                  Keluar Mode Admin
                </button>
              )}
            </div>
          </div>

          {/* Login Form */}
          {showLoginForm && (
            <div className="p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Login Admin</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                      placeholder="Masukkan email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                      placeholder="Masukkan password"
                    />
                  </div>
                  {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-md font-medium"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginForm(false)
                        setEmail('')
                        setPassword('')
                        setError('')
                      }}
                      className="flex-1 bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-all duration-200 shadow-md font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md font-medium ${
                    activeTab === 'konsultasi'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => setActiveTab('konsultasi')}
                >
                  Konsultasi ({konsultasi.length})
                </button>
                <button
                  className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md font-medium ${
                    activeTab === 'bukuTamu'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => setActiveTab('bukuTamu')}
                >
                  Buku Tamu ({bukuTamu.length})
                </button>
                <button
                  className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md font-medium ${
                    activeTab === 'review'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => setActiveTab('review')}
                >
                  Review ({review.length})
                </button>
              </div>
            </div>

            {/* Tables */}
            {activeTab === 'konsultasi' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">No</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Nama</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[10%] border-r border-slate-200">Email</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[25%] border-r border-slate-200">Pesan</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[25%] border-r border-slate-200">Balasan</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Tanggal</th>
                        {isAdminMode && <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {konsultasi.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{sensorKataKotor(item.nama)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">
                            {isAdminMode ? item.email : sensorEmail(item.email)}
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200">
                            <div className="text-sm text-slate-600 text-center whitespace-pre-wrap max-h-24 overflow-y-auto">
                              {sensorKataKotor(item.pesan)}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200">
                            {editingBalasan === item.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editedBalasan}
                                  onChange={(e) => setEditedBalasan(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                  rows={2}
                                  placeholder="Tulis balasan..."
                                />
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleSaveBalasan(item.id)}
                                    className="bg-blue-900 text-white px-4 py-1.5 rounded-lg hover:bg-blue-800 transition-all duration-200 text-sm font-medium"
                                  >
                                    Kirim
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingBalasan(null)
                                      setEditedBalasan('')
                                    }}
                                    className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-300 transition-all duration-200 text-sm font-medium"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-sm text-slate-600 text-center whitespace-pre-wrap max-h-24 overflow-y-auto">
                                  {sensorKataKotor(item.balasan || 'Belum ada balasan')}
                                </div>
                                {isAdminMode && (
                                  <div className="text-center">
                                    <button
                                      onClick={() => handleEditBalasan(item.id)}
                                      className="text-blue-900 hover:text-blue-800 text-sm font-medium"
                                    >
                                      {item.balasan ? 'Edit' : 'Tambah'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{new Date(item.created_at).toLocaleDateString()}</td>
                          {isAdminMode && (
                            <td className="px-4 py-3 whitespace-nowrap border-r border-slate-200 text-center">
                              <button
                                onClick={() => handleDelete('konsultasi', item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bukuTamu' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">No</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Nama</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[10%] border-r border-slate-200">Email</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[60%] border-r border-slate-200">Pesan</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Tanggal</th>
                        {isAdminMode && <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {bukuTamu.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{sensorKataKotor(item.nama)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">
                            {isAdminMode ? item.email : sensorEmail(item.email)}
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200">
                            <div className="text-sm text-slate-600 text-center whitespace-pre-wrap max-h-24 overflow-y-auto">
                              {sensorKataKotor(item.pesan)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{new Date(item.created_at).toLocaleDateString()}</td>
                          {isAdminMode && (
                            <td className="px-4 py-3 whitespace-nowrap border-r border-slate-200 text-center">
                              <button
                                onClick={() => handleDelete('buku_tamu', item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">No</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Nama</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Rating</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[62%] border-r border-slate-200">Pesan</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[8%] border-r border-slate-200">Tanggal</th>
                        {isAdminMode && <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-[2%] border-r border-slate-200">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {review.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{sensorKataKotor(item.nama)}</td>
                          <td className="px-4 py-3 whitespace-nowrap border-r border-slate-200 text-center">
                            <div className="flex justify-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 border-r border-slate-200">
                            {editingReview?.id === item.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editedKomentar}
                                  onChange={(e) => setEditedKomentar(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                  rows={2}
                                  placeholder="Tulis komentar..."
                                />
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => handleSaveEdit(item.id)}
                                    className="bg-blue-900 text-white px-4 py-1.5 rounded-lg hover:bg-blue-800 transition-all duration-200 text-sm font-medium"
                                  >
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingReview(null);
                                      setEditedKomentar('');
                                    }}
                                    className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-300 transition-all duration-200 text-sm font-medium"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-sm text-slate-600 text-center whitespace-pre-wrap max-h-24 overflow-y-auto">
                                  {sensorKataKotor(item.komentar || 'Tidak ada pesan')}
                                </div>
                                {isAdminMode && (
                                  <div className="text-center">
                                    <button
                                      onClick={() => handleEditReview(item)}
                                      className="text-blue-900 hover:text-blue-800 text-sm font-medium"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 border-r border-slate-200 text-center">{new Date(item.created_at).toLocaleDateString()}</td>
                          {isAdminMode && (
                            <td className="px-4 py-3 whitespace-nowrap border-r border-slate-200 text-center">
                              <button
                                onClick={() => handleDeleteReview(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Hapus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 