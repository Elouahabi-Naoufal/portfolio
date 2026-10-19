import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchPublishedArticles } from "@/lib/pb";

export const Route = createFileRoute("/blog/")({
  loader: async () => (await fetchPublishedArticles()) ?? [],
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: "Blog — Naoufal Elouahabi" },
      { name: "description", content: "Articles about data engineering, AI, and building things." },
      { property: "og:title", content: "Blog — Naoufal Elouahabi" },
      { property: "og:description", content: "Data engineering, AI, and project deep-dives." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const articles = Route.useLoaderData();
  return (
    <section className="mx-auto max-w-4xl px-5 py-20">
      <h1 className="text-6xl font-bold md:text-7xl">Blog</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">Posts about building things with data, code, and AI.</p>
      <div className="mt-12 space-y-8">
        {articles.length === 0 && <p className="text-muted-foreground">No articles yet — check back soon.</p>}
        {articles.map((a) => (
          <Link
            key={a.slug}
            to="/blog/$slug"
            params={{ slug: a.slug }}
            className="lift block border-2 border-ink bg-card p-6 hard-shadow"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold">{a.title}</h2>
              <span className="font-mono text-xs text-muted-foreground">{a.readingTime ?? ""}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}