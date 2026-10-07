import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon, polygonAmoy } from "wagmi/chains";

export const POLYGON_CHAIN_ID = 137 as const;
export const POLYGON_AMOY_CHAIN_ID = 80002 as const;

export const supportedChains = [polygon, polygonAmoy] as const;

export const web3Config = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  ssr: true,
  transports: {
    [POLYGON_CHAIN_ID]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || undefined),
    [POLYGON_AMOY_CHAIN_ID]: http(
      process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || undefined,
    ),
  },
});

export { polygon, polygonAmoy };
