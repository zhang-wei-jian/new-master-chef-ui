"use client";

import { GithubIcon, TwitterIcon, DiscordIcon } from "@/components/icons";
import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { useAccount } from "wagmi";
import { useState, useMemo } from "react";

/* ─── Design tokens (sampled from app.uniswap.org, 2026-11) ─ */
const PINK = "#ff37c7";

/* ─── i18n ───────────────────────────────────────────────── */
type Lang = "zh" | "en";

const STRINGS = {
  zh: {
    nav: [
      { label: "交易", href: "/" },
      { label: "探索", href: "/explore/pools" },
      { label: "发行", href: "#", beta: true },
      { label: "流动性池", href: "/explore/pools" },
      { label: "投资组合", href: "/positions" },
    ],
    search: "搜索 Uniswap",
    connect: "开始使用",
    h1: "随时随地兑换。",
    sell: "卖出",
    buy: "买入",
    selectToken: "选择代币",
    getStarted: "开始使用",
    swapNow: "兑换",
    enterAmount: "请输入数量",
    captionA: "在 Ethereum、Unichain、Base 等 22+ 个网络上买卖加密货币，",
    captionB: "零 App 手续费",
    captionC: "。",
    advanced: "高级",
    scroll: "滚动了解更多",
    stats: [
      { value: "$4T+", label: "历史总交易量" },
      { value: "$5B+", label: "总锁仓量" },
      { value: "10M+", label: "用户数" },
      { value: "$2.1B", label: "24 小时交易量", live: true },
    ],
    live: "实时",
    ecoH2: "DeFi 领先协议。驱动数万亿美元交易量。",
    eco: [
      { title: "网络应用", desc: "探索。兑换。循环。" },
      { title: "Uniswap Wall", desc: "发现最受关注的代币。" },
      { title: "UniswapX", desc: "更智能的兑换，更优的价格。" },
      { title: "流动性提供", desc: "提供流动性，赚取手续费。" },
      { title: "Trading API", desc: "程序化接入，驱动你的交易。" },
      { title: "Unichain", desc: "DeFi 性能最强的网络。" },
    ],
    newsH3: "保持关注",
    newsP: "获取 Uniswap 最新消息与产品动态。",
    emailPh: "输入你的邮箱",
    subscribe: "订阅",
    footerCols: [
      { title: "产品", links: ["网页应用", "钱包", "UniswapX", "交易 API"] },
      { title: "协议", links: ["文档", "漏洞赏金", "探索", "治理"] },
      { title: "公司", links: ["招聘", "博客", "品牌资产", "媒体资料"] },
      { title: "帮助", links: ["客服", "反馈", "状态"] },
    ],
    legal: ["隐私政策", "服务条款", "商标政策"],
    langBtn: "EN",
  },
  en: {
    nav: [
      { label: "Swap", href: "/" },
      { label: "Explore", href: "/explore/pools" },
      { label: "Launch", href: "#", beta: true },
      { label: "Pools", href: "/explore/pools" },
      { label: "Portfolio", href: "/positions" },
    ],
    search: "Search Uniswap",
    connect: "Get started",
    h1: "Swap anytime, anywhere.",
    sell: "Sell",
    buy: "Buy",
    selectToken: "Select token",
    getStarted: "Get started",
    swapNow: "Swap",
    enterAmount: "Enter an amount",
    captionA: "Buy and sell crypto across Ethereum, Unichain, Base and 22+ networks, ",
    captionB: "with zero app fees",
    captionC: ".",
    advanced: "Advanced",
    scroll: "Scroll to learn more",
    stats: [
      { value: "$4T+", label: "All-Time Volume" },
      { value: "$5B+", label: "Total Value Locked" },
      { value: "10M+", label: "Users" },
      { value: "$2.1B", label: "24h Volume", live: true },
    ],
    live: "Live",
    ecoH2: "Trade on DeFi's leading protocol.",
    eco: [
      { title: "Web App", desc: "Explore. Swap. Repeat." },
      { title: "Uniswap Wall", desc: "Discover the most talked about tokens." },
      { title: "UniswapX", desc: "Smarter swaps, better rates." },
      { title: "Earn", desc: "Provide liquidity, earn fees." },
      { title: "Trading API", desc: "Power your trading with programmatic access." },
      { title: "Unichain", desc: "DeFi's most performant network." },
    ],
    newsH3: "Stay Updated",
    newsP: "Get the latest Uniswap news and updates.",
    emailPh: "Enter your email",
    subscribe: "Subscribe",
    footerCols: [
      { title: "Products", links: ["Web App", "Wallet", "UniswapX", "Trading API"] },
      { title: "Protocol", links: ["Documentation", "Bug Bounty", "Explore", "Governance"] },
      { title: "Company", links: ["Careers", "Blog", "Brand Assets", "Press Kit"] },
      { title: "Help", links: ["Support", "Feedback", "Status"] },
    ],
    legal: ["Privacy Policy", "Terms of Service", "Trademark Policy"],
    langBtn: "中文",
  },
} as const;

