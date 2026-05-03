# integration

GitHub Actions integration workflow templates, organised by language.

## Available

| Folder | Language | Description |
|--------|----------|-------------|
| [`go/`](go/) | Go | Tests with `go tool cover`, lint, build + artifact upload, integration tests, security |
| [`python/`](python/) | Python | Tests with `pytest` + `coverage.xml`, lint (ruff/mypy), integration tests, security (bandit/safety) |

## Quick start

```bash
# Go
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/go \
  --output .github/workflows \
  --var APP_NAME=myapp

# Python
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows \
  --var APP_NAME=myapp
```
