import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectCard } from "@/components/ProjectCard";
import { CvDownloadButton } from "@/components/CvDownloadButton";
import { fetchPublishedProjects } from "@/lib/pb";
import { ARCHIVE, EXPLORING, PROJECTS, SITE } from "@/lib/site";
import { PROJECT_DETAILS } from "@/lib/details";

export const Route = createFileRoute("/")({
  loader: async () =>
    (await fetchPublishedProjects()) ?? { projects: PROJECTS, details: PROJECT_DETAILS },
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: "Naoufal Elouahabi — Data Science & AI · EMSI" },
      { name: "description", content: "5th-year student at EMSI (IIR) — Data Science & Artificial Intelligence. Building data pipelines, entity resolution and AI systems. Open to PFE and junior roles." },
      { property: "og:title", content: "Naoufal Elouahabi — I build things with data, AI, and code" },
      { property: "og:description", content: "Portfolio of a 5th-year EMSI student (IIR — Data Science & AI) in Morocco. Selected work and case studies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FLOATERS = [
  { t: "SELECT * FROM truth;", c: "bg-paper", pos: "left-[4%] top-[8%]", r: "-6deg" },
  { t: "airflow.dag(15)", c: "bg-amber", pos: "right-[6%] top-[4%]", r: "5deg" },
  { t: "p(match) = 0.97?", c: "bg-coral", pos: "right-[2%] top-[46%]", r: "-3deg" },
  { t: "docker compose up", c: "bg-ink text-paper", pos: "left-[8%] bottom-[10%]", r: "4deg" },
  { t: "# TODO: ship it", c: "bg-green", pos: "right-[18%] bottom-[4%]", r: "-8deg" },
];

const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue", steel: "bg-steel", paper: "bg-paper", amber: "bg-amber",
  coral: "bg-coral", green: "bg-green", violet: "bg-violet", ink: "bg-ink",
};
const ACCENT_HOVER: Record<string, string> = {
  blue: "hover:bg-blue", steel: "hover:bg-steel", paper: "hover:bg-paper",
  amber: "hover:bg-amber", coral: "hover:bg-coral", green: "hover:bg-green",
  violet: "hover:bg-violet", ink: "hover:bg-ink hover:text-paper",
};
const ACCENT_TEXT: Record<string, string> = {
  blue: "text-blue", steel: "text-foreground", paper: "text-foreground",
  amber: "text-foreground", coral: "text-coral", green: "text-green",
  violet: "text-violet", ink: "text-foreground",
};

function Index() {
  const { projects } = Route.useLoaderData();
  const FEATURED = projects.filter((p) => p.featured);
  const archiveGroups = ARCHIVE.map((group) => ({
    ...group,
    items: projects
      .filter((p) => p.category === group.category)
      .sort((a, b) => a.num.localeCompare(b.num)),
  })).filter((g) => g.items.length > 0);
  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink bg-blue">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div>
            <p className="font-mono text-sm">{SITE.name} · Morocco</p>
            <p className="mt-2 inline-flex flex-wrap items-center gap-2 border-2 border-ink bg-violet px-3 py-1 font-mono text-xs text-paper">
              5th-year student at EMSI · IIR — Data Science &amp; AI
            </p>
            <h1 className="mt-5 text-6xl font-bold sm:text-7xl lg:text-8xl">
              I build things with <span className="bg-paper px-2">data</span>, AI, and code.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">
              5th-year student at EMSI Tanger, in the IIR program — Data Science &amp; Artificial Intelligence. I turn messy data, complex workflows, and technical ideas into useful, reliable systems.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-amber px-3 py-1.5 font-mono text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-ink" aria-hidden /> Open to PFE / junior engineering opportunities
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="btn bg-ink text-paper">Explore my projects →</a>
              <CvDownloadButton />
            </div>
          </div>
          <div className="relative hidden min-h-[380px] md:block" aria-hidden>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-56 w-56 overflow-hidden rounded-full border-2 border-ink hard-shadow lg:h-64 lg:w-64">
                <img
                  src="/photos/naoufal.png"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            </div>
            <div className="absolute left-[14%] top-[14%] h-20 w-20 rotate-12 border-2 border-ink bg-paper dot-grid" />
            <div className="absolute bottom-[16%] right-[18%] h-0 w-0 border-x-[36px] border-b-[62px] border-x-transparent border-b-ink" />
            {FLOATERS.map((f, i) => (
              <span key={f.t} className={`bob absolute border-2 border-ink px-2.5 py-1 font-mono text-xs hard-shadow ${f.c} ${f.pos}`} style={{ ["--r" as string]: f.r, animationDelay: `${i * 0.8}s` }}>
                {f.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-5xl font-bold md:text-7xl">Selected work</h2>
          <p className="hidden font-mono text-sm text-muted-foreground md:block">{FEATURED.length} flagships</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section id="archive" className="border-y-2 border-ink bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-5xl font-bold md:text-7xl">All projects</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every project I've built, grouped by category. Click through for case studies.
          </p>
          <div className="mt-12 space-y-12">
            {archiveGroups.map((group) => (
              <div key={group.category}>
                <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
                  <span className={`inline-block h-5 w-5 shrink-0 border-2 border-ink ${ACCENT_BG[group.accent]}`} aria-hidden />
                  <h3 className="text-3xl font-bold">{group.category}</h3>
                  <span className="font-mono text-sm text-muted-foreground">{group.items.length} projects</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{group.blurb}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((p) => {
                    const slug = p.slug;
                    return (
                      <Link
                        key={slug}
                        to="/work/$slug"
                        params={{ slug }}
                        className={`group flex items-center justify-between border-2 border-ink bg-card px-4 py-3 ${ACCENT_HOVER[group.accent]}`}
                      >
                        <div>
                          <span className="font-mono text-xs text-muted-foreground">{p.num}</span>
                          <p className="font-display font-semibold">{p.title}</p>
                        </div>
                        <span className="font-mono text-xs opacity-0 group-hover:opacity-100">→</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-2 border-ink bg-steel">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="font-mono text-sm">/currently-exploring</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {EXPLORING.map((e, i) => {
              const bar = ["bg-coral", "bg-violet", "bg-green"][i % 3];
              return (
                <div key={e.label} className="border-2 border-ink bg-paper hard-shadow">
                  <div className={`h-2.5 border-b-2 border-ink ${bar}`} aria-hidden />
                  <div className="p-5">
                    <h3 className="text-2xl font-bold">{e.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="text-5xl font-bold md:text-7xl">Got messy data?</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">I'm looking for a PFE internship or junior role in data, AI or MLOps — in Morocco or France.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="btn bg-amber">Get in touch</Link>
          <Link to="/about" className="btn bg-paper">More about me</Link>
        </div>
      </section>
    </>
  );
}
