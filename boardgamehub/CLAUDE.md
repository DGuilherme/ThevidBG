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
lib/db/         Drizzle schema, DB client, queries/, mutations/ — pure TS, no React.
lib/session.ts  iron-session helpers (getSession, sessionOptions).
lib/bgg/        BGG API client and XML parser.
components/     Pure UI — no direct DB or API calls.
hooks/          TanStack Query hooks — the only bridge between lib/ and components/.
store/          Zustand slices — global client state only.
app/            Next.js App Router pages, layouts, and server actions.
app/api/bgg/    BGG proxy route handlers (CORS + caching).
drizzle/        schema.sql (Coolify PostgreSQL init script) and migration files.
types/          app.ts — composite app types. All base types come from lib/db/schema.ts.
```

This separation is intentional: it keeps the mobile migration (Capacitor / React Native) cheap.

## Infrastructure

- **Hosting:** Coolify self-hosted (`coolify.theviddev.org`) — deploy via git push to main.
- **Database:** PostgreSQL self-hosted, managed by Coolify. Run `drizzle/schema.sql` on first deploy.
- **Env vars set in Coolify:** `DATABASE_URL`, `SESSION_SECRET` (min 32 chars, random string).

## Code conventions

- **Next.js 16.2.6 (App Router):** `proxy.ts` replaces `middleware.ts`. `params`, `cookies`, and `headers` are async Promises — always `await` them.
- **DB client:** import `db` from `@/lib/db`. Schema types come from `@/lib/db/schema`.
- **Session:** use `getSession()` from `@/lib/session` in server actions. Never read the session cookie manually.
- **Auth in actions:** check `session.userId` — throw or return error if falsy.
- **Drizzle snake_case:** schema columns use snake_case property names (e.g. `user_id`, `image_url`) to match existing TypeScript types and avoid refactoring components.
- **UI components:** use `@base-ui/react` headless primitives. Button lives at `@/components/ui/button`. Never use Radix UI.
- **Styling:** Tailwind CSS v4, OKLCH color system, dark mode forced via `dark` class on `<html>`. Mobile-first.
- **Server actions:** actions used directly in `<form action={...}>` must return `Promise<void>`. Use `useActionState` for typed returns.
- **BGG API:** always proxy via `app/api/bgg/` — never call BoardGameGeek directly from the browser.
- **Imports:** use `@/` path alias. No relative `../../` imports beyond one level.
- **Comments:** only when the WHY is non-obvious. No docstrings, no "this does X" comments.

## What not to do

- Do not call the BGG XML API directly from client-side code.
- Do not import from Radix UI — this project uses `@base-ui/react`.
- Do not put React code in `lib/` or database code in `components/`.
- Do not add features not listed in `SPEC.md` without updating the spec first.
- Do not skip the lint + build check before marking a task done.
- Do not import from `@supabase/ssr` or `@supabase/supabase-js` — Supabase has been removed.
- Do not commit `.env.local` — it contains real credentials.
