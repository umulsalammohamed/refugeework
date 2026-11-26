import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Globe2, Menu, X, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
const nav = [
  ["/", "Home"],
  ["/legal-guidance", "Legal Guidance"],
  ["/document-checklist", "Document Checklist"],
  ["/financial-access", "Financial Access"],
  ["/employer-hub", "Employer Hub"],
  ["/about", "About Us"],
] as const;
export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="RefugeeWork Connect home">
      <Sprout className="brand-mark" strokeWidth={1.6} />
      <div className="brand-name">
        RefugeeWork<span>CONNECT</span>
      </div>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 bg-background p-3"
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-container flex h-full items-center justify-between gap-5">
          <Brand />
          <nav aria-label="Main navigation" className="desktop-nav flex items-center gap-6">
            {nav.map(([to, label]) => (
              <Link key={to} to={to} className={`nav-link ${pathname === to ? "active" : ""}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link to="/dashboard">
                My dashboard <ArrowUpRight />
              </Link>
            </Button>
            <Button
              onClick={() => setOpen(!open)}
              size="icon"
              variant="ghost"
              className="min-[901px]:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav
            aria-label="Mobile navigation"
            className="relative z-30 flex flex-col border-b bg-background px-6 py-4 shadow-lg"
          >
            {nav.map(([to, label]) => (
              <Link to={to} key={to} onClick={() => setOpen(false)} className="py-3 text-sm">
                {label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-primary"
            >
              My dashboard
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="grid gap-9 pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs text-xs leading-7 opacity-70">
              Breaking Barriers. Connecting Talent.
              <br />
              Creating Opportunities.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs opacity-70">
              <Globe2 size={14} /> Unlocking displaced talent, together.
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Find your pathway</h3>
            <div className="flex flex-col gap-3">
              <Link to="/legal-guidance">Legal guidance</Link>
              <Link to="/document-checklist">Document checklist</Link>
              <Link to="/financial-access">Financial access</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Our community</h3>
            <div className="flex flex-col gap-3">
              <Link to="/employer-hub">For employers</Link>
              <Link to="/about">About us & impact</Link>
              <Link to="/dashboard">Your dashboard</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Need support?</h3>
            <div className="flex flex-col gap-3">
              <a href="https://help.unhcr.org/" target="_blank" rel="noreferrer">
                Find UNHCR support ↗
              </a>
              <a href="https://www.refugeecouncil.org.uk/" target="_blank" rel="noreferrer">
                Refugee Council ↗
              </a>
              <Link to="/about">Privacy & information policy</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-on-navy/15 py-5 text-[10px] opacity-65">
          <span>© 2026 RefugeeWork Connect. Hackathon MVP.</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={13} /> General information. Not legal advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
export function PageTop({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-top">
      <div className="site-container">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="section-copy max-w-2xl">{description}</p>
      </div>
    </section>
  );
}
