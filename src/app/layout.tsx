import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import ComparisonBar from '@/components/ComparisonBar'
import ComparisonBarPaddingWrapper from '@/components/ComparisonBarPaddingWrapper'
import PreferenceBar from '@/components/PreferenceBar'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KesinGelir - YKS Üniversite Tercih Rehberi',
  description: 'YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın.',
  keywords: 'YKS, üniversite, tercih, rehber, bölüm, karşılaştırma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <title>KesinGelir - YKS Üniversite Tercih Rehberi</title>
        <meta name="description" content="YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın." />
        <meta name="keywords" content="YKS, üniversite, tercih, rehber, bölüm, karşılaştırma" />
        <meta property="og:title" content="KesinGelir - YKS Üniversite Tercih Rehberi" />
        <meta property="og:description" content="YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icon-512.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="KesinGelir - YKS Üniversite Tercih Rehberi" />
        <meta name="twitter:description" content="YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın." />
        <meta name="twitter:image" content="/icon-512.svg" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="icon" sizes="16x16" href="/icon.svg" />
        <link rel="icon" sizes="32x32" href="/icon.svg" />
        <link rel="icon" sizes="192x192" href="/icon-192.svg" />
        <link rel="icon" sizes="512x512" href="/icon-512.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://kesingelir.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "KesinGelir - YKS Üniversite Tercih Rehberi",
              "description": "YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın.",
              "url": "https://kesingelir.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://kesingelir.com/icon-512.svg",
                "width": 512,
                "height": 512
              },
              "image": "https://kesingelir.com/icon-512.svg"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <ComparisonBarPaddingWrapper>
          {children}
        </ComparisonBarPaddingWrapper>
        <ComparisonBar />
        <PreferenceBar />
        <Analytics />
      </body>
    </html>
  )
}
