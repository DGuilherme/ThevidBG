@AGENTS.md

# BoardGameHub — Agent Guide

## Required project files

| File | Purpose | Mutability |
|------|---------|------------|
| `SPEC.md` | What the project does and what is out of scope | Immutable without explicit decision |
| `PLAN.md` | Roadmap phases with `[x]` done / `[~]` in progress / `[ ]` todo | Updated as phases progress |
| `TASKS.md` | MoSCoW backlog with checkboxes and done criteria | Updated per task |
| `CLAUDE.md` | This file | Updated when conventions change |

## Agent rules

1. Read `SPEC.md` and `TASKS.md` before starting any feature.
2. Enter Plan Mode before any change that touches more than 2 files.
3. Never implement anything not in `SPEC.md` — update the spec first, then implement.
4. When a task is complete, update its checkbox from `[ ]` or `[~]` to `[x]` in `TASKS.md`.
5. Run `npm run lint && npm run build` before marking any task as done.

## How to run

All commands run from `boardgamehub/`:

```
npm run dev      # dev server on http://localhost:3000
npm run build    # production build (type-checks + compiles)
npm run lint     # ESLint
npm run start    # serve the production build
```

There is no test suite yet. The lint + build pipeline is the quality gate.

## Architecture

```
lib/          Pure TypeScript — no React, no JSX. Business logic, Supabase queries, BGG parsing.
components/   Pure UI — no direct DB or API calls.
hooks/        TanStack Query hooks — the only bridge between lib/ and components/.
store/        Zustand slices — global client state only.
app/          Next.js App Router pages, layouts, and server actions.
app/api/bgg/  BGG proxy route handlers (CORS + caching).
supabase/     schema.sql and migrations.
types/        database.ts — generated Supabase types.
```

This separation is intentional: it keeps the mobile migration (Capacitor / React Native) cheap.

## Code conventions

- **Next.js 16.2.6 (App Router):** `proxy.ts` replaces `middleware.ts`. `params`, `cookies`, and `headers` are async Promises — always `await` them.
- **Supabase client:** import `createServerSupabaseClient` from `lib/supabase/server.ts` (never `createClient`).
- **Supabase types:** `types/database.ts` must use `type` (not `interface`) and include `Relationships: []` on every table — otherwise all `.from()` calls resolve as `never`.
- **UI components:** use `@base-ui/react` headless primitives. Button lives at `@/components/ui/button`. Never use Radix UI.
- **Styling:** Tailwind CSS v4, OKLCH color system, dark mode forced via `dark` class on `<html>`. Mobile-first.
- **Server actions:** actions used directly in `<form action={...}>` must return `Promise<void>`. Use `useActionState` for typed returns.
- **BGG API:** always proxy via `app/api/bgg/` — never call BoardGameGeek directly from the browser.
- **Imports:** use `@/` path alias. No relative `../../` imports beyond one level.
- **Comments:** only when the WHY is non-obvious. No docstrings, no "this does X" comments.

## What not to do

- Do not call the BGG XML API directly from client-side code.
- Do not use `interface` in `types/database.ts`.
- Do not import from Radix UI — this project uses `@base-ui/react`.
- Do not put React code in `lib/` or database code in `components/`.
- Do not add features not listed in `SPEC.md` without updating the spec first.
- Do not skip the lint + build check before marking a task done.
- Do not use `createClient` from Supabase — use `createServerSupabaseClient`.
- Do not commit `.env.local` — it contains real credentials.
