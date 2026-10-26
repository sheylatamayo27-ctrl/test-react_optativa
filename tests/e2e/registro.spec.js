import { test, expect } from "@playwright/test";
import { register } from "./helpers.js";
import { buildExam } from "../../src/data/exam.js";

test("pide nombre, apellidos y grupo, y muestra la optativa", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".course-tag")).toHaveText(/Optativa de React \(FTE\)/);

  await page.fill("#nombre", "María");
  await page.fill("#apellido", "González");
  await page.click("button[type=submit]");
  await expect(page.locator(".err")).toContainText("grupo");

  await page.fill("#grupo", "3°A");
  await page.click("button[type=submit]");

  await expect(page.locator(".hero .lead")).toContainText("Optativa de React (FTE)");
  await expect(page.locator(".course-card")).toContainText("María González");
  await expect(page.locator(".course-card .course-group")).toHaveText("3°A");
  await expect(page.locator(".who-group")).toHaveText("3°A");
});

test("un alumno con progreso antiguo (sin grupo) completa sus datos sin perder respuestas", async ({ page }) => {
  // Una respuesta guardada para la versión de la primera pregunta que sale con esta semilla
  const qid = buildExam(42)[0].questions[0].id;
  await page.goto("./");
  await page.evaluate((qid) =>
    localStorage.setItem("react-lab-v2", JSON.stringify({
      name: "Luis Pérez Ramos",
      seed: 42,
      answers: { [qid]: { optId: "a", correct: true } },
      hints: {},
    })), qid
  );
  await page.reload();

  await expect(page.locator(".gate h1")).toHaveText("Completa tus datos");
  await expect(page.locator("#nombre")).toHaveValue("Luis");
  await expect(page.locator("#apellido")).toHaveValue("Pérez Ramos");

  await page.fill("#grupo", "2DAW");
  await page.click("button[type=submit]");
  await expect(page.locator(".hero-cta")).toContainText("1/20 respondidas");

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("react-lab-v2")));
  expect(saved.group).toBe("2DAW");
  expect(saved.seed).toBe(42); // conserva el mismo orden de preguntas
});

test("el modo claro/oscuro y el tamaño de texto se recuerdan al recargar", async ({ page }) => {
  await register(page);
  const html = page.locator("html");
  const before = await page.evaluate(() => matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const target = before === "dark" ? "light" : "dark";

  await page.locator(".settings .icon-btn").first().click();
  await expect(html).toHaveAttribute("data-theme", target);

  await page.locator(".settings .icon-btn").nth(1).click();
  await page.locator(".pop .seg-btn", { hasText: "Muy grande" }).click();
  await expect(html).toHaveAttribute("data-size", "xl");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", target);
  await expect(html).toHaveAttribute("data-size", "xl");
});
