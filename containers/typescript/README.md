# TypeScript

Multi-stage production Dockerfile and a dev variant for TypeScript projects. Both are rendered from a single `setup.bp` blueprint — Node version and system packages are defined once and flow into every generated file.

## Files

| File | Purpose |
|------|---------|
| `setup.bp` | Blueprint — Node version, system packages, required variables |
| `Dockerfile.tmpl` | Production — two-stage, non-root user, minimal final image |
| `Dockerfile.local.tmpl` | Development — single stage, volume-mounted code, dev deps included |
| `entrypoint.sh.tmpl` | Production entrypoint — runs pre-start tasks then execs CMD |
| `local-entrypoint.sh.tmpl` | Dev entrypoint — installs deps, runs pre-start tasks, then execs CMD |
| `.dockerignore.tmpl` | Excludes node_modules, dist, cache, secrets, and editor files from build context |

## Variables

Variables are resolved in this order: `--var` flag → `var` in `setup.bp` → template default.

| Variable | Required | Template default | Description |
|----------|----------|-----------------|-------------|
| `APP_NAME` | **yes** | — | Application name (used for labels, metadata) |
| `NODE_VERSION` | no | `22.14.0` | Node.js version — also used by mise — uncomment in `setup.bp` to pin project-wide |
| `REGISTRY` | no | `docker.io` | Container registry prefix |
| `WORKDIR` | no | `/app` | Working directory inside the container |
| `PORT` | no | `3000` | Port exposed by the application |
| `CMD` | no | `node dist/index.js` (prod) / `npx tsx watch src/index.ts` (dev) | Application command |
| `PRE_START` | no | — | Production pre-start commands (e.g. `npm run migrate && npx prisma generate`) |
| `PRE_START_LOCAL` | no | — | Local/dev pre-start commands (e.g. `npx prisma db seed`) |
| `HC_INTERVAL` | no | `30s` | Healthcheck check interval |
| `HC_TIMEOUT` | no | `5s` | Healthcheck per-check timeout |
| `HC_START_PERIOD` | no | `120s` | Healthcheck initial grace period for startup |
| `HC_RETRIES` | no | `3` | Healthcheck failed attempts before marking unhealthy |

Node version has a default of `22.14.0` (defined in `setup.bp`). The same value feeds both the Dockerfile build `ARG` and the `mise` tool version. Override per-project by uncommenting `var NODE_VERSION` in `setup.bp`, or per-render with `--var NODE_VERSION=20.11.0`. Rendered as a build `ARG`, not an `ENV`, so it does not leak into the final image.

## Usage

**1. Copy this folder into your project.**

**2. Update `setup.bp`:**
- Optionally pin the Node version by adjusting `var NODE_VERSION 22.14.0` (the default is already sensible for most projects)
- Add system packages with `stage: build` (compile-time only) or `stage: runtime` (final image)
- Uncomment any optional vars you want to pin project-wide

**3. Render all templates into your project:**

```bash
blueprint render setup.bp --template . --output . --var APP_NAME=myapp
```

This creates `Dockerfile`, `Dockerfile.local`, and `entrypoint.sh` in the current directory.

**4. Override variables at render time:**

```bash
blueprint render setup.bp --template . --output . \
  --var APP_NAME=myapp \
  --var REGISTRY=ghcr.io \
  --var PORT=4000 \
  --var NODE_VERSION=20.11.0 \
  --var CMD="node dist/server.js" \
  --var PRE_START="npm run migrate && npx prisma generate" \
  --var PRE_START_LOCAL="npx prisma db seed" \
  --var HC_START_PERIOD=180s \
  --var HC_RETRIES=5
```

**5. Check for drift in CI:**

```yaml
- name: Check Dockerfiles are up to date
  run: |
    blueprint check setup.bp \
      --template . \
      --against . \
      --var APP_NAME=myapp \
      --var PRE_START="npm run migrate && npx prisma generate" \
      --var PRE_START_LOCAL="npx prisma db seed"
```

## Production Dockerfile — what it does

**Stage 1 (build):** Installs all dependencies (including devDependencies) via `npm ci`. Manifest files (`package.json`, `package-lock.json`) are bind-mounted (not copied) so they don't create an extra layer. This stage is fully cached until `package.json` or `package-lock.json` changes. TypeScript is compiled with `npm run build` (assumes a `build` script in `package.json`).

