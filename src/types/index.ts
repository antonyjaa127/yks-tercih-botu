// Supabase database types
export interface SupabaseUniversity {
  id: number
  created_at: string
  name: string
  city_id: number
  website: string | null
  campus_info: string | null
}

export interface SupabaseCity {
  id: number
  created_at: string
  name: string
}

export interface SupabaseDepartment {
  id: number
  created_at: string
  university_id: number
  name: string
  faculty: string | null
  quota: number | null
}

export interface SupabaseScore {
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

export interface SupabaseComment {
  id: number
  created_at: string
  university_id: number
  user_name: string | null
  comment: string | null
  sentiment: string | null
}

export interface SupabaseAcademic {
  id: number
  created_at: string
  department_id: number
  name: string | null
  title: string | null
}

// Application types (used in components)
export interface University {
  id: string
  name: string
  logo?: string
  city: string
  cityId: number
  type: 'state' | 'foundation' | 'trnc'
  foundingYear: number
  website: string
  description: string
  mainImage?: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  facilities: {
    dormitory: boolean
    sports: boolean
    library: boolean
    labs: boolean
    cafeteria: boolean
  }
  studentCount: number
  academicStaffCount: number
  departments: Department[]
  photos: string[]
  videos: string[]
  reviews?: Review[]
  rating?: number
}

export interface Department {
  id: string
  universityId: number
  name: string
  facultyName: string
  scoreType: 'SAY' | 'SÖZ' | 'EA' | 'DİL'
  lastYearScore: number
  lastYearRank: number
  quota: number
  scholarshipPercentage: number
  languageOfInstruction: 'turkish' | 'english' | 'hybrid'
  description: string
  careerOpportunities: string[]
  internshipOpportunities: string[]
  // Link alanları
  departmentWebsite?: string
  yksAtlasLink?: string
  yopCode: string // YÖP kodu (YÖK Atlas linki için)
  // 3 yıllık veriler
  historicalData: {
    2024: {
      rank?: number
      score?: number
      quota?: number
    }
    2023: {
      rank?: number
      score?: number
      quota?: number
    }
    2022: {
      rank?: number
      score?: number
      quota?: number
    }
  }
  // Supabase'den gelen veriler
  latestScores?: SupabaseScore[]
  academics?: SupabaseAcademic[]
  educationLevel: 'lisans' | 'onlisans' // yeni alan
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

// Supabase'den gelen verilerle birleştirilmiş tip
export interface UniversityWithRelations {
  university: SupabaseUniversity
  city: SupabaseCity
  departments: (SupabaseDepartment & {
    scores: SupabaseScore[]
    academics: SupabaseAcademic[]
  })[]
  comments: SupabaseComment[]
}

export interface FilterOptions {
  cities: string[]
  scoreTypes: ('SAY' | 'SÖZ' | 'EA' | 'DİL')[]
  universityTypes: ('state' | 'foundation' | 'trnc')[]
  scholarshipLevels: ('full' | 'half' | 'paid' | '25' | '75')[]
  languageOfInstruction: ('turkish' | 'english' | 'hybrid')[]
  minScore: number
  maxScore: number
  minRank: number
  maxRank: number
  hasDormitory: boolean
  hasSports: boolean
  departmentNames: string[]
  universityNames: string[]
  educationLevels: ('lisans' | 'onlisans')[]
  feeTypes: ('ucretli' | 'burslu' | '25' | '50' | '75' | '100')[]
  sortType: 'puan' | 'siralama'
}

export interface SearchFilters {
  query: string
  cities: string[] // çoklu seçim
  scoreType: string
  universityTypes: string[] // çoklu seçim
  scholarshipLevels: string[] // çoklu seçim
  languageOfInstruction: string
  minScore: number
  maxScore: number
  minRank: number
  maxRank: number
  hasDormitory: boolean
  hasSports: boolean
  departmentNames: string[] // çoklu seçim
  universityNames: string[] // çoklu seçim
  educationLevels: string[] // çoklu seçim (lisans/önlisans)
  feeTypes: string[] // çoklu seçim
  sortType: 'puan' | 'siralama'
}

export interface ComparisonItem {
  universityId: string
  departmentId: string
  universityName: string
  departmentName: string
  logo?: string
  scholarshipPercentage?: number
  yopCode?: string
  departmentWebsite?: string
  yksAtlasLink?: string
  facultyName?: string
  historicalData?: Department['historicalData']
  languageOfInstruction?: string
  city?: string
  type?: string
} 