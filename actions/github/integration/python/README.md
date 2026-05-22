# integration/python

GitHub Actions workflow for Python projects that runs on every PR against `main`.

## Jobs

| Job | Description |
|-----|-------------|
| `test` | Runs pytest, parses `coverage.xml`, posts a coverage diff comment on the PR |
| `lint` | Runs the linter via `mise run lint` (e.g. ruff + mypy) |
| `integration` | Runs integration tests (needs test + lint) |
| `security` | Runs a security scan via `mise run security` (e.g. bandit + safety) |

Coverage is read from `coverage.xml` — produce it with `pytest --cov --cov-report=xml`.

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TEST_TASK` | no | `test` | mise task that runs tests without coverage |
| `TEST_COVERAGE_TASK` | no | `test:coverage` | mise task that runs pytest and writes `coverage.xml` |
| `LINT_TASK` | no | `lint` | mise task for the linter |
| `INTEGRATION_TASK` | no | `test:integration` | mise task for integration tests |
| `SECURITY_TASK` | no | `security` | mise task for the security scan |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |
| `ACTIONS_VERSION` | no | `v1` | Version of elpic/actions composite actions to use |

Each job delegates to [elpic/actions](https://github.com/elpic/actions) composite actions which handle checkout, tooling, and reporting internally.

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows
```
