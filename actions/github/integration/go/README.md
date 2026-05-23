# Go Integration Workflow

GitHub Actions workflow for Go projects that runs on every PR against `main`.

Delegates test, lint, integration, and security to `elpic/actions/integration/go` composite actions. Only the build step is inline (it uploads the binary as an artifact).

## Jobs

| Job | Description |
|-----|-------------|
| `test` | Runs tests with coverage, posts a coverage diff comment on the PR |
| `lint` | Runs the linter via `mise run lint` |
| `build` | Builds the binary and uploads it as an artifact |
| `integration` | Downloads the built artifact and runs integration tests (needs test + lint + build) |
| `security` | Runs a security scan via `mise run security` |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `SETUP` | no | `mise` | Tool setup method (`mise`, `bash`, `just`, `node`, `none`) |
| `TEST_TASK` | no | `test:coverage` | mise task that runs tests and writes `coverage.out` |
| `LINT_TASK` | no | `lint` | mise task for the linter |
| `BUILD_TASK` | no | `build` | mise task that builds the binary |
| `INTEGRATION_TASK` | no | `test:integration` | mise task for integration tests |
| `SECURITY_TASK` | no | `security` | mise task for security scans |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Usage

### CLI — standalone project

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/go \
  --output .github/workflows \
  --var APP_NAME=myapp
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/integration/go
var APP_NAME myapp
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
