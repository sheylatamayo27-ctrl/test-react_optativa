import { describe, it, expect } from "vitest";
import { watermarkText, watermarkImage } from "../../src/lib/watermark.js";

describe("marca de agua", () => {
  it("incluye nombre, grupo y fecha", () => {
    const t = watermarkText("Daniel Lantigua Pelaez", "301", new Date(2026, 9, 26));
    expect(t).toBe("Daniel Lantigua Pelaez · Grupo 301 · 26/10/2026");
  });

  it("sin grupo no deja huecos", () => {
    expect(watermarkText("Ana Torres", "", new Date(2026, 0, 5))).toBe("Ana Torres · 05/01/2026");
  });

  it("genera una imagen SVG en mosaico con el texto", () => {
    const img = watermarkImage("Ana Torres · Grupo 402");
    expect(img.startsWith('url("data:image/svg+xml')).toBe(true);
    expect(decodeURIComponent(img)).toContain("Ana Torres · Grupo 402");
  });

  it("escapa caracteres especiales del nombre (no rompe el SVG ni inyecta código)", () => {
    const svg = decodeURIComponent(watermarkImage('Ana <script> & "Co"'));
    expect(svg).toContain("Ana &lt;script&gt; &amp; &quot;Co&quot;");
    expect(svg).not.toContain("<script>");
  });
});
