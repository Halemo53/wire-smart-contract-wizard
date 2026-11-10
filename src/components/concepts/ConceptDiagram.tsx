import {
  ArrowRight,
  Building2,
  Cpu,
  KeyRound,
  Landmark,
  Lock,
  Server,
  ShieldCheck,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ConceptId } from "@/lib/concepts";

function Node({
  Icon,
  title,
  sub,
  tone = "neutral",
}: {
  Icon: LucideIcon;
  title: string;
  sub?: string;
  tone?: "neutral" | "wire" | "safe";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-center",
        tone === "wire" && "border-primary/60 bg-primary/10",
        tone === "safe" && "border-success/50 bg-success/10",
        tone === "neutral" && "border-border bg-elevated",
      )}
    >
      <Icon
        className={cn(
          "size-5",
          tone === "wire" ? "text-link" : tone === "safe" ? "text-success" : "text-muted-foreground",
        )}
      />
      <span className="font-mono text-xs text-foreground">{title}</span>
      {sub && <span className="text-[11px] leading-tight text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-1 text-muted-foreground">
      <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
      {label && <span className="font-mono text-[10px] uppercase tracking-wider">{label}</span>}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">{children}</div>;
}

export function ConceptDiagram({ id }: { id: ConceptId }) {
  return (
    <figure
      aria-label="Diagram"
      className="rounded-lg border border-dashed border-border bg-code p-4"
    >
      {id === "utl" && (
        <Row>
          <Node Icon={Lock} title="Ethereum / Solana" sub="asset stays locked on native chain" />
          <Arrow label="rights" />
          <Node Icon={Zap} title="Wire UTL" sub="ownership traded on fast settlement layer" tone="wire" />
          <Arrow />
          <Node Icon={ShieldCheck} title="No bridge" sub="dual consensus security" tone="safe" />
        </Row>
      )}
      {id === "upap" && (
        <Row>
          <Node Icon={Wallet} title="MetaMask" sub="your existing wallet" />
          <Arrow label="pub key" />
          <Node Icon={KeyRound} title="UPAP" sub="deterministic derivation" tone="wire" />
          <Arrow />
          <Node Icon={Users} title="Wire address" sub="ready to use, nothing new to fund" tone="safe" />
        </Row>
      )}
      {id === "wns" && (
        <Row>
          <Node Icon={Landmark} title="WNS contract" sub="escrow bucket on Ethereum" tone="safe" />
          <Arrow label="represents" />
          <Node Icon={Zap} title="Ownership on Wire" sub="tradeable via the UTL" tone="wire" />
        </Row>
      )}
      {id === "apos" && (
        <div className="grid gap-2 sm:grid-cols-3">
          <Node Icon={Building2} title="Council" sub="governance" tone="wire" />
          <Node Icon={Server} title="Node Owners" sub="staking" tone="safe" />
          <Node Icon={Cpu} title="Node Operators" sub="block production" />
          <p className="text-center font-mono text-[11px] text-muted-foreground sm:col-span-3">
            three separate roles · no single group controls the chain
          </p>
        </div>
      )}
    </figure>
  );
}
