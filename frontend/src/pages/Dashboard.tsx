import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUrlStore } from "../store/urlStore";
import { useUrlActions } from "../hooks/useUrlActions";
import { getColumns } from "../components/dashboard/columns";
import { AnalysisForm } from "../components/dashboard/AnalysisForm";

const Dashboard: React.FC = () => {
  const { results, loading, reanalyzing, error, url, setUrl } = useUrlStore();

  const { handleAnalyze, handleReanalyze, handleDelete, handleCancel } =
    useUrlActions();

  const columns = getColumns({ reanalyzing, handleReanalyze, handleDelete });

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          URL Analysis Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Enter a URL to analyze its structure and SEO metrics.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <AnalysisForm
          url={url}
          loading={loading}
          setUrl={setUrl}
          onSubmit={handleAnalyze}
          onCancel={handleCancel}
        />
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={results}
          columns={columns}
          getRowId={(row) => row.ID}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Container>
  );
};

export default Dashboard;
