import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileCheck2, ArrowRight, ShieldCheck, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTop } from "@/components/site-shell";
import { useAccount } from "@/components/account-context";
import { supabase } from "@/integrations/supabase/client";
import {
  pageHead,
  countries,
  situations,
  getDocuments,
  readiness,
  officialSources,
  type Country,
} from "@/lib/site";
export const Route = createFileRoute("/document-checklist")({
  head: () =>
    pageHead(
      "Document readiness",
      "Prepare a country-aware employment document checklist and track your next steps.",
    ),
  component: Documents,
});
function Documents() {
  const [country, setCountry] = useState<Country | " ">(" ");
  const [situation, setSituation] = useState<string>("Preparing to apply");
  const [completed, setCompleted] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAccount();
  const rows = getDocuments(country, situation);
  const percent = readiness(completed, rows);
  useEffect(() => {
    setCompleted([]);
    setFeedback("");
    if (!user || country === " ") return;
    let active = true;
    setLoading(true);
    supabase
      .from("document_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("country", country)
      .eq("situation", situation)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active) {
          setCompleted(data?.completed ?? []);
          setLoading(false);
          if (error) setFeedback("Could not load saved progress. Please try again.");
        }
      });
    return () => {
      active = false;
      setLoading(false);
    };
  }, [country, situation, user]);
  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("document_progress")
      .upsert(
        { user_id: user.id, country, situation, completed, updated_at: new Date().toISOString() },
        { onConflict: "user_id,country,situation" },
      );
    setSaving(false);
    setFeedback(
      error
        ? "Your progress could not be saved. Please try again."
        : "Progress saved to your account.",
    );
  }
  return (
    <>
      <PageTop
        eyebrow="A LITTLE PREPARATION. A BIG STEP FORWARD."
        title="Your document readiness checklist"
        description="Keep your next steps in one place. Choose where you live and your employment stage to create your preparation checklist."
      />
      <section className="section">
        <div className="site-container grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className="field-label">Host country</span>
                <select
                  className="field"
                  value={country}
                  onChange={(e) => setCountry(e.target.value as Country)}
                >
                  <option value=" ">Select your host country</option>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="field-label">Employment situation</span>
                <select
                  className="field"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                >
                  {situations.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            {country === " " ? (
              <div className="py-20 text-center">
                <FileCheck2 className="mx-auto mb-5 size-10 text-primary" />
                <h2 className="text-xl font-bold">Let's find your next steps.</h2>
                <p className="section-copy mt-3">
                  Select a country to see your preparation checklist.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Your preparation checklist</h2>
                  <span className="text-xs text-muted-foreground">
                    {rows.filter((r) => completed.includes(r.id)).length} of {rows.length} ready
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  General preparation suggestions, not a definitive list of legal requirements.
                  Confirm what applies with official sources.
                </p>
                {loading ? (
                  <p className="py-10">Loading your progress…</p>
                ) : (
                  rows.map((row) => (
                    <label className="document-row cursor-pointer" key={row.id}>
                      <Checkbox
                        className="mt-1"
                        checked={completed.includes(row.id)}
                        onCheckedChange={(checked) =>
                          setCompleted((old) =>
                            checked ? [...old, row.id] : old.filter((id) => id !== row.id),
                          )
                        }
                        aria-label={row.title}
                      />
                      <div>
                        <h3 className="text-sm font-semibold">{row.title}</h3>
                        <p className="section-copy mt-1 text-xs">{row.detail}</p>
                        <span
                          className={`mt-2 inline-block text-[10px] font-semibold ${completed.includes(row.id) ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {completed.includes(row.id) ? "READY" : "PENDING"}
                        </span>
                      </div>
                    </label>
                  ))
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {user ? (
                    <Button disabled={saving || loading} onClick={save}>
                      {saving ? "Saving…" : "Save progress"}
                      <FileCheck2 />
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to="/auth">
                        Sign in to save progress <ArrowRight />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCompleted([]);
                      setFeedback("Checklist cleared. Save to update your account.");
                    }}
                  >
                    <RotateCcw />
                    Reset
                  </Button>
                </div>
                <p role="status" className="mt-3 text-sm text-primary">
                  {feedback}
                </p>
              </>
            )}
          </div>
          <aside>
            <div className="border-b pb-7">
              <div className="feature-icon">
                <FileCheck2 />
              </div>
              <h2 className="text-lg font-bold">Preparation progress</h2>
              <div className="my-5 flex items-end gap-2">
                <span className="font-display text-5xl font-bold text-primary">{percent}%</span>
                <span className="mb-2 text-sm text-muted-foreground">of your checklist</span>
              </div>
              <div className="progress-track">
                <progress value={percent} max={100} aria-label="Document readiness progress" />
              </div>
              <p className="section-copy mt-4 text-xs">
                {percent === 100
                  ? "Your preparation checklist is complete. Confirm eligibility and next steps with a qualified adviser."
                  : "Every completed step brings more clarity to your journey."}
              </p>
            </div>
            <div className="notice mt-7">
              <ShieldCheck size={20} className="mb-2 text-primary" />
              Checking an item does not confirm legal eligibility or guarantee work authorization or
              approval. Never upload sensitive documents here.
            </div>
            {country !== " " && (
              <a
                className="card-link"
                href={officialSources[country].url}
                target="_blank"
                rel="noreferrer"
              >
                {officialSources[country].name}
                <ExternalLink size={15} />
              </a>
            )}
            <Link to="/legal-guidance" className="card-link flex">
              Have a question? Ask the assistant <ArrowRight size={15} />
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
