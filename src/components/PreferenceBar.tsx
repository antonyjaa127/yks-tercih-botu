'use client'

import { useStore } from '@/store/useStore'
import { X, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function PreferenceBar() {
  const { preferenceList, removeFromPreferenceList, clearPreferenceList } = useStore()

  if (preferenceList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="py-2">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-700">
                Tercih Listem ({preferenceList.length})
              </span>
              <button
                onClick={clearPreferenceList}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Tümünü Temizle
              </button>
            </div>
            <Link
              href="/tercihlerim"
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-lg font-medium transition-colors flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700 text-xs"
              )}
            >
              <span>Tercih Listemi Gör</span>
              <BookOpen className="w-4 h-4" />
            </Link>
          </div>
          {/* Universities Row */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {preferenceList.map((item) => (
              <div
                key={`${item.universityId}-${item.departmentId}`}
                className="flex-shrink-0 bg-gray-50 rounded-lg p-1 flex items-center space-x-1 min-w-[120px] max-w-[150px]"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-medium text-gray-900 truncate">
                    {item.university.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 truncate">
                    {item.department.name}
                  </p>
                </div>
                <button
                  onClick={() => removeFromPreferenceList(item.universityId, item.departmentId)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 