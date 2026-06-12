import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAutoAnalyzeAfterDiscoveryImport } from "../queue-lead-analysis";
import { runLeadWebsiteAnalysis } from "../run-lead-analysis";

describe("shouldAutoAnalyzeAfterDiscoveryImport", () => {
  it("queues analysis when the lead has a website", () => {
    assert.equal(
      shouldAutoAnalyzeAfterDiscoveryImport({
        website: "https://example.ch",
      }),
      true
    );
  });

  it("skips analysis when the lead has no website", () => {
    assert.equal(
      shouldAutoAnalyzeAfterDiscoveryImport({
        website: null,
      }),
      false
    );
    assert.equal(
      shouldAutoAnalyzeAfterDiscoveryImport({
        website: "   ",
      }),
      false
    );
  });
});

describe("runLeadWebsiteAnalysis", () => {
  it("returns not_found for unknown leads", async () => {
    const result = await runLeadWebsiteAnalysis(999_999_999);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "not_found");
    }
  });
});