type Dict = (typeof STRINGS)[Lang];

/* ─── Token Data (mock) ──────────────────────────────────── */
const TOKENS = [
  { name: "Ethereum", symbol: "ETH", color: "#627eea", priceUsd: 3456.78 },
  { name: "USD Coin", symbol: "USDC", color: "#2775ca", priceUsd: 1.0 },
  { name: "Tether USD", symbol: "USDT", color: "#50af96", priceUsd: 1.0 },
  { name: "Wrapped Bitcoin", symbol: "WBTC", color: "#f7931a", priceUsd: 98234.5 },
  { name: "Dai", symbol: "DAI", color: "#f5ac37", priceUsd: 1.0 },
  { name: "Arbitrum", symbol: "ARB", color: "#28a0f0", priceUsd: 1.23 },
  { name: "Optimism", symbol: "OP", color: "#ff0420", priceUsd: 2.45 },
  { name: "Uniswap", symbol: "UNI", color: "#ff007a", priceUsd: 14.32 },
];

const DEFAULT_FROM = TOKENS[0]; // ETH
const DEFAULT_TO = TOKENS[1];   // USDC

const ACCENTS = ["#2abdff", "#ff37c7", "#8251fb", "#00c3a0", "#ff4d00", "#f50db4"];
const TINTS = [
  "rgba(176,207,252,0.25)",
  "rgba(252,114,255,0.18)",
  "rgba(130,81,251,0.12)",
  "rgba(0,195,160,0.12)",
  "rgba(255,77,0,0.10)",
  "rgba(245,13,180,0.10)",
];

const tokenGlyph = (symbol: string) =>
  symbol === "ETH" ? "\u039E" : ["USDC", "USDT", "DAI"].includes(symbol) ? "$" : symbol.charAt(0);

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar({ t, onToggleLang }: { t: Dict; onToggleLang: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-1.5">
          <span style={{ color: PINK }} className="text-[24px] leading-none">◆</span>
          <span className="text-[16px] font-bold" style={{ color: PINK }}>Uniswap</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#131313" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {t.nav.map((l) => (
            <Link key={l.label} href={l.href} className="flex items-center gap-1.5 text-[15px] font-medium text-[rgba(19,19,19,0.63)] hover:text-[#131313] transition-colors">
              {l.label}
              {"beta" in l && l.beta && (
                <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full" style={{ backgroundColor: "rgba(255,55,199,0.12)", color: PINK }}>
                  Beta
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Center search pill */}
      <div className="hidden lg:flex items-center gap-2 h-9 w-[300px] rounded-full bg-[#f1f3f5] px-4 text-[#8a919e]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span className="text-sm flex-1">{t.search}</span>
        <span className="text-xs border border-[#e6e8eb] rounded-[5px] px-[5px] leading-[16px] bg-white">/</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={onToggleLang}
          className="h-9 px-3.5 rounded-full border border-[#e6e8eb] bg-white text-[13px] font-semibold text-[rgba(19,19,19,0.63)] hover:text-[#131313] hover:bg-[#f8f9fa] transition-colors"
          aria-label="Toggle language"
        >
          {t.langBtn}
        </button>
        <WalletConnectButton label={t.connect} />
      </div>
    </nav>
  );
}

/* ─── Background: blurred token bokeh ────────────────────── */
function TokenBokeh() {
  const dots: { top: string; left: string; s: number; c: string; o: number }[] = [
    { top: "8%",  left: "12%", s: 70, c: "#627eea", o: 0.55 },
    { top: "4%",  left: "70%", s: 52, c: "#f7931a", o: 0.5 },
    { top: "22%", left: "84%", s: 64, c: "#ff37c7", o: 0.5 },
    { top: "18%", left: "38%", s: 44, c: "#28a075", o: 0.45 },
    { top: "36%", left: "6%",  s: 58, c: "#7b61ff", o: 0.5 },
    { top: "52%", left: "16%", s: 48, c: "#ff4d4d", o: 0.45 },
    { top: "64%", left: "4%",  s: 66, c: "#627eea", o: 0.4 },
    { top: "78%", left: "12%", s: 50, c: "#f5ac37", o: 0.45 },
    { top: "38%", left: "92%", s: 56, c: "#2775ca", o: 0.45 },
    { top: "58%", left: "88%", s: 46, c: "#50af96", o: 0.45 },
    { top: "74%", left: "80%", s: 62, c: "#ff37c7", o: 0.4 },
    { top: "88%", left: "66%", s: 44, c: "#ff0420", o: 0.4 },
    { top: "90%", left: "30%", s: 54, c: "#28a0f0", o: 0.4 },
    { top: "30%", left: "62%", s: 40, c: "#f7931a", o: 0.35 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{ top: d.top, left: d.left, width: d.s, height: d.s, backgroundColor: d.c, opacity: d.o, filter: "blur(14px)" }}
        />
      ))}
    </div>
  );
}

