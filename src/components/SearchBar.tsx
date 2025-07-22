'use client'

import { useState } from 'react'
import { Search, MapPin, Award, Building, Globe, BookOpen } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { 
  popularCities, 
  scoreTypes, 
  universityTypes, 
  scholarshipLevels, 
  languageOptions 
} from '@/data/mockData'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const setSearchFilters = useStore((state) => state.setSearchFilters)
  const router = useRouter()

  const handleSearch = () => {
    setSearchFilters({ query: searchQuery })
    router.push('/arama')
  }

  const handleQuickFilter = (filterType: string, value: string) => {
    setSearchFilters({ 
      query: '', 
      [filterType]: value 
    })
    router.push('/arama')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Ana Arama Çubuğu */}
      <div className="relative mb-8">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
          <Search className="h-6 w-6 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Üniversite, bölüm veya şehir adı arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 border-none"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium mr-2"
          >
            Ara
          </button>
        </div>
      </div>

      {/* Hızlı Filtreler */}
      <div className="space-y-6">
        {/* Şehir Filtreleri */}
        <div>
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Popüler Şehirler</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => handleQuickFilter('city', city)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Puan Türü Filtreleri */}
        <div>
          <div className="flex items-center mb-3">
            <Award className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Puan Türü</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {scoreTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleQuickFilter('scoreType', type.value)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Üniversite Türü Filtreleri */}
        <div>
          <div className="flex items-center mb-3">
            <Building className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Üniversite Türü</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {universityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleQuickFilter('universityType', type.value)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Burs Durumu Filtreleri */}
        <div>
          <div className="flex items-center mb-3">
            <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Burs Durumu</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {scholarshipLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleQuickFilter('scholarshipLevel', level.value)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm"
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Eğitim Dili Filtreleri */}
        <div>
          <div className="flex items-center mb-3">
            <Globe className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Eğitim Dili</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleQuickFilter('languageOfInstruction', lang.value)}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 