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
      "Production-grade two-stage Dockerfile and a dev variant for Python projects, rendered from a single blueprint that drives Python version and packages.",
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
    slug: "containers-typescript",
    path: "containers/typescript",
    category: "containers",
    subcategory: null,
    name: "TypeScript Container",
    tagline: "Multi-stage production + dev Dockerfiles for Node.js / TypeScript",
    description:
      "Production-grade two-stage Dockerfile and a dev variant for Node.js/TypeScript projects, rendered from a single blueprint that drives Node version and runtime command.",
    blurb:
      "Two-stage prod image with non-root user, BuildKit cache mounts, mise-managed Node, and a wrapper entrypoint that handles pre-start tasks.",
    files: [
      { name: "Dockerfile.tmpl", purpose: "Production — two-stage, non-root, minimal final image" },
      { name: "Dockerfile.local.tmpl", purpose: "Development — single stage, volume-mounted code" },
      { name: "entrypoint.sh.tmpl", purpose: "Production entrypoint — runs pre-start tasks then execs CMD" },
      { name: "local-entrypoint.sh.tmpl", purpose: "Dev entrypoint — installs deps then execs CMD" },
      { name: ".dockerignore.tmpl", purpose: "Excludes node_modules, cache, secrets, editor files" },
      { name: "setup.bp", purpose: "Blueprint — Node version, runtime command, variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name used for labels and metadata" },
      { name: "NODE_VERSION", required: false, default: "22.14.0", description: "Node.js version — also used by mise" },
      { name: "REGISTRY", required: false, default: "docker.io", description: "Container registry prefix" },
      { name: "WORKDIR", required: false, default: "/app", description: "Working directory inside the container" },
      { name: "PORT", required: false, default: "3000", description: "Port exposed by the application" },
      { name: "CMD", required: false, default: "node dist/index.js", description: "Default container command" },
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
      "GitHub Actions PR workflow for Node.js/TypeScript: test with coverage, ESLint/Prettier, build artifact, integration tests, and npm audit security scan.",
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
      "GitHub Actions PR workflow for Python: pytest with coverage diff comment, ruff + mypy lint, integration tests, and bandit + safety security scan.",
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
    slug: "actions-github-delivery-python",
    path: "actions/github/delivery/python",
    category: "actions",
    subcategory: "github",
    name: "Python Package Publish",
    tagline: "Build and publish Python packages to PyPI, GitHub Packages, or JFrog",
    description:
      "GitHub Actions workflow that builds and publishes Python packages to PyPI (Trusted Publishing / OIDC), GitHub Packages, or JFrog Artifactory, auto-versioned by Release Please on every push to main.",
    blurb:
      "Delegates build and publish to elpic/actions/delivery/python composite actions. Switch registries with a single REGISTRY variable.",
    files: [
      { name: "publish.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in artifact names" },
      { name: "PYPI_PROJECT_NAME", required: true, default: null, description: "PyPI project name (used in the published package URL)" },
      { name: "REGISTRY", required: false, default: "pypi", description: "Target registry: pypi, github, or jfrog" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that triggers automated publishing" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "BUILD_TASK", required: false, default: "build", description: "mise task that builds the package wheel" },
      { name: "PACKAGE_DIR", required: false, default: "dist", description: "Directory containing built artifacts" },
      { name: "ENVIRONMENT", required: false, default: "pypi", description: "GitHub deployment environment name (defaults to match REGISTRY)" },
      { name: "RELEASE_PLEASE_CONFIG", required: false, default: "release-please-config.json", description: "Path to Release Please config file" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
    ],
  },
  {
    slug: "actions-github-delivery-github-release",
    path: "actions/github/delivery/github-release",
    category: "actions",
    subcategory: "github",
    name: "GitHub Release Publish",
    tagline: "Build and create a GitHub Release with artifacts",
    description:
      "GitHub Actions workflow that builds your application and creates a GitHub Release with built artifacts, auto-versioned by Release Please on every push to main.",
    blurb:
      "Delegates build and publish to elpic/actions/delivery/github-release composite actions.",
    files: [
      { name: "publish.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "APP_NAME", required: true, default: null, description: "Application name; used in artifact names" },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that triggers automated publishing" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "BUILD_TASK", required: false, default: "build", description: "mise task that builds the app" },
      { name: "BUILD_OUTPUT", required: false, default: "dist", description: "Directory containing the built output" },
      { name: "RELEASE_PLEASE_CONFIG", required: false, default: "release-please-config.json", description: "Path to Release Please config file" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Timeout applied to every job" },
    ],
  },
  {
    slug: "actions-github-drift-check",
    path: "actions/github/drift-check",
    category: "actions",
    subcategory: "github",
    name: "Drift Check",
    tagline: "Detect drift between templates and their rendered files on every PR",
    description:
      "GitHub Actions workflow that runs `blueprint check` on every PR to detect drift between templates and their rendered output files. Supports checking multiple blueprints in a single workflow via the CHECKS JSON array.",
    blurb:
      "Delegates to elpic/actions/github/drift-check composite action — no inline checkout, install, or comment management. One workflow can check many blueprints at once.",
    files: [
      { name: "drift-check.yml.tmpl", purpose: "Workflow template" },
      { name: "setup.bp", purpose: "Blueprint declaring variables" },
    ],
    vars: [
      { name: "CHECKS", required: true, default: null, description: `JSON array of drift checks: [{"file":"...","template":"...","against":"..."}]` },
      { name: "MAIN_BRANCH", required: false, default: "main", description: "Branch that PRs target" },
      { name: "RUNNER", required: false, default: "ubuntu-latest", description: "GitHub Actions runner image" },
      { name: "TIMEOUT_MINUTES", required: false, default: "10", description: "Job timeout" },
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
