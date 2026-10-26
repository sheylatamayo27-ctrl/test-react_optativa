// Contenido del curso: lecciones + preguntas.
// Las preguntas se mezclan en orden al presentarlas (ver ModuleView.jsx).
// Cada opción marca su propia corrección, así el orden puede barajarse sin romper la evaluación.
//
// Bloques de lección disponibles (ver Bits.jsx y Lesson.jsx):
//   { goals: [...] }                 objetivos de aprendizaje
//   { h, id }                        título de sección (id permite enlazar desde una pregunta con "ref")
//   { p }                            párrafo (admite **negrita**, *cursiva* y `código`)
//   { code, file? }                  bloque de código, opcionalmente con nombre de archivo
//   { ul: [...] } / { steps: [...] } lista / pasos numerados
//   { analogy }                      analogía para hacerlo intuitivo
//   { callout: { k, lbl, text } }    nota destacada (k: tip | warn | idea)
//   { compare: { bad, good } }       comparación "Evita" vs "Mejor así"
//   { table: { head, rows } }        tabla
//   { ex: { h, code, note } }        ejemplo completo
//   { demo: "list" | "state" | "fetch" | "router" }   demo interactiva (Demos.jsx)
//   { summary: [...] }               resumen final
//
// Campos de cada pregunta:
//   ref      id de la sección de la lección que la explica (botón "Repasar en la lección")
//   teach    idea clave para recordar
//   hint     pista
//   example  { title?, code, note? }  ejemplo aplicado que se muestra al acertar

// Calificación: cada pregunta tiene UN solo intento y todas valen lo mismo (20 preguntas → 5% cada una).
// Para aprobar y descargar el certificado hacen falta PASS_CORRECT respuestas correctas (12 de 20 = 60%).
export const PASS_CORRECT = 12;

// Datos de la asignatura: se muestran en el inicio, en el registro y en el certificado.
export const COURSE = {
  name: "Optativa de React (FTE)",
  kind: "asignatura optativa",
};

