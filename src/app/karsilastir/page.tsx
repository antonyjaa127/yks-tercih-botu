'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
// mockUniversities importunu kaldırıyorum
// import { mockUniversities } from '@/data/mockData'
import { University, Department } from '@/types'
import { 
  X,
  ArrowLeft,
  Building
} from 'lucide-react'
import Link from 'next/link'

interface ComparisonData {
  university: University
  department: Department
}

export default function ComparisonPage() {
  const { comparisonItems, removeFromComparison, clearComparison } = useStore()
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    academic: true,
    facilities: true,
    contact: false
  })
  const [isLoading, setIsLoading] = useState(false);

  // Accordion state for each university column
  const [openAccordion, setOpenAccordion] = useState<{ [key: number]: boolean }>({})
  const toggleAccordion = (idx: number) => {
    setOpenAccordion((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Artık comparisonData state'i ve useEffect'e gerek yok, comparisonItems doğrudan kullanılacak
  const comparisonData = comparisonItems.map(item => ({ university: item.university, department: item.department }))

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (comparisonData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Karşılaştırma Listesi Boş
          </h2>
          <p className="text-gray-600 mb-6">
            Karşılaştırmak için en az 2 üniversite seçmelisiniz.
          </p>
          <Link
            href="/arama"
            className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
          >
            <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
            Üniversite Arama
          </Link>
        </div>
      </div>
    )
  }

  if (comparisonData.length === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tek Üniversite Seçili
          </h2>
          <p className="text-gray-600 mb-6">
            Karşılaştırma yapabilmek için en az 2 üniversite seçmelisiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 justify-center">
            <Link
              href="/arama"
              className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Daha Fazla Ekle
            </Link>
            <button
              onClick={clearComparison}
              className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base"
            >
              <X className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Temizle
            </button>
          </div>
        </div>
      </div>
    )
  }

  // UniversityCard'dakiyle birebir aynı badge çıkarım fonksiyonları
  function extractBadgesFromDepartmentName(name: string) {
    const badges: string[] = [];
    const regex = /\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(name)) !== null) {
      badges.push(match[1]);
    }
    return badges;
  }
  function getBadgeType(badge: string) {
    const dilListesi = [
      'ingilizce', 'almanca', 'fransızca', 'arapça', 'rusça', 'ispanyolca',
      'korece', 'italyanca', 'çince', 'lehçe', 'bulgarca', 'ermenice', 'türkçe'
    ];
    const lower = badge.toLocaleLowerCase('tr-TR');
    if (dilListesi.some(dil => lower.includes(dil))) return 'dil';
    if (lower.includes('burslu') || lower.includes('ücretli') || lower.includes('indirimli')) return 'burs';
    return 'diger';
  }
  function getScholarshipBadgeFromName(department: ComparisonData['department']) {
    const badges = extractBadgesFromDepartmentName(department.name);
    const bursBadge = badges.find(badge => getBadgeType(badge) === 'burs');
    if (bursBadge) {
      return <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium border border-orange-100">{bursBadge}</span>;
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
                    Üniversite Karşılaştırması
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600 mt-1">
                    {comparisonData.length} üniversite karşılaştırılıyor
                  </p>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Link
                    href="/arama"
                    className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors text-sm lg:text-base"
                  >
                    <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Geri Dön
                  </Link>
                  <button
                    onClick={clearComparison}
                    className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base"
                  >
                    <X className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Tümünü Temizle
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Modern Comparison Table */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm lg:text-base">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">Özellik</th>
                    {comparisonData.map((data, index) => (
                      <th key={index} className="text-center py-3 px-4 min-w-[260px] bg-gray-50 align-top">
                        <div className="flex flex-col items-center gap-1">
                          <h3 className="font-semibold text-gray-900 text-base text-center">
                            {data.university.name}
                          </h3>
                          <p className="text-blue-600 text-xs mt-1 truncate w-full">
                            {data.department.name}
                          </p>
                          <button
                            onClick={() => removeFromComparison(data.university.id, data.department.id)}
                            className="mt-1 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            title="Karşılaştırmadan çıkar"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Temel Bilgiler */}
                  {[
                    { label: 'Fakülte', value: (d: ComparisonData) => d.department.facultyName },
                    { label: 'Şehir', value: (d: ComparisonData) => d.university.city },
                    { label: 'Üniversite Türü', value: (d: ComparisonData) => d.university.type === 'state' ? 'Devlet' : d.university.type === 'foundation' ? 'Vakıf' : 'KKTC' },
                    { label: 'Puan Türü', value: (d: ComparisonData) => d.department.scoreType },
                    { label: 'Dil', value: (d: ComparisonData) => {
                      if (d.department.languageOfInstruction === 'english') return 'İngilizce';
                      if (d.department.languageOfInstruction === 'turkish') return 'Türkçe';
                      if (d.department.languageOfInstruction === 'hybrid') return 'Karma';
                      return d.department.languageOfInstruction || '-';
                    } },
                    { label: 'Öğrenim Süresi', value: (d: ComparisonData) => d.department.educationLevel === 'onlisans' ? '2 Yıl' : '4 Yıl' },
                    { label: 'Ücret/Burs', value: (d: ComparisonData) => d.university.type === 'state' ? <span className="text-green-700 font-semibold">Ücretsiz</span> : (getScholarshipBadgeFromName(d.department) || <span className="text-gray-500">Ücretli</span>) },
                  ].map((row, i) => (
                    <tr key={row.label} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-bold text-gray-700 bg-gray-50 sticky left-0 z-10">{row.label}</td>
                      {comparisonData.map((data, idx) => (
                        <td key={idx} className="py-3 px-4 text-center text-gray-900 font-normal">{row.value(data) || '-'}</td>
                      ))}
                    </tr>
                  ))}

                  {/* Accordion: Yıllara Göre Bilgiler */}
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10">Yıllara Göre Bilgiler</td>
                    {comparisonData.map((data, idx) => (
                      <td key={idx} className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {/* 2024 */}
                          <div className="mb-1">
                            <span className="font-bold text-blue-700">2024</span>
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="inline-block text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">Kontenjan: {data.department.historicalData[2024]?.quota ?? '-'}</span>
                              <span className="inline-block text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">Sıralama: {data.department.historicalData[2024]?.rank ?? '-'}</span>
                              <span className="inline-block text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">Taban Puan: {data.department.historicalData[2024]?.score ?? '-'}</span>
                            </div>
                          </div>
                          {/* Accordion for 2023/2022 */}
                          <button
                            className="text-xs text-gray-500 underline hover:text-blue-600 mb-1"
                            onClick={() => toggleAccordion(idx)}
                            type="button"
                          >
                            {openAccordion[idx] ? 'Geçmiş Yılları Gizle' : 'Geçmiş Yılları Göster'}
                          </button>
                          {openAccordion[idx] && (
                            <div className="flex flex-col gap-1 w-full">
                              <div className="mb-1">
                                <span className="font-bold text-gray-700">2023</span>
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="inline-block text-xs bg-gray-100 text-gray-800 rounded px-2 py-0.5">Kontenjan: {data.department.historicalData[2023]?.quota ?? '-'}</span>
                                  <span className="inline-block text-xs bg-gray-100 text-gray-800 rounded px-2 py-0.5">Sıralama: {data.department.historicalData[2023]?.rank ?? '-'}</span>
                                  <span className="inline-block text-xs bg-gray-100 text-gray-800 rounded px-2 py-0.5">Taban Puan: {data.department.historicalData[2023]?.score ?? '-'}</span>
                                </div>
                              </div>
                              <div>
                                <span className="font-bold text-gray-500">2022</span>
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="inline-block text-xs bg-gray-50 text-gray-600 rounded px-2 py-0.5">Kontenjan: {data.department.historicalData[2022]?.quota ?? '-'}</span>
                                  <span className="inline-block text-xs bg-gray-50 text-gray-600 rounded px-2 py-0.5">Sıralama: {data.department.historicalData[2022]?.rank ?? '-'}</span>
                                  <span className="inline-block text-xs bg-gray-50 text-gray-600 rounded px-2 py-0.5">Taban Puan: {data.department.historicalData[2022]?.score ?? '-'}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Ek Bilgiler ve Butonlar */}
                  <tr>
                    <td className="py-6 px-4 font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 align-top">Ek Bilgiler</td>
                    {comparisonData.map((data, idx) => (
                      <td key={idx} className="py-6 px-4 text-center align-top">
                        <div className="flex flex-col items-center gap-2">
                          {/* Akademik Kadro */}
                          {data.department.yopCode && (
                            <a
                              href={`https://yokatlas.yok.gov.tr/externalAppParameter.php?y=${data.department.yopCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors shadow-sm border border-red-200"
                            >
                              Akademik Kadro
                            </a>
                          )}
                          {/* Genel Bilgiler */}
                          {data.department.yopCode && (
                            <a
                              href={`https://yokatlas.yok.gov.tr/lisans.php?y=${data.department.yopCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors shadow-sm border border-blue-200"
                            >
                              Genel Bilgiler
                            </a>
                          )}
                          {/* Bölüm Linki */}
                          {data.department.departmentWebsite && (
                            <a
                              href={data.department.departmentWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors shadow-sm border border-blue-200"
                            >
                              Bölüm Linki
                            </a>
                          )}
                          {/* Yerleşenlerin YKS Netleri */}
                          {data.department.yksAtlasLink && (
                            <a
                              href={data.department.yksAtlasLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-green-50 text-green-800 rounded-lg hover:bg-green-100 transition-colors shadow-sm border border-green-200"
                            >
                              Yerleşenlerin YKS Netleri
                            </a>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 