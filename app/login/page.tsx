'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Mencoba login dengan email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      console.log('Response login:', { data, error });
      
      if (error) {
        console.error('Error saat login:', error);
        setError('Email atau password salah.');
      } else {
        console.log('Login berhasil, data:', data);
        // Tunggu sebentar sebelum redirect untuk memastikan session tersimpan
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Refresh halaman untuk memastikan state terupdate
        }, 1000);
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input 
            type="email" 
            className="w-full border rounded px-3 py-2" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input 
            type="password" 
            className="w-full border rounded px-3 py-2" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
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