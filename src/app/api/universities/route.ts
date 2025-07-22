import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'
import { University, Department } from '@/types'

// CSV'den okunan raw veri tipi
interface CSVRow {
  YÖP_Kodu: string
  YÖP_Linki: string
  Üniversite: string
  Fakülte: string
  Bölüm: string
  Bölüm_Linki: string
  Şehir: string
  Üniversite_Türü: string
  Puan_Türü: string
  Öğrenim_Süresi: string
  Ücret: string
  Kontenjan_2024: string
  Kontenjan_2023: string
  Kontenjan_2022: string
  Yerleşen_2024: string
  Yerleşen_2023: string
  Yerleşen_2022: string
  Sıralama_2024: string
  Sıralama_2023: string
  Sıralama_2022: string
  Taban_Puan_2024: string
  Taban_Puan_2023: string
  Taban_Puan_2022: string
  YKS_Net_Linki: string
}

// Türkçe karakterleri normalleştir (arama için)
const normalizeText = (text: string): string => {
  if (!text) return ''
  
  return text
    .toString()
    // Önce büyük harfleri dönüştür (toLowerCase'den önce)
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    // Sonra küçük harfe çevir
    .toLowerCase()
    // Küçük Türkçe karakterleri dönüştür
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/i̇/g, 'i') // İ'nin küçük hali bazen böyle olabilir
    .trim()
}

// CSV verilerini okuma fonksiyonu
const readCSVData = async (): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = []
    const csvPath = path.join(process.cwd(), 'universite_verileri_tum_sayfalar.csv')
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data: CSVRow) => results.push(data))
      .on('end', () => {
        resolve(results)
      })
      .on('error', reject)
  })
}

// Puan türünü dönüştürme
const convertScoreType = (puanTuru: string | null): 'SAY' | 'SÖZ' | 'EA' | 'DİL' => {
  if (!puanTuru) return 'SAY'
  const normalized = puanTuru.toUpperCase()
  if (normalized.includes('SÖZ')) return 'SÖZ'
  if (normalized.includes('EA')) return 'EA'
  if (normalized.includes('DİL')) return 'DİL'
  return 'SAY'
}

