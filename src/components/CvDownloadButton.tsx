import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { downloadPdf } from "@/lib/download";
import { fetchCvs, type CvFiles } from "@/lib/pb";

const FILENAMES: Record<string, string> = {
  en: "Naoufal_Elouahabi_CV_EN.pdf",
  fr: "Naoufal_Elouahabi_CV_FR.pdf",
};
const LABELS: Record<string, string> = {
  en: "English",
  fr: "Français",
};

// Share one fetch across button instances on the same page.
let cache: Promise<CvFiles | null> | null = null;
function loadCvs(): Promise<CvFiles | null> {
  if (!cache) cache = fetchCvs();
  return cache;
}

type Props = {
  className?: string;
  label?: string;
};

/**
 * "Download my CV" button that prompts for a language (English / Français)
 * and downloads the real PDF from PocketBase. Falls back to a plain link to
 * /cv when PocketBase is unreachable or holds no CVs.
 */
export function CvDownloadButton({ className = "btn bg-paper", label = "Download my CV" }: Props) {
  const [open, setOpen] = useState(false);
  const [cvs, setCvs] = useState<CvFiles | null | undefined>(undefined); // undefined = loading
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    loadCvs().then((v) => {
      if (alive) setCvs(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (cvs === null) {
    return (
      <Link to="/cv" className={className}>
        {label}
      </Link>
    );
  }

  const available = (["en", "fr"] as const).filter((l) => cvs?.[l]);

  return (
    <div className="relative inline-block" ref={wrap}>
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(!open)}
      >
        {label} ↓
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-56 border-2 border-ink bg-paper text-foreground hard-shadow"
        >
          {cvs === undefined && (
            <p className="px-4 py-3 font-mono text-sm text-muted-foreground">loading…</p>
          )}
          {available.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              className="block w-full border-b-2 border-ink px-4 py-3 text-left font-display font-semibold last:border-b-0 hover:bg-blue"
              onClick={() => {
                setOpen(false);
                void downloadPdf(cvs![l]!, FILENAMES[l]!);
              }}
            >
              {LABELS[l]} ↓
            </button>
          ))}
          <Link
            to="/cv"
            className="block border-t-2 border-ink bg-ink px-4 py-2.5 text-center font-mono text-xs text-paper hover:text-blue"
            onClick={() => setOpen(false)}
          >
            view online →
          </Link>
        </div>
      )}
    </div>
  );
}
