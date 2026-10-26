import { useEffect, useMemo, useState } from "react";
import { shuffle, hashStr, answerInfo } from "../lib/util.js";
import { Code, Md, ContextBlock } from "./Bits.jsx";

const PRAISE = ["¡Correcto! Muy bien 🎯", "¡Correcto! Lo tienes claro 🎯", "¡Correcto! Respuesta exacta 🎯"];
const letter = (n) => String.fromCharCode(65 + n);

export default function Question({ q, seed, answer, hintShown, onAnswer, onHint, onReview }) {
  // Opciones en orden aleatorio, estable por alumno (seed) y pregunta.
  const options = useMemo(
    () => shuffle(q.options, hashStr(q.id) + seed),
    [q.id, seed]
  );
  // Opción marcada pero aún no confirmada (la respuesta es definitiva al confirmar).
  const [selected, setSelected] = useState(null);
  const [justAnswered, setJustAnswered] = useState(false);

  const { answered, correct } = answerInfo(answer);
  const chosen = answer ? answer.optId : null;
  const chosenOpt = q.options.find((o) => o.id === chosen);
  const correctOpt = q.options.find((o) => o.correct);
  const correctLetter = letter(options.findIndex((o) => o.correct));
  const praise = PRAISE[hashStr(q.id) % PRAISE.length];

  function confirm() {
    if (answered || !selected) return;
    const o = q.options.find((x) => x.id === selected);
    setJustAnswered(true);
    onAnswer(o.id, !!o.correct);
  }

  // Atajos: A-D / 1-4 marcar, Enter confirmar, H pista
  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || answered) return;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const k = e.key.toLowerCase();
      if (k === "enter" && selected) {
        e.preventDefault();
        confirm();
        return;
      }
      if (k === "h" && q.hint && !hintShown) {
        onHint();
        return;
      }
      let n = "abcdef".indexOf(k);
      if (n < 0) n = "123456".indexOf(k);
      if (n >= 0 && n < options.length) setSelected(options[n].id);
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
        {answered && (
          <span className={"q-result " + (correct ? "ok" : "bad")}>{correct ? "✓ Correcta" : "✕ Incorrecta"}</span>
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

      <div className="opts" role="radiogroup" aria-label="Opciones">
        {options.map((o, n) => {
          let cls = "opt";
          let mark = letter(n);
          if (answered) {
            if (o.correct) {
              cls += " correct" + (justAnswered && o.id === chosen ? " celebrate" : "");
              mark = "✓";
            } else if (o.id === chosen) {
              cls += " wrong" + (justAnswered ? " shake" : "");
              mark = "✕";
            } else cls += " dim";
          } else if (o.id === selected) cls += " selected";
          return (
            <button
              key={o.id}
              className={cls}
              disabled={answered}
              onClick={() => setSelected(o.id)}
              role="radio"
              aria-checked={answered ? o.id === chosen : o.id === selected}
              aria-label={`Opción ${letter(n)}`}
            >
              <span className="mark">{mark}</span>
              <span className="otext">
                {o.code != null ? <Code code={o.code} mini /> : <Md text={o.text} />}
              </span>
            </button>
          );
        })}
      </div>

      {!answered && (
        <div className="q-confirm">
          <button className="btn" disabled={!selected} onClick={confirm}>
            Confirmar respuesta
          </button>
          <span className="faint">
            {selected ? "Revisa tu elección: al confirmar no se puede cambiar." : "Elige una opción. Tienes un solo intento."}
          </span>
          {q.hint && !hintShown && (
            <button className="hint-btn" onClick={onHint}>
              💡 Ver pista
            </button>
          )}
        </div>
      )}

      {!answered && hintShown && q.hint && (
        <div className="hintbox">
          💡 <b>Pista:</b> <Md text={q.hint} as="span" />
        </div>
      )}

      {answered && (
        <div className={"fb " + (correct ? "good" : "bad")}>
          <div className="fb-h">{correct ? "✓ " + praise : "✕ Respuesta incorrecta"}</div>

          {!correct && chosenOpt && (
            <div className="fb-sec">
              <div className="fb-lbl">Por qué tu respuesta no funciona</div>
              <Md text={chosenOpt.feedback} />
            </div>
          )}

          <div className="fb-sec">
            <div className="fb-lbl">
              {correct ? "Por qué es correcta" : `La respuesta correcta era la ${correctLetter}`}
            </div>
            {!correct && (correctOpt.code != null ? <Code code={correctOpt.code} mini /> : <Md text={correctOpt.text} as="b" />)}
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
                    <span className="others-mark">{letter(n)}</span>
                    <div>
                      {o.code != null ? <code className="others-code">{o.code}</code> : <Md text={o.text} as="b" />}
                      <Md text={o.feedback} />
                    </div>
                  </li>
                )
              )}
            </ul>
          </details>

          {!correct && q.ref && (
            <div className="fb-actions">
              <button className="btn sm ghost" onClick={onReview}>
                📘 Repasar este tema en la lección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
