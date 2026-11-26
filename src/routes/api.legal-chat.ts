import { createFileRoute } from "@tanstack/react-router";
import { handleLegalChat } from "@/lib/legal-chat.server";
export const Route = createFileRoute("/api/legal-chat")({
  server: { handlers: { POST: ({ request }) => handleLegalChat(request) } },
});
