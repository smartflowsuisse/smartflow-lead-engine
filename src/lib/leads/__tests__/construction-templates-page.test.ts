import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const componentSource = readFileSync(
  "src/components/ui/ConstructionTemplatesPanel.tsx",
  "utf8",
);

const constructionPackSource = readFileSync(
  "src/lib/templates/construction-template-pack.ts",
  "utf8",
);

const retailPackSource = readFileSync(
  "src/lib/templates/retail-template-pack.ts",
  "utf8",
);

const registrySource = readFileSync(
  "src/lib/templates/template-pack-registry.ts",
  "utf8",
);

describe("construction templates page", () => {
  it("uses the template pack registry instead of hardcoded page data", () => {
    assert.ok(componentSource.includes("getTemplatePack"));
    assert.ok(componentSource.includes("templatePackOptions"));
    assert.ok(componentSource.includes("type TemplatePackId"));
    assert.ok(componentSource.includes('useState<TemplatePackId>("construction")'));
  });

  it("keeps the template pack selector visible", () => {
    assert.ok(componentSource.includes("Template pack"));
    assert.ok(componentSource.includes("templatePackOptions.map"));
    assert.ok(componentSource.includes("setSelectedPackId"));
  });

  it("keeps the main copy actions visible", () => {
    assert.ok(componentSource.includes("copyAuditMessage"));
    assert.ok(componentSource.includes("copyImplementationPlan"));
    assert.ok(componentSource.includes("copyProposalSummary"));
    assert.ok(componentSource.includes("copyClientIntakeChecklist"));

    assert.ok(componentSource.includes("Copy audit message"));
    assert.ok(componentSource.includes("Copy implementation plan"));
    assert.ok(componentSource.includes("Copy proposal summary"));
    assert.ok(componentSource.includes("Copy client intake checklist"));
  });

  it("keeps the construction template pack content available", () => {
    assert.ok(constructionPackSource.includes("Construction Automation Starter"));
    assert.ok(constructionPackSource.includes("Invoice PDF Automation"));
    assert.ok(constructionPackSource.includes("Project Task Workflow"));
    assert.ok(constructionPackSource.includes("Procurement Weekly Report"));
    assert.ok(constructionPackSource.includes("Audit client workflow"));
    assert.ok(constructionPackSource.includes("Start monthly support"));
  });

  it("keeps the retail template pack content available", () => {
    assert.ok(retailPackSource.includes("Retail Automation Starter"));
    assert.ok(retailPackSource.includes("Catalog Update Workflow"));
    assert.ok(retailPackSource.includes("Supplier Invoice Processing"));
    assert.ok(retailPackSource.includes("Promotion Price Tracking"));
    assert.ok(retailPackSource.includes("Daily Sales Summary"));
  });

  it("keeps construction and retail registered", () => {
    assert.ok(registrySource.includes('TemplatePackId = "construction" | "retail"'));
    assert.ok(registrySource.includes("constructionTemplate"));
    assert.ok(registrySource.includes("retailTemplate"));
    assert.ok(registrySource.includes('id: "construction"'));
    assert.ok(registrySource.includes('id: "retail"'));
  });
});
