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

| Category | Folder | Description |
|----------|--------|-------------|
| Containers | [`containers/python/`](containers/python/) | Python multi-stage production + dev Dockerfiles |
| Actions | [`actions/github/`](actions/github/) | Composable GitHub Actions workflows |

## Requirements

- [blueprint](https://github.com/elpic/blueprint) — `curl -fsSL https://install.getbp.dev | sh`
