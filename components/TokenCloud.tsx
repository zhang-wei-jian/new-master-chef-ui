"use client";

import { useMemo, useEffect, useState } from "react";

interface TokenData {
  name: string;
  symbol: string;
  color: string;
  logoUrl: string;
}

const tokens: TokenData[] = [
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" },
  { name: "USDC", symbol: "USDC", color: "#2775CA", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
  { name: "DAI", symbol: "DAI", color: "#FFAA00", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png" },
  { name: "WBTC", symbol: "WBTC", color: "#F7931A", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png" },
  { name: "UNI", symbol: "UNI", color: "#FF007A", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png" },
  { name: "LINK", symbol: "LINK", color: "#2A5ADA", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png" },
  { name: "AAVE", symbol: "AAVE", color: "#B6509E", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png" },
  { name: "PEPE", symbol: "PEPE", color: "#009E1E", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png" },
  { name: "SHIB", symbol: "SHIB", color: "#E01A2B", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png" },
  { name: "MATIC", symbol: "POL", color: "#833ADD", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0000000000000000000000000000000000001010/logo.png" },
  { name: "OP", symbol: "OP", color: "#FF001A", logoUrl: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/optimism/assets/0x4200000000000000000000000000000000000042/logo.png" },
  { name: "SOL", symbol: "SOL", color: "#48577F", logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/assets/So11111111111111111111111111111111111111112/logo.png" },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface CloudPoint {
  x: number;
  y: number;
  size: number;
  blur: number;
  opacity: number;
  rotation: number;
  delay: number;
  floatDuration: number;
  token: TokenData;
}

function generatePoints(): CloudPoint[] {
  const w = 1920;
  const h = 800;
  const leftThreshold = w / 2 - 240;
  const rightThreshold = w / 2 + 240;

  const rand = seededRandom(42);
  const points: CloudPoint[] = [];
  let attempts = 0;
  const maxPoints = 12;

  while (points.length < maxPoints && attempts < 500) {
    const x = rand() * w;
    const y = rand() * h;
    let tooClose = false;

    for (const p of points) {
      const dx = x - p.x;
      const dy = y - p.y;
      if (Math.sqrt(dx * dx + dy * dy) < 200) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      const size = 50 + Math.floor(rand() * 46);
      const isCenter = x > leftThreshold && x < rightThreshold || y < 100;
      points.push({
        x,
        y: y - size / 2,
        size,
        blur: (1 / size) * 500 * (isCenter ? 5 : 1),
        opacity: (0.5 + rand() * 0.5) * (isCenter ? 0.75 : 1),
        rotation: -20 + Math.floor(rand() * 41),
        delay: Math.abs(x - w / 2) / 800,
        floatDuration: 3 + rand() * 3,
        token: tokens[points.length % tokens.length],
      });
    }
    attempts++;
  }

  return points.sort((a, b) => Math.abs(a.x - w / 2) - Math.abs(b.x - w / 2));
}

export function TokenCloud() {
  const [mounted, setMounted] = useState(false);
  const points = useMemo(() => generatePoints(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {points.map((point, idx) => (
        <div
          key={idx}
          className="absolute group/item"
          style={{
            top: point.y,
            left: point.x,
            width: point.size,
            height: point.size,
            animation: `cloud-float ${point.floatDuration}s linear infinite`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              animation: `token-rotate ${200 / (22 - point.rotation)}ms ease-in-out infinite alternate-reverse`,
            }}
          >
            <div
              className="w-full h-full rounded-lg transition-all duration-150"
              style={{
                background: point.token.color,
                filter: `blur(${point.blur}px)`,
                opacity: point.opacity,
                backgroundImage: `url(${point.token.logoUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
