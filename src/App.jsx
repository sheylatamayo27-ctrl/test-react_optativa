import { useEffect, useMemo, useRef, useState } from "react";
import { PASS_CORRECT } from "./data/modules.js";
import { buildExam } from "./data/exam.js";
import { loadState, saveState } from "./lib/storage.js";
import { loadPrefs, savePrefs, applyPrefs } from "./lib/prefs.js";
import { answerInfo } from "./lib/util.js";
import { applyAnswer, grade, restorePosition, validQuestion, resumeMessage } from "./lib/progress.js";
import { useOnline } from "./lib/useOnline.js";
import { moduleStats } from "./components/ModuleView.jsx";
import PwaStatus from "./components/PwaStatus.jsx";
import NameGate from "./components/NameGate.jsx";
import Home from "./components/Home.jsx";
import ModuleView from "./components/ModuleView.jsx";
import Results from "./components/Results.jsx";
import Settings from "./components/Settings.jsx";

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState("gate"); // gate | home | module | results
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [seed, setSeed] = useState(1);
  const [mi, setMi] = useState(0);
  const [tab, setTab] = useState("lesson");
  const [answers, setAnswers] = useState({});
  const [hints, setHints] = useState({});
  const [qpos, setQpos] = useState({}); // pregunta actual de cada módulo: { m1: 2, ... }
  const [attempt, setAttempt] = useState(1); // número de intento
  const [best, setBest] = useState(null); // mejor intento aprobado: { pct, correct, total, date, attempt }
  // Preguntas de este intento: una versión de cada hueco, según la semilla
  const exam = useMemo(() => buildExam(seed), [seed]);
  const [prefs, setPrefs] = useState(loadPrefs);
  const online = useOnline();

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const toastT = useRef(null);
  function toast(msg, ms = 1800) {
    setToastMsg(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg(""), ms);
  }

  // Avisar cuando se pierde o recupera la conexión (no al cargar)
  const firstOnline = useRef(true);
  useEffect(() => {
    if (firstOnline.current) {
      firstOnline.current = false;
      return;
    }
    toast(online ? "Conexión restablecida" : "Sin conexión: puedes seguir, tu progreso se guarda en este dispositivo", 4000);
  }, [online]);

  // Tema y tamaño de texto
  useEffect(() => {
    applyPrefs(prefs);
    savePrefs(prefs);
  }, [prefs]);

  // Cargar progreso guardado
  useEffect(() => {
    const s = loadState();
    if (s) {
      if (s.name) setName(s.name);
      if (s.group) setGroup(s.group);
      if (s.seed) setSeed(s.seed);
      if (s.answers) setAnswers(s.answers);
      if (s.hints) setHints(s.hints);
      if (s.qpos) setQpos(s.qpos);
      if (s.attempt) setAttempt(s.attempt);
      if (s.best) setBest(s.best);
      // Volver justo donde estaba (tras un apagón, recarga o cierre de pestaña).
      // Progreso de antes de pedir el grupo: se vuelve al registro para completarlo.
      if (s.name && s.group) {
        const saved = buildExam(s.seed || 1);
        const p = restorePosition(s, saved.length);
        setScreen(p.screen);
        setMi(p.mi);
        setTab(p.tab);
        const q = s.qpos ? validQuestion(s.qpos[saved[p.mi].id], saved[p.mi].questions.length) : null;
        const msg = resumeMessage(p, q);
        if (msg) toast(msg, 4000);
      }
    }
    setReady(true);
  }, []);

  // Guardar en cada cambio (incluida la posición): si se va la luz, como mucho se pierde la última acción
  useEffect(() => {
    if (ready && name) saveState({ name, group, seed, answers, hints, qpos, attempt, best, pos: { screen, mi, tab } });
  }, [ready, name, group, seed, answers, hints, qpos, attempt, best, screen, mi, tab]);

  // Al aprobar un intento, se guarda si es el mejor: el certificado usa siempre el mejor aprobado
  useEffect(() => {
    const g = grade(answers, exam, PASS_CORRECT);
    if (g.passed && (!best || g.pct > best.pct))
      setBest({ pct: g.pct, correct: g.correct, total: g.total, date: new Date().toISOString(), attempt });
  }, [answers, exam]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambiar de pantalla o de módulo, empezar arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, mi]);

  function submitName(fullName, grupo) {
    // Semilla para el orden aleatorio de este alumno (se conserva si ya tenía progreso)
    if (!name) setSeed(Math.floor(Math.random() * 1e9) + 1);
    setName(fullName);
    setGroup(grupo);
    setScreen("home");
  }

  function openModule(i) {
    setMi(i);
    setTab("lesson");
    setScreen("module");
  }

  function answer(qid, optId, correct) {
    setAnswers((prev) => applyAnswer(prev, qid, optId, correct));
  }
  function hint(qid) {
    setHints((prev) => ({ ...prev, [qid]: true }));
  }

  function finishModule() {
    if (mi < exam.length - 1) {
      openModule(mi + 1); // el siguiente módulo empieza por su lección
      toast("¡Módulo terminado! Sigue con la lección " + (mi + 2));
    } else {
      setScreen("results");
    }
  }

  // Empezar de cero: nuevas preguntas (otra semilla) y respuestas en blanco. El mejor aprobado se conserva.
  function newAttempt() {
    const ok = window.confirm(
      "¿Empezar el test de nuevo?\n\nSe borrarán las respuestas del intento actual y te saldrán otras preguntas." +
        (best ? "\nTu certificado (" + best.pct + "%) se conserva." : "")
    );
    if (!ok) return;
    setSeed(Math.floor(Math.random() * 1e9) + 1);
    setAnswers({});
    setHints({});
    setQpos({});
    setAttempt((a) => a + 1);
    setMi(0);
    setScreen("home");
    toast("Intento " + (attempt + 1) + ": nuevas preguntas. ¡Suerte!", 3000);
  }

  // Lleva a la primera pregunta sin responder del intento actual.
  function continueExam() {
    const i = exam.findIndex((m) => m.questions.some((q) => !answerInfo(answers[q.id]).answered));
    setMi(i >= 0 ? i : 0);
    setTab("quiz");
    setScreen("module");
  }

  if (!ready) return null;

  const hasUser = !!name && screen !== "gate";
  const ini = (name.trim()[0] || "?").toUpperCase();

  return (
    <>
      <header className="bar">
        <div className="wrap bar-in">
          <button className="brand" onClick={() => hasUser && setScreen("home")}>
            <span className="glyph">⚛</span> React Lab
          </button>
          <div className="spacer" />
          {!online && (
            <span className="net-off" role="status" title="Puedes seguir: tu progreso se guarda en este dispositivo">
              <i /> Sin conexión
            </span>
          )}
          {hasUser && (
            <div className="who">
              <span className="av">{ini}</span>
              <span className="who-name">{name}</span>
              {group && <span className="who-group">{group}</span>}
            </div>
          )}
          {hasUser && (
            <div className="steps">
              {exam.map((m, i) => {
                const st = moduleStats(m, answers);
                const done = st.answered === st.total;
                const active = screen === "module" && mi === i;
                return (
                  <button
                    key={m.id}
                    className={"dot" + (active ? " active" : done ? " done" : "")}
                    onClick={() => openModule(i)}
                    title={m.title}
                  >
                    {m.num}
                  </button>
                );
              })}
              <button
                className={"dot" + (screen === "results" ? " active" : "")}
                onClick={() => setScreen("results")}
                title="Resultados"
              >
                ★
              </button>
            </div>
          )}
          <Settings prefs={prefs} setPrefs={setPrefs} />
        </div>
      </header>

      <main>
        {screen === "gate" && <NameGate onSubmit={submitName} initialName={name} initialGroup={group} />}
        {screen === "home" && (
          <Home
            exam={exam}
            studentName={name}
            group={group}
            answers={answers}
            attempt={attempt}
            best={best}
            onOpenModule={openModule}
            onResults={() => setScreen("results")}
            onRestart={newAttempt}
          />
        )}
        {screen === "module" && (
          <ModuleView
            key={exam[mi].id + "-" + seed}
            module={exam[mi]}
            tab={tab}
            setTab={setTab}
            seed={seed}
            answers={answers}
            hints={hints}
            onAnswer={answer}
            onHint={hint}
            onFinish={finishModule}
            onHome={() => setScreen("home")}
            isLast={mi === exam.length - 1}
            initialQ={validQuestion(qpos[exam[mi].id], exam[mi].questions.length)}
            onQuestion={(i) => setQpos((p) => (p[exam[mi].id] === i ? p : { ...p, [exam[mi].id]: i }))}
          />
        )}
        {screen === "results" && (
          <Results
            exam={exam}
            attempt={attempt}
            best={best}
            onRestart={newAttempt}
            studentName={name}
            group={group}
            answers={answers}
            hints={hints}
            onHome={() => setScreen("home")}
            onContinue={continueExam}
            toast={toast}
          />
        )}
      </main>

      <PwaStatus />
      <div className={"toast" + (toastMsg ? " show" : "")} role="status">{toastMsg}</div>
    </>
  );
}
