import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTemplatePack,
  templatePackOptions,
  templatePackRegistry,
  type TemplatePackId,
} from "@/lib/templates/template-pack-registry";

describe("template pack registry", () => {
  it("registers construction, retail, and fiduciary template packs", () => {
    assert.deepEqual(Object.keys(templatePackRegistry).sort(), [
      "construction",
      "fiduciary",
      "retail",
    ]);
  });

  it("keeps template pack options available for future UI selectors", () => {
    assert.equal(templatePackOptions.length, 3);

    assert.deepEqual(
      templatePackOptions.map((option) => option.id),
      ["construction", "retail", "fiduciary"],
    );
  });

  it("returns the construction template pack", () => {
    const pack = getTemplatePack("construction");

    assert.equal(pack.id, "construction");
    assert.equal(pack.offerName, "Construction Automation Starter");
    assert.equal(pack.templates.length, 3);
    assert.equal(pack.implementationSteps.length, 7);
    assert.ok(pack.auditMessages.en.includes("Construction Automation Starter"));
  });

  it("returns the retail template pack", () => {
    const pack = getTemplatePack("retail");

    assert.equal(pack.id, "retail");
    assert.equal(pack.offerName, "Retail Automation Starter");
    assert.equal(pack.templates.length, 4);
    assert.equal(pack.implementationSteps.length, 7);
    assert.ok(pack.auditMessages.en.includes("Retail Automation Starter"));
  });

  it("returns the fiduciary template pack", () => {
    const pack = getTemplatePack("fiduciary");

    assert.equal(pack.id, "fiduciary");
    assert.equal(pack.offerName, "Fiduciary Automation Starter");
    assert.equal(pack.templates.length, 4);
    assert.equal(pack.implementationSteps.length, 7);
    assert.ok(pack.auditMessages.en.includes("Fiduciary Automation Starter"));
  });

  it("keeps all registered packs multilingual", () => {
    const packIds: TemplatePackId[] = ["construction", "retail", "fiduciary"];

    for (const packId of packIds) {
      const pack = getTemplatePack(packId);

      assert.deepEqual([...pack.languages], ["en", "fr", "de"]);
      assert.ok(pack.auditMessages.en);
      assert.ok(pack.auditMessages.fr);
      assert.ok(pack.auditMessages.de);
    }
  });
});
