import { useEffect, useMemo, useState } from "react";
import { shuffle, hashStr, answerInfo } from "../lib/util.js";
import Lesson from "./Lesson.jsx";
import Quiz from "./Quiz.jsx";

export default function ModuleView({
  module, tab, setTab, seed, answers, hints, onAnswer, onHint, onFinish, onHome, isLast,
  initialQ, onQuestion,
}) {
  const stats = moduleStats(module, answers);

  // Orden de preguntas aleatorio (varía por alumno gracias al seed).
  const order = useMemo(
    () => shuffle(module.questions, hashStr(module.id) + seed),
    [module.id, seed]
  );
  // La pregunta actual vive aquí para no perderla al ir a repasar la lección.
  // Si hay una guardada (apagón, recarga…), se retoma; si no, la primera sin resolver.
  const [qIdx, setQIdx] = useState(() => {
    if (initialQ != null) return initialQ;
    const f = order.findIndex((q) => !answerInfo(answers[q.id]).solved);
    return f >= 0 ? f : 0;
  });
  useEffect(() => {
    if (onQuestion) onQuestion(qIdx);
  }, [qIdx]); // eslint-disable-line react-hooks/exhaustive-deps
  // Sección de la lección a la que saltar desde una pregunta.
  const [focus, setFocus] = useState(null);

  useEffect(() => {
    if (!(tab === "lesson" && focus)) window.scrollTo(0, 0);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  function review(ref) {
    setFocus(ref || null);
    setTab("lesson");
  }
  function goQuiz() {
    setFocus(null);
    setTab("quiz");
  }

  return (
    <>
      <section className="wrap m-head">
        <span className="eyebrow">Módulo 0{module.num}</span>
        <h1>{module.title}</h1>
        <div className="sub">{module.sub}</div>
        <div className="tabs">
          <button className={"tab" + (tab === "lesson" ? " active" : "")} onClick={() => review(null)}>
            📘 Lección
          </button>
          <button className={"tab" + (tab === "quiz" ? " active" : "")} onClick={goQuiz}>
            ✍ Práctica <span className="mini">{stats.solved}/{stats.total}</span>
          </button>
        </div>
      </section>

      {tab === "lesson" ? (
        <Lesson module={module} focus={focus} onHome={onHome} onQuiz={goQuiz} />
      ) : (
        <Quiz
          module={module}
          order={order}
          idx={qIdx}
          setIdx={setQIdx}
          seed={seed}
          answers={answers}
          hints={hints}
          onAnswer={onAnswer}
          onHint={onHint}
          onFinish={onFinish}
          onReview={review}
          isLast={isLast}
        />
      )}
    </>
  );
}

export function moduleStats(module, answers) {
  let solved = 0, firstTry = 0, tried = 0, tries = 0;
  module.questions.forEach((q) => {
    const a = answerInfo(answers[q.id]);
    if (a.tried) tried++;
    if (a.solved) solved++;
    if (a.firstTry) firstTry++;
    tries += a.tries;
  });
  return { solved, firstTry, tried, tries, total: module.questions.length };
}
