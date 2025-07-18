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
import { useUrlStore, type AnalysisResult } from "../store/urlStore";
import { useUrlActions } from "../hooks/useUrlActions";

const Dashboard: React.FC = () => {
  const { results, loading, reanalyzing, error, url, setUrl } = useUrlStore();

  const { handleAnalyze, handleReanalyze, handleDelete, handleCancel } =
    useUrlActions();

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sum: number, count: any) => sum + count,
            0
          );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              variant="outlined"
              size="small"
              onClick={() =>
                handleReanalyze(params.id as number, params.row.URL)
              }
              disabled={isReanalyzing}
              startIcon={isReanalyzing ? <CircularProgress size={20} /> : null}
            >
              {isReanalyzing ? "Rerunning" : "Rerun"}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(params.id as number)}
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
        onSubmit={(e) => {
          e.preventDefault();
          handleAnalyze();
        }}
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
          <Button variant="contained" color="error" onClick={handleCancel}>
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={loading}
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
