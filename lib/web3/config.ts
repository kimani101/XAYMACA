import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon, polygonAmoy } from "wagmi/chains";

export const supportedChains = [polygon, polygonAmoy] as const;

export const web3Config = createConfig({
  chains: supportedChains,
  connectors: [injected()],
  ssr: true,
  transports: {
    [polygon.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL || undefined),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL || undefined),
  },
});

export { polygon, polygonAmoy };
