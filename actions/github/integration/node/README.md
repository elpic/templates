# integration/node

GitHub Actions workflow for Node.js / TypeScript projects that runs on every PR against `main`.

Delegates all job logic to `elpic/actions` composite actions — no inline checkout, mise, or coverage scripts.

## Jobs

| Job | Description |
|-----|-------------|
| `test` | Runs tests with coverage, posts a coverage diff comment on the PR |
| `lint` | ESLint / Prettier via `mise run lint` |
| `build` | Builds the app and uploads `dist/` as an artifact |
| `integration` | Downloads the build artifact and runs integration tests (needs test + lint + build) |
| `security` | npm audit / Trivy via `mise run security` |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image (e.g. `self-hosted`, `ubuntu-22.04`) |
| `TEST_TASK` | no | `test` | mise task for tests without coverage |
| `TEST_COVERAGE_TASK` | no | `test:coverage` | mise task for tests with coverage |
| `LINT_TASK` | no | `lint` | mise task for ESLint / Prettier |
| `BUILD_TASK` | no | `build` | mise task that builds the app |
| `INTEGRATION_TASK` | no | `test:integration` | mise task for integration tests |
| `SECURITY_TASK` | no | `security` | mise task for npm audit / Trivy |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Usage

### CLI — standalone project

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/node \
  --output .github/workflows \
  --var APP_NAME=myapp
```

### In another `.bp` file

Reference this template from your own `setup.bp` using the `template` directive:

```bp
template @github:elpic/templates@main:actions/github/integration/node
var APP_NAME myapp
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
