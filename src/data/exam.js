// Banco de preguntas y armado del test de cada intento.
import { MODULES } from "./modules.js";
import { VARIANTS } from "./variantes.js";
// Índice pseudoaleatorio en [0, n) a partir de la semilla y una clave (el hueco).
// FNV-1a + mezcla final (murmur3): cada hueco se sortea de forma independiente.
// (Un hash simple de "semilla + hueco" haría que todos los huecos cambiaran a la vez.)
function pick(seed, key, n) {
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) % n;
}

// Cada pregunta pertenece a un "hueco": las originales son su propio hueco y las versiones
// alternativas indican con `slot` a qué pregunta original sustituyen.
export const slotOf = (q) => q.slot || q.id;

// Banco completo: lecciones de cada módulo + todas las versiones de cada pregunta.
export const BANK = MODULES.map((m) => ({ ...m, questions: [...m.questions, ...(VARIANTS[m.id] || [])] }));

// Versiones agrupadas por hueco, en el orden de las preguntas originales.
function slotsOf(module) {
  const order = [];
  const bySlot = {};
  for (const q of module.questions) {
    const s = slotOf(q);
    if (!bySlot[s]) {
      bySlot[s] = [];
      order.push(s);
    }
    bySlot[s].push(q);
  }
  return order.map((s) => bySlot[s]);
}

// Test de un intento: una versión de cada hueco, elegida a partir de la semilla del intento.
// Misma semilla → mismas preguntas (sobrevive a recargas); semilla nueva → otra combinación.
export function buildExam(seed) {
  return BANK.map((m) => ({
    ...m,
    questions: slotsOf(m).map((versions) => versions[pick(seed, slotOf(versions[0]), versions.length)]),
  }));
}

export function examTotal(exam) {
  return exam.reduce((n, m) => n + m.questions.length, 0);
}
