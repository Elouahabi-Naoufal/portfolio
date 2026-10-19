import PocketBase from "pocketbase";

const url = process.env.PB_URL ?? "https://pb.naoufalelouahabi.com";
const email = process.env.PB_EMAIL;
const password = process.env.PB_PASSWORD;

if (!email || !password) {
  console.error("PB_EMAIL and PB_PASSWORD are required");
  process.exit(1);
}

const pb = new PocketBase(url);
pb.autoCancellation(false);

const ARTICLES = [
  {
    title: "Splink 4 Probabilistic Matching at Scale",
    slug: "splink-probabilistic-matching",
    excerpt: "How Fellegi-Sunter EM training, blocking keys, and a Flask control plane handled 100K+ operator records at the Office des Changes.",
    projectSlug: "entity-resolution",
    category: "Data Engineering",
    tags: ["Splink", "Entity Resolution", "Probabilistic Matching", "Python"],
    readingTime: "8 min",
    featured: true,
    content: `At the **Office des Changes**, Morocco's foreign-exchange authority, the same operator can appear under dozens of different spellings, formats, and partial identifiers across banking transaction data.

Exact matching can't solve this. The platform needed **probabilistic record linkage** that analysts could trust, review, and correct.

## The Pipeline

The system uses a 12-step pipeline:

1. **Loading** — ingest from SQL Server and PostgreSQL
2. **Cleaning** — normalize names, addresses, and identifiers
3. **Blocking** — reduce comparison space from billions to millions using blocking keys
4. **EM Training** — Fellegi-Sunter expectation-maximization on field-level agreement terms
5. **Prediction** — score every candidate pair
6. **Clustering** — group matches into entity clusters
7. **Thresholding** — apply confidence thresholds
8. **Golden Record** — materialize the best representation per entity

## Key Metric

> **97%** of ambiguous pairs were resolved correctly in the first pass.

## Technical Stack

- **Python** with Splink 4 for the ML pipeline
- **DuckDB** for in-process analytical processing
- **Flask** + **React** for the human-review control plane
- **Docker** + **Dokploy** for deployment

The control plane let non-technical analysts review ambiguous pairs side-by-side, score match confidence, and feed corrections back as training signal. No code required.

[View on GitHub](https://github.com/Elouahabi-Naoufal/entity-resolution-OC)`,
  },
  {
    title: "Building a Data Warehouse from Scratch with Snowflake & Airflow",
    slug: "data-warehouse-snowflake-airflow",
    excerpt: "15 Airflow DAGs orchestrating ETL on 70+ tables into a layered Snowflake warehouse with 97.8% success rate.",
    projectSlug: "dataops-platform",
    category: "Data Engineering",
    tags: ["Apache Airflow", "Snowflake", "DataOps", "ETL", "Docker"],
    readingTime: "6 min",
    featured: true,
    content: `During my internship at **EXPLEO**, I built a complete DataOps platform that transformed how the team handled their AdventureWorks-based analytics.

## Architecture

The platform follows a **5-layer architecture**:

\`\`\`
Raw (Snowflake) → Staging → Integration → Marts → Reporting
\`\`\`

- **Raw Layer**: Direct copies of source tables
- **Staging Layer**: Cleaned and validated data
- **Integration Layer**: Cross-reference and denormalized schemas
- **Marts Layer**: Business-specific views (sales, inventory, HR)
- **Reporting Layer**: Final aggregations for Power BI

## Orchestration

**15 Airflow DAGs** handle the entire pipeline with:

| Component | Count |
|-----------|-------|
| Tables | 70+ |
| DAGs | 15 |
| Success rate | 97.8% |
| Average runtime | 22 min |

## Reproducibility

The entire stack runs on **Docker Compose** — one command to deploy the full environment, including:
- Airflow scheduler + workers
- Snowflake connections via Airflow hooks
- dbt transformations
- Power BI semantic models

> **Lesson**: A well-layered warehouse isn't just about SQL — it's about observability, retry logic, and making the pipeline boringly reliable.`,
  },
  {
    title: "How 4 Obsidian Plugins Work Under the Hood",
    slug: "obsidian-plugins-internals",
    excerpt: "The architecture behind wordlist autocomplete, Islamic practice tracking, subject management, and folder focus.",
    projectSlug: "portfolio",
    category: "Dev Tooling",
    tags: ["Obsidian", "TypeScript", "Plugin Development", "Open Source"],
    readingTime: "10 min",
    featured: false,
    content: `I published **4 Obsidian plugins** to the community registry. Here's what each one does and how they work internally.

## 1. Wordlist Autocomplete

\`\`\`typescript
// Core: fuzzy-matches typed text against a user-managed wordlist
const suggestions = wordlist.filter(w =>
  w.startsWith(prefix) || w.includes(prefix)
);
\`\`\`

- **Modal UI** for managing word lists
- **Fuzzy matching** with configurable sensitivity
- **Hotkey integration** for quick insertion

## 2. Islamic Practice Tracker

A habit tracker for daily Islamic practices with:
- Prayer tracking with timestamps
- Quran reading progress (juz/page tracking)
- Dhikr counters with daily goals
- Visual streak calendar

## 3. Subject Manager

Organizes vault notes by academic subject:
- Subject-based folder auto-organization
- Grade tracking per subject
- Term/semester grouping
- Progress dashboard

## 4. Folder Focus

Limits the visible file tree to selected folders:
- Right-click folder → "Focus here"
- Breadcrumb navigation back up
- Multiple focus levels supported

## Deployment

All 4 use the same release pipeline with **artifact attestations** via GitHub Actions:

\`\`\`yaml
- uses: actions/attest@v4
  with:
    subject-path: release.zip
\`\`\`

Every release includes source code alongside the compiled plugin, meeting Obsidian's community guidelines.

[Browse the repos](https://github.com/Elouahabi-Naoufal?q=obsidian)`,
  },
  {
    title: "Running a 3-Server Home Lab with Dokploy & Traefik",
    slug: "home-lab-dokploy-traefik",
    excerpt: "Architecture and lessons from self-hosting 20+ services on a Contabo VPS behind Traefik with automatic TLS.",
    projectSlug: "dokploy-traefik-home-lab",
    category: "Infrastructure",
    tags: ["Dokploy", "Traefik", "Docker", "Self-Hosting", "DevOps"],
    readingTime: "12 min",
    featured: true,
    content: `My home lab runs **20+ services** on a single Contabo VPS behind Traefik with automatic Let's Encrypt TLS. Here's how it's structured.

## The Stack

\`\`\`
Internet → Cloudflare (CDN + DNS) → Contabo VPS → Traefik → Docker Swarm
\`\`\`

### Networking
- **Cloudflare** handles DDoS protection and SSL termination
- **Traefik** routes traffic based on hostname
- **Docker Swarm** manages service replication

### Services

| Type | Services |
|------|----------|
| **CI/CD** | Dokploy (self-hosted PaaS) |
| **Databases** | PocketBase, PostgreSQL |
| **Monitoring** | Beszel agent |
| **Collaboration** | Nextcloud, Overleaf |
| **Web** | Portfolio site, n8n |

## Key Lessons

1. **Traefik labels** are the cleanest way to configure routing — every service declares its domain in its compose file
2. **Dokploy** makes deployment trivial: push to GitHub, it auto-deploys
3. **Healthchecks** prevent cascading failures — every service has a healthcheck endpoint

## The Configuration

Each service gets a minimal compose file:

\`\`\`yaml
services:
  app:
    build: .
    labels:
      - traefik.http.routers.app.rule=Host(\`app.example.com\`)
      - traefik.enable=true
\`\`\`

Traefik picks up the labels automatically and provisions Let's Encrypt certificates.

> **Total cost**: ~€12/month for the VPS. The equivalent SaaS services would cost 10x more.`,
  },
];

async function main() {
  await pb.collection("_superusers").authWithPassword(email, password);
  console.log("Authenticated");

  let created = 0;
  let updated = 0;

  for (const a of ARTICLES) {
    const payload = {
      ...a,
      status: "published",
      publishedAt: new Date().toISOString(),
      seoTitle: a.title,
      seoDescription: a.excerpt,
      coverImage: "",
    };

    try {
      const existing = await pb
        .collection("articles")
        .getFirstListItem<{ id: string }>(`slug = "${a.slug}"`);
      await pb.collection("articles").update(existing.id, payload);
      updated++;
    } catch {
      try {
        await pb.collection("articles").create(payload);
        created++;
      } catch (e) {
        console.error(`  ${a.slug}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  console.log(`\nDone: ${created} created, ${updated} updated`);

  const total = await pb.collection("articles").getList(1, 1);
  console.log(`Articles in PB: ${total.totalItems}`);
}

main().catch(console.error);