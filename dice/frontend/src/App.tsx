import { BrowserRouter } from "react-router";
import Router from "./components/Router";

import Navigation from "./components/Navigation";
import AppThemeProvider from "./styles/Theme";

const App = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Navigation />
        <Router />
      </BrowserRouter>
    </AppThemeProvider>
  );
};

export default App;
