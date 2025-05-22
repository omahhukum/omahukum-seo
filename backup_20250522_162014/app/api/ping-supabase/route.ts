import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  // Query sederhana ke tabel buku_tamu
  const { data, error } = await supabase.from('buku_tamu').select('id').limit(1);
  if (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
  return NextResponse.json({ success: true, ping: true, data });
} 