import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Wizard } from "@/components/wizard/Wizard";
import { canAdvance, getDeployCommands, isStepReachable } from "@/lib/wizard-steps";

describe("wizard rules", () => {
  it("keeps Next locked until the user confirms they ran the step", () => {
    expect(canAdvance(0, {})).toBe(false);
    expect(canAdvance(0, { 0: true })).toBe(true);
  });

  it("has no Next after the final test step", () => {
    expect(canAdvance(3, { 3: true })).toBe(false);
  });

  it("only opens a later step once every earlier step is confirmed", () => {
    expect(isStepReachable(2, { 0: true })).toBe(false);
    expect(isStepReachable(2, { 0: true, 1: true })).toBe(true);
  });

  it("deploys to the Testnet endpoint only when Testnet is selected", () => {
    expect(getDeployCommands("testnet")[2]?.command).toBe(
      "clio -u https://testnet-00.wire.foundation set contract <YOUR_CONTRACT_ACCOUNT> ./hello -p <YOUR_CONTRACT_ACCOUNT>@active",
    );
    expect(getDeployCommands("local")[2]?.command).toBe(
      "clio set contract mycontract ./hello -p mycontract@active",
    );
  });

  it("enables the Next button after ticking the confirmation box", async () => {
    const router = createRouter({
      routeTree: createRootRoute({ component: Wizard }),
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    render(<RouterProvider router={router} />);
    const next = await screen.findByRole("button", { name: /next/i });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: /i've run these commands/i }));
    expect(next).toBeEnabled();
  });
});
