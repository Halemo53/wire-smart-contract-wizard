import { describe, expect, it } from "vitest";

import {
  DEFAULT_NODE_URL,
  accountNameError,
  buildCreateAccountCommand,
  buildPushActionCommand,
  buildUrlCommand,
  jsonDataError,
} from "@/lib/command-builder";

describe("clio command builder", () => {
  it("defaults the node URL to http://127.0.0.1:8888", () => {
    expect(buildUrlCommand(DEFAULT_NODE_URL, "")).toBe(
      "clio --url http://127.0.0.1:8888 <COMMAND_PLACEHOLDER>",
    );
  });

  it("creates an account with sysio and signs as the creator", () => {
    expect(
      buildCreateAccountCommand({ creator: "sysio", newAccount: "alice", ownerKey: "KEY1", activeKey: "" }),
    ).toBe("clio create account sysio alice KEY1 -p sysio@active");
  });

  it("appends the active key only when one is given", () => {
    expect(
      buildCreateAccountCommand({ creator: "sysio", newAccount: "alice", ownerKey: "KEY1", activeKey: "KEY2" }),
    ).toBe("clio create account sysio alice KEY1 KEY2 -p sysio@active");
  });

  it("produces the wizard's hi action from the default push-action fields", () => {
    expect(
      buildPushActionCommand({ contract: "mycontract", action: "hi", data: '["bob"]', permission: "bob@active" }),
    ).toBe("clio push action mycontract hi '[\"bob\"]' -p bob@active");
  });

  it("does not double-quote action data the user already wrapped in single quotes", () => {
    expect(
      buildPushActionCommand({ contract: "c", action: "a", data: "'[\"bob\"]'", permission: "bob@active" }),
    ).toBe("clio push action c a '[\"bob\"]' -p bob@active");
  });

  it("rejects account names over 12 characters or with digits outside 1-5", () => {
    expect(accountNameError("abcdefghijklm")).not.toBeNull();
    expect(accountNameError("bob6")).not.toBeNull();
    expect(accountNameError("mycontract12")).toBeNull();
  });

  it("flags invalid JSON action data", () => {
    expect(jsonDataError('["bob"')).not.toBeNull();
    expect(jsonDataError('["bob"]')).toBeNull();
  });
});
