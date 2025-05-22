import { supabase } from '@/utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple query to keep the connection alive
    const { data, error } = await supabase
      .from('artikel')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success', message: 'Database pinged successfully' })
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to ping database' }, { status: 500 })
  }
} 