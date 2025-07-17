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
  loading: boolean;
  error: string | null;
  url: string;
  addResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUrl: (url: string) => void;
  deleteResult: (id: number) => void;
}

export const useUrlStore = create<UrlStoreState>()(
  persist(
    (set) => ({
      results: [],
      loading: false,
      error: null,
      url: "",
      addResult: (result) =>
        set((state) => ({ results: [result, ...state.results] })),
      setLoading: (loading) => set({ loading }),
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
