# MasterChef UI

Uniswap-style frontend for testing **MasterChef** smart contract interactions. Built with Next.js 16 + HeroUI v3, mirroring the Uniswap Web interface design and layout patterns.

## Purpose

- Test and verify MasterChef contract functionality through a realistic DeFi UI
- Migrate Uniswap Web frontend styling/layout from `interface-main/` to HeroUI components
- No business logic — static/mock data for layout verification only

## Tech Stack

- [Next.js 16](https://nextjs.org/docs/getting-started) (App Router, Turbopack)
- [HeroUI v3](https://heroui.com/) + Tailwind CSS v4 + Tailwind Variants
- [Wagmi v3](https://wagmi.sh/) + [Viem v2](https://viem.sh/) for wallet integration
- [next-themes](https://github.com/pacocoursey/next-themes) (dark theme default)

## Getting Started

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint with --fix
```

## Pages

| Route | Description | Status |
|---|---|---|
| `/` | Landing page (Uniswap-style) | Migrated |
| `/positions` | LP positions list | TODO |
| `/explore/pools/:chainName/:poolAddress` | Pool details with stats | TODO |

## Migration Source

Reference implementation: `interface-main/apps/web/src/pages/` (Uniswap Web frontend using Tamagui). Convert Tamagui `styled()` to HeroUI + Tailwind utility classes.

## License

MIT
