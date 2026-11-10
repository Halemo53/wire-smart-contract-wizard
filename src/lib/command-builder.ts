// Command templates come verbatim from the feature brief. Empty fields fall back to
// <PLACEHOLDER> tokens so the generated command is never silently malformed.

export const DEFAULT_NODE_URL = "http://127.0.0.1:8888";

const or = (v: string, placeholder: string) => (v.trim() ? v.trim() : placeholder);

export function buildUrlCommand(url: string, command: string): string {
  return `clio --url ${or(url, "<NODE_URL>")} ${or(command, "<COMMAND_PLACEHOLDER>")}`;
}

export type CreateAccountInput = {
  creator: string;
  newAccount: string;
  ownerKey: string;
  activeKey: string;
};

export function buildCreateAccountCommand(i: CreateAccountInput): string {
  const creator = or(i.creator, "<CREATOR>");
  const parts = [
    "clio create account",
    creator,
    or(i.newAccount, "<NEW_ACCOUNT>"),
    or(i.ownerKey, "<OWNER_KEY>"),
  ];
  if (i.activeKey.trim()) parts.push(i.activeKey.trim());
  parts.push(`-p ${creator}@active`);
  return parts.join(" ");
}

export type PushActionInput = {
  contract: string;
  action: string;
  data: string;
  permission: string;
};

/** Strip one pair of surrounding single quotes, if the user typed them. */
function unquote(data: string): string {
  const t = data.trim();
  return t.length >= 2 && t.startsWith("'") && t.endsWith("'") ? t.slice(1, -1) : t;
}

export function buildPushActionCommand(i: PushActionInput): string {
  const json = unquote(i.data);
  const data = json ? `'${json}'` : "<JSON_DATA>";
  return `clio push action ${or(i.contract, "<CONTRACT>")} ${or(i.action, "<ACTION>")} ${data} -p ${or(i.permission, "<PERMISSION>")}`;
}

/** Wire account names: up to 12 characters, lowercase a-z and digits 1-5. */
export function accountNameError(name: string): string | null {
  const n = name.trim();
  if (!n) return null;
  if (n.length > 12) return "Account names can be at most 12 characters.";
  if (!/^[a-z1-5]+$/.test(n)) return "Use only lowercase letters a-z and digits 1-5.";
  return null;
}

export function jsonDataError(data: string): string | null {
  const json = unquote(data);
  if (!json) return null;
  try {
    JSON.parse(json);
    return null;
  } catch {
    return "This isn't valid JSON yet — check brackets and double quotes.";
  }
}

export function permissionError(p: string): string | null {
  const t = p.trim();
  if (!t) return null;
  return /^[a-z1-5.]{1,12}@[a-z1-5.]+$/.test(t) ? null : "Use the form account@permission, e.g. bob@active.";
}
