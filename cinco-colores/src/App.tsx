import Router from "./components/Router";
import { GlobalStyle } from "./styles";

function App() {
  return (
    <div style={{ margin: "0 auto", maxWidth: "1200px" }}>
      <GlobalStyle />
      <Router />
    </div>
  );
}

export default App;
