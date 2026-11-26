import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BriefcaseBusiness, Users, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTop } from "@/components/site-shell";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/employer-hub")({
  head: () =>
    pageHead(
      "Employer hub",
      "Practical compliance and inclusive recruitment guidance for employers hiring refugees.",
    ),
  component: Employer,
});
function Employer() {
  const [checked, setChecked] = useState<string[]>([]);
  const steps = [
    "Confirm the applicable right-to-work process",
    "Verify permission and any employment restrictions",
    "Assess qualifications fairly and consistently",
    "Provide a clear contract and equal pay",
    "Agree a safe salary payment method",
    "Offer a supportive onboarding contact",
  ];
  return (
    <>
      <PageTop
        eyebrow="INCLUSIVE HIRING. STRONGER TEAMS."
        title="Open your doors to displaced talent"
        description="Skills don't disappear at a border. Find practical starting points for fair recruitment, responsible employment, and a welcoming workplace."
      />
      <section className="section">
        <div className="site-container grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {[
              [
                ShieldCheck,
                "Start with compliance",
                "Check employment eligibility using the official process in your country. Refugee status and an asylum claim are not interchangeable. Never rely on a checklist as a legal determination.",
              ],
              [
                Users,
                "Recognize potential fairly",
                "Use skills-based assessment, recognize transferable experience, and avoid unnecessary requirements for local employment history. Regulated professions may require licensing.",
              ],
              [
                BriefcaseBusiness,
                "Make belonging part of onboarding",
                "Explain workplace expectations clearly. Provide language support where possible and nominate a colleague for questions. Ask only for information necessary for employment.",
              ],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Users;
              return (
                <div key={String(t)}>
                  <I className="mb-4 text-primary" />
                  <h2 className="mb-3 text-xl font-bold">{String(t)}</h2>
                  <p className="section-copy">{String(d)}</p>
                </div>
              );
            })}
            <a
              href="https://www.gov.uk/check-job-applicant-right-to-work"
              target="_blank"
              rel="noreferrer"
              className="card-link"
            >
              GOV.UK · Check a job applicant's right to work
              <ExternalLink size={15} />
            </a>
            <p className="text-xs text-muted-foreground">
              United Kingdom guidance. Confirm local requirements elsewhere.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold">Your inclusive onboarding checklist</h2>
            <p className="section-copy mt-3 mb-6">
              {checked.length} of {steps.length} preparation steps completed · Session only
            </p>
            {steps.map((s) => (
              <label key={s} className="document-row cursor-pointer">
                <Checkbox
                  checked={checked.includes(s)}
                  onCheckedChange={(v) =>
                    setChecked((old) => (v ? [...old, s] : old.filter((t) => t !== s)))
                  }
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
            <div className="notice mt-7">
              This is a general preparation aid, not a compliance certification. Seek qualified
              advice for your country and circumstances.
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container">
          <h2 className="section-title mb-7">Common employer questions</h2>
          {[
            [
              "Can all refugees and asylum seekers work?",
              "Rules depend on the country and the person’s status. Check official evidence of permission and any restrictions before employment.",
            ],
            [
              "Should I request refugee case files?",
              "Avoid unnecessary collection of sensitive information. Request only evidence that the official employment verification process requires.",
            ],
            [
              "How can I evaluate overseas experience?",
              "Assess relevant skills using consistent criteria. Contact the appropriate recognition or licensing authority for regulated roles.",
            ],
          ].map(([q, a]) => (
            <details className="border-b py-5" key={q}>
              <summary className="cursor-pointer text-sm font-semibold">{q}</summary>
              <p className="section-copy mt-4 max-w-3xl">{a}</p>
            </details>
          ))}
          <Button asChild className="mt-8">
            <Link to="/legal-guidance">
              Explore legal guidance
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
