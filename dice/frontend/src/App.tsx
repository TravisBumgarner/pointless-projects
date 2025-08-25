import { BrowserRouter } from "react-router";
import Router from "./components/Router";

import AppThemeProvider from "./styles/Theme";
import { Box } from "@mui/material";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <Navigation />
          <Router />
        </Box>
      </BrowserRouter>
    </AppThemeProvider>
  );
};

export default App;
