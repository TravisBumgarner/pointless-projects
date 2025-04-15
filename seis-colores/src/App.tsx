import Router from "./components/Router";
import { GlobalStyle } from "./styles";

function App() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        height: "calc(100vh - var(--gutter-spacing) * 2)",
        margin: "var(--gutter-spacing)",
        overflow: "hidden",
      }}
    >
      <GlobalStyle />
      <Router />
    </div>
  );
}

export default App;
