import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/photo/:id" element={<App />} />
        <Route path="*" element={<Navigate to="/photo/0" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
