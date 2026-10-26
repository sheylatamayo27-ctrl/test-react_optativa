# React Lab — Curso de React con certificado

Plataforma web (React + Vite) para que tus estudiantes aprendan React, resuelvan
un cuestionario y, al aprobar, descarguen un **certificado en PDF** con su nombre.

## Qué incluye
- Pantalla de **nombre, apellidos y grupo** al entrar (el grupo aparece en el certificado).
- 4 módulos con **lección** y **práctica**: componentes/listas, estado (useState),
  hooks + consumo de APIs, y enrutamiento.
- Lecciones con objetivos, analogías, comparaciones "Evita / Mejor así", tablas,
  ejemplos completos, resumen y una **demo interactiva** por módulo.
- **Feedback detallado** en cada respuesta: por qué es correcta o no, un ejemplo
  aplicado a un proyecto real, contador de intentos y botón para **repasar la
  sección exacta** de la lección.
- **Modo claro / oscuro / sistema** y tamaño de texto ajustable (icono de engranaje).
- Atajos de teclado en la práctica: A–D o 1–4 para responder, ← → para navegar, H pista.
- Preguntas en **orden aleatorio** (y opciones barajadas) distinto para cada alumno.
- Un **ejercicio práctico** por módulo. Por ejemplo: se muestra un hook que trae Pokémon y la documentación
  de una API de usuarios; el alumno debe elegir cómo **modificar el hook** para traer usuarios.
- **Pistas** en cada pregunta y reintento hasta acertar.
- **Autoguardado** en el navegador (sobrevive a cierres/apagones del mismo equipo) y
  **vuelve al sitio exacto** donde estaba el alumno: módulo, lección o práctica, y pregunta.
- **Funciona sin conexión (PWA)**: tras abrirlo una vez con internet, el test se puede
  abrir, completar y descargar el certificado aunque no haya conexión. Indicador
  "Sin conexión" en la cabecera y aviso cuando hay una versión nueva.
- Al aprobar (**60%** o más): **certificado PDF** profesional con nombre, grupo,
  calificación, fecha y código de verificación.

## Cómo ejecutarlo en desarrollo
```bash
npm install
npm run dev
```
Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Cómo publicarlo (producción)
```bash
npm run build
```
Genera la carpeta `dist/`. Súbela a cualquier hosting estático (Netlify, Vercel,
GitHub Pages, tu servidor). El `vite.config.js` usa `base: "./"`, así que funciona
tanto en la raíz de un dominio como en una subcarpeta.

### Modo sin conexión
- El hosting debe usar **HTTPS** (Netlify, Vercel y GitHub Pages lo dan gratis);
  los Service Workers no funcionan en `http://` salvo en `localhost`.
- Los alumnos deben abrir el test **una vez con internet**. Al terminar de guardarse
  verán el aviso "Listo para usar sin conexión".
- En el móvil, que lo abran en **Chrome o Safari**, no dentro de WhatsApp u otras apps.
- Si publicas cambios en las preguntas, a los alumnos les aparecerá
  "Hay una versión nueva del test" al recuperar conexión. Mantén los mismos `id`
  de pregunta para que no pierdan su progreso, y evita cambios durante un examen.

## Pruebas
```bash
npm test            # unitarias (Vitest): lógica de progreso, guardado y validación del contenido
npm run test:e2e    # de navegador (Playwright): flujos reales, apagones y modo sin conexión
npm run test:all    # todas
```
Las pruebas de navegador compilan el proyecto y usan el **Google Chrome** instalado.
Si no tienes Chrome, ejecuta `npx playwright install chromium` y quita la línea
`channel: "chrome"` de `playwright.config.js`.

Qué comprueban, entre otras cosas:
- Cada pregunta tiene exactamente una respuesta correcta, sin opciones repetidas, y
  "Repasar en la lección" apunta a una sección que existe (útil al editar `modules.js`).
- Tras un apagón (cerrar y reabrir) el alumno vuelve a la misma pregunta con sus respuestas.
- Con el **servidor apagado y sin internet**, la app abre al recargar, se completan las
  20 preguntas y se descarga el certificado PDF con nombre y grupo.
- El aviso de versión nueva aparece y al actualizar no se pierde el progreso.

## Estructura
```
src/
  main.jsx              punto de entrada
  App.jsx               estado general y navegación
  styles.css            estilos (temas claro y oscuro)
  data/modules.js       lecciones + preguntas (edítalo para cambiar el contenido)
  lib/
    certificate.js      generación del certificado PDF (jsPDF)
    storage.js          autoguardado en localStorage
    progress.js         intentos, posición guardada y retomar donde se quedó
    prefs.js            preferencias de tema y tamaño de texto
    useOnline.js        detecta si hay conexión
    util.js             resaltado de código, mezcla aleatoria, helpers
  components/           NameGate, Home, ModuleView, Lesson, Quiz, Question, Results,
                        Bits (bloques de lección), Demos (demos interactivas), Settings,
                        PwaStatus (avisos de modo sin conexión y versión nueva)
public/                 iconos de la app (favicon, iconos para instalarla)
tests/
  unit/                 pruebas unitarias (Vitest)
  e2e/                  pruebas de navegador (Playwright)
```

## Cambiar el contenido
Todo el contenido (lecciones, preguntas, opciones, pistas, el ejercicio práctico)
está en `src/data/modules.js`. Cada pregunta marca su opción correcta con
`correct: true`, así que puedes reordenar las opciones sin romper la evaluación.
Al inicio de ese archivo hay una lista de los tipos de bloque disponibles para las
lecciones y de los campos de cada pregunta (`ref`, `teach`, `hint`, `example`).
La nota mínima para aprobar es la constante `PASS` en ese mismo archivo.
