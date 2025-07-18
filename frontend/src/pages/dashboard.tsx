import React, { useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { analyzeUrl } from "../api";
import { useUrlStore, type AnalysisResult } from "../store/urlStore";

// This interface should be moved to a shared types file in a larger app

const Dashboard: React.FC = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get state and actions from the Zustand store
  const {
    results,
    loading,
    error,
    url,
    reanalyzing,
    addResult,
    setLoading,
    setError,
    setUrl,
    deleteResult,
    updateResult,
    setReanalyzing,
  } = useUrlStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url) {
      setError("Please enter a URL.");
      return;
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeUrl(
        url,
        abortControllerRef.current.signal
      );
      // If the request was cancelled, analyzeUrl returns a non-resolving promise
      // and this part of the code won't be reached.
      addResult(analysisResult);
      setUrl(""); // Clear input on success
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Failed to analyze the URL. Please check the console for details."
      );
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  const handleReanalyze = async (id: number, urlToReanalyze: string) => {
    setReanalyzing(id, true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const newResult = await analyzeUrl(
        urlToReanalyze,
        abortControllerRef.current.signal
      );
      // The backend assigns a new ID, so we update the result but keep the original ID for consistency in the grid
      updateResult(id, { ...newResult, ID: id });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(`Failed to re-analyze ${urlToReanalyze}.`);
    } finally {
      setReanalyzing(id, false);
      abortControllerRef.current = null;
    }
  };

  // Define the columns for the DataGrid
  const columns: GridColDef<AnalysisResult>[] = [
    { field: "URL", headerName: "URL", flex: 1, minWidth: 150 },
    { field: "Title", headerName: "Title", width: 150 },
    {
      field: "HeadingsCount",
      headerName: "Headings",
      width: 80,
      renderCell: (params) => {
        try {
          const counts = JSON.parse(params.value as string);
          return Object.values(counts).reduce(
            (sum: number, count: any) => sum + count,
            0
          );
        } catch (e) {
          return 0;
        }
      },
    },
    { field: "HTMLVersion", headerName: "HTML Version", width: 70 },
    {
      field: "ExternalLinks",
      headerName: "External Links",
      type: "number",
      width: 70,
    },
    {
      field: "InternalLinks",
      headerName: "Internal Links",
      type: "number",
      width: 70,
    },
    {
      field: "InaccessibleLinks",
      headerName: "Inaccessible Links",
      width: 70,
      renderCell: (params) => params.value.length,
    },
    {
      field: "HasLoginForm",
      headerName: "Login Form",
      width: 70,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 300,
      renderCell: (params) => {
        const isReanalyzing = reanalyzing.includes(params.id as number);
        return (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              component={RouterLink}
              to={`/details/${params.id}`}
              variant="contained"
              size="small"
              disabled={isReanalyzing}
            >
              View
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() =>
                handleReanalyze(params.id as number, params.row.URL)
              }
              disabled={isReanalyzing}
              sx={{ minWidth: 110 }}
            >
              {isReanalyzing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Rerun"
              )}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => deleteResult(params.id as number)}
              disabled={isReanalyzing}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Analyzer
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mb: 4 }}
      >
        <TextField
          label="Enter URL to analyze"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleStop}
              sx={{ minWidth: 120 }}
            >
              Stop
            </Button>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            Analyze
          </Button>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {results.length > 0 && (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={results}
            columns={columns}
            getRowId={(row) => row.ID}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
