// Demos interactivas que acompañan a las lecciones: el alumno ve el concepto funcionando.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Code, Md } from "./Bits.jsx";

function DemoFrame({ title, intro, code, children }) {
  return (
    <div className="demo">
      <div className="demo-h">
        <span className="demo-tag">▶ Pruébalo</span>
        <b>{title}</b>
      </div>
      {intro && <Md text={intro} as="div" className="demo-intro" />}
      <div className="demo-body">{children}</div>
      {code && (
        <div className="demo-code">
          <div className="demo-code-h">Código que se está ejecutando</div>
          <Code code={code} mini />
        </div>
      )}
    </div>
  );
}

// Registro de eventos con estado propio: el padre le agrega líneas sin volver a renderizarse.
const DemoLog = forwardRef(function DemoLog({ empty }, ref) {
  const [lines, setLines] = useState([]);
  const next = useRef(0);
  useImperativeHandle(ref, () => ({
    push(text, kind) {
      next.current += 1;
      const id = next.current;
      setLines((l) => [...l.slice(-4), { id, text, kind }]);
    },
    clear() {
      setLines([]);
    },
  }), []);
  return (
    <div className="demo-log" aria-live="polite">
      {lines.length === 0 ? (
        <span className="faint">{empty || "Aquí verás lo que ocurre…"}</span>
      ) : (
        lines.map((l) => (
          <div key={l.id} className={"log-line " + (l.kind || "")}>
            <Md text={l.text} as="span" />
          </div>
        ))
      )}
    </div>
  );
});

/* ---------- Módulo 1: listas y key ---------- */
const PEOPLE = [
  { id: 1, nombre: "Ana Torres", rol: "Diseñadora" },
  { id: 2, nombre: "Luis Pérez", rol: "Backend" },
  { id: 3, nombre: "Sofía Ramos", rol: "Frontend" },
];
const EXTRA = [
  { nombre: "Diego Castro", rol: "QA" },
  { nombre: "Valeria Ruiz", rol: "Mobile" },
  { nombre: "Mateo Silva", rol: "DevOps" },
  { nombre: "Camila Rojas", rol: "Product" },
];

function DemoCard({ user }) {
  return (
    <div className="dcard">
      <span className="dav">{user.nombre[0]}</span>
      <div className="dinfo">
        <b>{user.nombre}</b>
        <span>{user.rol} · id {user.id}</span>
      </div>
      <input className="dnote" placeholder="Escribe una nota…" aria-label={"Nota para " + user.nombre} />
    </div>
  );
}

export function ListDemo() {
  const [users, setUsers] = useState(PEOPLE);
  const [byIndex, setByIndex] = useState(false);
  const nextId = useRef(4);

  function add() {
    const base = EXTRA[(nextId.current - 4) % EXTRA.length];
    const u = { id: nextId.current++, ...base };
    setUsers((prev) => [u, ...prev]);
  }
  function removeFirst() {
    setUsers((prev) => prev.slice(1));
  }
  function reset() {
    nextId.current = 4;
    setUsers(PEOPLE);
  }

  const code = byIndex
    ? "{users.map((u, i) => (\n  <UserCard key={i} user={u} />  // ⚠ índice como key\n))}"
    : "{users.map((u) => (\n  <UserCard key={u.id} user={u} />  // ✓ id estable\n))}";

  return (
    <DemoFrame
      title="Listas con .map() y la importancia de key"
      intro="**1.** Elige el tipo de key. **2.** Escribe una nota distinta en cada tarjeta. **3.** Pulsa *Agregar al inicio* o *Quitar el primero* y observa si cada nota sigue con su persona."
      code={code}
    >
      <div className="demo-ctrls">
        <div className="seg" role="radiogroup" aria-label="Tipo de key">
          <button role="radio" aria-checked={!byIndex} className={"seg-btn" + (!byIndex ? " active" : "")} onClick={() => setByIndex(false)}>
            key=&#123;u.id&#125;
          </button>
          <button role="radio" aria-checked={byIndex} className={"seg-btn" + (byIndex ? " active" : "")} onClick={() => setByIndex(true)}>
            key=&#123;i&#125; (índice)
          </button>
        </div>
        <div className="demo-btns">
          <button className="btn sm" onClick={add}>+ Agregar al inicio</button>
          <button className="btn sm ghost" onClick={removeFirst} disabled={users.length === 0}>Quitar el primero</button>
          <button className="btn sm ghost" onClick={reset}>Reiniciar</button>
        </div>
      </div>
      <div className="dlist">
        {users.map((u, i) => (
          <DemoCard key={byIndex ? i : u.id} user={u} />
        ))}
        {users.length === 0 && <p className="faint">La lista está vacía.</p>}
      </div>
      <div className={"demo-note " + (byIndex ? "bad" : "good")}>
        {byIndex
          ? "Con key={i}, React identifica las tarjetas por su posición. Al agregar o quitar al inicio, las notas se quedan en la posición y aparecen en la persona equivocada."
          : "Con key={u.id}, React sabe qué tarjeta es cuál aunque cambie la posición. Cada nota se mantiene con su persona."}
      </div>
    </DemoFrame>
  );
}

