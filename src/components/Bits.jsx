import { highlight, inlineMd } from "../lib/util.js";

export function Code({ code, mini }) {
  return (
    <pre className={"code" + (mini ? " mini" : "")}>
      <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </pre>
  );
}

export function Md({ text, as = "p", className }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: inlineMd(text) }} />;
}

function MdList({ items, ordered }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag>
      {items.map((x, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(x) }} />
      ))}
    </Tag>
  );
}

// Renderiza un bloque de lección
export function LessonBlock({ b, focus }) {
  if (b.h)
    return (
      <h2 id={b.id ? "sec-" + b.id : undefined} className={focus && focus === b.id ? "flash" : undefined}>
        {b.h}
      </h2>
    );
  if (b.p) return <Md text={b.p} />;
  if (b.code)
    return b.file ? (
      <div className="ex">
        <div className="ex-h">📄 <b>{b.file}</b></div>
        <Code code={b.code} />
      </div>
    ) : (
      <Code code={b.code} />
    );
  if (b.ul) return <MdList items={b.ul} />;
  if (b.goals)
    return (
      <div className="goals">
        <div className="goals-h">🎯 Al terminar esta lección podrás</div>
        <MdList items={b.goals} />
      </div>
    );
  if (b.steps)
    return (
      <ol className="steps-list">
        {b.steps.map((x, i) => (
          <li key={i}>
            <span className="n">{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: inlineMd(x) }} />
          </li>
        ))}
      </ol>
    );
  if (b.analogy)
    return (
      <div className="callout idea">
        <span className="lbl">🧠 Analogía</span>
        <Md text={b.analogy} as="span" />
      </div>
    );
  if (b.callout)
    return (
      <div className={"callout " + (b.callout.k || "")}>
        <span className="lbl">{b.callout.lbl}</span>
        {b.callout.text != null ? (
          <Md text={b.callout.text} as="span" />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: b.callout.html }} />
        )}
      </div>
    );
  if (b.compare)
    return (
      <div className="compare">
        <div className="cmp bad">
          <div className="cmp-h">✕ Evita</div>
          <Code code={b.compare.bad.code} mini />
          <Md text={b.compare.bad.note} className="cmp-note" />
        </div>
        <div className="cmp good">
          <div className="cmp-h">✓ Mejor así</div>
          <Code code={b.compare.good.code} mini />
          <Md text={b.compare.good.note} className="cmp-note" />
        </div>
      </div>
    );
  if (b.table)
    return (
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              {b.table.head.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} dangerouslySetInnerHTML={{ __html: inlineMd(c) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (b.ex)
    return (
      <div className="ex">
        <div className="ex-h">
          📄 <b>{b.ex.h}</b>
        </div>
        <Code code={b.ex.code} />
        {b.ex.note && <div className="ex-note" dangerouslySetInnerHTML={{ __html: inlineMd(b.ex.note) }} />}
      </div>
    );
  if (b.summary)
    return (
      <div className="summary">
        <div className="summary-h">📌 Resumen para recordar</div>
        <MdList items={b.summary} />
      </div>
    );
  return null;
}

// Bloque de contexto para ejercicios aplicados (código, documentación de API o consola)
export function ContextBlock({ b }) {
  if (b.kind === "code")
    return (
      <div className="ex">
        <div className="ex-h">
          💻 <b>{b.title}</b>
        </div>
        <Code code={b.code} mini />
      </div>
    );
  if (b.kind === "console")
    return (
      <div className="console">
        <div className="console-h">{b.title || "Consola del navegador"}</div>
        {b.lines.map((l, i) => (
          <div key={i} className={"console-line " + (l.k || "")}>
            {l.t}
          </div>
        ))}
      </div>
    );
  if (b.kind === "doc")
    return (
      <div className="doc-box">
        <div className="doc-h">{b.title}</div>
        <div className="doc-b">
          <p style={{ marginBottom: 8 }}>
            <code>{b.endpoint}</code>
          </p>
          <p className="muted" style={{ marginBottom: 8, fontSize: ".86rem" }}>
            {b.desc}
          </p>
          <table>
            <tbody>
              {b.fields.map(([f, d], i) => (
                <tr key={i}>
                  <td>{f}</td>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  return null;
}
