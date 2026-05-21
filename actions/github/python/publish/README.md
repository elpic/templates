# python/publish

GitHub Actions workflow that releases Python packages to PyPI.

Runs on every push to `main` (Release Please auto-versions) and on `workflow_dispatch` for manual publishing.

## Jobs

| Job | Description |
|-----|-------------|
| `release-please` | Auto-versions via conventional commits (skipped on `workflow_dispatch`) |
| `build` | Builds the package wheel and uploads as artifact via [elpic/actions/delivery/pypi/build](https://github.com/elpic/actions/tree/main/delivery/pypi/build) |
| `publish` | Publishes to PyPI with Trusted Publishing via [elpic/actions/delivery/pypi/publish](https://github.com/elpic/actions/tree/main/delivery/pypi/publish) |

Uses [Trusted Publishing (OIDC)](https://docs.pypi.org/trusted-publishers/) — no API tokens needed. Configure in PyPI by adding this repo with workflow name **Publish**.

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `PYPI_PROJECT_NAME` | yes | — | PyPI project name (used in the published package URL) |
| `MAIN_BRANCH` | no | `main` | Branch that triggers automated publishing |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `BUILD_TASK` | no | `build` | mise task that builds the package wheel |
| `PYPI_PACKAGE_DIR` | no | `dist` | Directory containing built artifacts (relative to repo root) |
| `PYPI_ENVIRONMENT` | no | `pypi` | GitHub deployment environment name |
| `RELEASE_PLEASE_CONFIG` | no | `release-please-config.json` | Path to Release Please config file |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

Your `mise run build` script receives `DEV_BUILD` and `RELEASE_VERSION` env vars from the composite action. See [elpic/actions/delivery/pypi/build](https://github.com/elpic/actions/tree/main/delivery/pypi/build) for details.

## Versioning

| Commit type | Bump | Example |
|-------------|------|---------|
| `fix:` | patch | `v1.0.0` → `v1.0.1` |
| `feat:` | minor | `v1.0.0` → `v1.1.0` |
| `BREAKING CHANGE:` or `feat!:`, `fix!:` | major | `v1.0.0` → `v2.0.0` |

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/python/publish \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package
```
