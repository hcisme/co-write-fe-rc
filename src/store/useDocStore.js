import { create } from 'zustand';
import { getDocs } from '@/service/docService';

export const useDocStore = create((set) => ({
  docsData: [],
  loading: false,
  fetchDocsData: async () => {
    set({ loading: true });
    try {
      const { data = [] } = (await getDocs()) || {};
      set({ docsData: data || [] });
    } finally {
      set({ loading: false });
    }
  }
}));
