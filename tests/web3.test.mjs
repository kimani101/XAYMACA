import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function read(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("Web3 client uses wagmi and viem", async () => {
  const pkg = JSON.parse(await read("package.json"));
  assert.ok(pkg.dependencies?.wagmi, "wagmi dependency is required");
  assert.ok(pkg.dependencies?.viem, "viem dependency is required");
  assert.ok(pkg.dependencies?.["@tanstack/react-query"], "React Query dependency is required");
});

test("Web3 configuration is centralized and Polygon-ready", async () => {
  const config = await read("lib/web3/config.ts");
  const deployments = await read("lib/contracts/deployments.ts");

  assert.notEqual(config, "", "lib/web3/config.ts must exist");
  assert.match(config, /polygon/);
  assert.match(config, /137/);

  assert.notEqual(deployments, "", "deployment config must exist");
  assert.match(deployments, /token:\s*null/);
  assert.match(deployments, /staking:\s*null/);
  assert.match(deployments, /governor:\s*null/);
  assert.match(deployments, /timelock:\s*null/);
});

test("wallet UI never invents live contract state", async () => {
  const wallet = await read("components/wallet-status.tsx");
  assert.notEqual(wallet, "", "wallet status component must exist");
  assert.doesNotMatch(wallet, /fake|mock balance|demo rewards/i);
});
