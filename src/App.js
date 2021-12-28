import { Router, Route, Switch, Redirect } from "react-router-dom";
import { AuthLayout } from "./layout/AuthLayout/AuthLayout";
import { MainLayout } from "./layout/MainLayout/MainLayout";
import "./App.css";
import { ThemeProviders } from "./themes/ThemeProviders";
import { AppContextProvider } from "context/AppContext";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

function App() {
  return (
    <ThemeProviders>
      <Router history={history}>
        <Switch>
          <AppContextProvider>
            <Route path={`/Auth`} component={AuthLayout} />
            <Route path={`/Pharma`} component={MainLayout} />
            <Redirect from={`/`} to={"/Pharma/Reports"} />
          </AppContextProvider>
        </Switch>
      </Router>
    </ThemeProviders>
  );
}

export default App;
