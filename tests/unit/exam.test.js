import { describe, it, expect } from "vitest";
import { BANK, buildExam, examTotal, slotOf } from "../../src/data/exam.js";
import { MODULES } from "../../src/data/modules.js";

const ids = (exam) => exam.flatMap((m) => m.questions.map((q) => q.id));

describe("buildExam: preguntas de cada intento", () => {
  it("siempre 4 módulos con 5 preguntas (20 en total), con sus lecciones", () => {
    const exam = buildExam(12345);
    expect(exam).toHaveLength(4);
    for (const m of exam) {
      expect(m.questions).toHaveLength(5);
      expect(m.lesson.length).toBeGreaterThan(0);
    }
    expect(examTotal(exam)).toBe(20);
  });

  it("una versión de cada hueco, sin repetir hueco", () => {
    for (const seed of [1, 2, 99, 777777]) {
      for (const m of buildExam(seed)) {
        const slots = m.questions.map(slotOf);
        const originals = MODULES.find((x) => x.id === m.id).questions.map((q) => q.id);
        expect(slots).toEqual(originals); // mismo orden de huecos que las originales
      }
    }
  });

  it("la misma semilla da las mismas preguntas (sobrevive a recargas y apagones)", () => {
    expect(ids(buildExam(424242))).toEqual(ids(buildExam(424242)));
  });

  it("semillas distintas (nuevo intento) dan combinaciones distintas", () => {
    const combos = new Set([...Array(50)].map((_, i) => ids(buildExam(1000 + i * 7919)).join(",")));
    expect(combos.size).toBeGreaterThan(45);
  });

  it("con el tiempo salen las 4 versiones de cada pregunta, de forma equilibrada", () => {
    const count = {};
    const N = 600;
    for (let i = 0; i < N; i++) for (const id of ids(buildExam(i * 104729 + 13))) count[id] = (count[id] || 0) + 1;
    const all = BANK.flatMap((m) => m.questions.map((q) => q.id));
    for (const id of all) {
      expect(count[id], id).toBeGreaterThan(N * 0.15); // cada versión ≈ 1/4 de las veces (mín. 15%)
      expect(count[id], id).toBeLessThan(N * 0.36);
    }
  });

  it("dos intentos seguidos casi nunca repiten el mismo test", () => {
    let iguales = 0;
    for (let i = 0; i < 200; i++) {
      const a = ids(buildExam(Math.floor(Math.random() * 1e9) + 1));
      const b = ids(buildExam(Math.floor(Math.random() * 1e9) + 1));
      if (a.join() === b.join()) iguales++;
    }
    expect(iguales).toBe(0);
  });
});
