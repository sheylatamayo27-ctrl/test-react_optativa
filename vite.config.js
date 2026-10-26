import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: "./" hace que funcione al abrir el build en cualquier carpeta o subdominio
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // PWA: un Service Worker guarda toda la app en el dispositivo para que el test
    // se pueda abrir y completar (incluido el certificado PDF) sin conexión.
    VitePWA({
      registerType: "prompt", // si hay versión nueva se avisa al alumno; no se recarga sola en mitad del test
      injectRegister: false, // el registro se hace desde React (components/PwaStatus.jsx)
      manifest: {
        name: "React Lab — Optativa de React (FTE)",
        short_name: "React Lab",
        description: "Evaluación de la Optativa de React con certificado.",
        lang: "es",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#0e1117",
        theme_color: "#3d5af1",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Todo lo que genera el build, incluidos los módulos de jsPDF, para que el PDF funcione offline
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
