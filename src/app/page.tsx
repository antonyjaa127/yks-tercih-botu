'use client'

import { useEffect, useState } from 'react'
import MinimalUniversityCard from '@/components/MinimalUniversityCard'
import { useStore } from '@/store/useStore'
import { fetchUniversities } from '@/lib/api'
import { testSupabaseConnection } from '@/lib/supabase'
import { ChevronRight, Star, Users, Award, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { 
    universities, 
    setUniversities, 
    isLoading, 
    setLoading,
    setHasMore,
    setTotalUniversities
  } = useStore()
  
  // Form state'leri
  const [goalText, setGoalText] = useState('')
  const [scoreValue, setScoreValue] = useState('')
  const [scoreType, setScoreType] = useState('')
  const [helpMode, setHelpMode] = useState(false)
  const [formFilters, setFormFilters] = useState({ scoreType: '', /* diğer filtreler eklenebilir */ })
  const router = useRouter();
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true)
      
      try {
        // Önce Supabase bağlantısını test et
        const connectionSuccess = await testSupabaseConnection()
        
        if (!connectionSuccess) {
          setLoading(false)
          return
        }
        
        const result = await fetchUniversities(0, 3, 'score') // Ana sayfada sadece 3 üniversite (en yüksek puanlı)
        
        setUniversities(result.universities)
        setHasMore(result.hasMore)
        setTotalUniversities(result.total)
      } catch (error) {
        console.error('💥 Ana sayfa veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUniversities()
  }, [setUniversities, setLoading, setHasMore, setTotalUniversities])
  
  // Form validation
  const isFormValid = scoreValue.trim() !== '' && scoreType !== ''
  
  // scoreType değiştiğinde formFilters'ı güncelle
  useEffect(() => {
    setFormFilters((prev) => ({ ...prev, scoreType }))
  }, [scoreType])

  const handleAnalyze = async () => {
    if (!isFormValid) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: formFilters,
          ranking: scoreValue,
          goals: helpMode ? '' : goalText,
        })
      });
      const data = await res.json();
      setAiLoading(false);
      if (data.result) {
        // AI'dan dönen metin ve filtrelerle arama sayfasına yönlendir
        router.push(`/arama?aiMeta=${encodeURIComponent(JSON.stringify(data.result))}`);
      } else {
        alert('Yapay zeka önerisi alınamadı.');
      }
    } catch (e) {
      setAiLoading(false);
      alert('Yapay zeka servisiyle bağlantı kurulamadı.');
    }
  };

  // Öne çıkan üniversiteler (en yüksek puanlı)
  const featuredUniversities = universities
    .slice(0, 3)
    .map(uni => ({
      university: uni,
      department: uni.departments[0] // İlk bölümü göster
    }))
    .filter(item => item.department) // Bölümü olmayan üniversiteleri filtrele

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Akıllı</span> Tercih
            <span className="text-gray-900"> Asistanı</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI destekli sistemimiz sıralamanıza ve hedeflerinize göre size özel üniversite önerileri sunuyor. 
            Hayalinizdeki kariyere giden yolu birlikte keşfedelim.
          </p>
          
          {/* İstatistikler */}
          {/* Bu kısmı ve ilgili kutuları tamamen kaldırıyorum. Sadece başlık ve açıklama kalacak. */}
          {/* Bu kısmı ve ilgili kutuları tamamen kaldırıyorum. Sadece başlık ve açıklama kalacak. */}
          {/* Bu kısmı ve ilgili kutuları tamamen kaldırıyorum. Sadece başlık ve açıklama kalacak. */}
        </div>
      </section>

      {/* AI Preference Analyzer Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎯 Tercih Asistanınız Başlıyor
              </h2>
              <p className="text-gray-600">
                Hedeflerinizi ve sıralamanızı girin, size en uygun üniversiteleri önerelim
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Ana Hedef/Kriter Alanı */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Hedefleriniz veya Tercih Kriterleriniz
                  </label>
                  
                  {/* Modern Toggle Switch */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Ne olmak istediğimi bilmiyorum
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={helpMode}
                        onChange={(e) => {
                          setHelpMode(e.target.checked)
                          if (e.target.checked) {
                            setGoalText('')
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        helpMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out ${
                          helpMode ? 'translate-x-6' : 'translate-x-1'
                        } mt-1`}>
                        </div>
                      </div>
                    </label>
                    <HelpCircle className={`w-4 h-4 transition-colors duration-200 ${
                      helpMode ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  disabled={helpMode}
                  placeholder={helpMode ? "Yardım modunda sıralama bilginize göre size uygun bölümler önerilecek..." : "Örneğin: 'Doktor olmak istiyorum', 'Bilgisayar mühendisliği düşünüyorum', 'İzmir'de okumak istiyorum', 'Sosyal bilimler ilgimi çekiyor'..."}
                  rows={4}
                  className={`w-full px-4 py-3 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base ${
                    helpMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                {helpMode && (
                  <div className="mt-2 flex items-center text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                    <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Yardım modu aktif. Sıralama bilginize göre size en uygun bölümleri önereceğiz.</span>
                    <button
                      onClick={() => setHelpMode(false)}
                      className="ml-auto text-blue-600 hover:text-blue-700 underline"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
              
              {/* YKS Sıralama Alanı */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  YKS Sıralama Bilginiz <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sayısal Değer */}
                  <div className="md:col-span-1">
                    <input
                      type="number"
                      value={scoreValue}
                      onChange={(e) => setScoreValue(e.target.value)}
                      placeholder="25000"
                      className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                  </div>
                  
                  {/* Sıralama Türü Seçimi */}
                  <div className="md:col-span-1">
                    <select 
                      value={scoreType} 
                      onChange={(e) => setScoreType(e.target.value)}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                    >
                      <option value="">Sıralama Türü</option>
                      <option value="say">SAY Sıralama</option>
                      <option value="soz">SÖZ Sıralama</option>
                      <option value="ea">EA Sıralama</option>
                      <option value="dil">DİL Sıralama</option>
                    </select>
                  </div>
                  
                  {/* Analiz Butonu */}
                  <div className="md:col-span-1">
                    <button 
                      onClick={handleAnalyze}
                      disabled={!isFormValid || aiLoading}
                      className={`w-full py-3 px-6 rounded-xl transition-all duration-200 font-semibold text-base shadow-lg ${
                        isFormValid && !aiLoading
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {aiLoading ? (
                        <span>🤖 Yapay zekamız düşünüyor...</span>
                      ) : (
                        <>🎯 Analiz Et</>
                      )}
                    </button>
                  </div>
                </div>
                {!isFormValid && (
                  <p className="mt-2 text-sm text-gray-500">
                    * Analiz için sıralama bilginizi ve sıralama türünü girmeniz gerekiyor.
                  </p>
                )}
              </div>
              
              {/* Bilgi Notu */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>İpucu:</strong> Yerleştirme sıralamanızı (ham sıralama değil) girmeniz daha doğru öneriler almanıza yardımcı olacaktır. 
                  {!helpMode && <span> Eğer ne yapmak istediğinizi bilmiyorsanız, yukarıdaki yardım seçeneğini aktif edin!</span>}
                </p>
              </div>
            </div>
          </div>
          
          {/* Hızlı Erişim Butonları */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Veya hızlı aramaya geçin:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/arama" className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm">
                🔍 Gelişmiş Arama
              </Link>
              <Link href="/karsilastir" className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm">
                ⚖️ Üniversite Karşılaştır
              </Link>
              <Link href="/rehber" className="px-4 py-2 bg-white border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 rounded-lg transition-colors text-sm font-medium text-gray-700 shadow-sm">
                📚 Bölüm Rehberi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Üniversiteler */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Öne Çıkan Üniversiteler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En popüler ve başarılı üniversitelerden birkaçını keşfedin ve detaylarını inceleyin.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              ))
            ) : featuredUniversities.length > 0 ? (
              featuredUniversities.map(({ university, department }) => (
                <MinimalUniversityCard
                  key={`${university.id}-${department.id}`}
                  university={university}
                  department={department}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Henüz üniversite verisi yüklenmedi.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link
              href="/arama"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Tüm Üniversiteleri Görüntüle
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden Kesin Gelir?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Üniversite tercih sürecinde yalnız değilsiniz! Akıllı algoritmalarımız, güncel veriler ve kullanıcı dostu arayüzümüzle, hayalinizdeki bölüme ulaşmanız için yanınızdayız.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detaylı Bilgi & Akıllı Filtreleme
              </h3>
              <p className="text-gray-600">
                Tüm üniversite ve bölümler hakkında güncel, güvenilir ve kapsamlı bilgilere ulaşın. İlgi alanınıza, şehre, puan türüne ve daha fazlasına göre kolayca filtreleyin.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Akıllı Karşılaştırma & Kişiselleştirilmiş Öneriler
              </h3>
              <p className="text-gray-600">
                Sıralamanıza ve hedeflerinize göre en uygun üniversite ve bölümleri karşılaştırın. Yapay zeka destekli önerilerle, size en uygun tercih listesini oluşturun.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gerçek Zamanlı & Doğru Veriler
              </h3>
              <p className="text-gray-600">
                Taban puanlar, başarı sıraları, kontenjanlar ve özel koşullar dahil olmak üzere en güncel verilerle tercih yapın. Her zaman doğru ve güncel bilgiye ulaşın.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
