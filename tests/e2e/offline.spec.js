// Funcionamiento sin conexión (PWA). Cada prueba usa su propio servidor, que se APAGA a mitad
// de la prueba: así, lo que funcione después solo puede venir de la caché del Service Worker.
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { register, solveOpenModule, startStaticServer, waitOfflineReady } from "./helpers.js";
import { MODULES } from "../../src/data/modules.js";

let srv;
test.beforeEach(async () => {
  srv = await startStaticServer();
});
test.afterEach(async ({ context }) => {
  await context.setOffline(false);
  await srv.close().catch(() => {});
});

test("la app queda instalada para usarse sin conexión y lo avisa", async ({ page }) => {
  await page.goto(srv.url);
  await waitOfflineReady(page);
  // Rutas guardadas en la caché, sin el origen ni el parámetro de revisión de Workbox
  const cached = await page.evaluate(async () => {
    const out = [];
    for (const name of await caches.keys())
      for (const r of await (await caches.open(name)).keys()) {
        const u = new URL(r.url);
        out.push(u.pathname.slice(1));
      }
    return out;
  });
  // Todo lo que el Service Worker debe guardar (lista generada en el build) está realmente en caché
  const expected = [...new Set([...readFileSync("dist/sw.js", "utf8").matchAll(/url:"([^"]+)"/g)].map((m) => m[1]))];
  expect(expected).toEqual(expect.arrayContaining(["index.html", "manifest.webmanifest"]));
  expect(expected.some((f) => /^assets\/index-.*\.js$/.test(f))).toBe(true); // la app (incluye jsPDF)
  expect(expected.some((f) => f.endsWith(".css"))).toBe(true);
  expect(cached.sort()).toEqual(expected.sort());
});

test("muestra el indicador al perder la conexión y el aviso al recuperarla", async ({ page, context }) => {
  await page.goto(srv.url);
  await context.setOffline(true);
  await expect(page.locator(".net-off")).toBeVisible();
  await expect(page.locator(".toast")).toContainText("Sin conexión: puedes seguir");
  await context.setOffline(false);
  await expect(page.locator(".net-off")).toBeHidden();
  await expect(page.locator(".toast")).toHaveText("Conexión restablecida");
});

test("sin internet ni servidor: abre al recargar, se completa entero y descarga el certificado", async ({ page, context }) => {
  test.setTimeout(150_000);
  await page.goto(srv.url);
  await waitOfflineReady(page);

  // Se va internet (y el servidor deja de existir)
  await srv.close();
  await context.setOffline(true);

  // Recargar ya no da "Sin conexión a internet": la app sale de la caché
  await page.reload();
  await expect(page.locator(".gate-card")).toBeVisible();
  await expect(page.locator(".net-off")).toBeVisible();

  await page.fill("#nombre", "Ana");
  await page.fill("#apellido", "Torres");
  await page.fill("#grupo", "2DAW");
  await page.click("button[type=submit]");

  // Las 4 lecciones (con sus demos) y las 20 preguntas, sin conexión
  for (let i = 0; i < MODULES.length; i++) {
    await page.locator(".dot", { hasText: String(i + 1) }).click();
    await expect(page.locator(".demo")).toBeVisible();
    await solveOpenModule(page);
  }

  // Un apagón en medio también funciona sin conexión: vuelve al último módulo, ya terminado
  await page.reload();
  await expect(page.locator(".m-head h1")).toHaveText(MODULES[MODULES.length - 1].title);
  await expect(page.locator(".done-card")).toBeVisible();

  await page.locator(".dot", { hasText: "★" }).click();
  await expect(page.locator(".res-stats .stat").first()).toContainText("20/20");
  await expect(page.locator(".badge.ok")).toContainText("Aprobado");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Descargar certificado PDF/ }).click(),
  ]);
  const pdf = (await import("node:fs")).readFileSync(await download.path(), "latin1");
  expect(pdf).toContain("Ana Torres");
  expect(pdf).toContain("Grupo 2DAW");
});

test("cuando se publica una versión nueva, avisa y al actualizar conserva el progreso", async ({ page }) => {
  await page.goto(srv.url);
  await waitOfflineReady(page);
  await register(page, { nombre: "Luis", apellido: "Pérez", grupo: "1B", url: srv.url });
  await page.locator(".dot", { hasText: "2" }).click();

  // El profesor publica una versión nueva (cambia el Service Worker)
  srv.state.swSuffix = "// version 2";
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());

  const banner = page.locator(".pwa-banner", { hasText: "Hay una versión nueva del test" });
  await expect(banner).toBeVisible({ timeout: 30_000 });
  await banner.getByRole("button", { name: "Actualizar" }).click();

  await expect(banner).toBeHidden();
  await expect(page.locator(".m-head h1")).toHaveText("Estado con useState");
  await expect(page.locator(".who-group")).toHaveText("1B");
});
