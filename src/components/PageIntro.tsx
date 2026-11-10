import type { ReactNode } from "react";

import { BackToWizard } from "./AppHeader";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="mb-8 space-y-3">
      <BackToWizard />
      <p className="font-mono text-[11px] uppercase tracking-wider text-link">{eyebrow}</p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="max-w-2xl leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
