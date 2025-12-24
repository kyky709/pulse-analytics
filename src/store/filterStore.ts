'use client';

import { create } from 'zustand';

interface FilterState {
  dateRange: '7d' | '30d' | '90d' | '1y';
  setDateRange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  dateRange: '7d',
  setDateRange: (range) => set({ dateRange: range }),
}));
