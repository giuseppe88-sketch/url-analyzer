import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type UrlState, type AnalysisResult } from "../types";

export const useUrlStore = create<UrlState>()(
  persist(
    (set) => ({
      results: [],
      loading: false,
      reanalyzing: [],
      error: null,
      url: "",
      addResult: (result: AnalysisResult) =>
        set((state) => ({ results: [result, ...state.results] })),
      updateResult: (id: number, newResult: AnalysisResult) =>
        set((state) => ({
          results: state.results.map((r) => (r.ID === id ? newResult : r)),
        })),
      setLoading: (loading: boolean) => set({ loading }),
      setReanalyzing: (id: number, status: boolean) =>
        set((state) => ({
          reanalyzing: status
            ? [...state.reanalyzing, id]
            : state.reanalyzing.filter((i) => i !== id),
        })),
      setError: (error: string | null) => set({ error }),
      setUrl: (url: string) => set({ url }),
      deleteResult: (id: number) =>
        set((state) => ({
          results: state.results.filter((result) => result.ID !== id),
        })),
    }),
    {
      name: "url-analysis-storage", // unique name for the localStorage key
      partialize: (state) => ({ results: state.results }), // only persist the 'results' part of the state
    }
  )
);
