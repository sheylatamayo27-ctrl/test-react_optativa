import { useEffect, useRef, useState } from "react";
import { resolvedTheme } from "../lib/prefs.js";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
  </svg>
);
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);

function Segmented({ value, options, onChange, label }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          className={"seg-btn" + (value === v ? " active" : "")}
          onClick={() => onChange(v)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function Settings({ prefs, setPrefs }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const theme = resolvedTheme(prefs.theme);

  // Cerrar el panel al hacer clic fuera o con Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggleTheme() {
    setPrefs({ ...prefs, theme: theme === "dark" ? "light" : "dark" });
  }

  return (
    <div className="settings" ref={box}>
      <button
        className="icon-btn"
        onClick={toggleTheme}
        title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
      <button
        className={"icon-btn" + (open ? " on" : "")}
        onClick={() => setOpen(!open)}
        title="Ajustes de visualización"
        aria-label="Ajustes de visualización"
        aria-expanded={open}
      >
        <GearIcon />
      </button>

      {open && (
        <div className="pop card" role="dialog" aria-label="Ajustes">
          <div className="pop-sec">
            <div className="pop-lbl">Tema</div>
            <Segmented
              label="Tema"
              value={prefs.theme}
              onChange={(v) => setPrefs({ ...prefs, theme: v })}
              options={[["light", "☀ Claro"], ["dark", "☾ Oscuro"], ["system", "◐ Sistema"]]}
            />
          </div>
          <div className="pop-sec">
            <div className="pop-lbl">Tamaño de texto</div>
            <Segmented
              label="Tamaño de texto"
              value={prefs.size}
              onChange={(v) => setPrefs({ ...prefs, size: v })}
              options={[["normal", "Normal"], ["lg", "Grande"], ["xl", "Muy grande"]]}
            />
          </div>
          <div className="pop-sec">
            <div className="pop-lbl">Atajos en la evaluación</div>
            <ul className="keys">
              <li><kbd>A</kbd>–<kbd>D</kbd> o <kbd>1</kbd>–<kbd>4</kbd> marcar opción</li>
              <li><kbd>Enter</kbd> confirmar respuesta</li>
              <li><kbd>→</kbd> siguiente · <kbd>←</kbd> anterior</li>
              <li><kbd>H</kbd> ver pista</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
