import { useEffect, useRef, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { splitPlaceholders, type Command } from "@/lib/wizard-steps";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

export function CommandBlock({
  cmd,
  index,
  muted = false,
}: {
  cmd: Command;
  index?: number;
  muted?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (await copyText(cmd.command)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={muted ? "opacity-60" : undefined}>
      <div className="mb-2 flex items-baseline gap-2">
        {index !== undefined && (
          <span className="font-mono text-xs text-link">{String(index).padStart(2, "0")}</span>
        )}
        <h3 className="text-sm font-semibold text-foreground">{cmd.label}</h3>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-code">
        <div className="flex items-center justify-between border-b border-border bg-elevated px-3 py-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Terminal className="size-3.5" /> shell
          </span>
          <Button
            type="button"
            size="sm"
            variant={copied ? "copied" : "code"}
            onClick={onCopy}
            aria-label={copied ? "Copied" : `Copy command: ${cmd.label}`}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <pre className="whitespace-pre-wrap break-all px-4 py-3 font-mono text-[13px] leading-relaxed">
          <code>
            <span className="select-none text-muted-foreground">$ </span>
            {splitPlaceholders(cmd.command).map((seg, i) =>
              seg.placeholder ? (
                <span key={i} className="rounded bg-primary/15 px-1 text-link">
                  {seg.text}
                </span>
              ) : (
                <span key={i} className="text-foreground">
                  {seg.text}
                </span>
              ),
            )}
          </code>
        </pre>
      </div>
      {cmd.explanation && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cmd.explanation}</p>
      )}
    </div>
  );
}
