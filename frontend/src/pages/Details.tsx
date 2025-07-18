import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useUrlStore } from "../store/urlStore";
import {
  Container,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { HeadingsBreakdown } from "../components/details/HeadingsBreakdown";
import { LinkAnalysisChart } from "../components/details/LinkAnalysisChart";
import { AnalysisNotFound } from "../components/details/AnalysisNotFound";

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const results = useUrlStore((state) => state.results);

  // The ID from the URL is a string, but our result IDs are numbers.
  const analysisResult = results.find((r) => r.ID === Number(id));

  if (!analysisResult) {
    return <AnalysisNotFound />;
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
        <LinkAnalysisChart
          internalLinks={InternalLinks}
          externalLinks={ExternalLinks}
        />

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
        <HeadingsBreakdown headingsCount={HeadingsCount} />
      </Grid>
    </Container>
  );
};

export default DetailsPage;
