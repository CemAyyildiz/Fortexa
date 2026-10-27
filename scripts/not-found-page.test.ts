import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const NOT_FOUND_PATH = resolve(REPO_ROOT, "src/app/not-found.tsx");

describe("Branded 404 not-found page with safe navigation (#355)", () => {
  it("exists at src/app/not-found.tsx", () => {
    expect(existsSync(NOT_FOUND_PATH)).toBe(true);
  });

  it("exports a default React component for Next.js App Router", async () => {
    const raw = readFileSync(NOT_FOUND_PATH, "utf-8");
    expect(raw).toMatch(/export\s+default\s+function\s+NotFound/);
  });

  it("provides safe navigation links to public home and console without dynamic parameters", () => {
    const raw = readFileSync(NOT_FOUND_PATH, "utf-8");

    // Must link to public home ("/")
    expect(raw).toMatch(/href=["']\/["']/);

    // Must link to authenticated console/overview ("/console")
    expect(raw).toMatch(/href=["']\/console["']/);
  });

  it("does not echo or reflect unvalidated unknown paths or URL search params", () => {
    const raw = readFileSync(NOT_FOUND_PATH, "utf-8");

    // Anti-reflection / Anti-DOM-XSS security checks:
    // Page must not read or reflect unknown paths, pathname hooks, or location objects
    expect(raw).not.toContain("usePathname");
    expect(raw).not.toContain("useSearchParams");
    expect(raw).not.toContain("window.location");
    expect(raw).not.toContain("document.location");
    expect(raw).not.toContain("dangerouslySetInnerHTML");
  });

  it("features Fortexa branding, 404 status indicator, and accessible buttons", () => {
    const raw = readFileSync(NOT_FOUND_PATH, "utf-8");

    expect(raw).toContain("Fortexa");
    expect(raw).toContain("404");
    expect(raw).toContain("Page Not Found");
    expect(raw).toContain("aria-label");
  });
});
