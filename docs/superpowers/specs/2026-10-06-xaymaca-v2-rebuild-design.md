# XAYMACA v2 Rebuild Design

Date: 2026-10-06  
Branch: `rebuild/xaymaca-v2`

## 1. Purpose

Rebuild XAYMACA from the current incomplete Create React App prototype into a maintainable Web3 application while preserving the XAYMACA brand, the existing XAY concept, and the stated 1,000,000,000 XAY total supply.

The current repository contains useful branding and early UI concepts, but it is missing required dependencies, complete pages, production styling, smart contracts, staking logic, governance logic, deployment configuration, meaningful tests, and a secure Web3 integration layer.

The rebuild will replace the obsolete application shell while preserving Git history so the original implementation remains recoverable.

## 2. Success Criteria

The first complete XAYMACA v2 release should:

- Install and build cleanly from a fresh clone.
- Run as a modern Next.js + TypeScript application.
- Provide responsive Home, About, Tokenomics, Staking, Governance, FAQ, and Contact experiences.
- Connect compatible EVM wallets through a maintained Web3 library stack.
- Never display simulated staking balances or rewards as real on-chain data.
- Keep all wallet-sensitive and deployment-sensitive credentials outside source control.
- Provide tested Solidity contracts for XAY token functionality before live deployment.
- Provide tested staking and governance contracts before exposing write actions in the UI.
- Separate on-chain state from optional off-chain application data.
- Be deployable to Vercel, with Render available for future backend services if required.
- Support product analytics only after the core application functions correctly.

## 3. Scope

### In scope

1. Replace Create React App with Next.js, React, TypeScript, and Tailwind CSS.
2. Preserve and optimize existing XAYMACA visual assets.
3. Build the public site and application navigation.
4. Add wallet connection and network-state handling with wagmi + viem.
5. Add Solidity contracts in a dedicated contract layer.
6. Add automated frontend and smart-contract tests.
7. Add secure environment-variable handling.
8. Add deployment configuration for Vercel.
9. Prepare optional integration points for PostHog, Supabase, and Blockscout.
10. Document local development, testing, deployment, and contract configuration.

### Out of scope for the first implementation pass

- Mainnet deployment.
- Token sale or fundraising mechanics.
- Fiat payment processing.
- Exchange listings.
- Bridge infrastructure.
- NFT functionality.
- Unnecessary backend services.
- User profile storage unless a concrete product requirement depends on it.
- Analytics instrumentation before core functionality is stable.

## 4. Architecture

The repository will remain a single GitHub repository with clear subsystem boundaries.

```text
XAYMACA/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── staking/
│   ├── governance/
│   ├── tokenomics/
│   ├── faq/
│   └── contact/
├── components/
│   ├── layout/
│   ├── marketing/
│   ├── wallet/
│   ├── staking/
│   ├── governance/
│   └── token/
├── lib/
│   ├── web3/
│   ├── contracts/
│   ├── config/
│   └── analytics/
├── contracts/
│   ├── src/
│   ├── test/
│   ├── scripts/
│   └── hardhat.config.ts
├── public/
│   └── brand/
├── docs/
│   └── superpowers/
└── tests/
```

The frontend and contracts will coexist but remain independently understandable and testable.

## 5. Frontend

### Framework

- Next.js
- React
- TypeScript
- Tailwind CSS

The frontend will use the Next.js App Router.

### Public pages

#### Home
Primary brand landing page with:
- XAYMACA identity.
- concise project explanation.
- major ecosystem pillars.
- calls to action for tokenomics, staking, and governance.
- wallet connection only where it adds value.

#### About
Explains:
- XAYMACA's purpose.
- project principles.
- relationship between XAY, staking, and governance.
- transparent status of deployed versus planned capabilities.

#### Tokenomics
Shows:
- 1,000,000,000 XAY total supply.
- allocation model: Public Sale 400M (40%), DAO Treasury 250M (25%), Staking Rewards 150M (15%), Ecosystem Growth 100M (10%), Team & Advisors 100M (10%).
- 1% transfer burn behavior once the corresponding contract behavior exists and tests pass.
- DAO-authorized additional burns only through governance-controlled execution.
- contract address and explorer link once deployed.

No tokenomics chart may imply allocations that have not been formally defined.

#### Staking
Before contract deployment:
- clearly show that staking is not yet live.
- allow wallet connection for integration testing if useful.
- do not show fictional balances, APY, rewards, or transactions.

After deployment:
- connected wallet.
- XAY balance.
- allowance state.
- stake action.
- unstake action.
- claimable rewards.
- transaction state and errors.
- explorer links.

#### Governance
Before governance deployment:
- explain planned governance mechanics without presenting fake proposals.

After deployment:
- voting power.
- active/past proposals.
- proposal details.
- vote actions.
- lifecycle state derived from the governance contract.

