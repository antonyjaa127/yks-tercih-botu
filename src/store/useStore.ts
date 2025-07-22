import { create } from 'zustand'
import { SearchFilters, ComparisonItem, University, Department } from '@/types'

export interface ComparisonItem {
  universityId: string
  departmentId: string
  university: University
  department: Department
}

interface Store {
  // Search and filters
  searchFilters: SearchFilters
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  
  // Comparison
  comparisonItems: ComparisonItem[]
  addToComparison: (item: ComparisonItem) => void
  removeFromComparison: (universityId: string, departmentId: string) => void
  clearComparison: () => void
  
  // Universities data
  universities: University[]
  setUniversities: (universities: University[]) => void
  addUniversities: (universities: University[]) => void
  
  // Pagination
  currentPage: number
  setCurrentPage: (page: number) => void
  hasMore: boolean
  setHasMore: (hasMore: boolean) => void
  totalUniversities: number
  setTotalUniversities: (total: number) => void
  
  // UI state
  isFilterPanelOpen: boolean
  setFilterPanelOpen: (open: boolean) => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
  isLoadingMore: boolean
  setLoadingMore: (loading: boolean) => void
}

const initialFilters: SearchFilters = {
  query: '',
  cities: [],
  scoreType: '',
  universityTypes: [],
  scholarshipLevels: [],
  languageOfInstruction: '',
  minScore: 0,
  maxScore: 600,
  minRank: 0,
  maxRank: 500000,
  hasDormitory: false,
  hasSports: false,
  departmentNames: [],
  universityNames: [],
  educationLevels: [],
  feeTypes: [],
  sortType: 'puan',
}

export const useStore = create<Store>((set, get) => ({
  searchFilters: initialFilters,
  setSearchFilters: (filters) =>
    set((state) => {
      const nextFilters = { ...filters };
      if (nextFilters.educationLevels && !Array.isArray(nextFilters.educationLevels)) {
        nextFilters.educationLevels = [nextFilters.educationLevels];
      }
      // Diğer array alanlar için de aynı işlemi uygula
      if (nextFilters.departmentNames && !Array.isArray(nextFilters.departmentNames)) {
        nextFilters.departmentNames = [nextFilters.departmentNames];
      }
      if (nextFilters.universityNames && !Array.isArray(nextFilters.universityNames)) {
        nextFilters.universityNames = [nextFilters.universityNames];
      }
      if (nextFilters.cities && !Array.isArray(nextFilters.cities)) {
        nextFilters.cities = [nextFilters.cities];
      }
      if (nextFilters.universityTypes && !Array.isArray(nextFilters.universityTypes)) {
        nextFilters.universityTypes = [nextFilters.universityTypes];
      }
      if (nextFilters.scholarshipLevels && !Array.isArray(nextFilters.scholarshipLevels)) {
        nextFilters.scholarshipLevels = [nextFilters.scholarshipLevels];
      }
      // Tüm zorunlu alanlara default değer ata
      return {
        searchFilters: {
          query: nextFilters.query ?? '',
          cities: nextFilters.cities ?? [],
          scoreType: nextFilters.scoreType ?? '',
          universityTypes: nextFilters.universityTypes ?? [],
          scholarshipLevels: nextFilters.scholarshipLevels ?? [],
          languageOfInstruction: nextFilters.languageOfInstruction ?? '',
          minScore: nextFilters.minScore ?? 0,
          maxScore: nextFilters.maxScore ?? 600,
          minRank: nextFilters.minRank ?? 0,
          maxRank: nextFilters.maxRank ?? 500000,
          hasDormitory: nextFilters.hasDormitory ?? false,
          hasSports: nextFilters.hasSports ?? false,
          departmentNames: nextFilters.departmentNames ?? [],
          universityNames: nextFilters.universityNames ?? [],
          educationLevels: nextFilters.educationLevels ?? [],
          feeTypes: nextFilters.feeTypes ?? [],
          sortType: nextFilters.sortType ?? 'puan',
        }
      }
    }),
  resetFilters: () => set({ 
    searchFilters: initialFilters,
    currentPage: 0,
    universities: [],
    hasMore: false,
    totalUniversities: 0
  }),
  
  comparisonItems: [],
  addToComparison: (item) =>
    set((state) => {
      const exists = state.comparisonItems.some(
        (comp) => comp.universityId === item.universityId && comp.departmentId === item.departmentId
      )
      if (!exists && state.comparisonItems.length < 5) {
        return { comparisonItems: [...state.comparisonItems, item] }
      }
      return state
    }),
  removeFromComparison: (universityId, departmentId) =>
    set((state) => ({
      comparisonItems: state.comparisonItems.filter(
        (item) => !(item.universityId === universityId && item.departmentId === departmentId)
      )
    })),
  clearComparison: () => set({ comparisonItems: [] }),
  
  universities: [],
  setUniversities: (universities) => set({ 
    universities,
    currentPage: 0
  }),
  addUniversities: (universities) => 
    set((state) => ({
      universities: [...state.universities, ...universities]
    })),
  
  // Pagination
  currentPage: 0,
  setCurrentPage: (page) => set({ currentPage: page }),
  hasMore: false,
  setHasMore: (hasMore) => set({ hasMore }),
  totalUniversities: 0,
  setTotalUniversities: (total) => set({ totalUniversities: total }),
  
  isFilterPanelOpen: false,
  setFilterPanelOpen: (open) => set({ isFilterPanelOpen: open }),
  
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  isLoadingMore: false,
  setLoadingMore: (loading) => set({ isLoadingMore: loading })
})) 