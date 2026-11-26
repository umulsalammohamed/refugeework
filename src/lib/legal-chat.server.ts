import { convertToModelMessages, validateUIMessages, type UIMessage } from "ai";
import { officialSources, type Country } from "./site";
import { legalRequestSchema, legalSafetyRules } from "./legal-policy";
import { createResponsesCall } from "./ai/responses.ts";
async function sourceText(url: string) {
  try {
    const response = await fetch(url, { headers: { Accept: "text/html" } });
    if (!response.ok)
      return "SOURCE NOT AVAILABLE: no country-specific claims may be made from this source.";
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 22000);
  } catch {
    return "SOURCE NOT AVAILABLE: no country-specific claims may be made from this source.";
  }
}
export async function handleLegalChat(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { message: "This request must be made from RefugeeWork Connect." },
      { status: 403 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 160000)
      return Response.json(
        { message: "This conversation is too long. Start a new conversation to continue." },
        { status: 400 },
      );
    const parsed = legalRequestSchema.safeParse(JSON.parse(raw));
    if (!parsed.success)
      return Response.json(
        { message: "Select your host country and enter a question." },
        { status: 400 },
      );
    const country = parsed.data.country as Country;
    const messages = await validateUIMessages<UIMessage>({ messages: parsed.data.messages });
    const key = process.env["LOVABLE_API_KEY"];
    if (!key)
      return Response.json(
        { message: "The legal assistant is not configured yet." },
        { status: 401 },
      );
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: state, error: stateError } = await supabaseAdmin
      .from("ai_service_state")
      .select("*")
      .eq("id", "legal-assistant")
      .maybeSingle();
    if (stateError)
      return Response.json(
        { message: "The guidance service cannot check its availability. Please try again later." },
        { status: 503 },
      );
    if (state?.blocked_status)
      return Response.json(
        {
          message:
            state.blocked_message ??
            "The guidance service is paused. The app owner must restore access.",
        },
        { status: state.blocked_status },
      );
    const source = officialSources[country];
    const urls =
      country === "United Kingdom"
        ? [
            source.url,
            "https://www.gov.uk/government/publications/handling-applications-for-permission-to-take-employment-instruction/permission-to-work-and-volunteering-for-asylum-seekers-accessible",
          ]
        : [source.url];
    const texts = await Promise.all(
      urls.map(async (url) => `SOURCE URL: ${url}\nSOURCE TEXT: ${await sourceText(url)}`),
    );
    const instructions = `${legalSafetyRules}\nSelected host country: ${country}.\nOfficial sources retrieved for this request:\n${texts.join("\n\n")}`;
    const call = createResponsesCall(
      request,
      {
        baseURL: "https://ai.gateway.lovable.dev/v1",
        apiKey: key,
        model: "openai/gpt-6.1-sol",
        onFailure: async (status, message) => {
          if (status === 402 || status === 403) {
            const { error } = await supabaseAdmin
              .from("ai_service_state")
              .upsert({ id: "legal-assistant", blocked_status: status, blocked_message: message });
            if (error) console.error("Unable to persist guidance-service paused state");
          }
        },
      },
      await convertToModelMessages(messages),
      instructions,
    );
    return await call.response(messages);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      return new Response(null, { status: 499 });
    return Response.json(
      {
        message:
          "The guidance request could not be completed. Please check your question and try again.",
      },
      { status: 400 },
    );
  }
}
