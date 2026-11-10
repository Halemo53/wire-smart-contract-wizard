import { Link } from "@tanstack/react-router";
import { BookOpen, Terminal, Wand2 } from "lucide-react";

import logoAsset from "@/assets/wire-logo-tile.png.asset.json";

const NAV = [
  { to: "/", label: "Wizard", Icon: Wand2 },
  { to: "/concepts", label: "Concepts", Icon: BookOpen },
  { to: "/builder", label: "Command Builder", Icon: Terminal },
] as const;

export function AppHeader() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Wire logo"
            width={32}
            height={32}
            className="size-8 shrink-0"
          />
          <span>
            <span className="block text-sm font-semibold leading-tight text-foreground">
              Wire Smart Contract Wizard
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground">
              learn · build · deploy with clio
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex gap-1 overflow-x-auto">
          {NAV.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:border-primary/50 data-[status=active]:bg-primary/10 data-[status=active]:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function BackToWizard() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1 font-mono text-xs text-link underline-offset-4 hover:underline"
    >
      ← Back to Wizard
    </Link>
  );
}
