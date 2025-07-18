import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUrlStore } from "../store/urlStore";
import { useUrlActions } from "../hooks/useUrlActions";
import { getColumns } from "../components/dashboard/columns";

const Dashboard: React.FC = () => {
  const { results, loading, reanalyzing, error, url, setUrl } = useUrlStore();

  const { handleAnalyze, handleReanalyze, handleDelete, handleCancel } =
    useUrlActions();

  const columns = getColumns({ reanalyzing, handleReanalyze, handleDelete });

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
