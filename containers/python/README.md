# Python

Multi-stage production Dockerfile and a dev variant for Python projects. Both are rendered from a single `setup.bp` blueprint — Python version and runtime packages are defined once and flow into every generated file.

## Files

| File | Purpose |
|------|---------|
| `setup.bp` | Blueprint — Python version, runtime packages, required variables |
| `Dockerfile.tmpl` | Production — two-stage, non-root user, minimal final image |
| `Dockerfile.local.tmpl` | Development — single stage, volume-mounted code, dev deps included |
| `entrypoint.sh.tmpl` | Production entrypoint — runs pre-start tasks (migrations) then execs CMD |
| `local-entrypoint.sh.tmpl` | Dev entrypoint — installs deps, runs pre-start tasks, then execs CMD |
| `.dockerignore.tmpl` | Excludes venv, cache, secrets, and editor files from build context |

## Variables

Variables are resolved in this order: `--var` flag → `var` in `setup.bp` → template default.

| Variable | Required | Template default | Description |
|----------|----------|-----------------|-------------|
| `APP_NAME` | **yes** | — | Python module used as the app command (`python -m <APP_NAME>`) |
| `PYTHON_VERSION` | no | `3.12.3` | Python version — also used by mise — uncomment in `setup.bp` to pin project-wide |
| `REGISTRY` | no | `docker.io` | Container registry prefix |
| `WORKDIR` | no | `/app` | Working directory inside the container |
| `PORT` | no | `8000` | Port exposed by the application |
| `UV_VERSION` | no | `latest` | uv version — pin for reproducible builds (e.g. `0.4.0`) |
| `PRE_START` | no | — | Production pre-start commands (e.g. `python manage.py migrate && python manage.py collectstatic --no-input`) |
| `PRE_START_LOCAL` | no | — | Local/dev pre-start commands (e.g. `uv run python manage.py seed_data`) |
| `HC_INTERVAL` | no | `30s` | Healthcheck check interval |
| `HC_TIMEOUT` | no | `5s` | Healthcheck per-check timeout |
| `HC_START_PERIOD` | no | `120s` | Healthcheck initial grace period for startup |
| `HC_RETRIES` | no | `3` | Healthcheck failed attempts before marking unhealthy |

Python version has a default of `3.12.3` (defined in `setup.bp`). The same value feeds both the Dockerfile build `ARG` and the `mise` tool version. Override per-project by uncommenting `var PYTHON_VERSION` in `setup.bp`, or per-render with `--var PYTHON_VERSION=3.11.9`. Rendered as a build `ARG`, not an `ENV`, so it does not leak into the final image.

## Usage

**1. Copy this folder into your project.**

**2. Update `setup.bp`:**
- Optionally pin the Python version by adjusting `var PYTHON_VERSION 3.12.3` (the default is already sensible for most projects)
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
  --var PORT=9000 \
  --var PYTHON_VERSION=3.11.9 \
  --var UV_VERSION=0.4.0 \
  --var PRE_START="python manage.py migrate && python manage.py collectstatic --no-input" \
  --var PRE_START_LOCAL="uv run python manage.py seed_data" \
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
      --var PRE_START="python manage.py migrate" \
      --var PRE_START_LOCAL="uv run python manage.py seed_data"
```

## Production Dockerfile — what it does

**Stage 1 (deps):** Installs only production dependencies via `uv sync --frozen --no-dev`. Lockfiles are bind-mounted (not copied) so they don't create an extra layer. This stage is fully cached until `pyproject.toml` or `uv.lock` changes.

**Stage 2 (runtime):** Starts from a fresh base image. Installs only runtime system packages. Creates a non-root user (`app:app`, uid/gid 1001). Copies the `.venv` from the deps stage, the application code, and `entrypoint.sh`. No uv, no build tools, no cache in the final image.

Python version and uv version are passed as build `ARG`s — they do not appear in `docker inspect` on the final image. The same `PYTHON_VERSION` value feeds both the Dockerfile and the `mise` tool version.

## entrypoint.sh — what it does

`ENTRYPOINT` is a wrapper script, not the application binary. It runs pre-start tasks (e.g. database migrations) and then `exec "$@"` to hand off to `CMD`. This is the correct Docker pattern:

- `ENTRYPOINT ["./entrypoint.sh"]` — always runs, handles setup
- `CMD ["python", "-m", "myapp"]` — the actual application, passed as `$@` to the entrypoint

Pre-start tasks are configured via blueprint variables instead of editing the entrypoint directly:

- `PRE_START` — commands for the **production** entrypoint (e.g. migrations)
- `PRE_START_LOCAL` — commands for the **local/dev** entrypoint (e.g. seeding)

```bash
blueprint render setup.bp --template . --output . \
  --var APP_NAME=myapp \
  --var PRE_START="python manage.py migrate && python manage.py collectstatic --no-input" \
  --var PRE_START_LOCAL="uv run python manage.py seed_data"
```

This keeps the entrypoint files unchanged, so `blueprint check` never flags them as drift. The `exec` ensures the app process receives signals correctly (PID 1).

## Development Dockerfile — what it does

Single stage. Installs all dependencies (including dev) from the lockfile but does **not** copy application code — mount it as a volume so changes are reflected instantly without rebuilding. Dependencies are always synced on container start — with the uv cache mount this is near-instant when nothing changed, and it ensures the container always has the latest deps matching the mounted code.

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
      - "8000:8000"
    command: ["-m", "myapp", "--reload"]
```

## Best practices applied

- `# syntax=docker/dockerfile:1` — enables BuildKit features
- `ARG` for build-time values (Python version, uv version, registry) — not leaked into final image
- `--mount=type=bind` for lockfiles — no extra layer for dependency installation
- `--mount=type=cache` for uv cache — faster rebuilds
- `/uvx` copied alongside `/uv` — both binaries available
- `UV_COMPILE_BYTECODE=1` — pre-compiles `.pyc` for faster container startup
- `UV_NO_PROGRESS=1` — clean build output
- Non-root user with explicit uid/gid 1001 and `--no-create-home`
- `PYTHONFAULTHANDLER=1` — dumps tracebacks on segfaults
- `PYTHONHASHSEED=random` — prevents hash seed attacks
- `HEALTHCHECK` with configurable interval, timeout, start-period, and retries — override per app via `HC_INTERVAL`, `HC_TIMEOUT`, `HC_START_PERIOD`, `HC_RETRIES`
- OCI image labels (`org.opencontainers.image.*`) — fill in `source` and `licenses`
- `.dockerignore` — excludes `.venv`, secrets, editor files, and build artifacts
- `stage: build` / `stage: runtime` on `install` rules — build tools go in the deps stage only, runtime packages go in the final image only; dev image gets both via `{{ packages }}`
- `ENTRYPOINT` is a shell wrapper (`entrypoint.sh`), not the app binary — runs pre-start tasks configured via `PRE_START`, then `exec "$@"` to hand off to `CMD` with correct signal handling
- `CMD` is the actual application command — overridable per environment without changing the entrypoint
- `PRE_START` / `PRE_START_LOCAL` variables for pre-start hooks — production and local can differ; no manual edits to entrypoint files, so `blueprint check` never flags drift
- Dev entrypoint always syncs dependencies on start — with uv cache mount it's near-instant, ensures deps match mounted code
