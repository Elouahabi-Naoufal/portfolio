import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchPublishedArticle } from "@/lib/pb";
import { renderMd } from "@/lib/markdown";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => fetchPublishedArticle(params.slug),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const a = loaderData;
    const title = a ? `${a.title} — Naoufal Elouahabi` : "Article not found";
    return {
      meta: [
        { title },
        { name: "description", content: a?.excerpt ?? "Article not found" },
        { property: "og:title", content: title },
        { property: "og:description", content: a?.excerpt ?? "Article not found" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(a ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="text-5xl font-bold">No such article.</h1>
      <Link to="/blog" className="btn mt-6 bg-blue">All articles</Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const a = Route.useLoaderData();
  if (!a) return null;
  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <Link to="/blog" className="font-mono text-sm hover:underline">← all articles</Link>
      <h1 className="mt-6 text-5xl font-bold md:text-6xl">{a.title}</h1>
      <div className="mt-4 flex flex-wrap items-baseline gap-3 text-sm text-muted-foreground">
        <span className="font-mono">{a.readingTime}</span>
        {a.category && <span className="tag">{a.category}</span>}
        {a.projectSlug && <Link to="/work/$slug" params={{ slug: a.projectSlug }} className="font-mono hover:underline">Related project →</Link>}
      </div>
      {a.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {a.tags.map((t) => <span key={t} className="tag bg-blue">{t}</span>)}
        </div>
      )}
      {a.coverImage && <img src={a.coverImage} alt="" className="mt-8 w-full border-2 border-ink" loading="eager" />}
      <div className="mt-10 text-base leading-relaxed prose" dangerouslySetInnerHTML={{ __html: renderMd(a.content) }} />
    </article>
  );
}