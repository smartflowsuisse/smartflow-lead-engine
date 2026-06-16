import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTemplatePackLeadReviewPath,
  getTemplatePackOutreachPath,
  getTemplatePackQuery,
  TEMPLATE_PACK_QUERY_PARAM,
} from "@/lib/leads/outreach-actions";
import {
  templatePackOptions,
  type TemplatePackId,
} from "@/lib/templates/template-pack-registry";

describe("template pack outreach bridge", () => {
  it("defines the template pack query parameter", () => {
    assert.equal(TEMPLATE_PACK_QUERY_PARAM, "templatePack");
  });

  it("builds template pack query strings", () => {
    assert.equal(getTemplatePackQuery("construction"), "templatePack=construction");
    assert.equal(getTemplatePackQuery("retail"), "templatePack=retail");
    assert.equal(getTemplatePackQuery("fiduciary"), "templatePack=fiduciary");
  });

  it("builds outreach paths for every template pack", () => {
    const packIds = templatePackOptions.map((option) => option.id);

    assert.deepEqual(packIds, ["construction", "retail", "fiduciary"]);

    for (const packId of packIds) {
      assert.equal(
        getTemplatePackOutreachPath(packId),
        `/outreach?templatePack=${packId}`,
      );
    }
  });

  it("builds lead review paths for every template pack", () => {
    const packIds: TemplatePackId[] = ["construction", "retail", "fiduciary"];

    for (const packId of packIds) {
      assert.equal(
        getTemplatePackLeadReviewPath(packId),
        `/leads?templatePack=${packId}`,
      );
    }
  });
});
