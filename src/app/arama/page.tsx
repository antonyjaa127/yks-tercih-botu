'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { fetchUniversities, searchUniversities } from '@/lib/api'
import { Search, SlidersHorizontal } from 'lucide-react'
import FilterPanel from '@/components/FilterPanel'
import UniversityCard from '@/components/UniversityCard'
import { useSearchParams } from 'next/navigation'
import type { SearchFilters } from '@/types';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation'

// Debouncing için hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Basit markdown ve madde işareti/numaralı liste parser
function renderFormattedText(text: string): (JSX.Element | null)[] {
  if (!text) return []
  // Önce satırlara böl
  const lines = text.split(/\n+/);
  const elements: (JSX.Element | null)[] = [];
  let currentList: string[] = [];
  let isNumbered = false;
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Numara veya madde işaretiyle başlıyorsa listeye ekle
    if (/^(\*|\-|\d+\.|•)/.test(trimmed)) {
      currentList.push(trimmed.replace(/^(\*|\-|\d+\.|•)\s*/, ''));
      if (/^\d+\./.test(trimmed)) isNumbered = true;
    } else {
      // Önceki listeyi bitir
      if (currentList.length > 0) {
        elements.push(
          isNumbered ? (
            <ol className="pl-6 mb-2 list-decimal text-gray-900" key={idx + '-ol'}>
              {currentList.map((item, i) => <li key={idx + '-' + i + '-' + item.slice(0,8)} dangerouslySetInnerHTML={{__html: formatInline(item)}} />)}
            </ol>
          ) : (
            <ul className="pl-6 mb-2 list-disc text-gray-900" key={idx + '-ul'}>
              {currentList.map((item, i) => <li key={idx + '-' + i + '-' + item.slice(0,8)} dangerouslySetInnerHTML={{__html: formatInline(item)}} />)}
            </ul>
          )
        );
        currentList = [];
        isNumbered = false;
      }
      // Başlık veya kalın/italik satırları işaretle
      if (/^\*\*.+\*\*$/.test(trimmed)) {
        elements.push(<div key={idx + '-b'} className="font-bold text-blue-800 mb-1">{trimmed.replace(/\*\*/g, '')}</div>);
      } else if (/^\*.+\*$/.test(trimmed)) {
        elements.push(<div key={idx + '-i'} className="italic text-gray-700 mb-1">{trimmed.replace(/\*/g, '')}</div>);
      } else if (trimmed) {
        elements.push(<div key={idx + '-d'} dangerouslySetInnerHTML={{__html: formatInline(trimmed)}} className="mb-2" />);
      }
    }
  });
  // Son listeyi ekle
  if (currentList.length > 0) {
    elements.push(
      isNumbered ? (
        <ol className="pl-6 mb-2 list-decimal text-gray-900" key={'last-ol-' + Math.random()}>
          {currentList.map((item, i) => <li key={'last-' + i + '-' + item.slice(0,8)} dangerouslySetInnerHTML={{__html: formatInline(item)}} />)}
        </ol>
      ) : (
        <ul className="pl-6 mb-2 list-disc text-gray-900" key={'last-ul-' + Math.random()}>
          {currentList.map((item, i) => <li key={'last-' + i + '-' + item.slice(0,8)} dangerouslySetInnerHTML={{__html: formatInline(item)}} />)}
        </ul>
      )
    );
  }
  return elements;
}

// Inline **kalın** ve *italik* parser
function formatInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>');
}

