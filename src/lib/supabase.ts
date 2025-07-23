import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oerjkuzytnyirkpqdeut.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcmprdXp5dG55aXJrcHFkZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzUxNDMsImV4cCI6MjA2NzkxMTE0M30.jTjZ0CoFjnWiPNzrq2nvnuY0d3ctzOexcZH3Qa6Nq3w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bağlantı testi fonksiyonu
export const testSupabaseConnection = async () => {
  
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Supabase bağlantı hatası:', error.message)
      console.error('📝 Hata detayları:', error)
      return false
    }

    console.log('✅ Supabase bağlantısı başarılı!')
    console.log('📊 Test sorgusu yanıtı:', data)
    return true
  } catch (error) {
    console.error('💥 Beklenmeyen Supabase hatası:', error)
    return false
  }
}

// Database type definitions based on Supabase schema
export interface Database {
  public: {
    Tables: {
      universities: {
        Row: {
          id: number
          created_at: string
          name: string
          city_id: number
          website: string | null
          campus_info: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          city_id: number
          website?: string | null
          campus_info?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          city_id?: number
          website?: string | null
          campus_info?: string | null
        }
      }
      cities: {
        Row: {
          id: number
          created_at: string
          name: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
        }
      }
      departments: {
        Row: {
          id: number
          created_at: string
          university_id: number
          name: string
          faculty: string | null
          quota: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          university_id: number
          name: string
          faculty?: string | null
          quota?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          university_id?: number
          name?: string
          faculty?: string | null
          quota?: number | null
        }
      }
      scores: {
        Row: {
          id: number
          created_at: string
          department_id: number
          year: number | null
          taban_score: number | null
          tavan_score: number | null
          taban_rank: number | null
          tavan_rank: number | null
          puan_turu: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          department_id: number
          year?: number | null
          taban_score?: number | null
          tavan_score?: number | null
          taban_rank?: number | null
          tavan_rank?: number | null
          puan_turu?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          department_id?: number
          year?: number | null
          taban_score?: number | null
          tavan_score?: number | null
          taban_rank?: number | null
          tavan_rank?: number | null
          puan_turu?: string | null
        }
      }
      academics: {
        Row: {
          id: number
          created_at: string
          department_id: number
          name: string | null
          title: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          department_id: number
          name?: string | null
          title?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          department_id?: number
          name?: string | null
          title?: string | null
        }
      }
      comments: {
        Row: {
          id: number
          created_at: string
          university_id: number
          user_name: string | null
          comment: string | null
          sentiment: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          university_id: number
          user_name?: string | null
          comment?: string | null
          sentiment?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          university_id?: number
          user_name?: string | null
          comment?: string | null
          sentiment?: string | null
        }
      }
      yurtlar: {
        Row: {
          id: string
          ad: string | null
          tipi: string | null
          telefon: string | null
          faks: string | null
          adres: string | null
          il: string | null
          ilce: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ad?: string | null
          tipi?: string | null
          telefon?: string | null
          faks?: string | null
          adres?: string | null
          il?: string | null
          ilce?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ad?: string | null
          tipi?: string | null
          telefon?: string | null
          faks?: string | null
          adres?: string | null
          il?: string | null
          ilce?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 