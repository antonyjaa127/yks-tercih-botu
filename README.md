# KesınGelir - YKS Üniversite Tercih Rehberi

Modern ve kullanıcı dostu bir YKS üniversite tercih rehberi uygulaması. YKS öğrencilerinin doğru üniversite ve bölüm seçimlerini yapmalarına yardımcı olan kapsamlı bir platform.

## 🌟 Özellikler

### Ana Özellikler
- **Kapsamlı Üniversite Veritabanı**: 200+ üniversite ve 1000+ bölüm bilgisi
- **Akıllı Arama**: Üniversite, bölüm ve şehir bazında gelişmiş arama
- **Detaylı Filtreler**: Puan türü, burs durumu, eğitim dili, olanaklar
- **Karşılaştırma Sistemi**: Üniversiteleri yan yana karşılaştırma
- **Mobil Uyumlu**: Responsive tasarım ile tüm cihazlarda kullanım

### Sayfa Yapısı
- **Ana Sayfa**: Hero section, arama ve öne çıkan üniversiteler
- **Arama Sayfası**: Filtreli arama ve sonuçlar
- **Üniversite Detay**: Sekmeli yapı ile kapsamlı bilgiler
- **Karşılaştırma**: Yan yana detaylı karşılaştırma tablosu

## 🚀 Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **UI Components**: Headless UI

## 📱 Tasarım Prensipleri

- **Minimalist**: Temiz ve modern tasarım
- **Erişilebilir**: WCAG standartlarına uygun
- **Mobil Öncelikli**: Responsive design
- **Performans**: Optimized loading ve SSR
- **Kullanıcı Deneyimi**: Sezgisel navigasyon

## 🎨 Renk Paleti

- **Birincil**: Mavi tonları (güven ve bilgi)
- **Vurgu**: Yeşil tonları (başarı ve canlılık)
- **Destekleyici**: Turuncu/Sarı (eylem butonları)
- **Nötr**: Gri tonları (metin ve arka plan)

## 🛠️ Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/your-username/kesingelir.com.git
cd kesingelir.com

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📂 Proje Yapısı

```
src/
├── app/                 # Next.js App Router sayfaları
│   ├── page.tsx        # Ana sayfa
│   ├── arama/          # Arama sayfası
│   ├── universite/     # Üniversite detay sayfaları
│   └── karsilastir/    # Karşılaştırma sayfası
├── components/          # React bileşenleri
│   ├── Header.tsx      # Ana navbar
│   ├── SearchBar.tsx   # Arama bileşeni
│   ├── FilterPanel.tsx # Filtre paneli
│   ├── UniversityCard.tsx # Üniversite kartı
│   └── ComparisonBar.tsx  # Karşılaştırma barı
├── data/               # Mock data ve sabitler
├── lib/                # Utility fonksiyonları
├── store/              # Zustand store
└── types/              # TypeScript tip tanımları
```

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint
```

## 📋 Özellik Listesi

### ✅ Tamamlanan
- [x] Ana sayfa tasarımı
- [x] Arama ve filtreleme sistemi
- [x] Üniversite detay sayfası
- [x] Karşılaştırma sistemi
- [x] Responsive tasarım
- [x] State management
- [x] TypeScript entegrasyonu

### 🔄 Gelecek Özellikler
- [ ] Kullanıcı kimlik doğrulaması
- [ ] Favoriler sistemi
- [ ] Yorumlar ve puanlama
- [ ] İlerleme takibi
- [ ] Bildirim sistemi
- [ ] Veri analizi
- [ ] SEO optimizasyonu

## 🎯 Hedef Kitle

- **Birincil**: YKS öğrencileri (17-19 yaş)
- **İkincil**: Veliler ve rehber öğretmenleri
- **Üçüncül**: Eğitim danışmanları

## 📊 Performans Hedefleri

- **Lighthouse Score**: 90+
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <3s
- **Cumulative Layout Shift**: <0.1

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- Website: [kesingelir.com](https://kesingelir.com)
- Email: info@kesingelir.com
- Twitter: [@kesingelir](https://twitter.com/kesingelir)

---

**KesınGelir** - Geleceğine adım at! 🎓
