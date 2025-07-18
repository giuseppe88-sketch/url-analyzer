import { useRef } from "react";
import { analyzeUrl } from "../api";
import { useUrlStore } from "../store/urlStore";
import { type AnalysisResult } from "../types";

export const useUrlActions = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    url,
    setLoading,
    setReanalyzing,
    setError,
    setUrl,
    addResult,
    updateResult,
    deleteResult,
  } = useUrlStore();

  const handleAnalyze = async () => {
    if (!url) {
      setError("URL cannot be empty.");
      return;
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const analysisResult: AnalysisResult = await analyzeUrl(
        url,
        abortControllerRef.current.signal
      );
      addResult(analysisResult);
      setUrl(""); // Clear input on success
    } catch (err) {
      if (err instanceof Error && err.name !== "CanceledError") {
        setError(`Analysis failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleReanalyze = async (id: number, urlToReanalyze: string) => {
    setReanalyzing(id, true);
    try {
      const newResult: AnalysisResult = await analyzeUrl(urlToReanalyze);
      updateResult(id, newResult);
    } catch (err) {
      // Handle error appropriately, maybe set a specific error message
      console.error("Reanalysis failed:", err);
    } finally {
      setReanalyzing(id, false);
    }
  };

  const handleDelete = (id: number) => {
    deleteResult(id);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  return {
    handleAnalyze,
    handleReanalyze,
    handleDelete,
    handleCancel,
  };
};
