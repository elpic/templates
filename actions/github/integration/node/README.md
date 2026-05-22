# integration/node

GitHub Actions workflow for Node.js/TypeScript projects that runs on every PR against `main`.

## Jobs

| Job | Description |
|-----|-------------|
| `test` | Runs tests, generates coverage, posts a coverage comment on the PR |
| `lint` | Runs the linter via `mise run lint` (ESLint, Prettier) |
| `build` | Builds the app and uploads it as an artifact |
| `integration` | Downloads the built artifact and runs integration tests |
| `security` | Runs `npm audit` and security scans via `mise run security` |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TEST_TASK` | no | `test` | mise task that runs tests without coverage |
| `TEST_COVERAGE_TASK` | no | `test:coverage` | mise task that runs tests with coverage |
| `LINT_TASK` | no | `lint` | mise task for the linter |
| `BUILD_TASK` | no | `build` | mise task that builds the app |
| `INTEGRATION_TASK` | no | `test:integration` | mise task for integration tests |
| `SECURITY_TASK` | no | `security` | mise task for security scans |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |
| `ACTIONS_VERSION` | no | `v1` | Version of elpic/actions composite actions to use |

Each job delegates to [elpic/actions](https://github.com/elpic/actions) composite actions.

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/node \
  --output .github/workflows \
  --var APP_NAME=myapp
```
