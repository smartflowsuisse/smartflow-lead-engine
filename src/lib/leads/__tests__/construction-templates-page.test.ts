import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

function readSource(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function normalize(source: string) {
  return source.replace(/\s+/g, " ");
}

const componentSource = readSource("src/components/ui/ConstructionTemplatesPanel.tsx");
const normalizedComponentSource = normalize(componentSource);

const pageSource = readSource("src/app/construction-templates/page.tsx");

describe("construction templates page regression", () => {
  it("keeps the construction templates route wired to the panel", () => {
    assert.match(pageSource, /ConstructionTemplatesPanel/);
  });

  it("keeps the main construction templates content visible", () => {
    const requiredContent = [
      "Construction Automation Starter",
      "Invoice PDF Automation",
      "Project Task Workflow",
      "Procurement Weekly Report",
      "Implementation Checklist",
      "Client Delivery Pack",
    ];

    for (const content of requiredContent) {
      assert.ok(
        normalizedComponentSource.includes(content),
        `Missing content: ${content}`,
      );
    }
  });

  it("keeps all construction template copy actions available", () => {
    const requiredActions = [
      "Copy audit message",
      "Copy implementation plan",
      "Copy proposal summary",
      "Copy client intake checklist",
    ];

    for (const action of requiredActions) {
      assert.ok(
        normalizedComponentSource.includes(action),
        `Missing action: ${action}`,
      );
    }
  });

  it("keeps multilingual audit message options available", () => {
    assert.match(componentSource, /en/);
    assert.match(componentSource, /fr/);
    assert.match(componentSource, /de/);
  });
});
