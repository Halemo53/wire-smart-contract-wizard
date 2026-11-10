// Every command string below is copied verbatim from the project brief.
// Do not add or alter commands: the wizard must never show invented clio usage.

export type Env = "local" | "testnet";

export type Command = {
  id: string;
  label: string;
  command: string;
  explanation?: string;
};

export type StepId = "wallet" | "account" | "deploy" | "test";

export const DOCS = {
  wallet: "https://docs.wire.network/docs/guides/how-to-create-a-wallet",
  account: "https://docs.wire.network/docs/guides/how-to-create-an-account",
  deploy: "https://docs.wire.network/docs/smart-contract-development/hello-world-contract-short",
} as const;

export const ROOT_SHELL_COMMAND = "sudo su -";

export const WALLET_COMMANDS: Command[] = [
  {
    id: "wallet-create",
    label: "Create wallet",
    command: "clio wallet create --to-console",
    explanation:
      "This creates a new wallet. Save the password printed on the screen. You will need it to unlock the wallet.",
  },
  {
    id: "key-create",
    label: "Create key pair",
    command: "clio create key --to-console",
    explanation:
      "This generates a public and private key pair (SYS format). Save the Private Key securely. You will import it in the next step.",
  },
  {
    id: "key-import",
    label: "Import key",
    command: "clio wallet import --private-key <YOUR_PRIVATE_KEY>",
    explanation:
      "Replace <YOUR_PRIVATE_KEY> with the private key from the previous command. This imports your key into the wallet so clio can use it to sign transactions.",
  },
];

export const ACCOUNT_COMMANDS_LOCAL: Command[] = [
  {
    id: "account-create",
    label: "Create account",
    command: "clio create account sysio mycontract <YOUR_PUBLIC_KEY> -p sysio@active",
    explanation:
      "Replace <YOUR_PUBLIC_KEY> with the public key from Step 1. Replace mycontract with your desired contract account name (must be 12 characters, lowercase a-z, 1-5). Note: sysio is the privileged system account on a local chain.",
  },
  {
    id: "policy-add",
    label: "Issue policy",
    command:
      'clio push action sysio.roa addpolicy \'{"owner": "mycontract", "issuer": "nodeownera", "net_weight": "0.0100 SYS", "cpu_weight": "0.0100 SYS", "ram_weight": "0.1000 SYS", "time_block": 1, "network_gen": 0}\' -p nodeownera@active',
    explanation:
      "This gives your contract account resources. nodeownera is the default node owner in the local development setup. If you are on Testnet, this step is handled by the Hub.",
  },
];

export const CLONE_COMMAND: Command = {
  id: "clone",
  label: "Clone repo",
  command:
    "git clone https://github.com/Wire-Network/guides.git && cd guides/hello-world-contract",
};

export const BUILD_COMMAND: Command = {
  id: "build",
  label: "Compile",
  command: "./build.sh",
  explanation:
    "This uses the Wire Contract Development Toolkit (CDT) to compile the C++ code into WebAssembly (WASM) and ABI files. You should see a hello folder created.",
};

export const DEPLOY_LOCAL: Command = {
  id: "deploy-local",
  label: "Deploy — Local Dev Chain",
  command: "clio set contract mycontract ./hello -p mycontract@active",
  explanation:
    "This deploys the compiled contract to your account. Replace mycontract with the account name you created in Step 2.",
};

export const DEPLOY_TESTNET: Command = {
  id: "deploy-testnet",
  label: "Deploy — Testnet",
  command:
    "clio -u https://testnet-00.wire.foundation set contract <YOUR_CONTRACT_ACCOUNT> ./hello -p <YOUR_CONTRACT_ACCOUNT>@active",
  explanation:
    "This deploys the compiled contract to your Testnet account. Replace <YOUR_CONTRACT_ACCOUNT> with the account you created through the Wire Hub.",
};

export const CREATE_USER_LOCAL: Command = {
  id: "user-create",
  label: "Create user — Local",
  command: "clio create account sysio bob <YOUR_PUBLIC_KEY> -p sysio@active",
};

export const PUSH_HI: Command = {
  id: "push-hi",
  label: "Push action",
  command: "clio push action mycontract hi '[\"bob\"]' -p bob@active",
  explanation:
    'This calls the hi function in your contract, passing "bob" as the parameter. It should print "Hello, bob".',
};

export function getDeployCommands(env: Env): Command[] {
  return [CLONE_COMMAND, BUILD_COMMAND, env === "testnet" ? DEPLOY_TESTNET : DEPLOY_LOCAL];
}

export const STEPS: { id: StepId; short: string; title: string }[] = [
  { id: "wallet", short: "Wallet & Keys", title: "Step 1: Create Your Wallet & Key Pair" },
  {
    id: "account",
    short: "Account & Policy",
    title: "Step 2: Create a Contract Account & Issue a Policy",
  },
  { id: "deploy", short: "Compile & Deploy", title: "Step 3: Compile and Deploy Your First Contract" },
  { id: "test", short: "Test Contract", title: "Success! Test Your Contract" },
];

/** The Next button unlocks only after the user confirms they ran the current step. */
export function canAdvance(stepIndex: number, confirmed: Record<number, boolean>): boolean {
  return stepIndex < STEPS.length - 1 && confirmed[stepIndex] === true;
}

/** A step in the sidebar can be opened once every earlier step is confirmed. */
export function isStepReachable(target: number, confirmed: Record<number, boolean>): boolean {
  for (let i = 0; i < target; i++) if (!confirmed[i]) return false;
  return true;
}

/** Split a command into plain text and <PLACEHOLDER> segments for highlighting. */
export function splitPlaceholders(command: string): { text: string; placeholder: boolean }[] {
  return command
    .split(/(<[A-Z_]+>)/g)
    .filter(Boolean)
    .map((text) => ({ text, placeholder: /^<[A-Z_]+>$/.test(text) }));
}
