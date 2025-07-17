import { create } from "zustand";

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
  addResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUrlStore = create<UrlStoreState>((set) => ({
  results: [],
  loading: false,
  error: null,
  addResult: (result) =>
    set((state) => ({ results: [result, ...state.results] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
