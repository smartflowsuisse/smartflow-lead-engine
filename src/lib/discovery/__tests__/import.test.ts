import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDiscoveryLeadInput } from "../import";
import type { DiscoveryCandidate } from "../types";

describe("buildDiscoveryLeadInput", () => {
  it("maps discovery fields and sets New Lead status", () => {
    const candidate: DiscoveryCandidate = {
      company: "Albis Metallbau GmbH",
      website: "http://www.albismetallbau.ch",
      city: "Zürich",
      industry: "Metallbau",
    };

    assert.deepEqual(buildDiscoveryLeadInput(candidate), {
      company: "Albis Metallbau GmbH",
      website: "http://www.albismetallbau.ch",
      city: "Zürich",
      industry: "Metallbau",
      status: "New Lead",
      notes: "Imported from Discovery",
    });
  });
});
