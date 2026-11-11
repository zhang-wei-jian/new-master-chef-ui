# MasterChef UI

[English](#en) · [中文](#zh)

<a id="en"></a>
![Home](docs/images/home-zh.png)

## English

Uniswap-style frontend for testing **MasterChef** smart contract interactions. Built with Next.js 16 + HeroUI v3, mirroring the official [app.uniswap.org](https://app.uniswap.org) 2026 interface — light theme, brand pink `#FF37C7`, stacked Sell/Buy swap panels, blurred token bokeh. UI ships with a zh/en language toggle.

Homepage details are sampled from the live Uniswap front end (computed styles of the official page): nav links `rgba(19,19,19,0.63)` with pink logo wordmark, `#FF37C7` primary buttons with white text, disabled CTA at 8% pink alpha, per-product accent colors on ecosystem cards.

### Purpose

- Test and verify MasterChef contract functionality through a realistic DeFi UI
- Mirror the Uniswap Web frontend styling/layout with HeroUI + Tailwind v4 components
- No business logic yet — swap quotes and pool tables run on static/mock data

### Features

- Landing page cloned from the current official Uniswap home (light theme + token bokeh background)
- Mock swap card: bidirectional amount input, token dropdown, live price row
- Wallet connect (Wagmi v3: injected / WalletConnect) with connected-state pill
- Pools explorer and Positions pages (mock data, dark theme)

### Tech Stack

- [Next.js 16](https://nextjs.org/docs/getting-started) (App Router, Turbopack)
- [HeroUI v3](https://heroui.com/) + Tailwind CSS v4 + Tailwind Variants
- [Wagmi v3](https://wagmi.sh/) + [Viem v2](https://viem.sh/) for wallet integration
- [next-themes](https://github.com/pacocoursey/next-themes)

### Getting Started

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run lint             # ESLint with --fix
```

### Pages

| Route | Description | Status |
|---|---|---|
| `/` | Landing page — official-style light theme | Done |
| `/explore/pools` | Pool explorer table (mock data, dark theme) | Mock |
| `/positions` | LP positions (empty state + top pools sidebar, mock) | Mock |

### Migration Source

Reference implementation: `interface-main/apps/web/src/pages/` (Uniswap Web frontend using Tamagui). Convert Tamagui `styled()` to HeroUI + Tailwind utility classes.

<a id="zh"></a>
## 中文

用于测试 **MasterChef** 智能合约交互的 Uniswap 风格前端。基于 Next.js 16 + HeroUI v3，复刻官方 [app.uniswap.org](https://app.uniswap.org) 2026 版界面——浅色主题、品牌粉 `#FF37C7`、卖出/买入双层交换面板、模糊代币光斑背景，内置中英文切换。

首页细节取自官方页面实测（computed style）：导航链接 `rgba(19,19,19,0.63)`、粉色 logo 字标、`#FF37C7` 主按钮白字、禁用态 CTA 为 8% 透明度粉底、生态卡片按产品使用各自的强调色。

### 目的

- 通过逼真的 DeFi 界面测试验证 MasterChef 合约功能
- 用 HeroUI + Tailwind v4 复刻 Uniswap Web 前端的样式与布局
- 暂无业务逻辑——兑换报价和池子列表均为静态 mock 数据

### 功能

- 首页复刻官方当前版 Uniswap 主页（浅色主题 + 代币光斑背景）
- Mock 交换卡片：双向金额输入、代币下拉、实时价格行
- 钱包连接（Wagmi v3：注入式 / WalletConnect），连接后显示地址胶囊
- Pools 浏览页与 Positions 页（mock 数据，深色主题）

### 技术栈

- [Next.js 16](https://nextjs.org/docs/getting-started)（App Router、Turbopack）
- [HeroUI v3](https://heroui.com/) + Tailwind CSS v4 + Tailwind Variants
- [Wagmi v3](https://wagmi.sh/) + [Viem v2](https://viem.sh/) 钱包集成
- [next-themes](https://github.com/pacocoursey/next-themes)

### 快速开始

```bash
npm install              # 安装依赖
npm run dev              # 启动开发服务器（http://localhost:3000）
npm run build            # 生产构建
npm run lint             # ESLint 自动修复
```

### 页面

| 路由 | 说明 | 状态 |
|---|---|---|
| `/` | 首页——官方同款浅色主题 | 完成 |
| `/explore/pools` | 流动性池浏览表（mock 数据，深色主题） | Mock |
| `/positions` | LP 头寸（空态 + Top Pools 侧栏，mock） | Mock |

### 迁移来源

参考实现：`interface-main/apps/web/src/pages/`（Uniswap Web 前端，基于 Tamagui）。将 Tamagui `styled()` 转换为 HeroUI + Tailwind 工具类。

## License

MIT
