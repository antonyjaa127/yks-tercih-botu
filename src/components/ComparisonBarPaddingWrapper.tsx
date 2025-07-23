"use client"
import React from 'react';
import { useStore } from '@/store/useStore';

export default function ComparisonBarPaddingWrapper({ children }: { children: React.ReactNode }) {
  const comparisonItems = useStore((state) => state.comparisonItems);
  const preferenceList = useStore((state) => state.preferenceList);
  // Her bar 96px, ikisi aktifse 192px padding
  let padding = 0;
  if (comparisonItems.length > 0 && preferenceList.length > 0) {
    padding = 192;
  } else if (comparisonItems.length > 0 || preferenceList.length > 0) {
    padding = 96;
  }
  return (
    <main className="min-h-screen" style={{ paddingBottom: padding }}>
      {children}
    </main>
  );
} 