/* ─── Hero Section ───────────────────────────────────────── */
function HeroSection({ t }: { t: Dict }) {
  return (
    <section className="relative flex flex-col items-center justify-start min-h-screen pt-28 pb-8 px-4">
      <h1 className="text-[44px] md:text-[64px] font-bold tracking-tight leading-[1.15] text-[#131313] mb-10 text-center">
        {t.h1}
      </h1>

      <SwapCard t={t} />

      <div className="mt-8 flex flex-col items-center gap-1.5 text-[#6a7180] text-[13px] text-center">
        <span>
          {t.captionA}
          <span style={{ color: PINK }}>{t.captionB}</span>
          {t.captionC}
        </span>
      </div>

      <div className="mt-auto pt-14 flex flex-col items-center gap-1 text-[#939aa5] text-xs">
        <span>{t.scroll}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}

/* ─── Swap Card (stacked Sell/Buy panels, official 2026 style) ── */
function SwapCard({ t }: { t: Dict }) {
  const { isConnected } = useAccount();
  const [fromToken, setFromToken] = useState(DEFAULT_FROM);
  const [toToken, setToToken] = useState(DEFAULT_TO);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmountInput, setToAmountInput] = useState("");
  const [editingField, setEditingField] = useState<"from" | "to">("from");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const toAmount = useMemo(() => {
    if (editingField === "to" || !fromAmount || isNaN(Number(fromAmount))) return "";
    const result = Number(fromAmount) * (fromToken.priceUsd / toToken.priceUsd);
    if (result >= 1000) return result.toFixed(2);
    if (result >= 1) return result.toFixed(4);
    return result.toFixed(6);
  }, [fromAmount, fromToken, toToken, editingField]);

  const fromAmountFromTo = useMemo(() => {
    if (editingField === "from" || !toAmountInput || isNaN(Number(toAmountInput))) return "";
    const result = Number(toAmountInput) * (toToken.priceUsd / fromToken.priceUsd);
    if (result >= 1000) return result.toFixed(2);
    if (result >= 1) return result.toFixed(4);
    return result.toFixed(6);
  }, [toAmountInput, fromToken, toToken, editingField]);

  const displayFrom = editingField === "from" ? fromAmount : fromAmountFromTo;
  const displayTo = editingField === "to" ? toAmountInput : toAmount;

  const fromUsd = useMemo(() => {
    const n = Number(displayFrom);
    return displayFrom && !isNaN(n) && n > 0 ? `$${(n * fromToken.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "$0.00";
  }, [displayFrom, fromToken]);

  const toUsd = useMemo(() => {
    const n = Number(displayTo);
    return displayTo && !isNaN(n) && n > 0 ? `$${(n * toToken.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "$0.00";
  }, [displayTo, toToken]);

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
    if (token.symbol === toToken.symbol) setToToken(fromToken);
    setFromToken(token);
    setShowFromDropdown(false);
  };

  const selectToToken = (token: typeof TOKENS[0]) => {
    if (token.symbol === fromToken.symbol) setFromToken(toToken);
    setToToken(token);
    setShowToDropdown(false);
  };

  const hasAmount = Number(displayFrom) > 0 || Number(displayTo) > 0;
  const ctaEnabled = isConnected && hasAmount;
  const ctaLabel = !isConnected ? t.getStarted : hasAmount ? t.swapNow : t.enterAmount;

  return (
    <div className="w-full max-w-[440px] relative">
      {/* Sell panel (white, on top) */}
      <TokenSelector
        label={t.sell}
        panelBg="#ffffff"
        amount={displayFrom}
        usd={fromUsd}
        onAmountChange={(v) => { setEditingField("from"); setFromAmount(v); }}
        onFocus={() => setEditingField("from")}
        token={fromToken}
        tokens={TOKENS}
        onSelect={selectFromToken}
        showDropdown={showFromDropdown}
        onToggleDropdown={() => setShowFromDropdown(!showFromDropdown)}
      />

      {/* Flip arrow riding the seam */}
      <div className="flex justify-center relative z-20 -my-[13px] pointer-events-none">
        <button
          onClick={handleSwapTokens}
          className="pointer-events-auto w-[26px] h-[26px] rounded-full bg-white border border-[#e6e8eb] shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex items-center justify-center text-[#131313] hover:bg-[#f1f3f5] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Buy panel (gray, underneath) */}
      <TokenSelector
        label={t.buy}
        panelBg="#f1f3f5"
        amount={displayTo}
        usd={toUsd}
        onAmountChange={(v) => { setEditingField("to"); setToAmountInput(v); }}
        onFocus={() => setEditingField("to")}
        token={toToken}
        tokens={TOKENS}
        onSelect={selectToToken}
        showDropdown={showToDropdown}
        onToggleDropdown={() => setShowToDropdown(!showToDropdown)}
      />

      {/* Price row */}
      {hasAmount && (
        <div className="px-4 py-2.5 rounded-[20px] bg-white border border-[#edeff2] mt-2 text-[13px] text-[#6a7180] flex items-center justify-between">
          <span>{priceRate}</span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M14 7h7v7" />
            </svg>
            {t.advanced}
          </span>
        </div>
      )}

      {/* CTA (separate rounded block, official style) */}
      <button
        className={`w-full h-[52px] mt-2 rounded-[20px] text-[16px] font-bold transition-colors ${ctaEnabled ? "hover:opacity-90" : "cursor-default"}`}
        style={{
          backgroundColor: ctaEnabled ? PINK : "rgba(255,55,199,0.08)",
          color: ctaEnabled ? "#ffffff" : PINK,
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

/* ─── Token Selector panel ───────────────────────────────── */
function TokenSelector({ label, panelBg, amount, usd, onAmountChange, onFocus, token, tokens, onSelect, showDropdown, onToggleDropdown }: {
  label: string;
  panelBg: string;
  amount: string;
  usd: string;
  onAmountChange: (v: string) => void;
  onFocus?: () => void;
  token: typeof TOKENS[0];
  tokens: typeof TOKENS;
  onSelect: (t: typeof TOKENS[0]) => void;
  showDropdown: boolean;
  onToggleDropdown: () => void;
}) {
  return (
    <div className="rounded-[20px] p-4 relative shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#edeff2]" style={{ backgroundColor: panelBg }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[13px] text-[#6a7180]">{label}</span>
        <button
          onClick={onToggleDropdown}
          className="flex items-center gap-1.5 rounded-full bg-white border border-[#e6e8eb] pl-1.5 pr-2.5 py-1 hover:bg-[#f8f9fa] transition-colors"
        >
          <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: token.color }}>
            {tokenGlyph(token.symbol)}
          </span>
          <span className="text-[14px] font-bold text-[#131313]">{token.symbol}</span>
          <svg width="9" height="6" viewBox="0 0 10 6" fill="none" stroke="#131313" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <input
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          placeholder="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          onFocus={onFocus}
          className="flex-1 min-w-0 bg-transparent text-[28px] font-semibold text-[#131313] placeholder-[rgba(19,19,19,0.35)] outline-none"
        />
        <span className="text-[12px] text-[#939aa5]">{usd}</span>
      </div>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggleDropdown} />
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#edeff2] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-20 max-h-[320px] overflow-y-auto p-2">
            {tokens.map((tk) => (
              <button
                key={tk.symbol}
                onClick={() => onSelect(tk)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#f1f3f5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: tk.color }}>
                    {tokenGlyph(tk.symbol)}
                  </span>
                  <div className="text-left">
                    <span className="text-sm font-bold text-[#131313] block">{tk.symbol}</span>
                    <span className="text-xs text-[#939aa5] block">{tk.name}</span>
                  </div>
                </div>
                <span className="text-sm text-[#6a7180]">${Number(tk.priceUsd).toLocaleString()}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Stats Section ──────────────────────────────────────── */
function StatsSection({ t }: { t: Dict }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {t.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 text-center group">
            {"live" in stat && stat.live && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: PINK }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: PINK }} />
                {t.live}
              </span>
            )}
            <span className="text-[#131313] text-[36px] md:text-[48px] tracking-tight group-hover:scale-105 transition-transform duration-300 font-bold block">
              {stat.value}
            </span>
            <span className="text-[#939aa5] font-medium uppercase tracking-wider text-xs block">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Apps Overview Section ──────────────────────────────── */
function AppsOverviewSection({ t }: { t: Dict }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-[32px] font-bold text-[#131313] mb-12 tracking-tight">
        {t.ecoH2}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {t.eco.map((app, i) => (
          <div
            key={app.title}
            className="rounded-[32px] p-8 cursor-pointer transition-transform hover:-translate-y-1"
            style={{ backgroundColor: TINTS[i] }}
          >
            <span className="text-[20px] font-bold block mb-2" style={{ color: ACCENTS[i] }}>{app.title}</span>
            <span className="text-[#131313]/70 text-[15px]">{app.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter Section ─────────────────────────────────── */
function NewsletterSection({ t }: { t: Dict }) {
  const handleSubscribe = async () => {
    await fetch("/api/subscribe", { method: "POST" });
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <div className="rounded-[32px] bg-[#f1f3f5] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-2xl font-bold text-[#131313] mb-1.5 tracking-tight">{t.newsH3}</h3>
          <p className="text-[#6a7180] text-sm leading-relaxed">{t.newsP}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            placeholder={t.emailPh}
            className="bg-white border border-[#e6e8eb] h-12 rounded-full px-5 min-w-[240px] text-[#131313] text-sm outline-none focus:border-[rgba(255,55,199,0.5)]"
          />
          <button
            onClick={handleSubscribe}
            className="whitespace-nowrap rounded-full h-12 px-7 font-bold text-[15px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: PINK, color: "#ffffff" }}
          >
            {t.subscribe}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer({ t }: { t: Dict }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl mx-auto px-10 md:px-12 py-14 mt-8">
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
        <div className="flex gap-5 items-start">
          <a href="https://github.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-[#131313]/40 hover:text-[#131313] transition-colors cursor-pointer p-2 rounded-full hover:bg-black/[0.04] inline-flex">
            <GithubIcon size={28} />
          </a>
          <a href="https://x.com/Uniswap" target="_blank" rel="noopener noreferrer" className="text-[#131313]/40 hover:text-[#131313] transition-colors cursor-pointer p-2 rounded-full hover:bg-black/[0.04] inline-flex">
            <TwitterIcon size={28} />
          </a>
          <a href="https://discord.com/invite/uniswap" target="_blank" rel="noopener noreferrer" className="text-[#131313]/40 hover:text-[#131313] transition-colors cursor-pointer p-2 rounded-full hover:bg-black/[0.04] inline-flex">
            <DiscordIcon size={28} />
          </a>
        </div>

        <div className="flex gap-16 flex-wrap">
          {t.footerCols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3 min-w-[90px]">
              <span className="text-[#131313]/70 font-bold text-sm">{col.title}</span>
              {col.links.map((link) => (
                <Link key={link} href="#" className="text-sm text-[#131313]/40 hover:text-[#131313] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#edeff2] mb-8" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[#939aa5] text-sm">© {currentYear} Uniswap Labs</span>
        <div className="flex gap-8">
          {t.legal.map((l) => (
            <Link key={l} href="#" className="text-sm text-[#939aa5] hover:text-[#131313] transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Floating help button ───────────────────────────────── */
function HelpButton() {
  return (
    <button
      className="fixed bottom-5 left-5 z-50 w-[36px] h-[36px] rounded-full bg-[#131313] text-white text-[15px] font-bold flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
      aria-label="Help"
    >
      ?
    </button>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const t = STRINGS[lang];

  return (
    <div className="relative w-full min-h-screen bg-white" lang={lang}>
      <TokenBokeh />
      <div className="relative z-10 flex flex-col items-center w-full">
        <Navbar t={t} onToggleLang={() => setLang((l) => (l === "zh" ? "en" : "zh"))} />
        <HeroSection t={t} />
        <StatsSection t={t} />
        <AppsOverviewSection t={t} />
        <NewsletterSection t={t} />
        <Footer t={t} />
      </div>
      <HelpButton />
    </div>
  );
}
