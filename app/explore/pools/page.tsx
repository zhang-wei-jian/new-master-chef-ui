"use client";

import { Card, Chip, Input } from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";

/* ─── Types ──────────────────────────────────────────────── */
interface Pool {
  id: string;
  token0: string;
  token1: string;
  token0Color: string;
  token1Color: string;
  feeTier: string;
  chain: string;
  tvl: string;
  volume24h: string;
  fees24h: string;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockPools: Pool[] = [
  { id: "1", token0: "WETH", token1: "USDC", token0Color: "#627eea", token1Color: "#2775ca", feeTier: "0.05%", chain: "Ethereum", tvl: "$284M", volume24h: "$14.8M", fees24h: "$7,405" },
  { id: "2", token0: "WETH", token1: "DAI", token0Color: "#627eea", token1Color: "#f5ac37", feeTier: "0.05%", chain: "Ethereum", tvl: "$96.7M", volume24h: "$3.2M", fees24h: "$983" },
  { id: "3", token0: "USDC", token1: "USDT", token0Color: "#2775ca", token1Color: "#26a17b", feeTier: "0.01%", chain: "Ethereum", tvl: "$412M", volume24h: "$28.1M", fees24h: "$14,050" },
  { id: "4", token0: "WBTC", token1: "WETH", token0Color: "#f7931a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: "$156M", volume24h: "$8.4M", fees24h: "$4,200" },
  { id: "5", token0: "ARB", token1: "WETH", token0Color: "#28a0f0", token1Color: "#627eea", feeTier: "0.3%", chain: "Arbitrum", tvl: "$45M", volume24h: "$2.1M", fees24h: "$1,050" },
  { id: "6", token0: "OP", token1: "WETH", token0Color: "#ff0420", token1Color: "#627eea", feeTier: "0.3%", chain: "Optimism", tvl: "$32M", volume24h: "$1.5M", fees24h: "$750" },
  { id: "7", token0: "MATIC", token1: "WETH", token0Color: "#8247e5", token1Color: "#627eea", feeTier: "0.3%", chain: "Polygon", tvl: "$28M", volume24h: "$980K", fees24h: "$490" },
  { id: "8", token0: "LINK", token1: "WETH", token0Color: "#2a5ada", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: "$67M", volume24h: "$4.2M", fees24h: "$2,100" },
  { id: "9", token0: "UNI", token1: "WETH", token0Color: "#ff007a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: "$54M", volume24h: "$3.8M", fees24h: "$1,900" },
];

/* ─── Navbar (same as homepage) ──────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-[#0b0b14]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-purple-400 text-[26px] leading-none">◆</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Swap</Link>

          <Link href="/explore/pools" className="relative text-sm font-medium text-white/90 hover:text-white transition-colors pb-0.5">
            Pools
            <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <WalletConnectButton />
      </div>
    </nav>
  );
}

/* ─── Background glow ────────────────────────────────────── */
function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.05] blur-[120px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.04] blur-[120px]" />
    </div>
  );
}

/* ─── Pool Card ──────────────────────────────────────────── */
function PoolCard({ pool }: { pool: Pool }) {
  return (
    <Link href={`/explore/pools/${pool.chain.toLowerCase()}/${pool.id}`}>
      <Card className="p-5 bg-[#13131f] hover:bg-[#1a1a2e] transition-all duration-300 cursor-pointer rounded-2xl border border-white/[0.04] hover:border-purple-500/20 group">
        <div className="flex flex-col gap-4">
          {/* Token pair header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-[2.5px] border-[#13131f] flex items-center justify-center text-white text-sm font-bold shadow-lg" style={{ backgroundColor: pool.token0Color }}>
                  {pool.token0.charAt(0)}
                </div>
                <div className="w-10 h-10 rounded-full border-[2.5px] border-[#13131f] flex items-center justify-center text-white text-sm font-bold shadow-lg" style={{ backgroundColor: pool.token1Color }}>
                  {pool.token1.charAt(0)}
                </div>
              </div>
              <div>
                <span className="text-white/90 group-hover:text-white transition-colors font-bold text-sm">{pool.token0} / {pool.token1}</span>
                <div className="flex gap-1.5 mt-1.5">
                  <Chip size="sm" className="bg-[#0d0d18] text-white/30 border border-white/[0.04] px-2 py-0.5">{pool.feeTier}</Chip>
                  <Chip size="sm" className="bg-[#0d0d18] text-white/30 border border-white/[0.04] px-2 py-0.5">{pool.chain}</Chip>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <span className="text-white/[0.08] group-hover:text-purple-400/60 transition-colors duration-300">→</span>
          </div>

          {/* Divider */}
          <hr className="border-white/[0.04]" />

          {/* Stats */}
          <div className="flex flex-col gap-2">
            {[
              { label: "TVL", value: pool.tvl },
              { label: "24h Volume", value: pool.volume24h },
              { label: "24h Fees", value: pool.fees24h },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-white/[0.2] text-sm">{item.label}</span>
                <span className="text-white/80 group-hover:text-white transition-colors font-bold text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function PoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPools = mockPools.filter((pool) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return pool.token0.toLowerCase().includes(q) || pool.token1.toLowerCase().includes(q) || pool.chain.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0b0b14]">
      <BackgroundGlow />
      <Navbar />

      <main className="container mx-auto max-w-7xl pt-32 px-6 md:px-10 pb-12 flex-grow">
        {/* Header */}
        <div className="flex flex-col gap-5 mb-10">
          <h1 className="text-[40px] font-bold text-white/90 tracking-tight">Explore Popular Pools</h1>
          <p className="text-white/[0.25] text-base max-w-lg leading-relaxed">
            Browse the most popular liquidity pools on Ethereum and Layer 2 networks.
          </p>

          {/* Search */}
          <Input
            placeholder="Search by token pair or chain"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[320px] h-12 rounded-full bg-[#13131f] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
          />
        </div>

        {/* Pool grid */}
        {filteredPools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-white/[0.15]">
            <span className="text-5xl mb-5 opacity-30">🔍</span>
            <span className="text-white/30 font-bold text-lg">No pools found</span>
            <span className="mt-1 text-sm">Try a different search term.</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.04] py-6 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white/[0.12] text-sm">© 2026 - Uniswap Labs</span>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-white/[0.12] hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-white/[0.12] hover:text-white/40 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
