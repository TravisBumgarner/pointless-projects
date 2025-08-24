import { BrowserRouter } from "react-router";
import Router from "./components/Router";

import Navigation from "./components/Navigation";

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Router />
    </BrowserRouter>
  );
};

export default App;
