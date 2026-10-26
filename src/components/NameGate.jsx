import { useState } from "react";
import { COURSE } from "../data/modules.js";

export default function NameGate({ onSubmit, initialName = "", initialGroup = "" }) {
  // Si ya había un nombre guardado (progreso anterior sin grupo), se separa para rellenar el formulario
  const parts = initialName.trim().split(/\s+/);
  const [nombre, setNombre] = useState(parts[0] || "");
  const [apellido, setApellido] = useState(parts.slice(1).join(" "));
  const [grupo, setGrupo] = useState(initialGroup);
  const [err, setErr] = useState("");
  const returning = !!initialName;

  function submit(e) {
    e.preventDefault();
    const n = nombre.trim();
    const a = apellido.trim();
    const g = grupo.trim();
    if (n.length < 2 || a.length < 2) {
      setErr("Escribe tu nombre y tus apellidos para continuar.");
      return;
    }
    if (g.length < 1) {
      setErr("Indica el número de tu grupo.");
      return;
    }
    onSubmit(n + " " + a, g);
  }

  return (
    <div className="wrap gate">
      <form className="card gate-card" onSubmit={submit}>
        <span className="course-tag">🎓 {COURSE.name}</span>
        <h1>{returning ? "Completa tus datos" : "Bienvenido a React Lab"}</h1>
        {returning && <p>Tu progreso sigue guardado. Solo falta tu grupo.</p>}
        <div className="fld">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: María"
            maxLength={40}
            autoComplete="given-name"
          />
        </div>
        <div className="fld">
          <label htmlFor="apellido">Apellidos</label>
          <input
            id="apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Ej: González Pérez"
            maxLength={60}
            autoComplete="family-name"
          />
        </div>
        <div className="fld">
          <label htmlFor="grupo">Número de grupo</label>
          <input
            id="grupo"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            placeholder="Ej: 301, 402"
            inputMode="numeric"
            maxLength={20}
            autoFocus={returning}
          />
        </div>
        <div className="err">{err}</div>
        <button className="btn" type="submit">
          {returning ? "Guardar y continuar" : "Empezar"} &rarr;
        </button>
      </form>
    </div>
  );
}
