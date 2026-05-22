# delivery/docker

GitHub Actions workflow that builds and pushes Docker images to a container registry.

## Auth

The workflow uses `docker/login-action@v3` with `GITHUB_TOKEN` (GHCR) by default. For other registries, override the login step or pass secrets:

**Docker Hub:**
```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

**AWS ECR:**
```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE }}
- name: Login to ECR
  uses: aws-actions/amazon-ecr-login@v2
```

## Jobs

| Job | Description |
|-----|-------------|
| `publish` | Build, tag, and push Docker image via [elpic/actions/delivery/docker/publish](https://github.com/elpic/actions/tree/main/delivery/docker/publish) |

## Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_NAME` | yes | — | Application name; used in image name |
| `REGISTRY` | yes | — | Container registry URL |
| `MAIN_BRANCH` | no | `main` | Branch that triggers publishing |
| `RUNNER` | no | `ubuntu-latest` | GitHub Actions runner image |
| `DOCKERFILE` | no | `Dockerfile` | Path to Dockerfile |
| `BUILD_CONTEXT` | no | `.` | Docker build context |
| `BUILD_TASK` | no | `""` | mise task for pre-build steps |
| `TIMEOUT_MINUTES` | no | `10` | Timeout applied to every job |
| `ACTIONS_VERSION` | no | `v1` | Version of elpic/actions composite actions to use |

## Quick start

```bash
blueprint render setup.bp \
  --template @github:elpic/templates@main:actions/github/delivery/docker \
  --output .github/workflows \
  --var APP_NAME=myapp \
  --var REGISTRY=ghcr.io/myorg
```
