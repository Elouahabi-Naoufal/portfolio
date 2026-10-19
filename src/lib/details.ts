export type ProjectDetails = {
  description: string;
  architecture: string;
  features: string[];
  metrics: string[];
};

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  "entity-resolution": {
    description:
      "Built during my internship at the Office des Changes, Morocco's foreign-exchange authority. The office's national banking transaction database contained the same operator recorded many times under different spellings, formats, and partial identifiers — exact matching could not resolve them.\n\nThe platform performs probabilistic record linkage with Splink 4: field-level agreement terms feed a Fellegi–Sunter EM-trained model, while blocking keys cut the comparison space from ~200M theoretical pairs to ~90k candidates. Matches are clustered into entities, a golden record is materialized per entity, and results are written back to the client's SQL Server as exactly one new table — the source is never modified.\n\nA Flask + React control plane lets non-technical analysts review ambiguous pairs side-by-side, score confidence, and feed corrections back as training signal. A separate worker service claims queued runs with FOR UPDATE SKIP LOCKED so multiple runs never collide. Config-driven IdentitySchema means no column name is hard-coded — the same engine runs on any 64-column source with a config change.",
    architecture:
      "Browser → React SPA → nginx (/api proxy + SSE) → Flask REST API (JWT auth) → worker service (queued runs, FOR UPDATE SKIP LOCKED) → 12-step engine C1–C12: load → clean → normalize → block → compare → EM train → predict → pair decisions → cluster → golden record → write-back → output.\n\nPostgreSQL stores entities, entity_members, field-level provenance, record-cell provenance, and an append-only audit_log. Client SQL Server receives one output table per run: <source>_fixed_<run_id>. Model artifacts are cached between runs.",
    features: [
      "Fellegi–Sunter probabilistic matching trained with Expectation-Maximization",
      "Blocking-key reduction: billions of candidate pairs → millions of real comparisons",
      "Human review queue for ambiguous pairs with confidence scoring",
      "Config-driven IdentitySchema — zero hard-coded column names",
      "Non-destructive writes with full provenance and append-only audit trail",
      "Docker Compose one-command deployment (Flask, React, PostgreSQL, SQL Server)",
    ],
    metrics: [
      "64-column source table",
      "~200M pairs → ~90k via blocking",
      "10k formules → ~3k entities (demo)",
      "8,676 records grouped in minutes",
      "130k cells gap-filled",
    ],
  },
  "dataops-platform": {
    description:
      "Expleo Tanger internship (Jul–Aug 2025): a complete data orchestration platform automating ETL over Microsoft's AdventureWorks database with Apache Airflow 3.0, landing in a layered Snowflake warehouse that feeds BI dashboards.\n\nFifteen domain DAGs cover daily sales and revenue, CLV+RFM customer segmentation, inventory with predictive stockout alerts, territory performance, production quality monitoring, and finance/HR analytics. Every DAG has explicit task dependencies, retry policies, and idempotent writes — re-running a failed run cannot duplicate rows.\n\nOn top of the pipelines sits a data-quality system: automated checks, anomaly detection, and ETL execution logging. The platform hit 97.8% DAG success rate against a >95% target, averaging 18 minutes per daily run. I also wrote the technical learning documentation the team still uses.",
    architecture:
      "5 layers: (1) Source — AdventureWorks, 70+ tables, 20 used across DAGs; (2) Orchestration — Airflow 15 DAGs with dependencies, retries, idempotent writes; (3) Infrastructure — Docker Compose: webserver, scheduler, Celery worker, Postgres metadata DB, Redis broker; (4) Storage — Snowflake, 3 schemas (dbt_schema, dbt_warehouse, dbt_analytics), 25 tables; (5) Analytics — BI dashboards on the mart layer.\n\nA data-quality layer runs checks and anomaly detection after loads, with ETL run logging for auditability. Worked Agile/Scrum with the Expleo data team.",
    features: [
      "15 domain DAGs: sales, CLV/RFM, inventory, territory, production, finance, HR",
      "Idempotent writes — failed runs re-execute without duplicating rows",
      "Snowflake layered warehouse: raw → staging → marts across 3 schemas",
      "Automated data-quality checks + anomaly detection after loads",
      "ETL execution logging and monitoring dashboards",
      "Team-facing technical documentation for Airflow/Snowflake onboarding",
    ],
    metrics: [
      "15 DAGs",
      "70+ source tables (20 used)",
      "25 warehouse tables",
      "2.3 GB processed",
      "97.8% DAG success rate",
      "18 min avg daily run",
      "99.2% availability",
    ],
  },
  "nids-cic-ids2017": {
    description:
      "Final-year capstone (PFA 2025-2026, EMSI — with Alae Moussa Laachiri and Rania Oulmidi): an end-to-end network intrusion detection system on the CIC-IDS2017 dataset, from cahier des charges through EDA, preprocessing, training, streaming integration, and a live dashboard.\n\nThree model families: Random Forest as a robust multiclass baseline, XGBoost with Optuna hyperparameter search for tabular accuracy (0.9980 accuracy, 0.9371 F1-macro), and a CNN-BiLSTM-Transformer for sequential flow patterns. SHAP provides interpretability — which features actually drive each attack classification.\n\nThe real-time path: a Python producer emits one JSON record per network flow into Kafka topic network-flows; Spark Structured Streaming consumes it, a Random Forest gate classifies every flow (benign → NORMAL), and attacks are refined by XGBoost + the deep model before landing in MongoDB. A Streamlit dashboard shows KPI cards, per-minute traffic, attack distributions, and a searchable live predictions table.",
    architecture:
      "producer/kafka_producer.py streams rows from X_test.csv (44 features) → Kafka topic network-flows → spark/spark_streaming_prediction.py: RF gate (15 classes) → NORMAL or → XGBoost (14 attack classes) + CNN-BiLSTM-Transformer (11 classes) → MongoDB ids_db.predictions (flow_id, timestamp, true_label, rf/xgb/dl predictions, status, model_used) → ui/dashboard.py Streamlit on localhost:8501.\n\nRepo layout: producer/, spark/, ui/, data/, ml_ready/, output_clean_split/. Feature selection was 3-stage: variance threshold → correlation analysis → feature importance, reducing 44 raw features to the discriminative subset.",
    features: [
      "Three model families: Random Forest, XGBoost (Optuna-tuned), CNN-BiLSTM-Transformer",
      "Kafka → Spark Structured Streaming real-time inference path",
      "Two-stage classification: RF gate, then attack-specific XGB + DL refinement",
      "SHAP explainability on model decisions",
      "Streamlit live dashboard: KPIs, timelines, searchable predictions",
      "3-stage feature selection (variance → correlation → importance)",
    ],
    metrics: [
      "3M+ flow records (CIC-IDS2017)",
      "44 features, 15 classes",
      "XGBoost: 0.9980 accuracy, 0.9371 F1-macro",
      "Detection latency in seconds",
      "3-person team, full ML lifecycle",
    ],
  },
  "data-warehouse-etl": {
    description:
      "Decisional-SI module project (2025-2026): TP1–TP7 dimensional modelling labs (star schema, DataMart, Pentaho ETL, Power BI/DAX) culminating in a full pipeline that turns a 27-sheet higher-education Excel dataset into a governed Snowflake star-schema warehouse with interactive dashboards.\n\nThe pipeline: Google Colab notebook does EDA and cleaning (type fixes, grade-range validation 0–20, attendance coherence checks, satisfaction-weight normalization) producing 27 clean CSVs → Python script uploads to Snowflake RAW → dbt project dw_ecole builds 26 staging views and 10 mart models (~45 tables) in a proper star schema → Power BI connects for 10 interactive dashboard pages with 50+ DAX measures.\n\nQuality gates run between layers: row-count assertions, grade-range checks, session-time coherence — bad data is caught where it enters, not where it's consumed.",
    architecture:
      "Dataset_PowerBI_Ecole_not_cleaned.xlsx (27 sheets) → notebooks/01_EDA_and_Cleaning.ipynb → csv/*.csv (27 files, ~21k rows) → scripts/upload_to_snowflake.py → Snowflake RAW (27 tables) → dbt: models/staging/* (26 views) + mart_* models (10 marts, ~45 tables total) → Power BI (10 pages).\n\nStar schema: fact tables (grades, attendance, enrollment) surrounded by dimension tables (student, course, semester, department). Automated checks: grade ranges 0–20, attendance/session-time coherence, satisfaction-weight normalization, row-count assertions between layers.",
    features: [
      "Full Excel → cleaning → Snowflake → dbt → Power BI pipeline",
      "dbt project with 26 staging views and 10 mart models",
      "Star schema: facts surrounded by conformed dimensions",
      "Data-quality gates between every layer",
      "10 Power BI pages: enrollment, grades, attendance heatmaps, funding",
      "TP1–TP7 labs: Pentaho, Talend, DataMart, DAX foundations",
    ],
    metrics: [
      "27 Excel sheets → 27 CSVs → 27 RAW tables",
      "~21,000 rows",
      "~45 tables after dbt",
      "10 dashboard pages",
      "50+ DAX measures",
    ],
  },
  chatsphere: {
    description:
      "Embeddable, context-aware AI chatbot: any website adds one <script> tag and gets a bot that knows the content of the page it sits on. Framed as a startup (Module 12 Entrepreneuriat) with a freemium → Pro → Enterprise + per-message billing model.\n\nThe server extracts the host page's URL, title, and visible DOM content and prepends it to the conversation context — so the model answers about the page it's embedded on, not generically. The LLM backend is pluggable by one env var: Ollama (llama3) for fully-local inference when privacy matters, OpenRouter for frontier models when quality matters.\n\nA React admin dashboard creates and configures bots (name + per-page system prompt) and returns a Bot ID + embed snippet. Responses stream over WebSocket as tokens generate — instant-feeling even on slower models. Self-hosted by design: page content never leaves the owner's server.",
    architecture:
      "Host site loads widget/widget.js via <script> → WebSocket → backend/server.js (Express: REST API + WebSocket, bot configs, token streaming) → Ollama (local) or OpenRouter API (cloud). dashboard/ is a React (Vite) admin for bot configuration. demo.html is the integration demo.\n\nContext flow: widget captures page URL + title + visible DOM → server prepends to conversation history → LLM responds → tokens stream back over the same socket.",
    features: [
      "One-line embed — no build step or framework required on the host site",
      "Page-context injection: URL, title, and visible DOM prepended to prompts",
      "Pluggable LLM: Ollama (privacy) or OpenRouter (quality), one env var",
      "Real-time token streaming over WebSocket",
      "React dashboard: per-bot, per-page system prompts",
      "Self-hosted SaaS model: freemium → Pro → Enterprise + per-message billing",
    ],
    metrics: [
      "One <script> tag to integrate",
      "2 LLM backends (Ollama / OpenRouter)",
      "Startup pitch: e-commerce, SMEs, clinics, EdTech, agencies",
    ],
  },
  homelab: {
    description:
      "Three-server self-hosted infrastructure running 15+ production services behind a single public edge — my personal cloud, built so the things I depend on aren't someone else's uptime problem.\n\nThe hub is a Contabo VPS: public DNS terminates at Traefik with automatic Let's Encrypt TLS; WireGuard forms the data-plane mesh (Tailscale as control-plane fallback). Two spokes join the mesh: Homeserver (i5-3570, 9.6GB RAM) running Nextcloud, Jellyfin, Hesab, and a full Mailu mail stack; Monitor-Server (1GB Debian box) running the private Docker Registry, Uptime Kuma, and Beszel.\n\nEverything is declared — adding a service means adding a Traefik label, not an nginx config. Self-hosted SMTP/IMAP with SPF/DKIM/DMARC verified. UFW + Fail2Ban + key-only SSH on every node. Telegram alerts fire from 14 Uptime Kuma monitors. Dokploy gives git-push deployments with a dashboard — the Vercel workflow, on my own metal.",
    architecture:
      "Internet → DNS A naoufalelouahabi.com → Contabo VPS 169.58.140.151 (SSH :50223, WireGuard hub 10.20.0.1 :51820/udp, Tailscale 100.124.242.29) → Traefik :443 (Let's Encrypt, dynamic /etc/dokploy/traefik/dynamic/*.yml) → WireGuard spokes: Homeserver 10.20.0.2 (Nextcloud, Jellyfin, Hesab :3003, Mailu 25/80/443/110/143/465/587/993/995/4190) and Monitor-Server 10.20.0.3 (Registry :5000, Uptime Kuma :3001, Beszel Hub :8090).\n\nMail path: Contabo HAProxy TCP relay (PROXY v2) + Postfix smarthost 10.20.0.1:2525 + Traefik SNI passthrough. 5 Dokploy projects, 12 documented subdomains, 14 Kuma monitors with Telegram alerts.",
    features: [
      "Hub-and-spoke WireGuard mesh with Tailscale fallback",
      "Traefik host-based routing: add a service = add a label",
      "Git-push deployments via Dokploy with dashboard",
      "Self-hosted mail: Mailu + SPF/DKIM/DMARC + HAProxy TCP relay",
      "UFW + Fail2Ban + key-only SSH on every node",
      "14 Uptime Kuma monitors → Telegram alerts; Beszel metrics; private registry",
    ],
    metrics: [
      "3 servers (VPS + Homeserver + Monitor)",
      "5 Dokploy projects",
      "12 subdomains with auto-TLS",
      "14 health monitors",
      "453 GB disk at 62%",
    ],
  },
  "wordlist-autocomplete": {
    description:
      "Obsidian plugin providing domain-aware autocomplete from enriched JSON wordlists — published on the Obsidian Community Plugins registry after passing review.\n\nEach dictionary entry carries metadata: { word: { domain, category, frequency } }. Matching runs in three modes — prefix, shorthand ('orcl' → 'Oracle'), and contains — through a single ranking pass. Usage is recorded to personalized-suggestions.json, so suggestions re-rank per context: the same word ranks differently in a database note vs a networking note.\n\nThe wordlist workflow itself is documented: generate categorized frequency wordlists with an LLM, collect into .txt, convert to JSON with a bundled Python script, enable per-file in settings. Also ships a file-correction command that scans the active note and fixes misspellings against the loaded dictionaries, plus text-case transformation commands.",
    architecture:
      "JSON dictionaries { word: { domain, category, frequency } } → matcher (3 trigger modes) → ranking pass (file order / category priority / frequency / alphabetical) → suggestion list; usage logged to personalized-suggestions.json for per-context re-ranking.\n\nTypeScript built with esbuild; distributed as main.js + manifest.json + styles.css via Community Plugins, manual install, and GitHub releases (versions.json). Dictionary management UI: per-file enable/disable, drag-and-drop priority reordering, bulk toggles.",
    features: [
      "Prefix, shorthand, and contains matching — three triggers, one ranking pass",
      "Contextual learning from your own picks (personalized-suggestions.json)",
      "4 ranking strategies: file order, category, frequency, alphabetical",
      "Dictionary manager: drag-drop priority, per-file toggles, bulk ops",
      "File-correction command: fix misspellings against dictionaries in one run",
      "Case commands: lowercase/UPPERCASE/Capitalize/sentence case, space-to-accept",
    ],
    metrics: [
      "Published on Obsidian Community registry",
      "Trigger length configurable 1–10",
      "3 matching modes, 4 ranking strategies",
      "Bundled Python wordlist→JSON converter",
    ],
  },
  "folder-focus": {
    description:
      "Obsidian plugin that hides and shows folders in the file explorer to cut visual noise in large vaults — desktop and mobile compatible (isDesktopOnly: false).\n\nCommands: hide/show individual folders via a searchable picker, hide all, unhide all, bulk hide, bulk keep (multi-select modal with confirm), and keep-specific mode — hide everything except the chosen folder. State persists in plugin data.json as { hiddenFolders: [] } via a PluginSettingTab.\n\nTwo modal classes do the work: FolderPickerModal for single choice and BulkFolderPickerModal for Set-based multi-selection. Explorer re-render is driven by Obsidian file-manager leaf manipulation.",
    architecture:
      "JavaScript on the Obsidian Plugin API: Modal, PluginSettingTab, Notice, debounce. Two modal classes — FolderPickerModal (single, searchable input filter) and BulkFolderPickerModal (Set-based multi-select with confirm). Hidden-folder state persisted in data.json via plugin data; explorer refresh via file-manager leaf manipulation. minAppVersion 0.15.0.",
    features: [
      "Hide/show individual folders via searchable picker modal",
      "Bulk operations: hide all, unhide all, bulk hide, bulk keep",
      "Keep-specific mode: hide everything except one folder",
      "Persistent hidden-folder list across sessions (plugin data.json)",
      "Works on desktop and mobile Obsidian",
    ],
    metrics: [
      "2 modal classes",
      "5+ commands",
      "Mobile-compatible (isDesktopOnly: false)",
    ],
  },
  "subject-manager": {
    description:
      "Obsidian plugin that turns the vault into a full academic management system for the EMSI engineering cycle — subjects, notes, projects, assignments, exams, and todos, each linked to its university course. Currently in construction, driven by a full written specification rather than a big-bang build.\n\nSubject-first data model: subjects carry metadata (name, code, professor, semester, credits) with CRUD, archive, and per-type templates (course / project / research). Everything else — notes, projects, assignments, exams, todos — attaches to a subject.\n\nSix modules ship independently: note organization (auto-tagging by subject code, folder scaffolds, templates), project tracking (milestones, completion %, estimated vs actual time, status lifecycle planning→active→review→completed), assignment tracking (grades, feedback, late-penalty calculation), exam tracking (study plans with countdown, practice scores), and per-subject todos (4-level priorities, recurring).",
    architecture:
      "TypeScript + Obsidian Plugin API + esbuild. Subject-first model: Subject entity (metadata + templates) owns Note, Project, Assignment, Exam, Todo children. 6 independently-shipping modules: ① Subject CRUD ② Note organization ③ Project tracking ④ Assignment tracking ⑤ Exam tracking ⑥ Todo management.\n\nSpec-driven: plugin_constructions.md defines each module's data shapes and behaviors before code — deliberate scoping so each module ships complete instead of half of all six.",
    features: [
      "Subject CRUD with code/professor/semester/credits + per-type templates",
      "Note auto-tagging by subject code with folder scaffolds",
      "Project tracking: milestones, completion %, est vs actual time",
      "Assignment tracking with grades, feedback, late-penalty calculation",
      "Exam tracking: study plans, countdowns, practice-test scores",
      "Per-subject todos: 4 priority levels, recurring tasks, calendar integration",
    ],
    metrics: [
      "6 modules, subject-first data model",
      "3 subject/template types",
      "4 todo priority levels",
      "Spec-driven, module-by-module build",
    ],
  },
  "islam-plugin": {
    description:
      "Obsidian plugin for tracking Salah (prayer) obligations — specifically qada, the make-up prayers owed for missed ones. Maintains counts of historical (\"old\") and recent (\"active\") missed prayers per prayer with a dashboard view and CRUD commands.\n\nThe killer feature: \"Calculate Old Salahs by Time Period\" — derive missed-prayer counts from elapsed days, months, or years instead of manual tallying. Counts are stored as JSON through Obsidian's plugin data system (saveData / loadData) — no external database, no account, no network.\n\nSettings split into a Salah tab (initial counts) and a Quran tab reserved for a future reading tracker. Personal devotional tooling inside the note system I already live in — persistent, quantified, and reviewable without leaving Obsidian.",
    architecture:
      "TypeScript/JavaScript on the Obsidian Plugin API. Per-prayer counters (5 daily prayers × old/active buckets) persisted as JSON via saveData/loadData. Commands registered at plugin entry: Add Old Salah, Add Active Salah, Show Salah Dashboard — the dashboard renders a tabular overview with summary statistics. Settings tabs: Salah (initial counts) and Quran (reserved).",
    features: [
      "Per-prayer accounting split into old (historical) and active (recent)",
      "Bulk calculation from elapsed time periods",
      "Dashboard: tabular pending-prayer overview + summary stats",
      "Three commands: Add Old, Add Active, Show Dashboard",
      "Pure JSON storage via Obsidian plugin data — zero external deps",
    ],
    metrics: [
      "5 prayers × 2 buckets tracked",
      "3 core commands",
      "2 settings tabs (Quran tab reserved)",
    ],
  },
  "airbyte-minio-airflow": {
    description:
      "TP3 for Module 03 — Architectures des Données (2025-2026): a fully containerized Extract-Load pipeline built from three open-source tools with no custom ingestion code.\n\nCSV source → Airbyte extracts and loads via managed connectors (schema drift handled for free) → lands raw in a MinIO bucket, an S3-compatible data lake whose endpoint can swap to real AWS S3 without code changes → Airflow DAG pipeline_ingestion.py triggers syncs on schedule.\n\nThree web UIs for monitoring: Airbyte :8000, MinIO Console :9001, Airflow :8080. The whole environment reproduces with docker compose up — the point of the lab was connector-based EL done properly, not hand-rolled pandas scripts.",
    architecture:
      "CSV source → Airbyte (abctl, connector-based extraction + load) → MinIO bucket (S3-compatible data lake, API :9000, console :9001) → Airflow DAG pipeline_ingestion.py (:8080) orchestrates syncs. Multi-container docker-compose environment: Airbyte + MinIO + Airflow. Raw zone on object storage — endpoint swappable to AWS S3.",
    features: [
      "Connector-based EL — schema drift handled by managed connectors",
      "S3-compatible MinIO raw zone, swappable to AWS S3",
      "Airflow DAG-driven sync orchestration",
      "Three monitoring UIs (Airbyte, MinIO, Airflow)",
      "Full environment reproducible with docker compose up",
    ],
    metrics: [
      "3 services containerized",
      "1 DAG, 1 CSV source",
      "4 documented ports (8000/9000/9001/8080)",
    ],
  },
  "dna-mapreduce": {
    description:
      "Projet final for Module 02 — Écosystème BigData 1 (2025-2026): end-to-end distributed analysis of Human Microbiome Project FASTA sequences, delivered by a 5-member team across 5 sequential pipeline stages.\n\nM1 parses and cleans FASTA files into JSONL and loads them into HDFS. M2 runs Hadoop Streaming k-mer counting (mapper emits k-mer, reducer aggregates) plus DNA pattern matching. M3 computes approximate cosine similarity between sequences with Spark LSH to retrieve candidate pairs, then runs distributed Smith-Waterman alignment on just those candidates — the classic big-data trick of cheap-retrieval + expensive-precision.\n\nM4 trains KMeans clustering and a RandomForest classifier over the k-mer feature space; M5 produces visualizations and the final report. M4 and M5 run in parallel once M3 completes; run_pipeline.sh orchestrates the whole chain.",
    architecture:
      "M1: parse_fasta.py + load_hdfs.sh → sequences_kept.jsonl on HDFS. M2: mapper-corrected.py (JSONL → k-mer counts) + pattern_matcher.py. M3: reducer-corrected.py → HDFS; similarity.py (Spark LSH approximate cosine → similarity.csv); compute_alignment.py (distributed Smith-Waterman on candidate pairs). M4: kmeans_model.py + random_forest.py (HDFS I/O). M5: visualisation.py + report. Dependency chain M1→M2→M3→(M4∥M5), orchestrated by run_pipeline.sh.",
    features: [
      "k-mer vectorization of DNA sequences over Hadoop Streaming",
      "Spark LSH for approximate cosine similarity (candidate retrieval)",
      "Distributed Smith-Waterman alignment on LSH candidate pairs only",
      "KMeans clustering + RandomForest classification on k-mer features",
      "Orchestrated 5-stage pipeline with explicit dependency chain",
    ],
    metrics: [
      "5.7 GB FASTA/JSONL",
      "5 pipeline stages",
      "5-member team",
      "Human Microbiome Project data",
    ],
  },
  "pagerank-hdfs": {
    description:
      "Two complementary practical labs (TPs) for Module 03 — Architectures des Données (2025-2026): HDFS administration on a live cluster, plus PageRank implemented from scratch as iterative distributed MapReduce.\n\nTP1 covers the storage layer properly: put, get, cat, cp, mv, rm, chmod, controlled replication, and namespace administration on a real HDFS cluster — because you can't debug MapReduce jobs if you can't debug the filesystem under them.\n\nTP2 implements the PageRank power iteration on YARN: the mapper emits (target, rank/numOutLinks) for every outgoing link; the shuffle groups contributions by target node; the reducer sums them and applies PR = (1-d)/N + d·Σ. Ranks are written back to HDFS and the loop repeats until deltas fall below epsilon (damping factor 0.85).",
    architecture:
      "TP1: HDFS CLI operations on a live cluster (file/namespace admin, replication control). TP2: iterative MapReduce on YARN — map emits (target, rank/numOutLinks), shuffle groups by target, reduce sums + applies PR = (1-d)/N + d·Σ with d=0.85, ranks written back, loop until delta < epsilon. Python Hadoop Streaming scripts, no JVM code.",
    features: [
      "Live HDFS administration: replication control, namespace ops",
      "PageRank from scratch: sum-by-key formulation in Map/Reduce",
      "Power-iteration convergence loop with damping factor + epsilon",
      "Documented commands + full MapReduce code",
    ],
    metrics: [
      "2 TPs (storage + compute)",
      "Damping factor 0.85",
      "Iterative convergence to epsilon",
    ],
  },
  "bibliometrics-mapreduce": {
    description:
      "TP4 binôme (2024-2025, with Alae Moussa Laachiri) for Module 02 — Écosystème BigData 1: distributed bibliometric analysis of an AI-in-healthcare publication corpus, with a deliberate dual-implementation validation strategy.\n\nMy side: real Hadoop Streaming on the cluster — mapper_keywords.py emits (keyword, 1), reducer_sum.py aggregates and ranks, running on HDFS/YARN inside a Dockerized Hadoop (NameNode, DataNode, ResourceManager, NodeManager). Alae's side: exploratory analysis and a simulated MapReduce in Python/pandas with matplotlib visuals.\n\nThe report compares both implementations: same rankings from pandas and from Hadoop means the cluster output can be trusted. Five jobs total: keywords, publication years, top countries, most prolific authors, plus the exploratory EDA — with a research-gap write-up on using Hadoop for scientific corpora.",
    architecture:
      "Dockerized Hadoop: NameNode + DataNode (storage), ResourceManager + NodeManager (compute). Real branch: mapper_keywords.py → reducer_sum.py via Hadoop Streaming on HDFS/YARN. Validation branch: analysis.py, mapreduce_keywords.py, mapreduce_years.py in pandas + matplotlib. Outputs: keyword frequency ranking, publications per year, top countries, prolific authors. Shared report compares both implementations.",
    features: [
      "5 MapReduce jobs: keywords, years, countries, authors, exploratory EDA",
      "Dual validation: pandas simulation vs real Hadoop Streaming",
      "Dockerized 4-service Hadoop cluster debugging",
      "Research-gap write-up on Hadoop for scientific corpora",
    ],
    metrics: [
      "5 MapReduce jobs",
      "2-person binôme split (Hadoop vs pandas)",
      "AI-in-healthcare publication corpus",
    ],
  },
  "sentiment-imdb": {
    description:
      "Contrôle Continu (binôme, 2025-2026) for Module 04 — Stratégies d'Exploration de Données: a text-mining pipeline classifying IMDB movie reviews as positive or negative, with a deliberate side-by-side comparison of two vectorization strategies.\n\nSix stages: load and explore the balanced 50,000-review dataset; NLP preprocessing (HTML tag removal, punctuation stripping, stopword removal, stemming); vectorize twice — Bag of Words and TF-IDF, 5,000 features each; reduce with Truncated SVD (5,000 → 100 dimensions) for latent topics and overfitting control; train Logistic Regression separately on each representation; evaluate both on Accuracy, Precision, Recall, and F1.\n\nResult: TF-IDF beats Bag of Words on every metric — as theory predicts (down-weighting ubiquitous terms), but the point of the lab was proving it with ablations rather than asserting it.",
    architecture:
      "6-stage pipeline: (1) load balanced dataset (25k pos / 25k neg); (2) NLP preprocessing — HTML/punctuation/stopwords/stemming; (3) vectorization: Bag of Words vs TF-IDF (5k features each); (4) Truncated SVD 5,000 → 100 dims; (5) Logistic Regression trained separately per vectorization; (6) comparative evaluation: Accuracy, Precision, Recall, F1. Python, pandas, scikit-learn, NLTK, matplotlib/seaborn.",
    features: [
      "Side-by-side BoW vs TF-IDF comparison with ablations",
      "Truncated SVD dimensionality reduction (5,000 → 100)",
      "Full NLP preprocessing chain with NLTK stemming",
      "Balanced dataset — metrics that are actually meaningful",
      "Comparative evaluation across 4 metrics",
    ],
    metrics: [
      "50,000 reviews (25k/25k balanced)",
      "5,000 features → 100 SVD dims",
      "TF-IDF wins on every metric",
    ],
  },
  "excel-extractor": {
    description:
      "Self-serve data API: upload any Excel or CSV file, get a browsable, queryable REST endpoint backed by PostgreSQL in two calls. Built because I kept writing the same 'parse spreadsheet → clean → load' code for every new dataset.\n\nThe FastAPI service (~370 lines) exposes 8 endpoints: list tables, table columns, full schema, paginated data, NaN-safe statistics (null counts, mean/min/max), parameterized search (exact / regex / case-sensitive with safe SQL WHERE), upload (xlsx/xls/csv), and process-file. pandas handles mixed types and locale-dependent date formats; SQLAlchemy to_sql with if_exists=\"replace\" makes re-ingestion idempotent. An interactive CLI front-end wraps the same API for terminal use.\n\nDocker Compose ships PostgreSQL plus an Airflow scheduler + webserver — the DAG layer for scheduled re-ingestion is scaffolded as the honest next step, not claimed as built.",
    architecture:
      "api.py (~370 lines FastAPI: CRUD, schema, stats, search, upload, process) · cli.py (interactive list/describe/query menu) · docker-compose.yml (PostgreSQL + Airflow) · split requirements. Flow: POST /upload (xlsx/xls/csv → ./data) → POST /process-file → pandas read_excel/read_csv → to_sql(if_exists=\"replace\") → table data_<name> in PostgreSQL; 8 read/query endpoints over it.",
    features: [
      "Upload → process → query in two API calls",
      "8 REST endpoints incl. NaN-safe stats and parameterized search",
      "Mixed types + locale-dependent dates handled by pandas",
      "Idempotent replace — re-ingestion can't duplicate rows",
      "Interactive CLI front-end over the same API",
      "Airflow scaffolded in compose for scheduled re-ingestion",
    ],
    metrics: [
      "~370 lines of API code",
      "8 endpoints",
      "2 compose services (PostgreSQL + Airflow)",
    ],
  },
  "sma-hospital": {
    description:
      "TP4 for Module 06 — IA Distribuée et Systèmes Multi-Agents (2025-2026, EMSI, teacher Kenza Chaoui): a JADE multi-agent simulation of an intelligent hospital where autonomous agents coordinate a distributed medical environment with no central controller.\n\nNine agents across three hierarchy levels. L1: Agent Directeur (cognitive) makes strategic decisions and arbitrates inter-service conflicts. L2: Chef Urgences (hybrid), Chef Ressources (cognitive, bed/equipment allocation), Chef Personnel (hybrid, staff planning). L3: Triage (reactive, P1/P2/P3 classification), Surveillance (learning, continuous vitals), Lits (reactive, bed availability), Equipements (reactive, machine state), Planning (cognitive, exam scheduling).\n\nA shared Blackboard holds global hospital state accessible to L2 and the Director. Coordination happens entirely through FIPA ACL messages (request/inform/agree/refuse/propose) — the patient-intake scenario (triage → surveillance → bed/equipment allocation → exam planning) emerges from local interactions rather than orchestration.",
    architecture:
      "3-level agent hierarchy, 9 agents, JADE behaviors (CyclicBehaviour, TickerBehaviour, WakerBehaviour). L1 Supervision: Directeur (cognitive). L2 Coordination: Chef Urgences (hybrid), Chef Ressources (cognitive), Chef Personnel (hybrid). L3 Execution: Triage (reactive), Surveillance (learning), Lits (reactive), Equipements (reactive), Planning (cognitive). Shared Blackboard = global state for L2+. All inter-agent communication via FIPA ACL messages.",
    features: [
      "9 agents across 3 hierarchy levels with 4 agent-type classes",
      "FIPA ACL messaging: request/inform/agree/refuse/propose",
      "Shared blackboard for global hospital state",
      "Patient-intake scenario: triage → surveillance → beds → exams",
      "Zero central controller — coordination emerges from local interactions",
    ],
    metrics: [
      "9 agents, 3 hierarchy levels",
      "5 behavior/agent-type classes",
      "JADE + FIPA ACL",
    ],
  },
  "sma-room-booking": {
    description:
      "Two-part JADE mini-project (Module 06, 2025-2026) building a multi-agent room reservation system where no double-booking emerges from the protocol, not from a WHERE clause.\n\nPart 1: three reactive agents — ProfAgent, SalleAgent, NotificationAgent — exchanging ACL messages for immediate reservation answers. Part 2 upgrades to a 5-agent processing pipeline: ProfAgent emits demand (type/students/slot/equipment); PlanningAgent (proactive, TickerBehaviour) monitors planning and detects conflicts; PrioriteAgent ranks demands EXAM > TP > COURS; OptimisationAgent selects the best room by capacity + equipment; NotificationAgent reports the outcome.\n\nThe test scenario: 3 simultaneous demands with 2 conflicting on the same 10h slot — conflicts detected, priorities applied, optimal rooms assigned, all through propose/counter-propose negotiation until agreement or exhaustion.",
    architecture:
      "Part 1: 3 reactive agents (Prof/Salle/Notification) over ACLMessage. Part 2: 5-agent pipeline — ProfAgent (reactive, demand emission) → PlanningAgent (proactive, TickerBehaviour conflict detection) → PrioriteAgent (proactive, EXAM>TP>COURS ranking) → OptimisationAgent (proactive, capacity+equipment selection) → NotificationAgent (reactive). SQLite for persistence. Java + JADE.",
    features: [
      "Conflict detection via proactive PlanningAgent monitoring",
      "Priority ranking: EXAM > TP > COURS",
      "Optimal room assignment by capacity + equipment fit",
      "Propose/counter-propose negotiation until agreement",
      "No double-booking emerges from the agent protocol itself",
    ],
    metrics: [
      "2 parts, 3 → 5 agents",
      "Test: 3 concurrent demands, 2 slot conflicts",
      "Java + JADE + SQLite",
    ],
  },
  "personal-assistant": {
    description:
      "Flask-based local-first AI agent powered by an on-device Ollama LLM — persistent memory, shell command execution, filesystem operations, and Obsidian vault integration, with zero cloud APIs and zero API keys.\n\nThe Agent class loads YAML config, initializes a SQLite memory table (id, type, key, value, created_at) for cross-session history, and processes messages through a modular tool registry: filesystem.py (read/write/list/search), obsidian.py (create vault notes with folder management), shell.py (command execution with output capture).\n\nAI integration: regex detection of a COMMAND: prefix in the model's response triggers execution. Sudo is deliberately two-step — the AI suggests the command, the user supplies the password, which is piped via echo | sudo -S. Every subprocess runs with a 10-second timeout and full stdout/stderr capture; connection errors degrade gracefully.",
    architecture:
      "Flask REST API (POST /chat) → Agent class (YAML config + SQLite memory init) → Ollama (localhost:11434) → response parsed for COMMAND: prefix → tool registry: filesystem.py / obsidian.py / shell.py. Memory table: id, type, key, value, created_at. Subprocess: 10s timeout, stdout/stderr capture; sudo via two-step echo | sudo -S. Fully local inference.",
    features: [
      "Persistent cross-session memory (SQLite)",
      "Shell command execution from chat with 10s timeout",
      "Secure two-step sudo flow — password never touches the model",
      "Obsidian note creation with folder management",
      "Filesystem ops: read/write/list/search",
      "100% local inference — no cloud, no API keys",
    ],
    metrics: [
      "1 endpoint (POST /chat)",
      "3 tool modules",
      "10s subprocess timeout",
      "Zero external API calls",
    ],
  },
  "invoice-platform": {
    description:
      "Next.js invoicing app for Moroccan small businesses — a reusable product/service catalog (MAD, HT prices, TVA rates) from which invoices are generated. Deployed in production at invoice.naoufalelouahabi.com on my Contabo VPS.\n\nCatalog-first design: products and services are defined once (name, description, unit, HT unit price, TVA rate, tax-exempt flag) and reused across invoices. CRUD + soft-delete archive. Money is stored in minor units (unitPriceMinor) and tax rates in basis points (taxRateBps) — floating-point money bugs are designed out at the schema level. TVA applies at line or invoice level.\n\nInvoice lifecycle: draft → sent → paid, with client history and PDF export. Server components and server actions keep data access in src/server; domain money utilities live in src/domain/invoice.",
    architecture:
      "Next.js App Router + React + TypeScript. src/app pages · src/server data-access/server actions (listProducts, archiveProduct, …) · src/domain/invoice money utilities (formatMoney, invoice rules) · src/components (ProductForm, tables, empty states) · Prisma schema + client over PostgreSQL. Deployed as a Dokploy application behind Traefik with Let's Encrypt TLS (port 3007).",
    features: [
      "Catalog-first: define products once, reuse across invoices",
      "Money in minor units + tax in basis points — no float errors",
      "Line-level or invoice-level TVA",
      "Draft → sent → paid lifecycle with client history",
      "PDF export",
      "Soft-delete archive for catalog entries",
    ],
    metrics: [
      "Live at invoice.naoufalelouahabi.com",
      "MAD / HT / TVA — Moroccan tax model",
      "Prisma + PostgreSQL",
    ],
  },
  poolsplit: {
    description:
      "Group expense-settling web app (internal name Hesab, live at hesab.naoufalelouahabi.com) for planning friend outings and computing who owes whom via debt-graph simplification — 15 pairwise transfers collapse to 3.\n\nModelled properly: 22 Prisma models covering Users, Groups, Outings, Activities, LineItems, UsageRecords, Confirmations, Corrections, Settlements, and an ActivityEvent audit log. FIXED (per-unit) vs VARIABLE (line-item) expense modes; contributions tracked separately from payments so the ledger stays honest.\n\nDebt simplification computes the minimum set of transfers to settle all balances. Invites work via public IDs or QR codes; settlements can be shared via public links without an account. The UI is trilingual — English, French, and Arabic with full RTL — with friendship colour modes and dark mode.",
    architecture:
      "Next.js App Router + TypeScript · Prisma + PostgreSQL (22 models: User, Group, GroupMember, Outing, Activity, LineItem, UsageRecord, UsageConfirmation, Settlement, SettlementTransfer, CorrectionRequest, ActivityEvent, …) · jose (JWT) + bcryptjs auth · Zod validation · next-intl (EN/FR/العربية + RTL) · qrcode + react-zxing for invites · Docker + Dokploy deployment.",
    features: [
      "Debt-graph simplification: minimum transfers to settle everything",
      "22-model Prisma schema — groups → outings → activities → usage → settlement",
      "FIXED vs VARIABLE expense modes",
      "QR code + public-ID invites; public settlement links",
      "Trilingual UI with full RTL (EN/FR/Arabic)",
      "Wallet: deposits, balances, contribution history",
    ],
    metrics: [
      "22 Prisma models",
      "15 pairwise transfers → 3 simplified",
      "3 languages incl. full RTL",
      "Live at hesab.naoufalelouahabi.com",
    ],
  },
  "format-fusion": {
    description:
      "Full-stack file-conversion web app covering 200+ formats across images, documents, audio, video, archives, and e-books — with batch processing, real-time progress, an admin dashboard, and a built-in blog. Written up with MONETIZATION_PLAN.md and MARKETING_PLAN.md as a monetizable SaaS.\n\nThe routing rule: conversions that can run in the browser do there — private, instant, no upload. Everything else hits the server queue. Flask REST API + SQLite + JWT auth on the backend; React 18 + TypeScript + Vite + Tailwind + shadcn/ui on the frontend.\n\nBatch mode drops 50 files in and gets 50 converted files back. The admin dashboard manages files and content; the blog has categories and featured posts. Mobile-first responsive design throughout.",
    architecture:
      "Two-tier conversion: client-side for supported in-browser formats (privacy by architecture) · server-side Flask queue for the rest (Pillow-backed processing). Frontend: React 18 + TS + Vite + Tailwind + shadcn/ui SPA → Flask REST API → SQLite. JWT auth + file encryption. Admin dashboard + markdown blog layer. Railway deployment docs.",
    features: [
      "200+ formats: images, documents, audio, video, archives, e-books",
      "Client-side conversion where possible — no upload, private by design",
      "Batch mode: 50 files in, 50 files out",
      "Real-time conversion progress",
      "Admin dashboard + blog with categories",
      "JWT auth + file encryption",
    ],
    metrics: [
      "200+ supported formats",
      "Batch processing",
      "React + Flask + SQLite",
    ],
  },
  "django-inventory": {
    description:
      "Full-stack Django inventory app for stock, suppliers, and sales with role-based access and a full audit trail — the AuditLog is the proudest piece: every mutation records the user, timestamp, and before/after values on every field.\n\nData model: Product, Supplier, Stock, Sale, User (role), AuditLog — proper foreign keys, validation, and constraints throughout. Django Admin provides CRUD, permissions, migrations, and tests out of the box. Three roles: admin (superuser), staff, supplier.\n\nStock adjusts automatically on sales and purchases; low-stock alerts are configurable per product. Supplier management links to products; customer records track purchases. The dashboard shows key stats and recent activity straight from the audit log.",
    architecture:
      "Django (Python 3.10+) with server-rendered templates. Models: Product, Supplier, Stock, Sale, User (role), AuditLog — FKs, validation, constraints. Django Admin for CRUD/permissions/migrations/tests. Three roles (admin/staff/supplier). Vanilla JS + HTML5/CSS3 templates. Seed data: products.sql + create_users.py role accounts. PostgreSQL in production, SQLite for dev.",
    features: [
      "AuditLog: user + timestamp + before/after on every mutation",
      "Role-based access: admin, staff, supplier",
      "Automatic stock adjustment on sales/purchases",
      "Configurable low-stock alerts",
      "Supplier management linked to products",
      "Dashboard with key stats + recent activity feed",
    ],
    metrics: [
      "3 roles, 6 core models",
      "Full audit trail on every mutation",
      "Seeded with products.sql + role accounts",
    ],
  },
  "social-downloader": {
    description:
      "Self-hosted web app for downloading media from 6 platforms — Instagram, TikTok, Facebook, X, YouTube, Reddit — with quality selection, audio extraction, history, and an admin/content layer. No ads, no captcha, no third-party logging.\n\nyt-dlp is the backbone: six platforms via one library with per-platform quality selection (best / medium / low) plus MP3/FLAC-only extraction via FFmpeg. Flask + SQLAlchemy over SQLite (PostgreSQL-switchable) with Gunicorn. Session-based admin auth guards a dashboard with analytics, storage/system health, a markdown blog, legal pages, and contact messages.\n\nDownload history with auto-cleanup of old files keeps disk usage honest. Built for content with rights to it: own uploads, Creative Commons, offline access to streamable material.",
    architecture:
      "Flask 3.1.1 + SQLAlchemy 2.0 over SQLite (Postgres-switchable). app.py, routes.py, utils.py, admin.py + templates/static. RESTful JSON API + session-based admin. Download pipeline: URL → yt-dlp (quality tier) → FFmpeg (audio extraction if requested) → storage with history + auto-cleanup. Admin dashboard: analytics, storage health, blog, contacts. Gunicorn in production, Docker packaged.",
    features: [
      "6 platforms via yt-dlp: Instagram, TikTok, Facebook, X, YouTube, Reddit",
      "Quality tiers + MP3/FLAC extraction via FFmpeg",
      "Download history with auto-cleanup",
      "Admin dashboard: analytics, storage/system health, blog",
      "Self-hosted — usage patterns are nobody else's business",
    ],
    metrics: [
      "6 platforms",
      "3 quality tiers + audio-only mode",
      "Flask + SQLAlchemy + yt-dlp + FFmpeg",
    ],
  },
  stockmaster: {
    description:
      "My first full-stack app (PFM 3rd-year S2, 4-person team, supervisor Omaima Zine) — inventory and supplier management with role-based dashboards, low-stock alerts, and monthly analytics. I actually used it to track my own purchases.\n\nDjango models over PostgreSQL (DB inventoryy) covering products, suppliers, stocks, and transactions, with templates, views, URL routing, auth middleware, and forms. Role dashboards for admin, staff, and fournisseur. CSV inventory import-export with column mapping — the feature that made it usable on real data, not just demo data.\n\nLow-stock thresholds are configurable per product; every transaction is tracked with timestamp and operator. Monthly analytics charts show sales, remaining stock, and top suppliers. Deployed with Nginx + Gunicorn and a Dockerfile. Looking back at the code is humbling; the product still works.",
    architecture:
      "Django + PostgreSQL (inventoryy) + HTML/CSS. Models/CRUD over products, suppliers, stocks, transactions; templates + views + URL routing + auth middleware + forms. Role dashboards (admin/staff/fournisseur). CSV import-export with column mapping. Production: Nginx + Gunicorn/uWSGI, Dockerfile present. Python 3.13.",
    features: [
      "Role dashboards: admin, staff, fournisseur",
      "CSV inventory import-export with column mapping",
      "Configurable low-stock thresholds + alerts",
      "Transaction tracking with timestamp + operator",
      "Monthly analytics: sales, stock, top suppliers",
      "Nginx + Gunicorn production deployment",
    ],
    metrics: [
      "First full-stack app",
      "4-person team, PFM 3rd-year S2",
      "PostgreSQL + Django + Docker",
    ],
  },
  "emsi-share-learn": {
    description:
      "Collaborative LMS for EMSI centralizing courses, quizzes, forums, and resources with student/teacher/admin role-based access — my largest group project (PFA capstone 2024-25, 4 members, 2 supervisors).\n\nCourses and modules are versioned and searchable; quizzes auto-grade and aggregate into per-course grades; every course has its own forum; events are scheduled with notifications. Resources go through an upload/review pipeline (PDFViewer + upload dialog with a PendingResourcesPanel for teachers).\n\nThe React frontend has 50+ reusable UI components split into admin, dashboard (Student/Teacher), editor (Code + Markdown), events, forum, resources, rooms, and ui packages, with AuthContext for token persistence and next-themes for dark/light mode in the EMSI green palette. FastAPI backend over PostgreSQL.",
    architecture:
      "React 18.2 + TypeScript 5.2 + Vite 6.3 + Tailwind 3.4 + next-themes. components/: admin (PendingResourcesPanel), dashboard (Student/Teacher), editor (Code + Markdown), events, forum, resources (PDFViewer, upload dialog), rooms, ui. Pages: Dashboard, Resources, Forum, Events, Quiz, Rooms. AuthContext for auth + token persistence. FastAPI backend + PostgreSQL. EMSI green palette, dark/light mode.",
    features: [
      "Versioned, searchable course/module centralization",
      "Auto-graded quizzes with grade aggregation",
      "Per-course forums + event scheduling",
      "Resource upload/review pipeline (teacher approval)",
      "Per-role dashboards: student, teacher, admin",
      "50+ reusable UI components, dark/light mode",
    ],
    metrics: [
      "50+ reusable components",
      "4 members, 2 supervisors (PFA capstone)",
      "React + FastAPI + PostgreSQL",
    ],
  },
  "medical-microservices": {
    description:
      "Medical appointment system built as independent services for a distributed-systems course (CC 2025-26) — each service owns its data behind REST, no shared database, graceful degradation when a service goes down.\n\nFive Spring Boot services: patientservice :8081 (patient CRUD + self-stabilization + AI insights), medecinservice :8082 (doctors/specialties + load score), rendezvous-service :8083 (central orchestrator with triple validation — patient ✓, doctor ✓, slot free ✓ — before any creation), notification :8084 (full event history: RDV_CREE, RDV_ANNULÉ…), dossiers-service (medical records). React UI: Patients, Médecins, Rendez-vous, Planning, Notifications.\n\nConcurrency handled properly: duplicate-slot protection under simultaneous requests, automatic slot block/release lifecycle, and a doctor load score (0–6 available, 7–14 normal, 15+ overloaded) that feeds booking decisions.",
    architecture:
      "5 Spring Boot services (Maven, MariaDB per service), REST inter-service calls, no shared DB: patientservice :8081 · medecinservice :8082 · rendezvous-service :8083 (orchestrator, triple validation) · notification :8084 (event log) · dossiers-service. React (Vite) UI with 5 pages. Slot lifecycle: block on request → confirm or release; duplicate-slot protection under concurrency; graceful degradation when any service is offline.",
    features: [
      "Triple validation before RDV creation: patient / doctor / slot",
      "Duplicate-slot protection under concurrent requests",
      "Automatic slot block/release lifecycle",
      "Structured event notifications (RDV_CREE, RDV_ANNULÉ…)",
      "Doctor load score: 0–6 available, 7–14 normal, 15+ overloaded",
      "Graceful degradation + service self-stabilization",
    ],
    metrics: [
      "5 backend services + React UI",
      "No shared database — service-per-resource",
      "4 documented service ports",
    ],
  },
  "m-health": {
    description:
      "Native Android patient health portal with four roles — Patient, Doctor, Medical Secretary, Admin — each with a distinct space and permissions enforced at the UI, API, and data layers (PFM 4th-year S1 2025-26).\n\nPatient space: medical records, lab results, history, medications; book/modify/cancel appointments; prescription renewal requests; secure doctor messaging with notifications. Doctor space: access to records + imaging, calendar, result comments. Secretary: appointment CRUD/confirmation, schedule visibility. Admin: user/role CRUD, database governance, security supervision.\n\nAuthorization was engineered deliberately — AUTHORIZATION_IMPLEMENTATION.md and DOCTOR_ROLE_IMPLEMENTATION.md document the layered enforcement. Sensitive data is encrypted in local SQLite; NotificationManager channels handle reminders. Built with Java, Android SDK, Retrofit, and Material Design.",
    architecture:
      "Java + Android SDK, local SQLite with encrypted sensitive fields, Retrofit, Material Design, NotificationManager channels. Four role spaces with separate interfaces; role-based authorization enforced at UI, API, and data layers (documented in AUTHORIZATION_IMPLEMENTATION.md / DOCTOR_ROLE_IMPLEMENTATION.md). test_patients_data.sql seed data.",
    features: [
      "4 role spaces: Patient, Doctor, Secretary, Admin",
      "3-layer permission enforcement: UI, API, data",
      "Patient: records, labs, appointments, prescriptions, secure messaging",
      "Doctor: records + imaging, calendar, result comments",
      "Secretary: appointment CRUD/confirmation, schedule visibility",
      "Admin: user/role CRUD, DB governance, security supervision",
    ],
    metrics: [
      "4 roles, 3 enforcement layers",
      "PFM 4th-year S1, cahier des charges + final report",
      "Encrypted sensitive data in SQLite",
    ],
  },
  "salah-android": {
    description:
      "Native Android prayer-times app for 42+ Moroccan cities with a live per-second countdown — ported from my Python desktop app so the times follow me on my phone.\n\nPrayerTimesService scrapes yabiladi.com's monthly prayer table with Jsoup; results are cached locally so the app keeps working with no signal. CitiesData holds 42+ cities with Arabic/French/English names. The engineering detail that mattered: naive setInterval drifts — remaining time is computed from timestamps, not tick counts, so the countdown survives device sleep, timezone changes, and DST.\n\nMainActivity shows a live HH:MM:SS clock + prayer grid; per-prayer reminders run through AlarmManager. Material Design 3 with an Islamic green theme; light/dark themes and notification settings are configurable.",
    architecture:
      "Java + Android. MainActivity (clock + prayer grid, activity_main.xml responsive card grid) · PrayerTimesService (Jsoup scrape of yabiladi.com monthly table) · CitiesData (42+ cities static DB) · City (AR/FR/EN names) · PrayerTimes · SharedPrefsManager. Retrofit/OkHttp for HTTP, Gson for parsing. Per-prayer AlarmManager reminders. Ported from the Python desktop app (19 components, 117+ functions).",
    features: [
      "42+ Moroccan cities with AR/FR/EN names",
      "Daily yabiladi.com scrape with cached offline fallback",
      "Timestamp-based countdown — survives sleep, timezone, DST",
      "Per-prayer AlarmManager reminders",
      "Material Design 3, Islamic green theme, light/dark modes",
    ],
    metrics: [
      "42+ cities",
      "5 daily prayers, per-second countdown",
      "Ported from a 19-component Python desktop app",
    ],
  },
  "academic-assistant": {
    description:
      "Android student-assistant app built out of necessity — tracking assignments, grades, and deadlines across courses in my head wasn't working. Schedules, grades, assignments, and events in one place with a unified timeline and live countdown to the next event.\n\nThe GPA calculator got more use than expected: weighted credits, retakes, and the Moroccan 20-point scale all needed proper handling, with per-semester history. TimelineFragment unifies classes, exams, assignments, and makeup sessions (rattrapage) chronologically with urgency indicators; ScheduleFragment shows a color-coded weekly timetable with conflict detection; AssignmentsFragment tracks status and priorities with reminders at 1 day / 3 days / 1 week.\n\nFour fragments over six models (ClassSessionModel, Assignment, Exam, Rattrapage, Grade, TimelineItem), bottom navigation, Handler-based 1-second countdown, JSON local storage — no backend, no account.",
    architecture:
      "Android API 30+, Java, Material Design 3 (dark/light). Models: ClassSessionModel, Assignment, Exam, Rattrapage, Grade, TimelineItem. Fragments: TimelineFragment (dashboard + 1s Handler countdown), GradesFragment (analytics + GPA), ScheduleFragment (weekly timetable + conflict detection), AssignmentsFragment (status/priorities/reminders). Bottom navigation. JSON files in internal storage.",
    features: [
      "Unified timeline: exams, deadlines, classes, makeup sessions",
      "Live next-event countdown (1s Handler)",
      "GPA: weighted credits, retakes, 20-point scale, per-semester history",
      "Weekly schedule with conflict detection",
      "Assignment reminders: 1 day / 3 days / 1 week",
      "Configurable smart notifications, JSON local storage",
    ],
    metrics: [
      "4 fragments, 6 models",
      "Moroccan 20-point GPA scale",
      "Zero backend — JSON local storage",
    ],
  },
  "air-traffic-manager": {
    description:
      "Two-part air-traffic control simulator demonstrating Java concurrency and functional programming under a live JavaFX GUI — with deliberately zero synchronized blocks. 27+ classes, 18+ concurrent threads.\n\nPart 1: Semaphore(2) gates two runways; a PriorityBlockingQueue orders landings so emergencies jump the queue; 3 LandingWorker + 2 EmergencyWorker threads; RunwayMonitor polls state every 15 seconds. Part 2: WeatherService (Stream pipelines), FuelMonitoringService (10-second checks grouping CRITICAL/LOW/NORMAL), FlightScheduler (5 FlightWorkers consuming a BlockingQueue), NotificationService (CompletableFuture).\n\nIntegration: both parts share a MongoDB (7 collections) and fire cross-part events — low fuel escalates into an emergency landing request in Part 1. A unified JavaFX GUI drives 6 interactive scenarios with coordinated shutdown.",
    architecture:
      "Java 21+, Maven, JavaFX, MongoDB. Part 1: Semaphore(2) runway gates, PriorityBlockingQueue (emergencies jump queue), 3 LandingWorker + 2 EmergencyWorker threads, RunwayMonitor 15s poll. Part 2: WeatherService (Streams), FuelMonitoringService (10s, CRITICAL/LOW/NORMAL), FlightScheduler (5 workers, BlockingQueue), NotificationService (CompletableFuture). Shared MongoDB: aircraft, runways, flights, landing_events, weather_alerts, fuel_alerts, system_events. Concurrency via Semaphore/PriorityBlockingQueue/BlockingQueue/ConcurrentHashMap/AtomicInteger/ExecutorService — zero synchronized.",
    features: [
      "Zero synchronized blocks — locks, queues, atomics only",
      "Priority queue: emergency landings jump the queue",
      "Cross-part events: low fuel → emergency landing escalation",
      "Stream/lambda pipelines in WeatherService (15+ ops)",
      "Unified JavaFX GUI with 6 interactive scenarios",
      "Coordinated multi-service shutdown",
    ],
    metrics: [
      "27+ classes, 18+ threads",
      "7 MongoDB collections",
      "15+ stream/lambda operations",
      "2 runways, 5 flight workers",
    ],
  },
  pdfforge: {
    description:
      "Zero-backend PDF toolkit website with 8 converter tools running 100% in-browser — files never uploaded, privacy by architecture. Refactored from a single 1,407-line monolith into a modular, plugin-style architecture.\n\nEight tools: merge, split, compress, convert, rotate, watermark, extract, page-number. Each is an independent module sharing a common I/O pipeline behind a plugin-style module registry — adding tool #9 means adding a file, not opening a new branch in a 1,400-line function.\n\nVanilla HTML/CSS/JS with jsPDF (generation), pdf-lib (manipulation), and pdf.js (viewing) via CDN. The design system is CSS variables (navy/blue/emerald/amber/rose); index.html is 300 lines of pure structure; 8 CSS files and 4 JS files split concerns. Opens from index.html — static hosting, no build step.",
    architecture:
      "index.html (300 lines pure structure) · css/ 8 files (base, navbar, hero, components, converter, blog, pages, responsive — CSS-variables design system) · js/ 4 files (main/navigation, converter logic, blog, static pages). Each tool = independent module + shared I/O pipeline + plugin-style registry. Libraries via CDN: jsPDF, pdf-lib, pdf.js. Zero backend, zero upload.",
    features: [
      "8 tools: merge, split, compress, convert, rotate, watermark, extract, page-number",
      "100% in-browser — files never leave the device",
      "Plugin-style module registry — new tool = new file",
      "CSS-variables design system, responsive breakpoints",
      "Blog/FAQ/contact/privacy pages included",
      "Static hosting — opens from index.html, no build",
    ],
    metrics: [
      "8 PDF tools",
      "1,407-line monolith → 300-line HTML + 8 CSS + 4 JS",
      "Zero backend, zero uploads",
    ],
  },
  "dbsentinel-dbgui": {
    description:
      "Two desktop SQLite/SQLCipher database explorers, built because I needed to look inside SQLite files and existing tools were bloated or paid. DbSentinel is the full-featured explorer (three generations, ending in a PyQt5 rewrite); dbgui is a distinct, lighter PyQt6 manager.\n\nDbSentinel: sidebar + treeview navigation, full-CRUD editable grids, SQLCipher password prompts, BLOB preview (images, PDFs, hex dumps, truncated text for binary columns — memory-safe on ~50 MB blobs), custom SQL with history/favorites, charts (bar, line, pie, histogram, scatter), backup/restore, auto/manual theming, feature flags for query history / database comparison / tabbed interface. Packaged as AppImage (build_appimage.sh), Windows exe (setup.py), tested on Debian, Ubuntu, Fedora, CentOS, and Raspberry Pi.\n\ndbgui (PyQt6, Fusion style): connection management, schema editor (tables/indexes/views/triggers), multi-tab tables with pagination, saved queries, CSV/JSON import-export, charts. Packaged via PyInstaller + AppImage.",
    architecture:
      "DbSentinel: Python → Tkinter (early gens) → PyQt5 (final); SQLite via pysqlcipher3; pandas/matplotlib/Pillow. Sidebar + treeview + CRUD main window; BLOB preview engine; feature flags; file logging. Packaging: AppImage, Windows exe, install scripts. dbgui: Python 3 + PyQt6 Fusion; connection manager, schema editor, multi-tab pagination, saved queries; PyInstaller + AppImage. 25+ DB operations across 3 source generations.",
    features: [
      "BLOB preview: images/PDFs/hex, memory-safe on 50MB blobs",
      "Editable CRUD grids + batch processing",
      "Custom SQL with history and favorites",
      "Charts: bar, line, pie, histogram, scatter",
      "dbgui schema editor: tables, indexes, views, triggers",
      "AppImage + Windows exe packaging",
    ],
    metrics: [
      "2 tools, 3 code generations",
      "25+ database operations",
      "Tested on 5 Linux distros + Raspberry Pi",
    ],
  },
  "salah-desktop": {
    description:
      "Desktop prayer-times app for Moroccan cities living in the system tray — always there, one click, one glance. Version 2.0 is a modular PyQt5 rewrite of an earlier single-file tool, and served as the design reference for the native Android port.\n\nPrayerTimesWorker scrapes yabiladi.com's monthly prayer table (BeautifulSoup, table.prayer-table with legacy fallback) on a background thread; results cache in SQLite at ~/.salah_times/salah.db with offline fallback, a fallback calculation path, and a 30-day refresh prompt. A 1-second QTimer drives the live countdown to the next prayer, including Iqama times.\n\nEight modules: main.py (QApplication, single-instance lock, tray lifecycle), window.py, database.py (internet check, city updates), worker.py, views.py (monthly calendar, weekly schedule, multi-timezone dialogs), dialogs.py, tray.py, constants.py (translations, 42+ cities). System tray with popup; OS auto-start; English/Arabic/French UI including Hijri date. Packaged via PyInstaller, AppImage, and Buildozer (Android).",
    architecture:
      "Python 3 + PyQt5. 8 modules: main.py (single-instance lock ~/.salah_times/app.lock, tray lifecycle) · app/window.py (ModernSalahApp) · database.py (check_internet, update_all_cities, SQLite) · worker.py (background PrayerTimeWorker scrape thread) · views.py (MonthlyCalendarDialog, WeeklyScheduleDialog, TimezoneViewDialog) · dialogs.py · tray.py · constants.py (TRANSLATIONS, CITIES, CITY_SLUGS). 1-second QTimer countdown. yabiladi.com scraping via requests + BeautifulSoup.",
    features: [
      "System tray with live countdown + popup — no window to manage",
      "yabiladi.com scrape with SQLite cache + offline fallback",
      "Iqama times alongside the 5 prayer times",
      "3 languages incl. Arabic + Hijri date",
      "Monthly/weekly/multi-timezone views",
      "Single-instance lock, OS auto-start, 42+ cities",
    ],
    metrics: [
      "8 modules (v2.0 rewrite)",
      "42+ cities, 3 languages",
      "1-second QTimer countdown",
    ],
  },
  comit: {
    description:
      "Bash CLI that collapses multi-step Git workflows into single memorable commands — 'not a Git wrapper, a workflow encoder.' git add . && git commit -m \"...\" && git push origin main becomes comit \"message\".\n\nCommands: comit start <name> (branch from latest main, set upstream), comit ship (run checks, push, open PR via gh, fail loudly), comit sync (pull + rebase + status), comit fixup (amend + force-push-with-lease, safely), and one-command commit+push with conventional-commit-style messages. 40+ workflows encoded across branching, syncing, interactive rebase, and hotfix flow.\n\nFirst-run setup wizard stores config and GitHub token in ~/.comit/. Colourised, human-readable status output. Single Bash script, installed as /usr/local/bin/comit, Linux and macOS. Live repo on GitHub.",
    architecture:
      "Single Bash script (#!/bin/bash, requires git + gh CLI). Workflow functions: start/ship/sync/fixup/commit+push. Config + token in ~/.comit/config and ~/.comit/token via comit --setup wizard. Conventional-commit message helper. Colourised output. Install: /usr/local/bin/comit. Linux + macOS.",
    features: [
      "One-command commit+push with conventional messages",
      "comit start: branch from latest main + upstream",
      "comit ship: checks → push → PR via gh, fails loudly",
      "comit sync: pull + rebase + status",
      "comit fixup: safe amend + force-push-with-lease",
      "Setup wizard, colourised output",
    ],
    metrics: [
      "40+ Git workflows encoded",
      "1 Bash script, 0 runtime deps beyond git/gh",
      "Linux + macOS",
    ],
  },
  "pixel-perfect": {
    description:
      "This portfolio site — self-hosted SSR at naoufalelouahabi.com, honest about what's real: every project links to GitHub or an explicitly planned repo name. All 36 case studies live in one typed data file; adding a project means adding one object.\n\nTanStack Start with file-based routing and type-safe params: index (home), about, cv, contact, and work.$slug for dynamic case-study pages. React 19, TypeScript 5.8, Tailwind CSS 4.2, Radix/shadcn components, neobrutalist design system. Multi-stage Dockerfile (node:22-alpine build → non-root production image on PORT 3000) deployed via Dokploy on my Contabo VPS behind Traefik with automatic Let's Encrypt TLS.\n\nThe Project type carries everything the pages render — slug, summary, context, approach steps, stack, cover colour, category, featured flag, GitHub fields, photo. ProjectCard has photo fallback. SSR for SEO and first paint; type-safe route params catch data errors at build time.",
    architecture:
      "File-based routes: __root, index, about, cv, contact, work.$slug (type-safe dynamic params). Data: src/lib/site.ts — typed PROJECTS[36], SITE, TOOLKIT, EXPLORING, ARCHIVE, gh() helper. Components: SiteChrome, ProjectCard (photo fallback), ~46 ui primitives. Build: Vite 8 + Nitro node-server preset; multi-stage Dockerfile (npm install --ignore-scripts → node .output/server/index.mjs, non-root, PORT 3000). Deploy: Dokploy on Contabo VPS, Traefik + Let's Encrypt.",
    features: [
      "36 case studies in one typed data file — adding a project = one object",
      "Type-safe dynamic routes (work.$slug) with build-time error catching",
      "SSR for SEO and first paint",
      "Photo fallback on every card",
      "Neobrutalist design system in Tailwind 4",
      "Self-hosted: Docker → Dokploy → Traefik + Let's Encrypt",
    ],
    metrics: [
      "36 projects, 9 categories",
      "~48 components",
      "Live at naoufalelouahabi.com (apex + www)",
      "Multi-stage Docker, non-root container",
    ],
  },
};
