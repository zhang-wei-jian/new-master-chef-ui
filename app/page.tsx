"use client";

import { Button, Card, Input } from "@heroui/react";
import { GithubIcon, TwitterIcon, DiscordIcon } from "@/components/icons";
import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { useAccount } from "wagmi";
import { useState, useMemo } from "react";

/* ─── Token Data (mock) ──────────────────────────────────── */
const TOKENS = [
  { name: "Ethereum", symbol: "ETH", color: "#627eea", priceUsd: 3456.78 },
  { name: "USD Coin", symbol: "USDC", color: "#2775ca", priceUsd: 1.00 },
  { name: "Tether USD", symbol: "USDT", color: "#50af96", priceUsd: 1.00 },
  { name: "Wrapped Bitcoin", symbol: "WBTC", color: "#f7931a", priceUsd: 98234.50 },
  { name: "Dai", symbol: "DAI", color: "#f5ac37", priceUsd: 1.00 },
  { name: "Arbitrum", symbol: "ARB", color: "#28a0f0", priceUsd: 1.23 },
  { name: "Optimism", symbol: "OP", color: "#ff0420", priceUsd: 2.45 },
  { name: "Uniswap", symbol: "UNI", color: "#ff007a", priceUsd: 14.32 },
];

const DEFAULT_FROM = TOKENS[0]; // ETH
const DEFAULT_TO = TOKENS[1];   // USDC

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-[#0b0b14]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-purple-400 text-[26px] leading-none">◆</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="relative text-sm font-medium text-white/90 hover:text-white transition-colors pb-0.5">
            Swap
            <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          </Link>

          <Link href="/positions" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Pools
          </Link>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <WalletConnectButton />
      </div>
    </nav>
  );
}

/* ─── Background glow blobs ──────────────────────────────── */
function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top-left purple blob */}
      <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px]" />
      {/* Bottom-right blue blob */}
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-blue-600/[0.06] blur-[120px]" />
      {/* Center subtle purple */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[150px]" />
    </div>
  );
}

/* ─── Hero Section ───────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-start min-h-screen pt-32 pb-8 px-4">
      {/* Headline */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-[56px] md:text-[72px] font-bold tracking-tight leading-[1.08] bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent mb-5">
          The DeFi Benchmark
        </h1>
        <p className="text-lg md:text-xl text-white/45 max-w-xl leading-relaxed font-light">
          Built on core values of openness, equality &amp; decentralization.
        </p>
      </div>

      {/* Swap Card */}
      <SwapCard />
    </section>
  );
}

