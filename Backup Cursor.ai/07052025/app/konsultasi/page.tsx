'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Konsultasi() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [topik, setTopik] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [konsultasi, setKonsultasi] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validasi input
    if (!nama || !email || !topik || !pesan) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('konsultasi')
        .insert([
          {
            nama,
            email,
            topik,
            pesan,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting konsultasi:', error);
        throw error;
      }

      setSuccess(true);
      setNama('');
      setEmail('');
      setTopik('');
      setPesan('');
      
      // Refresh data konsultasi
      fetchKonsultasi();
    } catch (err: any) {
      console.error('Error submitting konsultasi:', err);
      setError(err.message || 'Terjadi kesalahan saat mengirim konsultasi');
    } finally {
      setLoading(false);
    }
  };

  const fetchKonsultasi = async () => {
    try {
      const { data, error } = await supabase
        .from('konsultasi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKonsultasi(data || []);
    } catch (err: any) {
      console.error('Error fetching konsultasi:', err);
    }
  };

  // Load konsultasi saat komponen dimuat
  useEffect(() => {
    fetchKonsultasi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Konsultasi Hukum</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Konsultasikan permasalahan hukum Anda dengan tim advokat profesional kami. 
            Kami siap membantu Anda dengan solusi hukum yang tepat dan terpercaya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Konsultasi */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Kirim Konsultasi</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  placeholder="Masukkan email Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topik Konsultasi</label>
                <select
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Pilih topik konsultasi</option>
                  <option value="Hukum Pidana">Hukum Pidana</option>
                  <option value="Hukum Perdata">Hukum Perdata</option>
                  <option value="Hukum Keluarga">Hukum Keluarga</option>
                  <option value="Hukum Bisnis">Hukum Bisnis</option>
                  <option value="Hukum Pajak">Hukum Pajak</option>
                  <option value="Hukum Ketenagakerjaan">Hukum Ketenagakerjaan</option>
                  <option value="Hukum Properti">Hukum Properti</option>
                  <option value="Hukum Internasional">Hukum Internasional</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                <textarea
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  rows={6}
                  required
                  placeholder="Jelaskan permasalahan hukum Anda secara detail"
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  Konsultasi berhasil dikirim. Tim kami akan segera menghubungi Anda.
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-medium ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Mengirim...' : 'Kirim Konsultasi'}
              </button>
            </form>
          </div>

          {/* Informasi Tambahan */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Mengapa Memilih Kami?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Tim Profesional</h3>
                    <p className="text-slate-600 mt-1">Tim advokat berpengalaman dengan latar belakang pendidikan hukum terbaik.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Respon Cepat</h3>
                    <p className="text-slate-600 mt-1">Kami akan merespon konsultasi Anda dalam waktu 24 jam kerja.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Solusi Terbaik</h3>
                    <p className="text-slate-600 mt-1">Memberikan solusi hukum yang tepat dan terpercaya sesuai kebutuhan Anda.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Konsultasi Terbaru</h2>
              <div className="space-y-4">
                {konsultasi.slice(0, 3).map((item) => (
                  <div key={item.id} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-900">{item.nama}</h3>
                        <p className="text-sm text-slate-500">{item.topik}</p>
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600 line-clamp-2">{item.pesan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
