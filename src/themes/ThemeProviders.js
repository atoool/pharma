import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export const ThemeProviders = ({ children }) => {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#1FA084",
        dark: "rgba(255,255,255,0.1)",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "rgba(31, 160, 132, 0.1)",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
