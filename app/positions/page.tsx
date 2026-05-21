"use client";

import { Card, Chip } from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { WalletConnectButton } from "@/components/WalletConnectButton";

/* ─── Types ──────────────────────────────────────────────── */
interface Position {
  id: string;
  token0: string;
  token1: string;
  token0Color: string;
  token1Color: string;
  feeTier: string;
  chain: string;
  range: string;
  value: string;
  apr: number;
}

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
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockPositions: Position[] = [
  { id: "1", token0: "WETH", token1: "USDC", token0Color: "#627eea", token1Color: "#2775ca", feeTier: "0.05%", chain: "Ethereum", range: "$3,200 - $4,800", value: "$12,450.32", apr: 24.5 },
  { id: "2", token0: "WBTC", token1: "WETH", token0Color: "#f7931a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", range: "Out of Range", value: "$8,234.10", apr: 0 },
  { id: "3", token0: "ARB", token1: "WETH", token0Color: "#28a0f0", token1Color: "#627eea", feeTier: "0.3%", chain: "Arbitrum", range: "$1,800 - $2,400", value: "$5,678.90", apr: 32.1 },
];

const mockTopPools: Pool[] = [
  { id: "1", token0: "WETH", token1: "USDC", token0Color: "#627eea", token1Color: "#2775ca", feeTier: "0.05%", chain: "Ethereum", tvl: 284_000_000, volume24h: 14_800_000, apr: 18.42 },
  { id: "2", token0: "WETH", token1: "USDT", token0Color: "#627eea", token1Color: "#26a17b", feeTier: "0.05%", chain: "Ethereum", tvl: 198_000_000, volume24h: 12_300_000, apr: 15.87 },
  { id: "3", token0: "WBTC", token1: "WETH", token0Color: "#f7931a", token1Color: "#627eea", feeTier: "0.3%", chain: "Ethereum", tvl: 156_000_000, volume24h: 8_400_000, apr: 12.35 },
  { id: "4", token0: "USDC", token1: "USDT", token0Color: "#2775ca", token1Color: "#26a17b", feeTier: "0.01%", chain: "Ethereum", tvl: 412_000_000, volume24h: 28_100_000, apr: 5.21 },
  { id: "5", token0: "ARB", token1: "WETH", token0Color: "#28a0f0", token1Color: "#627eea", feeTier: "0.3%", chain: "Arbitrum", tvl: 45_000_000, volume24h: 2_100_000, apr: 22.14 },
  { id: "6", token0: "OP", token1: "WETH", token0Color: "#ff0420", token1Color: "#627eea", feeTier: "0.3%", chain: "Optimism", tvl: 32_000_000, volume24h: 1_500_000, apr: 19.87 },
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
          <Link href="/positions" className="relative text-sm font-medium text-white/90 hover:text-white transition-colors pb-0.5">
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

/* ─── Filter Dropdown ────────────────────────────────────── */
function FilterDropdown({ label, options, selected }: { label: string; options: string[]; selected?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white rounded-xl text-sm font-medium transition-colors"
      >
        {selected || label}
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 bg-[#1a1a2e] border border-white/[0.08] rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Position Card ──────────────────────────────────────── */
function PositionCard({ position }: { position: Position }) {
  const isInRange = position.range !== "Out of Range";

  return (
      <div className="flex flex-col gap-4 p-5 bg-[#13131f] hover:bg-[#1a1a2e] transition-all duration-300 cursor-pointer rounded-2xl border border-white/[0.04] hover:border-purple-500/20 group">
        <div className="flex items-center justify-between">
          {/* Token pair */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-[2.5px] border-[#13131f] flex items-center justify-center text-white text-sm font-bold shadow-lg" style={{ backgroundColor: position.token0Color }}>
                {position.token0.charAt(0)}
              </div>
              <div className="w-10 h-10 rounded-full border-[2.5px] border-[#13131f] flex items-center justify-center text-white text-sm font-bold shadow-lg" style={{ backgroundColor: position.token1Color }}>
                {position.token1.charAt(0)}
              </div>
            </div>
            <div>
              <span className="text-white/90 group-hover:text-white transition-colors font-bold text-sm">{position.token0} / {position.token1}</span>
              <div className="flex gap-1.5 mt-1.5">
                <Chip size="sm" className="bg-[#0d0d18] text-white/30 border border-white/[0.04] px-2 py-0.5">{position.feeTier}</Chip>
                <Chip
                  size="sm"
                  className={`px-2 py-0.5 ${isInRange ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                >
                  {position.range}
                </Chip>
              </div>
            </div>
          </div>

          {/* Value + APR */}
          <div className="text-right">
            <span className="text-white/90 group-hover:text-white transition-colors font-bold text-sm">{position.value}</span>
            {isInRange && (
              <div className="text-emerald-400 text-xs mt-1 font-medium">APR: {position.apr.toFixed(2)}%</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/[0.04]" />

        {/* Actions */}
        <div className="flex gap-3">
          {isInRange ? (
            <>
              <button className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl text-sm font-semibold transition-colors">
                Collect Fees
              </button>
              <button className="flex-1 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white rounded-xl text-sm font-semibold transition-colors">
                Adjust
              </button>
            </>
          ) : (
            <button className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl text-sm font-semibold transition-colors">
              Collect Fees
            </button>
          )}
        </div>
      </div>
    );
}

/* ─── Top Pool Card (sidebar) ────────────────────────────── */
function TopPoolCard({ pool }: { pool: Pool }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.04] cursor-pointer hover:bg-[#1a1a2e] transition-colors group">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#13131f] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: pool.token0Color }}>
              {pool.token0.charAt(0)}
            </div>
            <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#13131f] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: pool.token1Color }}>
              {pool.token1.charAt(0)}
            </div>
          </div>
          <div>
            <span className="text-white/90 group-hover:text-white transition-colors font-semibold text-sm">{pool.token0}/{pool.token1}</span>
            <Chip size="sm" className="bg-[#0d0d18] text-white/[0.35] border border-white/[0.04] mt-1 px-2 py-0.5">{pool.feeTier}</Chip>
          </div>
        </div>
        <div className="text-right">
          <span className="text-emerald-400 font-semibold text-sm">{pool.apr.toFixed(2)}% APR</span>
        </div>
      </div>
    );
}

/* ─── Empty State (connected, no positions) ──────────────── */
function EmptyPositionsView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-6 opacity-40">💼</span>
      <h3 className="text-white/80 font-bold text-xl mb-2">No positions found</h3>
      <p className="text-white/[0.35] text-sm max-w-md leading-relaxed">
        You don't have any active liquidity positions yet. Create a new position to start earning fees.
      </p>
    </div>
  );
}

/* ─── Disconnected View ──────────────────────────────────── */
function DisconnectedWalletView() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl mb-6 opacity-40">🔗</span>
      <h3 className="text-white/80 font-bold text-xl mb-2">Connect your wallet</h3>
      <p className="text-white/[0.35] text-sm max-w-md leading-relaxed">
        Connect your wallet to view and manage your liquidity positions.
      </p>
    </div>
  );
}

/* ─── Top Pools Sidebar Section ──────────────────────────── */
function TopPoolsSection() {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-white/90 font-bold text-lg">Top Pools</h3>
      <div className="flex flex-col gap-3">
        {mockTopPools.map((pool) => (
          <TopPoolCard key={pool.id} pool={pool} />
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function PositionsPage() {
  const { isConnected } = useAccount();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [versionFilter, setVersionFilter] = useState<string>("V3");
  const [chainFilter, setChainFilter] = useState<string>("All Chains");

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#0b0b14]">
      <BackgroundGlow />
      <Navbar />

      <main className="container mx-auto max-w-[1200px] pt-32 px-6 md:px-10 pb-12 flex-grow w-full">
        <div className="flex gap-8">
          {/* Left column - Positions */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[32px] font-bold text-white/90 tracking-tight mb-4">Positions</h1>

              {/* Filters row */}
              {isConnected && (
                <div className="flex flex-wrap items-center gap-3">
                  {/* New button with dropdown */}
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm rounded-xl transition-colors">
                    <span>+</span>
                    New
                  </button>

                  {/* Status filter */}
                  <FilterDropdown
                    label="Status"
                    options={["All", "In Range", "Out of Range"]}
                    selected={statusFilter}
                  />

                  {/* Protocol version filter */}
                  <FilterDropdown
                    label="Protocol"
                    options={["V2", "V3", "V4"]}
                    selected={versionFilter}
                  />

                  {/* Network filter */}
                  <FilterDropdown
                    label="Network"
                    options={["All Chains", "Ethereum", "Arbitrum", "Optimism", "Polygon"]}
                    selected={chainFilter}
                  />
                </div>
              )}
            </div>

            {/* Positions list */}
            {isConnected ? (
              mockPositions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {mockPositions.map((pos) => (
                    <PositionCard key={pos.id} position={pos} />
                  ))}
                </div>
              ) : (
                <EmptyPositionsView />
              )
            ) : (
              <DisconnectedWalletView />
            )}

            {/* Import link */}
            {isConnected && (
              <div className="flex items-center gap-2 mt-8 text-white/[0.35] text-sm">
                <span>Learn how to</span>
                <Link href="/explore/pools/v2/find" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  import V2 positions
                </Link>
              </div>
            )}
          </div>

          {/* Right sidebar - Top Pools */}
          <aside className="hidden xl:block w-[360px] shrink-0">
            <TopPoolsSection />
          </aside>
        </div>
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
