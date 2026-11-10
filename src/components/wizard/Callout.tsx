import { AlertTriangle, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  info: { box: "border-primary/40 bg-primary/10", icon: "text-link", Icon: Info },
  warn: { box: "border-warning/40 bg-warning/10", icon: "text-warning", Icon: AlertTriangle },
};

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof tones;
  title: string;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", t.box)}>
      <t.Icon className={cn("mt-0.5 size-4 shrink-0", t.icon)} />
      <div className="space-y-1 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-border bg-code px-1.5 py-0.5 font-mono text-[12px] text-foreground">
      {children}
    </code>
  );
}

export function DocLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 break-all font-mono text-xs text-link underline-offset-4 hover:underline"
    >
      {href}
    </a>
  );
}
