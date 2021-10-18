import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeProviders = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#1FA084",
        dark: "#D1E8E4",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#D1E8E4",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
