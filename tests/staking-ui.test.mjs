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

test("staking UI has typed contract ABIs and a live dashboard component", async () => {
  assert.equal(await exists("lib/contracts/abis.ts"), true);
  assert.equal(await exists("components/staking-dashboard.tsx"), true);

  const abiSource = await readFile(
    new URL("../lib/contracts/abis.ts", import.meta.url),
    "utf8",
  );
  for (const fn of [
    "balanceOf",
    "allowance",
    "approve",
    "earned",
    "stake",
    "withdraw",
    "getReward",
    "compoundReward",
  ]) {
    assert.match(abiSource, new RegExp(`name: ["']${fn}["']`));
  }
});

test("staking dashboard is driven by deployment config and wagmi reads/writes", async () => {
  const source = await readFile(
    new URL("../components/staking-dashboard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /useReadContract/);
  assert.match(source, /useWriteContract/);
  assert.match(source, /useWaitForTransactionReceipt/);
  assert.match(source, /getDeployment/);
  assert.match(source, /parseUnits/);
  assert.match(source, /formatUnits/);
  assert.doesNotMatch(source, /Staked Tokens:\s*0/);
  assert.doesNotMatch(source, /Rewards:\s*0/);
});

test("staking page renders the live dashboard", async () => {
  const source = await readFile(
    new URL("../app/staking/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /StakingDashboard/);
});
