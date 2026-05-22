# blueprint-check

GitHub Actions workflow that runs `blueprint check` on every PR to detect drift between a template and its rendered output files.

Fails the PR if any rendered file is out of sync with its template, and posts (or updates) a comment explaining what drifted and how to fix it. The comment is automatically removed once drift is resolved.

Delegates to [elpic/actions/github/blueprint-check](https://github.com/elpic/actions/tree/main/github/blueprint-check) which handles checkout, blueprint install, check, and comment management internally.

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BLUEPRINT_FILE` | yes | — | Path to the `.bp` file inside the repo (e.g. `setup.bp`) |
| `TEMPLATE` | yes | — | Template path or `@github:` shorthand (e.g. `@github:elpic/templates@main:containers/python`) |
| `AGAINST` | yes | — | Directory or file to check against (e.g. `.` or `src/`) |
| `MAIN_BRANCH` | no | `main` | Branch that PRs target |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `TIMEOUT_MINUTES` | no | `5` | Job timeout |
| `ACTIONS_VERSION` | no | `v1` | Version of elpic/actions composite actions to use |

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/blueprint-check \
  --output .github/workflows \
  --var BLUEPRINT_FILE=setup.bp \
  --var TEMPLATE=@github:elpic/templates@main:containers/python \
  --var AGAINST=.
```
