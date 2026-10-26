import { useEffect } from "react";
import { answerInfo } from "../lib/util.js";
import { moduleStats } from "./ModuleView.jsx";
import Question from "./Question.jsx";

function segClass(a) {
  if (!a.answered) return "";
  return a.correct ? " ok" : " bad";
}

function ModuleDone({ module, answers, hints, isLast, onFinish }) {
  const st = moduleStats(module, answers);
  const used = module.questions.filter((q) => hints[q.id]).length;
  const msg =
    st.correct === st.total
      ? "¡Perfecto! Todas correctas. Dominas este tema."
      : st.correct >= 4
      ? "¡Muy bien! Tienes una base sólida. Revisa la explicación de la que fallaste."
      : st.correct >= 3
      ? "Bien. Repasa las explicaciones de las que fallaste para afianzar el tema."
      : "Este tema aún cuesta. Lee las explicaciones de tus errores y repasa la lección: te servirá para lo que viene.";
  return (
    <div className="card done-card">
      <div className="done-h">🎉 ¡Módulo {module.num} terminado!</div>
      <p className="muted">{msg}</p>
      <div className="done-stats">
        <div><b>{st.correct}/{st.total}</b><span>correctas</span></div>
        <div><b>{st.correct * 5}%</b><span>aporta a tu nota</span></div>
        <div><b>{used}</b><span>pistas usadas</span></div>
      </div>
      <button className="btn" onClick={onFinish}>
        {isLast ? "Ver mi resultado final ✓" : "Continuar con el módulo " + (module.num + 1) + " →"}
      </button>
    </div>
  );
}

export default function Quiz({
  module, order, idx, setIdx, seed, answers, hints, onAnswer, onHint, onFinish, onReview, isLast,
}) {
  const i = Math.min(idx, order.length - 1);
  const q = order[i];

  const answeredCount = order.filter((qq) => answers[qq.id]).length;
  const answered = !!answers[q.id];
  const allAnswered = answeredCount === order.length;
  // Se puede volver a cualquier pregunta ya respondida (solo para revisarla) o ir a la primera sin responder.
  const firstPending = order.findIndex((qq) => !answers[qq.id]);
  const reach = firstPending === -1 ? order.length - 1 : firstPending;
  const canNext = i < order.length - 1 && answered;

  // Navegación con flechas del teclado
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight" && canNext) setIdx(i + 1);
      if (e.key === "ArrowLeft" && i > 0) setIdx(i - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, canNext, setIdx]);

  return (
    <div className="wrap quiz">
      <div className="q-progress">
        <span className="lbl">
          Pregunta {i + 1} de {order.length}
        </span>
        <div className="segs" role="list">
          {order.map((qq, j) => (
            <button
              key={qq.id}
              role="listitem"
              className={"seg-q" + segClass(answerInfo(answers[qq.id])) + (j === i ? " cur" : "")}
              disabled={j > reach}
              onClick={() => setIdx(j)}
              title={`Pregunta ${j + 1}: ${qq.topic}`}
              aria-label={`Ir a la pregunta ${j + 1}`}
            />
          ))}
        </div>
        <span className="lbl">
          {answeredCount}/{order.length} respondidas
        </span>
      </div>

      <Question
        key={q.id}
        q={q}
        seed={seed}
        answer={answers[q.id]}
        hintShown={!!hints[q.id]}
        onAnswer={(optId, correct) => onAnswer(q.id, optId, correct)}
        onHint={() => onHint(q.id)}
        onReview={() => onReview(q.ref)}
      />

      <div className="q-nav">
        <button className="btn ghost" disabled={i === 0} onClick={() => setIdx(i - 1)}>
          &larr; Anterior
        </button>
        {i < order.length - 1 && (
          <button className="btn" disabled={!answered} onClick={() => setIdx(i + 1)} title={!answered ? "Responde para continuar" : undefined}>
            Siguiente &rarr;
          </button>
        )}
      </div>

      {allAnswered && (
        <ModuleDone module={module} answers={answers} hints={hints} isLast={isLast} onFinish={onFinish} />
      )}
    </div>
  );
}
