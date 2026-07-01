import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CONVERT_TO_CLIENT_ALLOWED_STATUSES,
  CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS,
  CONVERT_TO_CLIENT_REQUIRED_TESTS,
} from "../convert-to-client-contract";

describe("convert-to-client-contract", () => {
  it("defines allowed conversion statuses", () => {
    assert.deepEqual(CONVERT_TO_CLIENT_ALLOWED_STATUSES, [
      "Won",
      "closed-won",
      "client-won",
    ]);
  });

  it("keeps external actions blocked", () => {
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("database-write"));
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("lead-status-update"));
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("gmail-draft"));
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("email-send"));
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("make-scenario"));
    assert.ok(CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("openai-call"));
    assert.ok(
      CONVERT_TO_CLIENT_BLOCKED_EXTERNAL_ACTIONS.includes("external-notification"),
    );
  });

  it("lists required tests before real conversion", () => {
    assert.ok(
      CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("won-lead-produces-client-draft"),
    );
    assert.ok(CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("non-won-lead-is-blocked"));
    assert.ok(
      CONVERT_TO_CLIENT_REQUIRED_TESTS.includes(
        "optional-fields-use-safe-defaults",
      ),
    );
    assert.ok(
      CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("duplicate-source-lead-is-blocked"),
    );
    assert.ok(CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("audit-event-is-generated"));
    assert.ok(
      CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("rollback-context-is-present"),
    );
    assert.ok(
      CONVERT_TO_CLIENT_REQUIRED_TESTS.includes("no-external-action-is-triggered"),
    );
  });
});
