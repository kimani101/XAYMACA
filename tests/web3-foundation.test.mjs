import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("Web3 foundation uses current wagmi and viem stack", async () => {
  const packageJson = JSON.parse(await source("package.json"));

  assert.ok(packageJson.dependencies?.wagmi, "wagmi dependency is required");
  assert.ok(packageJson.dependencies?.viem, "viem dependency is required");
  assert.ok(
    packageJson.dependencies?.["@tanstack/react-query"],
    "@tanstack/react-query dependency is required"
  );
});

test("Web3 foundation centralizes chain and deployment configuration", async () => {
  for (const path of [
    "lib/web3/config.ts",
    "lib/contracts/deployments.ts",
    "components/web3-provider.tsx",
    "components/wallet-connect.tsx",
  ]) {
    assert.notEqual(await source(path), "", path + " must exist");
  }

  const config = await source("lib/web3/config.ts");
  assert.match(config, /polygon/i);
  assert.match(config, /polygonAmoy/i);

  const deployments = await source("lib/contracts/deployments.ts");
  assert.match(deployments, /token:\s*null/i);
  assert.match(deployments, /staking:\s*null/i);
  assert.match(deployments, /governor:\s*null/i);
  assert.match(deployments, /timelock:\s*null/i);
});

test("wallet UI handles disconnected and unsupported-network states", async () => {
  const wallet = await source("components/wallet-connect.tsx");

  assert.match(wallet, /Connect Wallet/i);
  assert.match(wallet, /Unsupported network/i);
});
