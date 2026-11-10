import { createFileRoute } from "@tanstack/react-router";

import { Wizard } from "@/components/wizard/Wizard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wire Smart Contract Wizard — Deploy with clio" },
      {
        name: "description",
        content:
          "A step-by-step guide to creating a wallet, provisioning an account and deploying your first smart contract on Wire Network with clio.",
      },
      { property: "og:title", content: "Wire Smart Contract Wizard" },
      {
        property: "og:description",
        content: "Deploy your first Wire Network smart contract in three guided steps with copyable clio commands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Wizard />;
}
