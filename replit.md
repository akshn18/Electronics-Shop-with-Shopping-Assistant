# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

### Codex to GitHub to Replit

- Canonical repository: https://github.com/akshn18/Electronics-Shop-with-Shopping-Assistant.git
- Integration branch: `main`.
- Codex checks, commits, and pushes completed requested changes to `origin/main` according to `AGENTS.md`.
- In Replit, confirm the Git remote matches this repository and the active branch is `main`, then click **Sync changes** after a push. Run or restart the app if necessary.
- Keep `OPENAI_API_KEY` and `DATABASE_URL` in Replit Secrets. Live shopping assistant verification happens in Replit.
- Before switching from Replit edits to Codex edits, commit and push the Replit changes so Codex can fetch them. Resolve any conflicts before continuing the sync flow.

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
