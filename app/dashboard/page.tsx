'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

interface Konsultasi {
  id: string;
  nama: string;
  email: string;
  topik: string;
  pesan: string;
  balasan: string | null;
  created_at: string;
}

interface BukuTamu {
  id: string;
  nama: string;
  email: string;
  pesan: string;
  created_at: string;
}

interface Review {
  id: string;
  nama: string;
  rating: number;
  komentar: string;
  created_at: string;
}

// Daftar kata kotor yang akan disensor
const kataKotor = [
  'anjing', 'anjg', 'anjgng', 'bangsat', 'bangsad', 'bangsattt', 'bajingan', 'baji', 'baji***',
  'kontol', 'kntl', 'kontl', 'kontoll', 'memek', 'memk', 'mmk', 'meki', 'ngentot', 'ngentod',
  'ngntot', 'ngentott', 'tolol', 'tll', 'tololl', 'bego', 'begoos', 'goblok', 'gblk', 'gblg',
  'goblokk', 'asu', 'asw', 'asuu', 'babi', 'b4bi', 'bab1', 'jancok', 'jancuk', 'jancoek',
  'jancog', 'jancoq', 'taik', 'tae', 'taek', 'tai', 'tahi', 'taey', 'brengsek', 'brngsk',
  'brengsk', 'setan', 'iblis', 'keparat', 'cocot', 'monyet', 'nyet', 'kambing', 'sialan',
  'bencong', 'banci', 'transeksual', 'pelacur', 'lonte', 'lontrong', 'pecun', 'perek',
  'sundal', 'kampang', 'kimak', 'kim4k', 'pantek', 'puki', 'burit', 'titit', 'titid', 'tetek',
  'tete', 'silit', 'biji', 'bijim', 'jembut', 'jembod', 'kacuk', 'itil', 'peju', 'pejuh',
  'jilmek', 'colmek', 'bokep', 'bok*p', 'mlacur', 'ml4cur', 'ngeseng', 'mbedunduk', 'raimu',
  'ndasmu', 'asemm', 'bajir', 'kentut', 'kentod', 'mlaku jancuk', 'cuki', 'cukimak', 'cukimai',
  'cukimay', 'cuk', 'cukkk', 'pantat', 'idiot', 'gila', 'otak udang', 'otak dengkul', 'njing',
  'jil', 'sarap', 'mampus', 'mati aja', 'meninggoy', 'maho', 'hombreng', 'kemplu', 'ngocok',
  'ngewe', 'njotos', 'ndasmuk', 'kucing kampung', 'lemah otak', 'setres', 'copet', 'penipu',
  'pemerkosa', 'pengentot', 'capres tolol', 'tikus berdasi', 'dasar miskin', 'torok', 'etel',
  'teles', 'kimpet', 'jembot', 'jembi', 'guo garban', 'gua garban', 'selakangan', 'bodoh',
  'kong kalikong', 'kongkalikong', 'gongpek', 'gong pek', 'gongpik', 'gong pik', 'tali bh',
  'bh', 'kunam', 'iq jongok', 'dumb', 'stupid', 'fuck', 'tempek', 'tempik'
];

