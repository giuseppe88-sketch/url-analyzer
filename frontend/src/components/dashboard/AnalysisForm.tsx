import React from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { type AnalysisFormProps } from "../../types";

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  url,
  loading,
  setUrl,
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" component="h2" gutterBottom>
        Analyze a New URL
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <TextField
          label="Enter a valid URL (e.g., https://example.com)"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              height: "56px",
            }}
          >
            <Button variant="contained" color="error" onClick={onCancel}>
              Stop
            </Button>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Button
            type="submit"
            variant="contained"
            disabled={!url.trim()}
            sx={{ height: "56px", px: 4 }}
          >
            Analyze
          </Button>
        )}
      </Box>
    </Box>
  );
};