/* ---------- Módulo 2: useState vs variable normal ---------- */
const COLORS = { Gris: "#8a94a6", Rojo: "#e5484d", Verde: "#30a46c", Azul: "#3e63dd" };

export function StateDemo() {
  const [color, setColor] = useState("Gris");
  let clicks = 0; // variable normal: se reinicia en cada render
  const log = useRef(null);

  function pick(c) {
    setColor(c);
    log.current.push(`\`setColor("${c}")\` → React vuelve a ejecutar el componente y la pantalla muestra **${c}**.`, "ok");
  }
  function sumarLet() {
    clicks++;
    log.current.push(`\`clicks++\` → la variable vale **${clicks}**, pero React no se entera: la pantalla sigue en 0.`, "bad");
  }

  return (
    <DemoFrame
      title="Estado vs. variable normal"
      intro="Pulsa los botones de color (usan **useState**) y luego el contador (usa una variable **let**). Mira el registro de abajo: ¿cuál de los dos actualiza la pantalla?"
    >
      <div className="demo-split">
        <div className="demo-pane">
          <div className="pane-h ok">✓ Con useState</div>
          <div className="swatch" style={{ background: COLORS[color] }}>
            <span>{color}</span>
          </div>
          <div className="demo-btns">
            {["Rojo", "Verde", "Azul"].map((c) => (
              <button key={c} className="btn sm ghost" onClick={() => pick(c)}>
                <i className="cdot" style={{ background: COLORS[c] }} /> {c}
              </button>
            ))}
          </div>
          <Code mini code={'const [color, setColor] = useState("Gris");\n\n<button onClick={() => setColor("Rojo")}>'} />
        </div>
        <div className="demo-pane">
          <div className="pane-h bad">✕ Con variable normal</div>
          <div className="counter">
            <b>{clicks}</b>
            <span>clicks en pantalla</span>
          </div>
          <div className="demo-btns">
            <button className="btn sm ghost" onClick={sumarLet}>+1 click</button>
          </div>
          <Code mini code={"let clicks = 0;\n\n<button onClick={() => clicks++}>"} />
        </div>
      </div>
      <DemoLog ref={log} />
      <div className="demo-note">
        Detalle: cuando cambias el color, el componente se vuelve a ejecutar y <code>let clicks = 0</code> se reinicia.
        Por eso una variable normal no sirve como memoria.
      </div>
    </DemoFrame>
  );
}

/* ---------- Módulo 3: useEffect + fetch con carga/error ---------- */
const FAKE_USERS = {
  1: { id: 1, name: "Leanne Graham", email: "Sincere@april.biz", phone: "1-770-736-8031" },
  2: { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv", phone: "010-692-6593" },
  3: { id: 3, name: "Clementine Bauch", email: "Nathan@yesenia.net", phone: "1-463-123-4447" },
};

// Simula una API lenta para que se vea el estado de carga.
function fakeFetch(id, fail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject(new Error("Network error")) : resolve(FAKE_USERS[id])), 1100);
  });
}

function useUserDemo(id, fail, nonce) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setData(null);
    fakeFetch(id, fail)
      .then((json) => !ignore && setData(json))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id, fail, nonce]);

  return { data, loading, error };
}

