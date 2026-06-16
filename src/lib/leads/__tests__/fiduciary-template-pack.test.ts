import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fiduciaryAuditMessages,
  fiduciaryClientIntakeChecklist,
  fiduciaryImplementationSteps,
  fiduciaryLanguageLabels,
  fiduciaryProposalSummary,
  fiduciaryTemplates,
} from "@/lib/templates/fiduciary-template-pack";
import {
  getTemplatePack,
  templatePackOptions,
  templatePackRegistry,
} from "@/lib/templates/template-pack-registry";

describe("fiduciary template pack", () => {
  it("defines multilingual fiduciary audit messages", () => {
    assert.equal(fiduciaryLanguageLabels.en, "EN");
    assert.equal(fiduciaryLanguageLabels.fr, "FR");
    assert.equal(fiduciaryLanguageLabels.de, "DE");

    assert.ok(fiduciaryAuditMessages.en.includes("Fiduciary Automation Starter"));
    assert.ok(fiduciaryAuditMessages.fr.includes("SmartFlow Suisse"));
    assert.ok(fiduciaryAuditMessages.de.includes("SmartFlow Suisse"));
  });

  it("defines fiduciary workflow templates", () => {
    assert.equal(fiduciaryTemplates.length, 4);

    assert.deepEqual(
      fiduciaryTemplates.map((template) => template.title),
      [
        "Client Document Intake",
        "VAT / TVA Review Workflow",
        "Monthly Reporting Summary",
        "Client Follow-up Tasks",
      ],
    );
  });

  it("defines fiduciary implementation steps and copy content", () => {
    assert.equal(fiduciaryImplementationSteps.length, 7);
    assert.ok(fiduciaryProposalSummary.includes("CHF 5'000–11'000"));
    assert.ok(fiduciaryClientIntakeChecklist.includes("VAT/TVA review examples"));
  });

  it("registers fiduciary in the template pack registry", () => {
    assert.ok(templatePackRegistry.fiduciary);

    const pack = getTemplatePack("fiduciary");

    assert.equal(pack.id, "fiduciary");
    assert.equal(pack.offerName, "Fiduciary Automation Starter");
    assert.equal(pack.templates.length, 4);
    assert.equal(pack.implementationSteps.length, 7);
    assert.ok(pack.auditMessages.en.includes("client documents"));
  });

  it("shows fiduciary in template pack options", () => {
    assert.deepEqual(
      templatePackOptions.map((option) => option.id),
      ["construction", "retail", "fiduciary"],
    );
  });
});
