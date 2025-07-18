import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useUrlStore } from "../store/urlStore";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const results = useUrlStore((state) => state.results);

  // The ID from the URL is a string, but our result IDs are numbers.
  const analysisResult = results.find((r) => r.ID === Number(id));

  if (!analysisResult) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Analysis Not Found
        </Typography>
        <Typography>
          No analysis result could be found for this ID. It might have been
          deleted or the link is incorrect.
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const {
    URL,
    Title,
    HTMLVersion,
    InternalLinks,
    ExternalLinks,
    HasLoginForm,
    InaccessibleLinks,
    HeadingsCount,
  } = analysisResult;

  const linkData = [
    { id: 0, value: InternalLinks, label: "Internal Links", color: "#0288d1" },
    { id: 1, value: ExternalLinks, label: "External Links", color: "#f57c00" },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button component={RouterLink} to="/" sx={{ mb: 2 }}>
        &larr; Back to Dashboard
      </Button>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analysis Details
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          sx={{ wordBreak: "break-all" }}
        >
          {URL}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">{Title}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>HTML Version:</strong> {HTMLVersion}
            </Typography>
            <Typography>
              <strong>Login Form Found:</strong> {HasLoginForm ? "Yes" : "No"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Link Analysis Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Internal vs. External Links
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <PieChart
                series={[
                  {
                    data: linkData,
                    innerRadius: 50, // This makes it a donut chart
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

        {/* Inaccessible Links List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Inaccessible Links ({InaccessibleLinks?.length || 0})
            </Typography>
            {InaccessibleLinks && InaccessibleLinks.length > 0 ? (
              <List dense>
                {InaccessibleLinks.map((link, index) => (
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <Chip
                        label={link.status || "Error"}
                        color={link.status >= 500 ? "error" : "warning"}
                        size="small"
                      />
                    }
                  >
                    <ListItemText
                      primary={link.url}
                      primaryTypographyProps={{
                        sx: { wordBreak: "break-all" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No inaccessible links were found.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Headings Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Headings Breakdown
            </Typography>
            <List dense>
              {Object.entries(JSON.parse(HeadingsCount)).map(([tag, count]) => (
                <ListItem key={tag}>
                  <ListItemText
                    primary={`${tag.toUpperCase()}: ${count as number}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailsPage;
