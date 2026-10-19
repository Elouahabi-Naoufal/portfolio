/**
 * Idempotent PocketBase sync: upserts every project from src/lib/site.ts + src/lib/details.ts
 * into the `projects` collection, keyed by slug.
 *
 * Usage:
 *   PB_EMAIL=... PB_PASSWORD=... npx tsx scripts/pb-sync.ts
 *
 * Env:
 *   PB_URL       default https://pb.naoufalelouahabi.com
 *   PB_EMAIL     superuser email
 *   PB_PASSWORD  superuser password
 *   PB_IP        optional — resolve PB_URL hostname to this IP (pre-DNS / local testing)
 */
import { Agent, setGlobalDispatcher } from "undici";
import PocketBase from "pocketbase";
import { PROJECT_DETAILS } from "../src/lib/details";
import { ARCHIVE, PROJECTS } from "../src/lib/site";

// A project's category lives on its ARCHIVE entry, not on the project itself,
// so it has to be looked up by slug. Reading `p.category` instead silently
// collapses every project into one group.
const CATEGORY_BY_SLUG = new Map<string, string>();
for (const group of ARCHIVE) {
  for (const slug of group.slugs) CATEGORY_BY_SLUG.set(slug, group.category);
}

const url = process.env.PB_URL ?? "https://pb.naoufalelouahabi.com";
const email = process.env.PB_EMAIL;
const password = process.env.PB_PASSWORD;
const ip = process.env.PB_IP;

if (!email || !password) {
  console.error("PB_EMAIL and PB_PASSWORD are required");
  process.exit(1);
}

if (ip) {
  setGlobalDispatcher(
    new Agent({
      connect: {
        lookup: (_hostname: string, options: { all?: boolean }, callback: Function) => {
          if (options?.all) {
            callback(null, [{ address: ip, family: 4 }]);
          } else {
            callback(null, ip, 4);
          }
        },
      },
    }),
  );
  console.log(`Using IP override ${ip} for ${new URL(url).hostname}`);
}

const pb = new PocketBase(url);
pb.autoCancellation(false);

async function main() {
  await pb.collection("_superusers").authWithPassword(email, password);
  console.log("Authenticated as superuser");

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const p of PROJECTS) {
    const d = PROJECT_DETAILS[p.slug];
    const payload = {
      title: p.title,
      slug: p.slug,
      num: p.num,
      org: p.org,
      summary: p.summary,
      context: p.context,
      description: d?.description ?? "",
      architecture: d?.architecture ?? "",
      features: d?.features ?? [],
      metrics: d?.metrics ?? [],
      tags: p.tags,
      stack: p.stack,
      approach: p.approach,
      cover: p.cover,
      category: CATEGORY_BY_SLUG.get(p.slug) ?? p.category ?? "Full-Stack",
      featured: p.featured ?? false,
      published: true,
      github: p.github,
      photo: p.photo ?? "",
    };

    try {
      const existing = await pb
        .collection("projects")
        .getFirstListItem<{ id: string }>(`slug = "${p.slug}"`);
      await pb.collection("projects").update(existing.id, payload);
      updated++;
    } catch {
      try {
        await pb.collection("projects").create(payload);
        created++;
      } catch (e) {
        errors.push(`${p.slug}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  console.log(`\nSync complete: ${created} created, ${updated} updated, ${skipped} skipped`);
  if (errors.length) {
    console.error("Errors:");
    for (const e of errors) console.error("  -", e);
    process.exit(1);
  }

  const total = await pb.collection("projects").getList(1, 1);
  console.log(`PocketBase now holds ${total.totalItems} published projects`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
