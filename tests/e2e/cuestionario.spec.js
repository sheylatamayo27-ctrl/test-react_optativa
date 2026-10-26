import { test, expect } from "@playwright/test";
import { register, answerCurrent, currentQuestion, optionIndex, solveOpenModule, finishedAnswers } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await register(page);
  await page.locator(".mod-card").first().click();
  await page.locator(".tab", { hasText: "Evaluación" }).click();
});

test("hay que confirmar la respuesta: marcar una opción no la registra", async ({ page }) => {
  await expect(page.locator(".exam-note")).toContainText("Un solo intento por pregunta");
  const confirm = page.getByRole("button", { name: "Confirmar respuesta" });
  await expect(confirm).toBeDisabled();

  await page.locator(".opt").first().click();
  await expect(page.locator(".opt.selected")).toHaveCount(1);
  await expect(confirm).toBeEnabled();
  await expect(page.locator(".fb")).toHaveCount(0);

  // Se puede cambiar de opción mientras no se confirme
  await page.locator(".opt").nth(1).click();
  await expect(page.locator(".opt").nth(1)).toHaveClass(/selected/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("react-lab-v2")).answers);
  expect(saved).toEqual({});
});

test("respuesta incorrecta: un solo intento, muestra la correcta y su explicación", async ({ page }) => {
  const { q } = await answerCurrent(page, false);
  const correct = q.options.find((o) => o.correct);

  const fb = page.locator(".fb.bad");
  await expect(fb).toBeVisible();
  await expect(page.locator(".q-result")).toHaveText("✕ Incorrecta");
  await expect(fb).toContainText("Por qué tu respuesta no funciona");
  await expect(fb).toContainText("La respuesta correcta era la");

  // La opción correcta queda marcada en verde y ninguna se puede volver a elegir
  const idx = await optionIndex(page, correct);
  await expect(page.locator(".opt").nth(idx)).toHaveClass(/correct/);
  for (const o of await page.locator(".opt").all()) await expect(o).toBeDisabled();
  await expect(page.getByRole("button", { name: "Confirmar respuesta" })).toHaveCount(0);

  // Ni con el teclado se puede cambiar
  await page.keyboard.press(String.fromCharCode(97 + idx));
  await page.keyboard.press("Enter");
  const saved = await page.evaluate((id) => JSON.parse(localStorage.getItem("react-lab-v2")).answers[id], q.id);
  expect(saved.correct).toBe(false);

  // Repasar el tema y volver: la pregunta sigue registrada como incorrecta
  await fb.getByRole("button", { name: /Repasar este tema/ }).click();
  await expect(page.locator("#sec-" + q.ref)).toBeInViewport();
  await page.locator(".review-banner").getByRole("button", { name: /Volver a la pregunta/ }).click();
  expect((await currentQuestion(page)).id).toBe(q.id);
  await expect(page.locator(".q-result")).toHaveText("✕ Incorrecta");
});

test("respuesta correcta: explicación, ejemplo aplicado y por qué fallan las otras", async ({ page }) => {
  const { q } = await answerCurrent(page, true);
  const fb = page.locator(".fb.good");
  await expect(fb).toBeVisible();
  await expect(page.locator(".q-result")).toHaveText("✓ Correcta");
  await expect(fb).toContainText("Por qué es correcta");
  await expect(fb).toContainText("Para recordar");
  if (q.example) await expect(fb.locator("pre.code")).toBeVisible();
  await fb.locator("summary").click();
  await expect(fb.locator(".others li")).toHaveCount(q.options.length - 1);
});

test("las pistas se pueden ver antes de responder (también con la tecla H)", async ({ page }) => {
  await page.keyboard.press("h");
  await expect(page.locator(".hintbox")).toBeVisible();
});

test("al terminar un módulo muestra las correctas y abre la lección del siguiente", async ({ page }) => {
  await solveOpenModule(page, [true, false, true, true, false]);
  await expect(page.locator(".done-card")).toContainText("3/5");
  await expect(page.locator(".done-card")).toContainText("15%");
  await expect(page.locator(".seg-q.ok")).toHaveCount(3);
  await expect(page.locator(".seg-q.bad")).toHaveCount(2);
  await page.locator(".done-card .btn").click();
  await expect(page.locator(".m-head h1")).toHaveText("Estado con useState");
  await expect(page.locator(".tab.active")).toContainText("Lección");
});

async function finishWith(page, nCorrect) {
  await page.evaluate((answers) => {
    const s = JSON.parse(localStorage.getItem("react-lab-v2"));
    localStorage.setItem("react-lab-v2", JSON.stringify({ ...s, name: "Ana Torres", group: "402", answers }));
  }, finishedAnswers(nCorrect));
  await page.reload();
  await page.locator(".dot", { hasText: "★" }).click();
}

test("con 12 de 20 correctas aprueba (60%) y descarga el certificado", async ({ page }) => {
  await finishWith(page, 12);
  await expect(page.locator(".score-ring")).toContainText("60%");
  await expect(page.locator(".badge")).toHaveText("✓ Aprobado");
  await expect(page.locator(".mistake")).toHaveCount(8);
  await expect(page.locator(".cert-group")).toHaveText("Grupo 402");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Descargar certificado PDF/ }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("certificado-react-lab-ana-torres-402.pdf");
  const pdf = (await import("node:fs")).readFileSync(await download.path(), "latin1");
  expect(pdf).toContain("Ana Torres");
  expect(pdf).toContain("Grupo 402");
  expect(pdf).toContain("60%");
  expect(pdf).toContain("OPTATIVA DE REACT \\(FTE\\)");
});

test("con 11 de 20 correctas no aprueba: sin certificado ni forma de corregir", async ({ page }) => {
  await finishWith(page, 11);
  await expect(page.locator(".score-ring")).toContainText("55%");
  await expect(page.locator(".badge")).toHaveText("✕ No aprobado");
  await expect(page.locator(".no-cert")).toContainText("12 de 20");
  await expect(page.locator(".mistake")).toHaveCount(9);
  await expect(page.getByRole("button", { name: /Descargar certificado/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Corregir|Reiniciar|Reintentar/ })).toHaveCount(0);
});

test("antes de terminar no se muestra la nota", async ({ page }) => {
  await answerCurrent(page, true);
  await page.locator(".dot", { hasText: "★" }).click();
  await expect(page.locator(".res-head h1")).toHaveText("Aún no has terminado");
  await expect(page.locator(".res-head")).toContainText("1 de 20");
  await expect(page.locator(".score-ring")).toHaveCount(0);
  await page.getByRole("button", { name: /Continuar la evaluación/ }).click();
  await expect(page.locator(".q-topic")).toBeVisible();
});
