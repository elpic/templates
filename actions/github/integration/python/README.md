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
| `APP_NAME` | yes | — | Application name; used in artifact names |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image (e.g. `self-hosted`, `ubuntu-22.04`) |
| `CHECKOUT_VERSION` | no | `v4` | Version of `actions/checkout` to pin |
| `TEST_TASK` | no | `test:coverage` | mise task that runs pytest and writes `coverage.xml` |
| `LINT_TASK` | no | `lint` | mise task for the linter |
| `INTEGRATION_TASK` | no | `test:integration` | mise task for integration tests |
| `SECURITY_TASK` | no | `security` | mise task for the security scan |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows \
  --var APP_NAME=myapp
```
