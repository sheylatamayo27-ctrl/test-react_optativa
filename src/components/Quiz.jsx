import { useEffect } from "react";
import { answerInfo } from "../lib/util.js";
import { moduleStats } from "./ModuleView.jsx";
import Question from "./Question.jsx";

function segClass(a) {
  if (a.firstTry) return " first";
  if (a.solved) return " solved";
  if (a.tried) return " tried";
  return "";
}

function ModuleDone({ module, answers, hints, isLast, onFinish }) {
  const st = moduleStats(module, answers);
  const used = module.questions.filter((q) => hints[q.id]).length;
  const rate = Math.round((st.firstTry / st.total) * 100);
  const msg =
    rate === 100
      ? "¡Perfecto! Todas al primer intento. Dominas este tema."
      : rate >= 70
      ? "¡Muy bien! Tienes una base sólida; revisa las que te costaron para afianzarlas."
      : rate >= 40
      ? "Buen trabajo terminando el módulo. Te recomendamos repasar la lección antes de seguir."
      : "Lo lograste, pero este tema aún cuesta. Repasa la lección y las demos: te ayudarán a fijar los conceptos.";
  return (
    <div className="card done-card">
      <div className="done-h">🎉 ¡Módulo {module.num} completado!</div>
      <p className="muted">{msg}</p>
      <div className="done-stats">
        <div><b>{st.firstTry}/{st.total}</b><span>al primer intento</span></div>
        <div><b>{st.tries}</b><span>intentos en total</span></div>
        <div><b>{used}</b><span>pistas usadas</span></div>
      </div>
      <button className="btn" onClick={onFinish}>
        {isLast ? "Ver mis resultados ✓" : "Continuar con el módulo " + (module.num + 1) + " →"}
      </button>
    </div>
  );
}

export default function Quiz({
  module, order, idx, setIdx, seed, answers, hints, onAnswer, onHint, onFinish, onReview, isLast,
}) {
  const i = Math.min(idx, order.length - 1);
  const q = order[i];

  const solvedCount = order.filter((qq) => answerInfo(answers[qq.id]).solved).length;
  const tried = !!answers[q.id];
  const allSolved = solvedCount === order.length;
  // Se puede saltar a cualquier pregunta ya intentada o a la primera sin intentar.
  const firstUntried = order.findIndex((qq) => !answers[qq.id]);
  const reach = firstUntried === -1 ? order.length - 1 : firstUntried;

  const canNext = i < order.length - 1 && tried;
  const pendingOther = order.findIndex((qq, j) => j !== i && !answerInfo(answers[qq.id]).solved);

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
          {solvedCount}/{order.length} ✓
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
        {i < order.length - 1 ? (
          <button className="btn" disabled={!tried} onClick={() => setIdx(i + 1)} title={!tried ? "Responde para continuar" : undefined}>
            Siguiente &rarr;
          </button>
        ) : !allSolved ? (
          <button className="btn" disabled={!tried || pendingOther < 0} onClick={() => setIdx(pendingOther)}>
            Ir a la pendiente &rarr;
          </button>
        ) : null}
      </div>

      {!allSolved && i === order.length - 1 && tried && (
        <p className="q-legend faint">
          Para cerrar el módulo debes acertar todas las preguntas. Las pendientes aparecen en rojo en la barra superior.
        </p>
      )}

      {allSolved && (
        <ModuleDone module={module} answers={answers} hints={hints} isLast={isLast} onFinish={onFinish} />
      )}
    </div>
  );
}
