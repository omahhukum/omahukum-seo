'use client';

import { useState } from 'react';
import { Input } from '../../../../components/ui/input';

export default function VerifyPage() {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement verification logic
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Verifikasi Akun</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Kode Verifikasi"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
          >
            Verifikasi
          </button>
        </div>
      </form>
    </div>
  );
} 