export const MODULES = [
  /* ============ MÓDULO 1 ============ */
  {
    id: "m1",
    num: 1,
    title: "Componentes y Listas",
    sub: "componentes · JSX · props · .map() · key",
    desc: "Crea componentes reutilizables, pásales datos con props y dibuja listas con .map() y key.",
    lesson: [
      {
        goals: [
          "Entender qué es un componente y qué debe devolver.",
          "Escribir JSX correctamente y usar `{ }` para mostrar datos.",
          "Pasar información con **props** y recibirla desestructurando.",
          "Dibujar listas con `.map()` y elegir una `key` adecuada.",
        ],
      },
      { h: "¿Qué es un componente?", id: "componente" },
      { p: "Un **componente** es una función de JavaScript que **devuelve JSX**, es decir, la descripción de lo que debe aparecer en pantalla. React llama a esa función y convierte lo que retorna en elementos reales del navegador (el DOM)." },
      { analogy: "Piensa en los componentes como **piezas de LEGO**: cada pieza tiene una forma concreta (un botón, una tarjeta, un menú) y combinándolas construyes la página completa. Si necesitas diez tarjetas, no fabricas diez piezas distintas: reutilizas la misma." },
      { code: "function Saludo() {\n  return <h1>Hola mundo</h1>;\n}\n\n// Para usarlo, se escribe como una etiqueta:\n<Saludo />", file: "Saludo.jsx" },
      {
        ul: [
          "El nombre **empieza con mayúscula** (`Saludo`, `UserCard`). Así React distingue tus componentes de las etiquetas HTML (`<div>`, `<h1>`).",
          "Lo que pones en el `return` es exactamente lo que React dibuja. Sin `return`, no se muestra nada.",
          "Un componente no devuelve datos sueltos (un JSON, un número): devuelve **interfaz**. Los datos se *usan* dentro del JSX.",
        ],
      },
      { h: "JSX: la sintaxis de la interfaz", id: "jsx" },
      { p: "JSX parece HTML, pero vive dentro de JavaScript. Eso permite mezclar marcado y lógica: todo lo que escribes **entre llaves `{ }`** se evalúa como JavaScript y su resultado se muestra." },
      { code: 'function Perfil() {\n  const nombre = "María";\n  const edad = 21;\n\n  return (\n    <div className="perfil">\n      <h2>{nombre.toUpperCase()}</h2>\n      <p>Tiene {edad} años y el próximo año tendrá {edad + 1}.</p>\n    </div>\n  );\n}', file: "Perfil.jsx" },
      { callout: { k: "tip", lbl: "Reglas rápidas de JSX", text: "Devuelve **un solo elemento raíz** (o un fragmento `<>...</>`), usa `className` en lugar de `class`, y cierra todas las etiquetas (`<img />`, `<br />`)." } },
      { h: "Props: pasar datos a un componente", id: "props" },
      { p: "Las **props** (propiedades) son los datos que un componente **recibe de su padre**, igual que los argumentos de una función. El padre las escribe como atributos y el hijo las recibe todas juntas en **un único objeto**." },
      { code: '// El padre pasa la prop "user"\n<UserCard user={{ nombre: "Ana", rol: "Diseñadora" }} />\n\n// El hijo recibe UN objeto: { user: { nombre: "Ana", rol: "Diseñadora" } }\nfunction UserCard(props) {\n  return <h2>{props.user.nombre}</h2>;\n}' },
      { p: "Escribir `props.` cada vez es repetitivo. Lo habitual es **desestructurar** el objeto directamente en el parámetro, usando llaves `{ }` con el nombre de la prop:" },
      {
        compare: {
          bad: { code: "function UserCard(user) {\n  // 'user' es en realidad TODO el objeto props\n  return <h2>{user.nombre}</h2>; // undefined\n}", note: "Sin llaves, el parámetro recibe el objeto props completo, no la prop `user`." },
          good: { code: "function UserCard({ user }) {\n  // saca la prop 'user' del objeto props\n  return <h2>{user.nombre}</h2>; // \"Ana\"\n}", note: "Las llaves extraen la prop por su nombre. Es la forma más usada." },
        },
      },
      { callout: { k: "warn", lbl: "Importante", text: "Las props son de **solo lectura**: un componente nunca debe modificar lo que recibe. Si algo necesita cambiar, se usa estado (módulo 2)." } },
      { h: "Listas con .map()", id: "map" },
      { p: "Casi toda app muestra listas: productos, mensajes, usuarios. Los datos llegan como un **array** y hay que convertir cada elemento en JSX. Para eso se usa `.map()`, que **recorre el array y devuelve uno nuevo** con el resultado de cada vuelta." },
      { code: "// En JavaScript puro:\n[1, 2, 3].map((n) => n * 2); // [2, 4, 6]\n\n// En React, transformamos datos en elementos:\nusers.map((u) => <UserCard key={u.id} user={u} />);\n// → [<UserCard/>, <UserCard/>, <UserCard/>]" },
      {
        ex: {
          h: "UserList.jsx — ejemplo completo",
          code:
            'const users = [\n  { id: 1, nombre: "Ana Torres", rol: "Diseñadora" },\n  { id: 2, nombre: "Luis Pérez", rol: "Backend" },\n  { id: 3, nombre: "Sofía Ramos", rol: "Frontend" },\n];\n\n' +
            'function UserCard({ user }) {\n  return (\n    <article className="card">\n      <h3>{user.nombre}</h3>\n      <p>{user.rol}</p>\n    </article>\n  );\n}\n\n' +
            "export default function UserList() {\n  return (\n    <section>\n      {users.map((u) => (\n        <UserCard key={u.id} user={u} />\n      ))}\n    </section>\n  );\n}",
          note: "`UserList` recorre los datos y crea un `UserCard` por usuario. Si mañana hay 300 usuarios, el código no cambia.",
        },
      },
      {
        compare: {
          bad: { code: "{users.forEach((u) => (\n  <UserCard key={u.id} user={u} />\n))}", note: "`.forEach()` siempre devuelve `undefined`: React no recibe nada que dibujar y la lista sale **vacía**, sin ningún error." },
          good: { code: "{users.map((u) => (\n  <UserCard key={u.id} user={u} />\n))}", note: "`.map()` devuelve un array de elementos, que React sí sabe pintar." },
        },
      },
      { callout: { k: "warn", lbl: "Paréntesis o llaves", text: "Con paréntesis `(u) => ( <li>…</li> )` el JSX se devuelve solo. Si usas **llaves** `(u) => { … }` tienes que escribir `return`; sin él la función devuelve `undefined` y la lista sale vacía. Revisa también que uses el nombre exacto de los campos de tus datos: si el objeto tiene `nombre`, `u.name` será `undefined`." } },
      { h: "La prop key", id: "key" },
      { p: "Cuando la lista cambia (se agrega, borra o reordena un elemento), React compara la lista nueva con la anterior para actualizar **solo lo necesario**. La `key` es el **identificador** que le permite saber qué elemento es cuál entre un render y otro." },
      { analogy: "Es como el **número de matrícula** de un estudiante: aunque cambie de asiento, el profesor sabe quién es. Usar el índice como key es identificar a los alumnos por el número de asiento: si alguien se cambia de lugar, todo se confunde." },
      {
        ul: [
          "Debe ser **única** entre los elementos de la misma lista.",
          "Debe ser **estable**: el mismo elemento conserva siempre la misma key (usa el `id` de los datos).",
          "Evita el **índice** (`key={i}`) si la lista puede reordenarse o cambiar, y nunca uses `Math.random()`: cambiaría en cada render.",
          "`key` es solo para React: no cambia estilos, no ordena la lista y el componente hijo no puede leerla.",
        ],
      },
      { demo: "list" },
      {
        summary: [
          "Componente = función con nombre en mayúscula que **retorna JSX**.",
          "Dentro del JSX, lo que va entre `{ }` es JavaScript.",
          "Props = datos del padre; se reciben desestructurando: `function X({ user })`.",
          "Listas: `array.map(item => <Comp key={item.id} item={item} />)`.",
          "`key` única y estable (el `id`). Nunca `.forEach()` para pintar.",
        ],
      },
    ],
    questions: [
      {
        id: "m1q1", type: "concept", topic: "Qué devuelve un componente", ref: "componente",
        prompt: "¿Qué debe devolver un componente funcional en React?",
        options: [
          { id: "a", text: "JSX: la descripción de la interfaz que se mostrará", correct: true, feedback: "Un componente es una función que retorna JSX. React toma ese resultado y lo convierte en elementos reales del navegador. Todo lo que esté en el `return` es lo que el usuario verá." },
          { id: "b", text: "Un objeto JSON con datos", correct: false, feedback: "Un componente puede *usar* datos (por ejemplo, de un JSON), pero lo que devuelve es la **interfaz** que se debe dibujar, no los datos en sí. Si devolvieras un objeto, React lanzaría un error: *Los objetos no son válidos como hijo de React*." },
          { id: "c", text: "Siempre una cadena de texto", correct: false, feedback: "Puede devolver texto, pero no está limitado a eso: lo normal es devolver estructuras JSX completas con etiquetas, otros componentes y expresiones `{ }`." },
          { id: "d", text: "Nada; no devuelven valores", correct: false, feedback: "Sí devuelven, y es lo más importante: su `return` es justo lo que React pinta. Un componente sin `return` no muestra nada en pantalla." },
        ],
        teach: "Componente = función (con mayúscula) que retorna JSX.",
        hint: "Piensa en qué *dibuja* React en pantalla: lo que hay en el `return`.",
        example: {
          code: 'function Boton({ texto }) {\n  return <button className="btn">{texto}</button>;\n}\n\n// Una sola definición, muchos usos:\n<Boton texto="Guardar" />\n<Boton texto="Cancelar" />',
          note: "Una función, un `return` con JSX, y la reutilizas en toda la app con distintos datos.",
        },
      },
      {
        id: "m1q2", type: "concept", topic: "Para qué sirve key", ref: "key",
        prompt: "Al renderizar una lista con `.map()`, ¿para qué sirve la prop `key`?",
        options: [
          { id: "a", text: "Para que React identifique cada elemento y actualice la lista de forma eficiente", correct: true, feedback: "La `key` es la **identidad** de cada elemento. Cuando la lista cambia, React usa las keys para saber cuál se agregó, cuál se borró y cuál se movió, y así actualiza solo lo necesario sin confundir elementos." },
          { id: "b", text: "Para darle color o estilo a cada tarjeta", correct: false, feedback: "El estilo se controla con `className` o CSS. La `key` no llega al HTML ni afecta la apariencia: es información interna para React." },
          { id: "c", text: "Solo para que no salga un aviso en consola", correct: false, feedback: "Es cierto que sin key aparece el aviso *Cada hijo de una lista debe tener una prop \"key\" única*, pero ese aviso existe porque sin key React puede **mezclar el estado** de los elementos al cambiar la lista (prueba la demo de la lección)." },
          { id: "d", text: "Para ordenar la lista alfabéticamente", correct: false, feedback: "`key` no ordena nada. Para ordenar, ordenas el array antes de recorrerlo (por ejemplo con `.sort()`) y luego haces `.map()`." },
        ],
        teach: "`key` le dice a React “este elemento es el mismo de antes” cuando la lista cambia.",
        hint: "Imagina reordenar o borrar una tarjeta: React necesita saber cuál es cuál.",
        example: {
          code: "{tareas.map((t) => (\n  <TareaItem key={t.id} tarea={t} />\n))}\n\n// Si borras la tarea con id 7, React elimina\n// SOLO ese <TareaItem> y deja intactos los demás.",
          note: "En una lista de tareas, mensajes o productos, la key correcta evita que un checkbox marcado “salte” a otra fila.",
        },
      },
      {
        id: "m1q3", type: "concept", topic: "Recibir props", ref: "props",
        prompt: "¿Cuál define correctamente un componente que recibe la prop `users`?",
        options: [
          { id: "a", code: "function UserList({ users }) {", correct: true, feedback: "Las llaves en el parámetro **desestructuran** el objeto props y sacan directamente la prop `users`. Dentro del componente ya puedes escribir `users.map(...)`." },
          { id: "b", code: "function UserList(users) {", correct: false, feedback: "Sin llaves, la variable `users` contiene el **objeto props completo** (`{ users: [...] }`), no el array. Para llegar al array tendrías que escribir `users.users`, lo cual es confuso." },
          { id: "c", code: "function UserList() {", correct: false, feedback: "Sin parámetros, el componente ignora todo lo que le pasa el padre. No tendría forma de acceder a `users`." },
          { id: "d", code: "function UserList(props.users) {", correct: false, feedback: "No es sintaxis válida de JavaScript: un parámetro no puede llevar un punto. Lo correcto sería `(props)` y luego `props.users`, o desestructurar con `({ users })`." },
        ],
        teach: "Desestructurar `{ users }` en el parámetro saca la prop directamente.",
        hint: "Las props llegan en **un objeto**. Para sacar una propiedad de un objeto se usan llaves `{ }`.",
        example: {
          code: '// Padre\n<UserList users={usuarios} titulo="Equipo" />\n\n// Hijo: puedes sacar varias props a la vez\nfunction UserList({ users, titulo }) {\n  return (\n    <section>\n      <h2>{titulo}</h2>\n      <p>{users.length} personas</p>\n    </section>\n  );\n}',
        },
      },
      {
        id: "m1q4", type: "concept", topic: "map con key", ref: "map",
        prompt: "Elige el `.map()` correcto para pintar un `UserCard` por usuario:",
        options: [
          { id: "a", code: "{users.map((u) => <UserCard key={u.id} user={u} />)}", correct: true, feedback: "Recorre el array con `.map()` (que sí devuelve elementos), pasa el usuario completo como prop `user` y usa su `id` —único y estable— como `key`." },
          { id: "b", code: "{users.map((u) => <UserCard user={u} />)}", correct: false, feedback: "Pinta la lista, pero falta la `key`. React mostrará un aviso y, si la lista cambia, puede confundir qué tarjeta es cuál." },
          { id: "c", code: "{users.forEach((u) => <UserCard key={u.id} user={u} />)}", correct: false, feedback: "`.forEach()` ejecuta la función pero **siempre devuelve `undefined`**, así que React no recibe nada que dibujar. La lista sale vacía sin ningún error." },
          { id: "d", code: "{users.map((u) => <UserCard key={u} user={u.id} />)}", correct: false, feedback: "Están intercambiados: la `key` debería ser el id (`u.id`) y la prop `user` el objeto completo (`u`). Aquí el componente recibiría solo un número." },
        ],
        teach: "Patrón: `array.map(item => <Componente key={item.id} prop={item} />)`.",
        hint: "Necesitas un método que **devuelva** elementos, y una key que identifique a cada usuario.",
        example: {
          code: '<ul>\n  {productos.map((p) => (\n    <li key={p.id}>\n      {p.nombre} — ${p.precio}\n    </li>\n  ))}\n</ul>',
          note: "El mismo patrón sirve para cualquier lista: productos, comentarios, notificaciones…",
        },
      },
      /* --- EJERCICIO APLICADO: lista que no se ve --- */
      {
        id: "m1q5", type: "applied", topic: "Depurar una lista vacía", ref: "map",
        prompt: "Ejercicio práctico. Un compañero escribió este componente para mostrar los productos de una tienda, pero **la lista sale vacía** aunque `products` tiene datos. ¿Cuál es la corrección correcta?",
        context: [
          {
            kind: "code",
            title: "ProductList.jsx (con error)",
            code:
              "function ProductList({ products }) {\n" +
              "  return (\n" +
              "    <ul>\n" +
              "      {products.forEach((p) => (\n" +
              "        <li>{p.name}</li>\n" +
              "      ))}\n" +
              "    </ul>\n" +
              "  );\n" +
              "}",
          },
          {
            kind: "console",
            lines: [
              { t: "> console.log(products)" },
              { t: '[{ id: 101, name: "Teclado" }, { id: 102, name: "Mouse" }, { id: 103, name: "Monitor" }]' },
              { t: "(sin errores en consola, pero el <ul> está vacío)", k: "muted" },
            ],
          },
        ],
        options: [
          { id: "a", code: "{products.map((p) => (\n  <li key={p.id}>{p.name}</li>\n))}", correct: true, feedback: "Hay **dos** problemas y esta opción arregla ambos: `.map()` sí devuelve el array de `<li>` (por eso ahora se ve la lista) y `key={p.id}` da a cada elemento una identidad única y estable." },
          { id: "b", code: "{products.map((p) => (\n  <li>{p.name}</li>\n))}", correct: false, feedback: "Ahora la lista sí se ve, pero queda a medias: falta la `key`. React mostrará el aviso *Cada hijo de una lista debe tener una prop \"key\" única* y puede confundir elementos cuando la lista cambie." },
          { id: "c", code: "{products.forEach((p) => (\n  <li key={p.id}>{p.name}</li>\n))}", correct: false, feedback: "Agregaste la key, pero el problema principal sigue: `.forEach()` devuelve `undefined`, así que no se pinta nada. Hay que cambiarlo por `.map()`." },
          { id: "d", code: "{products.map((p) => (\n  <li key={Math.random()}>{p.name}</li>\n))}", correct: false, feedback: "Se ve la lista, pero `Math.random()` genera una key **distinta en cada render**: React cree que todos los elementos son nuevos y los destruye y vuelve a crear siempre. La key debe ser estable: usa `p.id`." },
        ],
        teach: "Para pintar listas: `.map()` (no `.forEach()`) + `key` estable tomada de los datos.",
        hint: "Pregúntate: ¿qué **devuelve** `.forEach()`? ¿Y qué necesita cada `<li>` de una lista?",
        example: {
          title: "Versión final del componente",
          code: "function ProductList({ products }) {\n  return (\n    <ul>\n      {products.map((p) => (\n        <li key={p.id}>{p.name}</li>\n      ))}\n    </ul>\n  );\n}",
          note: "Cuando una lista “no aparece” y no hay errores, lo primero que conviene revisar es si se usó `.map()`.",
        },
      },
    ],
  },

  /* ============ MÓDULO 2 ============ */
  {
    id: "m2",
    num: 2,
    title: "Estado con useState",
    sub: "useState · onClick · re-render",
    desc: "Haz que la interfaz reaccione al usuario usando el estado de React.",
    lesson: [
      {
        goals: [
          "Comprender qué es el estado y por qué una variable normal no basta.",
          "Declarar estado con `useState` y leer su valor.",
          "Actualizar el estado desde un evento como `onClick`.",
          "Entender el ciclo **estado → re-render → pantalla actualizada**.",
        ],
      },
      { h: "¿Qué es el estado?", id: "estado" },
      { p: "El **estado** es la **memoria** de un componente: datos que pueden cambiar mientras el usuario usa la app (un contador, el color elegido, si un menú está abierto, el texto de un buscador). Cuando el estado cambia, React **vuelve a dibujar** el componente para que la pantalla refleje el nuevo valor." },
      { analogy: "Imagina el **marcador de un partido**. El número de goles es el estado: cuando alguien anota, el tablero se actualiza solo. Tú no repintas el tablero a mano; solo dices *“ahora son 2”* y el marcador se encarga del resto." },
      { h: "Por qué una variable normal no sirve", id: "variable" },
      { code: "function Contador() {\n  let clicks = 0;\n\n  return (\n    <button onClick={() => clicks++}>\n      Clicks: {clicks}  {/* siempre muestra 0 */}\n    </button>\n  );\n}" },
      {
        ul: [
          "**React no se entera** del cambio: modificar una variable normal no provoca un nuevo render, así que la pantalla no se actualiza.",
          "Aunque algo forzara un render, `let clicks = 0` se **vuelve a ejecutar** y el valor se reinicia a 0.",
        ],
      },
      { h: "useState paso a paso", id: "usestate" },
      { p: "`useState` es un **hook** (una función especial de React) que crea una variable de estado que React **recuerda entre renders**. Devuelve un **array de dos elementos** que desestructuramos:" },
      { code: 'import { useState } from "react";\n\nconst [color, setColor] = useState("Gris");\n//     ↑        ↑                  ↑\n//   valor    función para     valor inicial\n//   actual   cambiarlo' },
      {
        ul: [
          "`color` — el **valor actual**. En el primer render vale `\"Gris\"`.",
          "`setColor` — la **función** para cambiarlo. Por convención se llama `set` + nombre.",
          "`\"Gris\"` — el **valor inicial**; solo se usa la primera vez.",
          "El orden siempre es **[valor, setter]**. Los nombres los eliges tú.",
        ],
      },
      {
        compare: {
          bad: { code: 'const color = useState("Gris");\n// color es el array completo:\n// ["Gris", ƒ]', note: "Sin desestructurar obtienes el array entero, no el valor." },
          good: { code: 'const [color, setColor] = useState("Gris");\n// color    → "Gris"\n// setColor → función', note: "Con `[ ]` separas el valor y su setter, en ese orden." },
        },
      },
      { h: "Eventos: cambiar el estado con onClick", id: "onclick" },
      { p: "Los elementos reaccionan a eventos con props escritas en **camelCase** (cada palabra nueva empieza con mayúscula): `onClick`, `onChange`, `onSubmit`. A `onClick` se le pasa **una función** que React ejecutará **cuando ocurra el clic**, no antes." },
      {
        compare: {
          bad: { code: '<button onClick={setColor("Rojo")}>\n  Rojo\n</button>', note: "`setColor(\"Rojo\")` **se ejecuta al dibujar**: cambia el estado → re-render → se ejecuta otra vez… bucle infinito (*Demasiados re-renders*)." },
          good: { code: '<button onClick={() => setColor("Rojo")}>\n  Rojo\n</button>', note: "La función flecha **envuelve** la llamada: se ejecuta solo al hacer clic." },
        },
      },
      { analogy: "Pasar `() => setColor(\"Rojo\")` es como **dejarle tu número de teléfono** a alguien para que te llame cuando haga falta. Escribir `setColor(\"Rojo\")` directamente es **llamar ahora mismo**, mientras se está dibujando la página." },
      { callout: { k: "warn", lbl: "Nunca mutes el estado", text: "Escribir `color = \"Rojo\"` no funciona: React no detecta el cambio (y además `const` no lo permite). Usa siempre el setter: `setColor(\"Rojo\")`." } },
      { h: "El ciclo del re-render", id: "rerender" },
      {
        steps: [
          "El usuario hace clic en el botón **Rojo**.",
          "Se ejecuta `setColor(\"Rojo\")`: React guarda el nuevo valor y programa una actualización.",
          "React **vuelve a ejecutar** la función del componente (`ColorPicker()`).",
          "Esta vez `useState` devuelve `\"Rojo\"` en lugar de `\"Gris\"`.",
          "React compara el JSX nuevo con el anterior y actualiza **solo lo que cambió** en la pantalla.",
        ],
      },
      {
        ex: {
          h: "ColorPicker.jsx — ejemplo completo",
          code:
            'import { useState } from "react";\n\n' +
            "export default function ColorPicker() {\n" +
            '  const [color, setColor] = useState("Gris");\n\n' +
            "  return (\n" +
            "    <div>\n" +
            "      <p>Color elegido: <b>{color}</b></p>\n" +
            '      <button onClick={() => setColor("Rojo")}>Rojo</button>\n' +
            '      <button onClick={() => setColor("Verde")}>Verde</button>\n' +
            '      <button onClick={() => setColor("Azul")}>Azul</button>\n' +
            "    </div>\n" +
            "  );\n" +
            "}",
          note: "Cada botón llama al setter con un valor distinto. No hace falta tocar el DOM a mano: React actualiza el `<b>` por ti.",
        },
      },
      { demo: "state" },
      {
        summary: [
          "Estado = memoria del componente; al cambiar, **re-renderiza**.",
          "Declarar: `const [valor, setValor] = useState(inicial)`.",
          "Cambiar: siempre con el setter, nunca asignando a mano.",
          "Eventos: `onClick={() => setValor(nuevo)}` — con función flecha.",
          "Una variable `let` no sirve: React no se entera y se reinicia en cada render.",
        ],
      },
    ],
    questions: [
      {
        id: "m2q1", type: "concept", topic: "Qué hace useState", ref: "estado",
        prompt: "¿Qué hace `useState`?",
        options: [
          { id: "a", text: "Crea una variable de estado: cuando cambia, el componente se vuelve a renderizar", correct: true, feedback: "Esa es la esencia del estado: un valor que React **recuerda entre renders** y que, al cambiar mediante su setter, provoca que el componente se vuelva a dibujar con el valor nuevo." },
          { id: "b", text: "Crea una variable normal que no afecta la pantalla", correct: false, feedback: "Eso describe justamente lo contrario: una variable `let` normal no avisa a React, por eso no actualiza la pantalla. `useState` existe precisamente para resolver eso." },
          { id: "c", text: "Hace una petición a un servidor", correct: false, feedback: "Para pedir datos a un servidor se usa `fetch` (normalmente dentro de `useEffect`, módulo 3). `useState` solo guarda valores." },
          { id: "d", text: "Define una ruta de navegación", correct: false, feedback: "Las rutas se definen con `react-router-dom` (módulo 4). `useState` no tiene relación con la navegación." },
        ],
        teach: "Estado = memoria que, al cambiar, repinta la interfaz.",
        hint: "Es una *memoria* que, al cambiar, actualiza la pantalla.",
        example: {
          code: "const [abierto, setAbierto] = useState(false);\n\n<button onClick={() => setAbierto(!abierto)}>\n  {abierto ? \"Cerrar menú\" : \"Abrir menú\"}\n</button>\n{abierto && <Menu />}",
          note: "Un menú desplegable: el estado `abierto` decide qué texto mostrar y si el menú aparece.",
        },
      },
      {
        id: "m2q2", type: "concept", topic: "Declarar estado", ref: "usestate",
        prompt: 'Declara el estado `color` con valor inicial `"Gris"`:',
        options: [
          { id: "a", code: 'const [color, setColor] = useState("Gris");', correct: true, feedback: "Desestructuras el array que devuelve `useState` en **[valor, setter]**, en ese orden, y pasas `\"Gris\"` como valor inicial." },
          { id: "b", code: 'const color = useState("Gris");', correct: false, feedback: "Sin los corchetes, `color` sería el **array completo** `[\"Gris\", ƒ]`. Si lo pintas verías algo raro, y no tendrías un nombre para el setter." },
          { id: "c", code: 'const [setColor, color] = useState("Gris");', correct: false, feedback: "El orden está invertido: `useState` siempre devuelve primero el valor y después la función. Aquí `setColor` valdría `\"Gris\"` y `color` sería la función." },
          { id: "d", code: 'let color = "Gris";', correct: false, feedback: "Es una variable normal: puedes leerla, pero al cambiarla React no se entera y la pantalla no se actualiza." },
        ],
        teach: "Siempre: `const [valor, setValor] = useState(inicial)`.",
        hint: "`useState` devuelve un array: **[valor, función]**, en ese orden.",
        example: {
          code: 'const [busqueda, setBusqueda] = useState("");\nconst [cantidad, setCantidad] = useState(1);\nconst [usuario, setUsuario] = useState(null);',
          note: "El valor inicial puede ser texto, número, booleano, `null`, un array o un objeto. Un componente puede tener varios estados.",
        },
      },
      {
        id: "m2q3", type: "concept", topic: "Botón con onClick", ref: "onclick",
        prompt: '¿Cuál es el botón correcto para poner el color en `"Rojo"`? Fíjate bien en cada detalle: algunas opciones se parecen mucho.',
        options: [
          { id: "a", code: '<button onClick={() => setColor("Rojo")}>Rojo</button>', correct: true, feedback: "La función flecha `() => ...` le entrega a React **una función para más tarde**. React la ejecuta solo cuando el usuario hace clic, y entonces se llama a `setColor(\"Rojo\")`." },
          { id: "b", code: '<button onClick={setColor("Rojo")}>Rojo</button>', correct: false, feedback: "Aquí `setColor(\"Rojo\")` se **ejecuta al dibujar** el botón, no al hacer clic. Eso cambia el estado → re-render → se ejecuta otra vez… y React corta con el error *Demasiados re-renders*." },
          { id: "c", code: '<button click={() => setColor("Rojo")}>Rojo</button>', correct: false, feedback: "Se parece mucho a la correcta, pero fíjate en el atributo: dice `click` en lugar de `onClick`. En React los eventos siempre llevan el prefijo `on` en camelCase (`onClick`, `onChange`…). `click` no es un evento reconocido, así que el botón no haría nada al pulsarlo." },
          { id: "d", code: '<button onClick={() => color = "Rojo"}>Rojo</button>', correct: false, feedback: "Asignar a mano no avisa a React (y con `const` incluso da error). El estado solo se cambia con su setter: `setColor(\"Rojo\")`." },
        ],
        teach: "`onClick={() => setColor(valor)}` es el patrón de un botón que cambia estado.",
        hint: "¿El cambio debe ocurrir al **dibujar** el botón o solo al **hacer clic**?",
        example: {
          code: "const [cantidad, setCantidad] = useState(1);\n\n<button onClick={() => setCantidad(cantidad - 1)}>−</button>\n<span>{cantidad}</span>\n<button onClick={() => setCantidad(cantidad + 1)}>+</button>",
          note: "El selector de cantidad de un carrito de compras usa exactamente este patrón.",
        },
      },
      {
        id: "m2q4", type: "concept", topic: "El re-render", ref: "rerender",
        prompt: 'Cuando llamas a `setColor("Verde")`, ¿qué ocurre?',
        options: [
          { id: "a", text: "React actualiza el estado y vuelve a ejecutar el componente, mostrando el nuevo color", correct: true, feedback: "Ese es el ciclo completo: el setter guarda el valor nuevo, React **vuelve a llamar** a la función del componente, `useState` devuelve `\"Verde\"` y React actualiza en pantalla solo lo que cambió." },
          { id: "b", text: "Nada hasta que recargues la página", correct: false, feedback: "Justo lo contrario: el estado actualiza la interfaz **al instante**, sin recargar. Recargar la página, de hecho, borraría el estado." },
          { id: "c", text: "Se borra el componente de la pantalla", correct: false, feedback: "El componente no se borra: se **vuelve a dibujar** con el valor nuevo. Los elementos que no cambiaron ni siquiera se tocan." },
          { id: "d", text: "Cambia el valor pero la pantalla no se entera", correct: false, feedback: "Eso pasaría con una variable normal. La gracia del setter es que **avisa a React** para que vuelva a renderizar." },
        ],
        teach: "`setX` → React re-ejecuta el componente → la UI muestra el nuevo valor.",
        hint: "Recuerda los pasos del ciclo: setter → … → pantalla.",
        example: {
          code: 'function Semaforo() {\n  const [luz, setLuz] = useState("roja");\n  console.log("render con luz =", luz);\n\n  return <button onClick={() => setLuz("verde")}>{luz}</button>;\n}\n// Consola: "render con luz = roja"\n// (clic)   "render con luz = verde"',
          note: "Un `console.log` dentro del componente te deja ver cada re-render: muy útil para depurar.",
        },
      },
      /* --- EJERCICIO APLICADO: contador que no funciona --- */
      {
        id: "m2q5", type: "applied", topic: "Arreglar un contador", ref: "variable",
        prompt: "Ejercicio práctico. Este contador de “Me gusta” no funciona: al pulsar el botón **el número se queda en 0**. ¿Cuál es la versión corregida?",
        context: [
          {
            kind: "code",
            title: "Likes.jsx (con error)",
            code:
              "function Likes() {\n" +
              "  let likes = 0;\n\n" +
              "  return (\n" +
              "    <button onClick={() => likes++}>\n" +
              "      ❤ {likes}\n" +
              "    </button>\n" +
              "  );\n" +
              "}",
          },
        ],
        options: [
          { id: "a", code: "const [likes, setLikes] = useState(0);\n\n<button onClick={() => setLikes(likes + 1)}>\n  ❤ {likes}\n</button>", correct: true, feedback: "Cambias la variable normal por **estado** y la actualizas con su **setter** dentro de una función flecha. Cada clic llama a `setLikes`, React vuelve a renderizar y muestra el número nuevo." },
          { id: "b", code: "const [likes, setLikes] = useState(0);\n\n<button onClick={() => likes++}>\n  ❤ {likes}\n</button>", correct: false, feedback: "Declaraste el estado, pero lo sigues cambiando a mano con `likes++`. Eso no avisa a React (y con `const` incluso falla). Hay que usar `setLikes(likes + 1)`." },
          { id: "c", code: "const [likes, setLikes] = useState(0);\n\n<button onClick={setLikes(likes + 1)}>\n  ❤ {likes}\n</button>", correct: false, feedback: "Sin la función flecha, `setLikes(likes + 1)` se ejecuta **al renderizar**: cambia el estado → nuevo render → se ejecuta otra vez… React corta con *Demasiados re-renders*." },
          { id: "d", code: "let likes = 0;\n\n<button onClick={() => {\n  likes++;\n  console.log(likes);\n}}>\n  ❤ {likes}\n</button>", correct: false, feedback: "La consola mostrará 1, 2, 3…, pero la pantalla sigue en 0: una variable normal no provoca re-render. Necesitas `useState`." },
        ],
        teach: "Si un valor debe verse actualizado en pantalla, va en `useState` y se cambia con su setter.",
        hint: "Hacen falta **dos** cosas: guardar el valor en estado y cambiarlo con el setter… en el momento correcto.",
        example: {
          title: "Versión final del componente",
          code: 'import { useState } from "react";\n\nfunction Likes() {\n  const [likes, setLikes] = useState(0);\n\n  return (\n    <button onClick={() => setLikes(likes + 1)}>\n      ❤ {likes}\n    </button>\n  );\n}',
        },
      },
    ],
  },

  /* ============ MÓDULO 3 ============ */
  {
    id: "m3",
    num: 3,
    title: "Hooks y Consumo de APIs",
    sub: "useEffect · fetch · hooks personalizados",
    desc: "Pide datos a una API con un hook propio que maneja carga, error y resultado.",
    lesson: [
      {
        goals: [
          "Saber qué es un **efecto secundario** y por qué va en `useEffect`.",
          "Controlar cuándo se ejecuta un efecto con el **array de dependencias**.",
          "Pedir datos con `fetch` y manejar **carga, error y datos** en el orden correcto.",
          "Crear un **hook personalizado** y adaptarlo a otra API leyendo su documentación.",
        ],
      },
      { h: "Efectos secundarios", id: "efectos" },
      { p: "La función de un componente debe dedicarse a **calcular qué se ve** (devolver JSX). Todo lo que interactúa con el “mundo exterior” es un **efecto secundario**: pedir datos a una API, iniciar un temporizador, escuchar eventos de la ventana o cambiar el título de la pestaña. Para eso existe `useEffect`: ejecuta tu código **después** de que React pinta la pantalla." },
      { analogy: "El render es el **chef emplatando**: solo arma lo que va en el plato. Ir al mercado a comprar ingredientes es un efecto: se hace aparte, y cuando llegan los ingredientes (los datos), el chef vuelve a emplatar con lo nuevo." },
      { code: 'import { useEffect } from "react";\n\nuseEffect(() => {\n  // código del efecto (por ejemplo, pedir datos)\n}, [id]); // ← array de dependencias' },
      { h: "El array de dependencias", id: "deps" },
      { p: "El segundo argumento de `useEffect` le dice a React **cuándo** repetir el efecto. Tras cada render, React compara los valores del array con los del render anterior: si alguno cambió, vuelve a ejecutar el efecto." },
      {
        table: {
          head: ["Forma", "¿Cuándo se ejecuta?", "Uso típico"],
          rows: [
            ["`useEffect(fn, [id])`", "Al montar y **cada vez que `id` cambia**", "Pedir el detalle de un elemento según su id"],
            ["`useEffect(fn, [])`", "**Una sola vez**, al montar", "Cargar datos iniciales que no dependen de nada"],
            ["`useEffect(fn)`", "Después de **cada** render", "Casi nunca; con un `setState` dentro provoca un bucle"],
          ],
        },
      },
      {
        compare: {
          bad: { code: "useEffect(() => {\n  fetch(url)\n    .then((r) => r.json())\n    .then((json) => setData(json));\n}); // sin array", note: "Cada `setData` provoca un render → el efecto corre otra vez → otro fetch → otro render… **bucle infinito** de peticiones." },
          good: { code: "useEffect(() => {\n  fetch(url)\n    .then((r) => r.json())\n    .then((json) => setData(json));\n}, [url]);", note: "Solo vuelve a pedir datos cuando `url` cambia." },
        },
      },
      { h: "Pedir datos con fetch", id: "fetch" },
      { p: "`fetch(url)` hace una petición HTTP y devuelve una **promesa** (un valor que llegará más tarde). La respuesta se procesa en cadena con `.then()`: primero se convierte a objeto con `.json()` y luego se guarda en el estado." },
      { code: 'fetch("https://pokeapi.co/api/v2/pokemon/25")\n  .then((r) => r.json())            // 1. convierte la respuesta a objeto\n  .then((json) => setData(json))    // 2. guarda los datos en el estado\n  .catch((err) => setError(err))    // 3. si algo falla, guarda el error\n  .finally(() => setLoading(false)); // 4. pase lo que pase, terminó de cargar' },
      { h: "Carga, error y datos", id: "estados" },
      { p: "Los datos **no llegan al instante**. Durante unos milisegundos (o segundos, con mala conexión) `data` todavía es `null`. Por eso un componente que consume una API maneja **tres situaciones**, y las comprueba **en este orden**:" },
      {
        steps: [
          "**¿Está cargando?** → muestra un mensaje o un spinner.",
          "**¿Hubo un error?** → muestra un aviso útil para el usuario.",
          "**Si no**, los datos ya están disponibles → ahora sí, úsalos.",
        ],
      },
      {
        compare: {
          bad: { code: "const { data, loading } = usePokemon(id);\n\nreturn <h3>{data.name}</h3>;\n// Error de tipo: no se pueden leer propiedades\n// de null (leyendo 'name')", note: "En el primer render `data` es `null`, y `null.name` rompe la app." },
          good: { code: "const { data, loading, error } = usePokemon(id);\n\nif (loading) return <p>Cargando...</p>;\nif (error) return <p>No se pudo cargar.</p>;\nreturn <h3>{data.name}</h3>;", note: "Cuando llegas a la última línea, es seguro que `data` existe." },
        },
      },
      { h: "Hooks personalizados: lógica reutilizable", id: "hook" },
      { p: "Un **hook personalizado** es una función cuyo nombre empieza por `use` y que agrupa estados y efectos para reutilizarlos. El componente queda limpio: solo pide los datos y decide cómo mostrarlos." },
      {
        ex: {
          h: "usePokemon.js",
          code:
            'import { useState, useEffect } from "react";\n\n' +
            "export function usePokemon(id) {\n" +
            "  const [data, setData] = useState(null);\n" +
            "  const [loading, setLoading] = useState(true);\n" +
            "  const [error, setError] = useState(null);\n\n" +
            "  useEffect(() => {\n" +
            "    setLoading(true);\n" +
            "    setError(null);\n" +
            "    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)\n" +
            "      .then((r) => r.json())\n" +
            "      .then((json) => setData(json))\n" +
            "      .catch((err) => setError(err))\n" +
            "      .finally(() => setLoading(false));\n" +
            "  }, [id]);\n\n" +
            "  return { data, loading, error };\n" +
            "}",
          note: "Recibe `id`, guarda `data`, `loading` y `error`, y repite el fetch cada vez que `id` cambia.",
        },
      },
      {
        ex: {
          h: "PokemonCard.jsx — usando el hook",
          code:
            'import { usePokemon } from "./usePokemon";\n\n' +
            "export default function PokemonCard({ id }) {\n" +
            "  const { data, loading, error } = usePokemon(id);\n\n" +
            "  if (loading) return <p>Cargando...</p>;\n" +
            "  if (error) return <p>Error al cargar el Pokémon.</p>;\n\n" +
            "  return (\n" +
            "    <article>\n" +
            "      <h3>{data.name}</h3>\n" +
            "      <img src={data.sprites.front_default} alt={data.name} />\n" +
            "    </article>\n" +
            "  );\n" +
            "}",
          note: "Una sola línea para obtener los datos. El componente no sabe (ni le importa) cómo se piden.",
        },
      },
      { h: "Adaptar un hook a otra API", id: "adaptar" },
      { p: "En proyectos reales cambiarás de API a menudo. La clave es **leer la documentación** y separar lo que cambia de lo que se mantiene:" },
      {
        steps: [
          "Busca el **endpoint**: la URL a la que se hace la petición.",
          "Identifica los **parámetros**: ¿el id va en la ruta (`/recurso/{id}`) o en la query (`?id=`)?",
          "Revisa la **respuesta**: qué campos trae (`name`, `email`…) para usarlos en el JSX.",
          "Cambia **solo** lo necesario (normalmente la URL). Los estados, el `[id]` y el `return` se reutilizan.",
        ],
      },
      {
        ex: {
          h: "Ejemplo: de Pokémon a personajes de Rick y Morty",
          code:
            "// Documentación: GET https://rickandmortyapi.com/api/character/{id}\n\n" +
            "export function useCharacter(id) {\n" +
            "  // ...mismos estados: data, loading, error\n\n" +
            "  useEffect(() => {\n" +
            "    setLoading(true);\n" +
            "    fetch(`https://rickandmortyapi.com/api/character/${id}`) // ← solo cambia esto\n" +
            "      .then((r) => r.json())\n" +
            "      .then((json) => setData(json))\n" +
            "      .catch((err) => setError(err))\n" +
            "      .finally(() => setLoading(false));\n" +
            "  }, [id]); // ← se mantiene: repite al cambiar el id\n\n" +
            "  return { data, loading, error };\n" +
            "}",
          note: "La estructura es idéntica: la URL apunta al nuevo endpoint (con el `{id}` reemplazado por `${id}`) y el resto sigue igual.",
        },
      },
      { callout: { k: "warn", lbl: "Ojo con el endpoint", text: "Muchas APIs distinguen entre **lista** y **detalle**: `/users` devuelve un **array** con todos los usuarios, mientras que `/users/1` devuelve **un solo objeto**. Usa el que corresponde a lo que quieres mostrar." } },
      { demo: "fetch" },
      {
        summary: [
          "Pedir datos es un efecto secundario: va dentro de `useEffect`.",
          "`[id]` → se repite cuando `id` cambia · `[]` → una vez · sin array → cada render (peligro de bucle).",
          "Orden seguro al pintar: **loading → error → data**.",
          "Hook personalizado = función `useAlgo` que agrupa estados + efecto y devuelve `{ data, loading, error }`.",
          "Para otra API: cambia la URL según la documentación; la estructura se reutiliza.",
        ],
      },
    ],
    questions: [
      {
        id: "m3q1", type: "concept", topic: "Para qué sirve useEffect", ref: "efectos",
        prompt: "¿Para qué sirve `useEffect`?",
        options: [
          { id: "a", text: "Para ejecutar efectos secundarios (como pedir datos a una API) en momentos concretos", correct: true, feedback: "`useEffect` ejecuta código **fuera del render**, después de que React pinta: llamadas a APIs, temporizadores, suscripciones a eventos… Con sus dependencias decides *cuándo* se repite." },
          { id: "b", text: "Para aplicar estilos CSS", correct: false, feedback: "Los estilos se aplican con `className`, la prop `style` o archivos CSS. No necesitan un efecto." },
          { id: "c", text: "Para crear botones", correct: false, feedback: "Los botones son JSX normal dentro del `return`. `useEffect` no dibuja nada." },
          { id: "d", text: "Para reemplazar a useState", correct: false, feedback: "No lo reemplaza: se **complementan**. Lo habitual es que el efecto pida datos y los guarde con un setter de `useState`." },
        ],
        teach: "`useEffect` = ejecutar algo “fuera del render”, como llamar a una API.",
        hint: "Piensa en cosas que ocurren *fuera* del dibujado, como traer datos de internet.",
        example: {
          code: 'useEffect(() => {\n  document.title = `(${noLeidos}) Bandeja de entrada`;\n}, [noLeidos]);',
          note: "Cambiar el título de la pestaña cuando llegan mensajes nuevos también es un efecto secundario.",
        },
      },
      {
        id: "m3q2", type: "concept", topic: "Array de dependencias", ref: "deps",
        prompt: "¿Qué significa el `[id]` en `useEffect(() => {...}, [id])`?",
        options: [
          { id: "a", text: "Es el array de dependencias: el efecto se repite cuando id cambia", correct: true, feedback: "React compara `id` con su valor en el render anterior. Si cambió, vuelve a ejecutar el efecto; si no, lo salta. Así, al pasar de un Pokémon a otro, se hace un fetch nuevo automáticamente." },
          { id: "b", text: "Es un error de sintaxis", correct: false, feedback: "Es sintaxis válida y además recomendada: el segundo argumento de `useEffect` es justamente ese array." },
          { id: "c", text: "Hace que corra en bucle infinito", correct: false, feedback: "Al revés: declarar dependencias **evita** el bucle. El bucle aparece cuando **no** hay array y el efecto cambia el estado." },
          { id: "d", text: "Es el valor que devuelve el efecto", correct: false, feedback: "El array no es un valor de retorno. `useEffect` no devuelve datos; lo que el efecto *retorna* (opcionalmente) es una función de limpieza." },
        ],
        teach: "`[deps]`: el efecto se repite solo cuando algo de la lista cambia.",
        hint: "Ese array controla **cuándo** se repite el efecto.",
        example: {
          code: 'const [ciudad, setCiudad] = useState("Lima");\n\nuseEffect(() => {\n  fetch(`/api/clima?ciudad=${ciudad}`)\n    .then((r) => r.json())\n    .then(setClima);\n}, [ciudad]); // nueva petición al elegir otra ciudad',
          note: "Una app del clima: cada vez que el usuario cambia de ciudad, el efecto pide los datos nuevos.",
        },
      },
      {
        id: "m3q3", type: "concept", topic: "Manejo de carga y error", ref: "estados",
        prompt: "Al pintar datos de una API, ¿en qué orden conviene comprobar los estados?",
        options: [
          { id: "a", text: "Primero loading, luego error, y solo al final usar data", correct: true, feedback: "Mientras carga, `data` es `null`; si hubo error, `data` tampoco sirve. Comprobando primero `loading` y luego `error`, cuando llegas a usar `data` es seguro que ya existe." },
          { id: "b", text: "Usar data directamente sin comprobar nada", correct: false, feedback: "En el primer render `data` todavía es `null`, así que `data.name` lanza *No se pueden leer propiedades de null* y la app se rompe." },
          { id: "c", text: "Primero data, luego loading", correct: false, feedback: "Leer `data` antes de saber si terminó de cargar es exactamente lo que provoca el error de `null`. La comprobación de `loading` tiene que ir antes." },
          { id: "d", text: "No hace falta manejar error", correct: false, feedback: "Las redes fallan (sin internet, servidor caído, id inexistente). Sin manejar el error, el usuario se queda con una pantalla rota o en blanco." },
        ],
        teach: "Orden seguro: **loading → error → datos**.",
        hint: "Nunca leas `data` antes de saber que ya llegó.",
        example: {
          code: "function Perfil({ id }) {\n  const { data, loading, error } = useUser(id);\n\n  if (loading) return <Spinner />;\n  if (error) return <Alerta texto=\"No pudimos cargar tu perfil\" />;\n\n  return <h2>Hola, {data.name}</h2>;\n}",
          note: "Las apps profesionales siempre muestran algo durante la carga y un mensaje claro si falla.",
        },
      },
      {
        id: "m3q4", type: "concept", topic: "Efecto sin dependencias", ref: "deps",
        prompt: "¿Qué ocurre con este código?",
        context: [
          {
            kind: "code",
            title: "Noticias.jsx",
            code:
              "const [noticias, setNoticias] = useState([]);\n\n" +
              "useEffect(() => {\n" +
              '  fetch("https://api.ejemplo.com/noticias")\n' +
              "    .then((r) => r.json())\n" +
              "    .then((json) => setNoticias(json));\n" +
              "});",
          },
        ],
        options: [
          { id: "a", text: "Entra en un bucle infinito de peticiones", correct: true, feedback: "Sin array de dependencias el efecto corre **después de cada render**. `setNoticias` provoca un render → el efecto corre otra vez → otro fetch → otro `setNoticias`… La solución es añadir `[]` para pedir las noticias una sola vez." },
          { id: "b", text: "Pide las noticias una sola vez al cargar", correct: false, feedback: "Eso pasaría con `[]` como segundo argumento. Aquí no hay array, así que el efecto se ejecuta tras **cada** render." },
          { id: "c", text: "Da un error de sintaxis", correct: false, feedback: "Es sintaxis válida: el array de dependencias es opcional. Por eso este error es traicionero, ¡no avisa!" },
          { id: "d", text: "Solo vuelve a pedir cuando cambia la URL", correct: false, feedback: "Para eso la URL tendría que estar en el array de dependencias. Sin array, React no compara nada y repite siempre." },
        ],
        teach: "Sin array de dependencias + `setState` dentro del efecto = bucle infinito. Usa `[]` o `[deps]`.",
        hint: "Sigue la cadena: el efecto llama a `setNoticias` → eso provoca un… → y después de cada render, el efecto sin array…",
        example: {
          title: "Versión corregida",
          code: 'useEffect(() => {\n  fetch("https://api.ejemplo.com/noticias")\n    .then((r) => r.json())\n    .then((json) => setNoticias(json));\n}, []); // ← una sola vez, al montar',
          note: "Si ves cientos de peticiones en la pestaña *Red* de las herramientas del navegador (F12), revisa el array de dependencias.",
        },
      },
      /* --- EJERCICIO APLICADO: modificar el hook de Pokémon para traer usuarios --- */
      {
        id: "m3q5", type: "applied", topic: "Modificar un hook para otra API", ref: "adaptar",
        prompt: "Ejercicio práctico. Tienes este hook que trae un **Pokémon** por su id y un componente que lo usa. Ahora quieres que, en vez de Pokémon, traiga **usuarios** de la API documentada abajo. ¿Cuál es la modificación correcta del hook?",
        context: [
          {
            kind: "code",
            title: "usePokemon.js (actual)",
            code:
              'import { useState, useEffect } from "react";\n\n' +
              "export function usePokemon(id) {\n" +
              "  const [data, setData] = useState(null);\n" +
              "  const [loading, setLoading] = useState(true);\n\n" +
              "  useEffect(() => {\n" +
              "    setLoading(true);\n" +
              "    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)\n" +
              "      .then((r) => r.json())\n" +
              "      .then((json) => setData(json))\n" +
              "      .finally(() => setLoading(false));\n" +
              "  }, [id]);\n\n" +
              "  return { data, loading };\n" +
              "}",
          },
          {
            kind: "code",
            title: "Lista.jsx (usa el hook)",
            code:
              "const { data, loading } = usePokemon(id);\n" +
              "if (loading) return <p>Cargando...</p>;\n" +
              "return <h3>{data.name}</h3>;",
          },
          {
            kind: "doc",
            title: "📘 Documentación — API de Usuarios",
            endpoint: "GET https://jsonplaceholder.typicode.com/users/{id}",
            desc: "Devuelve un usuario por su id. Respuesta (campos principales):",
            fields: [
              ["id", "número — identificador del usuario"],
              ["name", "texto — nombre completo"],
              ["email", "texto — correo electrónico"],
              ["phone", "texto — teléfono"],
            ],
          },
        ],
        options: [
          {
            id: "a",
            code:
              "useEffect(() => {\n" +
              "  setLoading(true);\n" +
              "  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n" +
              "    .then((r) => r.json())\n" +
              "    .then((json) => setData(json))\n" +
              "    .finally(() => setLoading(false));\n" +
              "}, [id]);",
            correct: true,
            feedback: "Solo cambia la URL al endpoint de usuarios, reemplazando `{id}` de la documentación por `${id}`. La lógica (estados, `setLoading`, `[id]`) se mantiene. Como la respuesta también tiene `name`, `Lista.jsx` sigue funcionando sin cambios: ahora `data.name` es el nombre del usuario.",
          },
          {
            id: "b",
            code:
              "useEffect(() => {\n" +
              "  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)\n" +
              "    .then((r) => r.json())\n" +
              "    .then((json) => setData(json));\n" +
              "}, [id]);",
            correct: false,
            feedback: "Sigue apuntando a la API de Pokémon, así que traería Pokémon, no usuarios. Además se perdió el manejo de `loading`: la pantalla se quedaría en *Cargando...* para siempre.",
          },
          {
            id: "c",
            code:
              "useEffect(() => {\n" +
              "  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n" +
              "    .then((r) => r.json())\n" +
              "    .then((json) => setData(json));\n" +
              "}, []);",
            correct: false,
            feedback: "Casi: la URL es correcta, pero con `[]` el efecto corre **una sola vez** y no vuelve a buscar cuando cambia el `id` (verías siempre el primer usuario). Además, sin `setLoading(false)` la carga nunca termina. Debe ser `[id]` y conservar el manejo de `loading`.",
          },
          {
            id: "d",
            code:
              "useEffect(() => {\n" +
              "  fetch(`https://jsonplaceholder.typicode.com/users`)\n" +
              "    .then((r) => r.json())\n" +
              "    .then((json) => setData(json));\n" +
              "}, [id]);",
            correct: false,
            feedback: "Sin `/${id}`, ese endpoint devuelve la **lista completa** (un array), no un usuario. `data.name` sería `undefined` porque un array no tiene `name`. Para un solo usuario se usa `/users/${id}`.",
          },
        ],
        teach: "Un hook personalizado bien hecho se adapta a otra API cambiando la URL del fetch: la estructura (estados, `[id]`, `return`) se reutiliza igual.",
        hint: "Compara la URL del fetch con el endpoint de la documentación y revisa las dependencias `[id]`. ¿Qué es lo **único** que debería cambiar?",
        example: {
          title: "Hook final, con nombre acorde a lo que hace",
          code:
            "export function useUser(id) {\n" +
            "  const [data, setData] = useState(null);\n" +
            "  const [loading, setLoading] = useState(true);\n\n" +
            "  useEffect(() => {\n" +
            "    setLoading(true);\n" +
            "    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n" +
            "      .then((r) => r.json())\n" +
            "      .then((json) => setData(json))\n" +
            "      .finally(() => setLoading(false));\n" +
            "  }, [id]);\n\n" +
            "  return { data, loading };\n" +
            "}\n\n" +
            "// En el componente:\n" +
            "// <p>{data.email} · {data.phone}</p>",
          note: "Buena práctica: renombra el hook (`useUser`) para que el nombre diga qué datos trae, y aprovecha los nuevos campos de la documentación.",
        },
      },
    ],
  },

  /* ============ MÓDULO 4 ============ */
  {
    id: "m4",
    num: 4,
    title: "Enrutamiento",
    sub: "react-router-dom · Routes · Link",
    desc: "Crea varias páginas y navega entre ellas sin recargar con react-router-dom.",
    lesson: [
      {
        goals: [
          "Entender qué es una **SPA** y qué problema resuelve el enrutamiento.",
          "Activar el enrutado con `BrowserRouter` en el lugar correcto.",
          "Definir páginas con `Routes` y `Route` (`path` + `element`).",
          "Navegar sin recargar usando `Link` en lugar de `<a>`.",
        ],
      },
      { h: "¿Qué es una SPA?", id: "spa" },
      { p: "En una web tradicional, cada clic en un enlace pide al servidor una **página HTML nueva**: el navegador se queda en blanco, recarga todo y se pierde lo que había en memoria. Una **SPA** (*aplicación de una sola página*) carga una sola vez y, al navegar, **solo cambia el contenido** necesario. Es más rápida y conserva el estado (el carrito, un formulario a medio llenar, la sesión)." },
      { analogy: "Una web tradicional es como **apagar y encender el televisor** cada vez que cambias de canal. Una SPA es usar el **control remoto**: el canal cambia al instante y el televisor sigue encendido." },
      { p: "React por sí solo no trae navegación entre páginas. La librería estándar es **react-router-dom**:" },
      { code: "npm install react-router-dom" },
      { h: "Las piezas principales", id: "piezas" },
      {
        table: {
          head: ["Pieza", "Para qué sirve"],
          rows: [
            ["`BrowserRouter`", "Activa el enrutado. Envuelve **toda** la app, una sola vez."],
            ["`Routes`", "Contenedor que elige **qué** `Route` mostrar según la URL actual."],
            ["`Route`", "Conecta una URL (`path`) con un componente (`element`)."],
            ["`Link`", "Enlace que cambia de página **sin recargar**. Usa el atributo `to`."],
          ],
        },
      },
      { h: "BrowserRouter: activar el enrutado", id: "browserrouter" },
      { p: "`BrowserRouter` se coloca **una sola vez, envolviendo toda la aplicación**, normalmente en `main.jsx`. Todo lo que esté dentro (menú, rutas, enlaces) puede usar el enrutado; lo que quede fuera, no. Si un `Link` o un `Routes` quedan fuera, React lanza un error." },
      {
        code:
          'import ReactDOM from "react-dom/client";\n' +
          'import { BrowserRouter } from "react-router-dom";\n' +
          'import App from "./App";\n\n' +
          'ReactDOM.createRoot(document.getElementById("root")).render(\n' +
          "  <BrowserRouter>\n" +
          "    <App />\n" +
          "  </BrowserRouter>\n" +
          ");",
        file: "main.jsx",
      },
      { h: "Routes y Route: definir las páginas", id: "routes" },
      { p: "Cada `Route` es una regla: *“cuando la URL sea `path`, muestra `element`”*. Todas las `Route` van **dentro de un `<Routes>`**, que se encarga de elegir la que coincide con la URL actual." },
      { code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/productos" element={<Productos />} />\n  <Route path="/contacto" element={<Contacto />} />\n  <Route path="*" element={<NoEncontrado />} /> {/* cualquier otra URL */}\n</Routes>' },
      {
        compare: {
          bad: { code: '<Routes>\n  <Route path="/" component={Inicio} />\n</Routes>\n\n<Route path="/" element={<Inicio />} />\n// ↑ suelta, fuera de <Routes>', note: "`component={Inicio}` era la sintaxis de la versión 5 y ya no funciona. Y un `Route` fuera de `Routes` lanza error." },
          good: { code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n</Routes>', note: "Versión actual (v6+): `element` recibe el componente **ya escrito como JSX**, y cada `Route` va dentro de `Routes`." },
        },
      },
      { h: "Link: navegar sin recargar", id: "link" },
      {
        compare: {
          bad: { code: '<a href="/contacto">Contacto</a>', note: "El navegador pide una página nueva al servidor: **recarga todo** y se pierde el estado de la app (carrito, formularios…)." },
          good: { code: 'import { Link } from "react-router-dom";\n\n<Link to="/contacto">Contacto</Link>', note: "React Router cambia la URL y el contenido **al instante**, sin recargar. El atributo es `to`, no `href`." },
        },
      },
      { callout: { k: "tip", lbl: "Regla práctica", text: "`Link` es para las rutas **de tu propia app** (`/contacto`, `/perfil`). Para ir a **otra web** (`https://react.dev`) se usa un `<a href>` normal: ahí sí queremos que el navegador cargue otra página. Tampoco cambies de página con `window.location.href = …`: también recarga todo." } },
      {
        ex: {
          h: "App.jsx — ejemplo completo",
          code:
            'import { Routes, Route, Link } from "react-router-dom";\n' +
            'import Inicio from "./pages/Inicio";\n' +
            'import Productos from "./pages/Productos";\n' +
            'import Contacto from "./pages/Contacto";\n\n' +
            "export default function App() {\n" +
            "  return (\n" +
            "    <>\n" +
            "      <nav>\n" +
            '        <Link to="/">Inicio</Link>\n' +
            '        <Link to="/productos">Productos</Link>\n' +
            '        <Link to="/contacto">Contacto</Link>\n' +
            "      </nav>\n\n" +
            "      <Routes>\n" +
            '        <Route path="/" element={<Inicio />} />\n' +
            '        <Route path="/productos" element={<Productos />} />\n' +
            '        <Route path="/contacto" element={<Contacto />} />\n' +
            "      </Routes>\n" +
            "    </>\n" +
            "  );\n" +
            "}",
          note: "El menú (`nav`) queda fijo en todas las páginas; solo cambia la zona de `Routes`. Recuerda que `App` está envuelto por `BrowserRouter` en `main.jsx`.",
        },
      },
      { demo: "router" },
      {
        summary: [
          "SPA = cambiar de vista **sin recargar**, conservando el estado.",
          "`BrowserRouter` envuelve **toda** la app, una sola vez (en `main.jsx`).",
          "`<Routes>` contiene varios `<Route path=\"...\" element={<Comp />} />`.",
          "Navega con `<Link to=\"/ruta\">`, no con `<a href>`.",
        ],
      },
    ],
    questions: [
      {
        id: "m4q1", type: "concept", topic: "Qué permite react-router", ref: "spa",
        prompt: "¿Qué permite `react-router-dom`?",
        options: [
          { id: "a", text: "Navegar entre páginas/secciones sin recargar el navegador (SPA)", correct: true, feedback: "React Router asocia URLs con componentes y cambia de vista **al instante**, sin pedir una página nueva al servidor. Así la app se siente rápida y conserva su estado." },
          { id: "b", text: "Guardar datos en una base de datos", correct: false, feedback: "Guardar datos de forma permanente es trabajo de un backend (servidor + base de datos). React Router solo gestiona la navegación en el navegador." },
          { id: "c", text: "Hacer peticiones a APIs", correct: false, feedback: "Las peticiones se hacen con `fetch` (o librerías como axios), normalmente dentro de `useEffect`. Es otro tema (módulo 3)." },
          { id: "d", text: "Crear estados", correct: false, feedback: "El estado se crea con `useState` (módulo 2). React Router no crea estado propio para tus componentes." },
        ],
        teach: "react-router = moverse entre vistas sin recargar.",
        hint: "Sirve para cambiar de vista **sin recargar**.",
        example: {
          code: "// Una tienda online típica:\n/              → <Inicio />\n/productos     → <Catalogo />\n/productos/42  → <DetalleProducto />\n/carrito       → <Carrito />",
          note: "Cada URL muestra un componente distinto, pero la app nunca se recarga: el carrito se mantiene mientras navegas.",
        },
      },
      {
        id: "m4q2", type: "concept", topic: "Link vs a", ref: "link",
        prompt: '¿Cuál es la diferencia entre `<Link to="/x">` y `<a href="/x">`?',
        options: [
          { id: "a", text: "Link cambia de sección sin recargar; <a> recarga toda la web", correct: true, feedback: "`<a>` hace que el navegador pida una página nueva al servidor (recarga completa y se pierde el estado). `Link` intercepta el clic, cambia la URL y deja que React Router muestre el componente correcto al instante." },
          { id: "b", text: "No hay ninguna diferencia", correct: false, feedback: "Sí la hay, y es importante: con `<a>` la página se recarga entera y se pierde todo lo que estaba en memoria (como el carrito o un formulario). Prueba la demo de la lección." },
          { id: "c", text: "<a> es más moderno que Link", correct: false, feedback: "`<a>` es la etiqueta HTML de siempre. Para navegar **dentro** de una SPA, lo adecuado es `Link`. `<a>` se sigue usando para enlaces a **otros sitios** externos." },
          { id: "d", text: "Link solo sirve para imágenes", correct: false, feedback: "`Link` sirve para navegar entre rutas de tu app. Puede envolver texto, imágenes o cualquier otro elemento." },
        ],
        teach: "`Link` = navegación instantánea dentro de la app; `<a>` = recarga completa (úsalo para sitios externos).",
        hint: "Uno recarga toda la web; el otro no.",
        example: {
          code: '<nav>\n  <Link to="/perfil">Mi perfil</Link>          {/* interno: Link */}\n  <a href="https://github.com" target="_blank">\n    GitHub                                     {/* externo: <a> */}\n  </a>\n</nav>',
          note: "Regla práctica: rutas de tu propia app → `Link`; enlaces a otras webs → `<a>`.",
        },
      },
      {
        id: "m4q3", type: "concept", topic: "Configurar rutas", ref: "routes",
        prompt: "¿Cuál configura bien las rutas?",
        options: [
          { id: "a", code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/contacto" element={<Contacto />} />\n</Routes>', correct: true, feedback: "Cada `Route` une una URL (`path`) con su componente (`element={<Comp />}`), y todas están dentro de `<Routes>`, que elige la que coincide con la URL actual." },
          { id: "b", code: '<Routes>\n  <Route path="/" component={Inicio} />\n</Routes>', correct: false, feedback: "`component={Inicio}` es la sintaxis de **React Router v5**. En la versión actual (v6+) se usa `element={<Inicio />}`, con el componente escrito como JSX." },
          { id: "c", code: '<Route path="/" element={<Inicio />} />', correct: false, feedback: "La `Route` está bien escrita, pero suelta: en v6+ toda `Route` debe estar **dentro de `<Routes>`**, o React Router lanza un error." },
          { id: "d", code: '<Routes>\n  <Inicio path="/" />\n</Routes>', correct: false, feedback: "Dentro de `Routes` solo pueden ir elementos `<Route>`. El componente se indica en su prop `element`, no poniéndolo directamente." },
        ],
        teach: "`<Routes>` envuelve varios `<Route path=\"...\" element={<Comp />} />`.",
        hint: "Cada `<Route>` usa `path` y `element`, y todas van dentro de `<Routes>`.",
        example: {
          code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/blog" element={<Blog />} />\n  <Route path="/blog/:slug" element={<Articulo />} />\n  <Route path="*" element={<Pagina404 />} />\n</Routes>',
          note: "Un blog real: `:slug` es un parámetro dinámico (`/blog/mi-primer-post`) y `*` atrapa cualquier URL desconocida para mostrar un 404.",
        },
      },
      {
        id: "m4q4", type: "concept", topic: "Dónde va BrowserRouter", ref: "browserrouter",
        prompt: "¿Dónde debe colocarse `<BrowserRouter>`?",
        options: [
          { id: "a", text: "Envolviendo toda la app (menú y rutas van dentro de él)", correct: true, feedback: "`BrowserRouter` crea el “contexto” de navegación. Todo lo que esté dentro (`Routes`, `Link`, menú…) puede usarlo. Se pone **una sola vez**, normalmente envolviendo `<App />` en `main.jsx`." },
          { id: "b", text: "Dentro de cada <Route>, repetido", correct: false, feedback: "Solo debe haber **uno** en toda la app. Anidar varios `BrowserRouter` provoca el error *No se puede renderizar un <Router> dentro de otro <Router>*." },
          { id: "c", text: "No hace falta usarlo", correct: false, feedback: "Sin él, `Routes` y `Link` no tienen contexto de navegación y React Router lanza un error como *useRoutes() solo puede usarse dentro de un <Router>*." },
          { id: "d", text: "Solo alrededor del <h1>", correct: false, feedback: "Si solo envuelve el `<h1>`, el menú y las rutas quedan fuera y no funcionan. Debe envolver **toda** la app." },
        ],
        teach: "`BrowserRouter` envuelve toda la app una sola vez (normalmente en `main.jsx`).",
        hint: "Debe envolver **toda** la app, una sola vez.",
        example: {
          title: "main.jsx de un proyecto real",
          code: 'ReactDOM.createRoot(document.getElementById("root")).render(\n  <React.StrictMode>\n    <BrowserRouter>\n      <App />\n    </BrowserRouter>\n  </React.StrictMode>\n);',
        },
      },
      /* --- EJERCICIO APLICADO: el carrito se vacía al navegar --- */
      {
        id: "m4q5", type: "applied", topic: "Navegar sin perder el estado", ref: "link",
        prompt: "Ejercicio práctico. En esta tienda, cada vez que el usuario va a **Contacto**, la página parpadea en blanco y **el carrito vuelve a 0**. ¿Cómo debe quedar el enlace del menú?",
        context: [
          {
            kind: "code",
            title: "Navbar.jsx (con error)",
            code:
              "function Navbar({ carrito }) {\n" +
              "  return (\n" +
              "    <nav>\n" +
              '      <Link to="/">Inicio</Link>\n' +
              '      <a href="/contacto">Contacto</a>\n' +
              "      <span>🛒 {carrito}</span>\n" +
              "    </nav>\n" +
              "  );\n" +
              "}",
          },
        ],
        options: [
          { id: "a", code: '<Link to="/contacto">Contacto</Link>', correct: true, feedback: "El problema era el `<a href>`: provocaba una recarga completa y el estado del carrito se perdía. Con `Link to`, React Router cambia de página sin recargar y el carrito se conserva." },
          { id: "b", code: '<Link href="/contacto">Contacto</Link>', correct: false, feedback: "`Link` no usa `href`, usa `to`. Con `href` el enlace no sabría a dónde ir." },
          { id: "c", code: '<a to="/contacto">Contacto</a>', correct: false, feedback: "`<a>` es HTML normal y no entiende el atributo `to`: el enlace no llevaría a ninguna parte. Hay que usar el componente `Link`." },
          { id: "d", code: '<Route path="/contacto">Contacto</Route>', correct: false, feedback: "`Route` **define** qué componente mostrar en una URL (va dentro de `Routes`), pero no es un enlace. Para navegar se usa `Link`." },
        ],
        teach: "Si navegar “resetea” la app, busca un `<a href>` interno y cámbialo por `<Link to>`.",
        hint: "Compara el enlace de **Inicio** (que funciona bien) con el de **Contacto**.",
        example: {
          title: "Navbar corregido",
          code: 'import { Link } from "react-router-dom";\n\nfunction Navbar({ carrito }) {\n  return (\n    <nav>\n      <Link to="/">Inicio</Link>\n      <Link to="/contacto">Contacto</Link>\n      <span>🛒 {carrito}</span>\n    </nav>\n  );\n}',
        },
      },
    ],
  },
];

export function totalQuestions() {
  return MODULES.reduce((n, m) => n + m.questions.length, 0);
}
