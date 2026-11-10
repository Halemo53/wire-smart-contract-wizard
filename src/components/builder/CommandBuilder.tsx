import { useId, useState, type ReactNode } from "react";
import { AlertTriangle, Globe, Info, UserPlus, Zap, type LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CommandBlock } from "@/components/wizard/CommandBlock";
import {
  DEFAULT_NODE_URL,
  accountNameError,
  buildCreateAccountCommand,
  buildPushActionCommand,
  buildUrlCommand,
  jsonDataError,
  permissionError,
} from "@/lib/command-builder";
import { cn } from "@/lib/utils";

type TaskId = "url" | "account" | "action";

const TASKS: { id: TaskId; label: string; Icon: LucideIcon }[] = [
  { id: "url", label: "Connect to a node", Icon: Globe },
  { id: "account", label: "Create an account", Icon: UserPlus },
  { id: "action", label: "Push an action", Icon: Zap },
];

const fieldClass = "border-border bg-code font-mono text-sm placeholder:text-muted-foreground/60 focus-visible:ring-ring";

function Field({
  label,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  optional?: boolean;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-foreground">
        {label}
        {optional && <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">optional</span>}
      </label>
      {children(id)}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-warning" role="alert">
          <AlertTriangle className="size-3.5" /> {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function Helper({ tone = "info", children }: { tone?: "info" | "warn"; children: ReactNode }) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-lg border p-3.5 text-sm leading-relaxed text-muted-foreground",
        tone === "warn" ? "border-warning/40 bg-warning/10" : "border-primary/40 bg-primary/10",
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "warn" ? "text-warning" : "text-link")} />
      <div>{children}</div>
    </div>
  );
}

const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded border border-border bg-code px-1.5 py-0.5 font-mono text-[12px] text-foreground">{children}</code>
);

function UrlTask() {
  const [url, setUrl] = useState(DEFAULT_NODE_URL);
  const [command, setCommand] = useState("");
  return (
    <TaskLayout command={buildUrlCommand(url, command)}>
      <Field label="Node URL" hint="The API endpoint of the node clio should talk to.">
        {(id) => <Input id={id} className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} />}
      </Field>
      <Field label="Command to run" optional hint="Leave empty to keep the placeholder, e.g. set contract mycontract ./hello -p mycontract@active">
        {(id) => (
          <Input
            id={id}
            className={fieldClass}
            placeholder="<COMMAND_PLACEHOLDER>"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        )}
      </Field>
      <Helper>
        <Code>clio</Code> defaults to <Code>localhost:8888</Code> if no URL is provided. Add{" "}
        <Code>--url</Code> to point it at any other node.
      </Helper>
    </TaskLayout>
  );
}

function AccountTask() {
  const [creatorChoice, setCreatorChoice] = useState("sysio");
  const [customCreator, setCustomCreator] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [ownerKey, setOwnerKey] = useState("");
  const [activeKey, setActiveKey] = useState("");
  const creator = creatorChoice === "custom" ? customCreator : creatorChoice;

  return (
    <TaskLayout command={buildCreateAccountCommand({ creator, newAccount, ownerKey, activeKey })}>
      <Field label="Creator account" error={creatorChoice === "custom" ? accountNameError(customCreator) : null}>
        {(id) => (
          <div className="space-y-2">
            <Select value={creatorChoice} onValueChange={setCreatorChoice}>
              <SelectTrigger id={id} className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sysio">sysio — local dev chain</SelectItem>
                <SelectItem value="custom">Another account…</SelectItem>
              </SelectContent>
            </Select>
            {creatorChoice === "custom" && (
              <Input
                aria-label="Custom creator account"
                className={fieldClass}
                placeholder="creator account name"
                value={customCreator}
                onChange={(e) => setCustomCreator(e.target.value)}
              />
            )}
          </div>
        )}
      </Field>
      <Field label="New account name" hint="Up to 12 characters: lowercase a-z and digits 1-5." error={accountNameError(newAccount)}>
        {(id) => (
          <Input id={id} className={fieldClass} placeholder="mycontract" maxLength={13} value={newAccount} onChange={(e) => setNewAccount(e.target.value)} />
        )}
      </Field>
      <Field label="Owner public key" hint="The public key from clio create key --to-console.">
        {(id) => <Input id={id} className={fieldClass} placeholder="<OWNER_KEY>" value={ownerKey} onChange={(e) => setOwnerKey(e.target.value)} />}
      </Field>
      <Field label="Active public key" optional hint="Leave empty to use only the owner key.">
        {(id) => <Input id={id} className={fieldClass} placeholder="<ACTIVE_KEY>" value={activeKey} onChange={(e) => setActiveKey(e.target.value)} />}
      </Field>
      <Helper tone="warn">
        On a local dev chain, <Code>sysio</Code> is the privileged creator. On Testnet, account creation is
        handled via the Wire Hub.
      </Helper>
    </TaskLayout>
  );
}

function ActionTask() {
  const [contract, setContract] = useState("mycontract");
  const [action, setAction] = useState("hi");
  const [data, setData] = useState('["bob"]');
  const [permission, setPermission] = useState("bob@active");
  return (
    <TaskLayout command={buildPushActionCommand({ contract, action, data, permission })}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Contract account" error={accountNameError(contract)}>
          {(id) => <Input id={id} className={fieldClass} value={contract} onChange={(e) => setContract(e.target.value)} />}
        </Field>
        <Field label="Action name">
          {(id) => <Input id={id} className={fieldClass} value={action} onChange={(e) => setAction(e.target.value)} />}
        </Field>
      </div>
      <Field label="Action data (JSON)" hint="Single quotes are added for you." error={jsonDataError(data)}>
        {(id) => (
          <Textarea id={id} rows={3} className={fieldClass} value={data} onChange={(e) => setData(e.target.value)} />
        )}
      </Field>
      <Field label="Permission" hint="Who signs the transaction, e.g. bob@active." error={permissionError(permission)}>
        {(id) => <Input id={id} className={fieldClass} value={permission} onChange={(e) => setPermission(e.target.value)} />}
      </Field>
      <Helper>This is the general syntax for calling any function on a deployed smart contract.</Helper>
    </TaskLayout>
  );
}

function TaskLayout({ command, children }: { command: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5">{children}</div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Live output</p>
        <CommandBlock cmd={{ id: "generated", label: "Generated command", command }} />
        <p className="mt-2 text-xs text-muted-foreground">
          Highlighted <span className="rounded bg-primary/15 px-1 font-mono text-link">{"<PLACEHOLDERS>"}</span> still need a value.
        </p>
      </div>
    </div>
  );
}

export function CommandBuilder() {
  const [task, setTask] = useState<TaskId>("url");
  return (
    <div className="rounded-xl border border-border bg-card shadow-xl">
      <div role="tablist" aria-label="Task" className="flex gap-1 overflow-x-auto border-b border-border p-2">
        {TASKS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={task === id}
            onClick={() => setTask(id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              task === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>
      <div key={task} role="tabpanel" className="animate-step-in p-5 sm:p-8">
        {task === "url" && <UrlTask />}
        {task === "account" && <AccountTask />}
        {task === "action" && <ActionTask />}
      </div>
    </div>
  );
}
