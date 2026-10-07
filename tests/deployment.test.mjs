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

test("defines a reproducible Hardhat Ignition deployment module", async () => {
  assert.equal(
    await exists("ignition/modules/XaymacaCore.ts"),
    true,
    "XaymacaCore Ignition module must exist",
  );

  const source = await readFile(
    new URL("../ignition/modules/XaymacaCore.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /buildModule/);
  assert.match(source, /XaymacaToken/);
  assert.match(source, /XaymacaStaking/);
  assert.match(source, /30_000_000n \* 10n \*\* 18n/);
});

test("exposes a simulated deployment verification command", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(
    packageJson.scripts?.["contracts:deploy:simulated"],
    "hardhat ignition deploy ignition/modules/XaymacaCore.ts",
  );
});
