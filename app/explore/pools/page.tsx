"use client";

import { Card, Chip, Input } from "@heroui/react";
import { useState, useMemo } from "react";
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
  tvl: number;
  volume24h: number;
  apr: number;
  volume30d: number;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockPools: Pool[] = [
  { id: "1", token0: "WETH", token1: "USDC", token0Color: "#627eea", token1Color: "#2775ca", feeTier: "0.05%", chain: "Ethereum", tvl: 284_000_000, volume24h: 14_800_000, apr: 18.42, volume30d: 444_000_000 },
  { id: "2", token0: "WETH", token1: "USDT", token0Color: "#627eea", token1Color: "#26a17b", feeTier: "0.05%", chain: "Ethereum", tvl: 198_000_000, volume24h: 12_300_000, apr: 15.87, volume30d: 369_000_000 },
  { id: "3", token0: "WBTC", token1: "WETH", token0Color: "#f7931a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: 156_000_000, volume24h: 8_400_000, apr: 12.35, volume30d: 252_000_000 },
  { id: "4", token0: "USDC", token1: "USDT", token0Color: "#2775ca", token1Color: "#26a17b", feeTier: "0.01%", chain: "Ethereum", tvl: 412_000_000, volume24h: 28_100_000, apr: 5.21, volume30d: 843_000_000 },
  { id: "5", token0: "WETH", token1: "DAI", token0Color: "#627eea", token1Color: "#f5ac37", feeTier: "0.05%", chain: "Ethereum", tvl: 96_700_000, volume24h: 3_200_000, apr: 14.68, volume30d: 96_000_000 },
  { id: "6", token0: "ARB", token1: "WETH", token0Color: "#28a0f0", token1Color: "#627eea", feeTier: "0.3%", chain: "Arbitrum", tvl: 45_000_000, volume24h: 2_100_000, apr: 22.14, volume30d: 63_000_000 },
  { id: "7", token0: "OP", token1: "WETH", token0Color: "#ff0420", token1Color: "#627eea", feeTier: "0.3%", chain: "Optimism", tvl: 32_000_000, volume24h: 1_500_000, apr: 19.87, volume30d: 45_000_000 },
  { id: "8", token0: "MATIC", token1: "WETH", token0Color: "#8247e5", token1Color: "#627eea", feeTier: "0.3%", chain: "Polygon", tvl: 28_000_000, volume24h: 980_000, apr: 16.43, volume30d: 29_400_000 },
  { id: "9", token0: "LINK", token1: "WETH", token0Color: "#2a5ada", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: 67_000_000, volume24h: 4_200_000, apr: 13.92, volume30d: 126_000_000 },
  { id: "10", token0: "UNI", token1: "WETH", token0Color: "#ff007a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: 54_000_000, volume24h: 3_800_000, apr: 11.56, volume30d: 114_000_000 },
];

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-[#0b0b14]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-purple-400 text-[26px] leading-none">◆</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Swap</Link>
          <Link href="/positions" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pools</Link>
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

/* ─── Helpers ────────────────────────────────────────────── */
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/* ─── Tab type ───────────────────────────────────────────── */
type TabKey = "pools" | "tokens";

const tabs: { key: TabKey; label: string }[] = [
  { key: "tokens", label: "Tokens" },
  { key: "pools", label: "Pools" },
];

/* ─── Sort config ────────────────────────────────────────── */
type SortField = "tvl" | "apr" | "volume24h" | "volume30d";

interface SortConfig {
  field: SortField;
  direction: "asc" | "desc";
}

/* ─── Pool Row ───────────────────────────────────────────── */
function PoolRow({ pool, index }: { pool: Pool; index: number }) {
  return (
    <Link href={`/explore/pools/${pool.chain.toLowerCase()}/${pool.id}`}>
      <div className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
        {/* Rank */}
        <span className="w-8 text-center text-white/25 text-sm font-medium">{index + 1}</span>

        {/* Pool pair */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#1a1a2e] flex items-center justify-center text-white text-xs font-bold shadow-lg" style={{ backgroundColor: pool.token0Color }}>
              {pool.token0.charAt(0)}
            </div>
            <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#1a1a2e] flex items-center justify-center text-white text-xs font-bold shadow-lg" style={{ backgroundColor: pool.token1Color }}>
              {pool.token1.charAt(0)}
            </div>
          </div>
          <span className="text-white/90 group-hover:text-white transition-colors font-semibold text-sm truncate">
            {pool.token0}/{pool.token1}
          </span>
        </div>

        {/* Protocol */}
        <span className="hidden lg:block w-20 text-center text-white/[0.35] text-sm">V3</span>

        {/* Fee Tier */}
        <span className="hidden xl:block w-24 text-center text-white/60 text-sm">{pool.feeTier}</span>

        {/* TVL */}
        <span className="w-28 text-right text-white/90 font-medium text-sm">{formatCurrency(pool.tvl)}</span>

        {/* APR */}
        <span className="w-24 text-right text-emerald-400 font-semibold text-sm">{formatPercent(pool.apr)}</span>

        {/* Volume 24h */}
        <span className="hidden md:block w-32 text-right text-white/90 font-medium text-sm">{formatCurrency(pool.volume24h)}</span>

        {/* Volume 30d */}
        <span className="hidden xl:block w-32 text-right text-white/90 font-medium text-sm">{formatCurrency(pool.volume30d)}</span>
      </div>
    </Link>
  );
}

/* ─── Table Header ───────────────────────────────────────── */
function TableHeader({ sortConfig, onSort }: { sortConfig: SortConfig; onSort: (field: SortField) => void }) {
  const headerClass = (field: SortField) =>
    `cursor-pointer hover:text-white transition-colors ${sortConfig.field === field ? "text-purple-400" : "text-white/[0.35]"}`;

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-white/[0.04] text-xs font-medium uppercase tracking-wider">
      <span className="w-8 text-center text-white/[0.35]">#</span>
      <span className="flex-1 min-w-0 text-left text-white/[0.35]">Pool</span>
      <span className="hidden lg:block w-20 text-center text-white/[0.35]">Protocol</span>
      <span className="hidden xl:block w-24 text-center text-white/[0.35]">Fee Tier</span>
      <span
        className={`w-28 text-right ${headerClass("tvl")}`}
        onClick={() => onSort("tvl")}
      >
        TVL {sortConfig.field === "tvl" && (sortConfig.direction === "desc" ? "↓" : "↑")}
      </span>
      <span
        className={`w-24 text-right ${headerClass("apr")}`}
        onClick={() => onSort("apr")}
      >
        APR {sortConfig.field === "apr" && (sortConfig.direction === "desc" ? "↓" : "↑")}
      </span>
      <span
        className={`hidden md:block w-32 text-right ${headerClass("volume24h")}`}
        onClick={() => onSort("volume24h")}
      >
        Volume 24h {sortConfig.field === "volume24h" && (sortConfig.direction === "desc" ? "↓" : "↑")}
      </span>
      <span
        className={`hidden xl:block w-32 text-right ${headerClass("volume30d")}`}
        onClick={() => onSort("volume30d")}
      >
        Volume 30d {sortConfig.field === "volume30d" && (sortConfig.direction === "desc" ? "↓" : "↑")}
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function PoolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pools");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: "tvl", direction: "desc" });

  const filteredAndSortedPools = useMemo(() => {
    let pools = [...mockPools];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pools = pools.filter(
        (p) => p.token0.toLowerCase().includes(q) || p.token1.toLowerCase().includes(q) || p.chain.toLowerCase().includes(q)
      );
    }

    // Sort
    pools.sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      return sortConfig.direction === "desc" ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });

    return pools;
  }, [searchQuery, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0b0b14]">
      <BackgroundGlow />
      <Navbar />

      <main className="container mx-auto max-w-[1200px] pt-32 px-6 md:px-10 pb-12 flex-grow w-full">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-base font-medium pb-2 transition-colors ${
                activeTab === tab.key ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/positions/create/v3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm rounded-full transition-colors">
                <span>+</span>
                New Position
              </button>
            </Link>
          </div>

          <Input
            placeholder="Search by token pair or chain"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[280px] h-10 rounded-full bg-transparent border border-white/[0.06] hover:border-white/[0.12] transition-colors"
            endContent={
              searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-white/30 hover:text-white/60">
                  ✕
                </button>
              )
            }
          />
        </div>

        {/* Pool table */}
        {filteredAndSortedPools.length > 0 ? (
          <Card className="bg-[#13131f] border border-white/[0.04] rounded-2xl overflow-hidden">
            <TableHeader sortConfig={sortConfig} onSort={handleSort} />
            {filteredAndSortedPools.map((pool, i) => (
              <PoolRow key={pool.id} pool={pool} index={i} />
            ))}
          </Card>
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
        <div className="container mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-4">
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
