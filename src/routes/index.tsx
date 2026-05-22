import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Container,
  Workflow,
  Github,
  ArrowRight,
  Check,
  Terminal,
  Layers,
  GitBranch,
  Zap,
  FileCode,
  Boxes,
} from "lucide-react";
import { TEMPLATES, REPO_URL } from "@/lib/templates-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "elpic/templates - Blueprint templates for containers & CI/CD" },
      {
        name: "description",
        content:
          "A curated collection of blueprint templates for Dockerfiles and GitHub Actions workflows. Render once, keep in sync forever.",
      },
      { property: "og:title", content: "elpic/templates - Blueprint templates" },
      {
        property: "og:description",
        content:
          "Blueprint-rendered templates for containers and CI/CD. Reference them with @github: shorthand and re-render on every change.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://elpic.github.io/templates/" },
      { name: "twitter:title", content: "elpic/templates - Blueprint templates" },
      {
        name: "twitter:description",
        content: "Blueprint templates for containers and CI/CD workflows.",
      },
    ],
    links: [{ rel: "canonical", href: "https://elpic.github.io/templates/" }],
  }),
  component: Landing,
});

const categoryMeta = {
  containers: {
    icon: Container,
    blurb: "Dockerfiles and container scaffolding",
  },
  actions: {
    icon: Workflow,
    blurb: "GitHub Actions workflow templates",
  },
} as const;

const categoryOrder = ["containers", "actions"] as const;

const categories = categoryOrder.map((name) => {
  const items = TEMPLATES.filter((t) => t.category === name);
  return {
    name,
    icon: categoryMeta[name].icon,
    blurb: categoryMeta[name].blurb,
    items,
  };
});

