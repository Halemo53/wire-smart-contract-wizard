import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import { CONCEPTS, type ConceptId } from "@/lib/concepts";
import { cn } from "@/lib/utils";

import { ConceptDiagram } from "./ConceptDiagram";

export function ConceptsExplorer() {
  const [open, setOpen] = useState<Set<ConceptId>>(new Set());

  const toggle = (id: ConceptId) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {CONCEPTS.map((c) => {
        const expanded = open.has(c.id);
        return (
          <article
            key={c.id}
            className={cn(
              "rounded-xl border bg-card transition-colors",
              expanded ? "border-primary/60 md:col-span-2" : "border-border hover:border-link/50",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(c.id)}
              aria-expanded={expanded}
              aria-controls={`concept-${c.id}`}
              className="flex w-full items-start gap-4 rounded-xl p-5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <span className="flex h-11 min-w-14 shrink-0 items-center justify-center rounded-lg border border-primary/50 px-2 font-mono text-sm font-bold text-link">
                {c.acronym}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{c.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{c.summary}</span>
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                  expanded && "rotate-180 text-link",
                )}
              />
            </button>
            {expanded && (
              <div id={`concept-${c.id}`} className="animate-step-in space-y-4 border-t border-border px-5 pb-5 pt-4">
                <p className="leading-relaxed text-foreground/90">{c.explanation}</p>
                <ConceptDiagram id={c.id} />
                <div className="flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-success" />
                  <p>
                    <span className="font-semibold text-foreground">Key benefit: </span>
                    <span className="text-muted-foreground">{c.benefit}</span>
                  </p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
