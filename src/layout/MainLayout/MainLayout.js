import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { Sidebar } from "./Sidebar";
import routes from "routes.js";

export const MainLayout = () => {
  const getRoute = () => {
    return window.location.pathname !== "/Pharma/full-screen-maps";
  };
  const getRoutes = (route) => {
    return route.map((prop, key) => {
      if (prop.state) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/Pharma") {
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
    <Sidebar routes={routes}>
      {getRoute() ? (
        <Switch>
          {getRoutes(routes)}
          <Redirect from="/Pharma" to="/Pharma/Items" />
        </Switch>
      ) : null}
    </Sidebar>
  );
};
