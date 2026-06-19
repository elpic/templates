# Tauri Integration Workflow

GitHub Actions workflow for [Tauri](https://v2.tauri.app) v2 projects that runs on every PR against `main`.

Builds on both Ubuntu and macOS, pins Node.js and Rust via mise, and runs all checks in one job.

## Jobs

| Job | Description |
|-----|-------------|
| `build` | Matrix build (ubuntu + macos): type check, frontend build, cargo check, clippy, tests |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TIMEOUT_MINUTES` | no | `15` | Per-job timeout |

## Usage

### CLI — standalone project

```
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/tauri \
  --output .github/workflows \
  --var APP_NAME=pulsetray
```
