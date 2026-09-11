# Minecraft Survival Bot

A Mineflayer bot that connects to the Normal Survival Minecraft server, logs in
after spawning, and reconnects automatically after interruptions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm start` — run the Minecraft bot and its HTTP keep-alive server
- `pnpm run dev` — run the bot with Node watch mode
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Node.js Mineflayer bot with Express health endpoints
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `index.js` — Mineflayer connection, login, timestamped logging, and reconnect loop
- `README.md` — Replit setup and operation instructions
- `package.json` — `start`/`dev` scripts and runtime dependencies

## Architecture decisions

- Reconnects are scheduled only once at a time, even when an error is followed by
  an `end` event.
- The HTTP server uses Replit's `PORT` environment variable and provides
  `/healthz` for service monitoring.
- No movement, jumping, swinging, or anti-AFK behavior is implemented.

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
