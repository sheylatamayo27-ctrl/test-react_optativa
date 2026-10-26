// Versiones alternativas de cada pregunta del test.
// Cada pregunta original (en modules.js) es un "hueco": en cada intento se elige al azar
// UNA de sus versiones (la original o una de estas). Todas las versiones de un hueco evalúan
// el mismo concepto, con otro código o enfoque, para que repetir el test no sea memorizar.
//
// Cada versión indica con `slot` el id de la pregunta original a la que sustituye.
// Mismos campos que las preguntas de modules.js (ref, teach, hint, example…).

export const VARIANTS = {
  /* ============ MÓDULO 1: Componentes y Listas ============ */
  m1: [
    // --- Hueco m1q1: qué devuelve un componente ---
    {
      id: "m1q1b", slot: "m1q1", type: "concept", topic: "Componente sin return", ref: "componente",
      prompt: "Este componente no muestra nada en pantalla. ¿Cuál es el problema?",
      context: [{ kind: "code", title: "Tarjeta.jsx", code: 'function Tarjeta() {\n  const titulo = "Bienvenida";\n  <h2>{titulo}</h2>;\n}' }],
      options: [
        { id: "a", text: "Le falta el `return`: el JSX se crea pero el componente no lo devuelve, así que React no tiene nada que pintar", correct: true, feedback: "Un componente muestra **lo que devuelve**. Sin `return`, la función termina devolviendo `undefined` y React no dibuja nada, aunque el JSX esté bien escrito." },
        { id: "b", text: "El nombre `Tarjeta` debería ir en minúscula", correct: false, feedback: "Es al revés: los componentes **deben** empezar con mayúscula para que React los distinga de las etiquetas HTML. El nombre está bien." },
        { id: "c", text: "No se pueden declarar variables dentro de un componente", correct: false, feedback: "Sí se puede: un componente es una función normal y puede tener variables, cálculos y lógica antes del `return`." },
        { id: "d", text: "Falta envolver el `<h2>` en un `<div>`", correct: false, feedback: "Un solo `<h2>` ya es un elemento raíz válido. El problema no es la estructura, sino que el JSX nunca se devuelve." },
      ],
      teach: "Lo que React pinta es lo que el componente **retorna**. Sin `return`, no se ve nada.",
      hint: "¿Qué hace la función con el `<h2>` después de crearlo?",
      example: { title: "Versión corregida", code: 'function Tarjeta() {\n  const titulo = "Bienvenida";\n  return <h2>{titulo}</h2>;\n}' },
    },
    {
      id: "m1q1c", slot: "m1q1", type: "concept", topic: "Componente válido", ref: "componente",
      prompt: "¿Cuál de estos es un componente de React válido?",
      options: [
        { id: "a", code: 'function Avatar() {\n  return <img src="foto.png" alt="Foto de perfil" />;\n}', correct: true, feedback: "Nombre en mayúscula, devuelve JSX y la etiqueta `<img />` está cerrada. Cumple todo lo que React espera de un componente." },
        { id: "b", code: 'function avatar() {\n  return <img src="foto.png" alt="Foto de perfil" />;\n}', correct: false, feedback: "Al escribirlo como `<avatar />`, React lo trataría como una etiqueta HTML desconocida (en minúscula), no como tu componente. Los componentes empiezan con **mayúscula**." },
        { id: "c", code: 'function Avatar() {\n  return { src: "foto.png" };\n}', correct: false, feedback: "Devuelve un objeto de datos, no interfaz. React lanzaría *Los objetos no son válidos como hijo de React*. Un componente devuelve **JSX**." },
        { id: "d", code: 'function Avatar() {\n  console.log("foto.png");\n}', correct: false, feedback: "Solo escribe en la consola y no devuelve nada (`undefined`): en pantalla no aparece ninguna imagen." },
      ],
      teach: "Componente válido = nombre con mayúscula + `return` de JSX.",
      hint: "Revisa dos cosas: la primera letra del nombre y qué devuelve cada función.",
      example: { code: '// Uso del componente en otra parte de la app:\n<Avatar />' },
    },

    // --- Hueco m1q2: para qué sirve key ---
    {
      id: "m1q2b", slot: "m1q2", type: "concept", topic: "Índice como key", ref: "key",
      prompt: "En una lista de tareas con un campo de texto en cada fila usas `key={i}` (el índice). ¿Qué puede pasar al **agregar una tarea al inicio**?",
      options: [
        { id: "a", text: "React puede confundir las filas: el texto escrito en una tarea aparece en otra", correct: true, feedback: "Con el índice como key, la nueva tarea recibe la key `0`, que antes era de otra. React reutiliza esa fila con su contenido y el texto “salta” a la tarea equivocada. Es justo lo que muestra la demo de la lección." },
        { id: "b", text: "Nada: el índice es siempre la mejor key", correct: false, feedback: "El índice solo es seguro si la lista nunca cambia de orden ni de tamaño. Si agregas o quitas elementos, la posición deja de identificar a cada elemento." },
        { id: "c", text: "La lista se ordena al revés automáticamente", correct: false, feedback: "`key` no ordena nada. El problema es de identidad: React deja de saber qué fila es cuál." },
        { id: "d", text: "El código no compila por un error de sintaxis", correct: false, feedback: "`key={i}` es sintaxis válida y compila. El fallo aparece después, en el comportamiento, cuando la lista cambia." },
      ],
      teach: "Si la lista puede cambiar, usa un `id` estable como key, no el índice.",
      hint: "Al agregar al inicio, todas las posiciones se desplazan una. ¿Qué pasa con la key de cada fila?",
      example: { code: '{tareas.map((t) => (\n  <TareaItem key={t.id} tarea={t} />  // ✓ id estable\n))}' },
    },
    {
      id: "m1q2c", slot: "m1q2", type: "concept", topic: "Elegir una buena key", ref: "key",
      prompt: "Tienes una lista de alumnos que viene de una base de datos. ¿Cuál es la mejor `key`?",
      options: [
        { id: "a", text: "El id del alumno (`alumno.id`), porque es único y no cambia", correct: true, feedback: "Un identificador de la base de datos es **único** y **estable**: el mismo alumno tiene siempre la misma key, aunque la lista se reordene o se filtre." },
        { id: "b", text: "`Math.random()`, para que nunca se repita", correct: false, feedback: "Cambia en **cada render**: React creería que todos los alumnos son nuevos y los destruiría y volvería a crear siempre. Una key debe ser estable." },
        { id: "c", text: "El nombre del alumno, porque es lo que se ve en pantalla", correct: false, feedback: "Los nombres se pueden repetir (dos alumnas llamadas “María”). Si dos keys coinciden, React vuelve a confundir los elementos." },
        { id: "d", text: "El índice del array (`i`)", correct: false, feedback: "Depende de la posición: si se reordena o se borra un alumno, las keys cambian de dueño. Mejor un `id`." },
      ],
      teach: "Buena key = **única** entre hermanos y **estable** en el tiempo (normalmente el `id`).",
      hint: "Busca algo que no se repita entre alumnos y que no cambie nunca.",
      example: { code: '{alumnos.map((a) => (\n  <li key={a.id}>{a.nombre}</li>\n))}' },
    },

    // --- Hueco m1q3: recibir props ---
    {
      id: "m1q3b", slot: "m1q3", type: "concept", topic: "Mostrar una prop", ref: "props",
      prompt: 'El padre escribe `<Producto nombre="Teclado" precio={50} />`. ¿Qué versión del hijo muestra el precio?',
      options: [
        { id: "a", code: "function Producto({ nombre, precio }) {\n  return <p>{nombre}: {precio} €</p>;\n}", correct: true, feedback: "Desestructuras las dos props por su nombre y las muestras entre llaves. En pantalla: “Teclado: 50 €”." },
        { id: "b", code: "function Producto(precio) {\n  return <p>{precio} €</p>;\n}", correct: false, feedback: "Sin llaves, `precio` es el **objeto props completo** (`{ nombre, precio }`). Intentar mostrar un objeto hace que React lance un error." },
        { id: "c", code: "function Producto({ nombre, precio }) {\n  return <p>precio €</p>;\n}", correct: false, feedback: "Sin llaves `{ }`, `precio` es texto literal: en pantalla saldría la palabra “precio”, no el número." },
        { id: "d", code: "function Producto({ nombre, precio }) {\n  precio = 60;\n  return <p>{precio} €</p>;\n}", correct: false, feedback: "Modifica la prop dentro del hijo. Las props son de **solo lectura**: el valor lo decide el padre." },
      ],
      teach: "Las props llegan en un objeto: desestructura `{ nombre, precio }` y muéstralas con `{ }`.",
      hint: "Dos cosas: cómo se recibe la prop y cómo se muestra un valor dentro del JSX.",
      example: { code: '<Producto nombre="Mouse" precio={20} />\n<Producto nombre="Monitor" precio={180} />' },
    },
    {
      id: "m1q3c", slot: "m1q3", type: "concept", topic: "Qué es el objeto props", ref: "props",
      prompt: "¿Qué recibe exactamente un componente en su primer parámetro?",
      options: [
        { id: "a", text: "Un único objeto con todas las props que le pasó el padre", correct: true, feedback: "Todas las props llegan juntas en **un objeto**. Por eso puedes escribir `props.titulo` o desestructurar `{ titulo }` directamente." },
        { id: "b", text: "Un array con las props en el orden en que se escribieron", correct: false, feedback: "No es un array: el orden no importa. Es un objeto donde cada prop es una propiedad con su nombre." },
        { id: "c", text: "Solo la primera prop que escribió el padre", correct: false, feedback: "Llegan **todas** en el mismo objeto, no solo la primera." },
        { id: "d", text: "Nada: las props se leen de una variable global llamada `props`", correct: false, feedback: "No hay ninguna variable global: las props llegan como **parámetro** de la función del componente." },
      ],
      teach: "Props = **un objeto** con todo lo que envía el padre.",
      hint: "Piensa en cómo se accede a ellas: `props.algo`.",
      example: { code: '<Saludo nombre="Ana" edad={21} />\n\n// El componente recibe: { nombre: "Ana", edad: 21 }\nfunction Saludo({ nombre, edad }) { ... }' },
    },

    // --- Hueco m1q4: map con key ---
    {
      id: "m1q4b", slot: "m1q4", type: "concept", topic: "Pintar tareas con map", ref: "map",
      prompt: 'Tienes `const tareas = [{ id: 1, texto: "Estudiar" }, { id: 2, texto: "Practicar" }]`. ¿Cuál pinta un `<li>` por tarea?',
      options: [
        { id: "a", code: "{tareas.map((t) => <li key={t.id}>{t.texto}</li>)}", correct: true, feedback: "`.map()` devuelve un `<li>` por tarea, con su `id` como key y su `texto` como contenido." },
        { id: "b", code: "{tareas.map((t) => <li key={t.id}>{tareas.texto}</li>)}", correct: false, feedback: "Usa `tareas.texto`, que es el **array** (no tiene `texto`): sale `undefined` y los `<li>` aparecen vacíos. Hay que usar cada elemento: `t.texto`." },
        { id: "c", code: "{tareas.map((t) => { <li key={t.id}>{t.texto}</li> })}", correct: false, feedback: "Con **llaves** `{ }` la función flecha necesita `return`. Sin él devuelve `undefined` y la lista sale vacía." },
        { id: "d", code: "{tareas.forEach((t) => <li key={t.id}>{t.texto}</li>)}", correct: false, feedback: "`.forEach()` no devuelve nada (`undefined`): React no recibe elementos que pintar." },
      ],
      teach: "Dentro de `.map()` usa **cada elemento** (`t`) y devuelve el JSX (con paréntesis o con `return`).",
      hint: "Fíjate en tres cosas: el método, si la función devuelve algo y de dónde sale `texto`.",
      example: { code: "{tareas.map((t) => {\n  const hecha = t.completada ? \"✓ \" : \"\";\n  return <li key={t.id}>{hecha}{t.texto}</li>;  // con llaves → return\n})}" },
    },
    {
      id: "m1q4c", slot: "m1q4", type: "concept", topic: "Qué devuelve map", ref: "map",
      prompt: '¿Qué devuelve `["Ana", "Luis"].map((n) => <b>{n}</b>)`?',
      options: [
        { id: "a", text: "Un array con dos elementos `<b>`, que React puede pintar", correct: true, feedback: "`.map()` crea un **array nuevo** con el resultado de cada vuelta: `[<b>Ana</b>, <b>Luis</b>]`. React sabe dibujar arrays de elementos." },
        { id: "b", text: "`undefined`", correct: false, feedback: "Eso es lo que devuelve `.forEach()`. `.map()` siempre devuelve un array nuevo." },
        { id: "c", text: "Un solo `<b>` con los dos nombres juntos", correct: false, feedback: "Se crea un elemento **por cada** nombre, no uno con todo el texto." },
        { id: "d", text: "El mismo array original, sin cambios", correct: false, feedback: "`.map()` no modifica el original: devuelve uno **nuevo** con los valores transformados (aquí, en JSX)." },
      ],
      teach: "`.map()` transforma un array de datos en un array de elementos JSX.",
      hint: "Piensa en `[1, 2, 3].map(n => n * 2)`: ¿qué devuelve?",
      example: { code: "const numeros = [1, 2, 3];\nnumeros.map((n) => n * 2);           // [2, 4, 6]\nnumeros.map((n) => <span>{n}</span>); // [<span/>, <span/>, <span/>]" },
    },

    // --- Hueco m1q5: ejercicio aplicado de listas ---
    {
      id: "m1q5b", slot: "m1q5", type: "applied", topic: "Aviso de key en comentarios", ref: "key",
      prompt: "Ejercicio práctico. Esta lista de comentarios se ve bien, pero la consola muestra un aviso. ¿Cuál es la mejor corrección?",
      context: [
        { kind: "code", title: "Comentarios.jsx", code: "function Comentarios({ lista }) {\n  return (\n    <ul>\n      {lista.map((c) => (\n        <li>{c.autor}: {c.texto}</li>\n      ))}\n    </ul>\n  );\n}" },
        { kind: "console", lines: [
          { t: '⚠ Aviso: cada hijo de una lista debe tener una prop "key" única.', k: "muted" },
          { t: "> console.log(lista)" },
          { t: '[{ id: "c1", autor: "Ana", texto: "¡Genial!" }, { id: "c2", autor: "Ana", texto: "Gracias" }]' },
        ] },
      ],
      options: [
        { id: "a", code: "<li key={c.id}>{c.autor}: {c.texto}</li>", correct: true, feedback: "Cada comentario tiene un `id` único y estable (`c1`, `c2`): es la key ideal. El aviso desaparece y React identifica bien cada fila." },
        { id: "b", code: "<li key={c.autor}>{c.autor}: {c.texto}</li>", correct: false, feedback: "Mira los datos: **Ana** escribió dos comentarios. Las keys se repetirían y React seguiría avisando y confundiendo elementos." },
        { id: "c", code: '<ul key="lista">\n  {lista.map((c) => <li>{c.autor}: {c.texto}</li>)}\n</ul>', correct: false, feedback: "La key se pone en **cada elemento** que devuelve `.map()` (los `<li>`), no en el contenedor." },
        { id: "d", code: "<li key={Math.random()}>{c.autor}: {c.texto}</li>", correct: false, feedback: "Quita el aviso, pero la key cambia en cada render: React recrea todas las filas siempre. Debe ser estable." },
      ],
      teach: "La key va en cada elemento de la lista y debe ser única y estable: usa el `id` de los datos.",
      hint: "Revisa los datos de la consola: ¿qué campo es único para cada comentario?",
      example: { title: "Versión final", code: "{lista.map((c) => (\n  <li key={c.id}>{c.autor}: {c.texto}</li>\n))}" },
    },
    {
      id: "m1q5c", slot: "m1q5", type: "applied", topic: "Lista con nombres vacíos", ref: "map",
      prompt: "Ejercicio práctico. Esta lista muestra los puntos de cada miembro del equipo, pero **sin el nombre**. No hay errores en consola. ¿Cuál es la corrección?",
      context: [
        { kind: "code", title: "Equipo.jsx", code: "function Equipo({ miembros }) {\n  return (\n    <ul>\n      {miembros.map((m) => (\n        <li key={m.id}>{m.name}</li>\n      ))}\n    </ul>\n  );\n}" },
        { kind: "console", lines: [
          { t: "> console.log(miembros)" },
          { t: '[{ id: 1, nombre: "Ana" }, { id: 2, nombre: "Luis" }, { id: 3, nombre: "Sofía" }]' },
        ] },
      ],
      options: [
        { id: "a", code: "<li key={m.id}>{m.nombre}</li>", correct: true, feedback: "Los datos tienen el campo `nombre`, no `name`. `m.name` es `undefined`, y React no pinta nada para `undefined`: por eso los `<li>` salen vacíos." },
        { id: "b", code: "<li key={m.id}>{miembros.nombre}</li>", correct: false, feedback: "`miembros` es el array completo, que no tiene `nombre`. Hay que usar cada elemento: `m.nombre`." },
        { id: "c", code: "<li key={m.id}>m.nombre</li>", correct: false, feedback: "Sin llaves `{ }` es texto literal: se vería “m.nombre” escrito en cada fila." },
        { id: "d", code: '<li key={m.id}>{m["name"]}</li>', correct: false, feedback: "Es lo mismo que `m.name`, con otra sintaxis: sigue siendo un campo que no existe en los datos." },
      ],
      teach: "Usa exactamente los nombres de campo que tienen tus datos; un campo inexistente da `undefined` y no se ve nada.",
      hint: "Compara el campo que usa el código con los que aparecen en la consola.",
      example: { title: "Truco para depurar", code: "{miembros.map((m) => {\n  console.log(m); // mira qué campos tiene cada elemento\n  return <li key={m.id}>{m.nombre}</li>;\n})}" },
    },

    // --- Cuarta versión de cada hueco ---
    {
      id: "m1q1d", slot: "m1q1", type: "concept", topic: "Un solo elemento raíz", ref: "jsx",
      prompt: "Este componente no compila: *Los elementos JSX adyacentes deben ir envueltos en una etiqueta contenedora*. ¿Cuál es la corrección?",
      context: [{ kind: "code", title: "Perfil.jsx", code: "function Perfil() {\n  return (\n    <h2>Ana Torres</h2>\n    <p>Desarrolladora web</p>\n  );\n}" }],
      options: [
        { id: "a", code: "function Perfil() {\n  return (\n    <>\n      <h2>Ana Torres</h2>\n      <p>Desarrolladora web</p>\n    </>\n  );\n}", correct: true, feedback: "Un componente devuelve **un solo elemento raíz**. El fragmento `<>...</>` agrupa el `<h2>` y el `<p>` sin añadir ninguna etiqueta extra al HTML final (un `<div>` también valdría)." },
        { id: "b", code: "function Perfil() {\n  return <h2>Ana Torres</h2>;\n  return <p>Desarrolladora web</p>;\n}", correct: false, feedback: "El primer `return` termina la función: el segundo nunca se ejecuta y el `<p>` no aparece. Hay que devolver **todo junto** dentro de un elemento." },
        { id: "c", code: "function Perfil() {\n  return \"<h2>Ana Torres</h2><p>Desarrolladora web</p>\";\n}", correct: false, feedback: "Entre comillas es un **texto**, no JSX: en pantalla saldrían las etiquetas escritas tal cual, como letras." },
        { id: "d", code: "function Perfil() {\n  return (\n    <h2>Ana Torres</h2>,\n    <p>Desarrolladora web</p>\n  );\n}", correct: false, feedback: "Compila, pero la coma de JavaScript se queda solo con el **último** valor: se vería el `<p>` y el `<h2>` desaparecería. Hace falta un elemento padre." },
      ],
      teach: "Si devuelves varios elementos, envuélvelos en **un padre**: un fragmento `<>...</>` o un `<div>`.",
      hint: "El error pide “una etiqueta contenedora”: una que envuelva a las demás.",
      example: { code: "function Tarjeta() {\n  return (\n    <div className=\"tarjeta\">\n      <h3>Título</h3>\n      <p>Descripción</p>\n    </div>\n  );\n}" },
    },
    {
      id: "m1q2d", slot: "m1q2", type: "concept", topic: "Dónde colocar la key", ref: "key",
      prompt: "Pintas una lista con `{productos.map((p) => <Tarjeta producto={p} />)}` y la consola avisa de que falta la `key`. ¿Dónde debe ir?",
      options: [
        { id: "a", code: "{productos.map((p) => <Tarjeta key={p.id} producto={p} />)}", correct: true, feedback: "La key va en el **elemento que devuelve `.map()`**, aquí `<Tarjeta />`. Así React identifica cada tarjeta de la lista." },
        { id: "b", code: "function Tarjeta({ producto }) {\n  return <div key={producto.id}>{producto.nombre}</div>;\n}", correct: false, feedback: "Dentro de `Tarjeta` ya es tarde: React necesita la key en el elemento de la lista, es decir, en `<Tarjeta />` dentro del `.map()`. El aviso seguiría apareciendo." },
        { id: "c", code: "<div key=\"productos\">\n  {productos.map((p) => <Tarjeta producto={p} />)}\n</div>", correct: false, feedback: "La key en el contenedor no sirve: cada **hijo** de la lista necesita la suya, distinta de la de sus hermanos." },
        { id: "d", code: "{productos.map((p) => <Tarjeta producto={p} />)}  // con componentes propios no hace falta", correct: false, feedback: "Hace falta igual: da lo mismo que sea un `<li>` o un componente tuyo. Todo elemento creado en una lista necesita `key`." },
      ],
      teach: "La `key` se pone en el elemento **más externo que devuelve `.map()`**, aunque sea un componente propio.",
      hint: "¿Qué elemento se repite una vez por producto?",
      example: { code: "{productos.map((p) => (\n  <Tarjeta key={p.id} producto={p} />\n))}" },
    },
    {
      id: "m1q3d", slot: "m1q3", type: "concept", topic: "Enviar props desde el padre", ref: "props",
      prompt: "El hijo es `function Saludo({ nombre, edad })`. ¿Cómo debe usarlo el padre para mostrar a **Luis, de 20 años**?",
      options: [
        { id: "a", code: '<Saludo nombre="Luis" edad={20} />', correct: true, feedback: "Cada prop se escribe como un atributo con **el mismo nombre** que espera el hijo. El texto va entre comillas y el número entre llaves." },
        { id: "b", code: '<Saludo name="Luis" age={20} />', correct: false, feedback: "Los nombres no coinciden: el hijo espera `nombre` y `edad`, así que ambos llegarían como `undefined` y no se mostraría nada." },
        { id: "c", code: "<Saludo>Luis, 20</Saludo>", correct: false, feedback: "Lo que va entre las etiquetas llega como `children`, no como `nombre` y `edad`. El hijo seguiría sin recibir sus props." },
        { id: "d", code: '<Saludo props={{ nombre: "Luis", edad: 20 }} />', correct: false, feedback: "Así se envía **una** prop llamada `props`. El hijo desestructura `nombre` y `edad`, que llegarían como `undefined`." },
      ],
      teach: "El padre envía las props como atributos, con los **mismos nombres** que desestructura el hijo.",
      hint: "Compara los nombres que espera el hijo con los atributos de cada opción.",
      example: { code: '<Saludo nombre="Ana" edad={21} />\n<Saludo nombre="Luis" edad={20} />' },
    },
    {
      id: "m1q4d", slot: "m1q4", type: "concept", topic: "Numerar una lista con map", ref: "map",
      prompt: 'Con `const ranking = ["Ana", "Luis", "Sofía"]` quieres mostrar “1. Ana”, “2. Luis” y “3. Sofía”. ¿Qué `.map()` lo consigue?',
      options: [
        { id: "a", code: "{ranking.map((nombre, i) => <li key={nombre}>{i + 1}. {nombre}</li>)}", correct: true, feedback: "`.map()` pasa a la función el elemento **y su posición** (`i`, que empieza en 0). Sumando 1 se numera desde 1." },
        { id: "b", code: "{ranking.map((nombre, i) => <li key={nombre}>{i}. {nombre}</li>)}", correct: false, feedback: "La posición empieza en **0**: saldría “0. Ana”, “1. Luis”… Hay que mostrar `i + 1`." },
        { id: "c", code: "{ranking.map((i, nombre) => <li key={i}>{i + 1}. {nombre}</li>)}", correct: false, feedback: "Los parámetros están al revés: el **primero** es siempre el elemento y el segundo la posición. Aquí `i` sería “Ana” y saldría “Ana1. 0”." },
        { id: "d", code: "{ranking.map((nombre) => <li key={nombre}>{i + 1}. {nombre}</li>)}", correct: false, feedback: "La función no recibe `i`: la variable no existe y React lanza *Error de referencia: i no está definida*." },
      ],
      teach: "`.map((elemento, posicion) => ...)`: el segundo parámetro es la posición, que empieza en 0.",
      hint: "¿En qué número empieza JavaScript a contar las posiciones de un array?",
      example: { code: "{ranking.map((nombre, i) => (\n  <li key={nombre}>\n    {i === 0 ? \"🥇 \" : \"\"}{i + 1}. {nombre}\n  </li>\n))}" },
    },
    {
      id: "m1q5d", slot: "m1q5", type: "applied", topic: "Prop con nombre distinto", ref: "props",
      prompt: "Ejercicio práctico. Esta lista de usuarios se rompe al cargar. Revisa los dos archivos y el error. ¿Cuál es la corrección?",
      context: [
        { kind: "code", title: "ListaUsuarios.jsx", code: "function ListaUsuarios({ users }) {\n  return (\n    <div>\n      {users.map((u) => (\n        <UserCard key={u.id} user={u} />\n      ))}\n    </div>\n  );\n}" },
        { kind: "code", title: "UserCard.jsx", code: "function UserCard({ usuario }) {\n  return <h3>{usuario.nombre}</h3>;\n}" },
        { kind: "console", lines: [{ t: "✕ Error de tipo: no se pueden leer propiedades de undefined (leyendo 'nombre')" }] },
      ],
      options: [
        { id: "a", code: "function UserCard({ user }) {\n  return <h3>{user.nombre}</h3>;\n}", correct: true, feedback: "El padre envía la prop `user`, pero el hijo leía `usuario`, que no existe y vale `undefined`. Con el mismo nombre (`user`), la tarjeta recibe los datos." },
        { id: "b", code: "function UserCard(user) {\n  return <h3>{user.nombre}</h3>;\n}", correct: false, feedback: "Sin llaves, `user` es el **objeto props completo** (`{ user: {...} }`). `user.nombre` sería `undefined` y las tarjetas saldrían vacías." },
        { id: "c", code: "function UserCard({ usuario }) {\n  return <h3>{usuario}</h3>;\n}", correct: false, feedback: "Desaparece el error, pero `usuario` sigue siendo `undefined`: no se muestra ningún nombre. El problema es el nombre de la prop." },
        { id: "d", code: "{users.map((u) => (\n  <UserCard key={u.id} {u} />\n))}", correct: false, feedback: "`{u}` suelto no es una prop válida: da un error de sintaxis. Cada prop necesita un nombre, como `user={u}`." },
      ],
      teach: "El nombre de la prop debe coincidir: lo que el padre envía como `user={...}` el hijo lo recibe como `{ user }`.",
      hint: "Compara el atributo de `<UserCard ... />` con lo que desestructura `UserCard`.",
      example: { title: "Las dos piezas encajan", code: "// Padre\n<UserCard key={u.id} user={u} />\n\n// Hijo\nfunction UserCard({ user }) {\n  return <h3>{user.nombre}</h3>;\n}" },
    },
  ],

  /* ============ MÓDULO 2: Estado con useState ============ */
  m2: [
    // --- Hueco m2q1: qué hace useState ---
    {
      id: "m2q1b", slot: "m2q1", type: "concept", topic: "Cuándo usar estado", ref: "estado",
      prompt: "¿En cuál de estos casos **sí** necesitas estado (`useState`)?",
      options: [
        { id: "a", text: "Un contador de “Me gusta” que aumenta al pulsar un botón", correct: true, feedback: "El número cambia mientras el usuario usa la app y la pantalla debe reflejarlo: es exactamente para lo que sirve el estado." },
        { id: "b", text: "El título fijo de la página, que nunca cambia", correct: false, feedback: "Si un valor nunca cambia, basta con escribirlo en el JSX o en una constante. El estado es para datos que **cambian**." },
        { id: "c", text: "El número de días de la semana (7) para un cálculo", correct: false, feedback: "Es un valor constante: una `const` normal es suficiente." },
        { id: "d", text: "El texto de un botón que siempre dice “Enviar”", correct: false, feedback: "No cambia nunca, así que no necesita estado: va directo en el JSX." },
      ],
      teach: "Usa estado solo para datos que **cambian** y deben verse actualizados en pantalla.",
      hint: "¿Cuál de estos valores cambia mientras el usuario usa la app?",
      example: { code: "const [likes, setLikes] = useState(0);\n\n<button onClick={() => setLikes(likes + 1)}>❤ {likes}</button>" },
    },
    {
      id: "m2q1c", slot: "m2q1", type: "concept", topic: "Por qué no sirve let", ref: "variable",
      prompt: "¿Por qué una variable normal (`let`) no sirve para guardar un valor que cambia en pantalla?",
      options: [
        { id: "a", text: "Porque al cambiarla React no vuelve a renderizar, y además se reinicia en cada render", correct: true, feedback: "Son los dos problemas: React no se entera del cambio (no repinta) y, si algo provoca un render, `let x = 0` se vuelve a ejecutar y el valor se pierde." },
        { id: "b", text: "Porque `let` no existe en JavaScript moderno", correct: false, feedback: "`let` es JavaScript moderno y se usa mucho. El problema es que React no observa las variables normales." },
        { id: "c", text: "Porque las variables solo pueden guardar texto", correct: false, feedback: "Las variables pueden guardar cualquier tipo de dato. La limitación es que no provocan un nuevo render." },
        { id: "d", text: "Sí sirve: React detecta cualquier cambio de variable automáticamente", correct: false, feedback: "React **no** vigila las variables normales; solo reacciona cuando llamas a un setter de estado." },
      ],
      teach: "Variable normal: React no se entera y se reinicia en cada render. Para eso existe `useState`.",
      hint: "Recuerda la demo de la lección: el contador con `let` se quedaba en 0.",
      example: { code: "let clicks = 0;                          // ✕ no actualiza la pantalla\nconst [clicks, setClicks] = useState(0); // ✓" },
    },

    // --- Hueco m2q2: declarar estado ---
    {
      id: "m2q2b", slot: "m2q2", type: "concept", topic: "Estado numérico inicial", ref: "usestate",
      prompt: "Declara un estado `contador` que empiece en **0** para poder sumarle 1:",
      options: [
        { id: "a", code: "const [contador, setContador] = useState(0);", correct: true, feedback: "Valor actual, setter y valor inicial numérico `0`. Ahora `contador + 1` da 1." },
        { id: "b", code: "const [contador, setContador] = useState();", correct: false, feedback: "Sin valor inicial, `contador` empieza en `undefined` y `undefined + 1` da `NaN`." },
        { id: "c", code: 'const [contador, setContador] = useState("0");', correct: false, feedback: 'Empieza como **texto** `"0"`: `"0" + 1` da `"01"` (une textos), no 1.' },
        { id: "d", code: "const { contador, setContador } = useState(0);", correct: false, feedback: "`useState` devuelve un **array**, así que se desestructura con corchetes `[ ]`. Con llaves de objeto ambos serían `undefined`." },
      ],
      teach: "`useState(valorInicial)`: el tipo del valor inicial importa (número, texto, booleano…).",
      hint: "Fíjate en los corchetes y en el tipo del valor inicial.",
      example: { code: 'const [cantidad, setCantidad] = useState(1);\nconst [nombre, setNombre] = useState("");\nconst [visible, setVisible] = useState(false);' },
    },
    {
      id: "m2q2c", slot: "m2q2", type: "concept", topic: "Qué es el setter", ref: "usestate",
      prompt: 'Tras `const [nombre, setNombre] = useState("Ana")`, ¿qué es `setNombre`?',
      options: [
        { id: "a", text: "La función que cambia el valor de `nombre` y provoca un nuevo render", correct: true, feedback: "Es el **setter**: al llamarlo (`setNombre(\"Luis\")`) React guarda el nuevo valor y vuelve a dibujar el componente." },
        { id: "b", text: "Una copia del valor de `nombre`", correct: false, feedback: "La copia del valor es `nombre`. `setNombre` es una **función** para cambiarlo." },
        { id: "c", text: 'El valor inicial, `"Ana"`', correct: false, feedback: '`"Ana"` es solo el valor con el que empieza `nombre`.' },
        { id: "d", text: "Una función que devuelve el valor actual", correct: false, feedback: "Para leer el valor se usa `nombre` directamente. `setNombre` sirve para **cambiarlo**." },
      ],
      teach: "`[valor, setValor]`: el primero se lee y el segundo se llama para cambiarlo.",
      hint: "El prefijo `set` da una pista de para qué sirve.",
      example: { code: '<input value={nombre} onChange={(e) => setNombre(e.target.value)} />' },
    },

    // --- Hueco m2q3: onClick ---
    {
      id: "m2q3b", slot: "m2q3", type: "concept", topic: "Mensaje al pulsar", ref: "onclick",
      prompt: "Quieres que el botón muestre un mensaje **solo al pulsarlo**. ¿Cuál es correcto?",
      options: [
        { id: "a", code: '<button onClick={() => setMensaje("Enviado")}>Enviar</button>', correct: true, feedback: "La función flecha se entrega a React y se ejecuta **solo al hacer clic**." },
        { id: "b", code: '<button onClick={setMensaje("Enviado")}>Enviar</button>', correct: false, feedback: "Se ejecuta **al dibujar** el botón: cambia el estado, se vuelve a dibujar, se ejecuta otra vez… *Demasiados re-renders*." },
        { id: "c", code: '<button onclick={() => setMensaje("Enviado")}>Enviar</button>', correct: false, feedback: "En React los eventos van en camelCase: `onClick`, con **C mayúscula**. `onclick` no funciona y React muestra un aviso." },
        { id: "d", code: "<button onClick=\"setMensaje('Enviado')\">Enviar</button>", correct: false, feedback: "Es un **texto**, no una función. React espera una función en `onClick` y lanza un error." },
      ],
      teach: "`onClick={() => accion()}`: camelCase y una función que se ejecuta al hacer clic.",
      hint: "Tres detalles: cómo se escribe el evento, si es una función y cuándo se ejecuta.",
      example: { code: 'const [mensaje, setMensaje] = useState("");\n\n<button onClick={() => setMensaje("Enviado ✓")}>Enviar</button>\n<p>{mensaje}</p>' },
    },
    {
      id: "m2q3c", slot: "m2q3", type: "concept", topic: "Pasar la función o ejecutarla", ref: "onclick",
      prompt: "¿Cuál es la diferencia entre `onClick={guardar}` y `onClick={guardar()}`?",
      options: [
        { id: "a", text: "La primera pasa la función para que React la ejecute al hacer clic; la segunda la ejecuta en el momento de dibujar", correct: true, feedback: "`guardar` (sin paréntesis) es la función; `guardar()` es **llamarla ya**. A `onClick` hay que darle la función, no su resultado." },
        { id: "b", text: "Ninguna, son equivalentes", correct: false, feedback: "Son muy distintas: los paréntesis ejecutan la función inmediatamente, mientras el componente se dibuja." },
        { id: "c", text: "La primera da error porque faltan los paréntesis", correct: false, feedback: "`onClick={guardar}` es correcto: pasas la referencia a la función y React la llama al hacer clic." },
        { id: "d", text: "La segunda espera al clic y la primera no", correct: false, feedback: "Es al revés: `guardar()` se ejecuta enseguida, al dibujar." },
      ],
      teach: "`onClick={fn}` o `onClick={() => fn(x)}` ✓ · `onClick={fn()}` ✕ (se ejecuta al dibujar).",
      hint: "Recuerda la analogía del número de teléfono: ¿dejas el número o llamas ahora?",
      example: { code: "function guardar() { /* ... */ }\n\n<button onClick={guardar}>Guardar</button>              // ✓ sin argumentos\n<button onClick={() => borrar(id)}>Borrar</button>      // ✓ con argumentos" },
    },

    // --- Hueco m2q4: re-render ---
    {
      id: "m2q4b", slot: "m2q4", type: "concept", topic: "Valor tras el setter", ref: "rerender",
      prompt: "Un componente tiene `const [n, setN] = useState(5)`. Al pulsar un botón se ejecuta `setN(6)`. ¿Qué valor tiene `n` en el siguiente render?",
      options: [
        { id: "a", text: "6", correct: true, feedback: "El setter guarda el nuevo valor y React vuelve a ejecutar el componente: esta vez `useState` devuelve 6." },
        { id: "b", text: "5, porque `useState` siempre devuelve el valor inicial", correct: false, feedback: "El valor inicial (5) solo se usa en el **primer** render. Después, `useState` devuelve el último valor guardado." },
        { id: "c", text: "`undefined`", correct: false, feedback: "El estado no se pierde entre renders: React lo recuerda. Por eso existe `useState`." },
        { id: "d", text: "11 (5 + 6)", correct: false, feedback: "El setter **reemplaza** el valor, no lo suma. Para sumar habría que escribir `setN(n + 6)`." },
      ],
      teach: "El valor inicial solo cuenta la primera vez; después `useState` devuelve el último valor guardado.",
      hint: "¿El setter suma o reemplaza?",
      example: { code: "const [n, setN] = useState(5);\n\nsetN(6);      // n pasa a 6\nsetN(n + 1);  // n pasa a n + 1" },
    },
    {
      id: "m2q4c", slot: "m2q4", type: "concept", topic: "Qué actualiza React", ref: "rerender",
      prompt: "Cuando cambia el estado de un componente, ¿qué hace React con la pantalla?",
      options: [
        { id: "a", text: "Vuelve a ejecutar el componente y actualiza en el navegador solo lo que cambió", correct: true, feedback: "React compara el JSX nuevo con el anterior y toca **solo** las partes distintas. Por eso es eficiente." },
        { id: "b", text: "Recarga la página entera", correct: false, feedback: "No hay recarga: el resto de la página y el estado de los demás componentes se mantienen." },
        { id: "c", text: "Borra todo el contenido y lo crea de nuevo desde cero", correct: false, feedback: "React evita eso precisamente: actualiza solo lo necesario." },
        { id: "d", text: "Nada: hay que llamar a mano a una función `render()`", correct: false, feedback: "No hace falta: llamar al setter ya provoca el nuevo render automáticamente." },
      ],
      teach: "Estado nuevo → React re-ejecuta el componente → actualiza solo lo que cambió.",
      hint: "Recuerda el último paso del ciclo del re-render en la lección.",
      example: { code: "// Solo cambia el texto del <b>; el resto del DOM queda igual\n<p>Color elegido: <b>{color}</b></p>" },
    },

    // --- Hueco m2q5: ejercicio aplicado de estado ---
    {
      id: "m2q5b", slot: "m2q5", type: "applied", topic: "Mostrar y ocultar detalles", ref: "variable",
      prompt: "Ejercicio práctico. Este botón debería mostrar y ocultar un texto, pero al pulsarlo **no pasa nada**. ¿Cuál es la versión correcta?",
      context: [{ kind: "code", title: "Detalles.jsx (con error)", code: 'function Detalles() {\n  let abierto = false;\n\n  return (\n    <div>\n      <button onClick={() => (abierto = !abierto)}>\n        {abierto ? "Ocultar" : "Mostrar"}\n      </button>\n      {abierto && <p>Información extra</p>}\n    </div>\n  );\n}' }],
      options: [
        { id: "a", code: "const [abierto, setAbierto] = useState(false);\n\n<button onClick={() => setAbierto(!abierto)}>", correct: true, feedback: "Pasas el valor a estado y lo cambias con su setter dentro de una flecha. Cada clic invierte `abierto` y React vuelve a dibujar." },
        { id: "b", code: "const [abierto, setAbierto] = useState(false);\n\n<button onClick={() => (abierto = !abierto)}>", correct: false, feedback: "Hay estado, pero se sigue cambiando a mano. Eso no avisa a React (y con `const` da error). Hay que usar `setAbierto`." },
        { id: "c", code: "const [abierto, setAbierto] = useState(false);\n\n<button onClick={setAbierto(!abierto)}>", correct: false, feedback: "Sin flecha, `setAbierto` se ejecuta al dibujar: bucle infinito (*Demasiados re-renders*)." },
        { id: "d", code: "let abierto = true;\n\n<button onClick={() => (abierto = !abierto)}>", correct: false, feedback: "Solo cambia el valor con el que empieza. Sigue siendo una variable normal que React no observa." },
      ],
      teach: "Mostrar/ocultar = estado booleano + `setX(!x)` en el `onClick`.",
      hint: "Es el mismo problema que el contador con `let`, pero con un booleano.",
      example: { title: "Versión final", code: 'function Detalles() {\n  const [abierto, setAbierto] = useState(false);\n  return (\n    <div>\n      <button onClick={() => setAbierto(!abierto)}>\n        {abierto ? "Ocultar" : "Mostrar"}\n      </button>\n      {abierto && <p>Información extra</p>}\n    </div>\n  );\n}' },
    },
    {
      id: "m2q5c", slot: "m2q5", type: "applied", topic: "Botón + del carrito", ref: "onclick",
      prompt: "Ejercicio práctico. En este carrito, el botón **+** no cambia la cantidad. ¿Cómo debe quedar el botón?",
      context: [{ kind: "code", title: "Carrito.jsx (con error)", code: "function Carrito() {\n  const [cantidad, setCantidad] = useState(1);\n\n  return (\n    <div>\n      <p>Cantidad: {cantidad}</p>\n      <button onClick={() => cantidad + 1}>+</button>\n    </div>\n  );\n}" }],
      options: [
        { id: "a", code: "<button onClick={() => setCantidad(cantidad + 1)}>+</button>", correct: true, feedback: "`cantidad + 1` solo **calcula** un número y lo descarta. Hay que pasárselo al setter para que React guarde el nuevo valor y vuelva a dibujar." },
        { id: "b", code: "<button onClick={() => cantidad++}>+</button>", correct: false, feedback: "Intenta modificar el estado a mano (y `cantidad` es `const`, así que da error). El estado solo se cambia con `setCantidad`." },
        { id: "c", code: "<button onClick={setCantidad(cantidad + 1)}>+</button>", correct: false, feedback: "Sin flecha se ejecuta al dibujar y provoca un bucle infinito." },
        { id: "d", code: "<button onClick={() => setCantidad(cantidad)}>+</button>", correct: false, feedback: "Llama al setter con el **mismo** valor: la cantidad no cambia nunca." },
      ],
      teach: "Calcular un valor no basta: hay que pasarlo al setter (`setX(nuevoValor)`).",
      hint: "¿Qué hace el código actual con el resultado de `cantidad + 1`?",
      example: { code: "<button onClick={() => setCantidad(cantidad - 1)}>−</button>\n<span>{cantidad}</span>\n<button onClick={() => setCantidad(cantidad + 1)}>+</button>" },
    },

    // --- Cuarta versión de cada hueco ---
    {
      id: "m2q1d", slot: "m2q1", type: "concept", topic: "El estado se recuerda", ref: "estado",
      prompt: "React vuelve a ejecutar la función de un componente (re-render). ¿Qué pasa con un valor guardado con `useState`?",
      options: [
        { id: "a", text: "React lo recuerda: `useState` devuelve el último valor guardado, no el inicial", correct: true, feedback: "El valor inicial solo se usa **la primera vez**. En los siguientes renders, `useState` devuelve lo último que guardaste con el setter. Por eso el estado “sobrevive” a cada re-render." },
        { id: "b", text: "Vuelve al valor inicial, porque la función se ejecuta desde el principio", correct: false, feedback: "Eso le pasa a una variable normal (`let`). El estado lo guarda React fuera de la función, así que no se reinicia." },
        { id: "c", text: "Se pierde y pasa a valer `undefined`", correct: false, feedback: "No se pierde: React conserva el estado mientras el componente esté en pantalla." },
        { id: "d", text: "Se guarda automáticamente en `localStorage`", correct: false, feedback: "`useState` guarda el valor en la memoria de React, no en el navegador. Si recargas la página, el estado vuelve a empezar." },
      ],
      teach: "El estado **persiste entre renders**: el valor inicial solo se usa la primera vez.",
      hint: "¿Qué diferencia hay entre una variable `let` y el estado cuando el componente se vuelve a ejecutar?",
      example: { code: "const [likes, setLikes] = useState(0);\n// 1.er render: likes = 0\n// tras setLikes(1): likes = 1 (no vuelve a 0)" },
    },
    {
      id: "m2q2d", slot: "m2q2", type: "concept", topic: "Estado con una lista", ref: "usestate",
      prompt: "Declara un estado `tareas` que empiece como una **lista vacía**, para luego pintarla con `.map()`:",
      options: [
        { id: "a", code: "const [tareas, setTareas] = useState([]);", correct: true, feedback: "Valor inicial `[]`: un array vacío. `tareas.map(...)` funciona desde el primer render (no pinta nada hasta que agregues tareas)." },
        { id: "b", code: "const [tareas, setTareas] = useState();", correct: false, feedback: "Sin valor inicial, `tareas` empieza en `undefined` y `tareas.map(...)` lanza *No se pueden leer propiedades de undefined (leyendo 'map')*." },
        { id: "c", code: "const [setTareas, tareas] = useState([]);", correct: false, feedback: "El orden está al revés: `useState` devuelve **primero el valor** y después el setter." },
        { id: "d", code: "const tareas = useState([]);", correct: false, feedback: "`useState` devuelve un **par** `[valor, setter]`. Aquí `tareas` sería ese par, no la lista, y no tendrías cómo actualizarla." },
      ],
      teach: "El valor inicial define el tipo del estado: para una lista, empieza con `[]`.",
      hint: "¿Qué valor inicial representa una lista sin elementos?",
      example: { code: 'const [tareas, setTareas] = useState([]);\n\n// Agregar una tarea: array nuevo con las anteriores + la nueva\nsetTareas([...tareas, { id: 1, texto: "Estudiar" }]);' },
    },
    {
      id: "m2q3d", slot: "m2q3", type: "concept", topic: "Botones de sumar y restar", ref: "onclick",
      prompt: "Con `const [cantidad, setCantidad] = useState(1)`, ¿qué par de botones hace que **+** sume 1 y **−** reste 1?",
      options: [
        { id: "a", code: "<button onClick={() => setCantidad(cantidad + 1)}>+</button>\n<button onClick={() => setCantidad(cantidad - 1)}>−</button>", correct: true, feedback: "Cada botón recibe una **función flecha** que React ejecuta al hacer clic, y dentro se llama al setter con el valor nuevo." },
        { id: "b", code: "<button onClick={() => cantidad + 1}>+</button>\n<button onClick={() => cantidad - 1}>−</button>", correct: false, feedback: "Calcula el número, pero **no lo guarda**: sin llamar a `setCantidad`, React no se entera y la pantalla no cambia." },
        { id: "c", code: "<button onClick={() => setCantidad(cantidad++)}>+</button>\n<button onClick={() => setCantidad(cantidad--)}>−</button>", correct: false, feedback: "`cantidad++` intenta modificar la constante directamente y lanza *Asignación a una variable constante*. El estado solo se cambia con el setter: `cantidad + 1`." },
        { id: "d", code: "<button onClick={setCantidad(cantidad + 1)}>+</button>\n<button onClick={setCantidad(cantidad - 1)}>−</button>", correct: false, feedback: "Sin `() =>`, el setter se **ejecuta al pintar** el botón, no al pulsarlo: cada render cambia el estado y provoca otro render (*Demasiados re-renders*)." },
      ],
      teach: "En `onClick` va una **función** (`() => setX(...)`), y el estado se cambia siempre con su setter.",
      hint: "Dos preguntas para cada opción: ¿se ejecuta al hacer clic? ¿llama al setter?",
      example: { code: "<button onClick={() => setCantidad(cantidad - 1)} disabled={cantidad === 1}>−</button>\n<span>{cantidad}</span>\n<button onClick={() => setCantidad(cantidad + 1)}>+</button>" },
    },
    {
      id: "m2q4d", slot: "m2q4", type: "concept", topic: "Leer el estado tras el setter", ref: "rerender",
      prompt: "Con `n` valiendo **0**, al pulsar el botón se ejecuta esta función. ¿Qué muestra la consola?",
      context: [{ kind: "code", title: "Contador.jsx", code: "const [n, setN] = useState(0);\n\nfunction sumar() {\n  setN(n + 1);\n  console.log(n);\n}" }],
      options: [
        { id: "a", text: "`0`: el setter no cambia `n` al instante; el valor nuevo llega en el siguiente render", correct: true, feedback: "`setN` **programa** una actualización. Durante esta ejecución `n` sigue valiendo 0; en el siguiente render `useState` devolverá 1 y la pantalla mostrará 1." },
        { id: "b", text: "`1`, porque `setN` cambia la variable inmediatamente", correct: false, feedback: "Es el error más común. `n` es una constante de **este** render: el setter no la modifica, solo pide a React un render nuevo con el valor 1." },
        { id: "c", text: "`undefined`, porque el estado se borra al llamar al setter", correct: false, feedback: "El estado no se borra: `n` sigue valiendo 0 hasta el siguiente render." },
        { id: "d", text: "Nada: `console.log` no funciona dentro de un componente", correct: false, feedback: "`console.log` funciona en cualquier parte del componente y es una forma muy útil de depurar." },
      ],
      teach: "El setter no cambia la variable al momento: **programa un re-render** en el que el estado ya tendrá el valor nuevo.",
      hint: "Repasa el ciclo del re-render: ¿en qué paso devuelve `useState` el valor nuevo?",
      example: { title: "Si necesitas el valor nuevo, calcúlalo antes", code: "function sumar() {\n  const siguiente = n + 1;\n  setN(siguiente);\n  console.log(siguiente); // 1\n}" },
    },
    {
      id: "m2q5d", slot: "m2q5", type: "applied", topic: "Marcador con dos estados", ref: "usestate",
      prompt: "Ejercicio práctico. En este marcador, al pulsar **Gol visitante** el gol se suma al equipo **local**. ¿Cómo debe quedar ese botón?",
      context: [
        { kind: "code", title: "Marcador.jsx", code: "function Marcador() {\n  const [local, setLocal] = useState(0);\n  const [visitante, setVisitante] = useState(0);\n\n  return (\n    <div>\n      <p>Local {local} - {visitante} Visitante</p>\n      <button onClick={() => setLocal(local + 1)}>Gol local</button>\n      <button onClick={() => setLocal(local + 1)}>Gol visitante</button>\n    </div>\n  );\n}" },
      ],
      options: [
        { id: "a", code: "<button onClick={() => setVisitante(visitante + 1)}>Gol visitante</button>", correct: true, feedback: "Cada estado tiene **su propio setter**. El botón del visitante debe llamar a `setVisitante` y partir del valor de `visitante`." },
        { id: "b", code: "<button onClick={() => setLocal(visitante + 1)}>Gol visitante</button>", correct: false, feedback: "Sigue usando `setLocal`: guardaría en el marcador **local** los goles del visitante más uno. El setter decide qué estado cambia." },
        { id: "c", code: "<button onClick={() => (visitante = visitante + 1)}>Gol visitante</button>", correct: false, feedback: "`visitante` es una constante: asignarle un valor lanza *Asignación a una variable constante*. El estado se cambia con `setVisitante`." },
        { id: "d", code: "<button onClick={() => setVisitante(local + 1)}>Gol visitante</button>", correct: false, feedback: "El setter es el correcto, pero parte de `local`: si el local lleva 3, el visitante pasaría a 4 de golpe. Hay que sumar sobre `visitante`." },
      ],
      teach: "Con varios estados, cada uno se cambia con **su** setter y a partir de **su** valor.",
      hint: "¿Qué setter llama el botón y sobre qué valor suma?",
      example: { title: "Marcador corregido", code: "<button onClick={() => setLocal(local + 1)}>Gol local</button>\n<button onClick={() => setVisitante(visitante + 1)}>Gol visitante</button>" },
    },
  ],

  /* ============ MÓDULO 3: Hooks y Consumo de APIs ============ */
  m3: [
    // --- Hueco m3q1: para qué sirve useEffect ---
    {
      id: "m3q1b", slot: "m3q1", type: "concept", topic: "Qué va en un efecto", ref: "efectos",
      prompt: "¿Cuál de estas tareas debería ir dentro de un `useEffect`?",
      options: [
        { id: "a", text: "Pedir la lista de productos a una API al abrir la página", correct: true, feedback: "Pedir datos a un servidor es un **efecto secundario**: ocurre fuera del render y por eso va en `useEffect`." },
        { id: "b", text: "Calcular el total de un carrito para mostrarlo", correct: false, feedback: "Un cálculo con datos que ya tienes se hace directamente en el cuerpo del componente, durante el render. No necesita un efecto." },
        { id: "c", text: "Escribir el JSX de un botón", correct: false, feedback: "El JSX va en el `return` del componente. `useEffect` no dibuja nada." },
        { id: "d", text: "Declarar un estado con `useState`", correct: false, feedback: "Los hooks se llaman en el cuerpo del componente, nunca dentro de otro hook como `useEffect`." },
      ],
      teach: "En `useEffect` va lo que habla con el “mundo exterior”: APIs, temporizadores, título de la pestaña…",
      hint: "¿Cuál de estas tareas depende de algo externo al componente?",
      example: { code: 'useEffect(() => {\n  fetch("/api/productos")\n    .then((r) => r.json())\n    .then(setProductos);\n}, []);' },
    },
    {
      id: "m3q1c", slot: "m3q1", type: "concept", topic: "Cuándo corre un efecto", ref: "efectos",
      prompt: "¿Cuándo se ejecuta el código de un `useEffect`?",
      options: [
        { id: "a", text: "Después de que React pinta el componente en pantalla (y de nuevo si cambian sus dependencias)", correct: true, feedback: "Primero se dibuja el componente y **después** corre el efecto. Si declaraste dependencias, se repite cuando alguna cambia." },
        { id: "b", text: "Antes de que el componente exista", correct: false, feedback: "Al contrario: el efecto corre cuando el componente ya está en pantalla." },
        { id: "c", text: "Solo cuando el usuario hace clic", correct: false, feedback: "Eso es un manejador de eventos (`onClick`). `useEffect` se ejecuta tras el render, sin necesidad de clic." },
        { id: "d", text: "En el servidor, antes de enviar la página al navegador", correct: false, feedback: "`useEffect` se ejecuta en el **navegador**, después de pintar." },
      ],
      teach: "`useEffect` corre **después** del render, y otra vez cuando cambian sus dependencias.",
      hint: "Recuerda la analogía del chef: ¿el mercado va antes o después de emplatar?",
      example: { code: 'useEffect(() => {\n  console.log("El componente ya está en pantalla");\n}, []);' },
    },

    // --- Hueco m3q2: array de dependencias ---
    {
      id: "m3q2b", slot: "m3q2", type: "concept", topic: "Ejecutar una sola vez", ref: "deps",
      prompt: "Quieres pedir los datos **una sola vez**, cuando aparece el componente. ¿Cuál es correcto?",
      options: [
        { id: "a", code: "useEffect(() => {\n  cargarDatos();\n}, []);", correct: true, feedback: "Con un array **vacío** `[]` no hay nada que pueda cambiar: el efecto corre solo al montar el componente." },
        { id: "b", code: "useEffect(() => {\n  cargarDatos();\n});", correct: false, feedback: "Sin array, el efecto corre después de **cada** render. Si `cargarDatos` guarda en el estado, provoca un bucle." },
        { id: "c", code: "useEffect(() => {\n  cargarDatos();\n}, [datos]);", correct: false, feedback: "Se repetiría cada vez que cambie `datos`. Si `cargarDatos` actualiza `datos`, entra en bucle." },
        { id: "d", code: "useEffect([], () => {\n  cargarDatos();\n});", correct: false, feedback: "Los argumentos están al revés: primero va la **función** y después el array de dependencias." },
      ],
      teach: "`useEffect(fn, [])` → una sola vez, al montar el componente.",
      hint: "¿Qué array no tiene nada que pueda cambiar?",
      example: { code: 'useEffect(() => {\n  document.title = "Mi tienda";\n}, []); // solo al abrir' },
    },
    {
      id: "m3q2c", slot: "m3q2", type: "concept", topic: "Cambio de dependencia", ref: "deps",
      prompt: "Tienes un efecto con dependencias `[ciudad]` que pide el clima de esa ciudad. El usuario cambia de “Lima” a “Quito”. ¿Qué ocurre?",
      context: [{ kind: "code", title: "Clima.jsx", code: "useEffect(() => {\n  fetch(`/api/clima/${ciudad}`)\n    .then((r) => r.json())\n    .then(setClima);\n}, [ciudad]);" }],
      options: [
        { id: "a", text: "El efecto se vuelve a ejecutar y pide el clima de Quito", correct: true, feedback: "`ciudad` está en las dependencias: React detecta que cambió y repite el efecto con el valor nuevo." },
        { id: "b", text: "No pasa nada: el efecto solo corre la primera vez", correct: false, feedback: "Eso pasaría con `[]`. Con `[ciudad]`, el efecto se repite cada vez que `ciudad` cambia." },
        { id: "c", text: "Entra en un bucle infinito", correct: false, feedback: "No: solo se repite cuando cambia `ciudad`, y guardar el clima no cambia `ciudad`." },
        { id: "d", text: "Da un error porque `ciudad` cambió", correct: false, feedback: "Cambiar una dependencia es lo normal; para eso existe el array." },
      ],
      teach: "Cada valor del array de dependencias que cambie vuelve a ejecutar el efecto.",
      hint: "¿Qué hay dentro del array del efecto?",
      example: { code: '<select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>\n  <option>Lima</option>\n  <option>Quito</option>\n</select>' },
    },

    // --- Hueco m3q3: carga, error y datos ---
    {
      id: "m3q3b", slot: "m3q3", type: "concept", topic: "Error al leer data", ref: "estados",
      prompt: "Este componente se rompe al cargar con *No se pueden leer propiedades de null (leyendo 'title')*. ¿Por qué?",
      context: [{ kind: "code", title: "Post.jsx", code: "function Post({ id }) {\n  const { data, loading } = usePost(id);\n  return <h2>{data.title}</h2>;\n}" }],
      options: [
        { id: "a", text: "En el primer render `data` todavía es `null`: falta comprobar `loading` antes de usar `data`", correct: true, feedback: "Los datos tardan en llegar. Mientras tanto `data` es `null` y `null.title` rompe la app. Hay que mostrar algo mientras `loading` sea `true`." },
        { id: "b", text: "La API no tiene un campo `title`", correct: false, feedback: "Si faltara el campo, `data.title` daría `undefined` sin error. El error dice que **`data` es `null`**." },
        { id: "c", text: "`usePost` debería escribirse con mayúscula", correct: false, feedback: "Los hooks se nombran con `use` en minúscula. El nombre está bien." },
        { id: "d", text: "Falta poner `key` en el `<h2>`", correct: false, feedback: "`key` solo hace falta en elementos de una lista. No tiene relación con este error." },
      ],
      teach: "Antes de usar `data`, comprueba `loading` (y `error`): al principio `data` es `null`.",
      hint: "¿Qué valor tiene `data` en el primer instante, antes de que responda la API?",
      example: { title: "Versión corregida", code: "const { data, loading } = usePost(id);\n\nif (loading) return <p>Cargando...</p>;\nreturn <h2>{data.title}</h2>;" },
    },
    {
      id: "m3q3c", slot: "m3q3", type: "concept", topic: "Qué mostrar al cargar", ref: "estados",
      prompt: "¿Qué debería ver el usuario mientras `loading` es `true`?",
      options: [
        { id: "a", text: "Un mensaje o indicador de carga, como “Cargando...”", correct: true, feedback: "Así el usuario sabe que algo está pasando, y el componente no intenta usar datos que aún no existen." },
        { id: "b", text: "Los datos de la API", correct: false, feedback: "Mientras `loading` es `true` los datos **aún no han llegado**: intentar mostrarlos rompería la app." },
        { id: "c", text: "Un mensaje de error", correct: false, feedback: "Cargar no es un error. El mensaje de error se muestra solo si la petición falla." },
        { id: "d", text: "Nada, la página en blanco", correct: false, feedback: "Funciona, pero el usuario no sabe si la app está cargando o rota. Siempre conviene dar una señal de carga." },
      ],
      teach: "`loading` → indicador de carga · `error` → aviso · si no → datos.",
      hint: "Piensa en qué ves tú cuando una app tarda en cargar.",
      example: { code: 'if (loading) return <Spinner texto="Cargando productos..." />;' },
    },

    // --- Hueco m3q4: bucles con efectos ---
    {
      id: "m3q4b", slot: "m3q4", type: "concept", topic: "Dependencia que causa bucle", ref: "deps",
      prompt: "¿Qué pasa con este código?",
      context: [{ kind: "code", title: "Perfil.jsx", code: 'const [usuario, setUsuario] = useState(null);\n\nuseEffect(() => {\n  fetch("/api/perfil")\n    .then((r) => r.json())\n    .then((json) => setUsuario(json));\n}, [usuario]);' }],
      options: [
        { id: "a", text: "Entra en bucle: cada `setUsuario` guarda un objeto nuevo, `usuario` cambia y el efecto vuelve a pedir el perfil", correct: true, feedback: "El efecto depende del mismo valor que modifica. Cada respuesta crea un objeto nuevo → `usuario` cambia → el efecto se repite → otra petición… La dependencia correcta aquí es `[]`." },
        { id: "b", text: "Pide el perfil una sola vez", correct: false, feedback: "Con `[usuario]` se repite cada vez que `usuario` cambia, y el propio efecto lo cambia." },
        { id: "c", text: "Nunca pide el perfil, porque `usuario` empieza en `null`", correct: false, feedback: "El efecto siempre corre al montar, sea cual sea el valor inicial. El problema es lo que pasa después." },
        { id: "d", text: "Da un error de sintaxis", correct: false, feedback: "La sintaxis es válida. El problema es de lógica: un efecto que modifica su propia dependencia." },
      ],
      teach: "Un efecto no debe depender del mismo estado que modifica: provoca un bucle.",
      hint: "Sigue la cadena: el efecto llama a `setUsuario` → `usuario` cambia → …",
      example: { title: "Versión corregida", code: 'useEffect(() => {\n  fetch("/api/perfil")\n    .then((r) => r.json())\n    .then((json) => setUsuario(json));\n}, []); // una sola vez' },
    },
    {
      id: "m3q4c", slot: "m3q4", type: "concept", topic: "Detectar el bucle", ref: "deps",
      prompt: "¿Cuál de estos efectos provoca un **bucle infinito**?",
      options: [
        { id: "a", code: "useEffect(() => {\n  setTotal(total + 1);\n});", correct: true, feedback: "Sin array, corre tras **cada** render, y cada vez cambia el estado → nuevo render → otra vez… bucle infinito." },
        { id: "b", code: "useEffect(() => {\n  setTotal(10);\n}, []);", correct: false, feedback: "Con `[]` corre una sola vez. Cambia el estado una vez y ahí termina." },
        { id: "c", code: 'useEffect(() => {\n  document.title = "Inicio";\n});', correct: false, feedback: "Corre tras cada render, pero **no cambia el estado**, así que no provoca nuevos renders. No hay bucle." },
        { id: "d", code: "useEffect(() => {\n  console.log(total);\n}, [total]);", correct: false, feedback: "Solo lee `total` y lo muestra. Se repite cuando `total` cambia, pero no lo modifica: no hay bucle." },
      ],
      teach: "Bucle = efecto que cambia el estado y se vuelve a ejecutar por ese mismo cambio.",
      hint: "Busca el efecto que **modifica** el estado y no tiene nada que lo frene.",
      example: { code: "// ✓ se repite solo cuando cambia 'precio'\nuseEffect(() => {\n  setConIva(precio * 1.21);\n}, [precio]);" },
    },

    // --- Hueco m3q5: adaptar un hook a otra API ---
    {
      id: "m3q5b", slot: "m3q5", type: "applied", topic: "De usuarios a publicaciones", ref: "adaptar",
      prompt: "Ejercicio práctico. Este hook trae **usuarios**. Ahora necesitas uno que traiga **publicaciones** (posts) de la API documentada abajo. ¿Cuál es la modificación correcta del efecto?",
      context: [
        { kind: "code", title: "useUser.js (actual)", code: 'export function useUser(id) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    setLoading(true);\n    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n      .then((r) => r.json())\n      .then((json) => setData(json))\n      .finally(() => setLoading(false));\n  }, [id]);\n\n  return { data, loading };\n}' },
        { kind: "doc", title: "📘 Documentación — API de Publicaciones", endpoint: "GET https://jsonplaceholder.typicode.com/posts/{id}", desc: "Devuelve una publicación por su id. Respuesta (campos principales):", fields: [["id", "número — identificador de la publicación"], ["title", "texto — título"], ["body", "texto — contenido"], ["userId", "número — autor"]] },
      ],
      options: [
        { id: "a", code: "useEffect(() => {\n  setLoading(true);\n  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)\n    .then((r) => r.json())\n    .then((json) => setData(json))\n    .finally(() => setLoading(false));\n}, [id]);", correct: true, feedback: "Solo cambia la URL al endpoint de publicaciones, con `${id}` en lugar de `{id}`. Estados, `[id]` y manejo de `loading` se mantienen. En el componente mostrarás `data.title` y `data.body`." },
        { id: "b", code: "useEffect(() => {\n  setLoading(true);\n  fetch(`https://jsonplaceholder.typicode.com/posts`)\n    .then((r) => r.json())\n    .then((json) => setData(json))\n    .finally(() => setLoading(false));\n}, [id]);", correct: false, feedback: "Sin `/${id}`, el endpoint devuelve la **lista completa** de publicaciones (un array), no una sola." },
        { id: "c", code: "useEffect(() => {\n  setLoading(true);\n  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)\n    .then((r) => r.json())\n    .then((json) => setData(json))\n    .finally(() => setLoading(false));\n}, []);", correct: false, feedback: "La URL es correcta, pero con `[]` no vuelve a pedir datos cuando cambia el `id`: verías siempre la primera publicación." },
        { id: "d", code: "useEffect(() => {\n  setLoading(true);\n  fetch(`https://jsonplaceholder.typicode.com/users/${id}`)\n    .then((r) => r.json())\n    .then((json) => setData(json.title))\n    .finally(() => setLoading(false));\n}, [id]);", correct: false, feedback: "Sigue pidiendo **usuarios**: los usuarios no tienen `title`, así que guardaría `undefined`. Hay que cambiar el endpoint." },
      ],
      teach: "Para otra API: cambia la URL según la documentación y conserva estados y dependencias.",
      hint: "Compara la URL del fetch con el endpoint de la documentación.",
      example: { title: "Hook final", code: "export function usePost(id) {\n  // ...mismos estados\n  useEffect(() => {\n    setLoading(true);\n    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)\n      .then((r) => r.json())\n      .then((json) => setData(json))\n      .finally(() => setLoading(false));\n  }, [id]);\n  return { data, loading };\n}" },
    },
    {
      id: "m3q5c", slot: "m3q5", type: "applied", topic: "De personajes a episodios", ref: "adaptar",
      prompt: "Ejercicio práctico. Tienes un hook que trae **personajes** de Rick y Morty. Ahora quieres traer **episodios** según la documentación de abajo. ¿Qué `fetch` es el correcto?",
      context: [
        { kind: "code", title: "useCharacter.js (actual)", code: "useEffect(() => {\n  setLoading(true);\n  fetch(`https://rickandmortyapi.com/api/character/${id}`)\n    .then((r) => r.json())\n    .then((json) => setData(json))\n    .finally(() => setLoading(false));\n}, [id]);" },
        { kind: "doc", title: "📘 Documentación — Episodios", endpoint: "GET https://rickandmortyapi.com/api/episode/{id}", desc: "Devuelve un episodio por su id. Respuesta (campos principales):", fields: [["id", "número — identificador"], ["name", "texto — título del episodio"], ["air_date", "texto — fecha de emisión"], ["episode", "texto — código, p. ej. S01E01"]] },
      ],
      options: [
        { id: "a", code: "fetch(`https://rickandmortyapi.com/api/episode/${id}`)", correct: true, feedback: "Ruta del endpoint de episodios con el `id` insertado mediante `${id}` dentro de las comillas invertidas. El resto del hook (estados y `[id]`) se queda igual." },
        { id: "b", code: "fetch(`https://rickandmortyapi.com/api/episode?id=${id}`)", correct: false, feedback: "La documentación pone el id **en la ruta** (`/episode/{id}`), no como parámetro `?id=`. Esa URL no es la que describe la API." },
        { id: "c", code: 'fetch("https://rickandmortyapi.com/api/episode/{id}")', correct: false, feedback: "Con comillas normales, `{id}` es texto literal: se pediría el episodio llamado “{id}”. Hay que usar comillas invertidas y `${id}`." },
        { id: "d", code: "fetch(`https://rickandmortyapi.com/api/character/${id}`)", correct: false, feedback: "Es la URL actual: seguiría trayendo **personajes**, no episodios." },
      ],
      teach: "`{id}` en la documentación = `${id}` dentro de comillas invertidas en tu código.",
      hint: "Fíjate dónde va el id según la documentación y qué tipo de comillas permite insertar variables.",
      example: { code: "const id = 3;\n`https://rickandmortyapi.com/api/episode/${id}`\n// → \"https://rickandmortyapi.com/api/episode/3\"" },
    },

    // --- Cuarta versión de cada hueco ---
    {
      id: "m3q1d", slot: "m3q1", type: "concept", topic: "Fetch fuera de useEffect", ref: "efectos",
      prompt: "Un compañero pide los datos **directamente en el cuerpo del componente**, sin `useEffect`. ¿Qué ocurre?",
      context: [{ kind: "code", title: "Productos.jsx", code: 'function Productos() {\n  const [lista, setLista] = useState([]);\n\n  fetch("/api/productos")\n    .then((r) => r.json())\n    .then((json) => setLista(json));\n\n  return <p>{lista.length} productos</p>;\n}' }],
      options: [
        { id: "a", text: "Las peticiones no paran: cada render hace un `fetch`, `setLista` provoca otro render, y vuelta a empezar", correct: true, feedback: "El cuerpo del componente se ejecuta en **cada** render. Al llegar los datos, `setLista` guarda un array nuevo y React vuelve a ejecutar la función, que vuelve a pedir los datos. Por eso las peticiones a un servidor van dentro de `useEffect`." },
        { id: "b", text: "Funciona igual que con `useEffect(..., [])`: pide los datos una sola vez", correct: false, feedback: "Fuera de `useEffect` no hay forma de decir “solo una vez”: el código corre cada vez que React ejecuta el componente." },
        { id: "c", text: "React lo detecta y muestra un error de sintaxis", correct: false, feedback: "La sintaxis es válida y compila. El problema aparece al ejecutarse: peticiones repetidas sin fin." },
        { id: "d", text: "No pide nada, porque un componente no puede usar `fetch`", correct: false, feedback: "Sí puede: `fetch` es una función normal del navegador. El problema es **cuándo** se ejecuta." },
      ],
      teach: "Las tareas “de fuera” (pedir datos, temporizadores…) van en `useEffect`, no en el cuerpo del componente.",
      hint: "¿Cuántas veces se ejecuta el cuerpo de un componente? ¿Qué provoca `setLista`?",
      example: { title: "Versión correcta", code: 'useEffect(() => {\n  fetch("/api/productos")\n    .then((r) => r.json())\n    .then((json) => setLista(json));\n}, []);' },
    },
    {
      id: "m3q2d", slot: "m3q2", type: "concept", topic: "Dos dependencias", ref: "deps",
      prompt: "¿Cuándo se ejecuta `useEffect(() => { pedirClima(ciudad, unidad); }, [ciudad, unidad])`?",
      options: [
        { id: "a", text: "Al aparecer el componente y cada vez que cambie `ciudad` **o** `unidad`", correct: true, feedback: "Basta con que cambie **cualquiera** de las dependencias para que el efecto se repita. Si cambias de °C a °F, vuelve a pedir el clima aunque la ciudad sea la misma." },
        { id: "b", text: "Solo cuando cambian `ciudad` y `unidad` a la vez", correct: false, feedback: "No hace falta que cambien juntas: React compara cada dependencia por separado y repite el efecto si **alguna** cambió." },
        { id: "c", text: "Solo la primera vez; las dependencias solo se leen al principio", correct: false, feedback: "Eso es lo que hace `[]`. Con dependencias, React las compara en cada render." },
        { id: "d", text: "Después de cada render, como si no tuviera array", correct: false, feedback: "Con el array, React **se salta** el efecto en los renders en que ninguna dependencia cambió." },
      ],
      teach: "El efecto se repite cuando cambia **cualquiera** de las dependencias del array.",
      hint: "React compara cada valor del array con el del render anterior.",
      example: { code: '<select value={unidad} onChange={(e) => setUnidad(e.target.value)}>\n  <option value="C">°C</option>\n  <option value="F">°F</option>\n</select>\n// al cambiar la unidad, el efecto vuelve a pedir el clima' },
    },
    {
      id: "m3q3d", slot: "m3q3", type: "concept", topic: "Capturar el error del fetch", ref: "estados",
      prompt: "Sin internet, el `fetch` falla y la pantalla se queda en “Cargando...” para siempre. ¿Qué hay que añadir a la petición?",
      context: [{ kind: "code", title: "useProductos.js", code: 'useEffect(() => {\n  fetch("/api/productos")\n    .then((r) => r.json())\n    .then((json) => {\n      setData(json);\n      setLoading(false);\n    });\n}, []);' }],
      options: [
        { id: "a", code: ".catch((err) => {\n  setError(err);\n  setLoading(false);\n})", correct: true, feedback: "`.catch()` se ejecuta cuando la petición falla. Guarda el error y termina la carga, y el componente puede mostrar un mensaje en lugar de “Cargando...” eterno." },
        { id: "b", code: ".then((err) => setError(err))", correct: false, feedback: "`.then()` solo corre cuando todo va **bien**. Si el `fetch` falla, se salta todos los `.then()` y este código nunca se ejecuta." },
        { id: "c", code: ".catch(() => {})", correct: false, feedback: "Atrapa el error pero no hace nada: `loading` sigue en `true` y el usuario sigue viendo “Cargando...” sin saber qué pasó." },
        { id: "d", code: "try {\n  return <Lista items={data} />;\n} catch (e) {\n  return <p>Error</p>;\n}", correct: false, feedback: "El fallo ocurre **más tarde**, dentro de la petición, no al pintar el JSX. Este `try/catch` no lo ve. El error se atrapa en la promesa, con `.catch()`." },
      ],
      teach: "Toda petición necesita su `.catch()`: guarda el error, termina la carga y muéstralo en pantalla.",
      hint: "¿Qué método de una promesa se ejecuta cuando algo falla?",
      example: { title: "En el componente", code: "if (loading) return <p>Cargando...</p>;\nif (error) return <p>No se pudieron cargar los productos.</p>;\nreturn <Lista items={data} />;" },
    },
    {
      id: "m3q4d", slot: "m3q4", type: "concept", topic: "Corregir el bucle infinito", ref: "deps",
      prompt: "La pestaña *Red* del navegador muestra **cientos de peticiones** a `/api/noticias`. ¿Cómo se corrige este efecto para pedirlas una sola vez?",
      context: [{ kind: "code", title: "Noticias.jsx", code: 'useEffect(() => {\n  fetch("/api/noticias")\n    .then((r) => r.json())\n    .then((json) => setNoticias(json));\n});' }],
      options: [
        { id: "a", code: 'useEffect(() => {\n  fetch("/api/noticias")\n    .then((r) => r.json())\n    .then((json) => setNoticias(json));\n}, []);', correct: true, feedback: "Faltaba el array de dependencias. Sin él, el efecto corre tras **cada** render, y `setNoticias` provoca otro render. Con `[]` corre una sola vez, al aparecer el componente." },
        { id: "b", code: 'useEffect(() => {\n  fetch("/api/noticias")\n    .then((r) => r.json())\n    .then((json) => setNoticias(json));\n}, [noticias]);', correct: false, feedback: "Sigue en bucle: cada respuesta guarda un array **nuevo** en `noticias`, la dependencia cambia y el efecto vuelve a pedirlas." },
        { id: "c", code: 'useEffect(() => {\n  fetch("/api/noticias")\n    .then((r) => r.json());\n});', correct: false, feedback: "Ya no provoca renders, pero tampoco guarda las noticias: nunca aparecen en pantalla. Y sin array seguiría pidiéndolas tras cualquier otro render." },
        { id: "d", code: 'let pedido = false;\n\nuseEffect(() => {\n  if (pedido) return;\n  pedido = true;\n  fetch("/api/noticias")\n    .then((r) => r.json())\n    .then((json) => setNoticias(json));\n});', correct: false, feedback: "`pedido` es una variable normal: en cada render vuelve a valer `false`, así que la comprobación no frena nada. La solución es el array de dependencias." },
      ],
      teach: "Un efecto que guarda estado y no tiene array entra en bucle: añade `[]` (o las dependencias que necesite).",
      hint: "¿Qué le falta al final del `useEffect` comparado con los ejemplos de la lección?",
      example: { code: "useEffect(() => {\n  // ...\n}, []);   // ← el array decide cuándo se repite" },
    },
    {
      id: "m3q5d", slot: "m3q5", type: "applied", topic: "Adaptar los campos a la nueva API", ref: "adaptar",
      prompt: "Ejercicio práctico. Cambiaste el hook para que traiga **tareas** en lugar de usuarios, pero la tarjeta sale **vacía** (sin errores). Según la documentación, ¿cómo debe quedar el JSX?",
      context: [
        { kind: "code", title: "Tarea.jsx", code: "function Tarea({ id }) {\n  const { data, loading } = useTodo(id);\n\n  if (loading) return <p>Cargando...</p>;\n  return (\n    <div>\n      <h3>{data.name}</h3>\n      <p>{data.email}</p>\n    </div>\n  );\n}" },
        { kind: "doc", title: "📘 Documentación — API de Tareas", endpoint: "GET https://jsonplaceholder.typicode.com/todos/{id}", desc: "Devuelve una tarea por su id. Respuesta (campos principales):", fields: [["id", "número — identificador de la tarea"], ["title", "texto — descripción de la tarea"], ["completed", "booleano — true si está hecha"], ["userId", "número — dueño de la tarea"]] },
      ],
      options: [
        { id: "a", code: '<div>\n  <h3>{data.title}</h3>\n  <p>{data.completed ? "✓ Hecha" : "Pendiente"}</p>\n</div>', correct: true, feedback: "Al cambiar de API también cambian los **campos**: las tareas no tienen `name` ni `email` (por eso salían vacíos, `undefined`). Se usan `title` y `completed`, como dice la documentación." },
        { id: "b", code: "<div>\n  <h3>{data.todo.title}</h3>\n  <p>{data.todo.completed}</p>\n</div>", correct: false, feedback: "La respuesta no viene dentro de un campo `todo`: `title` está directamente en `data`. `data.todo` es `undefined` y leer `.title` daría error." },
        { id: "c", code: "<div>\n  <h3>{title}</h3>\n  <p>{completed}</p>\n</div>", correct: false, feedback: "`title` y `completed` no son variables del componente: hay que leerlas de `data`. Daría *Error de referencia: title no está definida*." },
        { id: "d", code: "<div>\n  <h3>{data.name}</h3>\n  <p>{data.completed}</p>\n</div>", correct: false, feedback: "`name` es un campo de los **usuarios**, no de las tareas: el título seguiría vacío. Y `completed` es un booleano, que React no pinta." },
      ],
      teach: "Al adaptar un hook a otra API, revisa también el componente: usa los **campos** que indica la nueva documentación.",
      hint: "Compara los campos que usa el JSX (`name`, `email`) con los que lista la documentación.",
      example: { title: "Truco para conocer los campos", code: 'const { data, loading } = useTodo(id);\nconsole.log(data); // { id: 1, title: "...", completed: false, userId: 1 }' },
    },
  ],

  /* ============ MÓDULO 4: Enrutamiento ============ */
  m4: [
    // --- Hueco m4q1: qué permite react-router ---
    {
      id: "m4q1b", slot: "m4q1", type: "concept", topic: "Qué es una SPA", ref: "spa",
      prompt: "¿Qué es una SPA (*aplicación de una sola página*)?",
      options: [
        { id: "a", text: "Una app que carga una vez y cambia de vista sin recargar la página", correct: true, feedback: "La página se carga una sola vez y, al navegar, solo cambia el contenido necesario: más rápido y sin perder el estado." },
        { id: "b", text: "Una web que solo tiene una sección", correct: false, feedback: "Una SPA puede tener muchas secciones (inicio, productos, contacto…). “Una sola página” se refiere a que el documento HTML se carga **una vez**." },
        { id: "c", text: "Una app que no usa JavaScript", correct: false, feedback: "Al contrario: las SPA dependen de JavaScript para cambiar de vista sin recargar." },
        { id: "d", text: "Una web que se recarga en cada clic", correct: false, feedback: "Eso describe una web tradicional. La SPA justamente evita esas recargas." },
      ],
      teach: "SPA = una sola carga; al navegar cambia el contenido, no la página entera.",
      hint: "Recuerda la analogía del control remoto de la lección.",
      example: { code: "// Mismo index.html, distintas vistas según la URL:\n/          → <Inicio />\n/productos → <Productos />" },
    },
    {
      id: "m4q1c", slot: "m4q1", type: "concept", topic: "Ventaja de no recargar", ref: "spa",
      prompt: "En una tienda online hecha con React Router, ¿qué ventaja tiene navegar **sin recargar**?",
      options: [
        { id: "a", text: "Es más rápido y se conserva el estado, como el carrito", correct: true, feedback: "Al no recargar, la app sigue “viva”: el carrito, un formulario a medio llenar o la sesión se mantienen mientras navegas." },
        { id: "b", text: "Hace que las contraseñas sean más seguras", correct: false, feedback: "La seguridad depende del servidor y de cómo se gestionan los datos, no de si la navegación recarga o no." },
        { id: "c", text: "Permite que la tienda funcione sin servidor ni base de datos", correct: false, feedback: "Una tienda real sigue necesitando un servidor para productos y pedidos. React Router solo gestiona la navegación en el navegador." },
        { id: "d", text: "Reduce el espacio que ocupa la página en el disco", correct: false, feedback: "No tiene relación con el tamaño en disco. La ventaja es la rapidez y conservar el estado." },
      ],
      teach: "Sin recarga = navegación instantánea y el estado de la app se conserva.",
      hint: "Piensa en qué pasa con el carrito cuando la página se recarga entera.",
      example: { code: '<Link to="/carrito">🛒 Ver carrito ({items.length})</Link>' },
    },

    // --- Hueco m4q2: Link vs a ---
    {
      id: "m4q2b", slot: "m4q2", type: "concept", topic: "Enlazar una ruta interna", ref: "link",
      prompt: "Dentro de tu app, ¿con qué enlazas a la ruta interna `/perfil`?",
      options: [
        { id: "a", code: '<Link to="/perfil">Mi perfil</Link>', correct: true, feedback: "`Link` con el atributo `to` cambia de vista sin recargar. Es lo correcto para rutas de tu propia app." },
        { id: "b", code: '<a href="/perfil">Mi perfil</a>', correct: false, feedback: "Funciona, pero **recarga toda la página** y se pierde el estado. Para rutas internas se usa `Link`." },
        { id: "c", code: '<Link href="/perfil">Mi perfil</Link>', correct: false, feedback: "`Link` no usa `href`, usa `to`. Así el enlace no sabría a dónde ir." },
        { id: "d", code: '<Route to="/perfil">Mi perfil</Route>', correct: false, feedback: "`Route` **define** qué componente se muestra en una URL; no es un enlace." },
      ],
      teach: "Ruta interna → `<Link to=\"/ruta\">`.",
      hint: "Busca el componente de navegación con el atributo correcto.",
      example: { code: 'import { Link } from "react-router-dom";\n\n<Link to="/perfil">Mi perfil</Link>' },
    },
    {
      id: "m4q2c", slot: "m4q2", type: "concept", topic: "Enlace a otra web", ref: "link",
      prompt: "Quieres enlazar desde tu app a la web externa `https://react.dev`. ¿Qué usas?",
      options: [
        { id: "a", code: '<a href="https://react.dev">Documentación de React</a>', correct: true, feedback: "Para ir a **otro sitio** se usa un `<a href>` normal: ahí sí queremos que el navegador cargue otra página." },
        { id: "b", code: '<Link to="https://react.dev">Documentación de React</Link>', correct: false, feedback: "`Link` es para rutas **de tu app**. Con una URL externa intentaría tratarla como una ruta interna y no funcionaría como esperas." },
        { id: "c", code: '<Route path="https://react.dev" />', correct: false, feedback: "`Route` define páginas de tu app; no sirve para enlazar a otras webs." },
        { id: "d", code: '<Link href="https://react.dev">Documentación de React</Link>', correct: false, feedback: "`Link` no usa `href`, y además no es para webs externas." },
      ],
      teach: "Rutas de tu app → `Link to`. Otras webs → `<a href>`.",
      hint: "¿El destino es parte de tu app o es otro sitio web?",
      example: { code: '<a href="https://react.dev" target="_blank" rel="noreferrer">\n  Documentación oficial\n</a>' },
    },

    // --- Hueco m4q3: configurar rutas ---
    {
      id: "m4q3b", slot: "m4q3", type: "concept", topic: "Página 404", ref: "routes",
      prompt: "¿Qué ruta muestra el componente `NoEncontrado` para **cualquier URL que no exista**?",
      options: [
        { id: "a", code: '<Route path="*" element={<NoEncontrado />} />', correct: true, feedback: "`path=\"*\"` coincide con cualquier URL que no haya coincidido con otra ruta: es la página 404." },
        { id: "b", code: '<Route path="/" element={<NoEncontrado />} />', correct: false, feedback: "`/` es solo la página de inicio. Las demás URL desconocidas no la mostrarían." },
        { id: "c", code: '<Route path="404" element={<NoEncontrado />} />', correct: false, feedback: "Solo se mostraría al visitar exactamente `/404`, no con cualquier URL inexistente." },
        { id: "d", code: "<Route element={NoEncontrado} />", correct: false, feedback: "Le falta el `path` y `element` debe recibir el componente como JSX: `<NoEncontrado />`." },
      ],
      teach: '`path="*"` atrapa todas las URL que no coinciden con otra ruta.',
      hint: "¿Qué símbolo significa “cualquier cosa”?",
      example: { code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="*" element={<NoEncontrado />} />\n</Routes>' },
    },
    {
      id: "m4q3c", slot: "m4q3", type: "concept", topic: "Ruta de catálogo", ref: "routes",
      prompt: "Quieres que la URL `/productos` muestre el componente `Catalogo`. ¿Cuál es correcta?",
      options: [
        { id: "a", code: '<Route path="/productos" element={<Catalogo />} />', correct: true, feedback: "`path` con la URL y `element` con el componente escrito como JSX. Es la sintaxis actual de React Router." },
        { id: "b", code: '<Route path="/productos" element={Catalogo} />', correct: false, feedback: "`element` necesita el componente **como JSX** (`<Catalogo />`), no el nombre de la función." },
        { id: "c", code: '<Route to="/productos" element={<Catalogo />} />', correct: false, feedback: "`to` es el atributo de `Link`. En `Route` la URL va en `path`." },
        { id: "d", code: '<Route path="/productos" component={<Catalogo />} />', correct: false, feedback: "`component` era de la versión antigua (v5). Hoy se usa `element`." },
      ],
      teach: '`<Route path="/url" element={<Componente />} />`, dentro de `<Routes>`.',
      hint: "Recuerda: `path` + `element`, y el componente entre `< />`.",
      example: { code: '<Route path="/productos" element={<Catalogo />} />\n<Route path="/productos/:id" element={<DetalleProducto />} />' },
    },

    // --- Hueco m4q4: BrowserRouter ---
    {
      id: "m4q4b", slot: "m4q4", type: "concept", topic: "Cuántos BrowserRouter", ref: "browserrouter",
      prompt: "¿Cuántos `<BrowserRouter>` debe tener una aplicación?",
      options: [
        { id: "a", text: "Uno solo, envolviendo toda la app", correct: true, feedback: "Un único `BrowserRouter` crea el contexto de navegación para toda la aplicación." },
        { id: "b", text: "Uno por cada página", correct: false, feedback: "Anidar varios provoca el error *No se puede renderizar un <Router> dentro de otro <Router>*." },
        { id: "c", text: "Uno por cada `<Link>`", correct: false, feedback: "Los `Link` usan el `BrowserRouter` que envuelve la app; no necesitan uno propio." },
        { id: "d", text: "Ninguno, si ya usas `<Routes>`", correct: false, feedback: "`Routes` necesita estar dentro de un router. Sin `BrowserRouter`, React Router lanza un error." },
      ],
      teach: "Un único `BrowserRouter`, envolviendo toda la app.",
      hint: "¿Tiene sentido repetir algo que activa el enrutado para toda la app?",
      example: { code: "<BrowserRouter>\n  <App />\n</BrowserRouter>" },
    },
    {
      id: "m4q4c", slot: "m4q4", type: "concept", topic: "Dónde colocar BrowserRouter", ref: "browserrouter",
      prompt: "¿Dónde se coloca normalmente `<BrowserRouter>` en un proyecto con Vite?",
      options: [
        { id: "a", text: "En `main.jsx`, envolviendo a `<App />`", correct: true, feedback: "`main.jsx` es donde se monta la app: envolver `<App />` ahí activa el enrutado para todo lo que hay dentro." },
        { id: "b", text: "Dentro de cada componente de página", correct: false, feedback: "Solo debe haber uno, y por encima de todas las páginas, no dentro de ellas." },
        { id: "c", text: "En el archivo `index.html`", correct: false, feedback: "`index.html` no contiene JSX: `BrowserRouter` es un componente de React y va en el código de React." },
        { id: "d", text: "Dentro de `<Routes>`", correct: false, feedback: "Es al revés: `Routes` (y todo lo demás) va **dentro** de `BrowserRouter`." },
      ],
      teach: "`main.jsx`: `<BrowserRouter><App /></BrowserRouter>`.",
      hint: "¿Qué archivo es el punto de entrada que monta `<App />`?",
      example: { title: "main.jsx", code: 'ReactDOM.createRoot(document.getElementById("root")).render(\n  <BrowserRouter>\n    <App />\n  </BrowserRouter>\n);' },
    },

    // --- Hueco m4q5: ejercicio aplicado de navegación ---
    {
      id: "m4q5b", slot: "m4q5", type: "applied", topic: "Botón que recarga la página", ref: "link",
      prompt: "Ejercicio práctico. Al pulsar **Ver carrito**, la página parpadea en blanco y el carrito se vacía. ¿Cuál es la mejor corrección?",
      context: [{ kind: "code", title: "Menu.jsx (con error)", code: 'function Menu({ items }) {\n  return (\n    <nav>\n      <button onClick={() => (window.location.href = "/carrito")}>\n        Ver carrito ({items})\n      </button>\n    </nav>\n  );\n}' }],
      options: [
        { id: "a", code: '<Link to="/carrito">Ver carrito ({items})</Link>', correct: true, feedback: "`window.location.href` hace que el navegador cargue una página nueva (recarga completa). `Link` cambia de vista sin recargar y el carrito se conserva." },
        { id: "b", code: '<a href="/carrito">Ver carrito ({items})</a>', correct: false, feedback: "Un `<a href>` a una ruta interna **también recarga** la página entera: el problema sigue." },
        { id: "c", code: '<Route path="/carrito">Ver carrito ({items})</Route>', correct: false, feedback: "`Route` define qué componente se ve en una URL; no es un enlace ni un botón." },
        { id: "d", code: "<button onClick={() => location.reload()}>\n  Ver carrito ({items})\n</button>", correct: false, feedback: "`location.reload()` recarga la página actual: es justo lo que hay que evitar." },
      ],
      teach: "Para navegar dentro de la app sin perder el estado: `Link` (nunca `window.location` ni `<a href>`).",
      hint: "¿Qué hace el navegador cuando se cambia `window.location.href`?",
      example: { title: "Menu corregido", code: 'import { Link } from "react-router-dom";\n\nfunction Menu({ items }) {\n  return (\n    <nav>\n      <Link to="/carrito">Ver carrito ({items})</Link>\n    </nav>\n  );\n}' },
    },
    {
      id: "m4q5c", slot: "m4q5", type: "applied", topic: "App sin router", ref: "browserrouter",
      prompt: "Ejercicio práctico. Al abrir la app aparece un error y no se ve nada. ¿Cuál es la corrección?",
      context: [
        { kind: "code", title: "main.jsx", code: 'ReactDOM.createRoot(document.getElementById("root")).render(\n  <App />\n);' },
        { kind: "code", title: "App.jsx", code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/contacto" element={<Contacto />} />\n</Routes>' },
        { kind: "console", lines: [{ t: "✕ Error: useRoutes() solo puede usarse dentro de un componente <Router>." }] },
      ],
      options: [
        { id: "a", code: "// main.jsx\n<BrowserRouter>\n  <App />\n</BrowserRouter>", correct: true, feedback: "El error lo dice: `Routes` necesita estar dentro de un router. Envolver `<App />` con `BrowserRouter` en `main.jsx` lo resuelve para toda la app." },
        { id: "b", code: '// App.jsx\n<Routes>\n  <BrowserRouter>\n    <Route path="/" element={<Inicio />} />\n  </BrowserRouter>\n</Routes>', correct: false, feedback: "El router queda **dentro** de `Routes`, y `Routes` sigue sin tener un router alrededor. Además, dentro de `Routes` solo van `Route`." },
        { id: "c", code: '// App.jsx (sin Routes)\n<Route path="/" element={<Inicio />} />\n<Route path="/contacto" element={<Contacto />} />', correct: false, feedback: "Quitar `Routes` no ayuda: un `Route` suelto también da error, y sigue faltando el router." },
        { id: "d", code: '<Route path="/" component={Inicio} />', correct: false, feedback: "Es la sintaxis antigua (v5) y no tiene relación con el error: lo que falta es `BrowserRouter`." },
      ],
      teach: "Si React Router dice “solo puede usarse dentro de un <Router>”, falta `BrowserRouter` envolviendo la app.",
      hint: "Lee el mensaje de error: ¿qué componente dice que falta?",
      example: { title: "main.jsx corregido", code: 'import { BrowserRouter } from "react-router-dom";\n\nReactDOM.createRoot(document.getElementById("root")).render(\n  <BrowserRouter>\n    <App />\n  </BrowserRouter>\n);' },
    },

    // --- Cuarta versión de cada hueco ---
    {
      id: "m4q1d", slot: "m4q1", type: "concept", topic: "Qué ocurre al cambiar de ruta", ref: "spa",
      prompt: "En una app con React Router, el usuario pulsa un `<Link>` que va de `/` a `/contacto`. ¿Qué pasa?",
      options: [
        { id: "a", text: "Cambia la URL y React muestra el componente de `/contacto`, sin pedir una página nueva al servidor", correct: true, feedback: "React Router actualiza la barra de direcciones y cambia solo el componente de la ruta. La página no se recarga, así que el estado (por ejemplo, un carrito) se conserva." },
        { id: "b", text: "El navegador descarga del servidor un nuevo archivo `contacto.html`", correct: false, feedback: "Eso pasa en una web tradicional de varias páginas. En una SPA hay **un solo** HTML y React cambia lo que se ve." },
        { id: "c", text: "Se muestra el nuevo componente, pero la URL sigue siendo `/`", correct: false, feedback: "La URL sí cambia a `/contacto`: por eso se puede compartir el enlace o usar el botón Atrás del navegador." },
        { id: "d", text: "La página se recarga entera y la app empieza de cero", correct: false, feedback: "Eso es justo lo que React Router evita (y lo que pasaría con un `<a href>`)." },
      ],
      teach: "En una SPA, cambiar de ruta cambia la URL y el componente, **sin recargar** la página.",
      hint: "Piensa en qué cambia (URL y contenido) y qué **no** ocurre (la recarga).",
      example: { code: '<Link to="/contacto">Contacto</Link>\n// URL: /  →  /contacto\n// Se ve <Contacto />, sin recargar' },
    },
    {
      id: "m4q2d", slot: "m4q2", type: "concept", topic: "Link con href", ref: "link",
      prompt: 'Este enlace se ve en pantalla, pero al pulsarlo **no lleva a la página de ayuda**: `<Link href="/ayuda">Ayuda</Link>`. ¿Por qué?',
      options: [
        { id: "a", text: '`Link` usa la prop `to`, no `href`: debe ser `<Link to="/ayuda">`', correct: true, feedback: "`href` es el atributo de `<a>`. `Link` necesita `to` para saber a qué ruta ir; sin `to`, no tiene destino." },
        { id: "b", text: "`Link` necesita la URL completa, con `https://`", correct: false, feedback: "Para rutas internas basta con el camino (`/ayuda`). Las URLs completas son para enlaces externos con `<a>`." },
        { id: "c", text: 'Hay que importar `Link` desde `"react"`', correct: false, feedback: '`Link` viene de `"react-router-dom"`, no de `"react"`. Además, el fallo aquí es el nombre de la prop.' },
        { id: "d", text: "La ruta no debe empezar con `/`", correct: false, feedback: 'Empezar con `/` es lo habitual: indica una ruta desde la raíz de la app, igual que en `<Route path="/ayuda">`.' },
      ],
      teach: "`<a href>` para webs externas; `<Link to>` para rutas internas.",
      hint: "Compara las props de `<a>` y de `<Link>` en la lección.",
      example: { code: 'import { Link } from "react-router-dom";\n\n<Link to="/ayuda">Ayuda</Link>' },
    },
    {
      id: "m4q3d", slot: "m4q3", type: "concept", topic: "Route fuera de Routes", ref: "routes",
      prompt: "Al abrir la app aparece *Un <Route> solo puede usarse como hijo de un elemento <Routes>*. ¿Cómo se corrige?",
      context: [{ kind: "code", title: "App.jsx", code: 'function App() {\n  return (\n    <>\n      <Route path="/" element={<Inicio />} />\n      <Route path="/blog" element={<Blog />} />\n    </>\n  );\n}' }],
      options: [
        { id: "a", code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/blog" element={<Blog />} />\n</Routes>', correct: true, feedback: "Cada `Route` debe estar **dentro de `Routes`**: es quien mira la URL y elige qué ruta mostrar." },
        { id: "b", code: '<div>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/blog" element={<Blog />} />\n</div>', correct: false, feedback: "Un `<div>` agrupa, pero no elige rutas: el error seguiría. El padre de los `Route` tiene que ser `Routes`." },
        { id: "c", code: '<BrowserRouter>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/blog" element={<Blog />} />\n</BrowserRouter>', correct: false, feedback: "`BrowserRouter` hace falta (normalmente en `main.jsx`), pero no sustituye a `Routes`. Los `Route` siguen sin su padre correcto." },
        { id: "d", code: '<Link to="/" element={<Inicio />} />\n<Link to="/blog" element={<Blog />} />', correct: false, feedback: "`Link` crea enlaces para navegar; no define qué componente se ve en cada ruta." },
      ],
      teach: "Las rutas se definen con `Route` **dentro de** `Routes`.",
      hint: "Lee el error: ¿de qué elemento debe ser hijo un `Route`?",
      example: { code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/blog" element={<Blog />} />\n  <Route path="*" element={<NoEncontrado />} />\n</Routes>' },
    },
    {
      id: "m4q4d", slot: "m4q4", type: "concept", topic: "Menú fuera del router", ref: "browserrouter",
      prompt: "La app falla con *useHref() solo puede usarse dentro de un componente <Router>*. `<Menu />` tiene varios `<Link>`. ¿Cuál es la corrección de `main.jsx`?",
      context: [{ kind: "code", title: "main.jsx", code: 'ReactDOM.createRoot(document.getElementById("root")).render(\n  <>\n    <Menu />\n    <BrowserRouter>\n      <App />\n    </BrowserRouter>\n  </>\n);' }],
      options: [
        { id: "a", code: "<BrowserRouter>\n  <Menu />\n  <App />\n</BrowserRouter>", correct: true, feedback: "`Menu` usa `<Link>`, y todo `Link` debe estar **dentro** de `BrowserRouter`. Al envolver los dos, el menú y las rutas comparten el mismo router." },
        { id: "b", code: "<>\n  <BrowserRouter>\n    <Menu />\n  </BrowserRouter>\n  <BrowserRouter>\n    <App />\n  </BrowserRouter>\n</>", correct: false, feedback: "Quita el error, pero crea **dos routers** independientes: el menú cambiaría la URL sin que las rutas de `App` se enteraran. Debe haber un solo `BrowserRouter`." },
        { id: "c", code: "<>\n  <Menu />\n  <App />\n</>", correct: false, feedback: "Sin `BrowserRouter` fallan tanto el menú como las rutas de `App`." },
        { id: "d", code: "<BrowserRouter>\n  <App />\n</BrowserRouter>\n// y en Menu, cambiar cada <Link> por <a href>", correct: false, feedback: "Quita el error, pero cada clic en el menú **recargaría la página** y se perdería el estado. Mejor meter el menú dentro del router." },
      ],
      teach: "Todo componente que use `Link` o rutas debe estar **dentro** del único `BrowserRouter`.",
      hint: "¿Dónde queda `<Menu />` respecto a `<BrowserRouter>`?",
      example: { title: "main.jsx corregido", code: 'ReactDOM.createRoot(document.getElementById("root")).render(\n  <BrowserRouter>\n    <Menu />\n    <App />\n  </BrowserRouter>\n);' },
    },
    {
      id: "m4q5d", slot: "m4q5", type: "applied", topic: "Enlace a una ruta mal escrita", ref: "link",
      prompt: "Ejercicio práctico. Al pulsar **Contacto** en el menú, la URL cambia pero **la página queda en blanco**. No hay errores en consola. ¿Cuál es la corrección?",
      context: [
        { kind: "code", title: "Menu.jsx", code: '<nav>\n  <Link to="/">Inicio</Link>\n  <Link to="/contactos">Contacto</Link>\n</nav>' },
        { kind: "code", title: "App.jsx", code: '<Routes>\n  <Route path="/" element={<Inicio />} />\n  <Route path="/contacto" element={<Contacto />} />\n</Routes>' },
      ],
      options: [
        { id: "a", code: '<Link to="/contacto">Contacto</Link>', correct: true, feedback: "El enlace iba a `/contactos` (con **s**), pero la ruta definida es `/contacto`. Ninguna `Route` coincidía, así que no se mostraba nada. El `to` del `Link` debe coincidir con el `path` de la ruta." },
        { id: "b", code: '<a href="/contactos">Contacto</a>', correct: false, feedback: "Sigue yendo a `/contactos`, que no existe. Y además recargaría la página entera." },
        { id: "c", code: '<BrowserRouter>\n  <Link to="/contactos">Contacto</Link>\n</BrowserRouter>', correct: false, feedback: "El router ya existe (la URL cambia sin errores). Añadir otro no arregla la dirección mal escrita y crea un segundo router." },
        { id: "d", code: '<Link to="contacto.html">Contacto</Link>', correct: false, feedback: "En React Router no hay un archivo `.html` por página: las rutas son caminos como `/contacto`, definidos en `<Route path>`." },
      ],
      teach: "El `to` de cada `Link` debe coincidir exactamente con el `path` de una `Route`.",
      hint: "Compara letra por letra el `to` del menú con los `path` de `App.jsx`.",
      example: { title: "Una página 404 ayuda a detectar estos fallos", code: '<Route path="*" element={<NoEncontrado />} />\n// una URL sin ruta mostraría NoEncontrado en vez de una página en blanco' },
    },
  ],
};
