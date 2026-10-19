import PocketBase from "pocketbase";
import type { ProjectDetails } from "./details";
import type { CoverColor, Project, ProjectCategory } from "./site";

function resolveUrl(): string | undefined {
  // Runtime env (Dokploy/Nitro) first, then build-time VITE_ var.
  if (typeof process !== "undefined") {
    const runtime = process.env?.VITE_POCKETBASE_URL || process.env?.PUBLIC_POCKETBASE_URL;
    if (runtime) return runtime.trim() || undefined;
  }
  return (import.meta.env?.VITE_POCKETBASE_URL as string | undefined)?.trim() || undefined;
}

const url = resolveUrl();

export type ContentBundle = {
  projects: Project[];
  details: Record<string, ProjectDetails>;
};

type PbProjectFields = {
  slug: string;
  num: string;
  title: string;
  org?: string;
  summary: string;
  context?: string;
  description?: string;
  architecture?: string;
  features?: string[];
  metrics?: string[];
  tags?: string[];
  stack?: string[];
  approach?: { title: string; body: string }[];
  cover: CoverColor;
  category: ProjectCategory;
  featured?: boolean;
  github?: string;
  photo?: string;
};

function client(): PocketBase | null {
  if (!url) return null;
  const pb = new PocketBase(url);
  pb.autoCancellation(false);
  return pb;
}

function toProject(f: PbProjectFields): Project {
  return {
    slug: f.slug,
    num: f.num,
    title: f.title,
    org: f.org ?? "",
    summary: f.summary,
    tags: f.tags ?? [],
    cover: f.cover,
    context: f.context ?? "",
    approach: f.approach ?? [],
    stack: f.stack ?? [],
    github: f.github ?? "",
    photo: f.photo || undefined,
    category: f.category,
    featured: f.featured ?? false,
  };
}

function toDetails(f: PbProjectFields): ProjectDetails | undefined {
  if (!f.description && !f.architecture && !f.features?.length && !f.metrics?.length) {
    return undefined;
  }
  return {
    description: f.description ?? "",
    architecture: f.architecture ?? "",
    features: f.features ?? [],
    metrics: f.metrics ?? [],
  };
}

/** Fetch all published projects. Returns null on any failure so callers can fall back to static data. */
export async function fetchPublishedProjects(): Promise<ContentBundle | null> {
  const pb = client();
  if (!pb) return null;
  try {
    const records = await pb.collection("projects").getFullList<PbProjectFields>({ sort: "num" });
    if (!records.length) return null;
    const projects: Project[] = [];
    const details: Record<string, ProjectDetails> = {};
    for (const r of records) {
      projects.push(toProject(r));
      const d = toDetails(r);
      if (d) details[r.slug] = d;
    }
    return { projects, details };
  } catch {
    return null;
  }
}

/** Fetch one published project by slug. Returns null if missing or on failure. */
export async function fetchPublishedProject(
  slug: string,
): Promise<{ project: Project; details?: ProjectDetails } | null> {
  const pb = client();
  if (!pb) return null;
  try {
    const r = await pb
      .collection("projects")
      .getFirstListItem<PbProjectFields>(`slug = "${slug.replace(/"/g, '\\"')}"`);
    return { project: toProject(r), details: toDetails(r) };
  } catch {
    return null;
  }
}

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  readingTime?: string;
  featured: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  projectSlug?: string;
};

type PbArticleFields = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  readingTime?: string;
  featured?: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  projectSlug?: string;
};

function toArticle(f: PbArticleFields): Article {
  return {
    slug: f.slug,
    title: f.title,
    excerpt: f.excerpt,
    content: f.content,
    coverImage: f.coverImage,
    tags: f.tags ?? [],
    category: f.category,
    readingTime: f.readingTime,
    featured: f.featured ?? false,
    publishedAt: f.publishedAt,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    projectSlug: f.projectSlug,
  };
}

export async function fetchPublishedArticles(): Promise<Article[] | null> {
  const pb = client();
  if (!pb) return null;
  try {
    const records = await pb
      .collection("articles")
      .getFullList<PbArticleFields>({ sort: "-publishedAt" });
    return records.length ? records.map(toArticle) : null;
  } catch {
    return null;
  }
}

export async function fetchPublishedArticle(slug: string): Promise<Article | null> {
  const pb = client();
  if (!pb) return null;
  try {
    const r = await pb
      .collection("articles")
      .getFirstListItem<PbArticleFields>(`slug = "${slug.replace(/"/g, '\\"')}"`);
    return toArticle(r);
  } catch {
    return null;
  }
}
