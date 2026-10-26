import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { expect } from "@playwright/test";
import { MODULES } from "../../src/data/modules.js";

export const QUESTIONS = MODULES.flatMap((m) => m.questions);

const norm = (s) => String(s).replace(/[*`]/g, "").replace(/\s+/g, " ").trim();
const optionText = (o) => norm(o.code ?? o.text);

export async function register(page, { nombre = "María", apellido = "González", grupo = "3°A", url = "./" } = {}) {
  await page.goto(url);
  await page.fill("#nombre", nombre);
  await page.fill("#apellido", apellido);
  await page.fill("#grupo", grupo);
  await page.click("button[type=submit]");
  await expect(page.locator(".hero h1")).toBeVisible();
}

// Pregunta que se ve en pantalla (se identifica por su tema, que es único).
export async function currentQuestion(page) {
  const topic = norm(await page.locator(".q-topic").textContent());
  const q = QUESTIONS.find((x) => x.topic === topic);
  if (!q) throw new Error("Pregunta no encontrada: " + topic);
  return q;
}

// Pulsa la opción correcta (o una incorrecta) de la pregunta actual. El orden de las opciones es aleatorio.
export async function answerCurrent(page, correct = true) {
  const q = await currentQuestion(page);
  const target = q.options.find((o) => !!o.correct === correct);
  const texts = (await page.locator(".opt .otext").allTextContents()).map(norm);
  const idx = texts.indexOf(optionText(target));
  if (idx < 0) throw new Error(`Opción no encontrada en ${q.id}: ${optionText(target)}`);
  await page.locator(".opt").nth(idx).click();
  return { q, option: target };
}

// Resuelve todas las preguntas del módulo abierto (pestaña Práctica).
export async function solveOpenModule(page) {
  await page.locator(".tab", { hasText: "Práctica" }).click();
  const total = await page.locator(".seg-q").count();
  for (let i = 0; i < total; i++) {
    await answerCurrent(page, true);
    await expect(page.locator(".fb.good")).toBeVisible();
    if (i < total - 1) await page.locator(".q-nav .btn", { hasText: "Siguiente" }).click();
  }
  await expect(page.locator(".done-card")).toBeVisible();
}

// Progreso con todas las respuestas correctas, para probar resultados y certificado.
export function allSolvedAnswers() {
  const answers = {};
  for (const q of QUESTIONS) answers[q.id] = { optId: q.options.find((o) => o.correct).id, solved: true, tries: 1, wrong: [] };
  return answers;
}

// Servidor estático propio sobre dist/, que se puede apagar a mitad de una prueba para
// simular que no hay internet (ni servidor): lo que cargue después solo puede venir de la caché del Service Worker.
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json", ".json": "application/json",
};
export async function startStaticServer() {
  const root = join(process.cwd(), "dist");
  const state = { swSuffix: "" }; // permite publicar una "versión nueva" del Service Worker
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^[\\/]+/, "");
    const file = join(root, path || "index.html");
    if (!file.startsWith(root)) return res.writeHead(403).end();
    try {
      let body = await readFile(file);
      if (path === "sw.js" && state.swSuffix) body = Buffer.concat([body, Buffer.from("\n" + state.swSuffix)]);
      res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://localhost:${server.address().port}/`;
  return {
    url,
    state,
    close: () => new Promise((r) => { server.closeAllConnections(); server.close(r); }),
  };
}

// Espera a que el Service Worker esté activo y la app quede guardada para usarse sin conexión.
export async function waitOfflineReady(page) {
  await expect(page.locator(".pwa-banner", { hasText: "Listo para usar sin conexión" })).toBeVisible({ timeout: 30_000 });
  await page.evaluate(() => navigator.serviceWorker.ready);
}