/* ─── Swap Card ──────────────────────────────────────────── */
function SwapCard() {
  const { isConnected } = useAccount();
  const [fromToken, setFromToken] = useState(DEFAULT_FROM);
  const [toToken, setToToken] = useState(DEFAULT_TO);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmountInput, setToAmountInput] = useState("");
  const [editingField, setEditingField] = useState<"from" | "to">("from");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Calculate To from From input
  const toAmount = useMemo(() => {
    if (editingField === "to" || !fromAmount || isNaN(Number(fromAmount))) return "";
    const fromPrice = fromToken.priceUsd;
    const toPrice = toToken.priceUsd;
    const rate = fromPrice / toPrice;
    const result = Number(fromAmount) * rate;
    if (result >= 1000) return result.toFixed(2);
    if (result >= 1) return result.toFixed(4);
    return result.toFixed(6);
  }, [fromAmount, fromToken, toToken, editingField]);

  // Calculate From from To input
  const fromAmountFromTo = useMemo(() => {
    if (editingField === "from" || !toAmountInput || isNaN(Number(toAmountInput))) return "";
    const fromPrice = fromToken.priceUsd;
    const toPrice = toToken.priceUsd;
    const rate = toPrice / fromPrice;
    const result = Number(toAmountInput) * rate;
    if (result >= 1000) return result.toFixed(2);
    if (result >= 1) return result.toFixed(4);
    return result.toFixed(6);
  }, [toAmountInput, fromToken, toToken, editingField]);

  // Display values
  const displayFrom = editingField === "from" ? fromAmount : fromAmountFromTo;
  const displayTo = editingField === "to" ? toAmountInput : toAmount;

  const priceRate = useMemo(() => {
    const rate = fromToken.priceUsd / toToken.priceUsd;
    if (rate >= 100) return `1 ${fromToken.symbol} ≈ ${rate.toFixed(2)} ${toToken.symbol}`;
    if (rate >= 1) return `1 ${fromToken.symbol} ≈ ${rate.toFixed(4)} ${toToken.symbol}`;
    return `1 ${fromToken.symbol} ≈ ${rate.toFixed(6)} ${toToken.symbol}`;
  }, [fromToken, toToken]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    if (editingField === "from" && displayTo) {
      setFromAmount(displayTo);
    } else if (editingField === "to" && displayFrom) {
      setToAmountInput(displayFrom);
    }
  };

  const selectFromToken = (token: typeof TOKENS[0]) => {
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromDropdown(false);
  };

  const selectToToken = (token: typeof TOKENS[0]) => {
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToDropdown(false);
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-purple-600/20 rounded-[28px] blur-xl -z-10" />

      <Card className="p-[1.5px] rounded-[24px] bg-gradient-to-b from-white/[0.12] to-white/[0.03]">
        <div className="rounded-[22px] bg-[#13131f] p-5 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Swap</span>
            <button className="text-white/30 hover:text-white/60 transition-colors p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>

          {/* From token */}
          <TokenSelectorWithMock
            label="From"
            amount={displayFrom || ""}
            onAmountChange={(v) => { setEditingField("from"); setFromAmount(v); }}
            onFocus={() => setEditingField("from")}
            token={fromToken}
            tokens={TOKENS}
            onSelect={(t) => selectFromToken(t)}
            showDropdown={showFromDropdown}
            onToggleDropdown={() => setShowFromDropdown(!showFromDropdown)}
          />

          {/* Swap arrow */}
          <div className="flex justify-center -my-1 relative z-10">
            <button onClick={handleSwapTokens} className="w-8 h-8 rounded-full bg-[#1e1e30] border-4 border-[#13131f] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-[#252540] transition-all">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 1v13M2 10l4 4 4-4" />
              </svg>
            </button>
          </div>

          {/* To token */}
          <TokenSelectorWithMock
            label="To"
            amount={displayTo || ""}
            onAmountChange={(v) => { setEditingField("to"); setToAmountInput(v); }}
            onFocus={() => setEditingField("to")}
            token={toToken}
            tokens={TOKENS}
            onSelect={(t) => selectToToken(t)}
            showDropdown={showToDropdown}
            onToggleDropdown={() => setShowToDropdown(!showToDropdown)}
          />

          {/* Price info */}
          {(fromAmount || toAmountInput) && (Number(fromAmount) > 0 || Number(toAmountInput) > 0) && (
            <div className="px-1 mt-2 mb-1">
              <span className="text-xs text-white/25">{priceRate}</span>
            </div>
          )}

          {/* CTA Button */}
          <button className={`w-full h-[50px] rounded-xl text-white font-semibold shadow-lg transition-all duration-300 mt-4 ${isConnected ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-purple-500/20' : 'bg-[#1e1e30] border border-white/[0.06]'}`}>
            {isConnected ? ((fromAmount && Number(fromAmount) > 0) || (toAmountInput && Number(toAmountInput) > 0) ? "Swap" : "Enter an amount") : "Connect a wallet"}
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ─── Token Selector with mock data ──────────────────────── */
function TokenSelectorWithMock({ label, amount, onAmountChange, onFocus, token, tokens, onSelect, showDropdown, onToggleDropdown }: {
  label: string;
  amount: string;
  onAmountChange: (v: string) => void;
  onFocus?: () => void;
  token: typeof TOKENS[0];
  tokens: typeof TOKENS;
  onSelect: (t: typeof TOKENS[0]) => void;
  showDropdown: boolean;
  onToggleDropdown: () => void;
}) {
  return (
    <div className="rounded-[16px] bg-[#0d0d18] border border-white/[0.04] p-4 hover:border-white/[0.08] transition-colors group cursor-pointer relative">
      <div className="flex items-center justify-between gap-3">
        {/* Token info */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">{label}</span>
          <button onClick={onToggleDropdown} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: token.color }}>
              {token.symbol === "ETH" ? "\u{039E}" : token.symbol === "USDC" || token.symbol === "USDT" || token.symbol === "DAI" ? "$" : token.symbol.charAt(0)}
            </div>
            <span className="text-sm font-semibold text-white/90">{token.symbol}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* Amount input — both From and To are editable */}
        <Input
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          onFocus={onFocus}
          className="text-right text-xl md:text-2xl font-bold text-white !placeholder-white/15 shadow-none p-0 h-full bg-transparent border-none min-w-[100px]"
        />
      </div>

      {/* Token dropdown */}
      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => onToggleDropdown()} />
          <div className="absolute top-full mt-2 left-0 bg-[#1a1a2e] border border-white/[0.08] rounded-xl shadow-xl z-20 w-full max-h-[320px] overflow-y-auto">
            {tokens.map((t) => (
              <button
                key={t.symbol}
                onClick={() => onSelect(t)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: t.color }}>
                    {t.symbol === "ETH" ? "\u{039E}" : t.symbol === "USDC" || t.symbol === "USDT" || t.symbol === "DAI" ? "$" : t.symbol.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-semibold text-white/90 block">{t.symbol}</span>
                    <span className="text-xs text-white/35 block">{t.name}</span>
                  </div>
                </div>
                <span className="text-sm text-white/45">${Number(t.priceUsd).toLocaleString()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Stats Section ──────────────────────────────────────── */
function StatsSection() {
  const stats = [
    { value: "$4T+", label: "All-Time Volume", live: false },
    { value: "$5B+", label: "Total Value Locked", live: false },
    { value: "10M+", label: "Users", live: false },
    { value: "$2.1B", label: "24h Volume", live: true },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 text-center group">
            {stat.live && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            )}
            <span className="text-white text-[36px] md:text-[48px] tracking-tight group-hover:scale-105 transition-transform duration-300 font-bold block">
              {stat.value}
            </span>
            <span className="text-white/25 font-medium uppercase tracking-wider text-xs block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Apps Overview Section ──────────────────────────────── */
function AppsOverviewSection() {
  const apps = [
    { title: "Web App", desc: "Trade on the Uniswap Interface", icon: "\uD83C\uDF10" },
    { title: "Wallet", desc: "Self-custody & swap", icon: "\uD83D\uDC5B" },
    { title: "UniswapX", desc: "Better rates, faster swaps", icon: "\u26A1" },
    { title: "Liquidity", desc: "Earn fees providing liquidity", icon: "\uD83D\uDCA7" },
    { title: "Trading API", desc: "Automate your trading", icon: "\uD83D\uDCCA" },
    { title: "Unichain", desc: "Built for speed", icon: "\uD83D\uDD17" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-[32px] font-bold text-white/90 mb-12 tracking-tight">
        Explore the Uniswap Ecosystem
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <Card key={app.title} className="p-6 bg-[#13131f] hover:bg-[#1a1a2e] transition-all duration-300 cursor-pointer rounded-2xl flex items-center gap-5 border border-white/[0.04] hover:border-white/[0.08] group">
            <span className="text-[36px] group-hover:scale-110 transition-transform duration-300">{app.icon}</span>
            <div>
            <span className="text-white/90 group-hover:text-white transition-colors font-bold">{app.title}</span>
              <span className="text-white/[0.25] mt-0.5">{app.desc}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter Section ─────────────────────────────────── */
function NewsletterSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <Card className="p-10 bg-[#13131f] rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/[0.04] hover:border-white/[0.08] transition-colors group">
        <div>
          <h3 className="text-2xl font-bold text-white/90 mb-1.5 tracking-tight">Stay Updated</h3>
          <p className="text-white/[0.25] text-sm leading-relaxed">Get the latest Uniswap news and updates.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            placeholder="Enter your email"
            className="bg-[#0d0d18] border border-white/[0.06] h-12 rounded-full min-w-[240px] text-white text-sm"
          />
          <Button className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white rounded-full h-12 px-7 font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300">
            Subscribe
          </Button>
        </div>
      </Card>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl mx-auto px-10 md:px-12 py-14 mt-8">
      {/* Top row: social + nav columns */}
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
        {/* Social icons */}
        <div className="flex gap-5 items-start">
          <a href="https://github.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04] inline-flex">
            <GithubIcon size={28} />
          </a>
          <a href="https://x.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04] inline-flex">
            <TwitterIcon size={28} />
          </a>
          <a href="https://discord.com/invite/uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04] inline-flex">
            <DiscordIcon size={28} />
          </a>
        </div>

        {/* Nav columns */}
        <div className="flex gap-16 flex-wrap">
          {[
            { title: "Products", links: ["Web App", "Wallet", "UniswapX", "Trading API"] },
            { title: "Protocol", links: ["Documentation", "Bug Bounty", "Explore", "Governance"] },
            { title: "Company", links: ["Careers", "Blog", "Brand Assets", "Press Kit"] },
            { title: "Help", links: ["Support", "Feedback", "Status"] },
          ].map((col) => (
            <div key={col.title} className="flex flex-col gap-3 min-w-[90px]">
              <span className="text-white/[0.45] uppercase tracking-wider font-bold text-sm">{col.title}</span>
              {col.links.map((link) => (
                <Link key={link} href="#" className="text-sm text-white/[0.18] hover:text-white/60 transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-white/[0.04] mb-8" />

      {/* Bottom row: copyright + legal links */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-white/[0.12] text-sm">\u00A9 {currentYear} Uniswap Labs</span>
        <div className="flex gap-8">
          <Link href="#" className="text-sm text-white/[0.12] hover:text-white/40 transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-white/[0.12] hover:text-white/40 transition-colors">Terms of Service</Link>
          <Link href="#" className="text-sm text-white/[0.12] hover:text-white/40 transition-colors">Trademark Policy</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full bg-[#0b0b14] min-h-screen">
      <BackgroundGlow />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AppsOverviewSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
