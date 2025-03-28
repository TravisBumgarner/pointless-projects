import "./app.css";
import Navigation from "./components/Navigation";
import Router from "./components/Router";

function App() {
  return (
    <div style={{ margin: "0 auto", maxWidth: "1200px" }}>
      <Navigation />
      <Router />
    </div>
  );
}

export default App;
