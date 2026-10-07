"use client";

import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { polygonAmoy, supportedChains } from "@/lib/web3/config";

function shortAddress(address: `0x${string}`) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isSupported = supportedChains.some((chain) => chain.id === chainId);
  const connector = connectors[0];

  if (!isConnected) {
    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!connector || isPending}
          onClick={() => connector && connect({ connector })}
        >
          {isPending ? "Connecting…" : "Connect Wallet"}
        </button>
        {error ? (
          <p className="max-w-xs text-xs text-red-300" role="alert">
            {error.message}
          </p>
        ) : null}
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-amber-200">
          Unsupported network
        </span>
        <button
          type="button"
          className="rounded-full border border-amber-300/40 px-3 py-1.5 text-xs font-semibold text-amber-100"
          disabled={isSwitching}
          onClick={() => switchChain({ chainId: polygonAmoy.id })}
        >
          {isSwitching ? "Switching…" : "Switch to Polygon Amoy"}
        </button>
        <button
          type="button"
          className="text-xs text-white/60 underline underline-offset-4"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70">
        {address ? shortAddress(address) : "Wallet connected"}
      </span>
      <button
        type="button"
        className="text-xs text-white/60 underline underline-offset-4"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
