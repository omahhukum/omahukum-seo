'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../utils/supabaseClient';

interface Article {
  id: number;
  judul: string;
  penulis: string;
  isi: string;
  gambar: string;
  created_at: string;
}

export default function ArticleSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      if (data) {
        setArticles(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articles.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (loading) {
    return (
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel Terbaru</h2>
            <p className="text-lg text-slate-600">Belum ada artikel yang dipublikasikan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Artikel Terbaru</h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto line-clamp-2">
            Temukan informasi hukum terkini dan artikel-artikel menarik dari tim Omah Hukum
          </p>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {articles.map((article) => (
                <div 
                  key={article.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <Link href={`/artikel/${article.id}`}>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                      <div className="relative h-64">
                        {article.gambar ? (
                          <Image
                            src={article.gambar}
                            alt={article.judul}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2">
                          {article.judul}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-3">
                          {article.isi}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            {article.penulis}
                          </span>
                          <span className="text-sm text-slate-500">
                            {new Date(article.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-slate-50 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-slate-50 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-900' : 'bg-slate-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 