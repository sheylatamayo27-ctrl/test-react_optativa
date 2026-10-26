// Lógica de progreso sin dependencias de React, para poder probarla de forma aislada.
import { answerInfo } from "./util.js";

// Registra un intento. Una pregunta ya resuelta no vuelve a contar.
export function applyAnswer(answers, qid, optId, correct) {
  const prev = answers[qid];
  if (prev && prev.solved) return answers;
  const info = answerInfo(prev);
  const wrong = correct || info.wrong.includes(optId) ? info.wrong : [...info.wrong, optId];
  return { ...answers, [qid]: { optId, solved: !!correct, tries: info.tries + 1, wrong } };
}

const SCREENS = ["home", "module", "results"];

// Convierte la posición guardada en una pantalla válida. Si el dato está corrupto
// o el curso cambió (menos módulos), cae en un valor seguro en lugar de romper la app.
export function restorePosition(saved, moduleCount) {
  const pos = (saved && saved.pos) || {};
  const screen = SCREENS.includes(pos.screen) ? pos.screen : "home";
  const mi = Number.isInteger(pos.mi) && pos.mi >= 0 && pos.mi < moduleCount ? pos.mi : 0;
  const tab = pos.tab === "quiz" ? "quiz" : "lesson";
  return { screen, mi, tab };
}

// Índice de pregunta guardado, solo si sigue siendo válido para ese módulo.
export function validQuestion(idx, total) {
  return Number.isInteger(idx) && idx >= 0 && idx < total ? idx : null;
}

// Texto del aviso al retomar el test.
export function resumeMessage({ screen, mi, tab }, qIdx) {
  if (screen === "results") return "Continuamos donde lo dejaste: Resultados";
  if (screen !== "module") return "";
  const where = tab === "quiz" && qIdx != null ? `Práctica · Pregunta ${qIdx + 1}` : "Lección";
  return `Continuamos donde lo dejaste: Módulo ${mi + 1} · ${where}`;
}
