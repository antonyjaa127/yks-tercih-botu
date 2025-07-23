import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { name, email, feedback } = await req.json();
    const { error } = await supabase.from('feedback').insert([{ name, email, feedback }]);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
} 