import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256, toBytes, zeroAddress } from "viem";

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

const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const PROPOSER_ROLE = keccak256(toBytes("PROPOSER_ROLE"));
const CANCELLER_ROLE = keccak256(toBytes("CANCELLER_ROLE"));
const EXECUTOR_ROLE = keccak256(toBytes("EXECUTOR_ROLE"));

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

  // These governance values are local/testnet defaults only. Production
  // deployment parameters must be supplied explicitly after governance policy
  // is finalized.
  const timelockDelay = m.getParameter("timelockDelay", 172_800n);
  const votingDelay = m.getParameter("votingDelay", 7_200n);
  const votingPeriod = m.getParameter("votingPeriod", 50_400n);
  const proposalThreshold = m.getParameter(
    "proposalThreshold",
    1n * 10n ** 18n,
  );
  const quorumNumerator = m.getParameter("quorumNumerator", 4n);

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

  const timelock = m.contract(
    "TimelockController",
    [timelockDelay, [], [], deployer],
    { from: deployer },
  );

  const governor = m.contract(
    "XaymacaGovernor",
    [
      token,
      timelock,
      votingDelay,
      votingPeriod,
      proposalThreshold,
      quorumNumerator,
    ],
    { from: deployer },
  );

  const grantProposer = m.call(
    timelock,
    "grantRole",
    [PROPOSER_ROLE, governor],
    { from: deployer, id: "grant-governor-proposer" },
  );
  const grantCanceller = m.call(
    timelock,
    "grantRole",
    [CANCELLER_ROLE, governor],
    { from: deployer, id: "grant-governor-canceller" },
  );
  const grantExecutor = m.call(
    timelock,
    "grantRole",
    [EXECUTOR_ROLE, zeroAddress],
    { from: deployer, id: "open-timelock-execution" },
  );

  m.call(
    timelock,
    "renounceRole",
    [DEFAULT_ADMIN_ROLE, deployer],
    {
      from: deployer,
      id: "renounce-temporary-timelock-admin",
      after: [grantProposer, grantCanceller, grantExecutor],
    },
  );

  return { token, staking, governor, timelock };
});
