import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

describe("Dedicated TypeScript typecheck CI command (#347)", () => {
  it("exposes a typecheck package script configured with tsc --noEmit", () => {
    const pkgPath = resolve(REPO_ROOT, "package.json");
    expect(existsSync(pkgPath)).toBe(true);

    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.typecheck).toBeDefined();
    expect(pkg.scripts.typecheck).toBe("tsc --noEmit");

    expect(pkg.devDependencies).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
  });

  it("has a valid tsconfig.json file configured for TypeScript checking", () => {
    const tsconfigPath = resolve(REPO_ROOT, "tsconfig.json");
    expect(existsSync(tsconfigPath)).toBe(true);

    const raw = readFileSync(tsconfigPath, "utf-8");
    const tsconfig = JSON.parse(raw);
    expect(tsconfig.compilerOptions).toBeDefined();
  });

  it("includes a separate, dedicated Typecheck step in .github/workflows/ci.yml", () => {
    const ciPath = resolve(REPO_ROOT, ".github/workflows/ci.yml");
    expect(existsSync(ciPath)).toBe(true);

    const ciContent = readFileSync(ciPath, "utf-8");
    expect(ciContent).toMatch(/name:\s*Typecheck\s*\n\s*run:\s*npm run typecheck/);
  });
});
