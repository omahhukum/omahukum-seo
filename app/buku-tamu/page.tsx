'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function BukuTamu() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { error } = await supabase
      .from('buku_tamu')
      .insert([
        { nama, email, pesan }
      ]);

    setLoading(false);
    
    if (error) {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } else {
      setSuccess('Pesan berhasil dikirim! Terima kasih atas kunjungan Anda.');
      setNama('');
      setEmail('');
      setPesan('');
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Buku Tamu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama</label>
          <input 
            type="text" 
            className="w-full border rounded px-3 py-2" 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email (opsional)</label>
          <input 
            type="email" 
            className="w-full border rounded px-3 py-2" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Pesan / Kesan</label>
          <textarea 
            className="w-full border rounded px-3 py-2" 
            rows={4} 
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          disabled={loading}
        >
          {loading ? 'Mengirim...' : 'Kirim'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </main>
  );
} 