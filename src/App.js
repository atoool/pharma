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
            <Route path={`/auth`} component={AuthLayout} />
            <Route path={`/pharma`} component={MainLayout} />
            <Redirect from={`/`} to={"/pharma/Store/Products"} />
          </AppContextProvider>
        </Switch>
      </HashRouter>
    </ThemeProviders>
  );
}

export default App;
