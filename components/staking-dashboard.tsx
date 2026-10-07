"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  xaymacaStakingAbi,
  xaymacaTokenAbi,
} from "@/lib/contracts/abis";
import { getDeployment } from "@/lib/contracts/deployments";

const DECIMALS = 18;

function formatXay(value: bigint | undefined) {
  if (value === undefined) return "—";
  const [whole, fraction = ""] = formatUnits(value, DECIMALS).split(".");
  const trimmed = fraction.slice(0, 4).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole;
}

function parsePositiveAmount(value: string) {
  try {
    const parsed = parseUnits(value.trim(), DECIMALS);
    return parsed > 0n ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function StakingDashboard() {
  const connection = useConnection();
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const deployment = connection.chainId
    ? getDeployment(connection.chainId)
    : null;
  const tokenAddress = deployment?.token ?? undefined;
  const stakingAddress = deployment?.staking ?? undefined;
  const account = connection.address;
  const contractsReady = Boolean(tokenAddress && stakingAddress);
  const readsEnabled = Boolean(
    connection.isConnected && account && tokenAddress && stakingAddress,
  );

  const {
    data: walletBalance,
    refetch: refetchWalletBalance,
    error: walletBalanceError,
  } = useReadContract({
    address: tokenAddress,
    abi: xaymacaTokenAbi,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: readsEnabled },
  });

  const {
    data: allowance,
    refetch: refetchAllowance,
    error: allowanceError,
  } = useReadContract({
    address: tokenAddress,
    abi: xaymacaTokenAbi,
    functionName: "allowance",
    args: account && stakingAddress ? [account, stakingAddress] : undefined,
    query: { enabled: readsEnabled },
  });

  const {
    data: stakedBalance,
    refetch: refetchStakedBalance,
    error: stakedBalanceError,
  } = useReadContract({
    address: stakingAddress,
    abi: xaymacaStakingAbi,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: readsEnabled },
  });

  const {
    data: earnedRewards,
    refetch: refetchEarnedRewards,
    error: earnedRewardsError,
  } = useReadContract({
    address: stakingAddress,
    abi: xaymacaStakingAbi,
    functionName: "earned",
    args: account ? [account] : undefined,
    query: { enabled: readsEnabled },
  });

  const writeContract = useWriteContract();
  const receipt = useWaitForTransactionReceipt({
    hash: transactionHash,
    chainId: connection.chainId,
  });

  const parsedAmount = useMemo(() => parsePositiveAmount(amount), [amount]);
  const needsApproval =
    parsedAmount !== undefined &&
    allowance !== undefined &&
    allowance < parsedAmount;

  useEffect(() => {
    if (!receipt.isSuccess) return;

    void Promise.all([
      refetchWalletBalance(),
      refetchAllowance(),
      refetchStakedBalance(),
      refetchEarnedRewards(),
    ]);
  }, [
    receipt.isSuccess,
    refetchAllowance,
    refetchEarnedRewards,
    refetchStakedBalance,
    refetchWalletBalance,
  ]);

  async function submitWrite(
    action: string,
    request: Parameters<typeof writeContract.mutateAsync>[0],
  ) {
    setLastAction(action);
    setTransactionHash(undefined);

    const hash = await writeContract.mutateAsync(request);
    setTransactionHash(hash);
  }

  if (!connection.isConnected || !account) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-xl font-bold text-white">Connect a wallet to stake</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Wallet connection is available in the site header. No balances or
          rewards are shown until a wallet is connected.
        </p>
      </section>
    );
  }

  if (!contractsReady || !tokenAddress || !stakingAddress) {
    return (
      <section className="rounded-3xl border border-[var(--xay-gold)]/40 bg-[var(--surface)] p-6">
        <h2 className="text-xl font-bold text-white">Staking is not deployed on this network</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          XAYMACA will enable staking controls only after verified token and
          staking contract addresses are configured for this chain.
        </p>
      </section>
    );
  }

  const readError =
    walletBalanceError ??
    allowanceError ??
    stakedBalanceError ??
    earnedRewardsError;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Wallet XAY", formatXay(walletBalance)],
          ["Staked XAY", formatXay(stakedBalance)],
          ["Earned XAY", formatXay(earnedRewards)],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </article>
        ))}
      </div>

      {readError ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          Unable to read the current staking state: {readError.message}
        </p>
      ) : null}

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <label className="block text-sm font-semibold text-white" htmlFor="stake-amount">
          XAY amount
        </label>
        <input
          id="stake-amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.0"
          className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-3 text-white outline-none focus:border-[var(--xay-green-bright)]"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {needsApproval && parsedAmount ? (
            <button
              type="button"
              disabled={writeContract.isPending || receipt.isLoading}
              onClick={() =>
                void submitWrite("Approve XAY", {
                  address: tokenAddress,
                  abi: xaymacaTokenAbi,
                  functionName: "approve",
                  args: [stakingAddress, parsedAmount],
                })
              }
              className="rounded-full bg-[var(--xay-gold)] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
            >
              Approve XAY
            </button>
          ) : (
            <button
              type="button"
              disabled={
                !parsedAmount ||
                writeContract.isPending ||
                receipt.isLoading
              }
              onClick={() =>
                parsedAmount &&
                void submitWrite("Stake XAY", {
                  address: stakingAddress,
                  abi: xaymacaStakingAbi,
                  functionName: "stake",
                  args: [parsedAmount],
                })
              }
              className="rounded-full bg-[var(--xay-green-bright)] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
            >
              Stake XAY
            </button>
          )}

          <button
            type="button"
            disabled={
              !parsedAmount ||
              writeContract.isPending ||
              receipt.isLoading
            }
            onClick={() =>
              parsedAmount &&
              void submitWrite("Withdraw XAY", {
                address: stakingAddress,
                abi: xaymacaStakingAbi,
                functionName: "withdraw",
                args: [parsedAmount],
              })
            }
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Withdraw
          </button>

          <button
            type="button"
            disabled={writeContract.isPending || receipt.isLoading}
            onClick={() =>
              void submitWrite("Claim rewards", {
                address: stakingAddress,
                abi: xaymacaStakingAbi,
                functionName: "getReward",
                args: [],
              })
            }
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Claim rewards
          </button>

          <button
            type="button"
            disabled={writeContract.isPending || receipt.isLoading}
            onClick={() =>
              void submitWrite("Compound rewards", {
                address: stakingAddress,
                abi: xaymacaStakingAbi,
                functionName: "compoundReward",
                args: [],
              })
            }
            className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Compound
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          Direct XAY transfers are subject to the token&apos;s 1% transfer burn
          until the 30,000,000 XAY floor is reached. The staking contract
          credits the amount it actually receives. Claim transfers can also be
          reduced by the transfer burn; in-contract compounding avoids that
          extra transfer.
        </p>
      </div>

      {(writeContract.isPending || receipt.isLoading || transactionHash) && (
        <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-4 text-sm text-[var(--muted)]">
          <p>
            {writeContract.isPending
              ? `${lastAction ?? "Transaction"}: awaiting wallet confirmation…`
              : receipt.isLoading
                ? `${lastAction ?? "Transaction"}: submitted and awaiting confirmation…`
                : receipt.isSuccess
                  ? `${lastAction ?? "Transaction"}: confirmed.`
                  : receipt.isError
                    ? `${lastAction ?? "Transaction"}: failed to confirm.`
                    : `${lastAction ?? "Transaction"}: submitted.`}
          </p>
          {transactionHash ? (
            <p className="mt-1 break-all font-mono text-xs">{transactionHash}</p>
          ) : null}
        </div>
      )}

      {writeContract.error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          Transaction was not submitted: {writeContract.error.message}
        </p>
      ) : null}

      {receipt.error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          Transaction confirmation failed: {receipt.error.message}
        </p>
      ) : null}
    </section>
  );
}
