'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../utils/supabaseClient';

interface Review {
  id: number;
  nama: string;
  rating: number;
  komentar: string;
  created_at: string;
}

export default function TestimonialSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % reviews.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [reviews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <div className="relative py-16 bg-slate-50">
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

  if (reviews.length === 0) {
    return (
      <div className="relative py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Klien Kami</h2>
            <p className="text-lg text-slate-600">Belum ada testimoni dari klien</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Apa Kata Klien Kami</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Berbagai pengalaman positif dari klien kami yang telah menggunakan layanan Omah Hukum
          </p>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="relative">
                      <div className="flex items-start gap-4">
                        {!imageError ? (
                          <Image
                            src="/quote.png"
                            alt="Quote"
                            width={24}
                            height={24}
                            className="opacity-50 mt-1"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <svg
                            className="w-6 h-6 text-blue-900 opacity-50 mt-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        )}
                        <div className="flex-grow">
                          <div className="inline-block">
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed inline">
                              {review.komentar}
                              {!imageError ? (
                                <Image
                                  src="/quote.png"
                                  alt="Quote"
                                  width={24}
                                  height={24}
                                  className="opacity-50 rotate-180 inline-block align-baseline ml-1"
                                  onError={() => setImageError(true)}
                                />
                              ) : (
                                <svg
                                  className="w-6 h-6 text-blue-900 opacity-50 rotate-180 inline-block align-baseline ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-8">
                      <div className="flex justify-center mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">{review.nama}</h4>
                      <p className="text-slate-600">
                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
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
            {reviews.map((_, index) => (
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