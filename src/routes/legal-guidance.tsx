import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { PageTop } from "@/components/site-shell";
import { pageHead } from "@/lib/site";
const LegalAssistant = lazy(() => import("@/components/legal-assistant"));
export const Route = createFileRoute("/legal-guidance")({
  head: () =>
    pageHead(
      "Legal guidance assistant",
      "Ask understandable questions about work permission, employment documentation, and support in your host country.",
    ),
  component: Legal,
});
function Legal() {
  return (
    <>
      <PageTop
        eyebrow="CLEAR INFORMATION. CONFIDENT NEXT STEPS."
        title="Your legal guidance assistant"
        description="Ask about work permission, documentation, employment rights, and where to find support. Start by choosing your host country."
      />
      <section className="section">
        <div className="site-container">
          <ClientOnly fallback={<p>Loading your assistant…</p>}>
            <Suspense fallback={<p>Loading your assistant…</p>}>
              <LegalAssistant />
            </Suspense>
          </ClientOnly>
        </div>
      </section>
    </>
  );
}