**Stage 2 (runtime):** Starts from a fresh base image. Installs only runtime system packages. Creates a non-root user (`app:app`, uid/gid 1001). Copies compiled output (`dist/`) from the build stage, copies `package*.json`, installs production-only dependencies with `npm ci --omit=dev --ignore-scripts`. No devDependencies, no source code, no `.npm` cache in the final image.

Node version is passed as a build `ARG` — it does not appear in `docker inspect` on the final image. The same `NODE_VERSION` value feeds both the Dockerfile and the `mise` tool version.

## entrypoint.sh — what it does

`ENTRYPOINT` is a wrapper script, not the application binary. It runs pre-start tasks (e.g. database migrations, Prisma client generation) and then `exec "$@"` to hand off to `CMD`. This is the correct Docker pattern:

- `ENTRYPOINT ["./entrypoint.sh"]` — always runs, handles setup
- `CMD ["node", "dist/index.js"]` — the actual application, passed as `$@` to the entrypoint

Pre-start tasks are configured via blueprint variables instead of editing the entrypoint directly:

- `PRE_START` — commands for the **production** entrypoint (e.g. migrations)
- `PRE_START_LOCAL` — commands for the **local/dev** entrypoint (e.g. seeding)

```bash
blueprint render setup.bp --template . --output . \
  --var APP_NAME=myapp \
  --var PRE_START="npm run migrate && npx prisma generate" \
  --var PRE_START_LOCAL="npx prisma db seed"
```

This keeps the entrypoint files unchanged, so `blueprint check` never flags them as drift. The `exec` ensures the app process receives signals correctly (PID 1).

## Development Dockerfile — what it does

Single stage. Installs all dependencies (including dev) from the lockfile but does **not** copy application code — mount it as a volume so changes are reflected instantly without rebuilding. Dependencies are always synced on container start — with the npm cache mount this is near-instant when nothing changed, and it ensures the container always has the latest deps matching the mounted code.

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.local
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: ["npx", "tsx", "watch", "src/index.ts"]
```

## Best practices applied

- `# syntax=docker/dockerfile:1` — enables BuildKit features
- `ARG` for build-time values (Node version, registry) — not leaked into final image
- `--mount=type=bind` for manifest files — no extra layer for dependency installation
- `--mount=type=cache` for npm cache — faster rebuilds
- `npm ci` instead of `npm install` — respects lockfile exactly, fails if lockfile is out of date
- `--omit=dev` in production — devDependencies are not installed in the runtime image
- `--ignore-scripts` in production — prevents postinstall scripts from running (security best practice)
- Multi-stage build — TypeScript is compiled in the build stage only
- Non-root user with explicit uid/gid 1001 and `--no-create-home`
- `NODE_ENV=production` — enables Node.js production optimizations (faster execution, reduced memory)
- `PATH` includes `node_modules/.bin` — npx-like behavior without the npx overhead
- `HEALTHCHECK` with configurable interval, timeout, start-period, and retries — override per app via `HC_INTERVAL`, `HC_TIMEOUT`, `HC_START_PERIOD`, `HC_RETRIES`
- OCI image labels (`org.opencontainers.image.*`) — fill in `source` and `licenses`
- `.dockerignore` — excludes `node_modules`, `dist`, secrets, editor files, and build artifacts
- `stage: build` / `stage: runtime` on `install` rules — build tools go in the build stage only, runtime packages go in the final image only; dev image gets both via `{{ packages }}`
- `ENTRYPOINT` is a shell wrapper (`entrypoint.sh`), not the app binary — runs pre-start tasks configured via `PRE_START`, then `exec "$@"` to hand off to `CMD` with correct signal handling
- `CMD` is the actual application command — overridable per environment without changing the entrypoint
- `PRE_START` / `PRE_START_LOCAL` variables for pre-start hooks — production and local can differ; no manual edits to entrypoint files, so `blueprint check` never flags drift
- Dev entrypoint always syncs dependencies on start — with npm cache mount it's near-instant, ensures deps match mounted code
- `wget` for healthcheck — lightweight, available on slim images, no Node.js process needed
