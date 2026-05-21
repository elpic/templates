# GitHub Actions

Blueprint workflow templates that delegate to [elpic/actions](https://github.com/elpic/actions) composite actions.

## Available

| Folder | Description |
|--------|-------------|
| [`integration/go/`](integration/go/) | Go CI — test, lint, build, integration, security |
| [`integration/python/`](integration/python/) | Python CI — test, lint, integration, security |
| [`blueprint-check/`](blueprint-check/) | Blueprint drift check on PRs |
| [`python/publish/`](python/publish/) | PyPI release — versioning, build, publish |

## Usage

```bash
# Go integration
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/go \
  --output .github/workflows \
  --var APP_NAME=myapp

# Python integration
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows

# Blueprint drift check
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/blueprint-check \
  --output .github/workflows \
  --var BLUEPRINT_FILE=setup.bp \
  --var TEMPLATE=. \
  --var AGAINST=.

# PyPI publish
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/python/publish \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package
```
