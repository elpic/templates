# Blueprint Drift Check

GitHub Actions workflow that runs `blueprint check` on every PR to detect drift between a template and its rendered output files.

Delegates to `elpic/actions/github/blueprint-check` composite action — no inline checkout, install, or comment management.

Fails the PR if any rendered file is out of sync with its template, and posts (or updates) a comment explaining what drifted and how to fix it. The comment is automatically removed once drift is resolved.

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BLUEPRINT_FILE` | yes | — | Path to the `.bp` file inside the repo (e.g. `setup.bp`) |
| `TEMPLATE` | yes | — | Template path or `@github:` shorthand (e.g. `@github:elpic/templates@main:containers/python`) |
| `AGAINST` | yes | — | Directory or file to check against (e.g. `.` or `src/`) |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TIMEOUT_MINUTES` | no | `5` | Job timeout |

## Usage

### CLI — standalone project

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/blueprint-check \
  --output .github/workflows \
  --var BLUEPRINT_FILE=setup.bp \
  --var TEMPLATE=@github:elpic/templates@main:containers/python \
  --var AGAINST=.
```

### In another `.bp` file

```bp
template @github:elpic/templates@main:actions/github/blueprint-check
var BLUEPRINT_FILE setup.bp
var TEMPLATE @github:elpic/templates@main:containers/python
var AGAINST .
```

Then render:

```bash
blueprint render setup.bp --output .github/workflows
```
