# XAYMACA

XAYMACA is a Web3 project built around the XAY token, staking/liquidity incentives, and DAO governance. The application is being rebuilt from the original 2024 prototype with a modern Next.js, TypeScript, wagmi, viem, Hardhat, and OpenZeppelin stack.

## Current specification

- Token: **Xaymaca (XAY)**
- Network direction: **Polygon / EVM**, with local and testnet validation before production
- Fixed supply: **1,000,000,000 XAY**
- Public sale: **400,000,000 XAY**
- DAO treasury: **250,000,000 XAY**
- Staking rewards: **150,000,000 XAY**
- Ecosystem growth: **100,000,000 XAY**
- Team & advisors: **100,000,000 XAY**
- Transfer burn: **1%** until total supply reaches **30,000,000 XAY**
- Post-deployment minting: **disabled**
- Governance token behavior: **ERC20Votes-compatible**

No production contract addresses are currently committed. The UI intentionally shows staking and governance as undeployed until verified contracts exist.

## Development

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run contracts:compile
npm run contracts:test
```

Environment-variable names are documented in `.env.example`. Never commit private keys, seed phrases, deployer credentials, or production secrets.

## Repository status

Active rebuild work is isolated on `rebuild/xaymaca-v2` until verification is complete. The original Git history remains intact.