export function FetchDemo() {
  const [id, setId] = useState(1);
  const [fail, setFail] = useState(false);
  const [nonce, setNonce] = useState(0);
  const { data, loading, error } = useUserDemo(id, fail, nonce);
  const log = useRef(null);

  function changeId(n) {
    if (n === id) return;
    setId(n);
    log.current.push(`\`id\` cambió a **${n}** → está en \`[id]\` → el efecto se ejecuta y hace un nuevo fetch.`, "ok");
  }
  function toggleFail() {
    setFail(!fail);
    log.current.push(!fail ? "Simulando que la red falla en la próxima petición…" : "La red vuelve a funcionar.", !fail ? "bad" : "");
  }

  const view = loading ? "loading" : error ? "error" : "data";

  return (
    <DemoFrame
      title="Un custom hook con carga, error y datos"
      intro="Cambia el **id** y observa cómo el hook pasa por *cargando* antes de mostrar los datos. Activa **Simular error** para ver el camino del error."
      code={
        'const { data, loading, error } = useUser(id);\n\n' +
        'if (loading) return <p>Cargando...</p>;\n' +
        'if (error)   return <p>No se pudo cargar.</p>;\n' +
        'return <h3>{data.name}</h3>;'
      }
    >
      <div className="demo-ctrls">
        <div className="seg" role="radiogroup" aria-label="id del usuario">
          {[1, 2, 3].map((n) => (
            <button key={n} role="radio" aria-checked={id === n} className={"seg-btn" + (id === n ? " active" : "")} onClick={() => changeId(n)}>
              id = {n}
            </button>
          ))}
        </div>
        <div className="demo-btns">
          <button className={"btn sm ghost" + (fail ? " danger" : "")} onClick={toggleFail}>
            {fail ? "✕ Error activado" : "Simular error"}
          </button>
          <button className="btn sm ghost" onClick={() => setNonce(nonce + 1)}>↻ Volver a pedir</button>
        </div>
      </div>

      <div className="demo-split">
        <div className="demo-pane">
          <div className="pane-h">Estado del hook</div>
          <div className="state-rows">
            <div className={"srow" + (view === "loading" ? " on" : "")}>
              <span>loading</span>
              <code>{String(loading)}</code>
            </div>
            <div className={"srow" + (view === "error" ? " on bad" : "")}>
              <span>error</span>
              <code>{error ? `"${error}"` : "null"}</code>
            </div>
            <div className={"srow" + (view === "data" ? " on ok" : "")}>
              <span>data</span>
              <code>{data ? `{ name: "${data.name}", … }` : "null"}</code>
            </div>
          </div>
        </div>
        <div className="demo-pane">
          <div className="pane-h">Lo que ve el usuario</div>
          <div className="screen">
            {view === "loading" && (
              <p className="loading-line"><span className="spin" /> Cargando...</p>
            )}
            {view === "error" && <p className="err-line">No se pudo cargar el usuario. Inténtalo de nuevo.</p>}
            {view === "data" && (
              <div className="user-out">
                <span className="dav">{data.name[0]}</span>
                <div>
                  <b>{data.name}</b>
                  <span>{data.email}</span>
                  <span>{data.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <DemoLog ref={log} empty="Cambia el id para ver cuándo se vuelve a ejecutar el efecto." />
    </DemoFrame>
  );
}

/* ---------- Módulo 4: Link vs <a> ---------- */
const PAGES = {
  "/": { title: "Inicio", body: "Bienvenido a Mi Tienda. Agrega productos al carrito y navega por las secciones." },
  "/productos": { title: "Productos", body: "Teclado mecánico · Mouse inalámbrico · Monitor 27\"" },
  "/contacto": { title: "Contacto", body: "Escríbenos a hola@mitienda.dev o visítanos en la tienda." },
};

export function RouterDemo() {
  const [mode, setMode] = useState("link");
  const [path, setPath] = useState("/");
  const [cart, setCart] = useState(0);
  const [reloading, setReloading] = useState(false);
  const timer = useRef(null);
  const log = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function go(p) {
    if (reloading || p === path) return;
    if (mode === "link") {
      setPath(p);
      log.current.push(`\`<Link to="${p}">\` → la URL y el contenido cambian al instante. El carrito conserva **${cart}**.`, "ok");
    } else {
      setReloading(true);
      timer.current = setTimeout(() => {
        setPath(p);
        setCart(0);
        setReloading(false);
        log.current.push(`\`<a href="${p}">\` → el navegador recargó toda la página y el estado se perdió: carrito en **0**.`, "bad");
      }, 900);
    }
  }

  const page = PAGES[path];
  const tag = (p, t) => (mode === "link" ? `<Link to="${p}">${t}</Link>` : `<a href="${p}">${t}</a>`);

  return (
    <DemoFrame
      title="Navegar con Link vs. con <a>"
      intro="Agrega productos al carrito y luego navega entre secciones. Prueba los dos modos y compara qué pasa con el carrito."
      code={"<nav>\n  " + tag("/", "Inicio") + "\n  " + tag("/productos", "Productos") + "\n  " + tag("/contacto", "Contacto") + "\n</nav>"}
    >
      <div className="demo-ctrls">
        <div className="seg" role="radiogroup" aria-label="Tipo de enlace">
          <button role="radio" aria-checked={mode === "link"} className={"seg-btn" + (mode === "link" ? " active" : "")} onClick={() => setMode("link")}>
            &lt;Link to&gt;
          </button>
          <button role="radio" aria-checked={mode === "a"} className={"seg-btn" + (mode === "a" ? " active" : "")} onClick={() => setMode("a")}>
            &lt;a href&gt;
          </button>
        </div>
      </div>
      <div className="browser">
        <div className="browser-bar">
          <span className="bdots"><i /><i /><i /></span>
          <span className="url">
            {reloading ? <span className="spin" /> : "🔒"} mitienda.dev{path === "/" ? "" : path}
          </span>
        </div>
        <div className={"browser-body" + (reloading ? " reloading" : "")}>
          {reloading ? (
            <div className="blank">Recargando página…</div>
          ) : (
            <>
              <nav className="bnav">
                {Object.keys(PAGES).map((p) => (
                  <button key={p} className={p === path ? "active" : ""} onClick={() => go(p)}>
                    {PAGES[p].title}
                  </button>
                ))}
                <span className="spacer" />
                <button className="cart" onClick={() => setCart(cart + 1)}>🛒 {cart} · Agregar</button>
              </nav>
              <div className="bpage">
                <h4>{page.title}</h4>
                <p>{page.body}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <DemoLog ref={log} empty="Navega entre secciones para ver la diferencia." />
    </DemoFrame>
  );
}

export const DEMOS = { list: ListDemo, state: StateDemo, fetch: FetchDemo, router: RouterDemo };
