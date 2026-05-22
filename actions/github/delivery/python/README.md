# Python Package Publish Workflow

GitHub Actions workflow that builds and publishes Python packages to PyPI, GitHub Packages, or JFrog Artifactory.

Delegates build and publish to `elpic/actions/delivery/python` composite actions.

## Jobs

| Job | Description |
|-----|-------------|
| `release-please` | Auto-versions via Release Please (skipped on `workflow_dispatch`) |
| `build` | Builds the package wheel via `mise run build` and uploads as artifact |
| `publish` | Downloads the artifact and publishes to the configured registry |

## Supported Registries

| Registry | Auth | Requires |
|----------|------|----------|
| `pypi` | Trusted Publishing (OIDC) | PyPI project configured for OIDC |
| `github` | Built-in `GITHUB_TOKEN` | `packages: write` permission |
| `jfrog` | API token (secrets) | `JFROG_URL`, `JFROG_USER`, `JFROG_TOKEN` secrets |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `PYPI_PROJECT_NAME` | yes | — | PyPI project name (used in the published package URL) |
| `REGISTRY` | no | `pypi` | Target registry: `pypi`, `github`, or `jfrog` |
| `MAIN_BRANCH` | no | `main` | Branch that triggers automated publishing |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `BUILD_TASK` | no | `build` | mise task that builds the package wheel |
| `PACKAGE_DIR` | no | `dist` | Directory containing built artifacts |
| `ENVIRONMENT` | no | matches `REGISTRY` | GitHub deployment environment name |
| `RELEASE_PLEASE_CONFIG` | no | `release-please-config.json` | Path to Release Please config |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Usage

### CLI — standalone project (PyPI)

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/python \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package
```

### CLI — standalone project (GitHub Packages)

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/python \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package \
  --var REGISTRY=github
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/delivery/python
var APP_NAME myapp
var PYPI_PROJECT_NAME my-pypi-package
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
