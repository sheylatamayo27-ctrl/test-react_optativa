import { describe, it, expect } from "vitest";
import { applyAnswer, grade, restorePosition, validQuestion, resumeMessage } from "../../src/lib/progress.js";

describe("applyAnswer: un solo intento por pregunta", () => {
  it("registra la respuesta correcta", () => {
    expect(applyAnswer({}, "q1", "a", true).q1).toEqual({ optId: "a", correct: true });
  });

  it("registra la respuesta incorrecta", () => {
    expect(applyAnswer({}, "q1", "b", false).q1).toEqual({ optId: "b", correct: false });
  });

  it("una vez respondida, la respuesta no se puede cambiar", () => {
    const fallada = applyAnswer({}, "q1", "b", false);
    expect(applyAnswer(fallada, "q1", "a", true)).toBe(fallada);
    expect(applyAnswer(fallada, "q1", "a", true).q1.correct).toBe(false);
  });

  it("no modifica el objeto original (inmutable, como exige React)", () => {
    const original = { q0: { optId: "a", correct: true } };
    const copia = JSON.parse(JSON.stringify(original));
    applyAnswer(original, "q1", "a", true);
    expect(original).toEqual(copia);
  });
});

describe("grade: calificación (20 preguntas, se aprueba con 12)", () => {
  // 4 módulos × 5 preguntas, como el curso real
  const modules = [1, 2, 3, 4].map((m) => ({ questions: [1, 2, 3, 4, 5].map((n) => ({ id: `m${m}q${n}` })) }));
  const ids = modules.flatMap((m) => m.questions.map((q) => q.id));
  const withCorrect = (n) => Object.fromEntries(ids.map((id, i) => [id, { optId: "x", correct: i < n }]));

  it("cada correcta vale 5%", () => {
    expect(grade(withCorrect(20), modules, 12).pct).toBe(100);
    expect(grade(withCorrect(13), modules, 12).pct).toBe(65);
    expect(grade(withCorrect(0), modules, 12).pct).toBe(0);
  });

  it("aprueba con exactamente 12 correctas (60%)", () => {
    const g = grade(withCorrect(12), modules, 12);
    expect(g).toMatchObject({ correct: 12, wrong: 8, pct: 60, complete: true, passed: true });
  });

  it("no aprueba con 11 correctas (55%)", () => {
    expect(grade(withCorrect(11), modules, 12)).toMatchObject({ pct: 55, passed: false });
  });

  it("sin terminar no hay aprobado, aunque ya lleve 12 correctas", () => {
    const parcial = withCorrect(12);
    delete parcial.m4q5;
    expect(grade(parcial, modules, 12)).toMatchObject({ answered: 19, complete: false, passed: false });
  });

  it("sin respuestas", () => {
    expect(grade({}, modules, 12)).toMatchObject({ correct: 0, answered: 0, total: 20, complete: false, passed: false });
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
  it("describe la evaluación con su pregunta", () => {
    expect(resumeMessage({ screen: "module", mi: 0, tab: "quiz" }, 2)).toBe("Continuamos donde lo dejaste: Módulo 1 · Evaluación · Pregunta 3");
  });
  it("describe la lección", () => {
    expect(resumeMessage({ screen: "module", mi: 1, tab: "lesson" }, null)).toBe("Continuamos donde lo dejaste: Módulo 2 · Lección");
  });
  it("no muestra nada en el inicio", () => {
    expect(resumeMessage({ screen: "home", mi: 0, tab: "lesson" }, null)).toBe("");
  });
});
