import React from "react";
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
import { useUrlStore } from "../store/urlStore";

// This interface should be moved to a shared types file in a larger app
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

const Dashboard: React.FC = () => {
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
    setLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeUrl(url);
      addResult(analysisResult);
      setUrl(""); // Clear input on success
    } catch (err) {
      setError(
        "Failed to analyze the URL. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async (id: number, urlToReanalyze: string) => {
    setReanalyzing(id, true);
    setError(null);
    try {
      const newResult = await analyzeUrl(urlToReanalyze);
      // The backend assigns a new ID, so we update the result but keep the original ID for consistency in the grid
      updateResult(id, { ...newResult, ID: id });
    } catch (err) {
      setError(`Failed to re-analyze ${urlToReanalyze}.`);
    } finally {
      setReanalyzing(id, false);
    }
  };

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "URL", headerName: "URL", flex: 1, minWidth: 150 },
    { field: "Title", headerName: "Title", flex: 1, minWidth: 150 },
    { field: "HTMLVersion", headerName: "HTML Version", width: 120 },
    {
      field: "ExternalLinks",
      headerName: "External Links",
      type: "number",
      width: 100,
    },
    {
      field: "InternalLinks",
      headerName: "Internal Links",
      type: "number",
      width: 100,
    },
    {
      field: "InaccessibleLinks",
      headerName: "Inaccessible Links",
      type: "number",
      width: 150,
    },
    {
      field: "HasLoginForm",
      headerName: "Login Form",
      width: 120,
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
                "Re-analyze"
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : "Analyze"}
        </Button>
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
                paginationModel: { page: 0, pageSize: 5 },
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
