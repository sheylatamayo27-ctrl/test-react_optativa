import { describe, it, expect } from "vitest";
import { inlineMd, highlight, shuffle, hashStr, answerInfo } from "../../src/lib/util.js";

describe("inlineMd", () => {
  it("negrita, cursiva y código", () => {
    expect(inlineMd("**hola** *mundo* `x`")).toBe("<strong>hola</strong> <em>mundo</em> <code>x</code>");
  });

  it("permite código dentro de una negrita", () => {
    expect(inlineMd("**cada vez que `id` cambia**")).toBe("<strong>cada vez que <code>id</code> cambia</strong>");
  });

  it("no aplica formato dentro del código", () => {
    expect(inlineMd("`n * 2 * 3`")).toBe("<code>n * 2 * 3</code>");
  });

  it("escapa HTML (evita inyectar etiquetas desde el contenido)", () => {
    expect(inlineMd("<a> y `<Link to=\"/x\">`")).toBe('&lt;a&gt; y <code>&lt;Link to="/x"&gt;</code>');
    expect(inlineMd("<img src=x onerror=alert(1)>")).not.toContain("<img");
  });
});

describe("highlight", () => {
  it("escapa el código y colorea palabras clave, cadenas y etiquetas JSX", () => {
    const html = highlight('const a = "<b>";\n<UserCard />');
    expect(html).toContain('<span class="t-kw">const</span>');
    expect(html).toContain('<span class="t-str">"&lt;b&gt;"</span>');
    expect(html).toContain('&lt;<span class="t-tag">UserCard</span>');
    expect(html).not.toContain("<b>");
  });
});

describe("shuffle", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  it("con la misma semilla da siempre el mismo orden (estable por alumno)", () => {
    expect(shuffle(arr, 42)).toEqual(shuffle(arr, 42));
  });

  it("es una permutación: no pierde ni duplica elementos", () => {
    expect([...shuffle(arr, 7)].sort()).toEqual(arr);
  });

  it("no modifica el array original", () => {
    const copy = arr.slice();
    shuffle(arr, 3);
    expect(arr).toEqual(copy);
  });

  it("distintas semillas producen órdenes distintos", () => {
    const orders = new Set([1, 2, 3, 4, 5].map((s) => shuffle(arr, s + hashStr("m1")).join()));
    expect(orders.size).toBeGreaterThan(1);
  });
});

describe("answerInfo", () => {
  it("sin respuesta", () => {
    expect(answerInfo(undefined)).toMatchObject({ tried: false, solved: false, tries: 0, firstTry: false });
  });
  it("progreso antiguo sin 'tries' cuenta como 1 intento", () => {
    expect(answerInfo({ optId: "a", solved: true })).toMatchObject({ tries: 1, firstTry: true });
  });
});