export default function SearchPage() {
  const { 
    universities, 
    setUniversities, 
    addUniversities,
    searchFilters, 
    setSearchFilters,
    isFilterPanelOpen,
    setFilterPanelOpen,
    setLoading,
    isLoadingMore,
    setLoadingMore,
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore
  } = useStore()
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchFilters.query || '')
  const [setIsFilterCollapsed] = useState<React.Dispatch<React.SetStateAction<boolean>>>(() => () => {})
  const [aiBaseFilters, setAiBaseFilters] = useState<SearchFilters | null>(null);
  const [aiMetaText, setAiMetaText] = useState<{ aciklama?: string; neden_boyle?: string; oneriler?: string[]; filtre_ozet?: unknown } | null>(null);

  // Debounced search filters - 800ms delay
  const debouncedFilters = useDebounce(searchFilters, 800)

  // Dinamik arama fonksiyonu
  const performSearch = useCallback(async (filters: typeof searchFilters, resetResults = true) => {
    if (resetResults) {
      setLoading(true)
      setCurrentPage(0)
    } else {
      setLoadingMore(true)
    }
    try {
      const hasAnyFilter =
        (filters.educationLevels && filters.educationLevels.length > 0) ||
        filters.query ||
        (filters.cities && filters.cities.length > 0) ||
        filters.scoreType ||
        (filters.universityTypes && filters.universityTypes.length > 0) ||
        (filters.scholarshipLevels && filters.scholarshipLevels.length > 0) ||
        filters.languageOfInstruction ||
        filters.minScore > 0 ||
        filters.maxScore < 600 ||
        filters.minRank > 0 ||
        filters.maxRank < 500000 ||
        filters.hasDormitory ||
        filters.hasSports ||
        (filters.universityNames && filters.universityNames.length > 0) ||
        (filters.departmentNames && filters.departmentNames.length > 0)

      let result
      if (hasAnyFilter) {
        // Filtreli arama
        result = await searchUniversities(
          filters.query,
          resetResults ? 0 : currentPage + 1,
          10,
          {
            scoreType: filters.scoreType || undefined,
            languageOfInstruction: filters.languageOfInstruction || undefined,
            minScore: filters.minScore > 0 ? filters.minScore : undefined,
            maxScore: filters.maxScore < 600 ? filters.maxScore : undefined,
            minRank: filters.minRank > 0 ? filters.minRank : undefined,
            maxRank: filters.maxRank < 500000 ? filters.maxRank : undefined,
            hasDormitory: filters.hasDormitory || undefined,
            hasSports: filters.hasSports || undefined,
            educationLevels: filters.educationLevels && filters.educationLevels.length > 0 ? filters.educationLevels : undefined,
            cities: filters.cities && filters.cities.length > 0 ? filters.cities : undefined,
            universityNames: filters.universityNames && filters.universityNames.length > 0 ? filters.universityNames : undefined,
            departmentNames: filters.departmentNames && filters.departmentNames.length > 0 ? filters.departmentNames : undefined,
            universityTypes: filters.universityTypes && filters.universityTypes.length > 0 ? filters.universityTypes : undefined,
            scholarshipLevels: filters.scholarshipLevels && filters.scholarshipLevels.length > 0 ? filters.scholarshipLevels : undefined
          }
        )
      } else {
        // Normal yükleme (filtresiz)
        result = await fetchUniversities(resetResults ? 0 : currentPage + 1, 10, 'score')
      }
      // Her zaman state'i güncelle
      if (resetResults) {
        setUniversities(result.universities)
        setCurrentPage(0)
      } else {
        addUniversities(result.universities)
        setCurrentPage(currentPage + 1)
      }
      setHasMore(result.hasMore)
    } catch (error) {
      // console.error('💥 Arama hatası:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [setUniversities, addUniversities, setLoading, setLoadingMore, setCurrentPage, setHasMore, fetchUniversities, searchUniversities, currentPage])

  // Varsayılan filtreler
  const defaultFilters: SearchFilters = {
    query: '',
    cities: [] as string[],
    scoreType: '',
    universityTypes: [] as string[],
    scholarshipLevels: [] as string[],
    languageOfInstruction: '',
    minScore: 0,
    maxScore: 600,
    minRank: 0,
    maxRank: 500000,
    hasDormitory: false,
    hasSports: false,
    departmentNames: [] as string[],
    universityNames: [] as string[],
    educationLevels: [] as string[],
    feeTypes: [] as string[],
    sortType: 'siralama', // defaultu başarı sırası
  };

  // İlk yükleme: Sadece bir defa çalışsın
  useEffect(() => {
    if (universities.length === 0) {
      performSearch(defaultFilters, true);
      // setSearchFilters(defaultFilters); // Zincirleme tetiklenmeyi önlemek için kaldırıldı
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtreler değiştiğinde (debounced), sadece güncel filtrelerle istek at
  useEffect(() => {
    performSearch(debouncedFilters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]);

  // Kullanıcı filtreyi değiştirdiğinde aiFiltersApplied flag'i değişmesin, sadece aiMeta değişince sıfırlansın

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSearchFilters({ sortType: 'siralama' })
  }, [])

  // Kullanıcı filtreyi değiştirdiğinde aiMeta parametresini URL'den kaldır
  const handleUserFilterChange = (changed: Partial<SearchFilters>) => {
    // Her zaman mevcut filtre state'ini baz al ve değişikliği merge et
    const newFilters = { ...searchFilters, ...changed };
    setSearchFilters(newFilters);

    // Mevcut URL parametrelerini oku
    const params = new URLSearchParams(window.location.search);
    // aiMeta parametresini sakla
    const aiMetaValue = params.get('aiMeta');

    // Tüm filtreleri query string'e ekle
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        !(Array.isArray(value) && value.length === 0) &&
        value !== '' &&
        !(typeof value === 'boolean' && value === false)
      ) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, String(value));
        }
      } else {
        params.delete(key);
      }
    });

    // aiMeta parametresini tekrar ekle (en son!)
    if (aiMetaValue) {
      params.set('aiMeta', aiMetaValue);
    }

    router.replace(window.location.pathname + (params.toString() ? '?' + params.toString() : ''), { scroll: false });
  };

  // Aktif filtre sayısını hesapla
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchFilters.query) count++
    if (searchFilters.cities && searchFilters.cities.length > 0) count++
    if (searchFilters.scoreType) count++
    if (searchFilters.universityTypes && searchFilters.universityTypes.length > 0) count++
    if (searchFilters.scholarshipLevels && searchFilters.scholarshipLevels.length > 0) count++
    if (searchFilters.languageOfInstruction) count++
    if (searchFilters.minScore > 0) count++
    if (searchFilters.maxScore < 600) count++
    if (searchFilters.minRank > 0) count++
    if (searchFilters.maxRank < 500000) count++
    if (searchFilters.hasDormitory) count++
    if (searchFilters.hasSports) count++
    return count
  }, [searchFilters])

  // Manuel arama fonksiyonu
  const handleSearch = async () => {
    setSearchFilters({ query: searchQuery })
  }

  // aiMeta parametresi
  let aiMeta = null;
  try {
    aiMeta = searchParams.get('aiMeta') ? JSON.parse(decodeURIComponent(searchParams.get('aiMeta')!)) : null;
  } catch { aiMeta = null; }

  // AI'dan gelen filtre ve metinleri sadece ilk açılışta uygula
  useEffect(() => {
    let aiMetaObj = null;
    try {
      aiMetaObj = searchParams.get('aiMeta') ? JSON.parse(decodeURIComponent(searchParams.get('aiMeta')!)) : null;
    } catch { aiMetaObj = null; }
    if (aiMetaObj && aiMetaObj.filtre_uygula) {
      setSearchFilters({ ...searchFilters, ...aiMetaObj.filtre_uygula });
      setAiMetaText({
        aciklama: aiMetaObj.aciklama,
        neden_boyle: aiMetaObj.neden_boyle,
        oneriler: aiMetaObj.oneriler,
        filtre_ozet: aiMetaObj.filtre_uygula
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Üniversiteleri sıralama (client-side)
  const sortedUniversities = useMemo(() => {
    if (!universities || universities.length === 0) return [];
    return universities.map(uni => {
      const hasDepartments = uni.departments && uni.departments.length > 0;
      const department = hasDepartments
        ? uni.departments[0]
        : {
            id: 'placeholder',
            universityId: parseInt(uni.id),
            name: 'Bölüm bilgisi mevcut değil',
            facultyName: 'Bilgi mevcut değil',
            scoreType: 'SAY',
            lastYearScore: 0,
            lastYearRank: 0,
            quota: 0,
            scholarshipPercentage: 0,
            languageOfInstruction: 'turkish',
            description: 'Bölüm bilgisi henüz eklenmemiş',
            careerOpportunities: [],
            internshipOpportunities: [],
            yopCode: '',
            historicalData: { 2024: {}, 2023: {}, 2022: {} },
            latestScores: [],
            academics: [],
            educationLevel: 'lisans'
          } as import('@/types').Department;
      return {
        university: uni,
        department,
        hasDepartments
      };
    });
  }, [universities]);

  // Daha fazla üniversite yükle
  const loadMoreUniversities = async () => {
    if (!hasMore || isLoadingMore) return
    await performSearch(searchFilters, false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Backdrop */}
      {isFilterPanelOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setFilterPanelOpen(false)}
        />
      )}
      {/* Mobile Floating Filter Button */}
      <button
        onClick={() => setFilterPanelOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-110 active:scale-95 border-2 border-white"
        title="Filtreleri Aç"
      >
        <div className="relative">
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
      </button>
      <div className="lg:flex">
        {/* Filter Panel */}
        <div className="lg:flex-shrink-0">
          <FilterPanel 
            isOpen={isFilterPanelOpen}
            onClose={() => setFilterPanelOpen(false)}
            onCollapseChange={setIsFilterCollapsed}
            setSearchFilters={handleUserFilterChange}
          />
        </div>
        {/* Main Content */}
        <div className="flex-1 lg:min-w-0">
          {/* Sadece arama inputu */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Üniversite, bölüm veya şehir adı arayın..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchFilters({ query: e.target.value })
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Ara
              </button>
            </div>
            {/* AI metni kutusu */}
            {aiMeta && (
              <div className="mt-6 mb-2 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow text-left animate-fade-in">
                <h2 className="text-lg font-bold text-blue-800 mb-2">🎯 Sizin İçin Akıllı Tercih Listesi</h2>
                <p className="mb-3 text-indigo-700 font-semibold text-sm">
                  Tercih listenizi daha da kişiselleştirmek için sol taraftaki filtreleri kullanabilirsiniz. Hayalinizdeki üniversite ve bölüme ulaşmak için filtreleri dilediğiniz gibi değiştirin, sistemimiz anında en uygun sonuçları size sunar!
                </p>
                {aiMetaText?.aciklama && <div className="mb-2 text-gray-800">{renderFormattedText(aiMetaText.aciklama)}</div>}
                {aiMetaText?.neden_boyle && <div className="mb-2 text-blue-700 font-medium">Neden böyle bir liste? <span className="font-normal text-gray-700">{renderFormattedText(aiMetaText.neden_boyle)}</span></div>}
                {aiMetaText?.oneriler && Array.isArray(aiMetaText.oneriler) && (
                  <ul className="list-disc pl-6 text-gray-900 mb-2">
                    {aiMetaText.oneriler.map((o: string, i: number) => <li key={i}>{o}</li>)}
                  </ul>
                )}
                {(() => {
                  if (!aiMetaText?.filtre_ozet) return null;
                  if (typeof aiMetaText.filtre_ozet !== 'string') return null;
                  const filtreOzetStr = aiMetaText.filtre_ozet;
                  if (!filtreOzetStr) return null;
                  return <pre className="bg-white rounded p-2 text-xs text-gray-600 border mt-2 overflow-x-auto">{filtreOzetStr}</pre>;
                })()}
              </div>
            )}
          </div>
          {/* Results */}
          <div className="p-4">
            {sortedUniversities.length > 0 ? (
              <>
                <div className="grid gap-6">
                  {sortedUniversities.map(({ university, department }) => (
                    <UniversityCard
                      key={`${university.id}-${department.id}`}
                      university={university}
                      department={department}
                    />
                  ))}
                </div>
                {/* Daha Fazla Yükle Butonu */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMoreUniversities}
                      disabled={isLoadingMore}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isLoadingMore ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Yükleniyor...
                        </>
                      ) : (
                        <>Daha Fazla Yükle</>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">Sonuç bulunamadı.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 