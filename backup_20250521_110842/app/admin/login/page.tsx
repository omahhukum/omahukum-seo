'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError('Email atau password salah.');
    } else {
      // Simpan ke localStorage dan redirect setelah DOM siap
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', '1');
        router.push('/artikel');
      }
    }
  }

  return (
    <main className="max-w-sm mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Login Admin</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
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
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Login...' : 'Login'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </main>
  );
}
