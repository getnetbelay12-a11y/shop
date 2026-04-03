export const dynamic = "force-dynamic";

import { ConversationsClient } from "@/components/dashboard/conversations-client";
import { getSellerConversations } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function ConversationsPage() {
  const session = await requireUser();
  const conversations = (await getSellerConversations(session.user.id)) as unknown as Array<{
    _id: string;
    visitorName?: string;
    messages: Array<{ _id: string; role: string; content: string }>;
  }>;
  return <ConversationsClient initialConversations={conversations} />;
}
