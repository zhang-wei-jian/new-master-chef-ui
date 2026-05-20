"use client";

import { Button } from "@heroui/react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { projectId } from "@/config/wagmi";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const chainNames: Record<number, string> = {
  1: "ETH",
  11155111: "Sepolia",
  42161: "Arb",
  10: "Optim",
  137: "Polygon",
  8453: "Base",
};

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }

    // Try injected wallet first (MetaMask, Rabby, etc.)
    const injectedConnector = connectors.find((c) => c.id === "injected");
    if (injectedConnector) {
      connect({ connector: injectedConnector });
      return;
    }

    // Fallback to WalletConnect if no injected wallet
    const wcConnector = connectors.find((c) => c.id === "walletConnect");
    if (wcConnector) {
      connect({ connector: wcConnector });
    }
  };

  const displayName = address ? formatAddress(address) : "";
  const chainLabel = chainId ? chainNames[chainId] || String(chainId) : "";

  return (
    <Button
      color={isConnected ? "default" : "primary"}
      size="sm"
      className={`rounded-full font-semibold px-5 h-[38px] shadow-lg transition-all duration-300 ${
        isConnected
          ? "bg-[#1e1e30] text-white/90 border border-white/[0.06] hover:bg-[#252540]"
          : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-purple-500/20"
      }`}
      isLoading={isPending}
      onClick={handleConnect}
    >
      {isConnected ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {displayName}
          {chainLabel && <span className="text-[10px] text-white/40 ml-1">{chainLabel}</span>}
        </span>
      ) : (
        "Connect a wallet"
      )}
    </Button>
  );
}
