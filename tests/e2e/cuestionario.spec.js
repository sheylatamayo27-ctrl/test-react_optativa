import { test, expect } from "@playwright/test";
import { register, answerCurrent, currentQuestion, solveOpenModule, allSolvedAnswers } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await register(page);
  await page.locator(".mod-card").first().click();
  await page.locator(".tab", { hasText: "Práctica" }).click();
});

test("respuesta incorrecta: explica el error, cuenta el intento y permite repasar la lección", async ({ page }) => {
  const { q, option } = await answerCurrent(page, false);

  const fb = page.locator(".fb.bad");
  await expect(fb).toBeVisible();
  await expect(fb.locator(".fb-lbl").first()).toHaveText(/Por qué esa opción no funciona/i);
  await expect(page.locator(".q-tries")).toHaveText("Intento 1");
  await expect(page.locator(".opt.wrong")).toBeDisabled();
  expect(option.feedback.length).toBeGreaterThan(0);

  // Repasar en la lección lleva a la sección que explica esa pregunta
  await fb.getByRole("button", { name: /Repasar en la lección/ }).click();
  await expect(page.locator(".review-banner")).toBeVisible();
  await expect(page.locator("#sec-" + q.ref)).toBeInViewport();

  // Y se vuelve a la misma pregunta, con el intento guardado
  await page.locator(".review-banner").getByRole("button", { name: /Volver a la pregunta/ }).click();
  expect((await currentQuestion(page)).id).toBe(q.id);
  await expect(page.locator(".q-tries")).toHaveText("Intento 1");
});

test("respuesta correcta: explicación, ejemplo aplicado y por qué fallan las otras opciones", async ({ page }) => {
  const { q } = await answerCurrent(page, true);

  const fb = page.locator(".fb.good");
  await expect(fb).toBeVisible();
  await expect(page.locator(".q-tries")).toHaveText("1er intento");
  await expect(fb).toContainText("Por qué es correcta");
  await expect(fb).toContainText("Para recordar");
  if (q.example) await expect(fb.locator("pre.code")).toBeVisible();

  await fb.locator("summary").click();
  await expect(fb.locator(".others li")).toHaveCount(q.options.length - 1);
});

test("la pista se muestra al pedirla y con la tecla H", async ({ page }) => {
  await page.keyboard.press("h");
  await expect(page.locator(".hintbox")).toBeVisible();
});

test("completar un módulo muestra el resumen y abre la lección del siguiente", async ({ page }) => {
  await solveOpenModule(page);
  await expect(page.locator(".done-card")).toContainText("5/5");
  await page.locator(".done-card .btn").click();
  await expect(page.locator(".m-head h1")).toHaveText("Estado con useState");
  await expect(page.locator(".tab.active")).toContainText("Lección");
});

test("al aprobar se descarga el certificado PDF con nombre, grupo y la optativa", async ({ page }) => {
  await page.evaluate((answers) => {
    const s = JSON.parse(localStorage.getItem("react-lab-v2"));
    localStorage.setItem("react-lab-v2", JSON.stringify({ ...s, name: "Ana Torres", group: "2DAW", answers }));
  }, allSolvedAnswers());
  await page.reload();
  await page.locator(".dot", { hasText: "★" }).click();

  await expect(page.locator(".cert-group")).toHaveText("Grupo 2DAW");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Descargar certificado PDF/ }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("certificado-react-lab-ana-torres-2daw.pdf");
  const pdf = (await import("node:fs")).readFileSync(await download.path(), "latin1");
  expect(pdf.startsWith("%PDF")).toBe(true);
  expect(pdf).toContain("Ana Torres");
  expect(pdf).toContain("Grupo 2DAW");
  expect(pdf).toContain("OPTATIVA DE REACT \\(FTE\\)");
});