const features = [
  {
    icon: Layers,
    title: "Blueprint-rendered",
    body: "Each template is a .bp blueprint plus .tmpl files. Render once, re-render whenever a version bumps, and every file stays in sync.",
  },
  {
    icon: Zap,
    title: "One source of truth",
    body: "Declare Python version, runtime packages, and variables in setup.bp. They flow into Dockerfiles, workflows, and entrypoints automatically.",
  },
  {
    icon: GitBranch,
    title: "Drift detection",
    body: "Use blueprint check in CI to catch when a rendered file falls out of sync with its template. Comments on the PR explain the diff.",
  },
  {
    icon: FileCode,
    title: "@github: shorthand",
    body: "Reference templates directly from GitHub. No vendoring, no submodules, just pin a ref and render.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-2 font-mono text-sm">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-foreground">elpic</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">templates</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#categories" className="transition-colors hover:text-foreground">Categories</a>
            <a href="#usage" className="transition-colors hover:text-foreground">Usage</a>
            <a href="#drift" className="transition-colors hover:text-foreground">Drift check</a>
          </nav>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-hero" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <a
              href="https://getbp.dev"
              target="_blank"
              rel="noreferrer"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              powered by blueprint
            </a>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Blueprint templates,{" "}
              <span className="text-gradient">always in sync.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              A curated collection of templates for Dockerfiles and GitHub Actions
              workflows. Declare versions once, render every file, and detect drift
              automatically in CI.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
              >
                <Github className="h-4 w-4" />
                Browse the repo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#usage"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-secondary"
              >
                See usage
              </a>
            </div>

            {/* Terminal card */}
            <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-xl border border-border bg-card text-left shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-chart-3/70" />
                <span className="h-3 w-3 rounded-full bg-primary/70" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  ~/myapp · render template
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html:
                  '<span class="text-muted-foreground">$</span> <span class="text-foreground">blueprint render setup.bp \\</span>\n' +
                  '    <span class="text-muted-foreground">--template</span> <span class="text-primary">@github:elpic/templates@main:containers/python</span> \\\n' +
                  '    <span class="text-muted-foreground">--output</span> <span class="text-accent">.</span> \\\n' +
                  '    <span class="text-muted-foreground">--var</span> <span class="text-accent">APP_NAME=myapp</span>'
                }} />
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary/10">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                / templates
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Pick a template, render, ship.
              </h2>
            </div>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                      <cat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-mono text-lg font-semibold">
                        {cat.name}<span className="text-muted-foreground">/</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">{cat.blurb}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    {cat.items.length}
                  </span>
                </div>
                <ul className="mt-5 space-y-2">
                  {cat.items.map((t) => (
                    <li key={t.slug}>
                      <Link
                        to="/templates/$slug"
                        params={{ slug: t.slug }}
                        className="group/item flex items-center justify-between gap-3 rounded-md border border-border bg-background/40 px-3 py-2.5 transition-colors hover:border-primary/50"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-xs text-primary">{t.path}</div>
                          <div className="mt-0.5 truncate text-sm text-foreground/90">{t.name}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover/item:translate-x-0.5 group-hover/item:text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage */}
      <section id="usage" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">
                / usage
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                One blueprint. Every file in lockstep.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Each template folder contains a{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
                  setup.bp
                </code>{" "}
                blueprint plus one or more{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
                  .tmpl
                </code>{" "}
                files. Variables with defaults can be omitted. Required variables
                must be passed via{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
                  --var
                </code>
                .
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Versions and packages live in setup.bp",
                  "Re-render after a version bump, every file stays consistent",
                  "Reference templates directly from GitHub, no vendoring",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    <span className="text-foreground/90">{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-md border border-border bg-card/60 p-4 font-mono text-xs text-muted-foreground">
                <span className="text-foreground">install:</span>{" "}
                <span className="text-primary">curl -fsSL https://install.getbp.dev | sh</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">
                  render & check
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html:
                  '<span class="text-muted-foreground"># render the template into your project</span>\n' +
                  '<span class="text-foreground">blueprint render setup.bp \\</span>\n' +
                  '  <span class="text-muted-foreground">--template</span> <span class="text-primary">.</span> \\\n' +
                  '  <span class="text-muted-foreground">--output</span> <span class="text-accent">.</span> \\\n' +
                  '  <span class="text-muted-foreground">--var</span> <span class="text-accent">APP_NAME=myapp</span>\n' +
                  '\n' +
                  '<span class="text-muted-foreground"># check for drift in CI</span>\n' +
                  '<span class="text-foreground">blueprint check setup.bp \\</span>\n' +
                  '  <span class="text-muted-foreground">--template</span> <span class="text-primary">.</span> \\\n' +
                  '  <span class="text-muted-foreground">--against</span> <span class="text-accent">.</span> \\\n' +
                  '  <span class="text-muted-foreground">--var</span> <span class="text-accent">APP_NAME=myapp</span>'
                }} />
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Drift check */}
      <section id="drift" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            / drift detection
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Catch drift before it ships.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pair any template with{" "}
            <Link
              to="/templates/$slug"
              params={{ slug: "actions-github-blueprint-check" }}
              className="text-primary hover:underline"
            >
              actions/github/blueprint-check
            </Link>{" "}
            in your repo. On every PR it runs{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
              blueprint check
            </code>
            , fails the build if rendered files have drifted, and posts a comment
            explaining what changed and how to fix it. The comment auto-removes
            when drift is resolved.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Render the first one in under a minute.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Install blueprint, copy a template, and render. Every variable has a
            sensible default, only required ones need a flag.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
            >
              <Github className="h-4 w-4" />
              Open the repo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Sibling projects */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-5 md:grid-cols-2">
            {/* blueprint */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
              <div className="absolute top-0 right-1/4 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden />
              <div className="relative flex flex-col gap-6">
                <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  sibling project
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Powered by <span className="text-gradient">blueprint</span>
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    blueprint is the rendering engine behind these templates. Define variables once,
                    render files everywhere, and catch drift before it ships.
                  </p>
                </div>
                <a
                  href="https://getbp.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex w-fit items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                >
                  Visit getbp.dev
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* actions */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
              <div className="absolute top-0 right-1/4 h-40 w-40 rounded-full bg-primary/5 blur-3xl" aria-hidden />
              <div className="relative flex flex-col gap-6">
                <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  sibling project
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <span className="text-gradient">actions</span> workflows
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    Reusable GitHub Actions composite steps and workflow templates. Integrate, deliver, and publish with zero boilerplate.
                  </p>
                </div>
                <a
                  href="https://elpic.github.io/actions/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex w-fit items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                >
                  Visit elpic/actions
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <p className="font-mono">elpic/templates · MIT licensed</p>
          <div className="flex items-center gap-5">
            <a
              href="https://getbp.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              getbp.dev <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              github.com/elpic/templates <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
