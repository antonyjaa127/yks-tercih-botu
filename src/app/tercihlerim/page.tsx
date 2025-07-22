'use client'

import { useStore } from '@/store/useStore'
import { X, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function PreferenceListPage() {
  const { preferenceList, removeFromPreferenceList, clearPreferenceList } = useStore()

  if (preferenceList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <BookOpen className="w-16 h-16 text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tercih Listen Boş</h2>
        <p className="text-gray-600 mb-6">Tercih listene üniversite ve bölüm eklemek için arama sayfasından ekleme yapabilirsin.</p>
        <Link
          href="/arama"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Üniversite Ara
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tercih Listem</h1>
          <button
            onClick={clearPreferenceList}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Tümünü Temizle
          </button>
        </div>
        <div className="grid gap-4">
          {preferenceList.map((item, idx) => (
            <div key={`${item.universityId}-${item.departmentId}`} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{item.university.name}</h2>
                <p className="text-sm text-blue-600">{item.department.name}</p>
              </div>
              <button
                onClick={() => removeFromPreferenceList(item.universityId, item.departmentId)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Listeden çıkar"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-600">
          Toplam Tercih: <span className="font-bold text-blue-700">{preferenceList.length}</span>
        </div>
      </div>
    </div>
  )
} 