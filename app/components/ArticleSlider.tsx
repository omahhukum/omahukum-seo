'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'

interface Artikel {
  id: number
  judul: string
  isi: string
  gambar: string
  created_at: string
}

export default function ArticleSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [artikels, setArtikels] = useState<Artikel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtikels()
  }, [])

  const fetchArtikels = async () => {
    try {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArtikels(data || [])
    } catch (err: any) {
      console.error('Error fetching artikels:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (artikels.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % artikels.length)
      }, 7000)

      return () => clearInterval(timer)
    }
  }, [artikels.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % artikels.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + artikels.length) % artikels.length)
  }

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
    )
  }

  if (artikels.length === 0) {
    return (
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-slate-600">Belum ada artikel terbaru</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {artikels.map((artikel) => (
            <div
              key={artikel.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row">
                {artikel.gambar && (
                  <div className="md:w-1/2 w-full h-64 relative">
                    <Image
                      src={artikel.gambar}
                      alt={artikel.judul}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <Link href={`/artikel/${artikel.id}`} className="hover:underline text-blue-700">
                      {artikel.judul}
                    </Link>
                  </h3>
                  <div
                    className="text-gray-700 text-sm mb-4 line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: artikel.isi }}
                  />
                  <div className="mt-auto text-right text-xs text-gray-400">
                    {new Date(artikel.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
        {artikels.map((_, index) => (
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
  )
}