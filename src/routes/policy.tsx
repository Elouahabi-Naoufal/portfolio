import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/policy")({
  head: () => ({
    meta: [
      { title: "Privacy & Terms — Naoufal Elouahabi" },
      { name: "description", content: "Privacy policy and terms of service for the Naoufal Elouahabi portfolio website." },
      { property: "og:title", content: "Privacy & Terms — Naoufal Elouahabi" },
      { property: "og:description", content: "Privacy policy and terms of service." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Policy,
});

function Policy() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="text-6xl font-bold mb-8">Privacy & Terms</h1>
      <div className="prose max-w-prose">
        <h2>Privacy Policy</h2>
        <p>Last updated: October 2026</p>
        <p>This privacy policy describes how personal information is collected, used, and shared when you visit or use the portfolio website at <code>https://naoufalelouahabi.com</code>.</p>
        <h3>Information Collection and Use</h3>
        <p>We do not collect any personal data from visitors to this website. All content is served statically.</p>
        <h3>Cookies</h3>
        <p>This website does not use cookies.</p>
        <h3>Links to Other Sites</h3>
        <p>This website may contain links to third-party sites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
        <h2>Terms of Service</h2>
        <p>Last updated: October 2026</p>
        <p>By accessing this website, you agree to comply with these terms of service and the applicable laws. If you disagree with any part of the terms, you may not access the site.</p>
        <p>The materials on this website are provided "as is". We make no warranties, whether expressed or implied, concerning the accuracy and reliability of the materials.</p>
        <p>We reserve the right to modify or cease publication of this website or any of its content at any time.</p>
      </div>
    </section>
  );
}