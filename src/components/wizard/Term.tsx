import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const GLOSSARY = {
  WASM: "WebAssembly — a compact binary format. Your C++ contract is compiled into a .wasm file, which is the code the chain actually runs.",
  ABI: "Application Binary Interface — a JSON file describing your contract's actions and data, so tools like clio can call it using readable JSON.",
  ROA: "Resource Owner Association — Wire's system (the sysio.roa contract) that lets Node Owners allocate CPU, NET and RAM to accounts through policies.",
} as const;

export function Term({ term, children }: { term: keyof typeof GLOSSARY; children?: ReactNode }) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center gap-0.5 border-b border-dashed border-link/60 font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`What is ${term}?`}
        >
          {children ?? term}
          <HelpCircle className="size-3 text-link" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span className="mb-1 block font-mono text-[11px] text-link">{term}</span>
        {GLOSSARY[term]}
      </TooltipContent>
    </Tooltip>
  );
}
