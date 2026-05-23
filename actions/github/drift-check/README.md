# Drift Check

GitHub Actions workflow that runs `blueprint check` on every PR to detect drift between templates and their rendered output files.

Delegates to `elpic/actions/github/drift-check` composite action — no inline checkout, install, or comment management.

Supports checking multiple blueprints in a single workflow via the `CHECKS` JSON array variable.

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CHECKS` | yes | — | JSON array of checks: `[{"file":"...","template":"...","against":"..."}]` |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `ACTIONS_VERSION` | no | `v2` | Version of `elpic/actions` composite actions |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TIMEOUT_MINUTES` | no | `10` | Job timeout |

## Usage

### Single check

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/drift-check \
  --output .github/workflows \
  --var CHECKS='[{"file":"setup.bp","template":"@github:elpic/templates@main:containers/python","against":"."}]'
```

### Multiple checks

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/drift-check \
  --output .github/workflows \
  --var CHECKS='[{"file":"setup.bp","template":"@github:...","against":"."},{"file":"integration.bp","template":"@github:...","against":".github/workflows"}]'
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/drift-check
var CHECKS [{"file":"setup.bp","template":"@github:elpic/templates@main:containers/python","against":"."}]
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```

### Defining checks in setup.bp directly

You can also define `CHECKS` as a `var` in your own `setup.bp` so you don't need to pass it every time:

```bp
var CHECKS [{"file":"setup.bp","template":"@github:elpic/templates@main:containers/python","against":"."}]
```

Then just run:

```bash
blueprint render setup.bp --template @github:elpic/templates@main:actions/github/drift-check --output .github/workflows
```
