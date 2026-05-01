# Python

Multi-stage production Dockerfile and a dev variant for Python projects. Both are rendered from a single `setup.bp` blueprint — Python version and runtime packages are defined once and flow into every generated file.

## Files

| File | Purpose |
|------|---------|
| `setup.bp` | Blueprint — Python version, runtime packages, required variables |
| `Dockerfile.tmpl` | Production — two-stage, non-root user, minimal final image |
| `Dockerfile.local.tmpl` | Development — single stage, volume-mounted code, dev deps included |
| `.dockerignore` | Excludes venv, cache, secrets, and editor files from build context |

## Variables

Variables are resolved in this order: `--var` flag → `var` in `setup.bp` → template default.

| Variable | Required | Template default | Description |
|----------|----------|-----------------|-------------|
| `APP_NAME` | **yes** | — | Python module used as entrypoint (`python -m <APP_NAME>`) |
| `REGISTRY` | no | `docker.io` | Container registry prefix |
| `WORKDIR` | no | `/app` | Working directory inside the container |
| `PORT` | no | `8000` | Port exposed by the application |
| `ENTRYPOINT` | no | `python` | Entrypoint binary (`python`, `gunicorn`, `uvicorn`, …) |
| `UV_VERSION` | no | `latest` | uv version — pin for reproducible builds (e.g. `0.4.0`) |

Python version comes from `mise python@x.y.z` in `setup.bp` — rendered as a build `ARG`, not an `ENV`, so it does not leak into the final image.

## Usage

**1. Copy this folder into your project.**

**2. Update `setup.bp`:**
- Set the Python version in `mise python@x.y.z`
- Add runtime system packages to `install ... on: [linux]`
- Uncomment any optional vars you want to pin project-wide

**3. Render:**

```bash
# Production
blueprint render setup.bp --template Dockerfile.tmpl \
  --var APP_NAME=myapp --output Dockerfile

# Development
blueprint render setup.bp --template Dockerfile.local.tmpl \
  --var APP_NAME=myapp --output Dockerfile.local
```

**4. Override variables at render time:**

```bash
blueprint render setup.bp --template Dockerfile.tmpl \
  --var APP_NAME=myapp \
  --var REGISTRY=ghcr.io \
  --var PORT=9000 \
  --var ENTRYPOINT=gunicorn \
  --var UV_VERSION=0.4.0 \
  --output Dockerfile
```

**5. Check for drift in CI:**

```yaml
- name: Check Dockerfile is up to date
  run: |
    blueprint check setup.bp \
      --template Dockerfile.tmpl \
      --against Dockerfile \
      --var APP_NAME=myapp
```

## Production Dockerfile — what it does

**Stage 1 (deps):** Installs only production dependencies via `uv sync --frozen --no-dev`. Lockfiles are bind-mounted (not copied) so they don't create an extra layer. This stage is fully cached until `pyproject.toml` or `uv.lock` changes.

**Stage 2 (runtime):** Starts from a fresh base image. Installs only runtime system packages. Creates a non-root user (`app:app`, uid/gid 1001). Copies the `.venv` from the deps stage and the application code. No uv, no build tools, no cache in the final image.

Python version and uv version are passed as build `ARG`s — they do not appear in `docker inspect` on the final image.

## Development Dockerfile — what it does

Single stage. Installs all dependencies (including dev) from the lockfile but does **not** copy application code — mount it as a volume so changes are reflected instantly without rebuilding.

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
- `HEALTHCHECK` with `--start-period=120s` — accounts for migrations and warm-up
- OCI image labels (`org.opencontainers.image.*`) — fill in `source` and `licenses`
- `.dockerignore` — excludes `.venv`, secrets, editor files, and build artifacts
