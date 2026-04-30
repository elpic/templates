# Python + uv

Multi-stage production Dockerfile and a dev variant for Python projects using [uv](https://github.com/astral-sh/uv) as the package manager.

## Files

| File | Purpose |
|------|---------|
| `setup.bp` | Blueprint — single source of truth for versions and variables |
| `Dockerfile.tmpl` | Production — multi-stage, non-root user, minimal final image |
| `Dockerfile.local.tmpl` | Development — single stage, volume-mounted code |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Python module used as entrypoint (`python -m <APP_NAME>`) |
| `REGISTRY` | no | `docker.io` | Container registry prefix |
| `WORKDIR` | no | `/app` | Working directory inside the container |
| `PORT` | no | `8000` | Port exposed by the application |
| `ENTRYPOINT` | no | `python` | Entrypoint binary (`python`, `gunicorn`, `uvicorn`, …) |
| `UV_VERSION` | no | `latest` | uv version to pin (`latest` or e.g. `0.4.0`) |

Python version is read from the `mise python@x.y.z` line in `setup.bp` — no separate variable needed.

## Usage

**1. Update `setup.bp`** with your Python version and system packages.

**2. Render:**

```bash
# Production
blueprint render setup.bp --template Dockerfile.tmpl \
  --var APP_NAME=myapp \
  --output Dockerfile

# Development
blueprint render setup.bp --template Dockerfile.local.tmpl \
  --var APP_NAME=myapp \
  --output Dockerfile.local
```

**3. Override any variable at render time:**

```bash
blueprint render setup.bp --template Dockerfile.tmpl \
  --var APP_NAME=myapp \
  --var REGISTRY=ghcr.io \
  --var PORT=9000 \
  --var ENTRYPOINT=gunicorn \
  --var UV_VERSION=0.4.0 \
  --output Dockerfile
```

**4. Check for drift in CI:**

```yaml
- name: Check Dockerfile is up to date
  run: |
    blueprint check setup.bp \
      --template Dockerfile.tmpl \
      --against Dockerfile \
      --var APP_NAME=myapp
```

## Production Dockerfile — what it does

1. **Stage 1 (deps)** — installs only non-dev dependencies into `.venv` using the lockfile. This layer is cached until `pyproject.toml` or `uv.lock` changes.
2. **Stage 2 (build)** — copies deps from stage 1, adds app code, runs full `uv sync`.
3. **Stage 3 (runtime)** — copies only `.venv` and app code from the build stage. No uv, no build tools, no cache in the final image. Runs as a non-root user (`app:app`, uid/gid 1001).

## Development Dockerfile — what it does

Single stage. Installs dependencies from the lockfile but does **not** copy the application code — mount it as a volume in `docker-compose.yml` so changes are reflected instantly without rebuilding.

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
```
