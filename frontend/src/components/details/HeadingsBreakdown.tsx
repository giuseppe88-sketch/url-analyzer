import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";

interface HeadingsBreakdownProps {
  headingsCount: string; // JSON string
}

export const HeadingsBreakdown: React.FC<HeadingsBreakdownProps> = ({
  headingsCount,
}) => {
  let counts: { [key: string]: number } = {};
  try {
    // Safely parse the JSON string, providing an empty object as a fallback
    counts = JSON.parse(headingsCount || "{}");
  } catch (e) {
    console.error("Failed to parse headings count:", e);
    // Render an error state if JSON is malformed
    return (
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Headings Breakdown
          </Typography>
          <Typography color="error">
            Could not display heading counts.
          </Typography>
        </Paper>
      </Grid>
    );
  }

  const headingElements = Object.entries(counts).map(([heading, count]) => (
    <ListItem key={heading} dense>
      <ListItemText
        primary={`${heading.toUpperCase()}`}
        secondary={`${count} found`}
      />
    </ListItem>
  ));

  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Headings Breakdown
        </Typography>
        {Object.keys(counts).length > 0 ? (
          <List dense>{headingElements}</List>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            No heading tags were found on the page.
          </Typography>
        )}
      </Paper>
    </Grid>
  );
};
