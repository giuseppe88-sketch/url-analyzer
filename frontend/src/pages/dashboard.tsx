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
    addResult,
    setLoading,
    setError,
    setUrl,
    deleteResult,
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

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "URL", headerName: "URL", flex: 1, minWidth: 200 },
    { field: "Title", headerName: "Title", flex: 1, minWidth: 200 },
    { field: "HTMLVersion", headerName: "HTML Version", width: 120 },
    {
      field: "ExternalLinks",
      headerName: "External Links",
      type: "number",
      width: 130,
    },
    {
      field: "InternalLinks",
      headerName: "Internal Links",
      type: "number",
      width: 130,
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
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={RouterLink}
            to={`/details/${params.id}`}
            variant="contained"
            size="small"
          >
            View
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => deleteResult(params.id as number)}
          >
            Delete
          </Button>
        </Box>
      ),
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
