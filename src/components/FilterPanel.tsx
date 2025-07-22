'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { scoreTypes, universityTypes, scholarshipLevels, languageOptions } from '@/data/mockData'
import type { SearchFilters } from '@/types';

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onCollapseChange?: (isCollapsed: boolean) => void
  setSearchFilters?: (changed: Partial<SearchFilters>) => void
}

export default function FilterPanel({ isOpen, onClose, onCollapseChange, setSearchFilters: setSearchFiltersProp }: FilterPanelProps) {
  const { searchFilters, setSearchFilters: setSearchFiltersStore, resetFilters, universities } = useStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [showScoreFilter, setShowScoreFilter] = useState(false)
  const [showRankFilter, setShowRankFilter] = useState(false)
  const [allDepartments, setAllDepartments] = useState<string[]>([])

  // Açılır/kapanır filtreler için state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Şehirleri dinamik olarak yükle
  useEffect(() => {
    const fetchCities = async () => {
      if (cities.length > 0) return
      setCitiesLoading(true)
      try {
        const response = await fetch('/api/cities')
        if (!response.ok) throw new Error(`Cities API error: ${response.status}`)
        const data = await response.json()
        setCities(data.cities || [])
      } catch (error) {
        setCities(['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'])
      } finally {
        setCitiesLoading(false)
      }
    }
    fetchCities()
  }, [cities.length])

  // Parantez ve eklerden arındırılmış ana bölüm adını döndür
  function getCleanDepartmentName(departmentName: string) {
    let cleanName = departmentName;
    // Parantez içindeki burs/dil/indirim bilgilerini kaldır
    cleanName = cleanName.replace(/\((.*?)\)/g, '').trim();
    // KPSS kelimesini kaldır
    cleanName = cleanName.replace(/\s*KPSS\s*/gi, '').trim();
    // Başında "İngilizce ", "Almanca ", "Fransızca " gibi dilleri kaldır
    cleanName = cleanName.replace(/^(İngilizce|English|Almanca|German|Fransızca|Fransizca|French)\s+/i, '').trim();
    // Fazla boşlukları temizle
    cleanName = cleanName.replace(/\s+/g, ' ').trim();
    return cleanName;
  }

  // Tüm bölüm başlıklarını API'den çek
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/universities?limit=10000')
        const data = await response.json()
        // Tüm üniversitelerin tüm bölümlerini topla ve temizle
        const departments = Array.from(new Set(
          (data.universities || [])
            .flatMap((u: any) => (u.departments || []).map((d: any) => getCleanDepartmentName(d.name)))
        )).sort((a, b) => a.localeCompare(b, 'tr'))
        setAllDepartments(departments)
      } catch (error) {
        setAllDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  const universityNames = Array.from(new Set(universities.flatMap(u => u.name))).sort()
  // const departmentNames = Array.from(new Set(universities.flatMap(u => u.departments.map(d => d.name)))).sort()
  const departmentNames = allDepartments

  // Sıralama tipi değiştiğinde Akademik filtrede inputların görünürlüğünü otomatik ayarla
  useEffect(() => {
    setShowScoreFilter(searchFilters.sortType === 'puan');
    setShowRankFilter(searchFilters.sortType === 'siralama');
  }, [searchFilters.sortType]);

  const handleCollapseToggle = (collapsed: boolean) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsCollapsed(collapsed)
      onCollapseChange?.(collapsed)
    }
  }

  const [expandedSections, setExpandedSections] = useState({
    genel: true,
    akademik: true,
    universite: true,
    diger: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Çoklu seçim için yardımcı fonksiyon
  const handleMultiSelect = (filterType: keyof typeof searchFilters, value: string) => {
    const current = (searchFilters[filterType] as string[])
    const setter = setSearchFiltersProp || setSearchFiltersStore;
    if (current.includes(value)) {
      setter({ [filterType]: current.filter(v => v !== value) })
    } else {
      setter({ [filterType]: [...current, value] })
    }
  }

  // Tekli seçim için
  const handleFilterChange = (filterType: keyof typeof searchFilters, value: string | number | boolean) => {
    const setter = setSearchFiltersProp || setSearchFiltersStore;
    setter({ [filterType]: value })
  }

  // Sıralama tipi değişince puan/sıra filtrelerini göster/gizle
  const handleSortTypeChange = (value: 'puan' | 'siralama') => {
    const setter = setSearchFiltersProp || setSearchFiltersStore;
    setter({ sortType: value })
    setShowScoreFilter(value === 'puan')
    setShowRankFilter(value === 'siralama')
  }

  // Açılır/kapanır select list fonksiyonu
  const renderDropdownFilter = (label: string, key: string, options: Array<string | {label: string, value: string}>, selected: string[], onSelect: (val: string) => void) => (
    <div className="mb-2">
      <button type="button" className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors" onClick={() => setOpenDropdown(openDropdown === key ? null : key)}>
        <span className="text-xs font-medium text-gray-800 opacity-80">{label}</span>
        {openDropdown === key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {openDropdown === key && (
        <div className="mt-2 max-h-40 overflow-y-auto border border-gray-100 rounded-lg bg-white shadow p-2 z-10">
          {[...new Set(options)].map((opt, idx) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <label key={value + '-' + idx} className="flex items-center gap-2 text-sm px-2 py-1 cursor-pointer hover:bg-blue-50 rounded">
                <input type="checkbox" checked={selected.includes(value)} onChange={() => onSelect(value)} />
                <span className="text-gray-800 opacity-80">{label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className={`fixed inset-y-0 left-0 z-40 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:relative lg:inset-auto lg:transform-none lg:shadow-none lg:border-r lg:border-b lg:border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-80 lg:w-12' : 'w-80 lg:w-80'}`}>
      <div className="flex flex-col h-full">
        {isCollapsed && (
          <div className="hidden lg:flex flex-col items-center justify-center h-full space-y-3 py-6">
            <button onClick={() => handleCollapseToggle(false)} className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors group bg-gray-50" title="Filtreleri Göster">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary-600" />
            </button>
            <div className="w-5 h-px bg-gray-300"></div>
            <button onClick={resetFilters} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group bg-gray-50" title="Filtreleri Temizle">
              <X className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-600" />
            </button>
          </div>
        )}
        <div className={`block lg:${isCollapsed ? 'hidden' : 'block'} h-full flex flex-col`}>
          <>
            <div className="flex items-center justify-between p-4 pt-24 border-b border-gray-200 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-primary-600" />
                Filtreler
              </h2>
              <div className="flex items-center space-x-2">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Kapat">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-primary-600" />
                Filtreler
              </h2>
              <div className="flex items-center space-x-2">
                <button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">Temizle</button>
                <button onClick={() => handleCollapseToggle(true)} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Gizle">
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Genel Filtreler */}
              <div className="border-b border-gray-100 pb-6">
                <button onClick={() => toggleSection('genel')} className="flex items-center justify-between w-full mb-3 group">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center">
                    <span className="mr-1" role="img" aria-label="Genel">⚙️</span> Genel
                  </h3>
                  {expandedSections.genel ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                </button>
                {expandedSections.genel && (
                  <div className="space-y-3">
                    {/* Sıralama Tipi */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Sıralama Tipi</label>
                      <select value={searchFilters.sortType} onChange={e => handleSortTypeChange(e.target.value as 'puan' | 'siralama')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80">
                        <option value="puan">Puan</option>
                        <option value="siralama">Başarı Sırası</option>
                      </select>
                    </div>
                    {/* Puan Türü */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Puan Türü</label>
                      <select value={searchFilters.scoreType} onChange={e => handleFilterChange('scoreType', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80">
                        <option value="">Tüm Puan Türleri</option>
                        {scoreTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                      </select>
                    </div>
                    {/* Ön Lisans / Lisans */}
                    <div>
                      <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Öğrenim Türü</label>
                      <div className="flex gap-2">
                        {['lisans', 'onlisans'].map(level => (
                          <label key={level} className="flex items-center gap-1 text-sm text-gray-800 opacity-80">
                            <input type="checkbox" checked={searchFilters.educationLevels.includes(level)} onChange={() => handleMultiSelect('educationLevels', level)} />
                            {level === 'lisans' ? 'Lisans' : 'Ön Lisans'}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Akademik Filtreler */}
              <div className="border-b border-gray-100 pb-6">
                <button onClick={() => toggleSection('akademik')} className="flex items-center justify-between w-full mb-3 group">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center">
                    <span className="mr-1" role="img" aria-label="Akademik">🎓</span> Akademik
                  </h3>
                  {expandedSections.akademik ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                </button>
                {expandedSections.akademik && (
                  <div className="space-y-3">
                    {/* Sıralama tipi seçimine göre dinamik aralık filtreleri */}
                    {showScoreFilter && (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Min. Puan</label>
                          <input type="number" value={searchFilters.minScore} onChange={e => handleFilterChange('minScore', Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80" min="0" max="600" placeholder="0" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Maks. Puan</label>
                          <input type="number" value={searchFilters.maxScore} onChange={e => handleFilterChange('maxScore', Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80" min="0" max="600" placeholder="600" />
                        </div>
                      </div>
                    )}
                    {showRankFilter && (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Min. Sıralama</label>
                          <input type="number" value={searchFilters.minRank} onChange={e => handleFilterChange('minRank', Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80" min="0" placeholder="1" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Maks. Sıralama</label>
                          <input type="number" value={searchFilters.maxRank} onChange={e => handleFilterChange('maxRank', Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80" min="0" placeholder="∞" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Üniversite/Bölüm/Şehir Filtreleri */}
              <div className="border-b border-gray-100 pb-6">
                <button onClick={() => toggleSection('universite')} className="flex items-center justify-between w-full mb-3 group">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center">
                    <span className="mr-1" role="img" aria-label="Üniversite ve Şehir">🏛️</span> Üniversite & Bölüm & Şehir
                  </h3>
                  {expandedSections.universite ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                </button>
                {expandedSections.universite && (
                  <div className="space-y-3">
                    {renderDropdownFilter('Şehirler', 'cities', cities, searchFilters.cities, val => handleMultiSelect('cities', val))}
                    {renderDropdownFilter('Üniversiteler', 'universityNames', universityNames, searchFilters.universityNames, val => handleMultiSelect('universityNames', val))}
                    {renderDropdownFilter('Bölümler', 'departmentNames', departmentNames, searchFilters.departmentNames, val => handleMultiSelect('departmentNames', val))}
                  </div>
                )}
              </div>
              {/* Diğer Filtreler */}
              <div className="pb-6">
                <button onClick={() => toggleSection('diger')} className="flex items-center justify-between w-full mb-3 group">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center">
                    <span className="mr-1" role="img" aria-label="Diğer">✨</span> Diğer
                  </h3>
                  {expandedSections.diger ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />}
                </button>
                {expandedSections.diger && (
                  <div className="space-y-3">
                    {renderDropdownFilter('Burs/Ücret', 'scholarshipLevels', [
                      { label: 'Tam Burslu', value: 'full' },
                      { label: '%50 Burslu', value: '50' },
                      { label: '%25 Burslu', value: '25' },
                      { label: 'Ücretli', value: 'paid' }
                    ], searchFilters.scholarshipLevels, val => handleMultiSelect('scholarshipLevels', val))}
                    {/* Üniversite Türü Çoklu Seçim */}
                    <div>
                      <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Üniversite Türü</label>
                      <div className="flex gap-2">
                        {universityTypes.map(type => (
                          <label key={type.value} className="flex items-center gap-1 text-sm text-gray-800 opacity-80">
                            <input type="checkbox" checked={searchFilters.universityTypes.includes(type.value)} onChange={() => handleMultiSelect('universityTypes', type.value)} />
                            {type.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Eğitim Dili */}
                    <div>
                      <label className="block text-xs font-medium text-gray-800 opacity-80 mb-2">Eğitim Dili</label>
                      <select value={Array.isArray(searchFilters.languageOfInstruction) ? searchFilters.languageOfInstruction[0] : searchFilters.languageOfInstruction} onChange={e => handleFilterChange('languageOfInstruction', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-800 opacity-80">
                        <option value="">Tüm Diller</option>
                        {languageOptions.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                      </select>
                    </div>
                    {/* Yurt ve Spor Olanakları */}
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  )
} 