// Guardado del progreso en el navegador del alumno (sobrevive a cierres/apagones).
const KEY = "react-lab-v2";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch (e) {}
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {}
}
