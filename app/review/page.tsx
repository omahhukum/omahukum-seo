'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function Review() {
  const [nama, setNama] = useState('');
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { error } = await supabase
      .from('review')
      .insert([
        { nama, rating, komentar }
      ]);

    setLoading(false);
    
    if (error) {
      setError('Gagal mengirim review. Silakan coba lagi.');
    } else {
      setSuccess('Review berhasil dikirim! Terima kasih atas masukan Anda.');
      setNama('');
      setRating(0);
      setKomentar('');
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Review & Kepuasan</h1>
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
          <label className="block mb-1 font-medium">Rating Kepuasan</label>
          <div className="flex gap-1 text-2xl">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'text-yellow-400 cursor-pointer' : 'text-gray-300 cursor-pointer'}
                onClick={() => setRating(star)}
                role="button"
                aria-label={`Beri bintang ${star}`}
              >★</span>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Komentar</label>
          <textarea 
            className="w-full border rounded px-3 py-2" 
            rows={4} 
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          disabled={loading || rating === 0}
        >
          {loading ? 'Mengirim...' : 'Kirim Review'}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </main>
  );
} 