// Fungsi untuk menyensor kata kotor
function sensorKataKotor(text: string | null | undefined): string {
  if (!text) return '';
  console.log('Memfilter teks:', text);
  let result = text;
  kataKotor.forEach(kata => {
    // Escape karakter khusus dalam regular expression
    const escapedKata = kata.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKata, 'gi');
    const before = result;
    result = result.replace(regex, '*'.repeat(kata.length));
    if (before !== result) {
      console.log(`Kata "${kata}" ditemukan dan disensor`);
    }
  });
  console.log('Hasil setelah filter:', result);
  return result;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [konsultasi, setKonsultasi] = useState<Konsultasi[]>([]);
  const [bukuTamu, setBukuTamu] = useState<BukuTamu[]>([]);
  const [review, setReview] = useState<Review[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'konsultasi' | 'bukuTamu' | 'review'>('konsultasi');
  const [balasan, setBalasan] = useState<Record<string, string>>({});
  const router = useRouter();

  const toggleAdminMode = () => {
    const newAdminState = !isAdmin;
    setIsAdmin(newAdminState);
    localStorage.setItem('isAdmin', String(newAdminState));
  };

  const loadKonsultasiData = async () => {
    try {
      const { data, error } = await supabase
        .from('konsultasi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error saat memuat data konsultasi:', error);
        return;
      }

      if (data) {
        const processedData = data.map(item => ({
          ...item,
          balasan: item.balasan || null
        }));
        setKonsultasi(processedData);
      }
    } catch (err) {
      console.error('Error saat memuat data:', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cek session dari localStorage
        const sessionStr = localStorage.getItem('omah-hukum-auth');
        if (!sessionStr) {
          console.log('Tidak ada session, redirect ke login');
          router.push('/login');
          return;
        }

        const session = JSON.parse(sessionStr);
        console.log('Session ditemukan:', session);

        // Cek validitas session dengan Supabase
        const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
        
        if (error || !user) {
          console.error('Error saat validasi session:', error);
          localStorage.removeItem('omah-hukum-auth');
          router.push('/login');
          return;
        }

        console.log('User valid:', user);
        
        // Cek apakah user adalah admin
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(isAdminUser);
        
        // Fetch data setelah autentikasi berhasil
        const fetchData = async () => {
          try {
            const [konsultasiRes, bukuTamuRes, reviewRes] = await Promise.all([
              supabase.from('konsultasi').select('*').order('created_at', { ascending: false }),
              supabase.from('buku_tamu').select('*').order('created_at', { ascending: false }),
              supabase.from('review').select('*').order('created_at', { ascending: false })
            ]);

            if (konsultasiRes.error) throw konsultasiRes.error;
            if (bukuTamuRes.error) throw bukuTamuRes.error;
            if (reviewRes.error) throw reviewRes.error;

            // Log data review
            console.log('Data Review:', reviewRes.data);

            // Pastikan data konsultasi memiliki balasan yang benar
            const konsultasiData = konsultasiRes.data?.map(item => ({
              ...item,
              balasan: item.balasan || null
            })) || [];

            setKonsultasi(konsultasiData);
            setBukuTamu(bukuTamuRes.data || []);
            setReview(reviewRes.data || []);
            setLoading(false);
          } catch (err) {
            console.error('Error fetching data:', err);
            setError('Terjadi kesalahan saat mengambil data.');
          }
        };

        fetchData();
      } catch (err) {
        console.error('Terjadi kesalahan:', err);
        setError('Terjadi kesalahan saat memeriksa autentikasi.');
        localStorage.removeItem('omah-hukum-auth');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleDelete = async (table: string, id: string) => {
    if (!isAdmin) return;
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state setelah penghapusan
      if (table === 'konsultasi') {
        setKonsultasi(konsultasi.filter(item => item.id !== id));
      } else if (table === 'buku_tamu') {
        setBukuTamu(bukuTamu.filter(item => item.id !== id));
      } else if (table === 'review') {
        setReview(review.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Terjadi kesalahan saat menghapus data.');
    }
  };

  const handleBalasan = async (id: string, balasanText: string) => {
    if (!isAdmin) {
      setError('Anda harus dalam mode admin untuk menambahkan balasan');
      return;
    }

    if (!balasanText.trim()) {
      setError('Balasan tidak boleh kosong');
      return;
    }

    try {
      // Update data di Supabase
      const { data, error } = await supabase
        .from('konsultasi')
        .update({ balasan: balasanText })
        .eq('id', id);

      if (error) {
        console.error('Error dari Supabase:', error);
        setError('Gagal mengirim balasan. Pastikan Anda memiliki akses admin.');
        return;
      }

      // Update state setelah menambahkan balasan
      setKonsultasi(konsultasi.map(item => 
        item.id === id ? { ...item, balasan: balasanText } : item
      ));
      setBalasan({ ...balasan, [id]: '' });
      setError('');
    } catch (err) {
      console.error('Error saat menambahkan balasan:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleEditBalasan = async (id: string) => {
    if (!isAdmin) {
      setError('Anda harus dalam mode admin untuk mengedit balasan');
      return;
    }

    const konsultasiItem = konsultasi.find(item => item.id === id);
    if (!konsultasiItem) return;

    // Set balasan ke state untuk diedit
    setBalasan({ ...balasan, [id]: konsultasiItem.balasan || '' });
  };

  const handleSimpanBalasan = async (id: string, balasanText: string) => {
    if (!isAdmin) {
      setError('Anda harus dalam mode admin untuk menyimpan balasan');
      return;
    }

    if (!balasanText.trim()) {
      setError('Balasan tidak boleh kosong');
      return;
    }

    try {
      console.log('=== Mencoba menyimpan balasan ===');
      console.log('ID:', id);
      console.log('Tipe ID:', typeof id);
      console.log('Isi balasan:', balasanText);

      // Cek data sebelum update
      const { data: existingData, error: fetchError } = await supabase
        .from('konsultasi')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error saat memeriksa data:', fetchError);
        setError('Gagal memeriksa data konsultasi');
        return;
      }

      if (!existingData) {
        console.error('Data tidak ditemukan untuk ID:', id);
        setError('Data konsultasi tidak ditemukan');
        return;
      }

      console.log('Data yang akan diupdate:', existingData);

      // Update data menggunakan RPC
      const { data, error } = await supabase.rpc('update_konsultasi_balasan', {
        konsultasi_id: id,
        new_balasan: balasanText
      });

      if (error) {
        console.error('Error dari Supabase RPC:', error);
        setError('Gagal menyimpan balasan: ' + error.message);
        return;
      }

      console.log('Hasil RPC:', data);

      // Verifikasi data setelah update
      const { data: updatedData, error: verifyError } = await supabase
        .from('konsultasi')
        .select('*')
        .eq('id', id)
        .single();

      if (verifyError) {
        console.error('Error saat verifikasi data:', verifyError);
        setError('Gagal memverifikasi data konsultasi');
        return;
      }

      if (!updatedData) {
        console.error('Data tidak ditemukan setelah update');
        setError('Gagal memverifikasi data konsultasi');
        return;
      }

      console.log('Data setelah update:', updatedData);

      // Update state lokal
      setKonsultasi(prevKonsultasi => 
        prevKonsultasi.map(item => 
          item.id === id ? { ...item, balasan: balasanText } : item
        )
      );
      
      // Reset state balasan
      setBalasan(prev => {
        const newBalasan = { ...prev };
        delete newBalasan[id];
        return newBalasan;
      });
      
      setError('');
      console.log('=== Balasan berhasil disimpan ===');
    } catch (err) {
      console.error('Error saat menyimpan balasan:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleHapusBalasan = async (id: string) => {
    if (!isAdmin) {
      setError('Anda harus dalam mode admin untuk menghapus balasan');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus balasan ini?')) return;

    try {
      console.log('=== Mencoba menghapus balasan ===');
      console.log('ID:', id);
      console.log('Tipe ID:', typeof id);

      // Cek data sebelum update
      const { data: existingData, error: fetchError } = await supabase
        .from('konsultasi')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error saat memeriksa data:', fetchError);
        setError('Gagal memeriksa data konsultasi');
        return;
      }

      if (!existingData) {
        console.error('Data tidak ditemukan untuk ID:', id);
        setError('Data konsultasi tidak ditemukan');
        return;
      }

      console.log('Data yang akan diupdate:', existingData);

      // Update data menggunakan RPC
      const { data, error } = await supabase.rpc('update_konsultasi_balasan', {
        konsultasi_id: id,
        new_balasan: null
      });

      if (error) {
        console.error('Error dari Supabase RPC:', error);
        setError('Gagal menghapus balasan: ' + error.message);
        return;
      }

      console.log('Hasil RPC:', data);

      // Verifikasi data setelah update
      const { data: updatedData, error: verifyError } = await supabase
        .from('konsultasi')
        .select('*')
        .eq('id', id)
        .single();

      if (verifyError) {
        console.error('Error saat verifikasi data:', verifyError);
        setError('Gagal memverifikasi data konsultasi');
        return;
      }

      if (!updatedData) {
        console.error('Data tidak ditemukan setelah update');
        setError('Gagal memverifikasi data konsultasi');
        return;
      }

      console.log('Data setelah update:', updatedData);

      // Update state lokal
      setKonsultasi(prevKonsultasi => 
        prevKonsultasi.map(item => 
          item.id === id ? { ...item, balasan: null } : item
        )
      );
      
      setError('');
      console.log('=== Balasan berhasil dihapus ===');
    } catch (err) {
      console.error('Error saat menghapus balasan:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={toggleAdminMode}
          className={`px-4 py-2 rounded ${
            isAdmin ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isAdmin ? 'Mode Admin Aktif' : 'Aktifkan Mode Admin'}
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'konsultasi'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('konsultasi')}
          >
            Konsultasi ({konsultasi.length})
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'bukuTamu'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('bukuTamu')}
          >
            Buku Tamu ({bukuTamu.length})
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'review'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('review')}
          >
            Review ({review.length})
          </button>
        </div>
      </div>

      {activeTab === 'konsultasi' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daftar Konsultasi Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {konsultasi.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{sensorKataKotor(item.nama)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.topik}</td>
                    <td className="px-6 py-4">
                      <div className="mb-2 text-justify whitespace-pre-wrap">{sensorKataKotor(item.pesan)}</div>
                      {item.balasan ? (
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="flex justify-between items-start">
                            <div className="text-justify whitespace-pre-wrap">
                              <strong>Balasan:</strong> {item.balasan}
                            </div>
                            {isAdmin && (
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => handleEditBalasan(item.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-800"
                                  onClick={() => handleHapusBalasan(item.id)}
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                          {isAdmin && balasan[item.id] !== undefined && (
                            <div className="mt-2">
                              <textarea
                                className="w-full border rounded p-2 text-justify"
                                value={balasan[item.id] || ''}
                                onChange={(e) => setBalasan({ ...balasan, [item.id]: e.target.value })}
                                placeholder="Edit balasan..."
                              />
                              <div className="flex space-x-2 mt-2">
                                <button
                                  className="bg-blue-600 text-white px-4 py-2 rounded"
                                  onClick={() => handleSimpanBalasan(item.id, balasan[item.id] || '')}
                                >
                                  Simpan
                                </button>
                                <button
                                  className="bg-gray-600 text-white px-4 py-2 rounded"
                                  onClick={() => {
                                    const newBalasan = { ...balasan };
                                    delete newBalasan[item.id];
                                    setBalasan(newBalasan);
                                  }}
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        isAdmin && (
                          <div className="mt-2">
                            <textarea
                              className="w-full border rounded p-2 text-justify"
                              value={balasan[item.id] || ''}
                              onChange={(e) => setBalasan({ ...balasan, [item.id]: e.target.value })}
                              placeholder="Tulis balasan..."
                            />
                            <button
                              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                              onClick={() => handleSimpanBalasan(item.id, balasan[item.id] || '')}
                            >
                              Kirim Balasan
                            </button>
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete('konsultasi', item.id)}
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daftar Buku Tamu Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bukuTamu.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{sensorKataKotor(item.nama)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4">{sensorKataKotor(item.pesan)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete('buku_tamu', item.id)}
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daftar Review Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {review.map((item) => {
                  console.log('Review Item:', item); // Log setiap item review
                  const filteredKomentar = sensorKataKotor(item.komentar);
                  console.log('Komentar sebelum filter:', item.komentar);
                  console.log('Komentar setelah filter:', filteredKomentar);
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{sensorKataKotor(item.nama)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
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
                      <td className="px-6 py-4">
                        <div className="text-justify whitespace-pre-wrap">
                          {filteredKomentar || 'Tidak ada pesan'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete('review', item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
} 