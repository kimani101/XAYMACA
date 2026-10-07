import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

async function exists(path) {
  try {
    await access(new URL(`../${path}`, import.meta.url));
    return true;
  } catch {
    return false;
  }
}

test("uses a modern Next.js TypeScript foundation", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  );

  assert.ok(packageJson.dependencies?.next, "Next.js dependency is required");
  assert.ok(packageJson.dependencies?.react, "React dependency is required");
  assert.ok(packageJson.devDependencies?.typescript, "TypeScript is required");

  for (const path of [
    "app/layout.tsx",
    "app/page.tsx",
    "app/globals.css",
    "tsconfig.json",
    "next.config.ts",
    ".env.example",
  ]) {
    assert.equal(await exists(path), true, `${path} must exist`);
  }
});

test("removes Create React App runtime dependency", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
  );

  assert.equal(
    Object.hasOwn(packageJson.dependencies ?? {}, "react-scripts"),
    false,
    "react-scripts must be removed"
  );
});