#### FAQ
Project and technical questions stored as structured content, not empty placeholders.

#### Contact
Simple public contact paths. A database-backed form is optional and should not be added until needed.

## 6. Design System

The existing XAYMACA branding remains the starting point.

Design direction:
- dark, premium base.
- Jamaican-inspired green and gold accents.
- strong contrast and accessible typography.
- restrained motion.
- mobile-first responsive layout.
- no generic meme-coin styling.

Existing PNG assets will be optimized and moved under `public/brand/`.

Accessibility requirements:
- keyboard-accessible interactive elements.
- visible focus states.
- semantic headings.
- meaningful alt text.
- sufficient text/background contrast.
- reduced-motion support.

## 7. Web3 Integration

### Client libraries

Use:
- wagmi
- viem

Avoid directly coupling UI components to low-level provider APIs.

### Responsibilities

`lib/web3/` owns:
- supported chain definitions.
- wallet configuration.
- public client configuration.
- network validation.

`lib/contracts/` owns:
- deployed addresses.
- ABIs.
- typed contract access helpers.
- deployment-state checks.

UI components consume these modules rather than embedding addresses or ABIs.

### Wallet behavior

The application must:
- handle no-wallet-installed state.
- handle disconnected state.
- handle rejected connection requests.
- detect unsupported networks.
- provide a deliberate network-switch flow.
- react to wallet account/network changes.
- never request signatures or transactions without a user action that clearly requires them.

## 8. Smart Contracts

Contracts will use Solidity and OpenZeppelin.

### 8.1 XaymacaToken

Initial requirements:
- ERC-20 compatible XAY token named Xaymaca with symbol XAY and 18 decimals.
- fixed supply of 1,000,000,000 XAY with no minting after deployment.
- initial distribution targets: 400M Public Sale, 250M DAO Treasury, 150M Staking Rewards, 100M Ecosystem Growth, and 100M Team & Advisors.
- 1% burn on non-mint/non-burn transfers, subject to a minimum-supply safety floor.
- public self-burn support.
- deployment/distribution behavior explicitly tested.
- no post-deployment mint authority.
- ownership/admin behavior documented.

The later December 29, 2024 token specification fixes the minimum-supply floor at 30,000,000 XAY. Automatic transfer burns must adjust rather than cross that floor, and manual burns must not reduce supply below it.

### 8.2 XaymacaStaking

Staking will be a separate contract rather than embedding staking logic into the token.

Responsibilities:
- accept XAY staking.
- track user stake state.
- calculate rewards according to a defined reward policy.
- allow withdrawal.
- allow reward claiming.
- protect against obvious reentrancy and accounting errors.
- define owner/admin capabilities narrowly.

Reward economics must be defined before finalizing this contract. The UI will not advertise an APY until the contract's funding and reward formula are approved.

### 8.3 Governance

Use OpenZeppelin governance primitives where appropriate.

Expected components:
- governance-enabled voting token behavior or delegated voting representation.
- Governor contract.
- TimelockController.
- documented proposal threshold, voting delay, voting period, quorum, and timelock.

Exact governance parameters are configuration decisions that must be explicitly recorded before production deployment.

## 9. Contract Deployment State

The frontend must not assume a contract exists.

Contract configuration will support an explicit state such as:

```ts
{
  token: null,
  staking: null,
  governor: null,
  timelock: null
}
```

When an address is absent:
- related write features are disabled.
- the page explains that the feature is not deployed.
- no mock blockchain values are substituted.

When an address exists:
- chain ID and address must match the deployment configuration.
- explorer links may be generated.
- ABI calls become available.

## 10. Chain Strategy

The code should initially be EVM-compatible and chain-configurable rather than hard-wired throughout the UI.

Polygon is the preferred production chain from the earlier project direction. The implementation will remain EVM-configurable and support local/testnet development first so deployment can be validated before production costs are incurred.

The chosen production network must be set centrally in configuration.

## 11. Off-Chain Data

Supabase is optional.

It may be introduced for features such as:
- notification preferences.
- contact submissions.
- user-facing profile preferences.
- cached proposal metadata that is not authoritative.
- application-specific content management.

Supabase must never be treated as authoritative for:
- XAY balances.
- staking principal.
- staking rewards.
- voting power.
- proposal execution state.
- token supply.

Those values come from the blockchain.

## 12. Analytics

PostHog may be introduced after core functionality is stable.

Potential events:
- page viewed.
- wallet connect initiated.
- wallet connected.
- unsupported network encountered.
- staking transaction initiated/succeeded/failed.
- governance vote initiated/succeeded/failed.

Never send:
- private keys.
- seed phrases.
- authentication secrets.
- full sensitive wallet-signature payloads.

Wallet addresses should only be collected in analytics if there is a deliberate documented reason.

