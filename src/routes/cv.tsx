import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { downloadPdf } from "@/lib/download";
import { fetchCvs } from "@/lib/pb";
import { PROJECTS, SITE, TOOLKIT } from "@/lib/site";

export const Route = createFileRoute("/cv")({
  loader: async () => (await fetchCvs()) ?? null,
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: "CV — Naoufal Elouahabi" },
      {
        name: "description",
        content:
          "Résumé of Naoufal Elouahabi, 5th-year student at EMSI (IIR) — Data Science & Artificial Intelligence.",
      },
      { property: "og:title", content: "CV — Naoufal Elouahabi" },
      {
        property: "og:description",
        content: "Experience, projects and skills in data and AI engineering.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CV,
});

const LABELS: Record<string, string> = { en: "English", fr: "Français" };
const FILENAMES: Record<string, string> = {
  en: "Naoufal_Elouahabi_CV_EN.pdf",
  fr: "Naoufal_Elouahabi_CV_FR.pdf",
};

function CV() {
  const cvs = Route.useLoaderData();
  const [lang, setLang] = useState<"en" | "fr">("en");

  // PocketBase down or no PDFs stored → render the HTML CV (original fallback).
  if (!cvs?.en && !cvs?.fr) return <HtmlCv />;

  // Default to English; fall back to whatever exists if English is missing.
  const active = (cvs[lang] ? lang : cvs.en ? "en" : "fr") as "en" | "fr";
  const src = cvs[active]!;

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="font-mono text-sm hover:underline">
          ← back
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex border-2 border-ink font-mono text-sm"
            role="group"
            aria-label="CV language"
          >
            {(["en", "fr"] as const)
              .filter((l) => cvs[l])
              .map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 ${active === l ? "bg-ink text-paper" : "bg-paper hover:bg-blue"}`}
                  aria-pressed={active === l}
                >
                  {LABELS[l]}
                </button>
              ))}
          </div>
          <button
            type="button"
            className="btn bg-blue"
            onClick={() => void downloadPdf(src, FILENAMES[active]!)}
          >
            Download PDF ↓
          </button>
        </div>
      </div>

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        viewing: {LABELS[active]} CV · switch language with the buttons above
      </p>

      <iframe
        key={active}
        src={src}
        title={`Naoufal Elouahabi — CV (${LABELS[active]})`}
        className="mt-4 w-full border-2 border-ink bg-paper hard-shadow"
        style={{ height: "calc(100vh - 240px)", minHeight: "640px" }}
      />
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        not rendering?{" "}
        <a href={src} target="_blank" rel="noreferrer" className="underline hover:text-blue">
          open the PDF directly ↗
        </a>
      </p>
    </section>
  );
}

/** Static HTML CV — shown when PocketBase is unreachable or holds no CV PDFs. */
function HtmlCv() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to="/" className="font-mono text-sm hover:underline">
          ← back
        </Link>
        <button onClick={() => window.print()} className="btn bg-blue">
          Download as PDF
        </button>
      </div>
      <article className="mt-8 border-2 border-ink bg-paper p-8 hard-shadow print:border-0 print:shadow-none">
        <h1 className="text-5xl font-bold">{SITE.name}</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          EMSI · IIR — Data Science &amp; AI · Morocco · {SITE.email}
        </p>
        <h2 className="mt-8 text-2xl font-bold">Experience & projects</h2>
        {PROJECTS.filter((p) => !p.upcoming).map((p) => (
          <div key={p.slug} className="mt-4">
            <p className="font-display text-lg font-bold">
              {p.title} — {p.org}
            </p>
            <p className="text-sm text-muted-foreground">{p.summary}</p>
          </div>
        ))}
        <h2 className="mt-8 text-2xl font-bold">Skills</h2>
        {TOOLKIT.map((g) => (
          <p key={g.group} className="mt-2 text-sm">
            <span className="font-semibold">{g.group}:</span> {g.items.join(", ")}
          </p>
        ))}
      </article>
    </section>
  );
}
