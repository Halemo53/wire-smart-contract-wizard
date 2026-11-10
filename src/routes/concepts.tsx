import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/AppHeader";
import { ConceptsExplorer } from "@/components/concepts/ConceptsExplorer";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Wire Concepts Explorer — UTL, UPAP, WNS, APoS" },
      {
        name: "description",
        content:
          "Beginner-friendly explanations and diagrams of Wire Network's core pillars: Universal Transaction Layer, UPAP, Wire Name Service and Appointed Proof of Stake.",
      },
      { property: "og:title", content: "Wire Concepts Explorer" },
      {
        property: "og:description",
        content: "Understand UTL, UPAP, WNS and APoS — the building blocks of Wire Network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConceptsPage,
});

function ConceptsPage() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <PageIntro eyebrow="Concepts Explorer" title="The four pillars of Wire Network">
          Tap a card to see a plain-English explanation and a small diagram of how it works.
        </PageIntro>
        <ConceptsExplorer />
      </main>
    </div>
  );
}
