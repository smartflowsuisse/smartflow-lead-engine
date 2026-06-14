import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canCopyLeadEmail,
  getCopyableLeadEmail,
  getLeadDetailsPath,
  getLeadEmailGeneratorPath,
  LEAD_EMAIL_GENERATOR_HASH,
} from "../outreach-actions";

describe("outreach action helpers", () => {
  it("builds lead detail and email generator paths", () => {
    assert.equal(getLeadDetailsPath(42), "/leads/42");
    assert.equal(
      getLeadEmailGeneratorPath(42),
      `/leads/42#${LEAD_EMAIL_GENERATOR_HASH}`
    );
  });

  it("returns copyable email only when present", () => {
    assert.equal(getCopyableLeadEmail(" info@acme.ch "), "info@acme.ch");
    assert.equal(getCopyableLeadEmail(null), null);
    assert.equal(getCopyableLeadEmail("   "), null);
  });

  it("detects whether copy email is available", () => {
    assert.equal(canCopyLeadEmail({ email: "info@acme.ch" }), true);
    assert.equal(canCopyLeadEmail({ email: null }), false);
    assert.equal(canCopyLeadEmail({ email: "  " }), false);
  });
});
