import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadState, saveState, clearState } from "../../src/lib/storage.js";
import { loadPrefs, savePrefs, DEFAULT_PREFS } from "../../src/lib/prefs.js";

// localStorage en memoria (en Node no existe)
function memoryStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    clear: () => data.clear(),
  };
}

beforeEach(() => {
  globalThis.localStorage = memoryStorage();
});
afterEach(() => {
  delete globalThis.localStorage;
});

describe("storage: autoguardado del progreso", () => {
  const estado = {
    name: "María González",
    group: "3°A",
    seed: 123,
    answers: { m1q1: { optId: "a", correct: true } },
    hints: { m1q2: true },
    qpos: { m1: 3 },
    pos: { screen: "module", mi: 0, tab: "quiz" },
  };

  it("guarda y recupera todo el estado, incluida la posición", () => {
    saveState(estado);
    const s = loadState();
    expect(s).toMatchObject(estado);
    expect(typeof s.savedAt).toBe("number");
  });

  it("sin datos devuelve null", () => {
    expect(loadState()).toBeNull();
  });

  it("clearState borra el progreso", () => {
    saveState(estado);
    clearState();
    expect(loadState()).toBeNull();
  });

  it("datos corruptos no rompen la app", () => {
    localStorage.setItem("react-lab-v2", "{esto no es json");
    expect(loadState()).toBeNull();
  });

  it("si el navegador bloquea el almacenamiento (modo privado, cuota llena) no lanza errores", () => {
    globalThis.localStorage = {
      getItem() { throw new Error("SecurityError"); },
      setItem() { throw new Error("QuotaExceededError"); },
      removeItem() { throw new Error("SecurityError"); },
    };
    expect(() => saveState(estado)).not.toThrow();
    expect(loadState()).toBeNull();
    expect(() => clearState()).not.toThrow();
  });
});

describe("prefs: tema y tamaño de texto", () => {
  it("por defecto sigue al sistema", () => {
    expect(loadPrefs()).toEqual(DEFAULT_PREFS);
  });

  it("recuerda la elección del usuario", () => {
    savePrefs({ theme: "light", size: "lg" });
    expect(loadPrefs()).toEqual({ theme: "light", size: "lg" });
  });

  it("las preferencias son independientes del progreso (reiniciar no las borra)", () => {
    savePrefs({ theme: "dark", size: "normal" });
    clearState();
    expect(loadPrefs().theme).toBe("dark");
  });
});
