import axios, { AxiosError } from "axios";

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
 * @param signal The AbortSignal to cancel the API request.
 * @returns The analysis result from the backend.
 */
export const analyzeUrl = async (
  url: string,
  signal: AbortSignal
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/analyze",
      { url },
      {
        signal, // Pass the signal to axios for cancellation
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    // Don't throw an error if the request was cancelled by the user
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      // Return a promise that never resolves to stop the calling function
      return new Promise(() => {});
    }
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
