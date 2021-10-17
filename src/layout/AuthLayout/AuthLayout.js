import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import bgLogin from "../../assets/images/bgLogin.png";
import { Redirect, Route, Switch } from "react-router";
import routes from "routes.js";

export function AuthLayout() {
  const getRoute = () => {
    return window.location.pathname !== "/auth/full-screen-maps";
  };
  const getRoutes = (route) => {
    return route.map((prop, key) => {
      if (prop.state) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  return (
    // <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: `url(${bgLogin})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        {getRoute() ? (
          <Switch>
            {getRoutes(routes)}
            <Redirect from="/auth" to="/auth/signin" />
          </Switch>
        ) : null}
      </Grid>
    </Grid>
    // </ThemeProvider>
  );
}
