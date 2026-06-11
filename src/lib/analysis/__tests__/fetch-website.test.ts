import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildWebsiteFetchCandidates,
  isRetryableWebsiteFetchError,
} from "../fetch-website";

describe("buildWebsiteFetchCandidates", () => {
  it("keeps explicit http URLs and adds https fallback variants", () => {
    const candidates = buildWebsiteFetchCandidates("http://www.albismetallbau.ch");

    assert.ok(candidates[0]?.startsWith("http://www.albismetallbau.ch"));
    assert.ok(candidates.some((url) => url.startsWith("https://www.albismetallbau.ch")));
    assert.ok(candidates.some((url) => url.startsWith("http://albismetallbau.ch")));
  });

  it("adds http fallback for bare domains that default to https", () => {
    const candidates = buildWebsiteFetchCandidates("www.albismetallbau.ch");

    assert.ok(candidates.includes("https://www.albismetallbau.ch/"));
    assert.ok(candidates.includes("http://www.albismetallbau.ch/"));
    assert.ok(candidates.includes("https://albismetallbau.ch/"));
    assert.ok(candidates.includes("http://albismetallbau.ch/"));
  });

  it("corrects the common abismetallbau discovery typo", () => {
    const candidates = buildWebsiteFetchCandidates("http://www.abismetallbau.ch");

    assert.ok(
      candidates.some((url) => url.includes("albismetallbau.ch")),
      "expected corrected albismetallbau hostname"
    );
  });
});

describe("isRetryableWebsiteFetchError", () => {
  it("retries TLS and DNS failures", () => {
    assert.equal(
      isRetryableWebsiteFetchError(
        Object.assign(new Error("fetch failed"), {
          cause: { code: "ERR_TLS_CERT_ALTNAME_INVALID" },
        })
      ),
      true
    );
    assert.equal(
      isRetryableWebsiteFetchError(
        Object.assign(new Error("fetch failed"), {
          cause: { code: "ENOTFOUND" },
        })
      ),
      true
    );
  });
});
