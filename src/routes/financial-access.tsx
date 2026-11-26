import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Smartphone, Wallet, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { PageTop } from "@/components/site-shell";
import { pageHead, countries, officialSources, type Country } from "@/lib/site";
export const Route = createFileRoute("/financial-access")({
  head: () =>
    pageHead(
      "Financial access",
      "Explore banking, salary payments, financial literacy and trusted support for refugees.",
    ),
  component: Finance,
});
const resources = [
  {
    icon: Landmark,
    title: "Opening a bank account",
    text: "Banks usually need evidence of identity and may ask for an address. Accepted documents differ by institution and country. Ask about basic accounts and alternative evidence.",
    url: "https://www.moneyhelper.org.uk/en/everyday-money/banking/basic-bank-accounts",
    label: "MoneyHelper · Basic bank accounts",
    scope: "United Kingdom · General guidance",
  },
  {
    icon: Wallet,
    title: "Receiving your salary",
    text: "Confirm payment frequency, payslips, fees and how to receive wages with your employer. Never share your PIN or online banking password with an employer.",
    url: "https://www.ilo.org/topics/wages",
    label: "International Labour Organization · Wages",
    scope: "Global · General information",
  },
  {
    icon: Smartphone,
    title: "Digital & mobile payments",
    text: "Compare regulated providers, fees, identification requirements and access to cash. Availability does not mean that you personally qualify for a service.",
    url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/mobile-money/",
    label: "GSMA · Mobile money resources",
    scope: "Global · Educational resource",
  },
  {
    icon: BookOpen,
    title: "Build financial confidence",
    text: "Learn to budget, recognize scams, compare borrowing costs and plan savings. Check whether a provider is authorized before sending money or sharing your details.",
    url: "https://www.moneyhelper.org.uk/en/everyday-money/budgeting",
    label: "MoneyHelper · Budgeting",
    scope: "United Kingdom · Educational resource",
  },
];
function Finance() {
  const [country, setCountry] = useState<Country>("United Kingdom");
  return (
    <>
      <PageTop
        eyebrow="BUILD YOUR FINANCIAL INDEPENDENCE"
        title="Financial access, one step at a time"
        description="Understand your options for banking, receiving wages, and managing money—with reliable resources to help you make informed decisions."
      />
      <section className="section">
        <div className="site-container">
          <div className="mb-9 grid items-center gap-6 md:grid-cols-[1fr_320px]">
            <div className="notice">
              <strong>General information, not confirmed eligibility.</strong> Requirements change
              by status, location and provider. Always confirm directly with the bank or service.
            </div>
            <label>
              <span className="field-label">Find support in your host country</span>
              <select
                className="field"
                value={country}
                onChange={(e) => setCountry(e.target.value as Country)}
              >
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((r) => (
              <article key={r.title} className="feature-card">
                <div className="feature-icon">
                  <r.icon size={23} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{r.scope}</span>
                <h2 className="mb-3 mt-3 text-xl font-bold">{r.title}</h2>
                <p>{r.text}</p>
                <a href={r.url} className="card-link" target="_blank" rel="noreferrer">
                  {r.label}
                  <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-7 border-t pt-8 sm:grid-cols-2">
            <div>
              <ShieldCheck className="mb-3 text-primary" />
              <h2 className="text-lg font-bold">Know your next point of contact</h2>
              <p className="section-copy mt-3">
                For bank-specific account terms, contact the financial institution directly. For
                support with your status or documents, start with an official or recognized
                organization.
              </p>
            </div>
            <div className="space-y-4">
              <a
                className="card-link flex"
                href={officialSources[country].url}
                target="_blank"
                rel="noreferrer"
              >
                {officialSources[country].name}
                <ExternalLink size={14} />
              </a>
              <a
                className="card-link flex"
                href="https://help.unhcr.org/"
                target="_blank"
                rel="noreferrer"
              >
                UNHCR · Find local support
                <ExternalLink size={14} />
              </a>
              <a
                className="card-link flex"
                href="https://www.hsbc.co.uk/current-accounts/products/basic-bank-account/"
                target="_blank"
                rel="noreferrer"
              >
                HSBC UK · Basic Bank Account terms
                <ExternalLink size={14} />
              </a>
              <p className="text-xs leading-6 text-muted-foreground">
                UK institution link. Not a recommendation or guarantee of account acceptance. No
                financial partnership is implied.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
