# GitHub Release Publish Workflow

GitHub Actions workflow that builds your application and creates a GitHub Release with the built artifacts.

Delegates build and publish to `elpic/actions/delivery/github-release` composite actions.

## Jobs

| Job | Description |
|-----|-------------|
| `release-please` | Auto-versions via Release Please (skipped on `workflow_dispatch`) |
| `build` | Builds the app via `mise run build` and uploads as artifact |
| `publish` | Downloads the artifact and creates a GitHub Release with release notes |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that triggers automated publishing |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `BUILD_TASK` | no | `build` | mise task that builds the app |
| `BUILD_OUTPUT` | no | `dist` | Directory containing the built output |
| `RELEASE_PLEASE_CONFIG` | no | `release-please-config.json` | Path to Release Please config |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Usage

### CLI — standalone project

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/github-release \
  --output .github/workflows \
  --var APP_NAME=myapp
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/delivery/github-release
var APP_NAME myapp
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
