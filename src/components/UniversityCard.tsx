'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Award, Users, Building, Globe, BookOpen, Heart, Plus, Check, ExternalLink, GraduationCap, Star } from 'lucide-react'
import { University, Department } from '@/types'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface UniversityCardProps {
  university: University
  department: Department
  showDepartmentInfo?: boolean
}

// Badge çıkarımı için yardımcı fonksiyon
function extractBadgesFromDepartmentName(name: string) {
  const badges: string[] = [];
  const regex = /\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(name)) !== null) {
    badges.push(match[1]);
  }
  return badges;
}

// Badge türü belirleme fonksiyonu
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

export default function UniversityCard({ 
  university, 
  department, 
  showDepartmentInfo = true 
}: UniversityCardProps) {
  const { comparisonItems, addToComparison, removeFromComparison } = useStore()
  const isInComparison = comparisonItems.some(
    item => item.universityId === university.id && item.departmentId === department.id
  )
  const handleComparisonToggle = () => {
    if (isInComparison) {
      removeFromComparison(university.id, department.id)
    } else {
      const comparisonPayload = {
        universityName: university.name,
        departmentName: department.name,
        logo: university.logo,
        ...university,
        ...department,
        universityId: String(university.id),
        departmentId: String(department.id)
      };
      console.log('Karşılaştırmaya eklenen:', comparisonPayload);
      addToComparison(comparisonPayload)
    }
  }
  // Badge fonksiyonları sadeleştirildi
  const getUniversityTypeBadge = () => {
    switch (university.type) {
      case 'state':
        return <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Devlet</span>
      case 'foundation':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">Vakıf</span>
      case 'trnc':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">KKTC</span>
      default:
        return null
    }
  }
  const getScholarshipBadge = () => {
    if (department.scholarshipPercentage === 100) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">Tam Burslu</span>
    } else if (department.scholarshipPercentage === 50) {
      return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">%50 Burslu</span>
    } else if (department.scholarshipPercentage > 0) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">%{department.scholarshipPercentage} Burslu</span>
    }
    return null
  }
  // Bilgi Alanları ve Yıllık Karşılaştırma
  const historicalData = department.historicalData as { [key: number]: { rank?: number, score?: number, quota?: number } };
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.025] hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{university.name}</h3>
          <p className="text-sm text-blue-600 font-medium truncate">{department.name.replace(/\s*KPSS\s*/gi, '').trim()}</p>
        </div>
        <button
          onClick={handleComparisonToggle}
          className={cn(
            "p-2 rounded-full transition-colors",
            isInComparison ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          )}
        >
          {isInComparison ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      {/* Badges + Şehir + Parantezden çıkarılanlar */}
      <div className="flex flex-wrap gap-2 mb-1 items-center">
        {getUniversityTypeBadge()}
        <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{department.scoreType}</span>
        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 inline-block" /> {university.city}
        </span>
        {/* Parantez içi ve dil badge'leri birlikte */}
        {(() => {
          const dilMap: Record<string, string> = {
            english: 'İngilizce',
            turkish: 'Türkçe',
            french: 'Fransızca',
            german: 'Almanca',
            arabic: 'Arapça',
            russian: 'Rusça',
            spanish: 'İspanyolca',
            korean: 'Korece',
            italian: 'İtalyanca',
            chinese: 'Çince',
            polish: 'Lehçe',
            bulgarian: 'Bulgarca',
            armenian: 'Ermenice',
          };
          let badges = extractBadgesFromDepartmentName(department.name);
          // Dil badge'i ekle (parantezde yoksa)
          const langKey = department.languageOfInstruction?.toLowerCase();
          const langBadge = langKey && dilMap[langKey];
          if (langBadge && !badges.some(b => b.toLocaleLowerCase('tr-TR').includes(langBadge.toLocaleLowerCase('tr-TR')))) {
            badges = [langBadge, ...badges];
          }
          // Tüm log satırları kaldırıldı
          return badges.map((badge, i) => {
            const cleanBadge = badge.replace(/(^\()|(\)$)/g, '');
            const type = getBadgeType(cleanBadge);
            return (
              <span
                key={cleanBadge + i}
                className={
                  type === 'dil'
                    ? "bg-red-50 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium border border-red-100"
                    : type === 'burs'
                    ? "bg-orange-50 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium border border-orange-100"
                    : "bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium border border-indigo-100"
                }
              >
                {cleanBadge}
              </span>
            );
          });
        })()}
      </div>
      {/* Bilgi ve Karşılaştırma - Modern Grid + Timeline */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 w-full">
        {/* Sol: 2x2 İkonlu Grid Bilgi Kutusu */}
        <div className="flex-1 grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-2 text-gray-500 text-xs font-semibold"><GraduationCap className="w-4 h-4" /> Fakülte</span>
            <span className="text-base font-bold text-gray-800">{department.facultyName}</span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-2 text-gray-500 text-xs font-semibold"><Award className="w-4 h-4" /> Sıralama</span>
            <span className="text-base font-bold text-blue-700">{department.lastYearRank || '-'}</span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-2 text-gray-500 text-xs font-semibold"><Users className="w-4 h-4" /> Kontenjan</span>
            <span className="text-base font-bold text-orange-700">{department.quota || '-'}</span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-2 text-gray-500 text-xs font-semibold"><Star className="w-4 h-4" /> Taban Puan</span>
            <span className="text-base font-bold text-green-700">{department.lastYearScore || '-'}</span>
          </div>
        </div>
        {/* Sağ: Son 3 Yıl Karşılaştırması - Tablo Grid */}
        <div className="flex-1 flex flex-col items-center justify-center md:items-center md:justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Son 3 Yıl Karşılaştırması</span>
          </div>
          <div className="w-full flex justify-center">
            <div className="overflow-x-auto mx-auto">
              <table className="border-separate border-spacing-x-4 border-spacing-y-1 bg-white rounded-xl shadow-sm">
                <thead>
                  <tr>
                    <th className="text-xs font-semibold text-gray-500 text-right"></th>
                    {[2024, 2023, 2022].map(year => (
                      <th key={year} className="text-xs font-bold text-gray-900 text-center bg-gray-50 rounded px-2 py-1">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xs font-semibold text-blue-700 text-right pr-2">Sıralama</td>
                    {[2024, 2023, 2022].map(year => {
                      const ydata = historicalData?.[year] || {};
                      return (
                        <td key={year} className="text-xs font-bold text-blue-700 text-center">{ydata.rank ? ydata.rank : '-'}</td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="text-xs font-semibold text-green-700 text-right pr-2">Puan</td>
                    {[2024, 2023, 2022].map(year => {
                      const ydata = historicalData?.[year] || {};
                      return (
                        <td key={year} className="text-xs font-bold text-green-700 text-center">{ydata.score || '-'}</td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="text-xs font-semibold text-orange-700 text-right pr-2">Kontenjan</td>
                    {[2024, 2023, 2022].map(year => {
                      const ydata = historicalData?.[year] || {};
                      return (
                        <td key={year} className="text-xs font-bold text-orange-700 text-center">{ydata.quota ? ydata.quota : '-'}</td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Linkler - Modern butonlar */}
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Akademik Kadro Butonu */}
        {department.yopCode && (
          <>
            <a
              href={`https://yokatlas.yok.gov.tr/externalAppParameter.php?y=${department.yopCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors shadow-sm border border-red-200"
            >
              <Users className="w-4 h-4 mr-1" />
              Akademik Kadro
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a
              href={`https://yokatlas.yok.gov.tr/lisans.php?y=${department.yopCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors shadow-sm border border-blue-200"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Genel Bilgiler
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </>
        )}
        {/* Diğer butonlar */}
        {department.departmentWebsite && (
          <a
            href={department.departmentWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors shadow-sm border border-blue-200"
          >
            <Globe className="w-4 h-4 mr-1" />
            Bölüm Linki
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
        {department.yksAtlasLink && (
          <a
            href={department.yksAtlasLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-green-50 text-green-800 rounded-lg hover:bg-green-100 transition-colors shadow-sm border border-green-200"
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Yerleşenlerin YKS Netleri
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  )
} 