import React from "react";
import { TextField, Button, Box, CircularProgress } from "@mui/material";

interface AnalysisFormProps {
  url: string;
  loading: boolean;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

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
          <Button variant="contained" color="error" onClick={onCancel}>
            Stop
          </Button>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Button type="submit" variant="contained" disabled={loading}>
          Analyze
        </Button>
      )}
    </Box>
  );
};
