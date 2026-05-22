# PyPI Publish Workflow

GitHub Actions workflow that builds and publishes Python packages to PyPI using Trusted Publishing (OIDC).

Delegates build and publish to `elpic/actions/delivery/pypi` composite actions.

## Jobs

| Job | Description |
|-----|-------------|
| `release-please` | Auto-versions via Release Please (skipped on `workflow_dispatch`) |
| `build` | Builds the package wheel via `mise run build` and uploads as artifact |
| `publish` | Downloads the artifact and publishes to PyPI via Trusted Publishing |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `PYPI_PROJECT_NAME` | yes | — | PyPI project name (used in the published package URL) |
| `MAIN_BRANCH` | no | `main` | Branch that triggers automated publishing |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `BUILD_TASK` | no | `build` | mise task that builds the package wheel |
| `PYPI_PACKAGE_DIR` | no | `dist` | Directory containing built artifacts |
| `PYPI_ENVIRONMENT` | no | `pypi` | GitHub deployment environment name |
| `RELEASE_PLEASE_CONFIG` | no | `release-please-config.json` | Path to Release Please config |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Usage

### CLI — standalone project

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/pypi \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/delivery/pypi
var APP_NAME myapp
var PYPI_PROJECT_NAME my-pypi-package
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
