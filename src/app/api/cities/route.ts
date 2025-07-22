import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import csv from 'csv-parser'

// CSV'den okunan raw veri tipi
interface CSVRow {
  Şehir: string
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

export async function GET() {
  try {
    const csvData = await readCSVData()
    const citySet = new Set<string>()
    
    csvData.forEach(row => {
      if (row.Şehir?.trim()) {
        citySet.add(row.Şehir.trim())
      }
    })
    
    const cities = Array.from(citySet).sort((a, b) => a.localeCompare(b, 'tr'))
    
    return NextResponse.json({
      cities
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Şehirler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
} 