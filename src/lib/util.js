// Resaltado de código muy ligero (sin dependencias) y utilidades varias.

const KW = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(&lt;\/?[A-Za-z][\w.]*)|\b(const|let|var|function|return|import|from|export|default|if|else|for|while|true|false|null|undefined|async|await|new|try|catch|finally|throw|useState|useEffect|useRef|useMemo|useCallback)\b|\b(\d+)\b/g;

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlight(code) {
  return esc(code).replace(KW, (m, c, s, t, k, n) => {
    if (c) return '<span class="t-com">' + c + "</span>";
    if (s) return '<span class="t-str">' + s + "</span>";
    if (t) return '&lt;<span class="t-tag">' + t.slice(4) + "</span>";
    if (k) return '<span class="t-kw">' + k + "</span>";
    return '<span class="t-num">' + n + "</span>";
  });
}

// Markdown en línea mínimo: **negrita**, *cursiva* y `código`.
// Los fragmentos de código se apartan con marcadores para no aplicarles negrita/cursiva,
// pero pueden quedar dentro de una negrita: **cada vez que `id` cambia**.
export function inlineMd(s) {
  const codes = [];
  const marked = String(s || "").replace(/`([^`]+)`/g, (m, c) => {
    codes.push("<code>" + esc(c) + "</code>");
    return "\u0000" + (codes.length - 1) + "\u0000";
  });
  return esc(marked)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/\u0000(\d+)\u0000/g, (m, i) => codes[i]);
}

// Mezcla (Fisher-Yates) con semilla simple, para que el orden sea estable por intento.
export function shuffle(array, seed) {
  const a = array.slice();
  let s = seed || Math.floor(Math.random() * 1e9);
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function hashStr(s) {
  let h = 0;
  s = String(s || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function slug(s) {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "alumno"
  );
}

// Estado de una respuesta guardada: { optId, correct }. Cada pregunta tiene un único intento.
export function answerInfo(a) {
  return { answered: !!a, correct: !!(a && a.correct) };
}
