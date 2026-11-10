import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  FileCode,
  KeyRound,
  Lock,
  Rocket,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_COMMANDS_LOCAL,
  BUILD_COMMAND,
  CREATE_USER_LOCAL,
  DOCS,
  PUSH_HI,
  ROOT_SHELL_COMMAND,
  STEPS,
  WALLET_COMMANDS,
  canAdvance,
  getDeployCommands,
  isStepReachable,
  type Env,
} from "@/lib/wizard-steps";

import { Callout, DocLink, InlineCode } from "./Callout";
import { CommandBlock } from "./CommandBlock";
import { Term } from "./Term";

const ICONS: LucideIcon[] = [Wallet, KeyRound, FileCode, Rocket];
const HUB_URL = "https://hub.wire.network/explore/node-owner";

function EnvToggle({ env, onChange }: { env: Env; onChange: (e: Env) => void }) {
  const opts: { id: Env; label: string }[] = [
    { id: "local", label: "Local Dev Chain" },
    { id: "testnet", label: "Testnet" },
  ];
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <span className="text-xs text-muted-foreground">Are you on Local Dev Chain or Testnet?</span>
      <div role="radiogroup" aria-label="Environment" className="inline-flex rounded-md border border-border bg-card p-0.5">
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={env === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              env === o.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepNav({
  current,
  confirmed,
  onSelect,
}: {
  current: number;
  confirmed: Record<number, boolean>;
  onSelect: (i: number) => void;
}) {
  return (
    <nav aria-label="Wizard steps">
      <ol className="flex gap-2 lg:flex-col lg:gap-1">
        {STEPS.map((s, i) => {
          const Icon = ICONS[i] ?? Wallet;
          const done = confirmed[i] && i !== STEPS.length - 1;
          const active = i === current;
          const reachable = isStepReachable(i, confirmed);
          return (
            <li key={s.id} className="flex-1 lg:flex-none">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(i)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  active
                    ? "border-primary/60 bg-primary/10"
                    : "border-transparent hover:border-border hover:bg-card",
                  !reachable && "cursor-not-allowed opacity-50 hover:border-transparent hover:bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border",
                    done
                      ? "border-success/50 bg-success/10 text-success"
                      : active
                        ? "border-primary/60 text-link"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : reachable ? <Icon className="size-4" /> : <Lock className="size-3.5" />}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {i < 3 ? `Step ${i + 1}` : "Final"}
                  </span>
                  <span className={cn("block truncate text-sm", active ? "text-foreground" : "text-muted-foreground")}>
                    {s.short}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function CommandList({ commands, startAt = 1 }: { commands: typeof WALLET_COMMANDS; startAt?: number }) {
  return (
    <div className="space-y-7">
      {commands.map((c, i) => (
        <CommandBlock key={c.id} cmd={c} index={startAt + i} />
      ))}
    </div>
  );
}

function WalletStep() {
  return (
    <>
      <p>
        In Wire Network, your wallet stores your private keys. <InlineCode>clio</InlineCode> is the
        command-line tool. First, create a wallet and generate a key pair.
      </p>
      <Callout tone="warn" title="Crucial note">
        The documentation recommends running <InlineCode>clio</InlineCode> commands as the root user (
        <InlineCode>{ROOT_SHELL_COMMAND}</InlineCode>) or ensuring your wallet is unlocked.
      </Callout>
      <CommandList commands={WALLET_COMMANDS} />
      <DocRow href={DOCS.wallet} />
    </>
  );
}

function AccountStep({ env }: { env: Env }) {
  return (
    <>
      <p>
        On Wire, a smart contract needs its own account. On a shared network (like Testnet), ordinary
        users cannot create accounts freely. The contract account requires a “policy” issued by a
        Tier-1 Node Owner to pay for resources (CPU/NET) through <Term term="ROA" />.
      </p>
      {env === "testnet" ? (
        <Callout title="On Testnet, use the Wire Hub for this step">
          Account creation and the contract policy are simplified via the Wire Hub on Testnet. Create
          your contract account there and request a Developer Contract Policy — the Hub gives you the
          account name and keys. The commands below are for a local dev chain only.
          <div className="mt-2">
            <DocLink href={HUB_URL} />
          </div>
        </Callout>
      ) : (
        <Callout title="Showing commands for a Local Dev Chain">
          These commands assume a local chain where <InlineCode>sysio</InlineCode> has privilege. If
          you are on the official Testnet, switch the environment above — account creation and the
          policy are handled by the Wire Hub instead.
        </Callout>
      )}
      <div className={cn("space-y-7", env === "testnet" && "opacity-60")}>
        {ACCOUNT_COMMANDS_LOCAL.map((c, i) => (
          <CommandBlock key={c.id} cmd={c} index={i + 1} />
        ))}
      </div>
      <DocRow href={DOCS.account} />
    </>
  );
}

function DeployStep({ env }: { env: Env }) {
  return (
    <>
      <p>We will use the official Hello World contract from the Wire Network GitHub repository.</p>
      <div className="space-y-7">
        {getDeployCommands(env).map((c, i) => (
          <div key={c.id}>
            {c.id === "build" ? (
              <BuildBlock index={i + 1} />
            ) : (
              <CommandBlock cmd={c} index={i + 1} />
            )}
          </div>
        ))}
      </div>
      {env === "local" && (
        <Callout title="Deploying to Testnet instead?">
          Switch the environment above to see the Testnet deploy command, which points{" "}
          <InlineCode>clio</InlineCode> at <InlineCode>https://testnet-00.wire.foundation</InlineCode>.
        </Callout>
      )}
      <DocRow href={DOCS.deploy} />
    </>
  );
}

function BuildBlock({ index }: { index: number }) {
  const { id, label, command } = BUILD_COMMAND;
  return (
    <>
      <CommandBlock cmd={{ id, label, command }} index={index} />
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        This uses the Wire Contract Development Toolkit (CDT) to compile the C++ code into WebAssembly
        (<Term term="WASM" />) and <Term term="ABI" /> files. You should see a{" "}
        <InlineCode>hello</InlineCode> folder created.
      </p>
    </>
  );
}

function TestStep({ env }: { env: Env }) {
  return (
    <>
      <p>
        You can now invoke the <InlineCode>hi</InlineCode> action. First, create a user account (e.g.{" "}
        <InlineCode>bob</InlineCode>) and give it a policy just like you did for the contract (or use
        the Hub on Testnet). Then push the action.
      </p>
      {env === "testnet" && (
        <Callout title="On Testnet">
          Create your user account through the Wire Hub instead of the local command below.
          <div className="mt-2">
            <DocLink href={HUB_URL} />
          </div>
        </Callout>
      )}
      <div className="space-y-7">
        <CommandBlock cmd={CREATE_USER_LOCAL} index={1} muted={env === "testnet"} />
        <CommandBlock cmd={PUSH_HI} index={2} />
      </div>
      <div className="rounded-lg border border-success/40 bg-success/10 p-5">
        <div className="flex items-start gap-3">
          <Rocket className="mt-0.5 size-5 shrink-0 text-success" />
          <div className="space-y-3">
            <p className="font-semibold text-foreground">
              You've successfully deployed your first smart contract on Wire Network.
            </p>
            <p className="text-sm text-muted-foreground">
              Explore the official documentation to learn more about advanced features like the
              Universal Transaction Layer and Crypto SSO.
            </p>
            <Button asChild variant="success" size="sm">
              <a href="https://docs.wire.network" target="_blank" rel="noreferrer">
                <BookOpen /> Explore the Wire docs
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function DocRow({ href }: { href: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
      <BookOpen className="size-4 text-link" /> Reference:
      <DocLink href={href} />
    </div>
  );
}

export function Wizard() {
  const [current, setCurrent] = useState(0);
  const [env, setEnv] = useState<Env>("local");
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const isLast = current === STEPS.length - 1;
  const step = STEPS[current];
  const Icon = ICONS[current] ?? Wallet;

  const go = (i: number) => {
    setCurrent(i);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background bg-grid">
        <AppHeader />
        <div className="border-b border-border bg-card/40">
          <div className="mx-auto flex max-w-6xl px-4 py-2.5 sm:justify-end sm:px-6">
            <EnvToggle env={env} onChange={setEnv} />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:py-10">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 h-1 overflow-hidden rounded-full bg-secondary lg:hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((current + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <StepNav current={current} confirmed={confirmed} onSelect={go} />
          </aside>

          <main className="min-w-0">
            <article
              key={current}
              className="animate-step-in rounded-xl border border-border bg-card shadow-xl"
            >
              <div className="flex items-start gap-4 border-b border-border px-5 py-5 sm:px-8 sm:py-6">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                    isLast ? "border-success/50 text-success" : "border-primary/50 text-link",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {isLast ? "Final step" : `${current + 1} of 3`} ·{" "}
                    {env === "local" ? "Local Dev Chain" : "Testnet"}
                  </p>
                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {step?.title}
                  </h1>
                </div>
              </div>

              <div className="space-y-6 px-5 py-6 leading-relaxed text-foreground/90 sm:px-8">
                {current === 0 && <WalletStep />}
                {current === 1 && <AccountStep env={env} />}
                {current === 2 && <DeployStep env={env} />}
                {current === 3 && <TestStep env={env} />}
              </div>

              <footer className="flex flex-col gap-4 border-t border-border bg-elevated/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                {!isLast ? (
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                    <Checkbox
                      checked={!!confirmed[current]}
                      onCheckedChange={(v) => setConfirmed((c) => ({ ...c, [current]: v === true }))}
                      aria-label="I've run these commands"
                    />
                    I've run these commands
                  </label>
                ) : (
                  <span className="text-sm text-muted-foreground">Follow along in your terminal.</span>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => go(current - 1)} disabled={current === 0}>
                    <ArrowLeft /> Back
                  </Button>
                  {!isLast && (
                    <Button onClick={() => go(current + 1)} disabled={!canAdvance(current, confirmed)}>
                      Next <ArrowRight />
                    </Button>
                  )}
                </div>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
