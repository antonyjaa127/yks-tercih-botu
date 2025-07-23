'use client'

import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { GraduationCap, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const comparisonItems = useStore((state) => state.comparisonItems)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Marka Adı */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Kesin Gelir</span>
              <span className="text-xs text-gray-500 -mt-1">Akıllı Tercih Asistanı</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/arama"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Üniversite Ara
            </Link>
            <Link
              href="/karsilastir"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative"
            >
                Karşılaştır
                {comparisonItems.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow">
                    {comparisonItems.length}
                  </span>
                )}
            </Link>
            <Link
              href="/tercihlerim"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Tercih Listesi
            </Link>
            <Link
              href="/rehber"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Rehber
            </Link>
            <Link
              href="/feedback"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Geri Bildirim
            </Link>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span>Giriş</span>
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/arama"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Üniversite Ara
              </Link>
              <Link
                href="/karsilastir"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Karşılaştır</span>
                {comparisonItems.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {comparisonItems.length}
                  </span>
                )}
              </Link>
              <Link
                href="/tercihlerim"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tercih Listesi
              </Link>
              <Link
                href="/rehber"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Rehber
              </Link>
              <Link
                href="/feedback"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Geri Bildirim
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Giriş</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 