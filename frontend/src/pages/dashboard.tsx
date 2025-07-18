import React from "react";
import { Container, Typography, Box } from "@mui/material";
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
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Analyzer
      </Typography>
      <AnalysisForm
        url={url}
        loading={loading}
        setUrl={setUrl}
        onSubmit={handleAnalyze}
        onCancel={handleCancel}
      />

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
