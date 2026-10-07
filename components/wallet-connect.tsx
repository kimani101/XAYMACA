"use client";

import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
} from "wagmi";
import { supportedChains } from "@/lib/web3/config";

function shortAddress(address: `0x${string}`) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletConnect() {
  const connection = useConnection();
  const connectors = useConnectors();
  const { connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const isSupported = connection.chainId
    ? supportedChains.some((chain) => chain.id === connection.chainId)
    : true;

  if (!connection.isConnected) {
    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!connectors[0] || isPending}
          onClick={() =>
            connectors[0] && connect({ connector: connectors[0] })
          }
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
        <span className="text-xs text-white/60">
          Switch your wallet to Polygon or Polygon Amoy.
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

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70">
        {connection.address
          ? shortAddress(connection.address)
          : "Wallet connected"}
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
