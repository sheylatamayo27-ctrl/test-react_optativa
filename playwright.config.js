import { defineConfig } from "@playwright/test";

// Pruebas de navegador (end-to-end) sobre el build de producción, que es el que incluye el Service Worker.
// Usan el Google Chrome instalado en el equipo. Si no tienes Chrome:
//   npx playwright install chromium   y quita la línea "channel".
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173/",
    channel: "chrome",
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run build && npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173/",
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
