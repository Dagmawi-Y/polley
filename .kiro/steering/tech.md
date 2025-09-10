# Technology Stack

## Framework & Runtime
- **Next.js 15.5.2** with App Router architecture
- **React 19.1.0** with TypeScript
- **Node.js** runtime environment

## Build System & Development
- **Turbopack** for fast development and builds (via `--turbopack` flag)
- **TypeScript 5** for type safety
- **ESLint 9** for code linting

## Styling & UI
- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui** component library (New York style)
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **Custom CSS variables** for theming with OKLCH color space
- **Grain textures and gradients** for visual enhancement

## Database & Authentication
- **Supabase** for database and authentication
- **@supabase/supabase-js** client library
- **@supabase/auth-helpers-nextjs** for Next.js integration

## Utilities
- **clsx** and **tailwind-merge** for conditional styling
- **class-variance-authority** for component variants

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Package Management
The project uses npm as the primary package manager, with both `package-lock.json` and `bun.lock` present.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Key Configuration Files
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*` → `./src/*`)
- `components.json` - shadcn/ui configuration
- `postcss.config.mjs` - PostCSS with Tailwind CSS plugin
- `next.config.ts` - Next.js configuration (minimal setup)