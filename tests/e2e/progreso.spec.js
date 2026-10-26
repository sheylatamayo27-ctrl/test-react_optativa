// Simula cortes de luz: se cierra la pestaña de golpe y se vuelve a abrir el test en el mismo navegador.
import { test, expect } from "@playwright/test";
import { register, answerCurrent, currentQuestion } from "./helpers.js";

async function powerCut(page, context) {
  await page.close();
  const again = await context.newPage();
  await again.goto("./");
  return again;
}

test("tras un apagón en mitad de la práctica vuelve a la misma pregunta con sus respuestas", async ({ page, context }) => {
  await register(page);
  await page.locator(".dot", { hasText: "2" }).click();
  await page.locator(".tab", { hasText: "Práctica" }).click();

  await answerCurrent(page, true);
  await page.locator(".q-nav .btn", { hasText: "Siguiente" }).click();
  await answerCurrent(page, false); // un fallo también debe conservarse
  await page.locator(".q-nav .btn", { hasText: "Siguiente" }).click();
  const where = await currentQuestion(page);

  page = await powerCut(page, context);

  await expect(page.locator(".m-head h1")).toHaveText("Estado con useState");
  await expect(page.locator(".tab.active")).toContainText("Práctica");
  expect((await currentQuestion(page)).id).toBe(where.id);
  await expect(page.locator(".toast")).toHaveText("Continuamos donde lo dejaste: Módulo 2 · Práctica · Pregunta 3");
  await expect(page.locator(".seg-q.first")).toHaveCount(1);
  await expect(page.locator(".seg-q.tried")).toHaveCount(1);
});

test("si estaba leyendo una lección, vuelve a esa lección", async ({ page, context }) => {
  await register(page);
  await page.locator(".dot", { hasText: "3" }).click();
  await expect(page.locator(".m-head h1")).toHaveText("Hooks y Consumo de APIs");

  page = await powerCut(page, context);

  await expect(page.locator(".m-head h1")).toHaveText("Hooks y Consumo de APIs");
  await expect(page.locator(".tab.active")).toContainText("Lección");
  await expect(page.locator(".toast")).toHaveText("Continuamos donde lo dejaste: Módulo 3 · Lección");
});

test("recuerda la pregunta de cada módulo por separado", async ({ page, context }) => {
  await register(page);
  await page.locator(".dot", { hasText: "1" }).click();
  await page.locator(".tab", { hasText: "Práctica" }).click();
  await answerCurrent(page, true);
  await page.locator(".q-nav .btn", { hasText: "Siguiente" }).click();
  const m1 = await currentQuestion(page);

  await page.locator(".dot", { hasText: "4" }).click();
  page = await powerCut(page, context);
  await page.locator(".dot", { hasText: "1" }).click();
  await page.locator(".tab", { hasText: "Práctica" }).click();
  expect((await currentQuestion(page)).id).toBe(m1.id);
});

test("un progreso guardado corrupto no rompe la app", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => localStorage.setItem("react-lab-v2", "{esto no es json"));
  await page.reload();
  await expect(page.locator(".gate h1")).toBeVisible();

  await page.evaluate(() =>
    localStorage.setItem("react-lab-v2", JSON.stringify({ name: "Ana Torres", group: "1A", seed: 5, answers: {}, pos: { screen: "module", mi: 99, tab: "quiz" }, qpos: { m1: 999 } }))
  );
  await page.reload();
  await expect(page.locator(".m-head h1")).toHaveText("Componentes y Listas");
  await expect(page.locator(".q-topic")).toBeVisible();
});
