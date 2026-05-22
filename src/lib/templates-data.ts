export const REPO_URL = "https://github.com/elpic/templates";
export const SITE_URL = "https://elpic.github.io/templates";

export type TemplateVar = {
  name: string;
  required: boolean;
  default: string | null;
  description: string;
};

export type TemplateDef = {
  slug: string;
  path: string;
  category: "containers" | "actions";
  subcategory: string | null;
  name: string;
  tagline: string;
  description: string;
  blurb: string;
  files: { name: string; purpose: string }[];
  vars: TemplateVar[];
};

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "containers-python",
    path: "containers/python",
    category: "containers",
    subcategory: null,
    name: "Python Container",
    tagline: "Multi-stage production + dev Dockerfiles for Python",
    description:
      "Production-grade two-stage Dockerfile and a dev variant for Python projects. Rendered from a single blueprint — Python version and runtime packages flow into every generated file.",
    blurb:
      "Two-stage prod image with non-root user, BuildKit cache mounts, uv-based deps, and a wrapper entrypoint that handles pre-start tasks.",
    files: [
      { name: "Dockerfile.tmpl", purpose: "Production — two-stage, non-root, minimal final image" },
      { name: "Dockerfile.local.tmpl", purpose: "Development — single stage, volume-mounted code" },
      { name: "entrypoint.sh.tmpl", purpose: "Production entrypoint — runs pre-start tasks then execs CMD" },
      { name: "local-entrypoint.sh.tmpl", purpose: "Dev entrypoint — installs deps then execs CMD" },
      { name: ".dockerignore.tmpl", purpose: "Excludes venv, cache, secrets, editor files" },
      { name: "setup.bp", purpose: "Blueprint — Python version, packages, variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Python module used as the app command (python -m <APP_NAME>)" },
      { name: "REGISTRY", required: false, default: "docker.io", description: "Container registry prefix" },
      { name: "WORKDIR", required: false, default: "/app", description: "Working directory inside the container" },
      { name: "PORT", required: false, default: "8000", description: "Port exposed by the application" },
      { name: "UV_VERSION", required: false, default: "latest", description: "uv version — pin for reproducible builds" },
    ],
  },
  {
    slug: "actions-github-blueprint-check",
    path: "actions/github/blueprint-check",
    category: "actions",
    subcategory: "github",
    name: "Blueprint Drift Check",
    tagline: "Detect drift between a template and its rendered files on every PR",
    description:
      "GitHub Actions workflow that runs `blueprint check` on every PR. Fails the PR if any rendered file is out of sync and posts a comment explaining the drift. Comment auto-removes when resolved.",
    blurb:
      "Delegates to elpic/actions/github/blueprint-check which handles checkout, blueprint install, check, and comment management.",
    files: [
      { name: "blueprint-check.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "BLUEPRINT_FILE", required: true, default: null, description: "Path to the .bp file inside the repo (e.g. setup.bp)" },
      { name: "TEMPLATE", required: true, default: null, description: "Template path or @github: shorthand" },
      { name: "AGAINST", required: true, default: null, description: "Directory or file to check against (e.g. . or src/)" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that PRs target" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "TIMEOUT_MINUTES", required: false, default: "5", description: "Job timeout" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-delivery-docker",
    path: "actions/github/delivery/docker",
    category: "actions",
    subcategory: "github",
    name: "Docker Delivery",
    tagline: "Build and push Docker images to a container registry",
    description:
      "GitHub Actions workflow that builds, tags, and pushes Docker images to GHCR, Docker Hub, ECR, or any OCI registry on every push to main.",
    blurb:
      "Uses docker/login-action@v3 with GITHUB_TOKEN by default. Override the login step for other registries.",
    files: [
      { name: "delivery.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in image name" },
      { name: "REGISTRY", required: true, default: null, description: "Container registry URL" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that triggers publishing" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "DOCKERFILE", required: false, default: "Dockerfile", description: "Path to Dockerfile" },
      { name: "BUILD_CONTEXT", required: false, default: ".", description: "Docker build context" },
      { name: "BUILD_TASK", required: false, default: "", description: "mise task for pre-build steps" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-integration-go",
    path: "actions/github/integration/go",
    category: "actions",
    subcategory: "github",
    name: "Go Integration",
    tagline: "PR integration workflow for Go projects",
    description:
      "GitHub Actions workflow for Go projects that runs on every PR. Test with coverage diff, lint, build artifact, integration tests, and security scan.",
    blurb:
      "Five jobs: test, lint, build, integration, security. Each delegates to an elpic/actions composite step.",
    files: [
      { name: "integration.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in artifact names" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that PRs target" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "TEST_TASK", required: false, default: "test:coverage", description: "mise task that runs tests and writes coverage.out" },
      { name: "LINT_TASK", required: false, default: "lint", description: "mise task for the linter" },
      { name: "BUILD_TASK", required: false, default: "build", description: "mise task that builds the binary" },
      { name: "INTEGRATION_TASK", required: false, default: "test:integration", description: "mise task for integration tests" },
      { name: "SECURITY_TASK", required: false, default: "security", description: "mise task for security scans" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-integration-node",
    path: "actions/github/integration/node",
    category: "actions",
    subcategory: "github",
    name: "Node Integration",
    tagline: "PR integration workflow for Node.js / TypeScript",
    description:
      "GitHub Actions workflow for Node.js/TypeScript projects that runs on every PR. Test with coverage, ESLint/Prettier, build artifact, integration tests, and npm audit + security scan.",
    blurb:
      "Five jobs: test, lint, build, integration, security. Each delegates to elpic/actions composite steps.",
    files: [
      { name: "integration.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in artifact names" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that PRs target" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "TEST_TASK", required: false, default: "test", description: "mise task that runs tests without coverage" },
      { name: "TEST_COVERAGE_TASK", required: false, default: "test:coverage", description: "mise task that runs tests with coverage" },
      { name: "LINT_TASK", required: false, default: "lint", description: "mise task for the linter" },
      { name: "BUILD_TASK", required: false, default: "build", description: "mise task that builds the app" },
      { name: "INTEGRATION_TASK", required: false, default: "test:integration", description: "mise task for integration tests" },
      { name: "SECURITY_TASK", required: false, default: "security", description: "mise task for security scans" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-integration-python",
    path: "actions/github/integration/python",
    category: "actions",
    subcategory: "github",
    name: "Python Integration",
    tagline: "PR integration workflow for Python projects",
    description:
      "GitHub Actions workflow for Python projects that runs on every PR. pytest with coverage diff comment, ruff + mypy lint, integration tests, and bandit + safety security scan.",
    blurb:
      "Coverage read from coverage.xml — produce it with pytest --cov --cov-report=xml.",
    files: [
      { name: "integration.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that PRs target" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "TEST_TASK", required: false, default: "test", description: "mise task that runs tests without coverage" },
      { name: "TEST_COVERAGE_TASK", required: false, default: "test:coverage", description: "mise task that runs pytest and writes coverage.xml" },
      { name: "LINT_TASK", required: false, default: "lint", description: "mise task for the linter" },
      { name: "INTEGRATION_TASK", required: false, default: "test:integration", description: "mise task for integration tests" },
      { name: "SECURITY_TASK", required: false, default: "security", description: "mise task for the security scan" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-delivery-pages",
    path: "actions/github/delivery/pages",
    category: "actions",
    subcategory: "github",
    name: "GitHub Pages Deploy",
    tagline: "Build a static site and deploy to GitHub Pages",
    description:
      "GitHub Actions workflow that builds a static site (Vite, Astro, Hugo, Jekyll, TanStack Start, etc.) and deploys it to GitHub Pages.",
    blurb:
      "Delegates to elpic/actions/delivery/pages/publish which handles configure-pages, build, upload-artifact, and deploy-pages internally.",
    files: [
      { name: "delivery.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "BUILD_COMMAND", required: true, default: null, description: "Command to build the site (e.g. npm run build, bun run build)" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that triggers deployment" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "SETUP_COMMAND", required: false, default: "npm ci", description: "Command to run before build" },
      { name: "OUTPUT_DIRECTORY", required: false, default: "dist", description: "Directory with built static files" },
      { name: "BASE_PATH", required: false, default: "", description: "Base path override (inferred from repo name)" },
      { name: "TIMEOUT_MINUTES", required: false, default: "15", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
  {
    slug: "actions-github-python-publish",
    path: "actions/github/python/publish",
    category: "actions",
    subcategory: "github",
    name: "Python Publish (PyPI)",
    tagline: "Release Python packages to PyPI with Trusted Publishing",
    description:
      "GitHub Actions workflow that releases Python packages to PyPI using Trusted Publishing (OIDC). Runs on every push to main (auto-versioned via Release Please) and on workflow_dispatch.",
    blurb:
      "No API tokens needed — configure Trusted Publishing in PyPI by adding this repo with workflow name 'Publish'.",
    files: [
      { name: "publish.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in artifact names" },
      { name: "PYPI_PROJECT_NAME", required: true, default: null, description: "PyPI project name (used in the published package URL)" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that triggers automated publishing" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "BUILD_TASK", required: false, default: "build", description: "mise task that builds the package wheel" },
      { name: "PYPI_PACKAGE_DIR", required: false, default: "dist", description: "Directory containing built artifacts" },
      { name: "PYPI_ENVIRONMENT", required: false, default: "pypi", description: "GitHub deployment environment name" },
      { name: "RELEASE_PLEASE_CONFIG", required: false, default: "release-please-config.json", description: "Path to Release Please config file" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
      { name: "ACTIONS_VERSION", required: false, default: "v1", description: "Version of elpic/actions composite actions" },
    ],
  },
];

export function getTemplate(slug: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function templateRepoUrl(t: TemplateDef): string {
  return `${REPO_URL}/tree/main/${t.path}`;
}

export function templateShorthand(t: TemplateDef): string {
  return `@github:elpic/templates@main:${t.path}`;
}