## 13. Block Explorer Integration

Blockscout may be used for:
- contract inspection.
- ABI/source verification.
- transaction links.
- wallet/token activity inspection during development.
- deployed contract validation.

Explorer data supplements but does not replace direct contract reads where application correctness depends on current state.

## 14. Security

### Source control

Never commit:
- private keys.
- mnemonic/seed phrases.
- RPC credentials intended to be secret.
- deployment-wallet credentials.
- production database secrets.
- service-role keys.

Provide `.env.example` containing names only.

### Contract security

Before production deployment:
- complete automated tests.
- static/security review where tooling permits.
- review privileged/admin functions.
- review token distribution and supply assumptions.
- review reentrancy, precision, access control, reward funding, and denial-of-service risks.
- use a testnet before production.

### Frontend security

- validate chain and contract configuration.
- never construct transaction calldata from untrusted arbitrary input when a typed contract call is available.
- clearly show transaction intent before wallet confirmation.
- avoid dangerously injecting untrusted HTML.
- keep third-party dependencies minimal.

## 15. Testing Strategy

### Frontend

Use automated tests for:
- critical public page rendering.
- navigation.
- deployment-state messaging.
- wallet disconnected/connected state.
- unsupported-network state.
- transaction-state components.
- absence of fake staking/token values.

### Contracts

Each contract requires unit tests.

`XaymacaToken` tests:
- name/symbol/supply.
- supply constraints.
- transfers.
- access-control behavior.
- any approved burn behavior.

`XaymacaStaking` tests:
- staking.
- multiple users.
- reward accounting.
- claims.
- withdrawal.
- edge cases.
- admin restrictions.
- attack-oriented cases relevant to the implementation.

Governance tests:
- delegation/voting power.
- proposal creation.
- voting.
- quorum.
- timelock.
- execution.
- invalid lifecycle actions.

### Build verification

Before merge:
- dependency install succeeds.
- lint succeeds.
- TypeScript check succeeds.
- frontend tests succeed.
- production build succeeds.
- contract compile succeeds.
- contract test suite succeeds.

## 16. Error Handling

Wallet and blockchain errors should be translated into concise application states while retaining technical detail for debugging.

Expected categories:
- wallet unavailable.
- connection rejected.
- unsupported network.
- RPC unavailable.
- contract not deployed.
- user rejected transaction.
- transaction reverted.
- transaction pending.
- transaction confirmed.

The UI must not treat a submitted transaction as complete until confirmation criteria are satisfied.

## 17. Deployment

### Frontend

Primary target: Vercel.

Requirements:
- production build from GitHub.
- environment-variable configuration through hosting provider settings.
- no secrets stored in source files.
- deployment preview support on non-main branches.

### Render

Render remains available for future services that genuinely require:
- a persistent backend process.
- scheduled tasks.
- background workers.
- backend APIs not suited to the frontend deployment model.

Do not create backend infrastructure until the product needs it.

## 18. Git Strategy

All rebuild work begins on:

`rebuild/xaymaca-v2`

`main` remains untouched during implementation.

Implementation should use small, reviewable commits grouped by subsystem.

No force push or destructive history rewrite is required.

## 19. Migration From the Existing Repository

Retain:
- project name.
- brand identity.
- logo assets after optimization.
- useful copy/concepts that remain accurate.
- Git history.

Replace:
- Create React App runtime.
- broken/default CRA tests.
- placeholder pages.
- fake staking values.
- inactive buttons.
- placeholder styling configuration.
- direct legacy wallet provider implementation.

The old code does not need to remain copied into the new runtime because Git history already preserves it.

## 20. Delivery Sequence

1. Establish modern frontend foundation.
2. Rebuild brand layout and public pages.
3. Add wallet/network integration with no deployed-contract assumptions.
4. Add XAY token contract and contract tests.
5. Add typed frontend token integration.
6. Define and implement staking economics/contract.
7. Integrate staking UI.
8. Define and implement governance parameters/contracts.
9. Integrate governance UI.
10. Add optional analytics/off-chain integrations.
11. Run full security/testing review.
12. Prepare testnet deployment.
13. Only after successful testnet validation, consider production deployment.

## 21. Decisions Deferred Until Needed

These items are intentionally not guessed:

- staking reward rate and funding model.
- lock periods, if any.
- governance quorum.
- proposal threshold.
- voting delay/period.
- timelock delay.
- final production chain.
- production contract addresses.

Each must be made explicitly before the implementation stage that depends on it.

## 22. Core Principle

XAYMACA v2 should never visually imply functionality that is not actually implemented or deployed.

The application should clearly distinguish:
- planned capability,
- implemented/tested capability,
- testnet capability,
- production capability.

That principle applies especially to staking balances, rewards, token supply behavior, governance proposals, contract addresses, and transaction status.
