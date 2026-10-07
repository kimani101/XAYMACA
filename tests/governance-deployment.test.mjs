import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("core deployment wires Governor and Timelock roles without fixed production policy", async () => {
  const source = await readFile(
    new URL("../ignition/modules/XaymacaCore.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /TimelockController/);
  assert.match(source, /XaymacaGovernor/);

  for (const parameter of [
    "timelockDelay",
    "votingDelay",
    "votingPeriod",
    "proposalThreshold",
    "quorumNumerator",
  ]) {
    assert.match(source, new RegExp(`getParameter\\(\\s*["']${parameter}["']`));
  }

  assert.match(source, /grantRole/);
  assert.match(source, /PROPOSER_ROLE/);
  assert.match(source, /CANCELLER_ROLE/);
  assert.match(source, /EXECUTOR_ROLE/);
  assert.match(source, /zeroAddress/);
  assert.match(source, /renounceRole/);
});

test("deployment module exports governance contracts for downstream address capture", async () => {
  const source = await readFile(
    new URL("../ignition/modules/XaymacaCore.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /return\s*{[^}]*governor/s);
  assert.match(source, /return\s*{[^}]*timelock/s);
});
