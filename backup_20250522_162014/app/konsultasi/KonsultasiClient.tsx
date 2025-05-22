'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import OptimizedImage from '../components/OptimizedImage';

const kataKotor = [
  // ... daftar kata kotor ...
  'anjing', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'pantek', 'pantat',
  // ... dst (copy dari file lama) ...
  'torok'
];

function sensorKataKotor(text: string) {
  if (!text) return text;
  let result = text;
  kataKotor.forEach(kata => {
    const regex = new RegExp(kata, 'gi');
    result = result.replace(regex, '*'.repeat(kata.length));
  });
  return result;
}

export default function KonsultasiClient() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [topik, setTopik] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [konsultasi, setKonsultasi] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

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

  useEffect(() => {
    fetchKonsultasi();
  }, []);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(session?.user?.email === 'omahhukum.jatim@gmail.com');
    }
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(session?.user?.email === 'omahhukum.jatim@gmail.com');
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Konsultasi Hukum Profesional di Mojokerto
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dapatkan solusi hukum terbaik untuk permasalahan Anda
          <br />
          dengan tim pengacara berpengalaman kami
        </p>
      </div>

      {/* FORM KONSULTASI */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Form Konsultasi</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
              placeholder="Masukkan email Anda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topik Konsultasi</label>
            <select
              value={topik}
              onChange={e => setTopik(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
            <textarea
              value={pesan}
              onChange={e => setPesan(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            className={`w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Mengirim...' : 'Kirim Konsultasi'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Kartu Layanan Konsultasi */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Konsultasi Hukum Perdata</h2>
          <p className="text-gray-600">
            Konsultasi masalah perdata seperti sengketa tanah, waris, perjanjian, dan lainnya
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Konsultasi Hukum Pidana</h2>
          <p className="text-gray-600">
            Pendampingan hukum untuk kasus pidana dengan tim pengacara berpengalaman
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Konsultasi Hukum Keluarga</h2>
          <p className="text-gray-600">
            Bantuan hukum untuk masalah keluarga seperti perceraian, waris, dan hak asuh anak
          </p>
        </div>
      </div>
      {/* CTA Section */}
      <div className="mt-16 bg-blue-900 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Konsultasikan Masalah Hukum Anda</h2>
          <p className="text-lg text-blue-100 mb-8">
            Tim pengacara profesional kami siap membantu menyelesaikan permasalahan hukum Anda
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-900 bg-white hover:bg-blue-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Konsultasi via WhatsApp
            </a>
            <a
              href="tel:+6281225425169"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 