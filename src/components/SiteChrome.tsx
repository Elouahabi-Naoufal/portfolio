import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Work" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          naoufal<span className="text-blue">.</span>
          <span className="ml-2 hidden font-mono text-xs font-normal text-muted-foreground sm:inline">data/ai eng</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="px-3 py-2 font-display font-semibold hover:bg-blue" activeOptions={{ exact: true }} activeProps={{ className: "bg-blue" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/cv" className="btn ml-2 bg-ink py-2 text-paper">CV ↓</Link>
        </nav>
        <button className="btn py-2 md:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="mnav" className="border-t-2 border-ink bg-blue md:hidden" aria-label="Mobile">
          {[...NAV, { to: "/cv", label: "CV" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block border-b-2 border-ink px-5 py-4 font-display text-2xl font-bold">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-2xl font-bold">{SITE.name}</p>
        <div className="flex flex-wrap gap-4 font-mono text-sm">
          <a href={`mailto:${SITE.email}`} className="hover:text-blue">email</a>
          <a href={SITE.github} target="_blank" rel="noreferrer" className="hover:text-blue">github</a>
          <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue">linkedin</a>
          <Link to="/cv" className="hover:text-blue">cv</Link>
        </div>
        <p className="font-mono text-xs text-paper/60">Made by hand · Morocco · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
