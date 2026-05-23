# Templates

A collection of reusable templates for containers and CI/CD workflows, rendered with [blueprint](https://github.com/elpic/blueprint).

## How it works

Each template folder contains a `setup.bp` blueprint that declares versions and variables, plus one or more template files. You render them with blueprint to produce the final file:

```bash
blueprint render setup.bp --template Dockerfile.tmpl --var APP_NAME=myapp --output Dockerfile
```

Variables with defaults can be omitted. Required variables (no default) must be passed via `--var`. When Python bumps from 3.12 to 3.13, you update `setup.bp` and re-render — one change, every file stays in sync.

Use `blueprint check` in CI to catch drift:

```bash
blueprint check setup.bp --template Dockerfile.tmpl --against Dockerfile --var APP_NAME=myapp
# exits 0 → in sync
# exits 1 → drifted, shows diff and fix command
```

## Index

### Containers

| Template | Description |
|----------|-------------|
| [`containers/python/`](containers/python/) | Python multi-stage production + dev Dockerfiles |

### GitHub Actions

| Template | Description |
|----------|-------------|
| [`actions/github/integration/go/`](actions/github/integration/go/) | Go PR integration — tests, lint, build, integration tests, security |
| [`actions/github/integration/node/`](actions/github/integration/node/) | Node.js PR integration — tests, lint, build, integration tests, security |
| [`actions/github/integration/python/`](actions/github/integration/python/) | Python PR integration — tests, lint, integration tests, security |
| [`actions/github/delivery/python/`](actions/github/delivery/python/) | Python package publish — build and publish to PyPI, GitHub Packages, or JFrog |
| [`actions/github/delivery/github-release/`](actions/github/delivery/github-release/) | GitHub Release — build and create a release with artifacts and release notes |
| [`actions/github/drift-check/`](actions/github/drift-check/) | PR drift check — detects when rendered files are out of sync. Supports multiple blueprints per workflow. |

## Requirements

- [blueprint](https://github.com/elpic/blueprint) — `curl -fsSL https://install.getbp.dev | sh`
