import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

export const AnalysisNotFound: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <Box sx={{ p: 4, border: "1px dashed grey", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Analysis Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No analysis result could be found for this ID. It might have been
          deleted or the link is incorrect.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};
