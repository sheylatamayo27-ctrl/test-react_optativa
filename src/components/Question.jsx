import { useEffect, useMemo, useState } from "react";
import { shuffle, hashStr, answerInfo } from "../lib/util.js";
import { Code, Md, ContextBlock } from "./Bits.jsx";

const PRAISE_FIRST = ["¡Excelente, a la primera! 🎯", "¡Perfecto! Lo tienes claro 🎯", "¡Muy bien! Respuesta exacta 🎯"];
const PRAISE_RETRY = ["¡Correcto! Así se aprende 💪", "¡Lo lograste! Bien hecho 💪", "¡Ahora sí! Buen razonamiento 💪"];
const RETRY = ["Aún no, pero vas por buen camino", "Casi… revisa el detalle", "No es esta, inténtalo otra vez"];

export default function Question({ q, seed, answer, hintShown, onAnswer, onHint, onReview }) {
  // Opciones en orden aleatorio, estable por alumno (seed) y pregunta.
  const options = useMemo(
    () => shuffle(q.options, hashStr(q.id) + seed),
    [q.id, seed]
  );
  // Opción elegida en esta visita (para animar), no se guarda.
  const [justPicked, setJustPicked] = useState(null);

  const info = answerInfo(answer);
  const { solved, tried, tries } = info;
  const wrong = new Set(info.wrong);
  if (answer && !answer.solved && answer.optId && !answer.wrong) wrong.add(answer.optId); // progreso antiguo
  const chosen = answer ? answer.optId : null;
  const chosenOpt = q.options.find((o) => o.id === chosen);
  const correctOpt = q.options.find((o) => o.correct);
  const pickPhrase = (list) => list[(hashStr(q.id) + tries) % list.length];

  function pick(o) {
    if (solved || wrong.has(o.id)) return;
    setJustPicked(o.id);
    onAnswer(o.id, !!o.correct);
  }

  // Atajos: A-D / 1-4 elegir, H pista
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (k === "h" && !solved && q.hint && !hintShown) {
        onHint();
        return;
      }
      let n = "abcdef".indexOf(k);
      if (n < 0) n = "123456".indexOf(k);
      if (n >= 0 && n < options.length) pick(options[n]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="card qcard">
      <div className="q-top">
        <span className={"q-kind " + q.type}>
          {q.type === "applied" ? "💻 Ejercicio práctico" : "💡 Concepto"}
        </span>
        <span className="q-topic">{q.topic}</span>
        {tried && (
          <span className={"q-tries" + (solved ? (tries === 1 ? " first" : " ok") : "")}>
            {solved ? (tries === 1 ? "1er intento" : `${tries} intentos`) : `Intento ${tries}`}
          </span>
        )}
      </div>
      <Md text={q.prompt} as="div" className="q-prompt" />

      {q.context && (
        <div className="q-ctx">
          {q.context.map((b, i) => (
            <ContextBlock key={i} b={b} />
          ))}
        </div>
      )}

      <div className="opts">
        {options.map((o, n) => {
          let cls = "opt";
          let mark = String.fromCharCode(65 + n);
          const isWrong = wrong.has(o.id);
          if (solved) {
            if (o.correct) {
              cls += " correct" + (justPicked === o.id ? " celebrate" : "");
              mark = "✓";
            } else if (isWrong) {
              cls += " wrong dim";
              mark = "✕";
            } else cls += " dim";
          } else if (isWrong) {
            cls += " wrong" + (justPicked === o.id ? " shake" : "");
            mark = "✕";
          }
          return (
            <button
              key={o.id}
              className={cls}
              disabled={solved || isWrong}
              onClick={() => pick(o)}
              aria-label={`Opción ${String.fromCharCode(65 + n)}`}
            >
              <span className="mark">{mark}</span>
              <span className="otext">
                {o.code != null ? <Code code={o.code} mini /> : <Md text={o.text} />}
              </span>
            </button>
          );
        })}
      </div>

      {solved && (
        <div className="fb good" key={"ok" + tries}>
          <div className="fb-h">✓ {tries === 1 ? pickPhrase(PRAISE_FIRST) : pickPhrase(PRAISE_RETRY)}</div>
          <div className="fb-sec">
            <div className="fb-lbl">Por qué es correcta</div>
            <Md text={correctOpt.feedback} />
          </div>
          {q.example && (
            <div className="fb-sec">
              <div className="fb-lbl">🛠 {q.example.title || "Así se aplica en un proyecto real"}</div>
              <Code code={q.example.code} mini />
              {q.example.note && <Md text={q.example.note} className="fb-note" />}
            </div>
          )}
          <div className="fb-sec takeaway">
            <div className="fb-lbl">📌 Para recordar</div>
            <Md text={q.teach} />
          </div>
          <details className="fb-sec others">
            <summary>🔍 ¿Por qué las otras opciones son incorrectas?</summary>
            <ul>
              {options.map((o, n) =>
                o.correct ? null : (
                  <li key={o.id}>
                    <span className="others-mark">{String.fromCharCode(65 + n)}</span>
                    <div>
                      {o.code != null ? <code className="others-code">{o.code}</code> : <Md text={o.text} as="b" />}
                      <Md text={o.feedback} />
                    </div>
                  </li>
                )
              )}
            </ul>
          </details>
        </div>
      )}

      {tried && !solved && (
        <div className="fb bad" key={"bad" + tries}>
          <div className="fb-h">✕ {pickPhrase(RETRY)}</div>
          {chosenOpt && (
            <div className="fb-sec">
              <div className="fb-lbl">Por qué esa opción no funciona</div>
              <Md text={chosenOpt.feedback} />
            </div>
          )}
          <div className="fb-actions">
            {q.ref && (
              <button className="btn sm ghost" onClick={onReview}>
                📘 Repasar en la lección
              </button>
            )}
            {q.hint && !hintShown && (
              <button className={"hint-btn" + (tries >= 2 ? " pulse" : "")} onClick={onHint}>
                💡 {tries >= 2 ? "¿Te ayudo? Ver pista" : "Ver pista"}
              </button>
            )}
          </div>
        </div>
      )}

      {!solved && hintShown && q.hint && (
        <div className="hintbox">
          💡 <b>Pista:</b> <Md text={q.hint} as="span" />
        </div>
      )}

      {!tried && q.hint && !hintShown && (
        <button className="hint-btn" onClick={onHint}>
          💡 Ver pista
        </button>
      )}
    </div>
  );
}
