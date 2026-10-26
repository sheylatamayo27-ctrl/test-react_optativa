// Preferencias de visualización (tema y tamaño de texto).
// Se guardan aparte del progreso para que "Reiniciar" no las borre.
const KEY = "react-lab-prefs";

export const DEFAULT_PREFS = { theme: "system", size: "normal" };

export function loadPrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch (e) {}
  return { ...DEFAULT_PREFS };
}

export function savePrefs(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch (e) {}
}

// Aplica las preferencias como atributos en <html>; el CSS hace el resto.
export function applyPrefs(prefs) {
  const root = document.documentElement;
  if (prefs.theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", prefs.theme);
  root.setAttribute("data-size", prefs.size);
}

export function systemTheme() {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch (e) {
    return "dark";
  }
}

export function resolvedTheme(theme) {
  return theme === "system" ? systemTheme() : theme;
}
