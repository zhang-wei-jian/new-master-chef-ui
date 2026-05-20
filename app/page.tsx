"use client";

import { Button, Card, Input } from "@heroui/react";
import { Text as UIText } from "@heroui/react";
import { GithubIcon, TwitterIcon, DiscordIcon } from "@/components/icons";
import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";

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

          <Link href="/explore/pools" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
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
              {/* Settings icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>

          {/* From token */}
          <TokenSelector label="From" amount="0.0" token={{ name: "ETH", symbol: "Ξ", color: "#627eea" }} />

          {/* Swap arrow */}
          <div className="flex justify-center -my-1 relative z-10">
            <button className="w-8 h-8 rounded-full bg-[#1e1e30] border-4 border-[#13131f] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-[#252540] transition-all">
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 1v13M2 10l4 4 4-4" />
              </svg>
            </button>
          </div>

          {/* To token */}
          <TokenSelector label="To" amount="0.0" token={{ name: "USDC", symbol: "$", color: "#2775ca" }} />

          {/* CTA Button */}
          <WalletConnectButton />

          {/* Subtle link */}
          <div className="text-center mt-3">
            <span className="text-xs text-white/[0.18]">Earn up to 5.0% stable APR →</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── Token Selector (reusable) ──────────────────────────── */
function TokenSelector({ label, amount, token }: { label: string; amount: string; token: { name: string; symbol: string; color: string } }) {
  return (
    <div className="rounded-[16px] bg-[#0d0d18] border border-white/[0.04] p-4 hover:border-white/[0.08] transition-colors group cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        {/* Token info */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">{label}</span>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: token.color }}>
            {token.symbol}
          </div>
          <span className="text-sm font-semibold text-white/90">{token.name}</span>
        </div>

        {/* Amount input */}
        <Input
          placeholder={amount}
          classNames={{
            input: "text-right text-xl md:text-2xl font-bold text-white !placeholder-white/15",
            inputWrapper: "shadow-none p-0 h-full bg-transparent border-none min-w-[100px]",
          }}
        />
      </div>
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
            <UIText size="xl" weight="bold" className="text-white text-[36px] md:text-[48px] tracking-tight group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </UIText>
            <UIText size="sm" className="text-white/25 font-medium uppercase tracking-wider text-xs">
              {stat.label}
            </UIText>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Apps Overview Section ──────────────────────────────── */
function AppsOverviewSection() {
  const apps = [
    { title: "Web App", desc: "Trade on the Uniswap Interface", icon: "🌐" },
    { title: "Wallet", desc: "Self-custody & swap", icon: "👛" },
    { title: "UniswapX", desc: "Better rates, faster swaps", icon: "⚡" },
    { title: "Liquidity", desc: "Earn fees providing liquidity", icon: "💧" },
    { title: "Trading API", desc: "Automate your trading", icon: "📊" },
    { title: "Unichain", desc: "Built for speed", icon: "🔗" },
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
              <UIText weight="bold" size="lg" className="text-white/90 group-hover:text-white transition-colors">{app.title}</UIText>
              <UIText size="sm" className="text-white/[0.25] mt-0.5">{app.desc}</UIText>
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
            classNames={{
              input: "text-white text-sm",
              inputWrapper: "bg-[#0d0d18] border border-white/[0.06] h-12 rounded-full min-w-[240px]",
            }}
          />
          <Button color="primary" className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white rounded-full h-12 px-7 font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300">
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
        <div className="flex gap-5">
          <a href="https://github.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04]">
            <GithubIcon size={28} />
          </a>
          <a href="https://x.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04]">
            <TwitterIcon size={28} />
          </a>
          <a href="https://discord.com/invite/uniswap" target="_blank" rel="noopener noreferrer" className="text-white/[0.2] hover:text-white transition-colors cursor-pointer p-2 rounded-full hover:bg-white/[0.04]">
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
              <UIText weight="bold" size="sm" className="text-white/[0.45] uppercase tracking-wider">{col.title}</UIText>
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
        <UIText size="sm" className="text-white/[0.12]">© {currentYear} - Uniswap Labs</UIText>
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
