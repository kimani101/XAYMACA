import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

async function exists(path) {
  try {
    await access(new URL(`../${path}`, import.meta.url));
    return true;
  } catch {
    return false;
  }
}

test("governance UI defines token voting and governor proposal ABIs", async () => {
  const source = await readFile(
    new URL("../lib/contracts/abis.ts", import.meta.url),
    "utf8",
  );

  for (const fn of ["getVotes", "delegate"]) {
    assert.match(source, new RegExp(`name: ["']${fn}["']`));
  }

  for (const fn of [
    "state",
    "proposalSnapshot",
    "proposalDeadline",
    "proposalVotes",
    "quorum",
    "castVote",
  ]) {
    assert.match(source, new RegExp(`name: ["']${fn}["']`));
  }
});

test("governance dashboard reads verified chain state and supports voting", async () => {
  assert.equal(await exists("components/governance-dashboard.tsx"), true);

  const source = await readFile(
    new URL("../components/governance-dashboard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /useReadContract/);
  assert.match(source, /useWriteContract/);
  assert.match(source, /useWaitForTransactionReceipt/);
  assert.match(source, /getDeployment/);
  assert.match(source, /castVote/);
  assert.match(source, /delegate/);
  assert.match(source, /proposalId/);
  assert.doesNotMatch(source, /mock/i);
});

test("governance page renders the on-chain dashboard while retaining explicit pre-deployment status", async () => {
  const source = await readFile(
    new URL("../app/governance/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /GovernanceDashboard/);
  assert.match(source, /not yet deployed/i);
});
