# Containers

Dockerfile templates for production and local development. Each folder contains:
- A `setup.bp` blueprint — single source of truth for versions and variables
- A `Dockerfile.tmpl` — production-ready, multi-stage, follows best practices
- A `Dockerfile.local.tmpl` — development variant with volume-mounted code
- A `README.md` — variables reference and usage

All templates are rendered with [blueprint](https://github.com/elpic/blueprint):

```bash
blueprint render setup.bp --template Dockerfile.tmpl --var APP_NAME=myapp --output Dockerfile
blueprint render setup.bp --template Dockerfile.local.tmpl --var APP_NAME=myapp --output Dockerfile.local
blueprint check setup.bp --template Dockerfile.tmpl --against Dockerfile --var APP_NAME=myapp
```

## Available Templates

| Template | Language / Stack | Description |
|----------|-----------------|-------------|
| [`python/`](python/) | Python | Multi-stage production image, non-root user, dev variant with volumes |
