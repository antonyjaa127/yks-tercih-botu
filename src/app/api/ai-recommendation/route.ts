import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAuE-Z-Bma7LF6g7RKYQxEZmuX_dh_LUZQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY;

type FilterDesc = Record<string, { value: unknown, label: string }>
function filterDescriptions(filters: Record<string, unknown>): FilterDesc {
  const desc: Record<string, string> = {
    scoreType: 'Puan Türü',
    minRank: 'Minimum Sıralama',
    maxRank: 'Maksimum Sıralama',
    scholarshipLevels: 'Bursluluk',
    universityTypes: 'Üniversite Türü',
    languageOfInstruction: 'Eğitim Dili',
    departmentNames: 'Bölüm Adı',
    educationLevels: 'Öğrenim Türü',
    feeTypes: 'Ücret Türü',
    minScore: 'Minimum Puan',
    maxScore: 'Maksimum Puan',
  };
  const result: FilterDesc = {};
  for (const key in filters) {
    if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null && !(Array.isArray(filters[key]) && (filters[key] as unknown[]).length === 0)) {
      result[key] = {
        value: filters[key],
        label: desc[key] || key
      };
    }
  }
  return result;
}

// CSV'den şehir, üniversite ve bölüm isimlerini dinamik olarak oku
async function getDynamicFilterOptions() {
  const csvPath = path.join(process.cwd(), 'universite_verileri_tum_sayfalar.csv')
  const citiesSet = new Set<string>()
  const universitySet = new Set<string>()
  const departmentSet = new Set<string>()
  return new Promise<{ cities: string[]; universityNames: string[]; departmentNames: string[] }>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        if (row['Bölüm']) departmentSet.add(row['Bölüm'].trim())
      })
      .on('end', () => {
        resolve({
          cities: Array.from(citiesSet).sort((a, b) => a.localeCompare(b, 'tr')),
          universityNames: Array.from(universitySet).sort((a, b) => a.localeCompare(b, 'tr')),
          departmentNames: Array.from(departmentSet).sort((a, b) => a.localeCompare(b, 'tr')),
        })
      })
      .on('error', reject)
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filters, ranking, goals } = body;
    const filtersWithDesc = filterDescriptions(filters);
    // Dinamik filtre seçeneklerini al
    const dynamicOptions = await getDynamicFilterOptions();

    // FILTER_OPTIONS: FilterPanel ve mockData ile birebir uyumlu, dinamik alanlar dahil
    const FILTER_OPTIONS = {
      scoreType: {
        label: 'Puan Türü',
        options: [
          { value: 'SAY', label: 'Sayısal' },
          { value: 'EA', label: 'Eşit Ağırlık' },
          { value: 'SÖZ', label: 'Sözel' },
          { value: 'DİL', label: 'Dil' }
        ]
      },
      universityTypes: {
        label: 'Üniversite Türü',
        options: [
          { value: 'state', label: 'Devlet' },
          { value: 'foundation', label: 'Vakıf' },
          { value: 'trnc', label: 'KKTC' }
        ]
      },
      scholarshipLevels: {
        label: 'Bursluluk',
        options: [
          { value: 'full', label: 'Tam Burslu' },
          { value: 'half', label: '%50 Burslu' },
          { value: 'paid', label: 'Ücretli' }
        ]
      },
      languageOfInstruction: {
        label: 'Eğitim Dili',
        options: [
          { value: 'turkish', label: 'Türkçe' },
          { value: 'english', label: 'İngilizce' },
          { value: 'hybrid', label: 'Karma' }
        ]
      },
      educationLevels: {
        label: 'Öğrenim Türü',
        options: [
          { value: 'lisans', label: 'Lisans' },
          { value: 'onlisans', label: 'Ön Lisans' }
        ]
      },
      minScore: {
        label: 'Minimum Puan',
        options: []
      },
      maxScore: {
        label: 'Maksimum Puan',
        options: []
      },
      minRank: {
        label: 'Minimum Sıralama',
        options: []
      },
      maxRank: {
        label: 'Maksimum Sıralama',
        options: []
      },
      departmentNames: {
        label: 'Bölüm Adı',
        options: dynamicOptions.departmentNames
      }
    };

    // Gelişmiş prompt
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Aşağıdaki kullanıcı bilgilerine göre, üniversite tercih önerisi oluştur.\n\nKullanıcı Sıralaması: ${ranking}\nKullanıcı Hedefleri/Kriterleri: ${goals}\nFiltreler (anahtar ve açıklama): ${JSON.stringify(filtersWithDesc, null, 2)}\n\nAşağıda sistemde kullanılabilen tüm filtreler ve seçenekleri verilmiştir. Sadece bu seçenekler içinden seçim yapabilirsin, yeni değer üretme.\n\nFiltre seçenekleri:\n${JSON.stringify(FILTER_OPTIONS, null, 2)}\n\nÖzellikle departmentNames (bölüm adları) filtresini kullanarak öneri ve filtre_uygula kısmında sadece bu bölüm adları arasından seçim yap.\n\nStructured bir JSON output üret.\n\nOutput örneği:\n{\n  "oneriler": ["...", "..."],\n  "aciklama": "...",\n  "neden_boyle": "...",\n  "filtre_uygula": {\n    "scoreType": "...",\n    "minRank": ...,\n    "maxRank": ...,\n    "cities": [...],\n    "departmentNames": [...],\n    ...\n  }\n}\n\nSıralama filtresini belirlerken, kullanıcının sıralamasına göre mantıklı bir aralık seç (ör. 25000 için 10000-35000 gibi, çok dar veya çok geniş olmasın).\n\n***minRank ve maxRank alanlarını DOLDURMAK ZORUNDASIN. minRank mutlaka kullanıcının sıralamasından küçük, maxRank ise büyük olmalı.*** Sadece öneri metni değil, filtre_uygula alanında arama için kullanılacak filtreleri de döndür.\n\nAçıklama (aciklama) ve neden_boyle alanlarında, önerdiğin bölümlerin gelecekteki iş olanakları, Türkiye'deki sektörel durum, mesleğin geleceği ve kişisel/futuristik yorumlara da yer ver. İş imkanları, sektörün büyüme potansiyeli, yurtdışı olanakları gibi konularda da değerlendirme yap.\n\nYanıtı sadece geçerli bir JSON olarak döndür, başında/sonunda açıklama veya kod bloğu olmasın.`
            }
          ]
        }
      ]
    };

    console.log('AI PROMPT:', JSON.stringify(prompt, null, 2));

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'AI servisinden yanıt alınamadı.' }, { status: 500 });
    }

    const data = await response.json();
    // Gemini structured output'u "text" alanında döner, JSON parse etmeye çalış
    let aiResult = null;
    try {
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Kod bloğu varsa temizle
      text = text.replace(/^```json|```$/g, '').trim();
      aiResult = JSON.parse(text);
    } catch (e) {
      aiResult = { raw: data };
    }
    return NextResponse.json({ result: aiResult });
  } catch (error) {
    return NextResponse.json({ error: 'Beklenmeyen bir hata oluştu.' }, { status: 500 });
  }
} 