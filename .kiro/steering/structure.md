# Project Structure

## Root Directory
```
polley/
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and steering
├── .next/                  # Next.js build output
├── node_modules/           # Dependencies
└── [config files]          # Various configuration files
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
```
src/app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Homepage
├── globals.css             # Global styles and theme variables
├── favicon.ico             # App icon
├── auth/                   # Authentication pages
│   ├── layout.tsx          # Auth-specific layout
│   ├── sign-in/page.tsx    # Sign-in page
│   └── sign-up/page.tsx    # Sign-up page
└── polls/                  # Poll-related pages
    ├── page.tsx            # Poll listing/dashboard
    ├── new/page.tsx        # Create new poll
    └── [id]/page.tsx       # Individual poll view/voting
```

### Components (`src/components/`)
```
src/components/
├── auth-provider.tsx       # Authentication context provider
├── navbar.tsx              # Main navigation component
├── theme-provider.tsx      # Theme context provider
├── theme-switcher.tsx      # Theme toggle component
├── floating-logo.tsx       # Animated logo component
├── floating-theme-toggle.tsx # Floating theme toggle
└── ui/                     # shadcn/ui components
    ├── alert.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── noise.tsx           # Custom noise texture component
    └── shadcn-io/          # Additional shadcn components
```

### Library Code (`src/lib/`)
```
src/lib/
├── utils.ts                # Utility functions (cn helper)
└── supabase/               # Supabase configuration
    ├── client.ts           # Client-side Supabase instance
    └── server.ts           # Server-side Supabase instance
```

## Static Assets (`public/`)
- SVG icons and illustrations
- Feature graphics (`feature-*.svg`)
- Hero illustrations (`hero-*.svg`)
- Brand assets (`polley-logo.svg`)

## Naming Conventions

### Files & Directories
- **kebab-case** for directories and most files
- **PascalCase** for React component files
- **camelCase** for utility functions and variables

### Components
- Use descriptive, noun-based names
- Prefix with domain when applicable (e.g., `auth-provider.tsx`)
- UI components follow shadcn/ui conventions

### Routes
- Follow Next.js App Router conventions
- Use `[id]` for dynamic routes
- Group related routes in folders

## Import Patterns
- Use `@/` path alias for src imports
- Import UI components from `@/components/ui`
- Import utilities from `@/lib/utils`
- Import Supabase clients from `@/lib/supabase`

## Code Organization Principles
- **Separation of concerns**: Clear distinction between UI, logic, and data
- **Component composition**: Prefer composition over inheritance
- **Provider pattern**: Use React Context for global state (auth, theme)
- **Server/Client separation**: Clear boundaries for server and client code
- **Type safety**: Leverage TypeScript throughout the application