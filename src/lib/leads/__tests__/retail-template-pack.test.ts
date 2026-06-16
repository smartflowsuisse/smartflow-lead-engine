import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  retailAuditMessages,
  retailClientIntakeChecklist,
  retailImplementationSteps,
  retailLanguageLabels,
  retailProposalSummary,
  retailTemplates,
} from "@/lib/templates/retail-template-pack";

describe("retail template pack", () => {
  it("keeps multilingual audit messages available", () => {
    assert.equal(retailLanguageLabels.en, "EN");
    assert.equal(retailLanguageLabels.fr, "FR");
    assert.equal(retailLanguageLabels.de, "DE");

    assert.ok(retailAuditMessages.en.includes("Retail Automation Starter"));
    assert.ok(retailAuditMessages.fr.includes("Retail Automation Starter"));
    assert.ok(retailAuditMessages.de.includes("Retail Automation Starter"));
  });

  it("keeps the retail workflow templates available", () => {
    const titles = retailTemplates.map((template) => template.title);

    assert.deepEqual(titles, [
      "Catalog Update Workflow",
      "Supplier Invoice Processing",
      "Promotion Price Tracking",
      "Daily Sales Summary",
    ]);
  });

  it("keeps the retail implementation process complete", () => {
    assert.equal(retailImplementationSteps.length, 7);

    assert.equal(retailImplementationSteps[0]?.title, "Audit retail workflow");
    assert.equal(retailImplementationSteps[6]?.title, "Start monthly support");
  });

  it("keeps proposal and intake copy text available", () => {
    assert.ok(retailProposalSummary.includes("CHF 4'000–10'000"));
    assert.ok(retailProposalSummary.includes("Free workflow audit"));

    assert.ok(retailClientIntakeChecklist.includes("Product catalog export"));
    assert.ok(retailClientIntakeChecklist.includes("Supplier invoices"));
    assert.ok(retailClientIntakeChecklist.includes("Saby/SBIS"));
  });
});
