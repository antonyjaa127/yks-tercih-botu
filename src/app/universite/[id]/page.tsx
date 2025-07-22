'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchUniversityById } from '@/lib/api'
import { testSupabaseConnection } from '@/lib/supabase'
import { University } from '@/types'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  GraduationCap, 
  Star,
  Building,
  Award,
  Calendar,
  BookOpen,
  Target,
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  Plus,
  Check
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

export default function UniversityDetailPage() {
  const { id } = useParams()
  const [university, setUniversity] = useState<University | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('genel')
  const { comparisonItems, addToComparison, removeFromComparison } = useStore()

  useEffect(() => {
    const loadUniversity = async () => {
      if (!id || Array.isArray(id)) return
      
      setIsLoading(true)
      
      try {
        // Önce Supabase bağlantısını test et
        const connectionSuccess = await testSupabaseConnection()
        
        if (!connectionSuccess) {
          console.error('❌ Detay sayfası - Supabase bağlantısı başarısız')
          setIsLoading(false)
          return
        }
        
        const universityData = await fetchUniversityById(id)
        
        if (universityData) {
        } else {
          console.warn(`⚠️ ID ${id} için üniversite bulunamadı`)
        }
        
        setUniversity(universityData)
      } catch (error) {
        console.error('💥 Detay sayfası veri yükleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUniversity()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Yükleniyor...</h2>
          <p className="text-gray-600">Üniversite bilgileri getiriliyor.</p>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Üniversite bulunamadı</h2>
          <p className="text-gray-600">Aradığınız üniversite mevcut değil.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'genel', label: 'Genel Bilgi', icon: Building },
    { id: 'akademik', label: 'Akademik', icon: GraduationCap },
    { id: 'sosyal', label: 'Sosyal Yaşam', icon: Users },
    { id: 'ulasim', label: 'Ulaşım & Konaklama', icon: MapPin },
    { id: 'mezuniyet', label: 'Mezuniyet & Kariyer', icon: Briefcase },
    { id: 'burs', label: 'Burs & Finans', icon: Award },
    { id: 'sss', label: 'SSS', icon: BookOpen }
  ]

  const handleDepartmentComparison = (department: University['departments'][0]) => {
    const comparisonItem = {
      universityId: university.id,
      departmentId: department.id,
      university,
      department
    }

    const isInComparison = comparisonItems.some(
      item => item.universityId === university.id && item.departmentId === department.id
    )

    if (isInComparison) {
      removeFromComparison(university.id, department.id)
    } else {
      addToComparison(comparisonItem)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
            {/* Logo */}
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {university.logo ? (
                <img 
                  src={university.logo} 
                  alt={university.name} 
                  className="w-16 h-16 rounded-xl"
                />
              ) : (
                <Building className="w-10 h-10 text-gray-400" />
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium text-gray-700">{university.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{university.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Kuruluş: {university.foundingYear}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{university.studentCount.toLocaleString()} öğrenci</span>
                </div>
              </div>
              
              <p className="text-gray-600 max-w-3xl">{university.description}</p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col space-y-2 lg:items-end">
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Favorilere Ekle</span>
              </button>
              <a 
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Web Sitesi</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'genel' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ana Bilgiler */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Bilgiler</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{university.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{university.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{university.contactInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {university.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                <div className="flex space-x-4">
                  {university.socialMedia.facebook && (
                    <a 
                      href={university.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {university.socialMedia.twitter && (
                    <a 
                      href={university.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {university.socialMedia.instagram && (
                    <a 
                      href={university.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {university.socialMedia.youtube && (
                    <a 
                      href={university.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Yan Panel */}
            <div className="space-y-6">
              {/* İstatistikler */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Öğrenci Sayısı</span>
                    <span className="font-medium text-gray-900">
                      {university.studentCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Akademik Personel</span>
                    <span className="font-medium text-gray-900">
                      {university.academicStaffCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bölüm Sayısı</span>
                    <span className="font-medium text-gray-900">
                      {university.departments.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Kuruluş Yılı</span>
                    <span className="font-medium text-gray-900">
                      {university.foundingYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Olanaklar */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Olanaklar</h3>
                <div className="space-y-3">
                  {[
                    { key: 'dormitory', label: 'Yurt', available: university.facilities.dormitory },
                    { key: 'sports', label: 'Spor Tesisleri', available: university.facilities.sports },
                    { key: 'library', label: 'Kütüphane', available: university.facilities.library },
                    { key: 'labs', label: 'Laboratuvarlar', available: university.facilities.labs },
                    { key: 'cafeteria', label: 'Kafeterya', available: university.facilities.cafeteria }
                  ].map((facility) => (
                    <div key={facility.key} className="flex items-center justify-between">
                      <span className="text-gray-600">{facility.label}</span>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        facility.available ? "bg-green-500" : "bg-gray-300"
                      )} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'akademik' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Bölümler</h3>
            <div className="grid gap-4">
              {university.departments.map((department) => {
                const isInComparison = comparisonItems.some(
                  item => item.universityId === university.id && item.departmentId === department.id
                )
                
                return (
                  <div key={department.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{department.name}</h4>
                        <p className="text-sm text-gray-600">{department.facultyName}</p>
                      </div>
                      <button
                        onClick={() => handleDepartmentComparison(department)}
                        className={cn(
                          "flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                          isInComparison 
                            ? "bg-green-100 text-green-700" 
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        )}
                      >
                        {isInComparison ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Eklendi</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Karşılaştır</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {department.scoreType} - {department.lastYearScore}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {department.lastYearRank}. sıra
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {department.quota} kontenjan
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {department.languageOfInstruction === 'turkish' ? 'Türkçe' : 
                           department.languageOfInstruction === 'english' ? 'İngilizce' : 'Karma'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{department.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {department.scholarshipPercentage > 0 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          %{department.scholarshipPercentage} Burslu
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {department.scoreType}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Diğer sekmeler için placeholder içerik */}
        {activeTab !== 'genel' && activeTab !== 'akademik' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              Bu bölüm yakında eklenecek. Detaylı bilgi için üniversitenin resmi web sitesini ziyaret edebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 