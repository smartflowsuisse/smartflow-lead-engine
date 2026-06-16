import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTemplatePackContext,
  isTemplatePackId,
} from "@/lib/templates/template-pack-context";

describe("template pack context", () => {
  it("accepts known template pack ids", () => {
    assert.equal(isTemplatePackId("construction"), true);
    assert.equal(isTemplatePackId("retail"), true);
    assert.equal(isTemplatePackId("fiduciary"), true);
  });

  it("rejects unknown template pack ids", () => {
    assert.equal(isTemplatePackId("unknown"), false);
    assert.equal(isTemplatePackId(""), false);
    assert.equal(isTemplatePackId(null), false);
    assert.equal(isTemplatePackId(undefined), false);
  });

  it("returns template pack context for known ids", () => {
    assert.equal(
      getTemplatePackContext("construction")?.offerName,
      "Construction Automation Starter",
    );

    assert.equal(
      getTemplatePackContext("retail")?.offerName,
      "Retail Automation Starter",
    );

    assert.equal(
      getTemplatePackContext("fiduciary")?.offerName,
      "Fiduciary Automation Starter",
    );
  });

  it("returns null for invalid template pack context", () => {
    assert.equal(getTemplatePackContext("invalid"), null);
    assert.equal(getTemplatePackContext(null), null);
    assert.equal(getTemplatePackContext(undefined), null);
  });
});
