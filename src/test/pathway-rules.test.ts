import { describe, expect, it } from "vitest";
import { getDocuments, readiness } from "@/lib/site";
import { legalRequestSchema } from "@/lib/legal-policy";
describe("Refugee employment preparation rules", () => {
  it("requires a host country before country-specific guidance", () => {
    expect(
      legalRequestSchema.safeParse({
        country: "",
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "Can I work?" }] }],
      }).success,
    ).toBe(false);
  });
  it("does not generate country requirements before a country is selected", () => {
    expect(getDocuments("", "Preparing to apply")).toEqual([]);
  });
  it("rejects unsupported host countries", () => {
    expect(
      legalRequestSchema.safeParse({
        country: "Atlantis",
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "Work permit?" }] }],
      }).success,
    ).toBe(false);
  });
  it("adds an employment contract preparation step when there is a job offer", () => {
    expect(
      getDocuments("United Kingdom", "I have a job offer").some((row) => row.id === "offer"),
    ).toBe(true);
  });
  it("adds salary payment preparation for an employed user", () => {
    expect(
      getDocuments("United Kingdom", "Already employed").some((row) => row.id === "salary"),
    ).toBe(true);
  });
  it("counts only relevant completed documents for readiness", () => {
    expect(
      readiness(["identity", "unrelated"], getDocuments("United Kingdom", "Preparing to apply")),
    ).toBe(33);
  });
  it("cannot increase readiness by marking a document twice", () => {
    expect(
      readiness(["identity", "identity"], getDocuments("United Kingdom", "Preparing to apply")),
    ).toBe(33);
  });
  it("reports complete preparation without producing a legal eligibility result", () => {
    const docs = getDocuments("United Kingdom", "Preparing to apply");
    expect(
      readiness(
        docs.map((d) => d.id),
        docs,
      ),
    ).toBe(100);
    expect(getDocuments("United Kingdom", "unknown stage")).toEqual([]);
  });
});
