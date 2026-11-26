import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Scale, ShieldCheck, ExternalLink, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { countries, officialSources, type Country } from "@/lib/site";
export default function LegalAssistant() {
  const [country, setCountry] = useState<Country | "">("");
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/legal-chat",
        body: { country },
        fetch: async (url, init) => {
          const res = await fetch(url, init);
          if (!res.ok) {
            let message = "The guidance service is unavailable. Please try again later.";
            try {
              const body = (await res.json()) as { message?: string };
              message = body.message ?? message;
            } catch {}
            throw new Error(message);
          }
          return res;
        },
      }),
    [country],
  );
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: "legal-assistant",
    transport,
    onError: (e) => setErrorMessage(e.message),
    onFinish: ({ message }) => {
      if (!message.parts.some((p) => p.type === "text" && p.text.trim()))
        setErrorMessage(
          "No verified answer was returned. Please contact a qualified adviser or start a fresh request.",
        );
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);
  async function send(text: string) {
    if (!country || busy || !text.trim()) return;
    setErrorMessage("");
    setInput("");
    await sendMessage({ text: text.trim() });
    inputRef.current?.focus();
  }
  function changeCountry(value: string) {
    stop();
    setCountry(value as Country);
    setMessages([]);
    setErrorMessage("");
    setInput("");
  }
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.8fr_1fr]">
      <div className="chat-shell">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted px-5 py-4">
          <div className="flex items-center gap-3">
            <Scale className="text-primary" size={24} />
            <div>
              <h2 className="text-sm font-bold">Pathway Assistant</h2>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Official-source information · AI-powered
              </p>
            </div>
          </div>
          <Button
            title="Clear conversation"
            aria-label="Clear conversation"
            size="icon"
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setMessages([]);
              setErrorMessage("");
              inputRef.current?.focus();
            }}
          >
            <RotateCcw />
          </Button>
        </div>
        <div className="border-b px-5 py-4">
          <label>
            <span className="field-label">Your host country</span>
            <select
              className="field"
              value={country}
              disabled={busy}
              onChange={(e) => changeCountry(e.target.value)}
            >
              <option value="">Select your country to begin</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <Conversation className="chat-transcript">
          <ConversationContent className="gap-7 p-6">
            {messages.length === 0 && (
              <div className="py-7">
                <div className="feature-icon">
                  <Scale />
                </div>
                <h3 className="text-xl font-bold">A clearer path starts with a question.</h3>
                <p className="section-copy mt-3">
                  {country
                    ? `What would you like to know about working in ${country}?`
                    : "Choose your host country above. Then let’s explore your next steps."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Can I work with refugee status?",
                    "What documents should I prepare?",
                    "Where can I find legal support?",
                  ].map((q) => (
                    <Button
                      disabled={!country || busy}
                      onClick={() => send(q)}
                      key={q}
                      variant="outline"
                      size="sm"
                      className="h-auto whitespace-normal py-2 text-left text-xs"
                    >
                      {q}
                      <ArrowRight />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent data-role={message.role}>
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : part.type === "reasoning" ? (
                      <Reasoning
                        key={i}
                        defaultOpen={false}
                        isStreaming={part.state === "streaming"}
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <Shimmer>Checking guidance…</Shimmer>}
            {errorMessage && (
              <div role="alert" className="notice text-destructive">
                {errorMessage}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="border-t p-4">
          <PromptInput onSubmit={({ text }) => send(text)}>
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!country}
              maxLength={5000}
              autoFocus
              aria-label="Your legal guidance question"
              placeholder={
                country ? "Ask about your next step…" : "Select your host country first…"
              }
            />
            <PromptInputFooter>
              <span className="text-[10px] text-muted-foreground">
                Don't share sensitive personal details.
              </span>
              <PromptInputSubmit
                status={status}
                onStop={stop}
                disabled={!country || (!busy && !input.trim())}
              />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-3 text-center text-[10px] leading-5 text-muted-foreground">
            General information, not formal legal advice. Chat history is not saved.
          </p>
        </div>
      </div>
      <aside className="space-y-7">
        <div>
          <p className="eyebrow mb-4 text-primary">SUPPORT YOU CAN TRUST</p>
          <h2 className="text-xl font-bold">Information, not assumptions.</h2>
          <p className="section-copy mt-4">
            Answers draw from official material available for your country. If the information
            cannot be verified, the assistant will say so and point you toward qualified support.
          </p>
        </div>
        <div className="notice">
          <ShieldCheck className="mb-3 text-primary" />
          Your circumstances matter. Only the relevant authority or a qualified adviser can confirm
          your eligibility or give formal legal advice.
        </div>
        <div className="border-t pt-6">
          <h3 className="text-sm font-bold">Official sources & support</h3>
          {country && (
            <a
              href={officialSources[country].url}
              target="_blank"
              rel="noreferrer"
              className="card-link flex"
            >
              {officialSources[country].name}
              <ExternalLink size={14} />
            </a>
          )}
          <a
            href="https://help.unhcr.org/"
            target="_blank"
            rel="noreferrer"
            className="card-link flex"
          >
            UNHCR · Local help & services
            <ExternalLink size={14} />
          </a>
          <p className="section-copy mt-4 text-xs">
            Rules can change. Read the source and confirm how it applies to your situation before
            acting.
          </p>
        </div>
      </aside>
    </div>
  );
}
