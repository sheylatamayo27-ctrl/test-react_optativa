import { useMemo } from "react";
import { watermarkImage } from "../lib/watermark.js";

// Capa por encima del contenido: no se puede seleccionar ni intercepta clics.
export default function Watermark({ text }) {
  const style = useMemo(() => ({ backgroundImage: watermarkImage(text) }), [text]);
  if (!text) return null;
  return <div className="watermark" style={style} aria-hidden="true" data-text={text} />;
}
