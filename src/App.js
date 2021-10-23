import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { AuthLayout } from "./layout/AuthLayout/AuthLayout";
import { MainLayout } from "./layout/MainLayout/MainLayout";
import "./App.css";
import { ThemeProviders } from "./themes/ThemeProviders";
import { AppContextProvider } from "context/AppContext";

function App() {
  return (
    <ThemeProviders>
      <HashRouter>
        <Switch>
          <AppContextProvider>
            <Route path={`/Auth`} component={AuthLayout} />
            <Route path={`/Pharma`} component={MainLayout} />
            <Redirect from={`/`} to={"/Pharma/Items"} />
          </AppContextProvider>
        </Switch>
      </HashRouter>
    </ThemeProviders>
  );
}

export default App;