// Parantez içindeki bilgileri çıkararak tag'lere dönüştür
const extractTagsFromDepartmentName = (departmentName: string) => {
  const tags: {
    languageOfInstruction: 'turkish' | 'english' | 'hybrid',
    scholarshipPercentage: number,
    cleanName: string
  } = {
    languageOfInstruction: 'turkish',
    scholarshipPercentage: 0,
    cleanName: departmentName
  }
  
  // Türkçe karakter problemini çözmek için normalizeText kullan
  const normalizedDeptName = normalizeText(departmentName)
  
  // 1. ÖNCE BÖLÜM ADININ BAŞINDA DİL KONTROLÜ
  if (normalizedDeptName.startsWith('ingilizce ') || normalizedDeptName.startsWith('english ') ||
      normalizedDeptName.includes('ingiliz dili') || normalizedDeptName.includes('english language')) {
    tags.languageOfInstruction = 'english'
  } else if (normalizedDeptName.startsWith('almanca ') || normalizedDeptName.startsWith('german ') ||
             normalizedDeptName.includes('alman dili') || normalizedDeptName.includes('german language')) {
    tags.languageOfInstruction = 'hybrid'
  } else if (normalizedDeptName.startsWith('fransizca ') || normalizedDeptName.startsWith('french ') ||
             normalizedDeptName.includes('fransiz dili') || normalizedDeptName.includes('french language')) {
    tags.languageOfInstruction = 'hybrid'
  }
  
  // 2. PARANTEZ İÇİNDEKİ BİLGİLERİ BUL
  const parenthesesMatches = departmentName.match(/\(([^)]+)\)/g)
  
  if (parenthesesMatches) {
    parenthesesMatches.forEach(match => {
      const content = normalizeText(match.replace(/[()]/g, '').trim())
      
      // Eğitim dili kontrolü - parantez içindeki bilgiler başındaki dil ayarını ezebilir
      if (content.includes('ingilizce') || content.includes('english')) {
        tags.languageOfInstruction = 'english'
      } else if (content.includes('almanca') || content.includes('german')) {
        tags.languageOfInstruction = 'hybrid'
      } else if (content.includes('fransizca') || content.includes('french')) {
        tags.languageOfInstruction = 'hybrid'
      }
      
      // Burs durumu kontrolü
      if (content.includes('tam burslu') || (content.includes('tam') && content.includes('burslu'))) {
        tags.scholarshipPercentage = 100
      } else if (content.includes('burslu')) {
        tags.scholarshipPercentage = 50
      } else if (content.includes('ücretli')) {
        tags.scholarshipPercentage = 0
      } else if (content.includes('%50 indirimli') || content.includes('%50 i̇ndirimli')) {
        tags.scholarshipPercentage = 25 // Yarı indirimli
      }
    })
    
    // Parantez içindeki bilgileri temizle (sadece dil ve burs bilgilerini)
    let cleanName = departmentName
    parenthesesMatches.forEach(match => {
      const content = normalizeText(match.replace(/[()]/g, '').trim())
      if (content.includes('ingilizce') || content.includes('english') ||
          content.includes('almanca') || content.includes('german') ||
          content.includes('fransizca') || content.includes('french') ||
          content.includes('burslu') || content.includes('ucretli') ||
          content.includes('indirimli')) {
        cleanName = cleanName.replace(match, '')
      }
    })
    tags.cleanName = cleanName
  }
  
  // 3. BAŞINDA DİL BİLGİSİ OLAN BÖLÜMLERDEN DİL ADINI KALDIRMA
  if (tags.languageOfInstruction === 'english') {
    // "İngilizce " ile başlıyorsa kaldır
    if (normalizeText(tags.cleanName).startsWith('ingilizce ')) {
      tags.cleanName = tags.cleanName.substring(10).trim()
    } else if (normalizeText(tags.cleanName).startsWith('english ')) {
      tags.cleanName = tags.cleanName.substring(8).trim()
    }
    // "İngiliz Dili ve Edebiyatı" -> "Dili ve Edebiyatı" 
    tags.cleanName = tags.cleanName.replace(/^İngiliz\s+/i, '').replace(/^Ingiliz\s+/i, '').trim()
  } else if (tags.languageOfInstruction === 'hybrid') {
    if (normalizeText(tags.cleanName).startsWith('almanca ')) {
      tags.cleanName = tags.cleanName.substring(8).trim()
    } else if (normalizeText(tags.cleanName).startsWith('fransizca ')) {
      tags.cleanName = tags.cleanName.substring(10).trim()
    }
    tags.cleanName = tags.cleanName.replace(/^(Alman|Fransız|Fransiz)\s+/i, '').trim()
  }
  
  // 4. KPSS kelimesini kaldır
  tags.cleanName = tags.cleanName.replace(/\s*KPSS\s*/g, '').trim()
  
  // 5. Fazla boşlukları temizle
  tags.cleanName = tags.cleanName.replace(/\s+/g, ' ').trim()
  
  return tags
}

