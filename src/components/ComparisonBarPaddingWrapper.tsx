"use client"
import React from 'react';
import { useStore } from '@/store/useStore';

export default function ComparisonBarPaddingWrapper({ children }: { children: React.ReactNode }) {
  const comparisonItems = useStore((state) => state.comparisonItems);
  // Bar yüksekliği + gap: 96px
  return (
    <main className="min-h-screen" style={{ paddingBottom: comparisonItems.length > 0 ? 96 : 0 }}>
      {children}
    </main>
  );
} 