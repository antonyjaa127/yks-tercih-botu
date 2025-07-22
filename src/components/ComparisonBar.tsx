'use client'

import { useStore } from '@/store/useStore'
import { X, Building, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ComparisonBar() {
  const { comparisonItems, removeFromComparison, clearComparison } = useStore()

  if (comparisonItems.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Karşılaştırma ({comparisonItems.length}/5)
              </span>
              <button
                onClick={clearComparison}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                Tümünü Temizle
              </button>
            </div>
            
            <Link
              href="/karsilastir"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0",
                comparisonItems.length >= 2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              onClick={(e) => {
                if (comparisonItems.length < 2) {
                  e.preventDefault()
                }
              }}
            >
              <span className="text-sm">Karşılaştır</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Universities Row */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {comparisonItems.map((item) => (
              <div
                key={`${item.universityId}-${item.departmentId}`}
                className="flex-shrink-0 bg-gray-50 rounded-lg p-2 flex items-center space-x-2 min-w-[180px] max-w-[200px]"
              >
                <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  {item.university.logo ? (
                    <img 
                      src={item.university.logo} 
                      alt={item.university.name} 
                      className="w-4 h-4 rounded"
                    />
                  ) : (
                    <Building className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">
                    {item.university.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {item.department.name}
                  </p>
                </div>
                
                <button
                  onClick={() => removeFromComparison(item.universityId, item.departmentId)}
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