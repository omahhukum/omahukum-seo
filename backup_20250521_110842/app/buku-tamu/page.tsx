'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

// Tambahkan fungsi sensorEmail
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

// Tambahkan fungsi sensorKataKotor seperti di review
const kataKotor = [
  'anjing', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'pantek', 'pantat',
  'pepek', 'puki', 'setan', 'sialan', 'sial', 'tolol', 'bego', 'goblok', 'babi',
  'asu', 'bajing', 'jancok', 'jancuk', 'brengsek', 'kampret', 'tai', 'taik', 'peler',
  'titit', 'kentot', 'kemem', 'ewe', 'ewek', 'kimak', 'lancap', 'bokep', 'bencong',
  'banci', 'pelacur', 'lonte', 'cabul', 'bejat', 'ngesex', 'ngewe', 'sange', 'sangean',
  'mesum', 'maho', 'homo', 'gay', 'lesbi', 'lesbian', 'porno', 'seks', 'seksual',
  'zakar', 'penis', 'kelamin', 'kubul', 'coli', 'masturbasi', 'fuck', 'fucking',
  'fucked', 'shit', 'bullshit', 'dick', 'pussy', 'cock', 'asshole', 'bastard', 'slut',
  'whore', 'sundal', 'laknat', 'bangke', 'keparat', 'jebleh', 'ngaceng', 'tititmu',
  'kontolmu', 'memekmu', 'pepekmu', 'bodoh', 'kamvret', 'pukimak', 'kntl', 'anjg',
  'bgst', 'tae', 'taekk', 'kintil', 'memekk', 'jembot', 'jembut', 'mek sempit', 'meki',
  'selakangan', 'selet', 'dubur', 'dobol', 'diamput', 'hancik dancik', 'mbokne hancuk',
  'dancok', 'etel', 'itil', 'kimpet', 'kimvet', 'onani', 'ngocot', 'picek', 'matamu',
  'mbokne han', 'bedes', 'garangan', 'sontoloyo', 'pejuh', 'peju', 'kancot', 'kutang',
  'suwal', 'pentil', 'toket', 'tempek', 'ondolan', 'senok', 'germo', 'halet', 'nyen onyen',
  'pokeh', 'palak', 'teles', 'cok', 'peli', 'kunam', 'bidak', 'iq jongkok', 'vagina', 'torok'
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

export default function BukuTamu() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nomorTelepon, setNomorTelepon] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bukuTamu, setBukuTamu] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from('buku_tamu')
        .insert([
          {
            nama,
            email,
            nomor_telepon: nomorTelepon,
            pesan,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      setSuccess(true);
      setNama('');
      setEmail('');
      setNomorTelepon('');
      setPesan('');
      
      // Refresh data buku tamu
      fetchBukuTamu();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBukuTamu = async () => {
    try {
      const { data, error } = await supabase
        .from('buku_tamu')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBukuTamu(data || []);
    } catch (err: any) {
      console.error('Error fetching buku tamu:', err);
    }
  };

  // Load buku tamu saat komponen dimuat
  useEffect(() => {
    fetchBukuTamu();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12">
      <div className="mb-4 text-center">
        <span className={`px-4 py-2 rounded-lg font-semibold ${isAdmin ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700'}`}>
          Anda sedang dalam mode : {isAdmin ? 'Admin' : 'User'}
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Buku Tamu</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Berikan saran, kritik, atau pesan Anda untuk Omah Hukum. 
            Setiap masukan dari Anda sangat berarti bagi kami untuk meningkatkan kualitas layanan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Buku Tamu */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Tinggalkan Pesan</h2>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  placeholder="Masukkan nomor telepon Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                <textarea
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  rows={6}
                  required
                  placeholder="Tulis pesan, saran, atau kritik Anda untuk Omah Hukum"
                />
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  Pesan berhasil dikirim. Terima kasih atas masukan Anda.
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-medium ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>

          {/* Informasi Tambahan */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Pesan Terbaru</h2>
              <div className="space-y-4">
                {bukuTamu.slice(0, 5).map((item) => (
                  <div key={item.id} className="border-b border-slate-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-slate-900">{isAdmin ? item.nama : sensorKataKotor(item.nama)}</h3>
                        <p className="text-sm text-slate-500">{isAdmin ? item.email : sensorEmail(item.email)}</p>
                        <p className="text-sm text-slate-500">{item.nomor_telepon}</p>
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-600 line-clamp-2">{isAdmin ? item.pesan : sensorKataKotor(item.pesan)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Kontak Kami</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Email</h3>
                    <a 
                      href="mailto:omahhukum.jatim@gmail.com"
                      className="text-slate-600 mt-1 hover:text-blue-600 transition-colors"
                    >
                      omahhukum.jatim@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Telepon</h3>
                    <a 
                      href="https://api.whatsapp.com/send/?phone=6281225425169&text=Saya+%5BNama%5D+ingin+konsultasi+dengan+Omah+Hukum+terkait+%5BPermasalahan+Anda%5D.+Saya+mengetahui+informasi+ini+melalui+website+resmi+Omah+Hukum.&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 mt-1 hover:text-green-600 transition-colors"
                    >
                      +62 812-2542-5169
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-900">Alamat</h3>
                    <a 
                      href="https://www.google.com/maps/place/Kopi+Pallet/@-7.5257963,112.5381365,3a,90y,121.04h,78.57t/data=!3m7!1e1!3m5!1st8UYU_ren1EIDH3nZyFCkQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D11.43273643680304%26panoid%3Dt8UYU_ren1EIDH3nZyFCkQ%26yaw%3D121.04182631136442!7i16384!8i8192!4m6!3m5!1s0x2e780b1cfe756907:0xee650cef30b661d1!8m2!3d-7.5258774!4d112.5382168!16s%2Fg%2F11f62v7hhg?entry=ttu&g_ep=EgoyMDI1MDQzMC4xIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 mt-1 hover:text-blue-600 transition-colors"
                    >
                      Jurangsari, Belahantengah, Kec. Mojosari<br />
                      Kabupaten Mojokerto, Jawa Timur 61382
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 