import { PASS_CORRECT, COURSE } from "../data/modules.js";
import { examTotal } from "../data/exam.js";
import { moduleStats } from "./ModuleView.jsx";

export default function Home({ exam, studentName, group, answers, attempt, best, onOpenModule, onResults, onRestart }) {
  const total = examTotal(exam);
  let answered = 0;
  exam.forEach((m) => (answered += moduleStats(m, answers).answered));
  const finished = answered === total;
  // "Continuar" lleva al primer módulo que aún tiene preguntas sin responder
  const next = exam.findIndex((m) => {
    const st = moduleStats(m, answers);
    return st.answered < st.total;
  });

  return (
    <>
      <section className="wrap hero">
        <span className="eyebrow">{COURSE.name} · Evaluación del curso</span>
        <h1>Aprende React y obtén tu certificado.</h1>
        <p className="lead">
          Este test forma parte de la <b>{COURSE.name}</b> que estás cursando. Cada módulo combina una
          lección con ejemplos reales, demos interactivas que puedes tocar y una evaluación con
          explicación detallada en cada respuesta.
        </p>
        <div className="course-card">
          <span className="course-ic">🎓</span>
          <div className="course-info">
            <span className="course-lbl">{COURSE.kind}</span>
            <b>{COURSE.name}</b>
            <span className="muted">
              {studentName}
              {group && <> · Grupo <b className="course-group">{group}</b></>}
            </span>
          </div>
          <div className="course-meta">
            <span>{exam.length} módulos</span>
            <span>{total} preguntas</span>
            <span>Aprobado con {PASS_CORRECT} correctas</span>
          </div>
        </div>
        {best && (
          <div className="best-card">
            <span>🎓</span>
            <div>
              <b>Ya aprobaste con {best.pct}%</b> (intento {best.attempt}). Tu certificado está disponible.
            </div>
            <button className="btn sm" onClick={onResults}>Ver certificado</button>
          </div>
        )}
        <div className="hero-cta">
          {finished ? (
            <button className="btn" onClick={onResults}>Ver mi resultado &rarr;</button>
          ) : (
            <button className="btn" onClick={() => onOpenModule(next >= 0 ? next : 0)}>
              {answered > 0 ? "Continuar" : "Empezar"} &rarr;
            </button>
          )}
          <span className="pill">Intento {attempt}</span>
          <span className="pill">✓ {answered}/{total} respondidas</span>
          {answered > 0 && (
            <button className="btn ghost sm" onClick={onRestart}>↻ Empezar de nuevo</button>
          )}
        </div>
      </section>

      <section className="wrap">
        <div className="how">
          <div className="how-step">
            <span className="how-ic">📘</span>
            <div>
              <b>1. Estudia</b>
              <span>Lecciones con analogías, comparaciones y ejemplos completos.</span>
            </div>
          </div>
          <div className="how-step">
            <span className="how-ic">▶</span>
            <div>
              <b>2. Experimenta</b>
              <span>Demos en vivo para ver cada concepto funcionando antes de responder.</span>
            </div>
          </div>
          <div className="how-step">
            <span className="how-ic">✍</span>
            <div>
              <b>3. Responde</b>
              <span>Un intento por pregunta, con pistas y la explicación de cada respuesta.</span>
            </div>
          </div>
          <div className="how-step">
            <span className="how-ic">🎓</span>
            <div>
              <b>4. Certifícate</b>
              <span>Con {PASS_CORRECT} de {total} correctas descargas tu certificado en PDF.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="mod-grid">
          {exam.map((m, i) => {
            const st = moduleStats(m, answers);
            const done = st.answered === st.total;
            const pct = Math.round((st.answered / st.total) * 100);
            const chip = done
              ? <span className="chip ok">✓ Terminado · {st.correct}/{st.total}</span>
              : st.answered > 0
                ? <span className="chip doing">En curso · {st.answered}/{st.total}</span>
                : <span className="chip todo">Pendiente</span>;
            return (
              <button className="card mod-card" key={m.id} onClick={() => onOpenModule(i)}>
                <div className="top">
                  <span className="mod-num">0{m.num}</span>
                  {chip}
                </div>
                <h3>{m.title}</h3>
                <div className="sub">{m.sub}</div>
                <div className="desc">{m.desc}</div>
                <div className="mod-bar">
                  <i style={{ width: pct + "%" }} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
