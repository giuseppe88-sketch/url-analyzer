import { createTheme } from "@mui/material/styles";

// A custom theme for this app
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366F1", // Indigo 500 – modern, bold
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F43F5E", // Rose 500 – vibrant accent
    },
    background: {
      default: "#F3F4F6", // Soft light gray
      paper: "#ffffff", // Cards
    },
    text: {
      primary: "#111827", // Almost black, very readable
      secondary: "#6B7280", // Cool gray – clean and modern
    },
    divider: "#E5E7EB", // Light border lines
    error: {
      main: "#EF4444", // Red 500
    },
    warning: {
      main: "#F59E0B", // Amber 500
    },
    info: {
      main: "#3B82F6", // Blue 500
    },
    success: {
      main: "#10B981", // Emerald 500
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
});
