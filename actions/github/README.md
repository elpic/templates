# GitHub Actions

Blueprint workflow templates that delegate to [elpic/actions](https://github.com/elpic/actions) composite actions.

## Available

### Integration (CI)

| Folder | Language | Description |
|--------|----------|-------------|
| [`integration/go/`](integration/go/) | Go | test, lint, build, integration, security |
| [`integration/node/`](integration/node/) | Node.js | test, lint, build, integration, security |
| [`integration/python/`](integration/python/) | Python | test, lint, integration, security |

### Delivery (CD)

| Folder | Registry | Description |
|--------|----------|-------------|
| [`delivery/docker/`](delivery/docker/) | Docker | Build and push images to any container registry |
| [`python/publish/`](python/publish/) | PyPI | Version, build, and publish Python packages |

### Utilities

| Folder | Description |
|--------|-------------|
| [`blueprint-check/`](blueprint-check/) | Blueprint drift check on PRs |

## Usage

```bash
# Go integration
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/go \
  --output .github/workflows \
  --var APP_NAME=myapp

# Node.js integration
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/node \
  --output .github/workflows \
  --var APP_NAME=myapp

# Python integration
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/integration/python \
  --output .github/workflows

# Docker delivery
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/docker \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var REGISTRY=ghcr.io/myorg

# PyPI publish
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/python/publish \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package

# Blueprint drift check
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/blueprint-check \
  --output .github/workflows \
  --var BLUEPRINT_FILE=setup.bp \
  --var TEMPLATE=. \
  --var AGAINST=.
```
