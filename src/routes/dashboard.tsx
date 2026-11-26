import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, FileCheck2, Scale, Landmark, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTop } from "@/components/site-shell";
import { useAccount } from "@/components/account-context";
import { supabase } from "@/integrations/supabase/client";
import { pageHead, countries, getDocuments, readiness } from "@/lib/site";
import type { Tables } from "@/integrations/supabase/types";
export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Your dashboard",
      "Your personal employment pathway, profile, document progress and support resources.",
    ),
  component: Dashboard,
});
function Dashboard() {
  const { user, loading } = useAccount();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [progress, setProgress] = useState<Tables<"document_progress">[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("document_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
    ]).then(([p, d]) => {
      if (!active) return;
      setName(p.data?.display_name ?? "");
      setCountry(p.data?.host_country ?? "");
      setProgress(d.data ?? []);
      setLoaded(true);
      if (p.error || d.error)
        setMessage("Some account information could not be loaded. Please refresh.");
    });
    return () => {
      active = false;
      setLoaded(false);
    };
  }, [user]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: name.trim(), host_country: country });
    setMessage(error ? "Profile could not be saved. Please try again." : "Your profile is saved.");
    setBusy(false);
  }
  return (
    <>
      <PageTop
        eyebrow="YOUR PERSONAL PATHWAY"
        title={user && name ? `Welcome, ${name}.` : "Your next chapter, at your pace."}
        description="Your preparation, progress, and trusted resources—all in one place."
      />
      <section className="section">
        <div className="site-container">
          {loading ? (
            <p>Loading your account…</p>
          ) : !user ? (
            <div className="notice">
              <h2 className="text-lg font-bold">A little clarity for your next step.</h2>
              <p className="my-4">
                Sign in to view your profile and save your document checklist. Public guidance is
                always available without an account.
              </p>
              <Button asChild>
                <Link to="/auth">
                  Sign in or create an account
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-9 flex justify-between gap-4">
                <h2 className="text-xl font-bold">Your employment journey</h2>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) setMessage("Could not sign out. Please try again.");
                  }}
                >
                  <LogOut />
                  Sign out
                </Button>
              </div>
              <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
                <div>
                  <h2 className="mb-5 text-lg font-bold">Your profile</h2>
                  <form className="space-y-5" onSubmit={save}>
                    <label className="block">
                      <span className="field-label">Display name</span>
                      <input
                        className="field"
                        maxLength={80}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="field-label">Host country</span>
                      <select
                        className="field"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="">Choose your country</option>
                        {countries.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <Button type="submit" disabled={busy || !loaded}>
                      {busy ? "Saving…" : "Save profile"}
                    </Button>
                    <p role="status" className="text-sm text-primary">
                      {message}
                    </p>
                  </form>
                </div>
                <div>
                  <h2 className="mb-4 text-lg font-bold">Your saved document progress</h2>
                  {!loaded ? (
                    <p>Loading progress…</p>
                  ) : progress.length === 0 ? (
                    <div className="notice">
                      No checklist saved yet. Choose your host country to start preparing.
                    </div>
                  ) : (
                    progress.map((row) => (
                      <div key={row.id} className="border-b py-5">
                        <div className="mb-3 flex justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold">{row.country}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{row.situation}</p>
                          </div>
                          <span className="text-xl font-bold text-primary">
                            {readiness(row.completed, getDocuments(row.country, row.situation))}%
                          </span>
                        </div>
                        <div className="progress-track">
                          <progress
                            value={readiness(
                              row.completed,
                              getDocuments(row.country, row.situation),
                            )}
                            max={100}
                            aria-label={`${row.country} checklist progress`}
                          />
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {row.completed.length} preparation steps marked ready
                        </p>
                      </div>
                    ))
                  )}
                  <Link to="/document-checklist" className="card-link">
                    Continue your document checklist
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </>
          )}
          <div className="mt-12 grid gap-5 border-t pt-9 md:grid-cols-3">
            {[
              [
                Scale,
                "Legal guidance",
                "Ask questions and find official information.",
                "/legal-guidance",
              ],
              [
                FileCheck2,
                "Document readiness",
                "Prepare the essentials for your next step.",
                "/document-checklist",
              ],
              [
                Landmark,
                "Financial resources",
                "Explore banking and salary payment guidance.",
                "/financial-access",
              ],
            ].map(([Icon, t, d, to]) => {
              const I = Icon as typeof Scale;
              return (
                <article className="feature-card" key={String(t)}>
                  <I className="mb-5 text-primary" />
                  <h3>{String(t)}</h3>
                  <p>{String(d)}</p>
                  <Link
                    to={to as "/legal-guidance" | "/document-checklist" | "/financial-access"}
                    className="card-link"
                  >
                    Explore
                    <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
          <a className="card-link" href="https://help.unhcr.org/" target="_blank" rel="noreferrer">
            Find a local support organization
            <ExternalLink size={15} />
          </a>
        </div>
      </section>
    </>
  );
}
