import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage, type UIMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.ts";
export function createResponsesCall(
  request: Request,
  config: {
    baseURL: string;
    apiKey: string;
    model: string;
    onFailure?: (status: number, message: string) => Promise<void>;
  },
  messages: ModelMessage[],
  instructions?: string,
) {
  const gateway = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  let failure: { status: number; message: string } | undefined;
  let settle: () => void = () => {};
  const upstreamReady = new Promise<void>((resolve) => {
    settle = resolve;
  });
  const provider = createOpenAI({
    baseURL: config.baseURL,
    apiKey: config.apiKey,
    headers: { "Lovable-API-Key": config.apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      try {
        const response = await gateway.fetch(input, init);
        if (!response.ok) {
          let message = "The guidance service is temporarily unavailable. Please try again later.";
          try {
            const body = (await response.clone().json()) as {
              message?: string;
              error?: { message?: string };
            };
            message = body.message ?? body.error?.message ?? message;
          } catch {}
          failure = { status: response.status, message };
          await config.onFailure?.(response.status, message);
        }
        return response;
      } finally {
        settle();
      }
    },
  });
  const result = streamText({
    model: provider.responses(config.model),
    ...(instructions ? { instructions } : {}),
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return {
    result,
    response: async (originalMessages: UIMessage[]) => {
      const response = await withLovableAiGatewayRunIdHeader(
        result.toUIMessageStreamResponse({
          originalMessages,
          sendReasoning: true,
          onFinish: () => {},
          onError: () =>
            failure?.message ?? "The guidance request could not be completed. Please try again.",
        }),
        gateway,
      );
      await upstreamReady;
      if (failure) {
        await response.body?.cancel();
        return Response.json(
          { message: failure.message },
          { status: failure.status, headers: response.headers },
        );
      }
      return response;
    },
  };
}
