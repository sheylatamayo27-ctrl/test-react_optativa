import { useState } from "react";
import { MODULES, totalQuestions, PASS, COURSE } from "../data/modules.js";
import { answerInfo } from "../lib/util.js";
import { moduleStats } from "./ModuleView.jsx";
import { Md } from "./Bits.jsx";
import { generarCertificado, certCode } from "../lib/certificate.js";

function Ring({ pct }) {
  const r = 66, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  const col = pct >= 85 ? "var(--ok)" : pct >= PASS ? "var(--accent)" : "var(--warn)";
  return (
    <div className="score-ring">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
        <circle cx="75" cy="75" r={r} fill="none" stroke={col} strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="val">
        <b>{pct}%</b>
        <span>PUNTAJE</span>
      </div>
    </div>
  );
}

export default function Results({ studentName, group, answers, hints, onHome, onFix, onReset, toast }) {
  const total = totalQuestions();
  let correct = 0, firstTry = 0, tries = 0;
  MODULES.forEach((m) => {
    const st = moduleStats(m, answers);
    correct += st.solved;
    firstTry += st.firstTry;
    tries += st.tries;
  });
  const pct = Math.round((correct / total) * 100);
  const firstPct = Math.round((firstTry / total) * 100);
  const passed = pct >= PASS;
  const need = Math.ceil((PASS / 100) * total);
  const hintCount = Object.keys(hints || {}).length;

  const pending = [];
  const toReview = []; // resueltas, pero no al primer intento
  MODULES.forEach((m) =>
    m.questions.forEach((q) => {
      const a = answerInfo(answers[q.id]);
      if (!a.solved) pending.push({ m, q });
      else if (!a.firstTry) toReview.push({ m, q, tries: a.tries });
    })
  );

  const [code] = useState(() => certCode(studentName));

  function descargar() {
    try {
      generarCertificado({ nombre: studentName, grupo: group, curso: COURSE.name, puntaje: pct });
      toast && toast("Certificado PDF descargado");
    } catch (e) {
      toast && toast("No se pudo generar el PDF");
    }
  }

  const fecha = new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <section className="wrap res-head">
        <span className="eyebrow">Evaluación completada</span>
        <h1>Tu resultado</h1>
        <Ring pct={pct} />
        <div style={{ margin: "2px 0 6px" }}>
          <span className={"badge " + (passed ? "ok" : "low")}>
            {passed ? "✓ Aprobado" : "🔒 No aprobado · necesitas " + PASS + "%"}
          </span>
        </div>
        <p className="verdict">
          {passed
            ? "¡Felicidades, has aprobado! Descarga tu certificado abajo."
            : `Aún no llegas a ${PASS}%. Corrige las preguntas pendientes (puedes usar las pistas 💡) para aprobar y desbloquear tu certificado.`}
        </p>

        <div className="res-stats">
          <div className="card stat">
            <b>{correct}/{total}</b>
            <span>preguntas resueltas</span>
          </div>
          <div className="card stat">
            <b>{firstPct}%</b>
            <span>acierto al primer intento</span>
          </div>
          <div className="card stat">
            <b>{tries}</b>
            <span>intentos en total</span>
          </div>
          <div className="card stat">
            <b>{hintCount}</b>
            <span>pistas usadas</span>
          </div>
        </div>

        <div className="res-mods">
          {MODULES.map((m) => {
            const st = moduleStats(m, answers);
            const p = Math.round((st.solved / st.total) * 100);
            const fp = Math.round((st.firstTry / st.total) * 100);
            const col = p >= 85 ? "var(--ok)" : p >= PASS ? "var(--accent)" : "var(--warn)";
            const level = st.solved < st.total ? "Pendiente" : fp >= 75 ? "Dominado" : fp >= 50 ? "Bien" : "Reforzar";
            return (
              <div className="card res-mod" key={m.id}>
                <div className="n">MÓDULO 0{m.num}</div>
                <h4>{m.title}</h4>
                <div className="sc">
                  {st.solved}
                  <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>/{st.total}</span>
                </div>
                <div className="meter">
                  <i style={{ width: p + "%", background: col }} />
                </div>
                <div className="res-mod-f">
                  <span>1er intento: {st.firstTry}/{st.total}</span>
                  <span className={"lvl " + level.toLowerCase()}>{level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {!passed && (
        <section className="wrap">
          <div className="card review" style={{ borderLeft: "4px solid var(--warn)" }}>
            <h3>🔒 Aún no apruebas</h3>
            <p>
              Tu puntaje es <b>{pct}%</b>. Necesitas <b>{PASS}%</b> (unas <b>{need} de {total}</b> correctas)
              para descargar tu certificado. Corrige las pendientes — puedes usar las <b>pistas 💡</b>.
            </p>
            <div style={{ marginTop: 14 }}>
              <button className="btn" onClick={onFix}>↻ Corregir mis respuestas</button>
            </div>
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section className="wrap">
          <div className="card review">
            <h3>📌 {passed ? "Pendientes (opcional)" : "Pendientes por corregir"}</h3>
            <ul>
              {pending.map(({ m, q }) => (
                <li key={q.id}>
                  <b>M0{m.num} · {q.topic}</b> — <Md text={q.teach} as="span" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {toReview.length > 0 && (
        <section className="wrap">
          <div className="card review">
            <h3>🔁 Temas para reforzar</h3>
            <p className="muted" style={{ marginBottom: 10, fontSize: ".92rem" }}>
              Los resolviste, pero te costaron más de un intento. Un repaso rápido de estas ideas te dará más seguridad:
            </p>
            <ul>
              {toReview.map(({ m, q, tries: t }) => (
                <li key={q.id}>
                  <b>M0{m.num} · {q.topic}</b> <span className="faint">({t} intentos)</span> — <Md text={q.teach} as="span" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {passed && (
        <section className="wrap">
          <div className="cert-wrap">
            <div className="cert-preview" aria-label="Vista previa del certificado">
              <div className="cert-inner">
                <div className="cert-eyebrow">React Lab · {COURSE.name}</div>
                <div className="cert-title">Certificado de Aprobación</div>
                <div className="cert-sub">Se otorga el presente certificado a</div>
                <div className="cert-name">{studentName}</div>
                <div className="cert-line" />
                {group && <div className="cert-group">Grupo {group}</div>}
                <div className="cert-felic">¡Felicidades, has aprobado el cuestionario!</div>
                <div className="cert-seal">APROBADO<br />React Lab</div>
                <div className="cert-meta">
                  <span>Calificación: {pct}%</span>
                  <span>Fecha: {fecha}</span>
                  <span>Código: {code}</span>
                </div>
              </div>
            </div>
            <div className="cert-actions">
              <button className="btn big" onClick={descargar}>⬇ Descargar certificado PDF</button>
              <button className="btn ghost" onClick={onHome}>Volver al inicio</button>
            </div>
            <p className="muted" style={{ fontSize: ".85rem", textAlign: "center", maxWidth: "60ch" }}>
              El certificado se descarga como PDF con tu nombre, tu calificación y un código de verificación.
            </p>
          </div>
        </section>
      )}

      <div className="wrap res-foot">
        <button className="btn ghost" onClick={onHome}>&larr; Volver al inicio</button>
        <button className="btn ghost" onClick={onReset}>Reiniciar y repetir</button>
      </div>
    </>
  );
}
