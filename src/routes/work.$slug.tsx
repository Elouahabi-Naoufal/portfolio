import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProjectCover } from "@/components/ProjectCard";
import { fetchPublishedProject } from "@/lib/pb";
import { renderMd } from "@/lib/markdown";
import { PROJECT_DETAILS } from "@/lib/details";
import { PROJECTS } from "@/lib/site";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const live = await fetchPublishedProject(params.slug);
    if (live) {
      return { project: live.project, details: live.details ?? PROJECT_DETAILS[params.slug] };
    }
    const project = PROJECTS.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project, details: PROJECT_DETAILS[params.slug] };
  },
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} — case study · Naoufal Elouahabi` : "Project not found";
    return {
      meta: [
        { title },
        { name: "description", content: p?.summary ?? "Project not found" },
        { property: "og:title", content: title },
        { property: "og:description", content: p?.summary ?? "Project not found" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="text-5xl font-bold">No such project.</h1>
      <Link to="/" className="btn mt-6 bg-blue">Back to work</Link>
    </div>
  ),
  component: CaseStudy,
});

function CaseStudy() {
  const { project: p, details: d } = Route.useLoaderData();
  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length] ?? p;
  return (
    <article className="mx-auto max-w-5xl px-5 py-12">
      <Link to="/" hash="work" className="font-mono text-sm hover:underline">← all work</Link>
      <div className="mt-6 border-2 border-ink hard-shadow-lg"><ProjectCover p={p} big /></div>
      <div className="mt-10 grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{p.org}</p>
          <h1 className="mt-2 text-6xl font-bold md:text-7xl">{p.title}</h1>
        </div>
        <aside className="h-fit border-2 border-ink bg-paper p-5">
          <p className="font-mono text-xs uppercase">Tags</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="tag bg-blue">{t}</span>)}</div>
          {p.stack.length > 0 && (<>
            <p className="mt-5 font-mono text-xs uppercase">Technologies</p>
            <ul className="mt-2 space-y-1 font-display font-semibold">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </>)}
          {p.github && (
            <div className="mt-5 border-t-2 border-ink pt-4">
              <p className="font-mono text-xs uppercase">Source</p>
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-mono text-sm hover:underline"
              >
                ↗ View on GitHub
              </a>
            </div>
          )}
        </aside>
      </div>

      <section className="mt-14 border-t-2 border-ink pt-10">
        <h2 className="text-4xl font-bold md:text-5xl">Summary</h2>
        <p className="mt-6 text-xl font-semibold leading-relaxed">{p.summary}</p>
        {p.context && <div className="mt-4 text-lg leading-relaxed text-muted-foreground prose" dangerouslySetInnerHTML={{ __html: renderMd(p.context) }} />}
      </section>

      {d && (
        <>
          <section className="mt-14 border-t-2 border-ink pt-10">
            <h2 className="text-4xl font-bold md:text-5xl">Full description</h2>
            <div className="mt-5 text-lg leading-relaxed prose" dangerouslySetInnerHTML={{ __html: renderMd(d.description) }} />
          </section>

          <section className="mt-14 border-t-2 border-ink pt-10">
            <h2 className="text-4xl font-bold md:text-5xl">Architecture & structure</h2>
            <div className="mt-6 border-2 border-ink bg-steel p-6 hard-shadow prose" dangerouslySetInnerHTML={{ __html: renderMd(d.architecture) }} />
            </div>
          </section>

          <section className="mt-14 border-t-2 border-ink pt-10">
            <h2 className="text-4xl font-bold md:text-5xl">Key features</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {d.features.map((f) => (
                <li key={f} className="border-2 border-ink bg-paper p-4 text-sm leading-relaxed">
                  <span className="mr-2 font-mono text-xs">▸</span>{f}
                </li>
              ))}
            </ul>
          </section>

          {d.metrics.length > 0 && (
            <section className="mt-14 border-t-2 border-ink pt-10">
              <h2 className="text-4xl font-bold md:text-5xl">By the numbers</h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {d.metrics.map((m) => (
                  <li key={m} className="border-2 border-ink bg-blue px-4 py-2 font-mono text-sm font-semibold hard-shadow">{m}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {p.approach.length > 0 && (
        <section className="mt-16">
          <h2 className="text-4xl font-bold md:text-5xl">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {p.approach.map((s, i) => (
              <li key={s.title} className={`border-2 border-ink p-6 ${i % 2 ? "bg-steel md:translate-y-6" : "bg-paper"}`}>
                <span className="font-mono text-xs">step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-2xl font-bold">{s.title}</h3>
                <div className="mt-2 text-sm leading-relaxed prose" dangerouslySetInnerHTML={{ __html: renderMd(s.body) }} />
              </li>
            ))}
          </ol>
        </section>
      )}
      <div className="mt-20 flex justify-end">
        <Link to="/work/$slug" params={{ slug: next.slug }} className="btn bg-blue">Next: {next.title} →</Link>
      </div>
    </article>
  );
}
