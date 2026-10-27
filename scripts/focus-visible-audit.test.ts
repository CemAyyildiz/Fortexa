import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("keyboard-visible focus style audit (issue #360)", () => {
  const rootDir = path.resolve(__dirname, "..");
  const globalsCssPath = path.join(rootDir, "src/app/globals.css");
  const buttonComponentPath = path.join(rootDir, "src/components/ui/button.tsx");

  it("ensures globals.css defines shared keyboard-visible focus styles", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toContain(":focus-visible");
    expect(css).toContain("outline: 2px solid hsl(var(--ring))");
    expect(css).toContain("outline-offset: 2px");
  });

  it("ensures links share visible focus-visible treatment", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toMatch(/a:focus-visible/);
    expect(css).toMatch(/\[role="link"\]:focus-visible/);
  });

  it("ensures buttons and interactive triggers share visible focus-visible treatment", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toMatch(/button:focus-visible/);
    expect(css).toMatch(/\[role="button"\]:focus-visible/);
  });

  it("ensures form controls (input, select, textarea) share visible focus-visible treatment", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toMatch(/input:focus-visible/);
    expect(css).toMatch(/select:focus-visible/);
    expect(css).toMatch(/textarea:focus-visible/);
  });

  it("ensures tabs share visible focus-visible treatment", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toMatch(/\[role="tab"\]:focus-visible/);
  });

  it("ensures compact navigation actions share visible focus-visible treatment", () => {
    const css = fs.readFileSync(globalsCssPath, "utf8");

    expect(css).toMatch(/nav a:focus-visible/);
    expect(css).toMatch(/nav button:focus-visible/);
    expect(css).toMatch(/\[tabindex\]:focus-visible/);
  });

  it("ensures Button component includes matching ring focus treatment", () => {
    const code = fs.readFileSync(buttonComponentPath, "utf8");

    expect(code).toContain("focus-visible:ring-2");
    expect(code).toContain("focus-visible:ring-[hsl(var(--ring))]");
    expect(code).toContain("focus-visible:ring-offset-2");
  });
});