// CSV verisini University formatına çevir
const transformCSVToUniversity = (csvRows: CSVRow[]): University[] => {
  const universitiesMap = new Map<string, University>()
  
  csvRows.forEach(row => {
    const universityName = row.Üniversite?.trim()
    if (!universityName) return
    
    // Üniversite yoksa oluştur
    if (!universitiesMap.has(universityName)) {
      const university: University = {
        id: universitiesMap.size.toString(),
        name: universityName,
        city: row.Şehir?.trim() || 'Bilinmiyor',
        cityId: 0,
        type: row.Üniversite_Türü === 'VAKIF' ? 'foundation' : 'state',
        foundingYear: 2000,
        website: '',
        description: `${universityName} hakkında detaylı bilgi.`,
        contactInfo: {
          phone: '+90 XXX XXX XX XX',
          email: 'info@university.edu.tr',
          address: row.Şehir?.trim() + ', Türkiye'
        },
        socialMedia: {},
        facilities: {
          dormitory: true,
          sports: true,
          library: true,
          labs: true,
          cafeteria: true
        },
        studentCount: 15000,
        academicStaffCount: 1200,
        departments: [],
        photos: [],
        videos: [],
        rating: 4.5
      }
      universitiesMap.set(universityName, university)
    }
    
    const university = universitiesMap.get(universityName)!
    
    // Parantez içindeki bilgileri çıkar
    const rawDepartmentName = row.Bölüm?.trim() || 'Bilinmiyor'
    const departmentTags = extractTagsFromDepartmentName(rawDepartmentName)

    // Öğrenim süresine göre eğitim türü belirle
    let educationLevel: 'lisans' | 'onlisans' = 'lisans'
    const sure = parseInt(row.Öğrenim_Süresi)
    if (!isNaN(sure) && (sure === 1 || sure === 2)) {
      educationLevel = 'onlisans'
    } else if (!isNaN(sure) && sure > 2) {
      educationLevel = 'lisans'
    }

    // Bölüm oluştur ve ekle
    const department: Department = {
      id: `${university.id}-${university.departments.length}`,
      universityId: parseInt(university.id),
      name: rawDepartmentName.replace(/\s*KPSS\s*/gi, '').trim(), // Parantezleri silme, sadece KPSS'yi kaldır
      facultyName: row.Fakülte?.trim() || 'Genel Fakülte',
      scoreType: convertScoreType(row.Puan_Türü),
      lastYearScore: parseFloat(row.Taban_Puan_2024) || 0,
      lastYearRank: parseInt(row.Sıralama_2024) || 0,
      quota: parseInt(row.Kontenjan_2024) || 0,
      scholarshipPercentage: departmentTags.scholarshipPercentage > 0 ? departmentTags.scholarshipPercentage : (row.Üniversite_Türü === 'VAKIF' ? 50 : 0),
      languageOfInstruction: departmentTags.languageOfInstruction,
      description: `${departmentTags.cleanName} bölümü hakkında detaylı bilgi.`,
      careerOpportunities: ['Mezuniyet sonrası kariyer fırsatları'],
      internshipOpportunities: ['Staj imkanları'],
      departmentWebsite: row.Bölüm_Linki?.trim() || undefined,
      yksAtlasLink: row.YKS_Net_Linki?.trim() || undefined,
      yopCode: row.YÖP_Kodu?.trim() || '', // YÖP kodunu ekle
      // 3 yıllık geçmiş veriler
      historicalData: {
        2024: {
          rank: row.Sıralama_2024 && parseInt(row.Sıralama_2024) ? parseInt(row.Sıralama_2024) : undefined,
          score: row.Taban_Puan_2024 && parseFloat(row.Taban_Puan_2024) ? parseFloat(row.Taban_Puan_2024) : undefined,
          quota: row.Kontenjan_2024 && parseInt(row.Kontenjan_2024) ? parseInt(row.Kontenjan_2024) : undefined
        },
        2023: {
          rank: row.Sıralama_2023 && parseInt(row.Sıralama_2023) ? parseInt(row.Sıralama_2023) : undefined,
          score: row.Taban_Puan_2023 && parseFloat(row.Taban_Puan_2023) ? parseFloat(row.Taban_Puan_2023) : undefined,
          quota: row.Kontenjan_2023 && parseInt(row.Kontenjan_2023) ? parseInt(row.Kontenjan_2023) : undefined
        },
        2022: {
          rank: row.Sıralama_2022 && parseInt(row.Sıralama_2022) ? parseInt(row.Sıralama_2022) : undefined,
          score: row.Taban_Puan_2022 && parseFloat(row.Taban_Puan_2022) ? parseFloat(row.Taban_Puan_2022) : undefined,
          quota: row.Kontenjan_2022 && parseInt(row.Kontenjan_2022) ? parseInt(row.Kontenjan_2022) : undefined
        }
      },
      latestScores: [],
      academics: [],
      educationLevel // yeni alan
    }
    
    university.departments.push(department)
  })
  
  return Array.from(universitiesMap.values())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '0')
    const limit = parseInt(searchParams.get('limit') || '50') // Default limit'i artırdık
    const sortBy = searchParams.get('sortBy') || 'score'
    
    // Filtre parametrelerini al
    const query = searchParams.get('query') || ''
    const city = searchParams.get('city') || ''
    const scoreType = searchParams.get('scoreType') || ''
    let universityTypes: string[] = []
    if (searchParams.has('universityTypes')) {
      universityTypes = searchParams.getAll('universityTypes')
      if (universityTypes.length === 1 && universityTypes[0].includes(',')) {
        universityTypes = universityTypes[0].split(',')
      }
    }
    const universityType = searchParams.get('universityType') || ''
    let scholarshipLevels: string[] = []
    if (searchParams.has('scholarshipLevels')) {
      scholarshipLevels = searchParams.getAll('scholarshipLevels')
      if (scholarshipLevels.length === 1 && scholarshipLevels[0].includes(',')) {
        scholarshipLevels = scholarshipLevels[0].split(',')
      }
    }
    const scholarshipLevel = searchParams.get('scholarshipLevel') || ''
    let languageOfInstructions: string[] = [];
    if (searchParams.has('languageOfInstruction')) {
      languageOfInstructions = searchParams.getAll('languageOfInstruction');
      if (languageOfInstructions.length === 1 && languageOfInstructions[0].includes(',')) {
        languageOfInstructions = languageOfInstructions[0].split(',');
      }
    }
    const minScore = parseInt(searchParams.get('minScore') || '0')
    const maxScore = parseInt(searchParams.get('maxScore') || '600')
    const minRank = parseInt(searchParams.get('minRank') || '0')
    const maxRank = parseInt(searchParams.get('maxRank') || '999999')
    const hasDormitory = searchParams.get('hasDormitory') === 'true'
    const hasSports = searchParams.get('hasSports') === 'true'
    // Çoklu seçimli filtreler
    let educationLevels: string[] = []
    if (searchParams.has('educationLevels')) {
      educationLevels = searchParams.getAll('educationLevels')
      if (educationLevels.length === 1 && educationLevels[0].includes(',')) {
        educationLevels = educationLevels[0].split(',')
      }
    }
    let cities: string[] = []
    if (searchParams.has('cities')) {
      cities = searchParams.getAll('cities')
      if (cities.length === 1 && cities[0].includes(',')) {
        cities = cities[0].split(',')
      }
    }
    let universityNames: string[] = []
    if (searchParams.has('universityNames')) {
      universityNames = searchParams.getAll('universityNames')
      if (universityNames.length === 1 && universityNames[0].includes(',')) {
        universityNames = universityNames[0].split(',')
      }
    }
    let departmentNames: string[] = []
    if (searchParams.has('departmentNames')) {
      departmentNames = searchParams.getAll('departmentNames')
      if (departmentNames.length === 1 && departmentNames[0].includes(',')) {
        departmentNames = departmentNames[0].split(',')
      }
    }

    const csvData = await readCSVData()
    
    const universities = transformCSVToUniversity(csvData)
    
    // Tüm bölümleri tek bir liste haline getir
    const allDepartments: Array<{university: University, department: Department}> = []
    universities.forEach(university => {
      university.departments.forEach(department => {
        allDepartments.push({ university, department })
      })
    })
    
    // Arama varsa test edelim
    if (query && query.trim() !== '') {
      const normalizedQuery = normalizeText(query)
      const testResults = allDepartments.filter(item => 
        normalizeText(item.university.name).includes(normalizedQuery) ||
        normalizeText(item.department.name).includes(normalizedQuery)
      )
    }
    
    // Kapsamlı filtreleme - bölüm bazında
    const filteredDepartments = allDepartments.filter(item => {
      const { university, department } = item
      let matches = true
      
      // Arama sorgusu (üniversite, şehir, bölüm) - Türkçe karakter uyumlu
      if (query && query.trim() !== '') {
        const normalizedQuery = normalizeText(query)
        matches = matches && (
          normalizeText(university.name).includes(normalizedQuery) ||
          normalizeText(university.city).includes(normalizedQuery) ||
          normalizeText(department.name).includes(normalizedQuery) ||
          normalizeText(department.facultyName).includes(normalizedQuery)
        )
      }
      
      // Şehir filtresi
      if (city) {
        matches = matches && university.city === city
      }
      
      // Üniversite türü filtresi (çoklu seçim desteği, KKTC için esnek eşleşme)
      if ((universityTypes && universityTypes.length > 0) || universityType) {
        const types = universityTypes && universityTypes.length > 0 ? universityTypes : (universityType ? [universityType] : [])
        // KKTC seçiliyse şehir veya bölüm adı içinde 'KKTC' geçenler de dahil olsun (büyük/küçük harf ve Türkçe karakter duyarsız)
        if (types.includes('trnc')) {
          const cityNorm = university.city.toLocaleUpperCase('tr-TR').replace(/İ/g, 'I')
          const deptNorm = department.name.toLocaleUpperCase('tr-TR').replace(/İ/g, 'I')
          matches = matches && (
            types.includes(university.type) ||
            cityNorm.includes('KKTC') ||
            deptNorm.includes('KKTC')
          )
        } else {
          matches = matches && types.includes(university.type)
        }
      }
      
      // Yurt imkanı filtresi
      if (hasDormitory) {
        matches = matches && university.facilities.dormitory
      }
      
      // Spor olanakları filtresi
      if (hasSports) {
        matches = matches && university.facilities.sports
      }
      
      // Puan türü filtresi
      if (scoreType) {
        matches = matches && department.scoreType === scoreType
      }
      
      // Eğitim dili filtresi (çoklu seçim desteği)
      if (languageOfInstructions.length > 0) {
        matches = matches && languageOfInstructions.includes(department.languageOfInstruction)
      }
      
      // Burs durumu filtresi (ücretli için tüm varyasyonları ve agresif normalize arama)
      const bursStrings: Record<string, string[]> = {
        'full': ['100'],
        'half': ['50'],
        'paid': ['ucretli', 'ucret', 'cretli', 'cret', 'ücretli', 'ücret'],
        '25': ['25'],
        '50': ['50'],
        '100': ['100']
      }
      // Agresif normalize: tüm Türkçe karakterleri, boşlukları, özel karakterleri kaldır, küçük harfe çevir
      const normalizeBurs = (str: string) =>
        str
          .replace(/%/g, '')
          .replace(/％/g, '')
          .replace(/[Üü]/g, 'u')
          .replace(/[Çç]/g, 'c')
          .replace(/[Şş]/g, 's')
          .replace(/[Ğğ]/g, 'g')
          .replace(/[Öö]/g, 'o')
          .replace(/[İIı]/g, 'i')
          .replace(/[^a-zA-Z0-9]/g, '')
          .toLowerCase();
      const nameNorm = normalizeBurs(department.name);
      const bursActive = (scholarshipLevels && scholarshipLevels.length > 0) || scholarshipLevel
      if (bursActive) {
        const levels = scholarshipLevels && scholarshipLevels.length > 0 ? scholarshipLevels : (scholarshipLevel ? [scholarshipLevel] : [])
        const bursMatch = levels.some(level =>
          (bursStrings[level] || []).some(str => {
            const normStr = normalizeBurs(str);
            return nameNorm.includes(normStr);
          })
        )
        matches = matches && bursMatch;
      }
      // Eğitim türü filtresi
      if (educationLevels && educationLevels.length > 0) {
        matches = matches && educationLevels.includes(department.educationLevel)
      }
      // Şehir çoklu seçim filtresi (normalizeText ile)
      if (cities && cities.length > 0) {
        matches = matches && cities.some(city => normalizeText(city) === normalizeText(university.city))
      }
      // Üniversite adı çoklu seçim filtresi
      if (universityNames && universityNames.length > 0) {
        matches = matches && universityNames.includes(university.name)
      }
      // Bölüm adı çoklu seçim filtresi
      if (departmentNames && departmentNames.length > 0) {
        // Parantez ve eklerden arındırılmış cleanName ile normalizeText karşılaştırması yap
        const cleanName = extractTagsFromDepartmentName(department.name).cleanName
        const normalizedCleanName = normalizeText(cleanName)
        const match = departmentNames.some(name => normalizedCleanName === normalizeText(name))
        matches = matches && match
      }
      
      // Puan aralığı filtresi
      if (department.lastYearScore > 0) {
        matches = matches && 
          department.lastYearScore >= minScore && 
          department.lastYearScore <= maxScore
      }
      
      // Sıralama aralığı filtresi
      if (department.lastYearRank > 0) {
        matches = matches && 
          department.lastYearRank >= minRank && 
          department.lastYearRank <= maxRank
      }
      
      return matches
    })
    
    // 2024 sıralamalarına göre sırala
    if (sortBy === 'score') {
      filteredDepartments.sort((a, b) => {
        const aRank = a.department.lastYearRank || Infinity
        const bRank = b.department.lastYearRank || Infinity
        
        if (aRank === Infinity && bRank === Infinity) {
          return a.university.name.localeCompare(b.university.name, 'tr')
        }
        if (aRank === Infinity) return 1
        if (bRank === Infinity) return -1
        
        return aRank - bRank
      })
    } else {
      filteredDepartments.sort((a, b) => a.university.name.localeCompare(b.university.name, 'tr'))
    }
    
    const total = filteredDepartments.length
    const startIndex = page * limit
    const endIndex = startIndex + limit
    const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex)
    const hasMore = endIndex < total
    
    // Frontend'in beklediği formata dönüştür
    const result = paginatedDepartments.map(item => ({
      ...item.university,
      departments: [item.department] // Her üniversite için tek bölüm
    }))
    
    return NextResponse.json({
      universities: result,
      hasMore,
      total
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Üniversiteler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
} 