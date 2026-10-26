import { jsPDF } from "jspdf";

// Paleta del certificado (impreso sobre fondo claro, se ve profesional en papel y pantalla)
const NAVY = [26, 34, 56];
const ACCENT = [76, 99, 196];
const GRAY = [110, 120, 140];
const SOFT = [238, 241, 250];

function fecha() {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const d = new Date();
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

// Código de verificación corto, derivado del nombre + fecha (para que el profe distinga entregas)
function codigoVerificacion(nombre) {
  const base = (nombre || "") + "|" + new Date().toDateString();
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += abc[h % abc.length];
    h = Math.floor(h / abc.length) + 7;
  }
  return out;
}

export function certCode(nombre) {
  return codigoVerificacion(nombre);
}

export function generarCertificado({ nombre, grupo, curso = "Optativa de React (FTE)", puntaje }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210, cx = W / 2;

  // Fondo
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // Banda superior suave
  doc.setFillColor(...SOFT);
  doc.rect(0, 0, W, 6, "F");
  doc.rect(0, H - 6, W, 6, "F");

  // Borde exterior (acento) e interior (fino)
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1.4);
  doc.rect(12, 12, W - 24, H - 24, "S");
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.3);
  doc.rect(16, 16, W - 32, H - 32, "S");

  // Marca / eyebrow
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("R E A C T   L A B", cx, 38, { align: "center" });
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(curso.toUpperCase(), cx, 44, { align: "center" });

  // Título
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("Certificado de Aprobación", cx, 62, { align: "center" });

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...GRAY);
  doc.text("Se otorga el presente certificado a", cx, 78, { align: "center" });

  // Nombre del alumno
  doc.setTextColor(...NAVY);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(40);
  doc.text(nombre || "Estudiante", cx, 98, { align: "center" });

  // Línea bajo el nombre
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.6);
  doc.line(cx - 70, 104, cx + 70, 104);

  // Grupo del alumno, justo bajo la línea del nombre
  if (grupo) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(`Grupo ${grupo}`, cx, 111, { align: "center" });
  }

  // Texto de reconocimiento
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12.5);
  doc.setTextColor(60, 68, 86);
  const parrafo =
    `Por haber completado y aprobado satisfactoriamente la evaluación de la ${curso},\n` +
    "demostrando dominio de componentes, props, estado, hooks, consumo de APIs y enrutamiento en React.";
  doc.text(parrafo, cx, 121, { align: "center", lineHeightFactor: 1.6 });

  // Mensaje destacado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...ACCENT);
  doc.text("¡Felicidades, has aprobado el cuestionario!", cx, 137, { align: "center" });

  // Sello circular centrado (medallón)
  const sy = 159, r = 14;
  doc.setDrawColor(...ACCENT);
  doc.setFillColor(...SOFT);
  doc.setLineWidth(1.1);
  doc.circle(cx, sy, r, "FD");
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.3);
  doc.circle(cx, sy, r - 2.5, "S");
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("APROBADO", cx, sy - 1, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("React Lab", cx, sy + 4.5, { align: "center" });

  // Meta: calificación y fecha, en una línea centrada bajo el sello
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text(`Calificación: ${puntaje}%`, cx - 45, 183, { align: "center" });
  doc.text(`Fecha: ${fecha()}`, cx + 45, 183, { align: "center" });

  // Código de verificación
  const codigo = codigoVerificacion(nombre);
  doc.setTextColor(...GRAY);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.text(`Código de verificación: ${codigo}`, cx, 192, { align: "center" });

  const archivo = "certificado-react-lab-" + [nombre || "estudiante", grupo].filter(Boolean).join(" ")
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + ".pdf";
  doc.save(archivo);
  return codigo;
}
