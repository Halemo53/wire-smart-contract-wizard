import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "@/components/AppHeader";
import { CommandBuilder } from "@/components/builder/CommandBuilder";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "clio Command Builder — Wire Network" },
      {
        name: "description",
        content:
          "Fill in a few fields and get a ready-to-copy clio command for connecting to a node, creating an account or pushing a contract action on Wire Network.",
      },
      { property: "og:title", content: "Interactive clio Command Builder" },
      {
        property: "og:description",
        content: "Generate custom clio commands for Wire Network with live preview and one-click copy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <PageIntro eyebrow="Command Builder" title="Build your own clio commands">
          Pick a task, fill in the fields, and copy the command that updates as you type.
        </PageIntro>
        <CommandBuilder />
      </main>
    </div>
  );
}
