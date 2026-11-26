import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { pageHead } from "@/lib/site";
import { useAccount } from "@/components/account-context";
export const Route = createFileRoute("/auth")({
  head: () =>
    pageHead(
      "Sign in",
      "Sign in to RefugeeWork Connect to save your profile and document preparation progress.",
    ),
  component: Auth,
});
function Auth() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAccount();
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } },
        });
        if (error) throw error;
        if (data.session) await navigate({ to: "/dashboard" });
        else setMessage("Check your email to confirm your account before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/dashboard" });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true);
    setMessage("");
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) setMessage(result.error.message);
    else if (!result.redirected) await navigate({ to: "/dashboard" });
    setBusy(false);
  }
  return (
    <section className="section">
      <div className="site-container grid items-start gap-14 lg:grid-cols-2">
        <div className="pt-7">
          <p className="eyebrow text-primary">YOUR NEXT CHAPTER STARTS HERE</p>
          <h1 className="page-title">Welcome to your pathway.</h1>
          <p className="section-copy max-w-md">
            Save your document preparation progress and pick up where you left off. Your skills,
            your pace, your next step.
          </p>
          <div className="notice mt-8 max-w-md">
            <ShieldCheck className="mb-3 text-primary" />
            We only ask for the essentials. Never share sensitive documents, case files, or banking
            details.
          </div>
        </div>
        <div className="rounded-lg border p-7 sm:p-9">
          {user ? (
            <>
              <h2 className="text-2xl font-bold">You're signed in.</h2>
              <Button asChild className="mt-6">
                <Link to="/dashboard">
                  Go to your dashboard
                  <ArrowRight />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">
                {mode === "signup"
                  ? "Create your account"
                  : mode === "forgot"
                    ? "Reset your password"
                    : "Good to see you."}
              </h2>
              <p className="section-copy mb-7 mt-2">
                {mode === "signup"
                  ? "A little clarity for your next chapter."
                  : mode === "forgot"
                    ? "We’ll email you a secure reset link."
                    : "Sign in to continue your journey."}
              </p>
              {mode !== "forgot" && (
                <div className="mb-6 space-y-3">
                  <Button
                    variant="outline"
                    className="h-11 w-full"
                    disabled={busy}
                    onClick={() => social("google")}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 w-full"
                    disabled={busy}
                    onClick={() => social("lovable")}
                  >
                    <LovableMark />
                    Continue with Lovable
                  </Button>
                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    or continue with email
                  </p>
                </div>
              )}
              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && (
                  <label className="block">
                    <span className="field-label">Display name (optional)</span>
                    <input
                      className="field"
                      autoComplete="nickname"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                )}
                <label className="block">
                  <span className="field-label">Email address</span>
                  <input
                    className="field"
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                {mode !== "forgot" && (
                  <label className="block">
                    <span className="field-label">Password</span>
                    <input
                      className="field"
                      type="password"
                      required
                      minLength={8}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                )}
                <Button type="submit" disabled={busy} className="h-11 w-full">
                  {busy
                    ? "Please wait…"
                    : mode === "signup"
                      ? "Create account"
                      : mode === "forgot"
                        ? "Send reset link"
                        : "Sign in"}
                  <ArrowRight />
                </Button>
              </form>
              <p role="status" className="mt-4 text-sm leading-6 text-primary">
                {message}
              </p>
              <div className="mt-4 flex flex-wrap justify-between gap-3">
                <Button
                  variant="link"
                  className="px-0 text-xs"
                  onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    setMessage("");
                  }}
                >
                  {mode === "signup"
                    ? "Already have an account? Sign in"
                    : "New here? Create an account"}
                </Button>
                <Button
                  variant="link"
                  className="px-0 text-xs"
                  onClick={() => {
                    setMode(mode === "forgot" ? "signin" : "forgot");
                    setMessage("");
                  }}
                >
                  {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
                </Button>
              </div>
              <p className="mt-5 text-[11px] leading-6 text-muted-foreground">
                By creating an account, you acknowledge our{" "}
                <Link to="/about" className="underline">
                  privacy and information policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
