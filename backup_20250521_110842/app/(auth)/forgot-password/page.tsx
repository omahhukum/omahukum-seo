'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement forgot password logic
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Lupa Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
          >
            Kirim Link Reset Password
          </button>
        </div>
      </form>
    </div>
  );
} 