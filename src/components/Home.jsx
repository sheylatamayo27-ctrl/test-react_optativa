import { MODULES, totalQuestions, PASS, COURSE } from "../data/modules.js";
import { moduleStats } from "./ModuleView.jsx";

export default function Home({ studentName, group, answers, onOpenModule }) {
  const total = totalQuestions();
  let solved = 0;
  MODULES.forEach((m) => (solved += moduleStats(m, answers).solved));
  // "Continuar" lleva al primer módulo que aún tiene preguntas sin resolver
  const next = MODULES.findIndex((m) => {
    const st = moduleStats(m, answers);
    return st.solved < st.total;
  });

  return (
    <>
      <section className="wrap hero">
        <span className="eyebrow">{COURSE.name} · Evaluación del curso</span>
        <h1>Aprende React y obtén tu certificado.</h1>
        <p className="lead">
          Este test forma parte de la <b>{COURSE.name}</b> que estás cursando. Cada módulo combina una
          lección con ejemplos reales, demos interactivas que puedes tocar y una práctica con
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
            <span>{MODULES.length} módulos</span>
            <span>{total} preguntas</span>
            <span>Aprobado con {PASS}%</span>
          </div>
        </div>
        <div className="hero-cta">
          <button className="btn" onClick={() => onOpenModule(next >= 0 ? next : 0)}>
            {solved > 0 ? "Continuar" : "Empezar"} &rarr;
          </button>
          <span className="pill">◷ ~40–60 min</span>
          <span className="pill">✓ {solved}/{total} resueltas</span>
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
              <b>3. Practica</b>
              <span>  Pistas y  ejemplos aplicados.</span>
            </div>
          </div>
          <div className="how-step">
            <span className="how-ic">🎓</span>
            <div>
              <b>4. Certifícate</b>
              <span>Con {PASS}% o más descargas tu certificado en PDF.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="mod-grid">
          {MODULES.map((m, i) => {
            const st = moduleStats(m, answers);
            const done = st.solved === st.total;
            const pct = Math.round((st.solved / st.total) * 100);
            const chip = done
              ? <span className="chip ok">✓ {st.solved}/{st.total}</span>
              : st.tried > 0
                ? <span className="chip doing">En curso · {st.solved}/{st.total}</span>
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
