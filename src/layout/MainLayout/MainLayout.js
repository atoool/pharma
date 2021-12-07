import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { Sidebar } from "./Sidebar";
import routes from "routes.js";
import { AppContext } from "../../context/AppContext";

export const MainLayout = () => {
  const { userData } = React.useContext(AppContext);
  const role = userData?.user?.role ?? "";
  const token = userData?.token?.accessToken ?? null;
  const getRoute = () => {
    return window.location.pathname !== "/Pharma/full-screen-maps";
  };
  const getRoutes = (route, show = true) => {
    return route.map((prop, key) => {
      if (prop.state) {
        if (
          role === 3 &&
          (prop.name === "Warehouse" || prop.name === "Admin")
        ) {
          return getRoutes(prop.views, false);
        } else if (
          role === 2 &&
          (prop.name === "Outlet" || prop.name === "Admin")
        ) {
          return getRoutes(prop.views, false);
        } else {
          return getRoutes(prop.views, true);
        }
      }
      if (prop.layout === "/Pharma" && show) {
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
          <Redirect
            from="/Pharma"
            to={token ? (role === 3 ? "/Pharma/Stocks" : "/Pharma/Items") : "/"}
          />
        </Switch>
      ) : null}
    </Sidebar>
  );
};
