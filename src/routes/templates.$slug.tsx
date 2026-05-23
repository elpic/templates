import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Github, Boxes, Check, Minus, FileCode } from "lucide-react";
import {
  TEMPLATES,
  REPO_URL,
  SITE_URL,
  getTemplate,
  templateRepoUrl,
  templateShorthand,
  type TemplateDef,
  type TemplateVar,
} from "@/lib/templates-data";

export const Route = createFileRoute("/templates/$slug")({
  loader: ({ params }) => {
    const template = getTemplate(params.slug);
    if (!template) throw notFound();
    return { template };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.template;
    if (!t) return {};
    const title = `${t.name} — elpic/templates`;
    const desc = t.description;
    const url = `${SITE_URL}/templates/${t.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">Template not found</h1>
        <p className="mt-2 text-muted-foreground">That template doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  ),
  component: TemplatePage,
});

function neighbors(slug: string): { prev?: TemplateDef; next?: TemplateDef } {
  const i = TEMPLATES.findIndex((t) => t.slug === slug);
  return { prev: TEMPLATES[i - 1], next: TEMPLATES[i + 1] };
}

function TemplatePage() {
  const { template } = Route.useLoaderData() as { template: TemplateDef };
  const { prev, next } = neighbors(template.slug);
  const shorthand = templateShorthand(template);

  const requiredVars = template.vars.filter((v) => v.required);
  const outputDir = template.category === "actions" ? ".github/workflows" : ".";
  const renderCmd = [
    "blueprint render setup.bp \\",
    `  --template ${shorthand} \\`,
    `  --output ${outputDir} \\`,
    ...requiredVars.map(
      (v, i) =>
        `  --var ${v.name}=<value>${i === requiredVars.length - 1 ? "" : " \\"}`,
    ),
  ];
  if (requiredVars.length === 0) {
    renderCmd[renderCmd.length - 1] = renderCmd[renderCmd.length - 1].replace(/ \\$/, "");
  }
  const renderYaml = renderCmd.join("\n");

  const sampleValue = (name: string): string => {
    if (name === "APP_NAME") return "myapp";
    if (name === "PYPI_PROJECT_NAME") return "my-package";
    if (name === "BLUEPRINT_FILE") return "setup.bp";
    if (name === "TEMPLATE") return shorthand;
    if (name === "AGAINST") return ".";
    if (name === "CHECKS")
      return `[{"file":"setup.bp","template":"@github:elpic/templates@main:containers/python","against":"."}]`;
    return "<value>";
  };
  const reqLines = template.vars
    .filter((v) => v.required)
    .map((v) => `var ${v.name} ${sampleValue(v.name)}  # ${v.description}`);
  const optLines = template.vars
    .filter((v) => !v.required)
    .map((v) => {
      const def = v.default === "" ? '""' : (v.default ?? "");
      return `# var ${v.name} ${def}  # default: ${def}`;
    });
  const bpSections: string[] = [
    "# setup.bp",
    "#",
    "# Then render with:",
    "#   blueprint render setup.bp",
    "#",
    "# Check for drift in CI:",
    `#   blueprint check setup.bp --against ${outputDir}`,
    "",
    "# ── Template ──────────────────────────────────────────────",
    `template ${shorthand}`,
  ];
  if (reqLines.length > 0) {
    bpSections.push("", "# ── Required ──────────────────────────────────────────────", ...reqLines);
  }
  if (optLines.length > 0) {
    bpSections.push("", "# ── Optional overrides (uncomment to change) ──────────────", ...optLines);
  }
  const bpFile = bpSections.join("\n");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-mono text-sm">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-foreground">elpic</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">templates</span>
          </Link>
          <a
            href={templateRepoUrl(template)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">View source</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All templates
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-muted-foreground">
            {template.category}
            {template.subcategory ? ` / ${template.subcategory}` : ""}
          </span>
          <span className="rounded-full border border-border bg-card px-2.5 py-1 text-foreground/90">
            blueprint
          </span>
        </div>

        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {template.name}
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          {template.tagline}
        </p>
        <p className="mt-4 text-foreground/85">{template.description}</p>
        {template.blurb ? (
          <p className="mt-3 text-sm text-muted-foreground">{template.blurb}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-1 text-foreground">{shorthand}</span>
        </div>

        {/* Usage — two ways */}
        <section className="mt-10">
          <h2 className="font-mono text-sm uppercase tracking-widest text-primary">/ usage</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Two ways to use this template: render it directly from the CLI, or reference it
            from a blueprint file in your repo.
          </p>

          <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            1. Render with the CLI
          </h3>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-chart-3/70" />
              <span className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                ~/myapp · blueprint render
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
              <code>{renderYaml}</code>
            </pre>
          </div>

          <h3 className="mt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            2. Use inside a blueprint file
          </h3>
          <div className="mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-chart-3/70" />
              <span className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                ~/myapp · setup.bp
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
              <code>{bpFile}</code>
            </pre>
          </div>
        </section>

        {/* Files */}
        <section className="mt-12">
          <h2 className="font-mono text-sm uppercase tracking-widest text-primary">/ files</h2>
          <ul className="mt-3 space-y-2">
            {template.files.map((f) => (
              <li
                key={f.name}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <FileCode className="mt-0.5 h-4 w-4 flex-none text-primary" />
                <div className="min-w-0">
                  <div className="font-mono text-sm text-foreground">{f.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{f.purpose}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Variables */}
        <section className="mt-12">
          <h2 className="font-mono text-sm uppercase tracking-widest text-primary">/ variables</h2>
          {template.vars.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              This template takes no variables.
            </p>
          ) : (
            <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-secondary/40 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {template.vars.map((v: TemplateVar) => (
                    <tr key={v.name} className="border-b border-border/60 align-top last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-mono text-foreground">{v.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {v.description}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {v.required ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            <Check className="h-3 w-3" /> yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Minus className="h-3 w-3" /> no
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {v.default === null || v.default === undefined ? (
                          <span className="opacity-50">—</span>
                        ) : v.default === "" ? (
                          <span className="opacity-50">""</span>
                        ) : (
                          v.default
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Links */}
        <section className="mt-12 grid gap-3 sm:grid-cols-2">
          <a
            href={templateRepoUrl(template)}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Github className="h-4 w-4" /> Source on GitHub
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              View setup.bp and the full README.
            </p>
          </a>
          <a
            href={`${REPO_URL}#readme`}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              Repo README{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              How blueprint works and the full template index.
            </p>
          </a>
        </section>

        {/* Prev / Next */}
        <nav className="mt-14 flex items-stretch justify-between gap-4 border-t border-border/60 pt-6">
          {prev ? (
            <Link
              to="/templates/$slug"
              params={{ slug: prev.slug }}
              className="group flex-1 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Previous
              </div>
              <div className="mt-1 font-mono text-sm">{prev.name}</div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/templates/$slug"
              params={{ slug: next.slug }}
              className="group flex-1 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="h-3 w-3" />
              </div>
              <div className="mt-1 font-mono text-sm">{next.name}</div>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <p className="font-mono">elpic/templates · MIT licensed</p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            github.com/elpic/templates <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
