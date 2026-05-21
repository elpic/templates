# python

Python-related GitHub Actions workflow templates.

## Available

| Folder | Description |
|--------|-------------|
| [`publish/`](publish/) | PyPI release — Release Please versioning, build, and publish with Trusted Publishing (OIDC) |

## Quick start

```bash
# PyPI release
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/python/publish \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var PYPI_PROJECT_NAME=my-pypi-package
```
