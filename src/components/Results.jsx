import { useState } from "react";
import { MODULES, PASS_CORRECT, COURSE } from "../data/modules.js";
import { grade } from "../lib/progress.js";
import { moduleStats } from "./ModuleView.jsx";
import { Code, Md } from "./Bits.jsx";
import { generarCertificado, certCode } from "../lib/certificate.js";

function Ring({ pct, passed }) {
  const r = 66, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  const col = !passed ? "var(--bad)" : pct >= 85 ? "var(--ok)" : "var(--accent)";
  return (
    <div className="score-ring">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
        <circle cx="75" cy="75" r={r} fill="none" stroke={col} strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <div className="val">
        <b>{pct}%</b>
        <span>NOTA</span>
      </div>
    </div>
  );
}

export default function Results({ studentName, group, answers, hints, onHome, onContinue, toast }) {
  const g = grade(answers, MODULES, PASS_CORRECT);
  const hintCount = Object.keys(hints || {}).length;
  const [code] = useState(() => certCode(studentName));

  // Aún no ha terminado: no hay nota hasta responder las 20
  if (!g.complete)
    return (
      <section className="wrap res-head">
        <span className="eyebrow">Evaluación en curso</span>
        <h1>Aún no has terminado</h1>
        <p className="verdict">
          Has respondido <b>{g.answered} de {g.total}</b> preguntas. Tu nota aparecerá cuando respondas todas.
        </p>
        <div className="res-mods">
          {MODULES.map((m) => {
            const st = moduleStats(m, answers);
            return (
              <div className="card res-mod" key={m.id}>
                <div className="n">MÓDULO 0{m.num}</div>
                <h4>{m.title}</h4>
                <div className="sc">
                  {st.answered}
                  <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>/{st.total} respondidas</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="res-foot">
          <button className="btn" onClick={onContinue}>Continuar la evaluación &rarr;</button>
        </div>
      </section>
    );

  const failed = [];
  MODULES.forEach((m) =>
    m.questions.forEach((q) => {
      const a = answers[q.id];
      if (a && !a.correct) failed.push({ m, q, chosen: q.options.find((o) => o.id === a.optId) });
    })
  );

  function descargar() {
    try {
      generarCertificado({ nombre: studentName, grupo: group, curso: COURSE.name, puntaje: g.pct });
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
        <Ring pct={g.pct} passed={g.passed} />
        <div style={{ margin: "2px 0 6px" }}>
          <span className={"badge " + (g.passed ? "ok" : "fail")}>
            {g.passed ? "✓ Aprobado" : "✕ No aprobado"}
          </span>
        </div>
        <p className="verdict">
          {g.passed
            ? `¡Felicidades! Acertaste ${g.correct} de ${g.total} preguntas. Descarga tu certificado abajo.`
            : `Acertaste ${g.correct} de ${g.total} preguntas. Para aprobar hacían falta ${g.need}. Revisa abajo las explicaciones de tus errores: te servirán para seguir aprendiendo.`}
        </p>

        <div className="res-stats">
          <div className="card stat">
            <b>{g.correct}/{g.total}</b>
            <span>correctas</span>
          </div>
          <div className="card stat">
            <b>{g.wrong}</b>
            <span>incorrectas</span>
          </div>
          <div className="card stat">
            <b>{g.need}</b>
            <span>necesarias para aprobar</span>
          </div>
          <div className="card stat">
            <b>{hintCount}</b>
            <span>pistas usadas</span>
          </div>
        </div>

        <div className="res-mods">
          {MODULES.map((m) => {
            const st = moduleStats(m, answers);
            const p = Math.round((st.correct / st.total) * 100);
            const col = p >= 80 ? "var(--ok)" : p >= 60 ? "var(--accent)" : "var(--warn)";
            const level = p >= 80 ? "Dominado" : p >= 60 ? "Bien" : "Reforzar";
            return (
              <div className="card res-mod" key={m.id}>
                <div className="n">MÓDULO 0{m.num}</div>
                <h4>{m.title}</h4>
                <div className="sc">
                  {st.correct}
                  <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>/{st.total}</span>
                </div>
                <div className="meter">
                  <i style={{ width: p + "%", background: col }} />
                </div>
                <div className="res-mod-f">
                  <span>{st.correct * 5} de 25 pts</span>
                  <span className={"lvl " + level.toLowerCase()}>{level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {failed.length > 0 && (
        <section className="wrap">
          <div className="card review">
            <h3>📌 Repaso de tus errores</h3>
            <p className="muted" style={{ marginBottom: 12, fontSize: ".92rem" }}>
              Estas son las preguntas que fallaste, con la respuesta correcta y la idea clave para tenerla en cuenta la próxima vez.
            </p>
            <div className="mistakes">
              {failed.map(({ m, q, chosen }) => {
                const ok = q.options.find((o) => o.correct);
                return (
                  <div className="mistake" key={q.id}>
                    <div className="mistake-h">
                      <span className="chip todo">M0{m.num}</span> <b>{q.topic}</b>
                    </div>
                    <div className="mistake-row bad">
                      <span className="lbl">Tu respuesta</span>
                      {chosen.code != null ? <Code code={chosen.code} mini /> : <Md text={chosen.text} as="span" />}
                    </div>
                    <div className="mistake-row ok">
                      <span className="lbl">Correcta</span>
                      {ok.code != null ? <Code code={ok.code} mini /> : <Md text={ok.text} as="span" />}
                    </div>
                    <Md text={"📌 " + q.teach} className="mistake-teach" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {g.passed && (
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
                  <span>Calificación: {g.pct}%</span>
                  <span>Fecha: {fecha}</span>
                  <span>Código: {code}</span>
                </div>
              </div>
            </div>
            <div className="cert-actions">
              <button className="btn big" onClick={descargar}>⬇ Descargar certificado PDF</button>
            </div>
            <p className="muted" style={{ fontSize: ".85rem", textAlign: "center", maxWidth: "60ch" }}>
              El certificado se descarga como PDF con tu nombre, tu grupo, tu calificación y un código de verificación.
            </p>
          </div>
        </section>
      )}

      {!g.passed && (
        <section className="wrap">
          <div className="card review no-cert">
            <h3>🔒 Sin certificado</h3>
            <p>
              El certificado se obtiene con al menos <b>{g.need} de {g.total}</b> respuestas correctas ({g.need * 5}%).
              La evaluación tiene un solo intento, así que tu resultado queda registrado. Repasa las lecciones y las
              explicaciones de arriba: es lo más útil para lo que viene en la optativa.
            </p>
          </div>
        </section>
      )}

      <div className="wrap res-foot">
        <button className="btn ghost" onClick={onHome}>&larr; Volver al inicio</button>
      </div>
    </>
  );
}
