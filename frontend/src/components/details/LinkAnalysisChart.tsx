import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import {type LinkAnalysisChartProps } from "../../types";

export const LinkAnalysisChart: React.FC<LinkAnalysisChartProps> = ({
  internalLinks,
  externalLinks,
}) => {
  const linkData = [
    { id: 0, value: internalLinks, label: "Internal" },
    { id: 1, value: externalLinks, label: "External" },
  ];

  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2, height: "100%" }}>
        <Typography variant="h6" gutterBottom align="center">
          Internal vs. External Links
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <PieChart
            series={[
              {
                data: linkData,
                innerRadius: 50,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 5,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            height={300}
          />
        </Box>
      </Paper>
    </Grid>
  );
};
