# GitHub Actions

Composable GitHub Actions workflow templates.

## Available

| Folder | Description |
|--------|-------------|
| [`integration/`](integration/) | PR integration workflow — tests, coverage diff, lint, build, integration tests, security |

## Usage

```bash
# Render into your project
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration \
  --output .github/workflows \
  --var APP_NAME=myapp

# Check for drift
blueprint check setup.bp \
  --template @github:elpic/templates@main:actions/github/integration \
  --against .github/workflows \
  --var APP_NAME=myapp
```
