import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import { type AnalysisResult, type GetColumnsParams } from "../../types";

export const getColumns = ({
  reanalyzing,
  handleReanalyze,
  handleDelete,
}: GetColumnsParams): GridColDef<AnalysisResult>[] => [
  { field: "URL", headerName: "URL", flex: 1, minWidth: 150 },
  { field: "Title", headerName: "Title", width: 150 },
  {
    field: "HeadingsCount",
    headerName: "Headings",
    width: 80,
    renderCell: (params: GridRenderCellParams<AnalysisResult, string>) => {
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
    renderCell: (params) => params.value?.length,
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
    renderCell: (params: GridRenderCellParams<AnalysisResult>) => {
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
          >
            View
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.id as number)}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleReanalyze(params.id as number, params.row.URL)}
            disabled={isReanalyzing}
            startIcon={isReanalyzing ? <CircularProgress size={20} /> : null}
          >
            {isReanalyzing ? "Analyzing..." : "Re-analyze"}
          </Button>
        </Box>
      );
    },
  },
];
