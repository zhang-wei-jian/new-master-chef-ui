import { http, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  arbitrum,
  optimism,
  polygon,
  base,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || undefined;

const connectors = [injected()];

if (projectId) {
  connectors.push(walletConnect({ projectId }));
}

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, optimism, polygon, base],
  connectors,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
