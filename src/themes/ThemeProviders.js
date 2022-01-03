import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";

export const ThemeProviders = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#728FCE",
        dark: "#D6EAF8",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#D6EAF8",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
};
