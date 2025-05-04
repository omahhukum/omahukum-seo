'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Konsultasi() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Pastikan ini hanya berjalan di browser
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { error } = await supabase
      .from('konsultasi')
      .insert([{ nama, email, pesan }]);

    setLoading(false);
    
    if (error) {
      setError('Gagal mengirim konsultasi. Silakan coba lagi.');
    } else {
      setSuccess('Konsultasi berhasil dikirim! Kami akan menghubungi Anda segera.');
      setNama('');
      setEmail('');
      setPesan('');
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Form Konsultasi Hukum</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Lengkap</label>
          <input 
            type="text" 
            className="w-full border rounded px-3 py-2" 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input 
            type="email" 
            className="w-full border rounded px-3 py-2" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Uraian Permasalahan</label>
          <textarea 
            className="w-full border rounded px-3 py-2" 
            rows={5} 
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim Konsultasi'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {token && (
          <p className="mt-4 text-sm text-gray-500">Token terdeteksi di localStorage.</p>
        )}
      </form>
    </main>
  );
}
