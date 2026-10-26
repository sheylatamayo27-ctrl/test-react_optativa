// Valida el contenido del curso: protege contra errores al editar modules.js
// (una pregunta sin respuesta correcta, opciones repetidas, enlaces a secciones que no existen…).
import { describe, it, expect } from "vitest";
import { MODULES, PASS_CORRECT, COURSE, totalQuestions } from "../../src/data/modules.js";
import { DEMOS } from "../../src/components/Demos.jsx";

const questions = MODULES.flatMap((m) => m.questions.map((q) => ({ m, q })));

describe("curso", () => {
  it("datos generales coherentes", () => {
    expect(COURSE.name).toContain("Optativa de React");
    expect(PASS_CORRECT).toBe(12);
    expect(PASS_CORRECT).toBeLessThanOrEqual(totalQuestions());
    expect(totalQuestions()).toBe(20); // 20 preguntas → 5% cada una
    expect(totalQuestions()).toBe(questions.length);
  });

  it("ids de módulo y de pregunta únicos (el progreso guardado depende de ellos)", () => {
    const mids = MODULES.map((m) => m.id);
    const qids = questions.map(({ q }) => q.id);
    expect(new Set(mids).size).toBe(mids.length);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it("los temas de pregunta no se repiten", () => {
    const topics = questions.map(({ q }) => q.topic);
    expect(new Set(topics).size).toBe(topics.length);
  });
});

describe.each(questions.map(({ m, q }) => [q.id, m, q]))("pregunta %s", (id, m, q) => {
  it("tiene exactamente una opción correcta", () => {
    expect(q.options.filter((o) => o.correct === true)).toHaveLength(1);
  });

  it("opciones con id y contenido únicos, y feedback en cada una", () => {
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
    const contents = q.options.map((o) => (o.code ?? o.text).trim());
    expect(new Set(contents).size).toBe(contents.length);
    for (const o of q.options) expect(o.feedback, `opción ${o.id}`).toBeTruthy();
  });

  it("tiene enunciado, idea clave y pista", () => {
    expect(q.prompt).toBeTruthy();
    expect(q.teach).toBeTruthy();
    expect(q.hint).toBeTruthy();
    expect(["concept", "applied"]).toContain(q.type);
  });

  it("'Repasar en la lección' apunta a una sección que existe", () => {
    const sections = m.lesson.filter((b) => b.h && b.id).map((b) => b.id);
    expect(sections).toContain(q.ref);
  });
});

describe.each(MODULES.map((m) => [m.id, m]))("lección %s", (id, m) => {
  it("ids de sección únicos", () => {
    const ids = m.lesson.filter((b) => b.id).map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("las demos referenciadas existen", () => {
    for (const b of m.lesson.filter((b) => b.demo)) expect(DEMOS[b.demo], b.demo).toBeTypeOf("function");
  });

  it("cada bloque es de un tipo conocido", () => {
    const known = ["h", "p", "code", "ul", "goals", "steps", "analogy", "callout", "compare", "table", "ex", "summary", "demo"];
    for (const b of m.lesson) expect(known.some((k) => k in b), JSON.stringify(b).slice(0, 60)).toBe(true);
  });
});
