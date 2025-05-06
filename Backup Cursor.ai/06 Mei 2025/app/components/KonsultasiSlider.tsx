'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface Konsultasi {
  id: number;
  nama: string;
  pesan: string;
  balasan: string;
  created_at: string;
}

export default function KonsultasiSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [konsultasi, setKonsultasi] = useState<Konsultasi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKonsultasi();
  }, []);

  const fetchKonsultasi = async () => {
    try {
      const { data, error } = await supabase
        .from('konsultasi')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching konsultasi:', error);
        return;
      }

      if (data) {
        setKonsultasi(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (konsultasi.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % konsultasi.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [konsultasi.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % konsultasi.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + konsultasi.length) % konsultasi.length);
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

  if (konsultasi.length === 0) {
    return (
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Konsultasi Terbaru</h2>
            <p className="text-lg text-slate-600">Belum ada konsultasi yang dipublikasikan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Konsultasi Terbaru</h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto line-clamp-2">
            Lihat konsultasi-konsultasi terbaru dari pengunjung Omah Hukum
          </p>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {konsultasi.map((item) => (
                <div 
                  key={item.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {item.nama}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Pertanyaan:</p>
                          <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                            {item.pesan}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 mb-1">Balasan:</p>
                          <p className="text-slate-700 bg-blue-50 p-4 rounded-lg">
                            {item.balasan}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
            {konsultasi.map((_, index) => (
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