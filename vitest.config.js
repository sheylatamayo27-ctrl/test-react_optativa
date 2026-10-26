import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Pruebas unitarias (lógica y contenido). Las de navegador están en tests/e2e (Playwright).
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["tests/unit/**/*.test.{js,jsx}"],
    environment: "node",
  },
});
