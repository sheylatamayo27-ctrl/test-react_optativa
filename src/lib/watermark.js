// Marca de agua con los datos del alumno. Una web no puede impedir las capturas de pantalla
// (las hace el sistema operativo), pero así cualquier captura que circule identifica de quién salió.

function escXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function watermarkText(name, group, date = new Date()) {
  const fecha = date.toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "numeric" });
  return [name, group && "Grupo " + group, fecha].filter(Boolean).join(" · ");
}

// Devuelve un valor para `background-image`: un SVG en mosaico con el texto en diagonal.
// El gris semitransparente se ve tanto en el tema claro como en el oscuro.
export function watermarkImage(text) {
  // El mosaico crece con el texto para que nombres largos no se corten entre baldosas
  const w = Math.max(420, Math.round(String(text).length * 8.6 + 140));
  const h = Math.max(230, Math.round(w * 0.5));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ` +
    `transform="rotate(-24 ${w / 2} ${h / 2})" fill="rgba(128,128,128,0.17)" ` +
    `font-family="system-ui, Segoe UI, sans-serif" font-size="15" font-weight="700">${escXml(text)}</text>` +
    `</svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}
