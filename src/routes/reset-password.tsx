import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/site";
export const Route = createFileRoute("/reset-password")({
  head: () =>
    pageHead(
      "Reset your password",
      "Securely set a new password for your RefugeeWork Connect account.",
    ),
  component: Reset,
});
function Reset() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setValid(
      new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery" ||
        new URLSearchParams(window.location.search).get("type") === "recovery",
    );
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    setMessage(error ? error.message : "Your password has been updated.");
    setDone(!error);
  }
  return (
    <section className="section">
      <div className="site-container max-w-lg">
        <h1 className="page-title">Set a new password</h1>
        {!valid ? (
          <p className="notice">
            Open the secure recovery link from your email.{" "}
            <Link to="/auth" className="underline">
              Request a new link
            </Link>
            .
          </p>
        ) : done ? (
          <>
            <p role="status" className="notice">
              {message}
            </p>
            <Button className="mt-6" asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="field-label">New password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="field-label">Confirm new password</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="field"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            <Button type="submit" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </Button>
            <p role="status">{message}</p>
          </form>
        )}
      </div>
    </section>
  );
}
