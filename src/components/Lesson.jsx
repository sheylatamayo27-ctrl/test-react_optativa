import { useEffect } from "react";
import { LessonBlock } from "./Bits.jsx";
import { DEMOS } from "./Demos.jsx";

function scrollToSection(id, smooth = true) {
  const el = document.getElementById("sec-" + id);
  if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

export default function Lesson({ module, focus, onHome, onQuiz }) {
  const sections = module.lesson.filter((b) => b.h && b.id);
  const focusTitle = focus && (sections.find((s) => s.id === focus) || {}).h;

  // Al venir desde una pregunta ("Repasar en la lección"), saltar a la sección indicada.
  useEffect(() => {
    if (focus) scrollToSection(focus);
  }, [focus]);

  return (
    <div className="wrap lesson">
      {focusTitle && (
        <div className="review-banner">
          <span>
            📘 Repasando: <b>{focusTitle}</b>
          </span>
          <button className="btn sm" onClick={onQuiz}>
            Volver a la pregunta &rarr;
          </button>
        </div>
      )}

      {sections.length > 2 && (
        <nav className="toc" aria-label="En esta lección">
          <span className="toc-lbl">En esta lección</span>
          {sections.map((s, i) => (
            <button key={s.id} className="toc-item" onClick={() => scrollToSection(s.id)}>
              <span className="n">{i + 1}</span> {s.h}
            </button>
          ))}
        </nav>
      )}

      {module.lesson.map((b, i) => {
        if (b.demo) {
          const Demo = DEMOS[b.demo];
          return Demo ? <Demo key={i} /> : null;
        }
        return <LessonBlock key={i} b={b} focus={focus} />;
      })}

      <div className="lesson-foot">
        <button className="btn ghost" onClick={onHome}>
          &larr; Módulos
        </button>
        <button className="btn" onClick={onQuiz}>
          {focusTitle ? "Volver a la pregunta" : "Ir a la evaluación"} &rarr;
        </button>
      </div>
    </div>
  );
}
