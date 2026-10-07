import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MIN_SUPPLY = 30_000_000n * 10n ** 18n;

const DEFAULT_PUBLIC_SALE_WALLET =
  "0x1000000000000000000000000000000000000001";
const DEFAULT_DAO_TREASURY_WALLET =
  "0x1000000000000000000000000000000000000002";
const DEFAULT_STAKING_REWARDS_WALLET =
  "0x1000000000000000000000000000000000000003";
const DEFAULT_ECOSYSTEM_GROWTH_WALLET =
  "0x1000000000000000000000000000000000000004";
const DEFAULT_TEAM_ADVISORS_WALLET =
  "0x1000000000000000000000000000000000000005";

export default buildModule("XaymacaCore", (m) => {
  const deployer = m.getAccount(0);

  const publicSaleWallet = m.getParameter(
    "publicSaleWallet",
    DEFAULT_PUBLIC_SALE_WALLET,
  );
  const daoTreasuryWallet = m.getParameter(
    "daoTreasuryWallet",
    DEFAULT_DAO_TREASURY_WALLET,
  );
  const stakingRewardsWallet = m.getParameter(
    "stakingRewardsWallet",
    DEFAULT_STAKING_REWARDS_WALLET,
  );
  const ecosystemGrowthWallet = m.getParameter(
    "ecosystemGrowthWallet",
    DEFAULT_ECOSYSTEM_GROWTH_WALLET,
  );
  const teamAdvisorsWallet = m.getParameter(
    "teamAdvisorsWallet",
    DEFAULT_TEAM_ADVISORS_WALLET,
  );

  const token = m.contract(
    "XaymacaToken",
    [
      publicSaleWallet,
      daoTreasuryWallet,
      stakingRewardsWallet,
      ecosystemGrowthWallet,
      teamAdvisorsWallet,
      MIN_SUPPLY,
    ],
    { from: deployer },
  );

  const staking = m.contract(
    "XaymacaStaking",
    [token, token, daoTreasuryWallet],
    { from: deployer },
  );

  return { token, staking };
});
