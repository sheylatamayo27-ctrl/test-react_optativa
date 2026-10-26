import { describe, it, expect } from "vitest";
import { applyAnswer, restorePosition, validQuestion, resumeMessage } from "../../src/lib/progress.js";
import { answerInfo } from "../../src/lib/util.js";

describe("applyAnswer: registro de intentos", () => {
  it("acierto al primer intento", () => {
    const a = applyAnswer({}, "q1", "a", true);
    expect(a.q1).toEqual({ optId: "a", solved: true, tries: 1, wrong: [] });
    expect(answerInfo(a.q1).firstTry).toBe(true);
  });

  it("fallos y luego acierto: cuenta intentos y recuerda las opciones falladas", () => {
    let a = applyAnswer({}, "q1", "b", false);
    a = applyAnswer(a, "q1", "c", false);
    a = applyAnswer(a, "q1", "a", true);
    expect(a.q1).toEqual({ optId: "a", solved: true, tries: 3, wrong: ["b", "c"] });
    expect(answerInfo(a.q1).firstTry).toBe(false);
  });

  it("no duplica una opción fallada dos veces", () => {
    let a = applyAnswer({}, "q1", "b", false);
    a = applyAnswer(a, "q1", "b", false);
    expect(a.q1.wrong).toEqual(["b"]);
  });

  it("una pregunta resuelta no vuelve a contar intentos", () => {
    const a = applyAnswer({}, "q1", "a", true);
    expect(applyAnswer(a, "q1", "b", false)).toBe(a);
  });

  it("no modifica el objeto original (inmutable, como exige React)", () => {
    const original = { q0: { optId: "a", solved: true, tries: 1, wrong: [] } };
    const copia = JSON.parse(JSON.stringify(original));
    applyAnswer(original, "q1", "a", true);
    expect(original).toEqual(copia);
  });

  it("acepta progreso guardado por versiones antiguas (sin tries ni wrong)", () => {
    const a = applyAnswer({ q1: { optId: "b", solved: false } }, "q1", "a", true);
    expect(a.q1.tries).toBe(2);
    expect(a.q1.solved).toBe(true);
  });
});

describe("restorePosition: volver donde se quedó", () => {
  it("restaura una posición válida", () => {
    expect(restorePosition({ pos: { screen: "module", mi: 2, tab: "quiz" } }, 4)).toEqual({ screen: "module", mi: 2, tab: "quiz" });
  });

  it("sin posición guardada (progreso antiguo) va al inicio", () => {
    expect(restorePosition({ name: "Ana" }, 4)).toEqual({ screen: "home", mi: 0, tab: "lesson" });
    expect(restorePosition(null, 4)).toEqual({ screen: "home", mi: 0, tab: "lesson" });
  });

  it("datos corruptos o fuera de rango caen en valores seguros", () => {
    expect(restorePosition({ pos: { screen: "hackeado", mi: 99, tab: "x" } }, 4)).toEqual({ screen: "home", mi: 0, tab: "lesson" });
    expect(restorePosition({ pos: { screen: "module", mi: -1, tab: "quiz" } }, 4).mi).toBe(0);
    expect(restorePosition({ pos: { screen: "module", mi: "2", tab: "quiz" } }, 4).mi).toBe(0);
  });

  it("nunca restaura la pantalla de registro", () => {
    expect(restorePosition({ pos: { screen: "gate" } }, 4).screen).toBe("home");
  });
});

describe("validQuestion", () => {
  it("acepta índices dentro del rango", () => {
    expect(validQuestion(0, 5)).toBe(0);
    expect(validQuestion(4, 5)).toBe(4);
  });
  it("rechaza índices inválidos", () => {
    expect(validQuestion(5, 5)).toBeNull();
    expect(validQuestion(-1, 5)).toBeNull();
    expect(validQuestion(undefined, 5)).toBeNull();
    expect(validQuestion("2", 5)).toBeNull();
  });
});

describe("resumeMessage", () => {
  it("describe la práctica con su pregunta", () => {
    expect(resumeMessage({ screen: "module", mi: 0, tab: "quiz" }, 2)).toBe("Continuamos donde lo dejaste: Módulo 1 · Práctica · Pregunta 3");
  });
  it("describe la lección", () => {
    expect(resumeMessage({ screen: "module", mi: 1, tab: "lesson" }, null)).toBe("Continuamos donde lo dejaste: Módulo 2 · Lección");
  });
  it("no muestra nada en el inicio", () => {
    expect(resumeMessage({ screen: "home", mi: 0, tab: "lesson" }, null)).toBe("");
  });
});
