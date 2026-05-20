# AGENTS.md — my-heroui-app

## Project

Next.js 16 + HeroUI v3 migration target for Uniswap Web frontend (see `../interface-main/`). Only CSS/layout migration — no JS logic yet.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint with --fix
```

No test runner configured. No typecheck script — rely on `next build` for type checking.

## Architecture

- **App Router**: `app/` directory
  - `layout.tsx` — root layout, providers wrapper (dark default)
  - `page.tsx` — Landing page (fully migrated Uniswap style)
  - `providers.tsx` — WagmiProvider + QueryClientProvider + NextThemesProvider
- **Components**: `components/` — HeroUI-based shared components (`Navbar`, `WalletConnectButton`, `primitives.ts` for tailwind-variants)
- **Config**: `config/site.ts`, `config/fonts.ts`, `config/wagmi.ts`
- **Styles**: `styles/globals.css` + Tailwind CSS v4 (PostCSS plugin: `@tailwindcss/postcss`)

## Styling conventions

- Use **HeroUI v3** components (`Button`, `Card`, `Input`, `Chip`, etc.) from `@heroui/react`
- Composable variants via `tv()` from `tailwind-variants` (see `components/primitives.ts`)
- All custom styles use **Tailwind utility classes** — no CSS modules or styled-components
- Dark theme default (`next-themes`, `attribute="class"`)
- Mirror Uniswap dark palette: bg `[#0b0b14]`, cards `[#13131f]`, borders `white/[0.04]`

## Migration rules (from workspace AGENTS.md)

- Port **only** CSS/layout from `interface-main/apps/web/src/pages/`
- Use static/mock data — no business logic
- Do not import from Uniswap packages (NX monorepo dependencies)
- Pages to migrate: Home (`/`), Positions (`/positions`), Pool Details (`/explore/pools/:chainName/:poolAddress`)

## Gotchas

- ESLint ignores `**/*.css` — CSS linting is not configured
- Import alias `@/*` maps to project root (see `tsconfig.json`)
- Wagmi v3 + viem v2 configured in `config/wagmi.ts`
- No Prettier formatter enforced at CI level; ESLint `prettier/prettier` rule is `warn` only
