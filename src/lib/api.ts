// API endpoint'leri kullanarak veri çekme
// Supabase import'ları yorum satırı yapıyoruz
// import { supabase } from './supabase'
import { 
  University, 
  Department, 
  UniversityWithRelations, 
  SupabaseUniversity,
  SupabaseCity,
  SupabaseDepartment,
  SupabaseScore,
  SupabaseComment,
  SupabaseAcademic
} from '@/types'

// Tüm üniversiteleri getir (pagination ile) - 2024 sıralamasına göre
export const fetchUniversities = async (
  page: number = 0, 
  limit: number = 10,
  sortBy: 'score' | 'alphabetical' = 'score'
): Promise<{universities: University[], hasMore: boolean, total: number}> => {
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: sortBy
    })
    
    const response = await fetch(`/api/universities?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`)
    }
    
    const data = await response.json()
    
    return { 
      universities: data.universities || [], 
      hasMore: data.hasMore || false, 
      total: data.total || 0 
    }

  } catch (error) {
    return { universities: [], hasMore: false, total: 0 }
  }
}

// Tek üniversiteyi ID ile getir
export const fetchUniversityById = async (id: string): Promise<University | null> => {
  
  try {
    // Tüm üniversiteleri al ve ID'ye göre filtrele
    const params = new URLSearchParams({
      page: '0',
      limit: '10000', // Büyük limit ile tüm veriyi al
      sortBy: 'score'
    })
    
    const response = await fetch(`/api/universities?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`)
    }
    
    const data = await response.json()
    const university = data.universities?.find((uni: University) => uni.id === id)
    
    return university || null

  } catch (error) {
    return null
  }
}

// Şehirleri getir - API'den
export const fetchCities = async (): Promise<string[]> => {
  try {
    const response = await fetch('/api/cities')
    
    if (!response.ok) {
      throw new Error(`Cities API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.cities || []
  } catch (error) {
    return []
  }
}

// Arama fonksiyonu (pagination ile)
export const searchUniversities = async (
  query: string, 
  page: number = 0,
  limit: number = 10,
  filters?: {
    city?: string
    scoreType?: string
    universityType?: string
    scholarshipLevel?: string
    languageOfInstruction?: string
    minScore?: number
    maxScore?: number
    minRank?: number
    maxRank?: number
    hasDormitory?: boolean
    hasSports?: boolean
    educationLevels?: string[]
    cities?: string[]
    universityNames?: string[]
    departmentNames?: string[]
    universityTypes?: string[]
    scholarshipLevels?: string[]
  }
): Promise<{universities: University[], hasMore: boolean, total: number}> => {
  
  try {
    // API endpoint'ini tüm filtrelerle çağır
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy: 'score'
    })
    
    if (query) params.append('query', query)
    if (filters?.city) params.append('city', filters.city)
    if (filters?.scoreType) params.append('scoreType', filters.scoreType)
    if (filters?.universityType) params.append('universityType', filters.universityType)
    if (filters?.scholarshipLevel) params.append('scholarshipLevel', filters.scholarshipLevel)
    if (filters?.languageOfInstruction) params.append('languageOfInstruction', filters.languageOfInstruction)
    if (filters?.minScore !== undefined && filters.minScore > 0) params.append('minScore', filters.minScore.toString())
    if (filters?.maxScore !== undefined && filters.maxScore < 600) params.append('maxScore', filters.maxScore.toString())
    if (filters?.minRank !== undefined && filters.minRank > 0) params.append('minRank', filters.minRank.toString())
    if (filters?.maxRank !== undefined && filters.maxRank < 999999) params.append('maxRank', filters.maxRank.toString())
    if (filters?.hasDormitory) params.append('hasDormitory', 'true')
    if (filters?.hasSports) params.append('hasSports', 'true')
    if (filters?.educationLevels && filters.educationLevels.length > 0) params.append('educationLevels', filters.educationLevels.join(','))
    if (filters?.cities && filters.cities.length > 0) params.append('cities', filters.cities.join(','))
    if (filters?.universityNames && filters.universityNames.length > 0) params.append('universityNames', filters.universityNames.join(','))
    if (filters?.departmentNames && filters.departmentNames.length > 0) params.append('departmentNames', filters.departmentNames.join(','))
    if (filters?.universityTypes && filters.universityTypes.length > 0) params.append('universityTypes', filters.universityTypes.join(','))
    if (filters?.scholarshipLevels && filters.scholarshipLevels.length > 0) params.append('scholarshipLevels', filters.scholarshipLevels.join(','))
    
    const apiUrl = `/api/universities?${params.toString()}`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API isteği başarısız: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    return { 
      universities: data.universities || [], 
      hasMore: data.hasMore || false, 
      total: data.total || 0 
    }

  } catch (error) {
    return { universities: [], hasMore: false, total: 0 }
  }
}

// Bölüm bazında arama
export const searchDepartments = async (query: string): Promise<Department[]> => {
  try {
    // Tüm üniversiteleri API'den al
    const response = await fetch('/api/universities?page=0&limit=10000&sortBy=score')
    
    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`)
    }
    
    const data = await response.json()
    const allUniversities: University[] = data.universities || []
    const departments: Department[] = []
    
    allUniversities.forEach((university: University) => {
      university.departments.forEach((department: Department) => {
        if (department.name.toLowerCase().includes(query.toLowerCase())) {
          departments.push(department)
        }
      })
    })
    
    // 2024 sıralamalarına göre sırala
    departments.sort((a, b) => {
      if (a.lastYearRank === 0 && b.lastYearRank === 0) {
        return a.name.localeCompare(b.name, 'tr')
      }
      if (a.lastYearRank === 0) return 1
      if (b.lastYearRank === 0) return -1
      return a.lastYearRank - b.lastYearRank
    })
    
    return departments.slice(0, 50) // İlk 50 sonuç
    
  } catch (error) {
    return []
  }
} 