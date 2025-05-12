'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Artikel } from '@/app/types/artikel';

export default function ArtikelDetailClient({ article: initialArticle }: { article: Artikel }) {
  const router = useRouter();
  const [article, setArticle] = useState<Artikel>(initialArticle);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Artikel | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkSession() {
      try {
        setCheckingAuth(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email === 'omahhukum.jatim@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  async function handleEdit(article: Artikel) {
    setEditingArticle(article);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArticle) return;

    setEditLoading(true);
    setError('');

    try {
      // Verifikasi session admin
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== 'omahhukum.jatim@gmail.com') {
        throw new Error('Anda tidak memiliki akses untuk mengedit artikel');
      }

      const updateData = {
        judul: editingArticle.judul.trim(),
        penulis: editingArticle.penulis.trim(),
        sumber: editingArticle.sumber.trim(),
        isi: editingArticle.isi.trim(),
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      // Update artikel
      const { error: updateError } = await supabase
        .from('artikel')
        .update(updateData)
        .eq('id', editingArticle.id);

      if (updateError) {
        console.error('Error updating article:', updateError);
        throw new Error('Gagal menyimpan perubahan: ' + updateError.message);
      }

      // Ambil data terbaru
      const { data: updatedArticle, error: fetchError } = await supabase
        .from('artikel')
        .select('*')
        .eq('id', editingArticle.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated article:', fetchError);
        throw new Error('Gagal mengambil data artikel terbaru: ' + fetchError.message);
      }

      if (!updatedArticle) {
        throw new Error('Tidak dapat menemukan artikel setelah update');
      }

      // Update state lokal
      setArticle(updatedArticle);
      setEditingArticle(null);

      // Refresh halaman
      window.location.reload();

    } catch (err: any) {
      console.error('Error in handleSaveEdit:', err);
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('artikel')
        .delete()
        .eq('id', article.id);

      if (error) {
        throw new Error('Gagal menghapus artikel: ' + error.message);
      }

      router.push('/artikel');
    } catch (err: any) {
      console.error('Error in handleDelete:', err);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Edit Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Edit Artikel</h2>
              <button
                onClick={() => setEditingArticle(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  value={editingArticle.judul}
                  onChange={(e) => setEditingArticle({...editingArticle, judul: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Penulis
                </label>
                <input
                  type="text"
                  value={editingArticle.penulis}
                  onChange={(e) => setEditingArticle({...editingArticle, penulis: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sumber
                </label>
                <input
                  type="text"
                  value={editingArticle.sumber}
                  onChange={(e) => setEditingArticle({...editingArticle, sumber: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Isi Artikel
                </label>
                <textarea
                  value={editingArticle.isi}
                  onChange={(e) => setEditingArticle({...editingArticle, isi: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={10}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors ${
                    editLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/artikel"
            className="inline-flex items-center text-blue-900 hover:text-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Artikel
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {article.gambar && (
            <div className="relative h-96">
              <Image
                src={article.gambar}
                alt={article.judul}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            <div className="flex items-center text-sm text-slate-600 mb-4">
              <div className="flex items-center mr-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.penulis}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>{
                  article.sumber.startsWith('http') ? (
                    <a 
                      href={article.sumber} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {new URL(article.sumber).hostname.replace('www.', '')}
                    </a>
                  ) : article.sumber
                }</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              {article.judul}
            </h1>

            <div className="prose prose-lg max-w-none text-slate-600">
              {article.isi.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {!checkingAuth && isAdmin && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(article)}
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Artikel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                    deleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deleting ? 'Menghapus...' : 'Hapus Artikel'}
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
} 