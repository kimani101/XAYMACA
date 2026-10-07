# XAYMACA v2 Implementation Plan

Spec: `docs/superpowers/specs/2026-10-06-xaymaca-v2-rebuild-design.md`
Branch: `rebuild/xaymaca-v2`

## Global constraints

- Preserve Git history; do not rewrite `main`.
- Modernize the old project while retaining XAYMACA branding and the latest evidenced token specification: 1B XAY total supply; 400M public sale, 250M DAO treasury, 150M staking rewards, 100M ecosystem growth, 100M team/advisors; no minting after deployment.
- Implement the historical 1% transfer-burn concept with an explicit tested minimum-supply floor.
- Polygon remains the preferred production chain, but local/testnet validation comes first.
- No private keys, seed phrases, production secrets, or service-role keys in Git.
- No fake staking balances, rewards, APY, governance proposals, or contract addresses.
- Use modular contracts and OpenZeppelin primitives rather than monolithic custom implementations.
- No production deployment or irreversible on-chain action during this plan.

## Task 1 — Replace CRA foundation with Next.js/TypeScript

### Produces
- modern package manifest and scripts
- Next.js App Router foundation
- TypeScript config
- Tailwind/PostCSS foundation
- lint/test tooling
- environment example

### Files
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.env.example`
- `.gitignore`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`

### Verification
- dependency install
- typecheck
- lint
- production build

## Task 2 — Rebuild brand shell and public pages

### Produces
- responsive site shell
- navigation/footer
- Home, About, Tokenomics, Staking, Governance, FAQ, Contact
- transparent deployment-status UI
- optimized use of XAYMACA brand assets

### Tests
- critical page rendering
- navigation labels
- tokenomics values
- staking/governance pre-deployment messaging

## Task 3 — Add Web3 client foundation

### Produces
- wagmi + viem configuration
- Polygon/testnet chain configuration
- wallet connect state
- unsupported network state
- typed deployment-address config
- no-contract-deployed fallback

### Tests
- deployment state helper
- unsupported network state
- absence of fake chain values

## Task 4 — Implement and test XaymacaToken

### Produces
- Solidity/OpenZeppelin token
- 1B fixed supply
- historical allocation model
- 1% non-mint/non-burn transfer burn
- public self-burn
- minimum-supply safety floor
- governance-compatible voting/delegation support where appropriate
- constrained admin model

### Tests
- name/symbol/decimals
- total/max supply
- allocation totals
- transfers and 1% burn
- burn-floor behavior
- self-burn
- unauthorized privileged actions
- voting/delegation behavior if enabled

## Task 5 — Add contract deployment/config integration

### Produces
- Hardhat configuration
- local/testnet deployment script
- generated/maintained ABI boundary
- frontend deployment-state config
- explorer-link helpers

### Tests
- local deployment
- frontend recognizes absent/present address states
- wrong-chain protection

## Task 6 — Define and implement staking

### Produces
- isolated `XaymacaStaking` contract
- reward accounting with explicitly documented testnet parameters
- stake/withdraw/claim
- reentrancy and access-control protections
- frontend staking reads/writes

### Tests
- single/multi-user accounting
- claims
- withdrawal
- reward edge cases
- admin restrictions
- transaction UI states

## Task 7 — Implement governance/timelock

### Produces
- OpenZeppelin Governor
- TimelockController
- proposal/vote/execution flow
- frontend governance views
- Polygon-ready config

### Tests
- delegation
- proposal lifecycle
- voting/quorum
- timelock
- execution and invalid transitions

## Task 8 — Optional application services

### Produces
- PostHog integration behind environment configuration
- Supabase integration only if an off-chain feature requires persistence
- privacy-conscious analytics event schema

### Tests
- app works with services disabled
- no sensitive wallet data is sent by default

## Task 9 — Full verification and deployment preview

### Verification
- fresh install
- lint
- typecheck
- frontend tests
- Next.js production build
- Solidity compile
- contract test suite
- security-focused review
- deploy preview to Vercel
- inspect preview for runtime/build failures

## Review focus

- Token supply/allocation arithmetic
- transfer-burn edge cases and floor behavior
- wallet/network mismatch behavior
- no misleading pre-deployment UX
- contract privileged functions
- reentrancy/reward accounting
- secrets/config isolation
- responsive/accessibility regressions
