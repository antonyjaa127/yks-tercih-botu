import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import ComparisonBar from '@/components/ComparisonBar'
import ComparisonBarPaddingWrapper from '@/components/ComparisonBarPaddingWrapper'
import PreferenceBar from '@/components/PreferenceBar'

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
        <meta property="og:image" content="/favicon.ico" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="KesinGelir - YKS Üniversite Tercih Rehberi" />
        <meta name="twitter:description" content="YKS tercih döneminde size en uygun üniversite ve bölümleri bulun, karşılaştırın ve geleceğinize adım atın." />
        <meta name="twitter:image" content="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="canonical" href="https://kesingelir.com/" />
      </head>
      <body className={inter.className}>
        <Header />
        <ComparisonBarPaddingWrapper>
          {children}
        </ComparisonBarPaddingWrapper>
        <ComparisonBar />
        <PreferenceBar />
      </body>
    </html>
  )
}
