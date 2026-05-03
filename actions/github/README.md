# GitHub Actions

Composable GitHub Actions workflow templates.

## Available

| Folder | Language | Description |
|--------|----------|-------------|
| [`integration/go/`](integration/go/) | Go | Tests with `go tool cover`, lint, build + artifact upload, integration tests, security |
| [`integration/python/`](integration/python/) | Python | Tests with `pytest` + `coverage.xml`, lint, integration tests, security |

## Usage

```bash
# Go — render into your project
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/go \
  --output .github/workflows \
  --var APP_NAME=myapp

# Python — render into your project
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows \
  --var APP_NAME=myapp
```
