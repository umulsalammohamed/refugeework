import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTop } from "@/components/site-shell";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "Our mission and impact",
      "Unlocking displaced talent through trusted guidance, preparation, and financial inclusion.",
    ),
  component: About,
});
function About() {
  return (
    <>
      <PageTop
        eyebrow="UNLOCKING DISPLACED TALENT"
        title="Pathways for skilled refugees"
        description="Breaking Barriers. Connecting Talent. Creating Opportunities."
      />
      <section className="section">
        <div className="site-container grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="section-title">
              Displacement changes a home.
              <br />
              Not a person's potential.
            </h2>
            <p className="section-copy mt-6">
              RefugeeWork Connect is a social-impact hackathon MVP that helps skilled refugees
              navigate unfamiliar employment systems and helps employers create more inclusive
              workplaces.
            </p>
            <p className="section-copy mt-4">
              We bring country-aware legal information, document preparation, and financial
              resources into a clear pathway. Our assistant uses official-source material and makes
              uncertainty explicit.
            </p>
            <Button asChild className="mt-7">
              <Link to="/document-checklist">
                Start your pathway
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div>
            <p className="eyebrow mb-4 text-primary">OUR COMMITMENTS</p>
            {[
              "People before paperwork",
              "Clear information, honest limitations",
              "Privacy by design",
              "Inclusive employment and equal opportunity",
            ].map((t) => (
              <div className="flex items-center gap-3 border-b py-5" key={t}>
                <ShieldCheck size={19} className="text-primary" />
                <h3 className="text-sm font-semibold">{t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container">
          <p className="eyebrow mb-3 text-primary">MEASURING WHAT MATTERS</p>
          <h2 className="section-title">Our impact framework</h2>
          <p className="section-copy mt-4 max-w-2xl">
            These are proposed indicators for a future pilot, not reported results. No real-world
            outcomes have been measured or claimed.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Legal guidance", "People receiving country-aware information"],
              ["Document readiness", "Preparation checklists completed"],
              ["Support connections", "Referrals to recognized organizations"],
              ["Inclusive employers", "Employers accessing compliance resources"],
            ].map(([t, d]) => (
              <article className="feature-card" key={t}>
                <span className="text-[10px] font-semibold text-primary">
                  PROPOSED PILOT INDICATOR
                </span>
                <h3 className="mt-4">{t}</h3>
                <p>{d}</p>
                <p className="mt-5 font-semibold">Not yet measured</p>
              </article>
            ))}
          </div>
          <p className="section-copy mt-6">
            Aligned with SDG 8 · Decent Work, SDG 10 · Reduced Inequalities, and SDG 16 · Peace,
            Justice and Strong Institutions.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="site-container max-w-4xl">
          <h2 className="section-title">Privacy & information policy</h2>
          <div className="mt-6 space-y-4 section-copy">
            <p>
              Public resources can be explored without an account. Accounts store only your email,
              an optional display name, host country, and document checklist completion. Do not
              upload passports, status documents, case files, or bank credentials.
            </p>
            <p>
              The legal assistant does not save chat history in your account or browser. Your
              messages are sent to the AI service to generate answers. Avoid sharing sensitive
              personal information. Reloading or leaving the conversation page clears the
              conversation.
            </p>
            <p>
              Legal and financial content is general information, not professional advice or an
              eligibility determination. Official rules and provider terms take priority.
              Illustrative people and scenarios are fictional; no partnerships or measured impact
              are implied.
            </p>
            <p>
              For local assistance, visit{" "}
              <a
                className="text-primary underline"
                href="https://help.unhcr.org/"
                target="_blank"
                rel="noreferrer"
              >
                UNHCR Help
              </a>
              . This prototype is not an emergency or case-management service.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
