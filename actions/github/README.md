# GitHub Actions

Composable GitHub Actions workflow templates.

## Available

| Folder | Description |
|--------|-------------|
| [`integration/go/`](integration/go/) | PR integration — tests with `go tool cover`, lint, build + artifact upload, integration tests, security |
| [`integration/python/`](integration/python/) | PR integration — tests with `pytest` + `coverage.xml`, lint, integration tests, security |
| [`blueprint-check/`](blueprint-check/) | PR drift check — fails the PR and posts a comment if rendered files are out of sync with their template |

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
