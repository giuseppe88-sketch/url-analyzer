import { create } from "zustand";
import { persist } from "zustand/middleware";

// This interface is duplicated from the dashboard, but in a real app
// it would live in a shared types file.
interface AnalysisResult {
  ID: number;
  URL: string;
  Title: string;
  HTMLVersion: string;
  HeadingsCount: string;
  InternalLinks: number;
  ExternalLinks: number;
  InaccessibleLinks: number;
  HasLoginForm: boolean;
}

interface UrlStoreState {
  results: AnalysisResult[];
  loading: boolean; // For the main input form
  reanalyzing: number[]; // Array of IDs being re-analyzed
  error: string | null;
  url: string;
  addResult: (result: AnalysisResult) => void;
  updateResult: (id: number, newResult: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setReanalyzing: (id: number, status: boolean) => void;
  setError: (error: string | null) => void;
  setUrl: (url: string) => void;
  deleteResult: (id: number) => void;
}

export const useUrlStore = create<UrlStoreState>()(
  persist(
    (set) => ({
      results: [],
      loading: false,
      reanalyzing: [],
      error: null,
      url: "",
      addResult: (result) =>
        set((state) => ({ results: [result, ...state.results] })),
      updateResult: (id, newResult) =>
        set((state) => ({
          results: state.results.map((r) => (r.ID === id ? newResult : r)),
        })),
      setLoading: (loading) => set({ loading }),
      setReanalyzing: (id, status) =>
        set((state) => ({
          reanalyzing: status
            ? [...state.reanalyzing, id]
            : state.reanalyzing.filter((i) => i !== id),
        })),
      setError: (error) => set({ error }),
      setUrl: (url) => set({ url }),
      deleteResult: (id) =>
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
