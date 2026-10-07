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

test("public site exposes all core XAYMACA routes", async () => {
  const routes = [
    "app/about/page.tsx",
    "app/tokenomics/page.tsx",
    "app/staking/page.tsx",
    "app/governance/page.tsx",
    "app/faq/page.tsx",
    "app/contact/page.tsx",
  ];

  for (const route of routes) {
    assert.notEqual(await source(route), "", route + " must exist");
  }
});

test("tokenomics page reflects the latest approved 1B XAY allocation", async () => {
  const tokenomics = await source("app/tokenomics/page.tsx");

  for (const expected of [
    "1,000,000,000",
    "400,000,000",
    "250,000,000",
    "150,000,000",
    "100,000,000",
    "1% transfer burn",
    "30,000,000",
  ]) {
    assert.equal(tokenomics.includes(expected), true, "missing " + expected);
  }
});

test("staking and governance clearly identify pre-deployment state", async () => {
  const staking = await source("app/staking/page.tsx");
  const governance = await source("app/governance/page.tsx");

  assert.match(staking, /not yet deployed/i);
  assert.match(governance, /not yet deployed/i);
  assert.doesNotMatch(staking, /APY:\s*\d/i);
  assert.doesNotMatch(staking, /Rewards:\s*\d/i);
});

test("shared navigation includes all primary destinations", async () => {
  const nav = await source("components/site-header.tsx");

  for (const destination of [
    "/about",
    "/tokenomics",
    "/staking",
    "/governance",
    "/faq",
    "/contact",
  ]) {
    assert.equal(nav.includes(destination), true, "missing " + destination);
  }
});
