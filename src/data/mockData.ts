import { fetchCities } from '@/lib/api'
import { University } from '@/types'

// Bu dosya artık legacy mock veriler için kullanılıyor
// Gerçek uygulamada veriler CSV'den gelecek

export const mockUniversities: University[] = []

// Şehir verilerini CSV'den getiren fonksiyon
export const getPopularCities = async () => {
  try {
    const cities = await fetchCities()
    return cities.slice(0, 10) // İlk 10 şehri al
  } catch (error) {
    console.error('Şehir verileri yüklenirken hata:', error)
    return popularCities // Fallback olarak statik veriyi kullan
  }
}

export const popularCities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kayseri'
]

export const scoreTypes = [
  { value: 'SAY', label: 'Sayısal' },
  { value: 'EA', label: 'Eşit Ağırlık' },
  { value: 'SÖZ', label: 'Sözel' },
  { value: 'DİL', label: 'Dil' }
]

export const universityTypes = [
  { value: 'state', label: 'Devlet' },
  { value: 'foundation', label: 'Vakıf' },
  { value: 'trnc', label: 'KKTC' }
]

export const scholarshipLevels = [
  { value: 'full', label: 'Tam Burslu' },
  { value: 'half', label: '%50 Burslu' },
  { value: 'paid', label: 'Ücretli' }
]

export const languageOptions = [
  { value: 'turkish', label: 'Türkçe' },
  { value: 'english', label: 'İngilizce' },
  { value: 'hybrid', label: 'Karma' }
] 