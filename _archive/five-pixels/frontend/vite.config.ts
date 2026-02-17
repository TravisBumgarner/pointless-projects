import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL":
      mode === "development" ? "'http://localhost:8000'" : "'/api'",
  },
}));
