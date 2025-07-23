import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { University, Department } from '@/types'

interface MinimalUniversityCardProps {
  university: University
  department: Department
}

function getUniversityTypeBadge(university: University) {
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

function getScholarshipBadge(department: Department) {
  // Sadece (Burslu) yazıyorsa
  if (department.scholarshipPercentage > 0 && /\(burslu\)/i.test(department.name) && !/%\d+/.test(department.name)) {
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">Burslu</span>
  } else if (department.scholarshipPercentage === 100) {
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">Tam Burslu</span>
  } else if (department.scholarshipPercentage === 50) {
    return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">%50 Burslu</span>
  } else if (department.scholarshipPercentage > 0) {
    return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">%{department.scholarshipPercentage} Burslu</span>
  }
  return null
}

export default function MinimalUniversityCard({ university, department }: MinimalUniversityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100 flex flex-col gap-2 transition hover:shadow-md min-w-[260px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{university.name}</h3>
          <p className="text-sm text-blue-600 font-medium truncate">{department.name.replace(/\s*KPSS\s*/gi, '').trim()}</p>
        </div>
      </div>
      {/* Badge'ler */}
      <div className="flex flex-wrap gap-2 mb-1 items-center">
        {getUniversityTypeBadge(university)}
        <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">{department.scoreType}</span>
        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 inline-block" /> {university.city}
        </span>
        {getScholarshipBadge(department)}
      </div>
      {/* Son yıl özet bilgi */}
      <div className="flex flex-row justify-between items-center bg-gray-50 rounded-lg px-3 py-2 mt-1 mb-2">
        <div className="flex flex-col items-start">
          <span className="text-[11px] text-gray-500 font-semibold">Sıralama</span>
          <span className="text-sm font-bold text-blue-700">{department.lastYearRank || '-'}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[11px] text-gray-500 font-semibold">Puan</span>
          <span className="text-sm font-bold text-green-700">{department.lastYearScore || '-'}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[11px] text-gray-500 font-semibold">Kontenjan</span>
          <span className="text-sm font-bold text-orange-700">{department.quota || '-'}</span>
        </div>
      </div>
    </div>
  )
} 