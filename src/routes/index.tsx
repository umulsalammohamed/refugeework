import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Scale,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Globe2,
  HeartHandshake,
  Check,
  MoveUpRight,
  BriefcaseBusiness,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/site";
import hero from "@/assets/refugeework-community.asset.json";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Your skills deserve an opportunity",
      "Breaking barriers and connecting skilled refugees to employment, legal guidance, document readiness, and financial access.",
    ),
  component: Home,
});
const features = [
  {
    icon: Scale,
    title: "Clarity on your right to work",
    description:
      "Understand work permits, employment regulations, and your rights in your host country.",
    link: "Explore legal guidance",
    to: "/legal-guidance",
  },
  {
    icon: FileCheck2,
    title: "Be ready for your next step",
    description: "Build your personal document checklist and track what you need to move forward.",
    link: "Check your documents",
    to: "/document-checklist",
  },
  {
    icon: Landmark,
    title: "Open doors to financial access",
    description:
      "Find guidance on banking, salary payments, and services that help you build financial independence.",
    link: "Explore financial resources",
    to: "/financial-access",
  },
] as const;
function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-photo"
          src={hero.url}
          alt="Skilled professionals collaborating around a laptop in a welcoming workplace"
        />
        <div className="site-container hero-content reveal">
          <div className="hero-badge">
            <span className="size-1.5 rounded-full bg-teal-light" /> UNLOCKING DISPLACED TALENT
          </div>
          <h1>
            Your Skills Deserve
            <br />
            an <em>Opportunity.</em>
          </h1>
          <p className="hero-copy">
            A new country shouldn't mean starting from zero. Navigate employment rules, prepare your
            documents, and access financial services—with support every step of the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild className="h-12 px-6">
              <Link to="/document-checklist">
                Get Started <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="hero" asChild className="h-12 px-6">
              <Link to="/legal-guidance">
                Explore Legal Guidance <MoveUpRight />
              </Link>
            </Button>
          </div>
          <div className="hero-note">
            <ShieldCheck size={15} /> Free to explore. Built around you. Your privacy comes first.
          </div>
        </div>
        <div className="hero-quote">
          Talent has no borders.
          <br />
          <span className="text-[11px] opacity-70">Opportunity shouldn't either.</span>
        </div>
      </section>
      <div className="trust-strip">
        <div className="site-container grid grid-cols-2 gap-x-5 lg:grid-cols-4">
          {[
            [ShieldCheck, "Trusted, official-source guidance"],
            [Globe2, "Country-specific pathways"],
            [HeartHandshake, "People-first & inclusive"],
            [Check, "Aligned with the UN SDGs"],
          ].map(([Icon, text]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div className="trust-item" key={String(text)}>
                <I size={19} className="shrink-0 text-primary" />
                <span>{String(text)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <section className="section">
        <div className="site-container">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow mb-3 text-primary">YOUR PATHWAY TO POSSIBILITY</p>
              <h2 className="section-title">Less uncertainty. More opportunity.</h2>
            </div>
            <p className="section-copy max-w-sm">
              Practical support to help you turn your experience
              <br className="hidden lg:block" /> into your next chapter.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((f, i) => (
              <article className="feature-card" key={f.title}>
                <div className={`feature-icon ${i === 2 ? "warm" : ""}`}>
                  <f.icon size={23} strokeWidth={1.65} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
                <Link to={f.to} className="card-link">
                  {f.link}
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-muted">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow mb-4 text-primary">THE CHALLENGE ISN'T A LACK OF TALENT</p>
            <h2 className="section-title max-w-md">
              A fresh start shouldn't come with closed doors.
            </h2>
            <p className="section-copy mt-5 max-w-md">
              Engineers. Educators. Healthcare professionals. Entrepreneurs. Displacement doesn't
              erase a lifetime of skills—but unfamiliar systems can make those skills harder to use.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Complex regulations", "Missing documentation", "Financial exclusion"].map((t) => (
                <span key={t} className="border bg-background px-3 py-2 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-7">
            {[
              [
                "01",
                "Tell us where you are",
                "Choose your host country and the stage of your employment journey.",
              ],
              [
                "02",
                "Understand your next steps",
                "Get understandable guidance and a practical document checklist.",
              ],
              [
                "03",
                "Move forward with confidence",
                "Connect with financial resources and trusted support organizations.",
              ],
            ].map(([n, t, d]) => (
              <div className="flex gap-5" key={n}>
                <span className="step-number shrink-0">{n}</span>
                <div>
                  <h3 className="text-base font-bold">{t}</h3>
                  <p className="section-copy mt-2">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="site-container">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3 text-primary">OPPORTUNITY IS A SHARED RESPONSIBILITY</p>
            <h2 className="section-title">Better pathways. Lasting impact.</h2>
            <p className="section-copy mt-3">
              Our mission contributes to three United Nations Sustainable Development Goals.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "08",
                "Decent work & economic growth",
                "Supporting access to fair, meaningful employment.",
              ],
              [
                "10",
                "Reduced inequalities",
                "Making information and financial access more inclusive.",
              ],
              [
                "16",
                "Peace, justice & strong institutions",
                "Connecting people with trustworthy guidance and support.",
              ],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-4 border-t-2 border-primary pt-6">
                <span className="font-display text-4xl font-bold text-primary/40">{n}</span>
                <div>
                  <h3 className="text-sm font-bold">{t}</h3>
                  <p className="section-copy mt-2 text-xs">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/about" className="card-link">
              Our impact framework <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section bg-secondary">
        <div className="site-container grid gap-8 md:grid-cols-2">
          <div>
            <Quote size={27} className="mb-5 text-primary" />
            <p className="font-display text-xl font-semibold leading-relaxed">
              “Knowing which documents to prepare would help me focus on my next step—not just the
              barriers.”
            </p>
            <p className="mt-5 text-sm font-semibold">Amina · Skilled professional</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Illustrative scenario · Fictional person, not a real testimonial
            </p>
          </div>
          <div className="md:border-l md:pl-12">
            <BriefcaseBusiness size={27} className="mb-5 text-primary" />
            <h2 className="section-title text-2xl">Great talent. Inclusive workplaces.</h2>
            <p className="section-copy mt-4">
              Build a fairer hiring process with practical compliance guidance and thoughtful
              onboarding.
            </p>
            <Button variant="outline" asChild className="mt-6">
              <Link to="/employer-hub">
                Visit the Employer Hub <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
