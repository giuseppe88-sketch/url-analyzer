import axios from "axios";

// The backend is running on port 8080, and we've configured CORS
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends a URL to the backend for analysis.
 * @param url The URL to be analyzed.
 * @returns The analysis result from the backend.
 */
export const analyzeUrl = async (url: string) => {
  try {
    const response = await apiClient.post("/analyze", { url });
    return response.data;
  } catch (error) {
    console.error("Error analyzing URL:", error);
    throw error;
  }
};
